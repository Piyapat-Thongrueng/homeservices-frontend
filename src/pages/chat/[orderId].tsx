import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import ChatBox from "@/features/chat/components/ChatBox"
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

    const id = router.query.orderId

    // 🔥 กัน undefined / array
    if (typeof id === "string") {
      setOrderId(id)
    }

  }, [router.isReady, router.query.orderId])


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
  // VALIDATE ROLE (ฝั่งลูกค้า)
  // =========================
  const role: "user" = "user" // 🔥 fix role ให้เป็นลูกค้าเสมอ

  // =========================
  // RENDER
  // =========================
  return (
    <div className="h-screen">

      <ChatBox
        orderId={orderId}
        userId={String(user.id)}
        role={role}
      />

    </div>
  )
}