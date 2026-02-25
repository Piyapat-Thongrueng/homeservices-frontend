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

import type { ServiceItem } from "./types";
import { formatDateToThai, formatTimeToThai } from "@/utils/date-formatters";

interface ServiceInfo {
  date?: string;
  time?: string;
  address?: string;
  subDistrict?: string;
  district?: string;
  province?: string;
  additionalInfo?: string;
}

interface ServiceSummaryCardProps {
  /** Card title */
  title?: string;
  /** List of service items */
  items: ServiceItem[];
  /** Total price before discount */
  total: number;
  /** Service information (date, time, location, etc.) */
  serviceInfo?: ServiceInfo;
  /** Applied promotion code */
  promotionCode?: string;
  /** Discount amount */
  discount?: number;
}

const ServiceSummaryCard: React.FC<ServiceSummaryCardProps> = ({
  title = "สรุปรายการ",
  items,
  total,
  serviceInfo,
  promotionCode,
  discount = 0,
}) => {
  // Filter to only show items with quantity > 0
  const selectedItems = items.filter((item) => item.quantity > 0);
  
  // Calculate total quantity of selected items
  const totalQuantity = selectedItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // Calculate final total after discount
  const finalTotal = total - discount;

  return (
    <aside className="card-box bg-utility-white border border-gray-200 rounded-lg p-5 md:p-7">
      <h2 className="headline-3 text-gray-700 mb-4">{title}</h2>

      {selectedItems.length > 0 ? (
        <>
          {/* Service Items List */}
          <div className="space-y-3 mb-4">
            {selectedItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-2">
                <p className="body-3 text-utility-black">
                  {item.description}
                </p>
                <p className="body-2 text-gray-900 whitespace-nowrap">
                  {item.quantity} รายการ
                </p>
              </div>
            ))}
          </div>
          
          {/* Separator Line - only show if there's serviceInfo */}
          {serviceInfo && (
            <div className="border-t border-gray-300 my-4" />
          )}
          
          {/* Service Info */}
          {serviceInfo && (
            <>
              <div className="space-y-2 mb-4">
                {serviceInfo.date && (
                  <div className="flex items-start gap-2">
                    <span className="body-2 text-gray-600 min-w-[60px]">วันที่:</span>
                    <span className="body-2 text-gray-900 text-right flex-1">{formatDateToThai(serviceInfo.date)}</span>
                  </div>
                )}
                {serviceInfo.time && (
                  <div className="flex items-start gap-2">
                    <span className="body-2 text-gray-600 min-w-[60px]">เวลา:</span>
                    <span className="body-2 text-gray-900 text-right flex-1">{formatTimeToThai(serviceInfo.time)}</span>
                  </div>
                )}
                {(serviceInfo.address || serviceInfo.subDistrict || serviceInfo.district || serviceInfo.province) && (
                  <div className="flex items-start justify-between gap-4">
                    <span className="body-2 text-gray-600 whitespace-nowrap">สถานที่:</span>
                    <span 
                      className="body-2 text-gray-900 text-right flex-1"
                      style={{
                        wordBreak: 'break-word',
                        overflowWrap: 'anywhere',
                        maxWidth: '30ch',
                        lineHeight: '1.5',
                        minWidth: 0,
                        overflow: 'hidden'
                      }}
                    >
                      {[serviceInfo.address, serviceInfo.subDistrict, serviceInfo.district, serviceInfo.province]
                        .filter(Boolean)
                        .join(" ")}
                    </span>
                  </div>
                )}
                {serviceInfo.additionalInfo && (
                  <div className="flex items-start justify-between gap-4">
                    <span className="body-2 text-gray-600 whitespace-nowrap">หมายเหตุ:</span>
                    <span 
                      className="body-2 text-gray-900 text-right flex-1"
                      style={{
                        wordBreak: 'break-word',
                        overflowWrap: 'anywhere',
                        maxWidth: '30ch',
                        lineHeight: '1.5',
                        minWidth: 0,
                        overflow: 'hidden'
                      }}
                    >
                      {serviceInfo.additionalInfo}
                    </span>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Promotion Code */}
          {promotionCode && discount > 0 && (
            <div className="mb-2">
              <div className="flex items-center justify-between">
                <span className="body-2 text-gray-600">Promotion Code:</span>
                <span className="body-2 text-red-500">-{discount.toFixed(2)} ฿</span>
              </div>
            </div>
          )}

          {/* Separator Line */}
          <div className="border-t border-gray-300 my-4" />

          {/* Total */}
          <div className="flex items-center justify-between">
            <span className="body-2 text-gray-700">รวม</span>
            <span className="headline-5 font-medium text-black">
              {finalTotal.toFixed(2)} ฿
            </span>
          </div>
        </>
      ) : (
        <div className="border-t border-gray-300 pt-4">
          <div className="flex items-center justify-between">
            <span className="body-2 text-gray-700">รวม</span>
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

