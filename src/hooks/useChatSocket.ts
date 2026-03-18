import { useEffect } from "react"
import { socket } from "@/lib/socket"

type Message = {
  id: string
  order_id: string
  sender_id: string
  message: string
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

    // =============================
    // RECEIVE MESSAGE
    // =============================
    const receiveMessage = (msg: Message) => {

      setMessages((prev: Message[]) => {

        if (prev.some(m => m.id === msg.id)) {
          return prev
        }

        return [...prev, msg]
      })

      // unread badge
      if (
        msg.sender_id !== userId &&
        document.hidden
      ) {
        setUnreadCount((prev: number) => prev + 1)
      }
    }

    // =============================
    // ONLINE USERS
    // =============================
    const handleOnlineUsers = (users: string[]) => {
      setOnlineUsers(users)
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
    socket.on("chat_closed", chatClosed)

    // =============================
    // USER ONLINE
    // =============================
    socket.emit("user_online", { userId })

    // =============================
    // JOIN ROOM 
    // =============================
    socket.emit("join_room", {
      orderId,
      userId
    })

    // =============================
    // CLEANUP
    // =============================
    return () => {

      socket.off("receive_message", receiveMessage)
      socket.off("online_users", handleOnlineUsers)
      socket.off("chat_closed", chatClosed)

      // optional: leave room
      socket.emit("leave_room", {
        orderId,
        userId
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