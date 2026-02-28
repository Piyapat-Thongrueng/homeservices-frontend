import { useEffect } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"

export default function OAuthCallback() {

  const router = useRouter()

  useEffect(() => {

    if (!router.isReady) return

    const checkUser = async () => {

      const { data } = await supabase.auth.getUser()

      // ❌ ไม่มี session
      if (!data.user) {
        router.replace("/auth/login")
        return
      }

      // ❌ ยังไม่ verify email
      if (!data.user.email_confirmed_at) {

        await supabase.auth.signOut()

        alert("บัญชีนี้ยังไม่ได้ยืนยันอีเมล")

        router.replace("/auth/login")
        return
      }

      // ✅ login success
      router.replace("/")

    }

    checkUser()

  }, [router.isReady])

  return <p>กำลังเข้าสู่ระบบ...</p>
}