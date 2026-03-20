import { useEffect, useState } from "react"
import { getSocket } from "@/lib/socket"
import {
  CHAT_MESSAGES_READ_EVENT,
  type ChatMessagesReadDetail,
} from "@/features/chat/chatEvents"

/** Same as ChatBox: Express serves chat at /api/chat on NEXT_PUBLIC_API_URL (not Next.js /api). */
const API =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"
const BASE = API.endsWith("/api") ? API : `${API}/api`

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

        const url = `${BASE}/chat/messages/unread/${orderId}/${userId}`

        const res = await fetch(url)

        if (!res.ok) {
          return
        }

        const data = await res.json()

        setCount(data.count || 0)

      } catch (err) {
      }
    }

    loadUnread()

  }, [orderId, userId])

  // =========================
  // CLEAR WHEN USER OPENS CHAT (mark-read runs in ChatBox)
  // =========================
  useEffect(() => {
    if (!orderId || !userId) return

    const onRead = (ev: Event) => {
      const detail = (ev as CustomEvent<ChatMessagesReadDetail>).detail
      if (!detail || String(detail.orderId) !== String(orderId)) return

      void (async () => {
        try {
          const url = `${BASE}/chat/messages/unread/${orderId}/${userId}`
          const res = await fetch(url)
          if (res.ok) {
            const data = await res.json()
            setCount(data.count || 0)
          } else {
            setCount(0)
          }
        } catch {
          setCount(0)
        }
      })()
    }

    window.addEventListener(CHAT_MESSAGES_READ_EVENT, onRead as EventListener)
    return () => {
      window.removeEventListener(CHAT_MESSAGES_READ_EVENT, onRead as EventListener)
    }
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
  // UI
  // =========================
  if (!count || count <= 0) return null

  return (
    <span className="ml-1 px-2 py-[2px] text-xs bg-red-500 text-white rounded-full">
      {count}
    </span>
  )
}