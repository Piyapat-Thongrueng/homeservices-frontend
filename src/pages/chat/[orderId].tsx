import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import ChatBox from "@/components/chat/ChatBox"

export default function ChatPage() {

  const router = useRouter()

  const [orderId, setOrderId] = useState<string | null>(null)

  const [role, setRole] =
    useState<"user" | "technician">("user")

  // รอ router query โหลดก่อน
  useEffect(() => {

    if (!router.isReady) return

    const id = router.query.orderId as string

    if (id) {
      setOrderId(id)
    }

  }, [router.isReady, router.query])

  const userId =
    role === "user"
      ? "22222222-2222-2222-2222-222222222222"
      : "a8df9bde-b3e6-45aa-80af-5fb7271cae73"

  // loading ระหว่าง router ยังไม่พร้อม
  if (!orderId) {

    return (
      <div style={{ padding: 40 }}>
        Loading chat...
      </div>
    )

  }

  return (

    <div style={{ padding: 40 }}>

      <div style={{ marginBottom: 20 }}>

        <button onClick={() => setRole("user")}>
          User
        </button>

        <button
          style={{ marginLeft: 10 }}
          onClick={() => setRole("technician")}
        >
          Technician
        </button>

      </div>

      <ChatBox
        orderId={orderId}
        userId={userId}
        role={role}
      />

    </div>

  )

}