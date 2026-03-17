import { useEffect, useState, useRef } from "react"
import { socket, connectSocket } from "@/lib/socket"

import ChatHeader from "./ChatHeader"
import MessageList from "./MessageList"
import MessageInput from "./MessageInput"

import useChatSocket from "@/hooks/useChatSocket"

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

export default function ChatBox({ orderId, userId, role }: Props) {

  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState("")
  const [typingUser, setTypingUser] = useState<string | null>(null)
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const [customer, setCustomer] = useState<ChatUser | null>(null)
  const [technician, setTechnician] = useState<ChatUser | null>(null)

  const [loadingHistory, setLoadingHistory] = useState(false)

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
  // SOCKET CONNECT + JOIN ROOM
  // =================
  useEffect(() => {

    if (!orderId || !userId) return

    connectSocket()

    socket.emit("user_online", { userId })
    socket.emit("join_room", orderId)

    return () => {
      socket.emit("leave_room", orderId)
    }

  }, [orderId, userId])

  // =================
  // LOAD CHAT USERS
  // =================
  const loadChatUsers = async () => {

    try {

      const res = await fetch(
        `http://localhost:4000/api/chat/${orderId}/chat-info`
      )

      if (!res.ok) return

      const data = await res.json()

      setCustomer(data.customer)
      setTechnician(data.technician)

    } catch (err) {
      console.error(err)
    }

  }

  // =================
  // LOAD MESSAGES
  // =================
  const loadMessages = async () => {

    if (!orderId || !userId || loadingHistory) return

    try {

      setLoadingHistory(true)

      const res = await fetch(
        `http://localhost:4000/api/messages/${orderId}?userId=${userId}`
      )

      if (!res.ok) return

      const data = await res.json()

      if (!Array.isArray(data)) return

      const sorted = [...data].sort(
        (a, b) =>
          new Date(a.created_at).getTime() -
          new Date(b.created_at).getTime()
      )

      setMessages(sorted)

    } catch (err) {
      console.error(err)
    } finally {
      setLoadingHistory(false)
    }

  }

  // =================
  // SEND MESSAGE
  // =================
  const sendMessage = async () => {

    const messageText = text.trim()
    if (!messageText) return

    setText("")

    try {

      const res = await fetch(
        "http://localhost:4000/api/messages",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_id: orderId,
            sender_id: userId,
            message: messageText
          })
        }
      )

      if (!res.ok) return

      const newMessage = await res.json()

      if (socket.connected) {
        socket.emit("send_message", newMessage)
      }

    } catch (err) {
      console.error(err)
    }

  }

  // =================
  // SEND IMAGE
  // =================
  const sendImage = async (file: File) => {

    if (!orderId) return

    try {

      const reader = new FileReader()

      reader.onload = async () => {

        const base64 = reader.result

        const res = await fetch(
          "http://localhost:4000/api/messages/image",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              order_id: orderId,
              sender_id: userId,
              image: base64
            })
          }
        )

        if (!res.ok) return

        const msg = await res.json()

        if (socket.connected) {
          socket.emit("send_message", msg)
        }

      }

      reader.readAsDataURL(file)

    } catch (err) {
      console.error(err)
    }

  }

  // =================
  // TYPING
  // =================
  const handleTyping = (value: string) => {

    setText(value)

    if (!socket.connected) return

    socket.emit("typing", { orderId, userId })

    if (typingTimeout.current)
      clearTimeout(typingTimeout.current)

    typingTimeout.current = setTimeout(() => {
      socket.emit("stop_typing", { orderId })
    }, 800)

  }

  // =================
  // MARK READ
  // =================
  const markAsRead = async () => {

    try {

      await fetch(
        `http://localhost:4000/api/messages/read/${orderId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId })
        }
      )

    } catch (err) {
      console.error(err)
    }

  }

  // =================
  // SOCKET HOOK
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
  // INIT LOAD
  // =================
  useEffect(() => {

    if (!orderId || !userId) return

    loadMessages()
    loadChatUsers()

  }, [orderId, userId])

  // =================
  // SCROLL + READ
  // =================
  useEffect(() => {

    bottomRef.current?.scrollIntoView({
      behavior: "smooth"
    })

    markAsRead()

  }, [messages])

  // =================
  // UI
  // =================
  return (

    <div style={{ maxWidth: 500 }}>

      <h2>
        Chat
        {unreadCount > 0 && (
          <span
            style={{
              marginLeft: 8,
              background: "red",
              color: "white",
              padding: "2px 8px",
              borderRadius: 10,
              fontSize: 12
            }}
          >
            {unreadCount}
          </span>
        )}
      </h2>

      <ChatHeader
        otherUser={otherUser}
        otherOnline={otherOnline}
      />

      <MessageList
        messages={messages}
        userId={userId}
        myUser={myUser}
        otherUser={otherUser}
        typingUser={typingUser}
        bottomRef={bottomRef}
      />

      <MessageInput
        text={text}
        setText={setText}
        sendMessage={sendMessage}
        handleTyping={handleTyping}
        sendImage={sendImage}
      />

    </div>

  )

}