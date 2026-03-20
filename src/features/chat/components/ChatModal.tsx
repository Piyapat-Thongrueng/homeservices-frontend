import { useEffect } from "react"
import ChatBox from "./ChatBox"

type Props = {
  orderId: string
  userId: string
  role: "user" | "technician"
  onClose: () => void
}

/**
 * Full-screen on mobile, centered panel on desktop — same ChatBox as /chat/[orderId].
 */
export default function ChatModal({ orderId, userId, role, onClose }: Props) {
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener("keydown", onKey)
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-100 flex items-end justify-center sm:items-center sm:p-4 font-prompt"
      role="dialog"
      aria-modal="true"
      aria-label="แชท"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50 cursor-pointer"
        aria-label="Close chat"
        onClick={onClose}
      />
      <div
        className="relative z-10 flex flex-col w-full h-dvh sm:h-[min(90vh,720px)] sm:max-w-lg sm:rounded-2xl overflow-hidden bg-gray-100 shadow-2xl border border-gray-200/80"
        onClick={(e) => e.stopPropagation()}
      >
        <ChatBox orderId={orderId} userId={userId} role={role} onClose={onClose} />
      </div>
    </div>
  )
}
