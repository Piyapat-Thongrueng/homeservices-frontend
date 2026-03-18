import { useRouter } from "next/router"

type ChatUser = {
  id: string
  name: string
  avatar?: string
}

type Props = {
  otherUser: ChatUser | null
  otherOnline: boolean
}

export default function ChatHeader({ otherUser, otherOnline }: Props) {

  const router = useRouter()

  const defaultAvatar =
    "https://cdn-icons-png.flaticon.com/512/149/149071.png"

  if (!otherUser) return null

  return (

    <div className="flex items-center gap-3 px-4 py-3 bg-blue-600 text-white shadow-sm">

      {/* BACK BUTTON */}
      <button
        onClick={() => router.back()}
        className="text-lg"
      >
        ←
      </button>

      {/* AVATAR */}
      <img
        src={otherUser.avatar || defaultAvatar}
        className="w-9 h-9 rounded-full object-cover"
      />

      {/* NAME + STATUS */}
      <div className="flex flex-col">

        <span className="text-sm font-semibold">
          {otherUser.name}
        </span>

        <div className="flex items-center gap-1 text-xs text-blue-100">

          <span
            className={`
              w-2 h-2 rounded-full
              ${otherOnline ? "bg-green-400" : "bg-gray-300"}
            `}
          />

          <span>
            {otherOnline ? "ออนไลน์" : "ออฟไลน์"}
          </span>

        </div>

      </div>

    </div>
  )
}