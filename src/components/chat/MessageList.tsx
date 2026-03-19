import React from "react"

type Message = {
  id: string | number
  order_id: string | number
  sender_id: string | number
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
  messages: Message[]
  userId: string
  myUser: ChatUser | null
  otherUser: ChatUser | null
  typingUser: string | null
  bottomRef: React.RefObject<HTMLDivElement | null>
}

export default function MessageList({
  messages,
  userId,
  myUser,
  otherUser,
  typingUser,
  bottomRef
}: Props) {

  const defaultAvatar =
    "https://cdn-icons-png.flaticon.com/512/149/149071.png"

  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit"
    })

  return (
    <div className="flex flex-col justify-end h-full overflow-y-auto px-3 py-3 space-y-2 bg-gray-100">

      {messages.map((m) => {

        // 🔥 FIX สำคัญที่สุด
        const isMine = String(m.sender_id) === String(userId)

        const avatar = isMine
          ? myUser?.avatar || defaultAvatar
          : otherUser?.avatar || defaultAvatar

        return (

          <div
            key={String(m.id)} // 🔥 กัน React key error
            className={`flex items-end ${isMine ? "justify-end" : "justify-start"}`}
          >

            {/* Avatar */}
            {!isMine && (
              <img
                src={avatar}
                className="w-7 h-7 rounded-full mr-2"
              />
            )}

            {/* Bubble */}
            <div
              className={`
                max-w-[75%] px-4 py-2 text-sm shadow-sm
                ${isMine
                  ? "bg-blue-600 text-white rounded-2xl rounded-br-md"
                  : "bg-white text-gray-900 rounded-2xl rounded-bl-md border"}
              `}
            >

              {/* IMAGE */}
              {m.image && (
                <img
                  src={m.image}
                  className="max-w-[200px] rounded-lg mb-1"
                />
              )}

              {/* TEXT */}
              {m.message && (
                <div className="whitespace-pre-wrap break-words">
                  {m.message}
                </div>
              )}

              {/* TIME + READ */}
              <div
                className={`
                  flex items-center justify-end gap-1 mt-1 text-[10px]
                  ${isMine ? "text-blue-100" : "text-gray-400"}
                `}
              >
                {formatTime(m.created_at)}

                {isMine && (
                  <span className="text-[10px]">
                    {m.is_read ? "✔✔" : "✔"}
                  </span>
                )}
              </div>

            </div>

          </div>
        )
      })}

      {/* typing indicator */}
      {typingUser && (
        <div className="flex items-center gap-2 px-2 text-xs text-gray-400">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
          <span>กำลังพิมพ์...</span>
        </div>
      )}

      {/* scroll target */}
      <div ref={bottomRef} />

    </div>
  )
}