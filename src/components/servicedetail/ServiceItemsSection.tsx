/**
 * ServiceItemsSection Component
 * 
 * Displays a list of service items with quantity selectors.
 * Each item shows description, price, and +/- buttons to adjust quantity.
 * 
 * Features:
 * - Service item list with descriptions and prices
 * - Quantity increment/decrement controls
 * - Disabled state for decrement when quantity is 0
 * - Visual feedback for selected items
 */

import { Minus, Plus, Tag } from "lucide-react";
import type { ServiceItem } from "./types";

interface ServiceItemsSectionProps {
  /** List of service items to display */
  items: ServiceItem[];
  /** Callback when quantity changes (id, delta) */
  onChangeQuantity: (id: number, delta: number) => void;
  /** Optional service name to show in heading (from API) */
  serviceName?: string;
}

const ServiceItemsSection: React.FC<ServiceItemsSectionProps> = ({
  items,
  onChangeQuantity,
  serviceName,
}) => {
  const headingText = serviceName
    ? `เลือกรายการบริการ ${serviceName}`
    : "เลือกรายการบริการ";

  return (
    <section className="card-box bg-utility-white p-5 md:p-8">
      <h2 className="headline-3 text-gray-700 mb-8">{headingText}</h2>
      <div className="space-y-5">
        {items.map((item) => (
          <div
            key={item.id}
            className="border-b border-gray-300 pb-8 last:border-b-0"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <p className="headline-4 text-gray-900 mb-1">
                  {item.description}
                </p>
                <p className="body-3 text-gray-600 flex items-center gap-3">
                  <Tag className="w-4 h-4" />
                  <span>{item.price.toFixed(2)} ฿ / {item.unit}</span>
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => onChangeQuantity(item.id, -1)}
                  disabled={item.quantity === 0}
                  className="w-11 h-11 rounded-lg border border-blue-600 flex items-center justify-center hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  <Minus className="w-4 h-4 text-blue-600" />
                </button>
                <span className="w-10 text-center headline-5 text-gray-900">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => onChangeQuantity(item.id, 1)}
                  className="w-11 h-11 rounded-lg border border-blue-600 flex items-center justify-center hover:bg-blue-50 cursor-pointer transition-colors"
                >
                  <Plus className="w-4 h-4 text-blue-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServiceItemsSection;

