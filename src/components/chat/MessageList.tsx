import React from "react"

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
    <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2 bg-gray-100">

      {messages.map((m) => {

        const isMine = m.sender_id === userId

        const avatar = isMine
          ? myUser?.avatar || defaultAvatar
          : otherUser?.avatar || defaultAvatar

        return (

          <div
            key={m.id}
            className={`flex ${isMine ? "justify-end" : "justify-start"}`}
          >

            {/* Avatar */}
            {!isMine && (
              <img
                src={avatar}
                className="w-6 h-6 rounded-full mr-2 self-end"
              />
            )}

            {/* Bubble */}
            <div
              className={`
                max-w-[70%] px-4 py-2 rounded-2xl text-sm
                ${isMine
                  ? "bg-blue-600 text-white rounded-br-sm"
                  : "bg-white text-gray-900 rounded-bl-sm shadow-sm"}
              `}
            >

              {m.image && (
                <img
                  src={m.image}
                  className="max-w-[200px] rounded-lg mb-1"
                />
              )}

              {m.message}

              {/* เวลา + read receipt */}
              <div
                className={`
                  flex items-center justify-end gap-1
                  text-[10px] mt-1
                  ${isMine ? "text-blue-100" : "text-gray-400"}
                `}
              >
                {formatTime(m.created_at)}

                {/* ✔✔ READ RECEIPT */}
                {isMine && (
                  <span>
                    {m.is_read ? "✔✔" : "✔"}
                  </span>
                )}
              </div>

            </div>

          </div>
        )
      })}

      {/* typing */}
      {typingUser && (
        <div className="text-xs text-gray-400 px-2">
          กำลังพิมพ์...
        </div>
      )}

      <div ref={bottomRef} />

    </div>
  )
}