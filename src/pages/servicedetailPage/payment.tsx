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

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import {
  Elements,
  useStripe,
  useElements,
  CardNumberElement,
} from "@stripe/react-stripe-js";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import Navbar from "@/components/common/Navbar";
import ServiceHero from "@/components/servicedetail/ServiceHero";
import ServiceSummaryCard from "@/components/servicedetail/ServiceSummaryCard";
import ServiceFooterNav from "@/components/servicedetail/ServiceFooterNav";
import PaymentMethodSelector from "@/components/servicedetail/PaymentMethodSelector";
import PromotionCodeInput from "@/components/servicedetail/PromotionCodeInput";
import CreditCardForm from "@/components/servicedetail/CreditCardForm";
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
  createPaymentIntent,
  createPromptPayIntent,
  markPaymentIntentPaid,
  validatePromotionCode,
  getStripeConfig,
  type CreatePaymentIntentParams,
} from "@/services/paymentApi";
import { useAuth } from "@/contexts/AuthContext";

/** When serviceInfo has addressId, pass only addressId so backend reuses row (no duplicate insert). */
function buildIntentAddressParams(
  serviceInfo: any,
): Pick<CreatePaymentIntentParams, "addressId" | "address"> {
  const id = serviceInfo?.addressId;
  if (id != null && Number.isFinite(Number(id))) {
    return { addressId: Number(id) };
  }
  // For "กรอกที่อยู่ใหม่" keep old behavior: store combined address line.
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
        .trim()
    : "";
  if (!addressLine) return {};

  return {
    address: {
      address_line: addressLine,
      province: serviceInfo?.province,
      district: serviceInfo?.district,
      subdistrict: serviceInfo?.subDistrict,
      postal_code: serviceInfo?.postalCode,
      ...(serviceInfo?.latitude != null &&
      serviceInfo?.longitude != null &&
      Number.isFinite(serviceInfo.latitude) &&
      Number.isFinite(serviceInfo.longitude)
        ? {
            latitude: Number(serviceInfo.latitude),
            longitude: Number(serviceInfo.longitude),
          }
        : {}),
    },
  };
}

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
  const { state } = useAuth();
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);
  const [serviceInfo, setServiceInfo] = useState<any>(null);
  const [discount, setDiscount] = useState(0);
  const [promotionError, setPromotionError] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string>("");
  const [promotionId, setPromotionId] = useState<number | null>(null);
  const [stripePublishableKey, setStripePublishableKey] = useState<
    string | null
  >(null);

  /**
   * Initialize payment data with defaults to prevent hydration mismatch
   * Will be updated from localStorage on client side after mount
   */
  const [paymentData, setPaymentData] =
    useState<PaymentData>(defaultPaymentData);

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
      state.user?.auth_user_id,
    );

    const saved = getFromLocalStorage<PaymentData>(paymentKey);
    if (saved) {
      setPaymentData({
        ...saved,
        promotionCode: "", // Reset promotion code
      });
    }
  }, [router.isReady, router.query.serviceId, state.user?.auth_user_id]);

  /**
   * Load Stripe publishable key from backend config (for Elements)
   */
  useEffect(() => {
    getStripeConfig()
      .then((cfg) => {
        setStripePublishableKey(cfg.publishableKey);
      })
      .catch((err) => {
        console.error("Failed to load Stripe config:", err);
        setCheckoutError("ไม่สามารถโหลดการตั้งค่าการชำระเงินได้");
      });
  }, []);

  /**
   * Load service items and service info from router query or localStorage
   * Scoped by serviceId so each service has its own data
   */
  useEffect(() => {
    if (!router.isReady) return;

    const itemsKey = getServiceScopedKey(
      SERVICE_ITEMS_STORAGE_KEY,
      router.query.serviceId,
      state.user?.auth_user_id,
    );
    const serviceInfoKey = getServiceScopedKey(
      SERVICE_INFO_STORAGE_KEY,
      router.query.serviceId,
      state.user?.auth_user_id,
    );

    // Load service items
    const queryItems = parseServiceItemsFromQuery(router.query.items);
    if (queryItems.length > 0) {
      setServiceItems(queryItems);
      saveToLocalStorage(itemsKey, queryItems);
    } else {
      const savedItems = getFromLocalStorage<ServiceItem[]>(itemsKey);
      if (savedItems) {
        setServiceItems(savedItems);
      }
    }

    // Load service info
    const queryServiceInfo = parseServiceInfoFromQuery(
      router.query.serviceInfo,
    );
    if (queryServiceInfo) {
      setServiceInfo(queryServiceInfo);
      saveToLocalStorage(serviceInfoKey, queryServiceInfo);
    } else {
      const savedInfo = getFromLocalStorage(serviceInfoKey);
      if (savedInfo) {
        setServiceInfo(savedInfo);
      }
    }
  }, [router.isReady, router.query, state.user?.id]);

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
      state.user?.auth_user_id,
    );

    const dataToSave = {
      ...paymentData,
      promotionCode: "", // Don't save promotionCode
    };
    saveToLocalStorage(paymentKey, dataToSave);
  }, [
    paymentData,
    isMounted,
    router.isReady,
    router.query.serviceId,
    state.user?.auth_user_id,
  ]);

  /**
   * Calculate total price from selected service items
   */
  const total = serviceItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  /**
   * Ensure we have at least one item to pay for
   */
  const hasItems = serviceItems.length > 0;

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
   * Create PromptPay PaymentIntent and show Stripe’s QR modal on the frontend (no URL redirect).
   */
  const handleNextPromptPay = async () => {
    if (!isFormValid || !state.user?.auth_user_id) {
      setCheckoutError("กรุณาเข้าสู่ระบบก่อนชำระเงิน");
      return;
    }
    if (!hasItems) {
      setCheckoutError(
        "ไม่พบรายการบริการที่ต้องชำระ กรุณากลับไปเลือกบริการอีกครั้ง",
      );
      return;
    }
    if (!stripePublishableKey) {
      setCheckoutError("ระบบชำระเงินยังไม่พร้อม กรุณารีเฟรชหน้า");
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
        setIsSubmitting(false);
        return;
      }

      const { clientSecret, orderId: intentOrderId } =
        await createPromptPayIntent({
          authUserId: state.user.auth_user_id,
          promotionId: promotionId ?? undefined,
          ...buildIntentAddressParams(serviceInfo),
          items: serviceItems.map((item) => ({
            serviceId,
            name: item.description,
            quantity: item.quantity,
            price: item.price,
          })),
          discountAmount: discount,
          appointmentDate: serviceInfo?.date || undefined,
          appointmentTime: serviceInfo?.time || undefined,
          remark: serviceInfo?.additionalInfo || undefined,
        });

      const stripeInstance = await getStripePromise(stripePublishableKey);
      if (!stripeInstance) {
        setCheckoutError("ไม่สามารถโหลด Stripe ได้");
        setIsSubmitting(false);
        return;
      }

      const { error, paymentIntent } =
        await stripeInstance.confirmPromptPayPayment(clientSecret, {
          payment_method: {
            billing_details: {
              email: state.user.email ?? "customer@example.com",
            },
          },
        });

      if (error) {
        setCheckoutError(error.message ?? "การชำระเงินล้มเหลว");
        setIsSubmitting(false);
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        try {
          await markPaymentIntentPaid({
            authUserId: state.user.auth_user_id,
            orderId: intentOrderId,
          });
        } catch (err) {
          console.error("Failed to mark order as paid:", err);
        }
        const query: Record<string, string> = {
          items: JSON.stringify(serviceItems),
          total: String(finalTotal),
          orderId: String(intentOrderId),
        };
        if (serviceInfo) query.serviceInfo = JSON.stringify(serviceInfo);
        router.push({
          pathname: "/servicedetailPage/payment-confirmation",
          query,
        });
      } else {
        setCheckoutError("การชำระเงินยังไม่สำเร็จ");
      }
    } catch (err) {
      setCheckoutError(
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการชำระเงิน",
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
    value: PaymentData[K],
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
      const discountValue = result.discountValue ?? 0;
      if (!result.valid || (result.discountType && discountValue <= 0)) {
        setPromotionId(null);
        setDiscount(0);
        setPromotionError(
          result.message ?? "โค้ดส่วนลดไม่ถูกต้องหรือหมดอายุแล้ว",
        );
        return;
      }

      // percentage: discount_value is % of total. fixed: discount_value is THB (capped by total)
      const discountAmount =
        result.discountType === "fixed"
          ? Math.min(Math.round(discountValue), total)
          : Math.round((total * discountValue) / 100);
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

  const mainContent = (
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

            {/* Credit Card Form - only when card selected AND inside Stripe Elements */}
            {paymentData.method === "creditcard" &&
              stripePublishableKey &&
              state.user?.auth_user_id && <CreditCardForm />}

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
  );

  return (
    <div className="min-h-screen bg-utility-bg font-prompt pb-32">
      <Navbar />
      <ServiceHero
        serviceName={selectedService?.name ?? ""}
        currentStep={3}
        imageUrl={selectedService?.image}
      />
      {paymentData.method === "promptpay" ? (
        <>
          {mainContent}
          <ServiceFooterNav
            canProceed={isFormValid && !isSubmitting && hasItems}
            onBack={handleBack}
            onNext={handleNextPromptPay}
            nextText={isSubmitting ? "กำลังดำเนินการ..." : "ยืนยันการชำระเงิน"}
          />
        </>
      ) : stripePublishableKey && state.user?.auth_user_id ? (
        <Elements stripe={getStripePromise(stripePublishableKey)}>
          <>
            {mainContent}
            <StripeFooterInner
              canProceed={isFormValid && !isSubmitting}
              isSubmitting={isSubmitting}
              onBack={handleBack}
              onCreatePaymentIntent={async () => {
                const serviceIdRaw = router.query.serviceId;
                const serviceIdValue =
                  typeof serviceIdRaw === "string"
                    ? serviceIdRaw
                    : serviceIdRaw?.[0];
                const serviceId = serviceIdValue
                  ? parseInt(serviceIdValue, 10)
                  : NaN;
                if (Number.isNaN(serviceId)) {
                  throw new Error("ไม่พบรหัสบริการ");
                }
                return createPaymentIntent({
                  authUserId: state.user!.auth_user_id,
                  promotionId: promotionId ?? undefined,
                  ...buildIntentAddressParams(serviceInfo),
                  items: serviceItems.map((item) => ({
                    serviceId,
                    name: item.description,
                    quantity: item.quantity,
                    price: item.price,
                  })),
                  discountAmount: discount,
                  appointmentDate: serviceInfo?.date || undefined,
                  appointmentTime: serviceInfo?.time || undefined,
                  remark: serviceInfo?.additionalInfo || undefined,
                });
              }}
              onSuccess={async (intentOrderId: number) => {
                try {
                  await markPaymentIntentPaid({
                    authUserId: state.user!.auth_user_id,
                    orderId: intentOrderId,
                  });
                } catch (err) {
                  console.error("Failed to mark order as paid:", err);
                }
                const query: Record<string, string> = {
                  items: JSON.stringify(serviceItems),
                  total: String(finalTotal),
                  orderId: String(intentOrderId),
                };
                if (serviceInfo) {
                  query.serviceInfo = JSON.stringify(serviceInfo);
                }
                router.push({
                  pathname: "/servicedetailPage/payment-confirmation",
                  query,
                });
              }}
              setCheckoutError={setCheckoutError}
              setIsSubmitting={setIsSubmitting}
            />
          </>
        </Elements>
      ) : (
        // Fallback: show content with no active Stripe Elements (e.g. config not loaded yet)
        <>{mainContent}</>
      )}
    </div>
  );
}

interface StripeElementsFooterProps {
  clientSecret: string;
  publishableKey: string;
  canProceed: boolean;
  isSubmitting: boolean;
  onBack: () => void;
  onSuccess: () => void;
  setCheckoutError: (msg: string) => void;
  setIsSubmitting: (value: boolean) => void;
}

const stripePromiseCache: { [key: string]: Promise<Stripe | null> } = {};

function getStripePromise(publishableKey: string) {
  if (!stripePromiseCache[publishableKey]) {
    stripePromiseCache[publishableKey] = loadStripe(publishableKey);
  }
  return stripePromiseCache[publishableKey];
}

const StripeElementsFooter: React.FC<StripeElementsFooterProps> = () => null;

interface StripeFooterInnerProps {
  canProceed: boolean;
  isSubmitting: boolean;
  onBack: () => void;
  onCreatePaymentIntent: () => Promise<{
    clientSecret: string;
    orderId: number;
  }>;
  onSuccess: (orderId: number) => void | Promise<void>;
  setCheckoutError: (msg: string) => void;
  setIsSubmitting: (value: boolean) => void;
}

const StripeFooterInner: React.FC<StripeFooterInnerProps> = ({
  canProceed,
  isSubmitting,
  onBack,
  onCreatePaymentIntent,
  onSuccess,
  setCheckoutError,
  setIsSubmitting,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleNext = async () => {
    if (!canProceed) {
      return;
    }
    if (!stripe || !elements) {
      setCheckoutError("ระบบชำระเงินยังไม่พร้อมใช้งาน");
      return;
    }
    const cardNumberElement = elements.getElement(CardNumberElement);
    if (!cardNumberElement) {
      setCheckoutError("ไม่พบฟอร์มบัตรเครดิต");
      return;
    }

    setCheckoutError("");
    setIsSubmitting(true);
    try {
      const { clientSecret, orderId } = await onCreatePaymentIntent();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumberElement,
        },
      });

      if (result.error) {
        setCheckoutError(result.error.message ?? "การชำระเงินล้มเหลว");
        return;
      }

      if (result.paymentIntent?.status === "succeeded") {
        await onSuccess(orderId);
      } else {
        setCheckoutError("การชำระเงินยังไม่สำเร็จ");
      }
    } catch (err) {
      setCheckoutError(
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการชำระเงิน",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ServiceFooterNav
      canProceed={canProceed}
      onBack={onBack}
      onNext={handleNext}
      nextText={isSubmitting ? "กำลังดำเนินการ..." : "ยืนยันการชำระเงิน"}
    />
  );
};
