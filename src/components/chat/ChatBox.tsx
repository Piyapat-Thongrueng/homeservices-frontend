import { useEffect, useState, useRef } from "react"
import ChatHeader from "./ChatHeader"
import MessageList from "./MessageList"
import MessageInput from "./MessageInput"
import useChatSocket from "@/hooks/useChatSocket"
import { socket, connectSocket } from "@/lib/socket"

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
}

// =======================
export default function ChatBox({ orderId, userId, role }: Props) {

  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState<string>("")
  const [typingUser, setTypingUser] = useState<string | null>(null)
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const [unreadCount, setUnreadCount] = useState<number>(0)

  const [customer, setCustomer] = useState<ChatUser | null>(null)
  const [technician, setTechnician] = useState<ChatUser | null>(null)

  const bottomRef = useRef<HTMLDivElement>(null)
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isTechnician = role === "technician"
  const otherUser = isTechnician ? customer : technician
  const myUser = isTechnician ? technician : customer

  const otherOnline =
    otherUser?.id
      ? onlineUsers.includes(String(otherUser.id))
      : false

  // =================
  useEffect(() => {
    connectSocket()
  }, [])

  // =================
  useEffect(() => {

    if (!orderId) return

    const loadUsers = async () => {
      try {
        const res = await fetch(`/api/chat/${orderId}/chat-info`)
        if (!res.ok) return

        const data: {
          customer: ChatUser | null
          technician: ChatUser | null
        } = await res.json()

        setCustomer(data.customer)
        setTechnician(data.technician)

      } catch (err) {
        console.error(err)
      }
    }

    loadUsers()

  }, [orderId])

  // =================
  useEffect(() => {

    if (!orderId || !userId) return

    const loadMessages = async () => {
      try {
        const res = await fetch(`/api/messages/${orderId}?userId=${userId}`)
        if (!res.ok) return

        const data: Message[] = await res.json()
        setMessages(data)

      } catch (err) {
        console.error(err)
      }
    }

    loadMessages()

  }, [orderId, userId])

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
  const sendMessage = () => {

    if (!text.trim()) return

    socket.emit("send_message", {
      order_id: orderId,
      sender_id: userId,
      message: text
    })

    setText("")
  }

  // =================
  const sendImage = (imageUrl: string) => {

    if (!imageUrl) return

    socket.emit("send_message", {
      order_id: orderId,
      sender_id: userId,
      image: imageUrl
    })
  }

  // =================
  const handleTyping = (value: string) => {

    setText(value)

    socket.emit("typing", { orderId, userId })

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current)
    }

    typingTimeout.current = setTimeout(() => {
      socket.emit("stop_typing", { orderId })
    }, 800)
  }

  // =================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // =================
  return (

    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">

      <div className="shrink-0">
        <ChatHeader
          otherUser={otherUser}
          otherOnline={otherOnline}
        />
      </div>

      <div className="flex-1 overflow-hidden">
        <MessageList
          messages={messages}
          userId={userId}
          myUser={myUser}
          otherUser={otherUser}
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
          sendImage={sendImage}
        />
      </div>

    </div>
  )
}