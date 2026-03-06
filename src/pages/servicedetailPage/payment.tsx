/**
 * Payment Page
 * 
 * The third step in the service booking flow where users enter
 * payment information and apply promotion codes.
 * 
 * Features:
 * - Payment method selection (PromptPay or Credit Card)
 * - Credit card form with auto-formatting
 * - Promotion code input with validation
 * - Real-time discount calculation
 * - Form validation
 * - LocalStorage persistence
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/common/Navbar";
import ServiceHero from "@/components/servicedetail/ServiceHero";
import ServiceSummaryCard from "@/components/servicedetail/ServiceSummaryCard";
import ServiceFooterNav from "@/components/servicedetail/ServiceFooterNav";
import PaymentMethodSelector from "@/components/servicedetail/PaymentMethodSelector";
import PromotionCodeInput from "@/components/servicedetail/PromotionCodeInput";
import type { ServiceItem } from "@/components/servicedetail/types";
import type { Service } from "@/types/serviceListTypes/type";
import {
  PAYMENT_DATA_STORAGE_KEY,
  SERVICE_ITEMS_STORAGE_KEY,
  SERVICE_INFO_STORAGE_KEY,
} from "@/constants/service-constants";
import {
  getFromLocalStorage,
  saveToLocalStorage,
  getServiceScopedKey,
} from "@/utils/localStorage-helpers";
import {
  parseServiceItemsFromQuery,
  parseServiceInfoFromQuery,
} from "@/utils/router-helpers";
import { fetchServices } from "@/services/serviceListsApi/serviceApi";
import {
  createCheckoutSession,
  validatePromotionCode,
} from "@/services/paymentApi";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Payment data structure
 */
interface PaymentData {
  method: "promptpay" | "creditcard";
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  promotionCode: string;
}

/**
 * Default payment data
 */
const defaultPaymentData: PaymentData = {
  method: "creditcard",
  cardNumber: "",
  cardName: "",
  expiryDate: "",
  cvv: "",
  promotionCode: "",
};

export default function Payment() {
  const router = useRouter();
  const { user } = useAuth();
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);
  const [serviceInfo, setServiceInfo] = useState<any>(null);
  const [discount, setDiscount] = useState(0);
  const [promotionError, setPromotionError] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string>("");
  const [promotionId, setPromotionId] = useState<number | null>(null);

  /**
   * Initialize payment data with defaults to prevent hydration mismatch
   * Will be updated from localStorage on client side after mount
   */
  const [paymentData, setPaymentData] = useState<PaymentData>(defaultPaymentData);

  /**
   * Load payment data from localStorage on client side only (after mount)
   * This prevents hydration mismatch between server and client
   * Scoped by serviceId so each service has its own payment data
   */
  useEffect(() => {
    if (!router.isReady) return;

    setIsMounted(true);
    const paymentKey = getServiceScopedKey(
      PAYMENT_DATA_STORAGE_KEY,
      router.query.serviceId,
      user?.id,
    );

    const saved = getFromLocalStorage<PaymentData>(paymentKey);
    if (saved) {
      setPaymentData({
        ...saved,
        promotionCode: "", // Reset promotion code
      });
    }
  }, [router.isReady, router.query.serviceId, user?.id]);

  /**
   * Load service items and service info from router query or localStorage
   * Scoped by serviceId so each service has its own data
   */
  useEffect(() => {
    if (!router.isReady) return;

    const itemsKey = getServiceScopedKey(
      SERVICE_ITEMS_STORAGE_KEY,
      router.query.serviceId,
      user?.id,
    );
    const serviceInfoKey = getServiceScopedKey(
      SERVICE_INFO_STORAGE_KEY,
      router.query.serviceId,
      user?.id,
    );

    // Load service items
    const queryItems = parseServiceItemsFromQuery(router.query.items);
    if (queryItems.length > 0) {
      setServiceItems(queryItems);
      saveToLocalStorage(itemsKey, queryItems);
    } else {
      const savedItems =
        getFromLocalStorage<ServiceItem[]>(itemsKey);
      if (savedItems) {
        setServiceItems(savedItems);
      }
    }

    // Load service info
    const queryServiceInfo = parseServiceInfoFromQuery(router.query.serviceInfo);
    if (queryServiceInfo) {
      setServiceInfo(queryServiceInfo);
      saveToLocalStorage(serviceInfoKey, queryServiceInfo);
    } else {
      const savedInfo = getFromLocalStorage(serviceInfoKey);
      if (savedInfo) {
        setServiceInfo(savedInfo);
      }
    }
  }, [router.isReady, router.query, user?.id]);

  /**
   * Load selected service data from API using serviceId in query
   */
  useEffect(() => {
    const { serviceId } = router.query;
    if (!serviceId) return;

    const idString = Array.isArray(serviceId) ? serviceId[0] : serviceId;
    const id = parseInt(idString, 10);
    if (Number.isNaN(id)) return;

    let isSubscribed = true;

    const loadService = async () => {
      try {
        const services = await fetchServices({});
        if (!isSubscribed) return;

        const service = services.find((item) => item.id === id) ?? null;
        setSelectedService(service);
      } catch (error) {
        console.error("Error loading service detail (payment):", error);
      }
    };

    loadService();

    return () => {
      isSubscribed = false;
    };
  }, [router.query.serviceId]);

  /**
   * Save payment data to localStorage whenever it changes (only after mount)
   * Note: promotionCode is not saved to localStorage
   * Scoped by serviceId so each service has its own payment data
   */
  useEffect(() => {
    if (!isMounted || !router.isReady) return;

    const paymentKey = getServiceScopedKey(
      PAYMENT_DATA_STORAGE_KEY,
      router.query.serviceId,
      user?.id,
    );

    const dataToSave = {
      ...paymentData,
      promotionCode: "", // Don't save promotionCode
    };
    saveToLocalStorage(paymentKey, dataToSave);
  }, [paymentData, isMounted, router.isReady, router.query.serviceId, user?.id]);

  /**
   * Calculate total price from selected service items
   */
  const total = serviceItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  /**
   * Calculate final total after discount
   */
  const finalTotal = total - discount;

  /**
   * Validate payment form
   * Card details are collected on Stripe's hosted page,
   * so we don't require local credit card inputs here anymore.
   */
  const isFormValid = true;

  /**
   * Create Stripe Checkout session and redirect to Stripe, or show error
   */
  const handleNext = async () => {
    if (!isFormValid) return;
    if (!user?.id) {
      setCheckoutError("กรุณาเข้าสู่ระบบก่อนชำระเงิน");
      return;
    }

    setCheckoutError("");
    setIsSubmitting(true);

    try {
      const serviceId =
        typeof router.query.serviceId === "string"
          ? parseInt(router.query.serviceId, 10)
          : Number(router.query.serviceId?.[0]);
      if (Number.isNaN(serviceId)) {
        setCheckoutError("ไม่พบรหัสบริการ");
        return;
      }

      const baseUrl =
        typeof window !== "undefined"
          ? window.location.origin
          : process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

      // Base success URL for Stripe (must keep {CHECKOUT_SESSION_ID} literal)
      const successUrlBase = `${baseUrl}/servicedetailPage/payment-confirmation?session_id={CHECKOUT_SESSION_ID}`;

      // Additional params encoded separately
      const successExtraParams = new URLSearchParams();
      successExtraParams.set("items", JSON.stringify(serviceItems));
      if (serviceInfo) {
        successExtraParams.set("serviceInfo", JSON.stringify(serviceInfo));
      }
      successExtraParams.set("total", String(finalTotal));

      const successUrl =
        successExtraParams.toString().length > 0
          ? `${successUrlBase}&${successExtraParams.toString()}`
          : successUrlBase;

      // Ensure all query parameters are properly percent-encoded
      const cancelParams = new URLSearchParams();
      cancelParams.set("serviceId", String(serviceId));

      if (router.query.items) {
        const itemsValue = Array.isArray(router.query.items)
          ? router.query.items[0]
          : router.query.items;
        cancelParams.set("items", itemsValue);
      }

      if (router.query.serviceInfo) {
        const serviceInfoValue = Array.isArray(router.query.serviceInfo)
          ? router.query.serviceInfo[0]
          : router.query.serviceInfo;
        cancelParams.set("serviceInfo", serviceInfoValue);
      }

      const cancelUrl = `${baseUrl}/servicedetailPage/payment?${cancelParams.toString()}`;

      const addressLine = serviceInfo
        ? [
            serviceInfo.address,
            serviceInfo.subDistrict,
            serviceInfo.district,
            serviceInfo.province,
            serviceInfo.postalCode,
          ]
            .filter(Boolean)
            .join(" ")
        : "";

      const { url } = await createCheckoutSession({
        authUserId: user.id,
        promotionId: promotionId ?? undefined,
        paymentType: paymentData.method === "promptpay" ? "QR" : "CR",
        address: addressLine
          ? {
              address_line: addressLine,
              province: serviceInfo?.province,
              city: serviceInfo?.district,
              postal_code: serviceInfo?.postalCode,
            }
          : undefined,
        items: serviceItems.map((item) => ({
          serviceId,
          name: item.description,
          quantity: item.quantity,
          price: item.price,
        })),
        discountAmount: discount,
        successUrl,
        cancelUrl,
      });

      if (url) {
        window.location.href = url;
        return;
      }

      setCheckoutError("ไม่สามารถสร้างหน้าชำระเงินได้");
    } catch (err) {
      setCheckoutError(
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการชำระเงิน"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Navigate back to previous page
   */
  const handleBack = () => {
    router.back();
  };

  /**
   * Update a specific field in payment data
   */
  const updatePaymentField = <K extends keyof PaymentData>(
    field: K,
    value: PaymentData[K]
  ) => {
    setPaymentData((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Handle promotion code application
   * Validates the code and applies discount if valid
   */
  const handleApplyPromotionCode = async (code: string) => {
    const trimmedCode = code.trim().toUpperCase();

    if (!trimmedCode) {
      setPromotionError("กรุณากรอกโค้ดส่วนลด");
      setDiscount(0);
      return;
    }

    try {
      const result = await validatePromotionCode(trimmedCode);
      if (!result.valid || !result.discountPercent) {
        setPromotionId(null);
        setDiscount(0);
        setPromotionError(
          result.message ?? "โค้ดส่วนลดไม่ถูกต้องหรือหมดอายุแล้ว"
        );
        return;
      }

      // discountPercent from DB is percentage of current total
      const discountAmount = Math.round(
        (total * result.discountPercent) / 100
      );
      setPromotionId(result.promotionId ?? null);
      setDiscount(discountAmount);
      setPromotionError("");
    } catch (err) {
      console.error("Error validating promotion code:", err);
      setPromotionId(null);
      setDiscount(0);
      setPromotionError("ไม่สามารถตรวจสอบโค้ดส่วนลดได้");
    }
  };

  /**
   * Handle promotion code input change
   * Clears error when user starts typing
   */
  const handlePromotionCodeChange = (value: string) => {
    updatePaymentField("promotionCode", value);
    setPromotionError(""); // Clear error when typing
  };

  /**
   * Reset promotion code state back to initial when user clicks "เปลี่ยนโค้ด"
   */
  const handleResetPromotionCode = () => {
    updatePaymentField("promotionCode", "");
    setPromotionId(null);
    setDiscount(0);
    setPromotionError("");
  };

  return (
    <div className="min-h-screen bg-utility-bg font-prompt pb-32">
      <Navbar />
      <ServiceHero
        serviceName={selectedService?.name ?? ""}
        currentStep={3}
        imageUrl={selectedService?.image}
      />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)] gap-6 lg:gap-8">
          {/* Left Panel - Payment Details */}
          <section className="card-box bg-utility-white p-5 md:p-8">
            <h2 className="headline-3 text-gray-700 mb-6">ชำระเงิน</h2>

            <div className="space-y-6">
              {/* Payment Method Selection */}
              <PaymentMethodSelector
                method={paymentData.method}
                onChange={(method) => updatePaymentField("method", method)}
              />

              {/* Promotion Code Input */}
              <PromotionCodeInput
                value={paymentData.promotionCode}
                discount={discount}
                error={promotionError}
                onValueChange={handlePromotionCodeChange}
                onApply={handleApplyPromotionCode}
                onReset={handleResetPromotionCode}
              />

              {/* Checkout error from API */}
              {checkoutError && (
                <p className="body-2 text-red-600">{checkoutError}</p>
              )}
            </div>
          </section>

          {/* Right Panel - Summary */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ServiceSummaryCard
              items={serviceItems}
              total={total}
              serviceInfo={serviceInfo}
              promotionCode={paymentData.promotionCode}
              discount={discount}
            />
          </div>
        </div>
      </main>

      <ServiceFooterNav
        canProceed={isFormValid && !isSubmitting}
        onBack={handleBack}
        onNext={handleNext}
        nextText={isSubmitting ? "กำลังดำเนินการ..." : "ยืนยันการชำระเงิน"}
      />
    </div>
  );
}
