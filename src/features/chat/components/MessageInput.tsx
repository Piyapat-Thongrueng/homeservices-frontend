type Props = {
  text: string
  setText: (val: string) => void
  sendMessage: () => void
  handleTyping: (val: string) => void
}

export default function MessageInput({
  text,
  setText,
  sendMessage,
  handleTyping
}: Props) {

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  }

  return (
    <div className="flex items-center gap-2 p-3 bg-white border-t">

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