import { useEffect, useState, useRef } from "react"
import ChatHeader from "./ChatHeader"
import MessageList from "./MessageList"
import MessageInput from "./MessageInput"
import useChatSocket from "@/hooks/useChatSocket"
import { getSocket, connectSocket } from "@/lib/socket"
import { CHAT_MESSAGES_READ_EVENT } from "@/features/chat/chatEvents"

// =======================
type Message = {
  id: string
  order_id: string
  sender_id: string
  message?: string
  image?: string
  created_at: string
  is_read?: boolean
}

type ChatUser = {
  id: string
  name: string
  avatar?: string
}

type Props = {
  orderId: string
  userId: string
  role: "user" | "technician"
  customer?: ChatUser | null
  technician?: ChatUser | null
  /** When set (e.g. modal), header back closes instead of routing; root uses h-full not h-screen. */
  onClose?: () => void
}

// =======================
const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000/api"

const BASE = API.endsWith("/api") ? API : `${API}/api`

// =======================
export default function ChatBox({
  orderId,
  userId,
  role,
  customer,
  technician,
  onClose,
}: Props) {

  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState("")
  const [typingUser, setTypingUser] = useState<string | null>(null)
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const bottomRef = useRef<HTMLDivElement>(null)
  const typingTimeout = useRef<any>(null)

  const isTechnician = role === "technician"

  const otherUser = isTechnician ? customer : technician
  const myUser = isTechnician ? technician : customer

  const otherOnline =
    otherUser?.id
      ? onlineUsers.includes(String(otherUser.id))
      : false

  // =================
  // CONNECT SOCKET
  // =================
  useEffect(() => {
    connectSocket()
  }, [])

  // =================
  // LOAD MESSAGES
  // =================
  useEffect(() => {

    if (!orderId || !userId) return

    const loadMessages = async () => {
      try {

        const url = `${BASE}/chat/messages/${orderId}?userId=${userId}`
        

        const res = await fetch(url)

        if (!res.ok) {
          return
        }

        const data: Message[] = await res.json()
        setMessages(data)

        try {
          await fetch(`${BASE}/chat/messages/read/${orderId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: String(userId) }),
          })
        } catch {
          /* ignore */
        }

        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent(CHAT_MESSAGES_READ_EVENT, {
              detail: { orderId: String(orderId) },
            }),
          )
        }
      } catch (err) {
      }
    }

    loadMessages()

  }, [orderId, userId])

  // =================
  // SOCKET HANDLER
  // =================
  useChatSocket({
    orderId,
    userId,
    setMessages,
    setTypingUser,
    setOnlineUsers,
    setUnreadCount
  })

  // =================
  // SEND MESSAGE (🔥 FIX: ไม่มี tempMsg แล้ว)
  // =================
  const sendMessage = () => {

    if (!text.trim()) return

    const socket = getSocket()

    if (!socket || !socket.connected) {
      console.warn("⚠️ socket not connected yet")
      return
    }

    socket.emit("send_message", {
      order_id: String(orderId),
      sender_id: String(userId),
      message: text
    })

    setText("")
  }

  // =================
  const sendImage = (imageUrl: string) => {

    const socket = getSocket()
    if (!socket || !socket.connected) return

    socket.emit("send_message", {
      order_id: String(orderId),
      sender_id: String(userId),
      image: imageUrl
    })
  }

  // =================
  const handleTyping = (value: string) => {

    setText(value)

    const socket = getSocket()
    if (!socket || !socket.connected) return

    socket.emit("typing", {
      orderId: String(orderId),
      userId: String(userId)
    })

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current)
    }

    typingTimeout.current = setTimeout(() => {
      socket.emit("stop_typing", {
        orderId: String(orderId)
      })
    }, 800)
  }

  // =================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // =================
  return (
    <div
      className={`flex flex-col overflow-hidden bg-gray-100 ${
        onClose ? "h-full min-h-0" : "h-screen"
      }`}
    >
      <div className="shrink-0">
        <ChatHeader
          otherUser={otherUser ?? null}
          orderId={orderId}
          onClose={onClose}
        />
      </div>

      <div className="flex-1 overflow-hidden">
        <MessageList
          messages={messages}
          userId={String(userId)} // 🔥 กัน type mismatch
          myUser={myUser ?? null}
          otherUser={otherUser ?? null}
          typingUser={typingUser}
          bottomRef={bottomRef}
        />
      </div>

      <div className="shrink-0 pb-[env(safe-area-inset-bottom)]">
        <MessageInput
          text={text}
          setText={setText}
          handleTyping={handleTyping}
          sendMessage={sendMessage}
        />
      </div>

    </div>
  )
}