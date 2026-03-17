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
    bottomRef: any
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
  
      <div
        style={{
          border: "1px solid #eee",
          height: 360,
          overflowY: "auto",
          padding: 16,
          background: "#fafafa"
        }}
      >
  
        {messages.map((m) => {
  
          const isMine = m.sender_id === userId
  
          const avatar = isMine
            ? myUser?.avatar || defaultAvatar
            : otherUser?.avatar || defaultAvatar
  
          return (
  
            <div
              key={m.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: isMine
                  ? "flex-end"
                  : "flex-start",
                marginBottom: 10
              }}
            >
  
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  alignItems: "center"
                }}
              >
  
                {!isMine && (
                  <img
                    src={avatar}
                    style={{
                      width: 22,
                      borderRadius: "50%"
                    }}
                  />
                )}
  
                <div
                  style={{
                    background: isMine
                      ? "#2563eb"
                      : "#f1f5f9",
                    color: isMine
                      ? "white"
                      : "#111",
                    padding: "10px 14px",
                    borderRadius: 16,
                    maxWidth: "70%"
                  }}
                >
  
                  {m.image && (
                    <img
                      src={m.image}
                      style={{
                        maxWidth: 200,
                        borderRadius: 10,
                        marginBottom: 6
                      }}
                    />
                  )}
  
                  {m.message}
  
                </div>
  
              </div>
  
              <span
                style={{
                  fontSize: 11,
                  color: "#999",
                  marginTop: 2
                }}
              >
                {formatTime(m.created_at)}
              </span>
  
            </div>
  
          )
  
        })}
  
        {typingUser && (
          <div style={{ fontSize: 12, color: "#999" }}>
            กำลังพิมพ์...
          </div>
        )}
  
        <div ref={bottomRef} />
  
      </div>
  
    )
  
  }