type ChatUser = {
    id: string
    name: string
    avatar?: string
  }
  
  type Props = {
    otherUser: ChatUser | null
    otherOnline: boolean
  }
  
  export default function ChatHeader({ otherUser, otherOnline }: Props) {
  
    const defaultAvatar =
      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
  
    if (!otherUser) return null
  
    return (
  
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 10
        }}
      >
  
        <img
          src={otherUser.avatar || defaultAvatar}
          style={{
            width: 36,
            borderRadius: "50%"
          }}
        />
  
        <span
          style={{
            color: otherOnline
              ? "#10b981"
              : "#9ca3af"
          }}
        >
          {otherUser.name}
          {otherOnline ? " • ออนไลน์" : ""}
        </span>
  
      </div>
  
    )
  
  }