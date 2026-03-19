import { useEffect } from "react"
import { getSocket, connectSocket } from "@/lib/socket"

type Message = {
  id: string | number
  order_id: string | number
  sender_id: string | number
  message?: string
  image?: string
  created_at: string
  is_read?: boolean
}

type Props = {
  orderId: string
  userId: string
  setMessages: any
  setTypingUser: any
  setOnlineUsers: any
  setUnreadCount: any
}

export default function useChatSocket({
  orderId,
  userId,
  setMessages,
  setTypingUser,
  setOnlineUsers,
  setUnreadCount
}: Props) {

  useEffect(() => {

    if (!orderId || !userId) return

    connectSocket()

    const socket = getSocket()
    if (!socket) return

    // =============================
    // RECEIVE MESSAGE
    // =============================
    const receiveMessage = (msg: Message) => {

      if (!msg) return

      setMessages((prev: Message[]) => {

        const filtered = prev.filter(m => {

          const mId = String(m.id)
          const msgSender = String(msg.sender_id)
          const mSender = String(m.sender_id)

          const isTempMatch =
            mId.startsWith("temp-") &&
            m.message === msg.message &&
            mSender === msgSender

          return !isTempMatch
        })

        const isDuplicate = filtered.some(
          m => String(m.id) === String(msg.id)
        )

        if (isDuplicate) return filtered

        return [...filtered, msg]
      })

      // unread
      if (
        String(msg.sender_id) !== String(userId) &&
        typeof document !== "undefined" &&
        document.hidden
      ) {
        setUnreadCount((prev: number) => prev + 1)
      }
    }

    // =============================
    // ONLINE USERS
    // =============================
    const handleOnlineUsers = (users: string[]) => {
      if (!users) return
      setOnlineUsers(users.map(u => String(u)))
    }

    // =============================
    // TYPING
    // =============================
    const handleTyping = (typingUserId: string) => {
      if (String(typingUserId) !== String(userId)) {
        setTypingUser(String(typingUserId))
      }
    }

    // ✅ FIX: stop typing
    const handleStopTyping = () => {
      setTypingUser(null)
    }

    // =============================
    // CHAT CLOSED
    // =============================
    const chatClosed = () => {
      alert("งานนี้ถูกปิดแล้ว แชทถูกปิด")
      window.location.reload()
    }

    // =============================
    // REGISTER EVENTS
    // =============================
    socket.on("receive_message", receiveMessage)
    socket.on("online_users", handleOnlineUsers)
    socket.on("typing", handleTyping)
    socket.on("stop_typing", handleStopTyping) // 🔥 เพิ่ม
    socket.on("chat_closed", chatClosed)

    // =============================
    // USER ONLINE (🔥 FIX timing)
    // =============================
    if (socket.connected) {
      socket.emit("user_online", { userId: String(userId) })
      socket.emit("join_chat", {
        order_id: String(orderId),
        user_id: String(userId)
      })
    } else {
      socket.on("connect", () => {
        socket.emit("user_online", { userId: String(userId) })
        socket.emit("join_chat", {
          order_id: String(orderId),
          user_id: String(userId)
        })
      })
    }

    // =============================
    // CLEANUP
    // =============================
    return () => {

      socket.off("receive_message", receiveMessage)
      socket.off("online_users", handleOnlineUsers)
      socket.off("typing", handleTyping)
      socket.off("stop_typing", handleStopTyping) // 🔥 เพิ่ม
      socket.off("chat_closed", chatClosed)

      socket.emit("leave_chat", {
        order_id: String(orderId),
        user_id: String(userId)
      })
    }

  }, [
    orderId,
    userId,
    setMessages,
    setTypingUser,
    setOnlineUsers,
    setUnreadCount
  ])
}