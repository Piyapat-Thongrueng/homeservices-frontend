import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"

export default function ProtectedRoute({
  children
}: {
  children: React.ReactNode
}) {

  const router = useRouter()

  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const checkSession = async () => {

      // ตรวจ session จาก Supabase
      const { data, error } =
        await supabase.auth.getSession()

      if (error || !data.session) {

        // ถ้าไม่มี session → redirect ไป login
        router.replace("/auth/login")

      } else {

        // มี session → ให้เข้า page ได้
        setLoading(false)

      }

    }

    checkSession()

  }, [router])

  // ป้องกัน page render ก่อนตรวจเสร็จ
  if (loading) {
    return null
  }

  return <>{children}</>

}