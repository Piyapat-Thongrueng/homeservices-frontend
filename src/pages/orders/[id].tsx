import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import ChatBox from "@/features/chat/components/ChatBox"
import { useAuth } from "@/contexts/AuthContext"

type Order = {
  id: string // ✅ UUID จริง
  status: string
}

export default function OrderDetail() {

  const router = useRouter()
  const { id, role } = router.query

  const { state } = useAuth()
  const userId = state.user?.id?.toString()

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  // =========================
  // LOAD ORDER (REAL API)
  // =========================
  useEffect(() => {

    if (!id) return

    const loadOrder = async () => {

      try {

        const res = await fetch(
          `http://localhost:4000/api/orders/${id}`
        )

        if (!res.ok) throw new Error("Failed to fetch order")

        const data = await res.json()

        setOrder(data)

      } catch (err) {
        console.error("❌ Load order error:", err)
      } finally {
        setLoading(false)
      }

    }

    loadOrder()

  }, [id])

  // =========================
  // UI STATES
  // =========================

  if (loading) {
    return <div style={{ padding: 40 }}>Loading...</div>
  }

  if (!order) {
    return <div style={{ padding: 40 }}>Order not found</div>
  }

  // =========================
  // CONDITIONS
  // =========================

  const isPaid = order.status === "paid"

  // =========================
  // UI
  // =========================

  return (

    <div style={{ padding: "40px" }}>

      <h1>Order Detail</h1>

      <p><b>Order ID:</b> {order.id}</p>
      <p><b>Status:</b> {order.status}</p>

      {/* =========================
         CHAT SECTION
      ========================= */}

      {isPaid && userId && role && (

        <div style={{ marginTop: 30 }}>

          <h2>💬 Chat</h2>

          <ChatBox
            orderId={order.id}   // ✅ UUID จริง
            userId={userId}
            role={role as "user" | "technician"}
          />

        </div>

      )}

      {!isPaid && (
        <div style={{ marginTop: 20, color: "#999" }}>
          💡 แชทจะเปิดหลังจากชำระเงินแล้ว
        </div>
      )}

    </div>

  )

}