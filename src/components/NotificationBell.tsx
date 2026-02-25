import { useEffect, useState, useRef } from "react"
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

export default function NotificationBell() {

  const { user } = useAuth()

  const [notifOpen, setNotifOpen] =
    useState(false)

  const [notifications, setNotifications] =
    useState<Notification[]>([])

  const [unreadCount, setUnreadCount] =
    useState(0)

  const [popup, setPopup] =
    useState<Notification | null>(null)

  const channelRef =
    useRef<any>(null)


  // =====================
  // TIME AGO
  // =====================

  const timeAgo =
    (dateString: string) => {

      const now =
        new Date().getTime()

      const past =
        new Date(dateString).getTime()

      const diff =
        Math.floor((now - past) / 1000)

      if (diff < 60)
        return `${diff} seconds ago`

      if (diff < 3600)
        return `${Math.floor(diff / 60)} minutes ago`

      if (diff < 86400)
        return `${Math.floor(diff / 3600)} hours ago`

      return `${Math.floor(diff / 86400)} days ago`

    }


  // =====================
  // LOAD
  // =====================

  const loadNotifications =
    async (userId: string) => {

      const { data, error } =
        await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", userId)
          .order("created_at",
            { ascending: false })

      if (error) {
        console.error(error)
        return
      }

      if (!data) return

      setNotifications(data)

      const unread =
        data.filter(
          n => !n.is_read
        ).length

      setUnreadCount(unread)

    }


  // =====================
  // REALTIME
  // =====================

  const setupRealtime =
    (userId: string) => {

      console.log(
        "Setting up realtime for:",
        userId
      )

      // cleanup old
      if (channelRef.current) {

        supabase.removeChannel(
          channelRef.current
        )

        channelRef.current = null

      }

      const channel =
        supabase
          .channel(
            `notifications-${userId}`
          )
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "notifications",
              filter:
                `user_id=eq.${userId}`
            },
            (payload) => {

              console.log(
                "Realtime received:",
                payload
              )

              const newNotif =
                payload.new as Notification

              // add list
              setNotifications(prev => {

                const exists =
                  prev.find(
                    n =>
                      n.id === newNotif.id
                  )

                if (exists)
                  return prev

                return [
                  newNotif,
                  ...prev
                ]

              })

              // badge
              setUnreadCount(
                prev => prev + 1
              )

              // popup
              setPopup(newNotif)

              setTimeout(() => {

                setPopup(null)

              }, 4000)

            }
          )
          .subscribe((status) => {

            console.log(
              "Realtime status:",
              status
            )

          })

      channelRef.current = channel

    }


  // =====================
  // USER CHANGE
  // =====================

  useEffect(() => {

    if (!user?.id) return

    loadNotifications(user.id)

    setupRealtime(user.id)

    return () => {

      if (channelRef.current) {

        supabase.removeChannel(
          channelRef.current
        )

      }

    }

  }, [user?.id])


  // =====================
  // MARK READ
  // =====================

  const markAsRead =
    async (id: string) => {

      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id)

      setNotifications(prev =>
        prev.map(n =>
          n.id === id
            ? {
              ...n,
              is_read: true
            }
            : n
        )
      )

      setUnreadCount(prev =>
        Math.max(prev - 1, 0)
      )

    }


  const markAllRead =
    async () => {

      if (!user?.id) return

      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("is_read", false)

      setNotifications(prev =>
        prev.map(n => ({
          ...n,
          is_read: true
        }))
      )

      setUnreadCount(0)

    }


  // =====================
  // UI
  // =====================

  return (

    <>

      {/* POPUP */}
      {popup && (

        <div className="
          fixed
          top-5
          right-5
          bg-white
          shadow-lg
          border
          rounded-lg
          p-4
          w-80
          z-50
        ">

          <div className="
            font-semibold
          ">
            {popup.title}
          </div>

          <div className="
            text-sm
            text-gray-600
          ">
            {popup.message}
          </div>

        </div>

      )}


      {/* BELL */}
      <div className="relative">

        <button
          onClick={() =>
            setNotifOpen(!notifOpen)
          }
          className="relative text-xl"
        >
          🔔

          {unreadCount > 0 && (

            <span className="
              absolute
              -top-1
              -right-2
              bg-red-500
              text-white
              text-xs
              w-5
              h-5
              rounded-full
              flex
              items-center
              justify-center
            ">
              {unreadCount}
            </span>

          )}

        </button>


        {/* DROPDOWN */}
        {notifOpen && (

          <div className="
            absolute
            right-0
            mt-2
            w-80
            bg-white
            border
            rounded-xl
            shadow-lg
          ">

            <div className="
              p-3
              border-b
              flex
              justify-between
            ">

              <span>
                Notifications
              </span>

              <button
                onClick={markAllRead}
                className="
                  text-blue-600
                  text-sm
                "
              >
                Mark all read
              </button>

            </div>


            {notifications.length === 0 && (

              <div className="
                p-4
                text-gray-500
              ">
                No notifications
              </div>

            )}


            {notifications.map(n => (

              <div
                key={n.id}
                onClick={() =>
                  markAsRead(n.id)
                }
                className={`
                  p-3
                  border-b
                  cursor-pointer
                  hover:bg-gray-50
                  ${
                    !n.is_read
                      ? "bg-blue-50"
                      : ""
                  }
                `}
              >

                <div className="
                  font-medium
                  text-sm
                ">
                  {n.title}
                </div>

                <div className="
                  text-xs
                  text-gray-500
                ">
                  {n.message}
                </div>

                <div className="
                  text-xs
                  text-gray-400
                  mt-1
                ">
                  {timeAgo(
                    n.created_at
                  )}
                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </>

  )

}