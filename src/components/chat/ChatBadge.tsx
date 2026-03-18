import { useEffect, useState } from "react"
import { socket } from "@/lib/socket"

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

    const loadUnread = async () => {

      if (!orderId || !userId) return

      try {
        const res = await fetch(
          `/api/messages/unread/${orderId}/${userId}`
        )

        if (!res.ok) return

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

    const handleNewMessage = (msg: any) => {

      if (
        msg.order_id === orderId &&
        msg.sender_id !== userId
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
  // RESET เมื่อเปิดหน้า 
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
  if (count === 0) return null

  return (
    <span className="ml-1 px-2 py-[2px] text-xs bg-red-500 text-white rounded-full">
      {count}
    </span>
  )
}