import React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { ShoppingCart, Trash2 } from "lucide-react";
import { formatDateLocale, formatTimeLocale } from "@/utils/date-formatters";
import type { CartItem } from "@/services/cart/cartApi";

/** Backend may return time as "HH:MM:SS"; normalize to "HH:MM" for formatTimeLocale */
function normalizeTime(time: string | null | undefined): string {
  if (!time) return "";
  const part = String(time).trim();
  const match = part.match(/^(\d{1,2}):(\d{2})/);
  return match ? `${match[1]}:${match[2]}` : part;
}

type CartItemCardProps = {
  item: CartItem;
  index: number;
  deletingId: number | null;
  onDelete: (id: number) => void;
  onCheckout: (item: CartItem) => void;
};

export default function CartItemCard({
  item,
  index,
  deletingId,
  onDelete,
  onCheckout,
}: CartItemCardProps) {
  const { t } = useTranslation("common");
  const { locale } = useRouter();

  return (
    <div
      className="card-box bg-utility-white shadow rounded-lg overflow-hidden animate__animated animate__fadeInUp"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex flex-col md:flex-row">
        <div className="relative w-full md:w-80 shrink-0 aspect-4/3 md:aspect-auto md:min-h-[280px] bg-gray-200">
          <img
            src={item.serviceImage || "/servicedetail_bg_img.svg"}
            alt={item.serviceName}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 p-5 flex flex-col">
          <div className="flex items-start justify-between gap-4 pb-2">
            <div>
              <h2 className="headline-2 text-blue-500">{item.serviceName}</h2>
              <p className="body-3 text-gray-600 mt-1">{t("cart.summary")}</p>
            </div>
            <p className="headline-5 text-gray-900 whitespace-nowrap">
              {t("cart.total_amount")}{" "}
              {item.total.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}{" "}
              ฿
            </p>
          </div>
          <div className="border-t border-gray-300 pt-4" />
          <ul className="space-y-2 mb-4">
            {item.details.map((d) => (
              <li
                key={d.id}
                className="flex items-center justify-between gap-2 body-3 text-gray-800"
              >
                <span>
                  • {d.name}
                  {d.quantity > 1 ? ` x${d.quantity}` : ""}
                </span>
                <span className="body-2 text-gray-900 whitespace-nowrap">
                  {(d.pricePerUnit * d.quantity).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}{" "}
                  ฿
                </span>
              </li>
            ))}
          </ul>
          <div className="border-t border-gray-300 pt-4 mt-auto flex items-center justify-between gap-4">
            <div className="flex items-center flex-wrap gap-x-3 gap-y-1 body-2">
              {item.appointmentDate && (
                <>
                  <span className="text-gray-600">{t("cart.date")}</span>
                  <span className="text-gray-900">
                    {formatDateLocale(item.appointmentDate, locale)}
                  </span>
                </>
              )}
              {item.appointmentTime && (
                <>
                  <span className="text-gray-600">{t("cart.time")}</span>
                  <span className="text-gray-900">
                    {formatTimeLocale(
                      normalizeTime(item.appointmentTime),
                      locale,
                    )}
                  </span>
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => onDelete(item.id)}
                disabled={deletingId === item.id}
                className="btn-secondary inline-flex items-center gap-2 text-red-600 border-red-300 hover:border-red-400 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onCheckout(item)}
                className="btn-primary inline-flex items-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                {t("cart.btn_checkout")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

