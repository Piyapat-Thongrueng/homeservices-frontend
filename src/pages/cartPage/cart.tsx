/**
 * Cart Page (ตะกร้าสินค้า)
 *
 * Displays cart items from API. User can delete items or proceed to checkout.
 * Uses global CSS (headline-*, body-*, card-box, btn-primary, etc.).
 */

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { useAuth } from "@/contexts/AuthContext";
import {
  getCart,
  deleteCartItem,
  type CartItem,
} from "@/services/cartApi";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import CartItemCard from "@/features/cart/components/CartItemCard";
import CartHeader from "@/features/cart/components/CartHeader";
import UnauthenticatedCartLayout from "@/features/cart/components/UnauthenticatedCartLayout";

export default function CartPage() {
  const router = useRouter();
  const { state } = useAuth();
  const { t } = useTranslation("common");
  const authUserId = state.user?.auth_user_id ?? null;

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const pageSize = 3;
  const [currentPage, setCurrentPage] = useState(1);

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
          setCurrentPage(1);
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

  const totalPages = Math.max(1, Math.ceil(cartItems.length / pageSize));
  const pagedItems = cartItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    // Clamp currentPage when items are deleted.
    setCurrentPage((p) => Math.max(1, Math.min(p, totalPages)));
  }, [totalPages]);

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
            {pagedItems.map((item, index) => (
              <CartItemCard
                key={item.id}
                item={item}
                index={(currentPage - 1) * pageSize + index}
                deletingId={deletingId}
                onDelete={handleDelete}
                onCheckout={handleProceedToCheckout}
              />
            ))}

            {cartItems.length > 0 && totalPages > 1 && (
              <div className="flex items-center justify-center pt-4">
                <div className="flex items-center gap-1 bg-white border border-gray-100 rounded-xl px-3 py-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="px-2 py-1 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    aria-label="หน้าแรก"
                  >
                    {'<<'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-2 py-1 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    aria-label="หน้าก่อนหน้า"
                  >
                    {'<'}
                  </button>

                  {(() => {
                    const items: Array<number | 'ellipsis'> = [];
                    const first = 1;
                    const last = totalPages;
                    const windowSize = 1; // show currentPage +/- 1

                    const start = Math.max(first + 1, currentPage - windowSize);
                    const end = Math.min(last - 1, currentPage + windowSize);

                    items.push(first);
                    if (start > first + 1) items.push('ellipsis');
                    for (let p = start; p <= end; p += 1) items.push(p);
                    if (end < last - 1) items.push('ellipsis');
                    if (last !== first) items.push(last);

                    return (
                      <>
                        {items.map((it, idx) => (
                          <React.Fragment key={`${it}-${idx}`}>
                            {it === 'ellipsis' ? (
                              <span className="px-2 text-gray-400 select-none">...</span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setCurrentPage(it)}
                                className={`px-3 py-1 rounded-md cursor-pointer ${
                                  it === currentPage
                                    ? 'bg-blue-600 text-white'
                                    : 'hover:bg-gray-50 text-gray-700'
                                }`}
                                aria-label={`หน้า ${it}`}
                              >
                                {it}
                              </button>
                            )}
                          </React.Fragment>
                        ))}
                      </>
                    );
                  })()}

                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    aria-label="หน้าถัดไป"
                  >
                    {'>'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    aria-label="หน้าสุดท้าย"
                  >
                    {'>>'}
                  </button>
                </div>
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
