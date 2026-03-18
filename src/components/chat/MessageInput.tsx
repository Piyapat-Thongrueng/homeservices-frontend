type Props = {
    text: string
    setText: (val: string) => void
    sendMessage: () => void
    handleTyping: (val: string) => void
    sendImage: (url: string) => void
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
  
    const handleImageUpload = async (file: File) => {
  
      if (!file) return
  
      const reader = new FileReader()
  
      reader.onload = async () => {
  
        try {
  
          const base64 = reader.result as string
  
          const res = await fetch("/api/upload", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ file: base64 })
          })
  
          if (!res.ok) return
  
          const data: { url: string } = await res.json()
  
          if (data?.url) {
            sendImage(data.url)
          }
  
        } catch (err) {
          console.error(err)
        }
  
      }
  
      reader.readAsDataURL(file)
    }
  
    return (
      <div className="flex items-center gap-2 p-3 bg-white border-t">
  
        <label className="cursor-pointer text-gray-500 hover:text-blue-600">
          📎
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files?.[0]
              if (file) {
                handleImageUpload(file)
                e.target.value = ""
              }
            }}
          />
        </label>
  
        <input
          value={text}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleTyping(e.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder="พิมพ์ข้อความ..."
          className="flex-1 px-4 py-2 rounded-full bg-gray-100 text-sm outline-none"
        />
  
        <button
          onClick={sendMessage}
          disabled={!text.trim()}
          className={`
            px-4 py-2 rounded-full text-white text-sm
            ${text.trim()
              ? "bg-blue-600"
              : "bg-gray-300 cursor-not-allowed"}
          `}
        >
          ➤
        </button>
  
      </div>
    )
  }