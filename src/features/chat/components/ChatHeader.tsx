import { useRouter } from "next/router"

type ChatUser = {
  id: string
  name: string
  avatar?: string
}

type Props = {
  otherUser: ChatUser | null
  orderId?: string | number
  onClose?: () => void
}

export default function ChatHeader({ otherUser, orderId, onClose }: Props) {

  const router = useRouter()

  const defaultAvatar =
    "https://cdn-icons-png.flaticon.com/512/149/149071.png"

  // 🔥 FIX: fallback ให้ดูสมจริง
  const displayName =
    otherUser?.name && otherUser.name.trim() !== ""
      ? otherUser.name
      : "ช่างผู้ให้บริการ" // หรือ "ช่าง" / "ลูกค้า" ก็ได้

  const handleBack = () => {
    if (onClose) {
      onClose()
      return
    }
    const raw = router.query.profileTab
    const tab =
      typeof raw === "string" && (raw === "orders" || raw === "history")
        ? raw
        : null
    if (tab) {
      void router.push({ pathname: "/profile", query: { tab } })
      return
    }
    router.back()
  }

  return (

    <div className="flex items-center gap-3 px-4 py-3 bg-blue-600 text-white shadow-md">

      {/* 🔙 BACK */}
      <button
        type="button"
        onClick={handleBack}
        className="text-xl font-bold active:scale-90 transition cursor-pointer"
      >
        ←
      </button>

      {/* AVATAR */}
      <img
        src={otherUser?.avatar || defaultAvatar}
        className="w-9 h-9 rounded-full object-cover border border-white"
      />

      {/* INFO */}
      <div className="flex flex-col leading-tight">

        {/* 🔥 TITLE = งาน */}
        <span className="text-sm font-semibold">
          งาน #{orderId || "-"}
        </span>

        {/* 🔥 SUBTITLE */}
        <span className="text-xs text-blue-100">
          {displayName}
        </span>

      </div>

    </div>
  )
}