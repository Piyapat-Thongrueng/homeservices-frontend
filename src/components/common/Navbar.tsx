import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { ShoppingCart, Bell, Globe } from "lucide-react";
import { getCart } from "@/services/cartApi";
import { useNotification } from "@/hooks/useNotification";
import { useTranslation } from "next-i18next";

export default function Navbar() {
  const router = useRouter();
  const { pathname, asPath, query, locale } = router;
  const { t } = useTranslation("common");
  const { state, isAuthenticated, logout } = useAuth();

  const [open, setOpen] = useState<boolean>(false);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const [cartCount, setCartCount] = useState<number>(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const { notifications, unreadCount, markAllAsRead } = useNotification(
    state.user?.id || null,
  );

  // ← ปิด dropdown เมื่อคลิกข้างนอก
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!notifRef.current?.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const user = state.user;
  const userName = user?.full_name || user?.username || "User";
  const userEmail = user?.email || "";
  const userInitial = userName.charAt(0).toUpperCase();

  // Load cart count for badge when user is logged in
  useEffect(() => {
    if (!user?.auth_user_id) {
      setCartCount(0);
      return;
    }
    let cancelled = false;
    getCart(user.auth_user_id)
      .then((res) => {
        if (cancelled) return;
        // Show count of distinct cart entries (cards), not total service quantities
        const count = res.cartItems?.length ?? 0;
        setCartCount(count);
      })
      .catch(() => {
        if (!cancelled) setCartCount(0);
      });
    return () => {
      cancelled = true;
    };
    // Re-fetch when route changes so count stays in sync after leaving cart page
  }, [user?.auth_user_id, router.pathname]);

  // ← เปิด modal แทนการ logout ทันที
  const handleLogoutClick = (): void => {
    setOpen(false);
    setShowLogoutModal(true);
  };

  // ← กดยืนยัน ให้ทำการ logout จริง ๆ
  const handleLogoutConfirm = (): void => {
    setShowLogoutModal(false);
    logout();
  };

  // ← กดยกเลิก ให้ปิด modal โดยไม่ทำอะไร
  const handleLogoutCancel = (): void => {
    setShowLogoutModal(false);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("th-TH", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getNotifIcon = (type: string) => {
    if (type === "order_accepted") return "🔧";
    if (type === "order_completed") return "✅";
    return "🔔";
  };

  const toggleLanguage = () => {
    const nextLocale = locale === "th" ? "en" : "th";
    router.push({ pathname, query }, asPath, { locale: nextLocale });
  };

  return (
    <>
      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-85 sm:max-w-100 bg-white rounded-[12px] px-6 py-8 sm:px-8 sm:py-10 flex flex-col items-center text-center shadow-xl">
            {/* Icon */}
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-red-100 flex items-center justify-center mb-5">
              <svg
                className="w-8 h-8 sm:w-9.5 sm:h-9.5 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </div>

            <h2 className="text-[18px] sm:text-[20px] font-semibold text-[#101828] mb-2">
              {t("logout")}
            </h2>
            <p className="text-[13px] sm:text-[14px] text-[#667085] mb-8">
              {locale === "en"
                ? "Are you sure you want to logout?"
                : "คุณยืนยันที่จะออกจากระบบใช่หรือไม่?"}
            </p>

            {/* ปุ่ม */}
            <div className="flex gap-3 w-full">
              <button
                onClick={handleLogoutCancel}
                className="flex-1 h-11 text-[14px] font-medium border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
              >
                {locale === "en" ? "Cancel" : "ยกเลิก"}
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="flex-1 h-11 text-[14px] font-medium bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors cursor-pointer"
              >
                {locale === "en" ? "Confirm" : "ยืนยัน"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="bg-white shadow-sm border-b border-gray-100 z-40">
        <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-16 lg:px-24">
          <div className="flex items-center justify-between h-16">
            {/* LEFT */}
            <div className="flex items-center gap-4 sm:gap-8 md:gap-12">
              <img
                src="/web-logo.svg"
                alt="HomeServices Logo"
                className="h-7 w-auto sm:h-9 cursor-pointer"
                onClick={() => router.push("/")}
              />
              <Link
                href="/service-lists"
                className="text-[14px] sm:text-[15px] font-medium text-black hover:text-blue-600 transition-colors whitespace-nowrap"
              >
                {t("navbar.services")}
              </Link>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-3 relative">
              {/* LANGUAGE SWITCHER */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-2 py-1.5 text-gray-600 hover:text-blue-600 transition-colors text-[13px] sm:text-[14px] font-medium cursor-pointer"
                title={locale === "th" ? "Switch to English" : "เปลี่ยนเป็นภาษาไทย"}
              >
                <Globe className="w-4 h-4" />
                <span>{locale === "th" ? "EN" : "TH"}</span>
              </button>

              <span className="w-px h-5 bg-gray-200" aria-hidden />

              {state.getUserLoading ? null : isAuthenticated && user ? (
                <>
                  {/* ✅ NOTIFICATION BELL */}
                  <div ref={notifRef} className="relative">
                    <button
                      onClick={() => {
                        setNotifOpen(!notifOpen);
                        if (!notifOpen && unreadCount > 0) {
                          markAllAsRead();
                        }
                      }}
                      className="relative p-2 text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
                      {/* Badge จำนวนที่ยังไม่อ่าน */}
                      {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center leading-none">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                      )}
                    </button>

                    {/* Notification Dropdown */}
                    {notifOpen && (
                      <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden">
                        {/* Header */}
                        <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
                          <span className="text-[14px] font-semibold text-gray-800">
                            การแจ้งเตือน
                          </span>
                          {unreadCount > 0 && (
                            <span className="text-[12px] text-blue-600">
                              ยังไม่อ่าน {unreadCount} รายการ
                            </span>
                          )}
                        </div>

                        {/* List */}
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="px-4 py-8 text-center text-gray-400 text-[13px]">
                              ไม่มีการแจ้งเตือน
                            </div>
                          ) : (
                            notifications.map((notif) => (
                              <div
                                key={notif.id}
                                className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                                  !notif.is_read ? "bg-blue-50" : ""
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  {/* Icon */}
                                  <span className="text-[18px] shrink-0 mt-0.5">
                                    {getNotifIcon(notif.type)}
                                  </span>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[13px] text-gray-800 leading-relaxed">
                                      {notif.message}
                                    </p>
                                    <p className="text-[11px] text-gray-400 mt-1">
                                      {formatDate(notif.created_at)}
                                    </p>
                                  </div>
                                  {/* Unread dot */}
                                  {!notif.is_read && (
                                    <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* PROFILE DROPDOWN */}
                  <div ref={dropdownRef} className="relative">
                    <button
                      onClick={() => setOpen(!open)}
                      className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold shrink-0 overflow-hidden">
                        {user?.profile_pic ? (
                          <img src={user.profile_pic} alt={userName} className="w-full h-full object-cover" />
                        ) : (
                          userInitial
                        )}
                      </div>
                      <span className="hidden sm:block text-[14px] font-medium text-gray-700 hover:text-blue-500 max-w-30 truncate">
                        {userName}
                      </span>
                    </button>

                    {open && (
                      <div className="absolute right-0 mt-2 w-55 sm:w-60 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden z-50">
                        <div className="px-4 py-3 border-b bg-gray-50">
                          <div className="text-[14px] font-semibold text-gray-800 truncate">
                            {userName}
                          </div>
                          <div className="text-[12px] text-gray-500 truncate">
                            {userEmail}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setOpen(false);
                            router.push("/profile");
                          }}
                          className="w-full px-4 py-3 text-[14px] text-gray-700 hover:bg-gray-100 text-left cursor-pointer flex items-center gap-2"
                        >
                          👤 {t("navbar.profile")}
                        </button>

                        <button
                          onClick={() => {
                            setOpen(false);
                            router.push("/reset-password");
                          }}
                          className="w-full px-4 py-3 text-[14px] text-gray-700 hover:bg-gray-100 text-left cursor-pointer flex items-center gap-2"
                        >
                          🔒 {t("navbar.change_password")}
                        </button>

                        <button
                          onClick={() => {
                            setOpen(false);
                            router.push("/profile?tab=orders");
                          }}
                          className="w-full px-4 py-3 text-[14px] text-gray-700 hover:bg-gray-100 text-left cursor-pointer flex items-center gap-2"
                        >
                          🔧 {t("navbar.orders")}
                        </button>

                        <button
                          onClick={() => {
                            setOpen(false);
                            router.push("/profile?tab=history");
                          }}
                          className="w-full px-4 py-3 text-[14px] text-gray-700 hover:bg-gray-100 text-left cursor-pointer flex items-center gap-2"
                        >
                          📋 {t("navbar.repair_history")}
                        </button>

                        <div className="border-t border-gray-100" />

                        {/* ← เปลี่ยนมาเรียก handleLogoutClick แทน */}
                        <button
                          onClick={handleLogoutClick}
                          className="w-full px-4 py-3 text-[14px] text-red-600 hover:bg-red-50 text-left cursor-pointer flex items-center gap-2"
                        >
                          🚪 {t("logout")}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* CART - to the right of profile */}
                  <span className="w-px h-7 bg-gray-300 shrink-0" aria-hidden />
                  <button
                    onClick={() => router.push("/cartPage/cart")}
                    className="relative p-2 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
                    aria-label="ตะกร้าสินค้า"
                  >
                    <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                    {cartCount > 0 && (
                      <span className="absolute -top-0.5 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center leading-none">
                        {cartCount}
                      </span>
                    )}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => router.push("/login")}
                  className="border border-blue-600 text-blue-600 rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 text-[13px] sm:text-[14px] font-medium hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
                >
                  {t("login")}
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}