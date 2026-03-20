import { useEffect, useState } from "react"
import { getSocket } from "@/lib/socket"

type Props = {
  orderId: string
  userId: string
}

export default function ChatBadge({ orderId, userId }: Props) {

  const [count, setCount] = useState(0)

  // =========================
  // LOAD INITIAL
  // =========================
  useEffect(() => {

    if (!orderId || !userId) return

    const loadUnread = async () => {
      try {

        const url = `/api/chat/messages/unread/${orderId}/${userId}`

        const res = await fetch(url)

        if (!res.ok) {
          console.warn("❌ unread status:", res.status)
          return
        }

        const data = await res.json()

        setCount(data.count || 0)

      } catch (err) {
        console.error("❌ unread error:", err)
      }
    }

    loadUnread()

  }, [orderId, userId])


  // =========================
  // SOCKET REALTIME
  // =========================
  useEffect(() => {

    if (!orderId || !userId) return

    const socket = getSocket()

    if (!socket) {
      console.warn("⚠️ socket not ready")
      return
    }

    const handleNewMessage = (msg: any) => {

      if (!msg) return

      if (
        String(msg.order_id) === String(orderId) &&
        String(msg.sender_id) !== String(userId)
      ) {
        setCount(prev => prev + 1)
      }

    }

    socket.on("receive_message", handleNewMessage)

    return () => {
      socket.off("receive_message", handleNewMessage)
    }

  }, [orderId, userId])


  // =========================
  // RESET เมื่อกลับมา focus
  // =========================
  useEffect(() => {

    const handleFocus = () => {
      setCount(0)
    }

    window.addEventListener("focus", handleFocus)

    return () => {
      window.removeEventListener("focus", handleFocus)
    }

  }, [])


  // =========================
  // UI
  // =========================
  if (!count || count <= 0) return null

  return (
    <span className="ml-1 px-2 py-[2px] text-xs bg-red-500 text-white rounded-full">
      {count}
    </span>
  )
}