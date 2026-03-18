import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import ChatBox from "@/components/chat/ChatBox"
import { useAuth } from "@/contexts/AuthContext"

export default function ChatPage() {

  const router = useRouter()
  const { state: { user } } = useAuth()

  const [orderId, setOrderId] = useState<string | null>(null)

  // =========================
  // GET ORDER ID
  // =========================
  useEffect(() => {

    if (!router.isReady) return

    const id = router.query.orderId as string

    if (id) {
      setOrderId(id)
    }

  }, [router.isReady, router.query])

  // =========================
  // LOADING
  // =========================
  if (!orderId || !user) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading chat...
      </div>
    )
  }

  // =========================
  // RENDER
  // =========================
  return (
    <div className="h-screen">

      <ChatBox
        orderId={orderId}
        userId={String(user.id)}
        role={user.role as "user" | "technician"} // "user" | "technician"
      />

    </div>
  )
}