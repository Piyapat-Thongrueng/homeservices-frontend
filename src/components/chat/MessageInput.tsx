type Props = {
    text: string
    setText: (val: string) => void
    sendMessage: () => void
    handleTyping: (val: string) => void
    sendImage: (file: File) => void
  }
  
  export default function MessageInput({
    text,
    setText,
    sendMessage,
    handleTyping,
    sendImage
  }: Props) {
  
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        sendMessage()
      }
    }
  
    return (
  
      <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
  
        {/* INPUT */}
        <input
          value={text}
          onChange={(e) => handleTyping(e.target.value)} // ✅ ใช้ handleTyping
          onKeyDown={handleKeyDown}
          placeholder="พิมพ์ข้อความ..."
          style={{
            flex: 1,
            padding: 10,
            border: "1px solid #ddd",
            borderRadius: 8
          }}
        />
  
        {/* IMAGE BUTTON */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              sendImage(e.target.files[0])
            }
          }}
        />
  
        {/* SEND BUTTON */}
        <button
          onClick={sendMessage}
          style={{
            padding: "0 16px",
            background: "#2563eb",
            color: "white",
            borderRadius: 8,
            border: "none"
          }}
        >
          Send
        </button>
  
      </div>
  
    )
  
  }