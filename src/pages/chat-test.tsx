import { useState } from "react"
import { useRouter } from "next/router"
import ChatBox from "@/features/chat/components/ChatBox"

export default function ChatPage() {

  const router = useRouter()

  // ถ้า URL ไม่มี orderId จะใช้ mock สำหรับ test
  const orderId =
    (router.query.orderId as string) ||
    "11111111-1111-1111-1111-111111111111"

  const [role, setRole] =
    useState<"user" | "technician">("user")

  const userId =
    role === "user"
      ? "22222222-2222-2222-2222-222222222222"
      : "a8df9bde-b3e6-45aa-80af-5fb7271cae73"

  return (

    <div style={{ padding: "40px" }}>

      <div style={{ marginBottom: "20px" }}>

        <button onClick={() => setRole("user")}>
          User
        </button>

        <button
          style={{ marginLeft: "10px" }}
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