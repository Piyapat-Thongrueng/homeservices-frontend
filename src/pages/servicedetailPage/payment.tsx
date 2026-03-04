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
import axios from "axios";
import Navbar from "@/components/common/Navbar";
import ServiceHero from "@/components/servicedetail/ServiceHero";
import ServiceSummaryCard from "@/components/servicedetail/ServiceSummaryCard";
import ServiceFooterNav from "@/components/servicedetail/ServiceFooterNav";
import PaymentMethodSelector from "@/components/servicedetail/PaymentMethodSelector";
import CreditCardForm from "@/components/servicedetail/CreditCardForm";
import PromotionCodeInput from "@/components/servicedetail/PromotionCodeInput";
import type { ServiceItem } from "@/components/servicedetail/types";
import type { Service } from "@/types/serviceListTypes/type";
import {
  PAYMENT_DATA_STORAGE_KEY,
  SERVICE_ITEMS_STORAGE_KEY,
  SERVICE_INFO_STORAGE_KEY,
  VALID_PROMOTION_CODES,
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
   * For PromptPay: no validation needed
   * For Credit Card: all fields must be filled
   */
  const isFormValid = !!(
    paymentData.method === "promptpay" ||
    (paymentData.cardNumber &&
      paymentData.cardName &&
      paymentData.expiryDate &&
      paymentData.cvv)
  );

  /**
   * Navigate to payment confirmation page
   */
  const handleNext = () => {
    if (isFormValid) {
      router.push({
        pathname: "/servicedetailPage/payment-confirmation",
        query: {
          items: router.query.items,
          serviceInfo: router.query.serviceInfo,
          paymentData: JSON.stringify(paymentData),
          total: finalTotal.toString(),
          serviceId: router.query.serviceId,
        },
      });
    }
  };

  /**
   * Handle removing the applied promotion code
   */
  const handleRemovePromotionCode = () => {
    updatePaymentField("promotionCode", ""); // ล้างข้อความในช่องกรอก
    setDiscount(0);                          // รีเซ็ตส่วนลดกลับเป็น 0
    setPromotionError("");                   // ล้างข้อความ Error (ถ้ามี)
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
  const handleApplyPromotionCode = (code: string) => {
    const trimmedCode = code.trim().toUpperCase();

    if (!trimmedCode) {
      setPromotionError("กรุณากรอกโค้ดส่วนลด");
      setDiscount(0);
      return;
    }

    // Check if code is valid
    if (VALID_PROMOTION_CODES[trimmedCode]) {
      setDiscount(VALID_PROMOTION_CODES[trimmedCode]);
      setPromotionError("");
    } else {
      setDiscount(0);
      setPromotionError("โค้ดส่วนลดไม่ถูกต้องหรือหมดอายุแล้ว");
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

              {/* Credit Card Fields - Only show if credit card is selected */}
              {paymentData.method === "creditcard" && (
                <CreditCardForm
                  cardNumber={paymentData.cardNumber}
                  cardName={paymentData.cardName}
                  expiryDate={paymentData.expiryDate}
                  cvv={paymentData.cvv}
                  onCardNumberChange={(value) =>
                    updatePaymentField("cardNumber", value)
                  }
                  onCardNameChange={(value) =>
                    updatePaymentField("cardName", value)
                  }
                  onExpiryDateChange={(value) =>
                    updatePaymentField("expiryDate", value)
                  }
                  onCvvChange={(value) => updatePaymentField("cvv", value)}
                />
              )}

              {/* Promotion Code Input */}
              <PromotionCodeInput
                value={paymentData.promotionCode}
                discount={discount}
                error={promotionError}
                onValueChange={handlePromotionCodeChange}
                onApply={handleApplyPromotionCode}
                onRemove={handleRemovePromotionCode} // เพิ่มบรรทัดนี้เข้าไป
              />
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
        canProceed={isFormValid}
        onBack={handleBack}
        onNext={handleNext}
        nextText="ยืนยันการชำระเงิน"
      />
    </div>
  );
}
