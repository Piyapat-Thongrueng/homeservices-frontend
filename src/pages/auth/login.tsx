import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"

export default function LoginPage() {

  // state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const [oauthLoading, setOauthLoading] = useState<null | "facebook" | "google">(null)

  // ✅ message state (reset password success)
  const [message, setMessage] = useState("")

  const router = useRouter()

  // =========================
  // VALIDATION REGEX
  // =========================

  const emailRegex = /^[^\s@]+@[^\s@]+\.com$/


  // =========================
  // AUTO REDIRECT IF LOGGED IN
  // ✅ ONLY VERIFIED USER
  // =========================

  useEffect(() => {

    const checkUser = async () => {

      const { data } = await supabase.auth.getUser()

      if (
        data.user &&
        data.user.email_confirmed_at
      ) {
        router.replace("/")    // === redirect ไปที่หน้าไหน === //
      }

    }

    checkUser()

  }, [router])


  // =========================
  // SHOW RESET SUCCESS MESSAGE
  // =========================

  useEffect(() => {

    if (!router.isReady) return

    if (router.query.reset === "success") {

      setMessage("Password updated successfully. Please login.")

      router.replace("/auth/login", undefined, { shallow: true })

    }

  }, [router.isReady, router.query])


  // =========================
  // EMAIL LOGIN FUNCTION
  // =========================

  const handleLogin = async (e: React.FormEvent) => {

    e.preventDefault()

    if (loading) return

    if (!email || !password) {
      alert("กรุณากรอก email และ password")
      return
    }

    if (!emailRegex.test(email)) {
      alert("รูปแบบอีเมลไม่ถูกต้อง ต้องมี @ และ .com")
      return
    }

    if (password.length < 12) {
      alert("รหัสผ่านต้องมีอย่างน้อย 12 ตัวอักษร")
      return
    }

    setLoading(true)

    try {

      // =========================
      // LOGIN WITH SUPABASE AUTH
      // =========================

      const { data, error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        })

      if (error || !data.user) {
        alert("เข้าสู่ระบบไม่สำเร็จ: " + error?.message)
        return
      }

      // =========================
      // ✅ EMAIL VERIFICATION CHECK
      // =========================

      if (!data.user.email_confirmed_at) {

        await supabase.auth.signOut()

        alert("กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ")
        return
      }

      // =========================
      // LOAD PROFILE FROM users TABLE
      // =========================

      const { data: profile, error: profileError } =
        await supabase
          .from("users")
          .select("*")
          .eq("auth_user_id", data.user.id)
          .single()

      if (profileError || !profile) {
        alert("ไม่พบข้อมูลผู้ใช้ในระบบ")
        return
      }

      // =========================
      // SAVE USER TO LOCAL STORAGE
      // =========================

      localStorage.setItem(
        "user",
        JSON.stringify(profile)
      )

      localStorage.setItem(
        "access_token",
        data.session?.access_token || ""
      )

      alert("เข้าสู่ระบบสำเร็จ")

      router.replace("/")

    }
    catch (err: any) {

      alert("เกิดข้อผิดพลาด")

    }
    finally {

      setLoading(false)

    }

  }


  // =========================
  // OAUTH LOGIN FUNCTION
  // ✅ GOOGLE / FACEBOOK VERIFY SAFE
  // =========================

  const handleOAuthLogin = async (provider: "facebook" | "google") => {

    if (oauthLoading) return

    setOauthLoading(provider)

    try {

      const { error } = await supabase.auth.signInWithOAuth({

        provider,

        options: {

          // ✅ ไปตรวจ verify ต่อที่ callback
          redirectTo:
            `${window.location.origin}/auth/oauth-callback`

        }

      })

      if (error) {

        alert("เข้าสู่ระบบไม่สำเร็จ: " + error.message)
        setOauthLoading(null)

      }

    }
    catch (err: any) {

      alert("เกิดข้อผิดพลาด")
      setOauthLoading(null)

    }

  }


  return (
    <div className="min-h-screen bg-[#F6F7FB] flex justify-center px-4 py-10 sm:py-16">

      <div className="w-full max-w-[420px] bg-white border border-[#E4E7EC] rounded-[8px] px-5 py-6 sm:px-8 sm:py-8">

        <h1 className="text-center text-[20px] sm:text-[24px] font-semibold text-[#101828] mb-6">
          เข้าสู่ระบบ
        </h1>

        {message && (
          <div className="mb-4 text-green-600 text-sm text-center">
            {message}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>

          <div>
            <label className="block text-[14px] font-medium text-[#344054] mb-1">
              อีเมล
            </label>

            <input
              type="email"
              placeholder="กรุณากรอกอีเมล"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-[44px] px-3 text-[14px] border border-[#D0D5DD] rounded-[6px]"
            />
          </div>

          <div>
            <label className="block text-[14px] font-medium text-[#344054] mb-1">
              รหัสผ่าน
            </label>

            <input
              type="password"
              placeholder="กรุณากรอกรหัสผ่าน"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-[44px] px-3 text-[14px] border border-[#D0D5DD] rounded-[6px]"
            />
          </div>

          <div className="text-right">
            <Link
              href="/auth/forgot-password"
              className="text-[13px] text-blue-600 underline"
            >
              ลืมรหัสผ่าน?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full h-[44px]"
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>

        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 border-t border-[#E4E7EC]" />
          <span className="text-[12px] text-[#98A2B3]">
            หรือลงชื่อเข้าใช้ผ่าน
          </span>
          <div className="flex-1 border-t border-[#E4E7EC]" />
        </div>

        <button
          type="button"
          onClick={() => handleOAuthLogin("facebook")}
          disabled={oauthLoading !== null}
          className="btn-secondary w-full h-[44px] mb-3"
        >
          <img
            src="/icons/facebook_logos_.png"
            alt="Facebook"
            className="w-[18px] h-[18px]"
          />
          {oauthLoading === "facebook"
            ? "กำลังเข้าสู่ระบบ..."
            : "เข้าสู่ระบบด้วย Facebook"}
        </button>

        <button
          type="button"
          onClick={() => handleOAuthLogin("google")}
          disabled={oauthLoading !== null}
          className="btn-secondary w-full h-[44px]"
        >
              <img
            src="/icons/google_logos_.png"
            alt="Facebook"
            className="w-[18px] h-[18px]"
          />
          {oauthLoading === "google"
            ? "กำลังเข้าสู่ระบบ..."
            : "เข้าสู่ระบบด้วย Google"}
        </button>

        <p className="text-center text-[13px] text-[#667085] mt-6">
          ยังไม่มีบัญชีผู้ใช้ HomeService?{" "}
          <Link href="/auth/register" className="text-blue-600 underline">
            ลงทะเบียน
          </Link>
        </p>

      </div>

    </div>
  )
}