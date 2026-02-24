import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"
import { useAuth } from "@/contexts/AuthContext"

type Notification = {
  id: string
  user_id: string
  title: string
  message: string
  is_read: boolean
  created_at: string
}

export default function Navbar() {

  const router = useRouter()

  // =====================
  // GLOBAL AUTH STATE
  // =====================

  const { user, loading } = useAuth()

  // =====================
  // LOCAL STATE
  // =====================

  // profile dropdown
  const [open, setOpen] = useState(false)

  // notification dropdown
  const [notifOpen, setNotifOpen] = useState(false)

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  const channelRef = useRef<any>(null)


  // =====================
  // LOAD NOTIFICATIONS WHEN USER CHANGE
  // =====================

  useEffect(() => {

    if (!user) {

      // cleanup realtime
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }

      setNotifications([])
      setUnreadCount(0)

      return
    }

    loadNotifications(user.id)

    setupRealtime(user.id)

    return () => {

      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }

    }

  }, [user])


  // =====================
  // LOAD NOTIFICATIONS
  // =====================

  const loadNotifications = async (userId: string) => {

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20)

    if (error || !data) return

    setNotifications(data)

    const unread = data.filter(n => !n.is_read).length

    setUnreadCount(unread)

  }


  // =====================
  // REALTIME
  // =====================

  const setupRealtime = (userId: string) => {

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
      channelRef.current = null
    }

    const channel = supabase
      .channel(`notifications-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`
        },
        (payload) => {

          const newNotif = payload.new as Notification

          setNotifications(prev => {

            const exists =
              prev.find(n => n.id === newNotif.id)

            if (exists) return prev

            return [newNotif, ...prev]

          })

          setUnreadCount(prev => prev + 1)

        }
      )
      .subscribe()

    channelRef.current = channel

  }


  // =====================
  // MARK READ
  // =====================

  const markAsRead = async (id: string) => {

    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id)

    setNotifications(prev =>
      prev.map(n =>
        n.id === id
          ? { ...n, is_read: true }
          : n
      )
    )

    setUnreadCount(prev =>
      Math.max(prev - 1, 0)
    )

  }


  const markAllRead = async () => {

    if (!user) return

    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false)

    setNotifications(prev =>
      prev.map(n => ({
        ...n,
        is_read: true,
      }))
    )

    setUnreadCount(0)

  }


  // =====================
  // LOGOUT
  // =====================

  const handleLogout = async () => {

    await supabase.auth.signOut()

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
      channelRef.current = null
    }

    setOpen(false)

    router.push("/")

  }


  const goLogin = () => {
    router.push("/auth/login")
  }


  // =====================
  // CLICK OUTSIDE
  // =====================

  useEffect(() => {

    const handler = (event: MouseEvent) => {

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false)
      }

      if (
        notifRef.current &&
        !notifRef.current.contains(
          event.target as Node
        )
      ) {
        setNotifOpen(false)
      }

    }

    document.addEventListener(
      "mousedown",
      handler
    )

    return () =>
      document.removeEventListener(
        "mousedown",
        handler
      )

  }, [])


  // =====================
  // USER INFO
  // =====================

  const userName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email ||
    "User"

  const userEmail =
    user?.email || ""

  const avatarUrl =
    user?.user_metadata?.avatar_url || null

  const userInitial =
    userName.length > 0
      ? userName.charAt(0).toUpperCase()
      : "U"


  // =====================
  // UI
  // =====================

  return (

    <nav className="sticky top-0 z-50 bg-white backdrop-blur-md shadow-sm border-b border-gray-100">

      <div className="w-full px-5 sm:px-6 md:px-35">

        <div className="flex items-center justify-between py-3">


          {/* LEFT */}
          <div className="flex items-center gap-5 sm:gap-10 md:gap-15">

            <img
              src="/web-logo.svg"
              alt="HomeServices Logo"
              className="h-5 w-30 sm:h-10 sm:w-40 cursor-pointer"
              onClick={() =>
                router.push("/")
              }
            />

            <a
              href="#services"
              className="headline-5 font-medium text-black hover:text-blue-600 transition-colors"
            >
              บริการของเรา
            </a>

          </div>


          {/* RIGHT */}
          <div className="flex items-center gap-4 relative">


            {loading ? null : user ? (

              <>

                {/* NOTIFICATION */}
                <div
                  ref={notifRef}
                  className="relative"
                >

                  <button
                    onClick={() =>
                      setNotifOpen(!notifOpen)
                    }
                    className="relative text-xl"
                  >
                    🔔

                    {unreadCount > 0 && (

                      <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>

                    )}

                  </button>


                  {notifOpen && (

                    <div className="absolute right-0 mt-2 w-80 bg-white border rounded-xl shadow-lg max-h-96 overflow-y-auto">

                      <div className="p-3 border-b flex justify-between">

                        <span className="font-semibold">
                          Notifications
                        </span>

                        <button
                          onClick={markAllRead}
                          className="text-blue-600 text-sm"
                        >
                          Mark all read
                        </button>

                      </div>


                      {notifications.length === 0 && (

                        <div className="p-4 text-gray-500">
                          No notifications
                        </div>

                      )}


                      {notifications.map(n => (

                        <div
                          key={n.id}
                          onClick={() =>
                            markAsRead(n.id)
                          }
                          className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${!n.is_read ? "bg-blue-50" : ""}`}
                        >

                          <div className="font-medium text-sm">
                            {n.title}
                          </div>

                          <div className="text-xs text-gray-500">
                            {n.message}
                          </div>

                        </div>

                      ))}

                    </div>

                  )}

                </div>


                {/* PROFILE */}
                <div
                  ref={dropdownRef}
                  className="relative"
                >

                  <button
                    onClick={() =>
                      setOpen(!open)
                    }
                    className="flex items-center gap-3"
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

                    <span className="text-sm font-medium text-gray-700 hidden sm:block">
                      {userName}
                    </span>

                  </button>


                  {open && (

                    <div className="absolute right-0 mt-2 w-[240px] bg-white border rounded-xl shadow-lg overflow-hidden">

                      <div className="px-4 py-3 border-b">

                        <div className="text-sm font-semibold">
                          {userName}
                        </div>

                        <div className="text-xs text-gray-500">
                          {userEmail}
                        </div>

                      </div>


                      <button
                        onClick={() => {
                          setOpen(false)
                          router.push("/profile")
                        }}
                        className="w-full px-4 py-3 text-sm hover:bg-gray-50 text-left"
                      >
                        👤 Profile
                      </button>


                      {/* ✅ RESET PASSWORD */}
                      <button
                        onClick={() => {
                          setOpen(false)
                          router.push("/reset-password")
                        }}
                        className="w-full px-4 py-3 text-sm hover:bg-gray-50 text-left"
                      >
                        🔒 Reset password
                      </button>


                      <div className="border-t" />


                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 text-left"
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
                className="border border-blue-600 text-blue-600 rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-600 hover:text-white"
              >
                เข้าสู่ระบบ
              </button>

            )}

          </div>

        </div>

      </div>

    </nav>

  )

}