/**
 * Cart Page (ตะกร้าสินค้า)
 *
 * Displays cart items from API. User can delete items or proceed to checkout.
 * Uses global CSS (headline-*, body-*, card-box, btn-primary, etc.).
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { formatDateLocale, formatTimeLocale } from "@/utils/date-formatters";
import { ShoppingCart, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getCart,
  deleteCartItem,
  type CartItem,
} from "@/services/cartApi";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

/** Backend may return time as "HH:MM:SS"; normalize to "HH:MM" for formatTimeLocale */
function normalizeTime(time: string | null | undefined): string {
  if (!time) return "";
  const part = String(time).trim();
  const match = part.match(/^(\d{1,2}):(\d{2})/);
  return match ? `${match[1]}:${match[2]}` : part;
}

interface CartItemCardProps {
  item: CartItem;
  index: number;
  deletingId: number | null;
  onDelete: (id: number) => void;
  onCheckout: (item: CartItem) => void;
}

function CartItemCard({
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
                    {formatTimeLocale(normalizeTime(item.appointmentTime), locale)}
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

function CartHeader() {
  const { t } = useTranslation("common");
  return (
    <header className="w-full bg-blue-600 py-4 md:py-5">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <h1 className="headline-2 text-utility-white text-center flex items-center justify-center gap-2">
          <ShoppingCart className="w-10 h-8" /> {t("cart.heading")}
        </h1>
      </div>
    </header>
  );
}

function UnauthenticatedCartLayout() {
  const { t } = useTranslation("common");
  return (
    <div className="min-h-screen bg-utility-bg font-prompt flex flex-col">
      <Navbar />
      <header className="w-full bg-blue-600 py-4 md:py-5">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <h1 className="headline-2 text-utility-white text-center">
            {t("cart.heading")}
          </h1>
        </div>
      </header>
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8 flex items-center justify-center">
        <p className="body-2 text-gray-600">{t("cart.login_required")}</p>
      </main>
      <Footer />
    </div>
  );
}

export default function CartPage() {
  const router = useRouter();
  const { state } = useAuth();
  const { t } = useTranslation("common");
  const authUserId = state.user?.auth_user_id ?? null;

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    if (!authUserId) {
      setLoading(false);
      setCartItems([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    getCart(authUserId)
      .then((res) => {
        if (!cancelled) {
          const items = res.cartItems ?? [];
          setCartItems(items);
          setVisibleCount(items.length > 3 ? 3 : items.length);
        }
      })
      .catch((err) => {
        if (!cancelled)
          setError(
            err instanceof Error ? err.message : t("cart.error_load"),
          );
        setCartItems([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [authUserId, t]);

  const handleProceedToCheckout = (item: CartItem) => {
    router.push({
      pathname: "/servicedetailPage/payment",
      query: {
        serviceId: item.serviceId,
        cartItemId: item.id,
      },
    });
  };

  const handleDelete = async (cartItemId: number) => {
    if (!authUserId) return;
    setDeletingId(cartItemId);
    try {
      await deleteCartItem(cartItemId, authUserId);
      setCartItems((prev) => {
        const next = prev.filter((c) => c.id !== cartItemId);
        setVisibleCount((current) =>
          next.length <= 3 ? next.length : Math.min(current, next.length),
        );
        return next;
      });
    } catch (err) {
      console.error("Delete cart item error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  if (!authUserId) {
    return <UnauthenticatedCartLayout />;
  }

  return (
    <div className="min-h-screen bg-utility-bg font-prompt flex flex-col">
      <Navbar />

      <CartHeader />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {loading ? (
          <div className="flex justify-center py-12">
            <p className="body-2 text-gray-600">{t("cart.loading")}</p>
          </div>
        ) : error ? (
          <div className="flex justify-center py-12">
            <p className="body-2 text-red-600">{error}</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="body-2 text-gray-600 mb-4">{t("cart.empty")}</p>
            <button
              type="button"
              onClick={() => router.push("/service-lists")}
              className="btn-primary"
            >
              {t("cart.btn_browse")}
            </button>
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {cartItems.slice(0, visibleCount).map((item, index) => (
              <CartItemCard
                key={item.id}
                item={item}
                index={index}
                deletingId={deletingId}
                onDelete={handleDelete}
                onCheckout={handleProceedToCheckout}
              />
            ))}
            {visibleCount < cartItems.length && (
              <div className="flex justify-center pt-4">
                <button
                  type="button"
                  onClick={() =>
                    setVisibleCount((prev) =>
                      Math.min(prev + 3, cartItems.length),
                    )
                  }
                  className="btn-secondary px-6 py-2 w-full"
                >
                  {t("cart.btn_load_more")}
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
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
