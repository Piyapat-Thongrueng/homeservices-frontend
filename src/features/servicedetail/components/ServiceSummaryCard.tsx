/**
 * ServiceSummaryCard Component
 *
 * Displays a summary of selected service items, service information,
 * and total price. Used as a sidebar component on service detail pages.
 *
 * Features:
 * - Lists selected service items with quantities
 * - Displays service information (date, time, location, notes)
 * - Shows promotion code discount if applicable
 * - Calculates and displays final total
 */

import type { ServiceItem } from "../types";
import { formatDateLocale, formatTimeLocale } from "@/utils/date-formatters";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

interface ServiceInfo {
  date?: string;
  time?: string;
  address?: string;
  subDistrict?: string;
  district?: string;
  province?: string;
  postalCode?: string;
  additionalInfo?: string;
}

interface ServiceSummaryCardProps {
  title?: string;
  items: ServiceItem[];
  total: number;
  serviceInfo?: ServiceInfo;
  savedAddressLine?: string;
  promotionCode?: string;
  discount?: number;
}

const ServiceSummaryCard: React.FC<ServiceSummaryCardProps> = ({
  title,
  items,
  total,
  serviceInfo,
  savedAddressLine,
  promotionCode,
  discount = 0,
}) => {
  const { t } = useTranslation("common");
  const { locale } = useRouter();

  const selectedItems = items.filter((item) => item.quantity > 0);
  const finalTotal = total - discount;

  const locationLine =
    savedAddressLine ||
    (serviceInfo
      ? [
          serviceInfo.address,
          serviceInfo.subDistrict,
          serviceInfo.district,
          serviceInfo.province,
          serviceInfo.postalCode,
        ]
          .filter(Boolean)
          .join(" ")
      : "");

  const displayTitle = title || t("service_detail.summary_title");

  return (
    <aside className="card-box bg-utility-white border border-gray-200 rounded-lg p-5 md:p-7">
      <h2 className="headline-3 text-gray-700 mb-4">{displayTitle}</h2>

      {selectedItems.length > 0 ? (
        <>
          <div className="space-y-3 mb-4">
            {selectedItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-2"
              >
                <p className="body-3 text-utility-black">{item.description}</p>
                <p className="body-2 text-gray-900 whitespace-nowrap">
                  {item.quantity} {t("service_detail.items_unit")}
                </p>
              </div>
            ))}
          </div>

          {serviceInfo && <div className="border-t border-gray-300 my-4" />}

          {serviceInfo && (
            <div className="space-y-2 mb-4">
              {serviceInfo.date && (
                <div className="flex items-start gap-2">
                  <span className="body-2 text-gray-600 min-w-[60px]">
                    {t("service_detail.summary_date")}
                  </span>
                  <span className="body-2 text-gray-900 text-right flex-1">
                    {formatDateLocale(serviceInfo.date, locale)}
                  </span>
                </div>
              )}
              {serviceInfo.time && (
                <div className="flex items-start gap-2">
                  <span className="body-2 text-gray-600 min-w-[60px]">
                    {t("service_detail.summary_time")}
                  </span>
                  <span className="body-2 text-gray-900 text-right flex-1">
                    {formatTimeLocale(serviceInfo.time, locale)}
                  </span>
                </div>
              )}
              {(locationLine ||
                serviceInfo.address ||
                serviceInfo.subDistrict ||
                serviceInfo.district ||
                serviceInfo.province ||
                serviceInfo.postalCode) && (
                <div className="flex items-start justify-between gap-4">
                  <span className="body-2 text-gray-600 whitespace-nowrap">
                    {t("service_detail.summary_location")}
                  </span>
                  <span
                    className="body-2 text-gray-900 text-right flex-1"
                    style={{
                      wordBreak: "break-word",
                      overflowWrap: "anywhere",
                      maxWidth: "30ch",
                      lineHeight: "1.5",
                      minWidth: 0,
                      overflow: "hidden",
                    }}
                  >
                    {locationLine}
                  </span>
                </div>
              )}
              {serviceInfo.additionalInfo && (
                <div className="flex items-start justify-between gap-4">
                  <span className="body-2 text-gray-600 whitespace-nowrap">
                    {t("service_detail.summary_note")}
                  </span>
                  <span
                    className="body-2 text-gray-900 text-right flex-1"
                    style={{
                      wordBreak: "break-word",
                      overflowWrap: "anywhere",
                      maxWidth: "30ch",
                      lineHeight: "1.5",
                      minWidth: 0,
                      overflow: "hidden",
                    }}
                  >
                    {serviceInfo.additionalInfo}
                  </span>
                </div>
              )}
            </div>
          )}

          {promotionCode && discount > 0 && (
            <div className="mb-2">
              <div className="flex items-center justify-between">
                <span className="body-2 text-gray-600">Promotion Code:</span>
                <span className="body-2 text-red-500">
                  -{discount.toFixed(2)} ฿
                </span>
              </div>
            </div>
          )}

          <div className="border-t border-gray-300 my-4" />

          <div className="flex items-center justify-between">
            <span className="body-2 text-gray-700">{t("service_detail.summary_total")}</span>
            <span className="headline-5 font-medium text-black">
              {finalTotal.toFixed(2)} ฿
            </span>
          </div>
        </>
      ) : (
        <div className="border-t border-gray-300 pt-4">
          <div className="flex items-center justify-between">
            <span className="body-2 text-gray-700">{t("service_detail.summary_total")}</span>
            <span className="headline-5 font-medium text-black">
              {total.toFixed(2)} ฿
            </span>
          </div>
        </div>
      )}
    </aside>
  );
};

export default ServiceSummaryCard;
