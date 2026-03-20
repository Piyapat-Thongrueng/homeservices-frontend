import Link from "next/link"
import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function ForgotPasswordPage() {

  // =========================
  // STATE
  // =========================

  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const emailRegex = /^[^\s@]+@[^\s@]+\.com$/


  // =========================
  // HANDLE RESET PASSWORD
  // =========================

  const handleResetPassword = async (
    e: React.FormEvent
  ) => {

    e.preventDefault()

    if (loading) return

    // validate empty
    if (!email) {
      alert("กรุณากรอกอีเมล")
      return
    }

    // validate email format
    if (!emailRegex.test(email)) {
      alert("รูปแบบอีเมลไม่ถูกต้อง ต้องมี @ และ .com")
      return
    }

    setLoading(true)

    try {

      const { error } =
        await supabase.auth.resetPasswordForEmail(
          email,
          {
            redirectTo:
              `${window.location.origin}/auth/update-password`
          }
        )

      if (error) {
        alert("เกิดข้อผิดพลาด: " + error.message)
        return
      }

      alert(
        "ส่งลิงก์รีเซ็ตรหัสผ่านแล้ว กรุณาตรวจสอบอีเมลของคุณ"
      )

    }
    catch {

      alert("เกิดข้อผิดพลาด")

    }
    finally {

      setLoading(false)

    }

  }


  // =========================
  // UI
  // =========================

  return (

    <div className="min-h-screen bg-[#F6F7FB] flex justify-center px-4 py-10 sm:py-16">

      <div className="w-full max-w-[420px] bg-white border border-[#E4E7EC] rounded-[8px] px-5 py-6 sm:px-8 sm:py-8">

        <h1 className="text-center text-[20px] sm:text-[24px] font-semibold text-[#101828] mb-6">
          ลืมรหัสผ่าน
        </h1>


        <form
          className="space-y-4"
          onSubmit={handleResetPassword}
        >

          <div>

            <label className="block text-[14px] font-medium text-[#344054] mb-1">
              อีเมล
            </label>

            <input
              type="email"
              placeholder="กรุณากรอกอีเมล"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full h-[44px] px-3 text-[14px] border border-[#D0D5DD] rounded-[6px] outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />

          </div>


          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full h-[44px]"
          >
            {loading
              ? "กำลังส่ง..."
              : "ส่งลิงก์รีเซ็ตรหัสผ่าน"}
          </button>

        </form>


        <p className="text-center text-[13px] text-[#667085] mt-6">

          กลับไป{" "}

          <Link
            href="/auth/login"
            className="text-blue-600 underline"
          >
            เข้าสู่ระบบ
          </Link>

        </p>

      </div>

    </div>

  )

}