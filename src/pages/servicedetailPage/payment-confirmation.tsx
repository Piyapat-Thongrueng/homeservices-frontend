/**
 * PaymentConfirmation Page
 *
 * The final step in the service booking flow that displays
 * a confirmation message after successful payment.
 *
 * When arriving from Stripe (session_id in query), fetches order from backend.
 * Otherwise falls back to query params (items, serviceInfo, total).
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Check } from "lucide-react";
import Navbar from "@/components/common/Navbar";
import type { ServiceItem } from "@/features/servicedetail/types";
import { formatDateLocale, formatTimeLocale } from "@/utils/date-formatters";
import {
  parseServiceItemsFromQuery,
  parseServiceInfoFromQuery,
} from "@/utils/router-helpers";
import { getCheckoutSession } from "@/services/paymentApi";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function PaymentConfirmation() {
  const router = useRouter();
  const { locale } = router;
  const { t } = useTranslation("common");
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);
  const [serviceInfo, setServiceInfo] = useState<any>(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * When session_id is present (Stripe redirect), fetch order from backend.
   * Otherwise load from query params.
   */
  useEffect(() => {
    const sessionId =
      typeof router.query.session_id === "string"
        ? router.query.session_id
        : router.query.session_id?.[0];

    if (sessionId) {
      getCheckoutSession(sessionId)
        .then((data) => {
          const order = data.order;
          setServiceItems(
            order.items.map((it) => ({
              id: it.serviceId,
              description: it.name,
              unit: "",
              price: it.price,
              quantity: it.quantity,
            })),
          );
          setTotal(order.netPrice);

          // Also hydrate service info from query parameters (sent from payment page)
          const queryServiceInfo = parseServiceInfoFromQuery(
            router.query.serviceInfo,
          );
          if (queryServiceInfo) setServiceInfo(queryServiceInfo);

          setLoading(false);
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : t("payment_confirm.error_load"));
          setLoading(false);
        });
      return;
    }

    // Fallback: load from query (e.g. direct visit or old flow)
    const queryItems = parseServiceItemsFromQuery(router.query.items);
    if (queryItems.length > 0) setServiceItems(queryItems);

    const queryServiceInfo = parseServiceInfoFromQuery(
      router.query.serviceInfo,
    );
    if (queryServiceInfo) setServiceInfo(queryServiceInfo);

    if (router.query.total) {
      setTotal(parseFloat(router.query.total as string));
    }
    setLoading(false);
  }, [router.query, router.query.session_id, t]);

  /**
   * Calculate total quantity of selected items
   */
  const totalQuantity = serviceItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  const subTotal = serviceItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const promotionCode =
    typeof router.query.promotionCode === "string"
      ? router.query.promotionCode.trim()
      : Array.isArray(router.query.promotionCode)
        ? String(router.query.promotionCode[0] ?? "").trim()
        : "";
  const discountFromQuery = Number(
    typeof router.query.discount === "string"
      ? router.query.discount
      : Array.isArray(router.query.discount)
        ? router.query.discount[0]
        : "0",
  );
  const appliedDiscount =
    Number.isFinite(discountFromQuery) && discountFromQuery > 0
      ? discountFromQuery
      : Math.max(0, subTotal - total);

  /**
   * Format address like ServiceSummaryCard:
   * - If savedAddressLine exists on serviceInfo (saved address), use it directly
   * - Otherwise combine address + subDistrict + district + province + postalCode
   */
  const formatAddress = () => {
    if (!serviceInfo) return "";
    if (serviceInfo.savedAddressLine) {
      return serviceInfo.savedAddressLine as string;
    }
    return [
      serviceInfo.address,
      serviceInfo.subDistrict,
      serviceInfo.district,
      serviceInfo.province,
      serviceInfo.postalCode,
    ]
      .filter(Boolean)
      .join(" ");
  };

  /**
   * Inline styles for text wrapping in address and notes fields
   */
  const textWrapStyle = {
    wordBreak: "normal" as const,
    overflowWrap: "break-word" as const,
    whiteSpace: "normal" as const,
    maxWidth: "30ch",
    lineHeight: "1.5",
    minWidth: 0,
    overflow: "hidden" as const,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-utility-bg font-prompt pb-32">
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 md:px-8 pb-10 pt-8 flex justify-center items-center min-h-[40vh]">
          <p className="body-2 text-gray-600">{t("payment_confirm.loading")}</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-utility-bg font-prompt pb-32">
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 md:px-8 pb-10 pt-8">
          <div className="card-box bg-utility-white border border-gray-200 rounded-lg p-8 text-center">
            <p className="body-2 text-red-600 mb-4">{error}</p>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="btn-primary px-6 py-2"
            >
              {t("payment_confirm.btn_home")}
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-utility-bg font-prompt pb-32">
      <Navbar />

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 md:px-8 pb-10 pt-8">
        <div className="card-box bg-utility-white border border-gray-200 rounded-lg p-8 md:p-12 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 rounded-full bg-teal-500 flex items-center justify-center mx-auto mb-6">
            <Check className="w-12 h-12 text-white" />
          </div>

          {/* Confirmation Message */}
          <h1 className="headline-1 text-gray-900 mb-8">{t("payment_confirm.success")}</h1>

          {/* Service Details */}
          <div className="border-t border-gray-300 pt-4 space-y-3"></div>
          <div className="text-left space-y-4 mb-6">
            {/* Service Item Description and Quantity */}
            {serviceItems.length > 0 ? (
              <div className="space-y-2">
                {serviceItems.map((item) => (
                  <div
                    key={`${item.id}-${item.description}`}
                    className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3"
                  >
                    <p className="body-2 text-gray-700 truncate">• {item.description}</p>
                    <p className="body-2 text-gray-600 whitespace-nowrap text-center min-w-[92px]">
                      {item.quantity} {t("payment_confirm.items")}
                    </p>
                    <p className="body-2 text-gray-700 whitespace-nowrap text-right min-w-[90px]">
                      {(item.price * item.quantity).toFixed(2)} ฿
                    </p>
                  </div>
                ))}
                {promotionCode && appliedDiscount > 0 && (
                  <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center">
                    <p className="body-3 text-red-600 truncate">
                      • Promotion Code: {promotionCode}
                    </p>
                    <p className="body-2 text-red-600 whitespace-nowrap text-right min-w-[90px]">
                      - {appliedDiscount.toFixed(2)} ฿
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <p className="body-2 text-gray-700 flex-1">
                  {t("payment_confirm.default_service")}
                </p>
                <p className="body-2 text-gray-600 whitespace-nowrap">
                  {totalQuantity} {t("payment_confirm.items")}
                </p>
              </div>
            )}

            {/* Service Information Details */}
            <div className="border-t border-gray-300 pt-4 space-y-3">
              {/* Date */}
              {serviceInfo?.date && (
                <div className="flex items-start justify-between gap-4">
                  <span className="body-2 text-gray-600">{t("payment_confirm.date")}</span>
                  <span className="body-2 text-gray-900 text-right">
                    {formatDateLocale(serviceInfo.date, locale)}
                  </span>
                </div>
              )}

              {/* Time */}
              {serviceInfo?.time && (
                <div className="flex items-start justify-between gap-4">
                  <span className="body-2 text-gray-600">{t("payment_confirm.time")}</span>
                  <span className="body-2 text-gray-900 text-right">
                    {formatTimeLocale(serviceInfo.time, locale)}
                  </span>
                </div>
              )}

              {/* Location */}
              {(serviceInfo?.savedAddressLine ||
                serviceInfo?.address ||
                serviceInfo?.subDistrict ||
                serviceInfo?.district ||
                serviceInfo?.province) && (
                <div className="flex items-start justify-between gap-4">
                  <span className="body-2 text-gray-600 whitespace-nowrap">
                    {t("payment_confirm.location")}
                  </span>
                  <span
                    className="body-2 text-gray-900 text-right flex-1"
                    style={textWrapStyle}
                  >
                    {formatAddress()}
                  </span>
                </div>
              )}

              {/* Additional Info */}
              {serviceInfo?.additionalInfo && (
                <div className="flex items-start justify-between gap-4">
                  <span className="body-2 text-gray-600 whitespace-nowrap">
                    {t("payment_confirm.note")}
                  </span>
                  <span
                    className="body-2 text-gray-900 text-right flex-1"
                    style={textWrapStyle}
                  >
                    {serviceInfo.additionalInfo}
                  </span>
                </div>
              )}
            </div>

            {/* Total Amount */}
            <div className="border-t border-gray-300 pt-4">
              <div className="flex items-center justify-between">
                <span className="body-2 text-gray-700">{t("payment_confirm.total")}</span>
                <span className="headline-4 font-medium text-gray-900">
                  {total.toFixed(2)} ฿
                </span>
              </div>
            </div>
          </div>

          {/* Action Button - Navigate to Home */}
          <button
            type="button"
            onClick={() => router.push("/profile?tab=orders")}
            className="btn-primary w-full px-8 py-3 mt-6"
          >
            {t("payment_confirm.btn_check_order")}
          </button>
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};
