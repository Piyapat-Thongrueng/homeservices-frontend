import { useEffect, useState } from "react"
import { socket } from "@/lib/socket"

type Props = {
  orderId: string
  userId: string
}

export default function ChatBadge({ orderId, userId }: Props) {

  const [count, setCount] = useState(0)

  // =========================
  // LOAD UNREAD
  // =========================
  const loadUnread = async () => {

    if (!orderId || !userId) return

    try {

      const res = await fetch(
        `http://localhost:4000/api/messages/unread/${orderId}/${userId}`
      )

      if (!res.ok) return

      const data = await res.json()

      setCount(data.count || 0)

    } catch (err) {

      console.error("❌ unread error:", err)

    }

  }

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {
    loadUnread()
  }, [orderId, userId])

  // =========================
  // SOCKET REALTIME
  // =========================
  useEffect(() => {

    const handleNewMessage = (msg: any) => {

      // ถ้าเป็น message ของ order นี้ และไม่ใช่ของเรา
      if (msg.order_id === orderId && msg.sender_id !== userId) {
        loadUnread()
      }

    }

    socket.on("receive_message", handleNewMessage)

    return () => {
      socket.off("receive_message", handleNewMessage)
    }

  }, [orderId, userId])

  // =========================
  // UI
  // =========================

  if (count === 0) return null

  return (

    <span
      style={{
        background: "red",
        color: "white",
        padding: "2px 6px",
        borderRadius: 10,
        fontSize: 12,
        marginLeft: 6
      }}
    >
      {count}
    </span>

  )

}