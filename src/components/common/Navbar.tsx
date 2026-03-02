/**
 * Main site Navbar
 *
 * Sticky top navigation bar that shows the brand, primary navigation link,
 * and a user area that reflects global auth state (login button, profile
 * dropdown, notification bell, and logout/reset actions).
 */
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import NotificationBell from "@/components/NotificationBell";
import Link from "next/link";

export default function Navbar() {
  const router = useRouter();

  // =====================
  // GLOBAL AUTH STATE
  // =====================

  const { user, loading } = useAuth();

  // =====================
  // LOCAL STATE
  // =====================

  // profile dropdown
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // =====================
  // LOGOUT
  // =====================

  const handleLogout = async () => {
    await supabase.auth.signOut();

    setOpen(false);

    router.push("/");
  };

  const goLogin = () => {
    router.push("/auth/login");
  };

  // =====================
  // CLICK OUTSIDE
  // =====================

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // =====================
  // USER INFO
  // =====================

  const userName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email ||
    "User";

  const userEmail = user?.email || "";

  const avatarUrl = user?.user_metadata?.avatar_url || null;

  const userInitial =
    userName.length > 0 ? userName.charAt(0).toUpperCase() : "U";

  // =====================
  // UI
  // =====================

  return (
    <nav className="bg-white backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="w-full max-w-screen-2xl mx-auto px-5 sm:px-6 md:px-16 lg:px-24">
        <div className="flex items-center justify-between py-3">
          {/* LEFT */}
          <div className="flex items-center gap-5 sm:gap-10 md:gap-15">
            <img
              src="/web-logo.svg"
              alt="HomeServices Logo"
              className="h-5 w-30 sm:h-10 sm:w-40 cursor-pointer"
              onClick={() => router.push("/")}
            />

            <Link
              href="/service-lists"
              className="headline-5 font-medium text-black hover:text-blue-600 transition-colors"
            >
              บริการของเรา
            </Link>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4 relative">
            {loading ? null : user ? (
              <>
                {/* NOTIFICATION */}
                <NotificationBell />

                {/* PROFILE */}
                <div ref={dropdownRef} className="relative">
                  <button
                    onClick={() => setOpen(!open)}
                    className="
    flex items-center gap-3
    cursor-pointer
    transition-all duration-200
    hover:scale-105
  "
                  >
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        className="w-9 h-9 rounded-full object-cover border"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                        {userInitial}
                      </div>
                    )}

                    <span className="text-sm font-medium text-gray-700 hidden sm:block hover:text-blue-500">
                      {userName}
                    </span>
                  </button>

                  {open && (
                    <div className="absolute right-0 mt-2 w-[240px] bg-white border rounded-xl shadow-lg overflow-hidden">
                      <div className="px-4 py-3 border-b">
                        <div className="text-sm font-semibold">{userName}</div>

                        <div className="text-xs text-gray-500">{userEmail}</div>
                      </div>

                      <button
                        onClick={() => {
                          setOpen(false);
                          router.push("/profile");
                        }}
                        className="w-full px-4 py-3 text-sm hover:bg-gray-200 text-left cursor-pointer"
                      >
                        👤 Profile
                      </button>

                      {/* RESET PASSWORD */}
                      <button
                        onClick={() => {
                          setOpen(false);
                          router.push("/reset-password");
                        }}
                        className="w-full px-4 py-3 text-sm hover:bg-gray-200 text-left cursor-pointer"
                      >
                        🔒 Reset password
                      </button>

                      <div className="border-t" />

                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-sm text-red-600 hover:bg-red-100 text-left cursor-pointer"
                      >
                        🚪 Log out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button
                onClick={goLogin}
                className="border border-blue-600 text-blue-600 rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-600 hover:text-white cursor-pointer "
              >
                เข้าสู่ระบบ
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
