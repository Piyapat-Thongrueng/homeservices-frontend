import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"

export default function RegisterPage() {

  const router = useRouter()

  // =========================
  // STATE (เพิ่ม logic only)
  // =========================

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [accept, setAccept] = useState(false)

  const [loading, setLoading] = useState(false)

  // OAuth loading
  const [oauthLoading, setOauthLoading] = useState<null | "facebook" | "google">(null)

  // error state
  const [nameError, setNameError] = useState("")
  const [phoneError, setPhoneError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [acceptError, setAcceptError] = useState("")


  // =========================
  // VALIDATION FUNCTION
  // =========================

  const validate = () => {

    let valid = true

    setNameError("")
    setPhoneError("")
    setEmailError("")
    setPasswordError("")
    setAcceptError("")

    const nameRegex = /^[A-Za-z'-]+(?: [A-Za-z'-]+)*$/
    const phoneRegex = /^[0-9]{10}$/
    const emailRegex = /^[^\s@]+@[^\s@]+\.com$/


    if (!name.trim()) {

      setNameError("โปรดกรอกชื่อ - นามสกุล")
      valid = false

    }
    else if (!nameRegex.test(name)) {

      setNameError("ชื่อใช้ได้เฉพาะ A-Z a-z ' -")
      valid = false

    }


    if (!phone.trim()) {

      setPhoneError("โปรดกรอกเบอร์โทรศัพท์")
      valid = false

    }
    else if (!phoneRegex.test(phone)) {

      setPhoneError("เบอร์โทรต้องเป็นตัวเลข 10 หลัก")
      valid = false

    }


    if (!email.trim()) {

      setEmailError("โปรดกรอกอีเมล")
      valid = false

    }
    else if (!emailRegex.test(email)) {

      setEmailError("email ต้องมี @ และ .com")
      valid = false

    }


    // ตามโจทย์ ต้อง ≥ 12 ตัว
    if (!password.trim()) {

      setPasswordError("โปรดกรอกรหัสผ่าน")
      valid = false

    }
    else if (password.length < 12) {

      setPasswordError("รหัสผ่านต้องมีอย่างน้อย 12 ตัวอักษร")
      valid = false

    }


    if (!accept) {

      setAcceptError("กรุณายอมรับ policy")
      valid = false

    }


    return valid

  }


  // =========================
  // REGISTER FUNCTION
  // =========================

  const handleRegister = async (e: React.FormEvent) => {

    e.preventDefault()

    if (loading) return

    const isValid = validate()

    if (!isValid) return

    setLoading(true)

    try {

      const { error } = await supabase.auth.signUp({

        email,

        password,

        options: {

          data: {

            name,
            phone,

          },

        },

      })

      if (error) {

        alert("สมัครสมาชิกไม่สำเร็จ: " + error.message)
        setLoading(false)
        return

      }

      alert("สมัครสมาชิกสำเร็จ")

      router.push("/auth/login")

    }
    catch (err: any) {

      alert("เกิดข้อผิดพลาด")

    }
    finally {

      setLoading(false)

    }

  }


  // =========================
  // OAUTH LOGIN / REGISTER
  // =========================

  const handleOAuthLogin = async (provider: "facebook" | "google") => {

    if (oauthLoading) return

    setOauthLoading(provider)

    try {

      const { error } = await supabase.auth.signInWithOAuth({

        provider,

        options: {

          redirectTo: `${window.location.origin}/`

        }

      })

      if (error) {

        alert("เข้าสู่ระบบไม่สำเร็จ: " + error.message)

      }

    }
    catch (err: any) {

      alert("เกิดข้อผิดพลาด")

    }
    finally {

      setOauthLoading(null)

    }

  }


  // =========================
  // UI 
  // =========================

  return (
    <div className="min-h-screen bg-[#F6F7FB] flex justify-center px-4 py-10 sm:py-16">

      <div className="w-full max-w-[420px] bg-white border border-[#E4E7EC] rounded-[8px] px-5 py-6 sm:px-8 sm:py-8">

        <h1 className="text-center text-[20px] sm:text-[24px] font-semibold text-[#101828] mb-6">
          ลงทะเบียน
        </h1>

        <form className="space-y-4" onSubmit={handleRegister}>

          {/* NAME */}
          <div>
            <label className="block text-[14px] font-medium text-[#344054] mb-1">
              ชื่อ - นามสกุล<span className="text-[#D92D20]">*</span>
            </label>

            <input
              type="text"
              placeholder="กรุณากรอกชื่อ นามสกุล"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-[44px] px-3 text-[14px] border border-[#D0D5DD] rounded-[6px] outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />

            {nameError && (
              <p className="text-[12px] text-red-500 mt-1">
                {nameError}
              </p>
            )}
          </div>


          {/* PHONE */}
          <div>
            <label className="block text-[14px] font-medium text-[#344054] mb-1">
              เบอร์โทรศัพท์<span className="text-[#D92D20]">*</span>
            </label>

            <input
              type="text"
              placeholder="กรุณากรอกเบอร์โทรศัพท์"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-[44px] px-3 text-[14px] border border-[#D0D5DD] rounded-[6px] outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />

            {phoneError && (
              <p className="text-[12px] text-red-500 mt-1">
                {phoneError}
              </p>
            )}
          </div>


          {/* EMAIL */}
          <div>
            <label className="block text-[14px] font-medium text-[#344054] mb-1">
              อีเมล<span className="text-[#D92D20]">*</span>
            </label>

            <input
              type="email"
              placeholder="กรุณากรอกอีเมล"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-[44px] px-3 text-[14px] border border-[#D0D5DD] rounded-[6px] outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />

            {emailError && (
              <p className="text-[12px] text-red-500 mt-1">
                {emailError}
              </p>
            )}
          </div>


          {/* PASSWORD */}
          <div>
            <label className="block text-[14px] font-medium text-[#344054] mb-1">
              รหัสผ่าน<span className="text-[#D92D20]">*</span>
            </label>

            <input
              type="password"
              placeholder="กรุณากรอกรหัสผ่าน"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-[44px] px-3 text-[14px] border border-[#D0D5DD] rounded-[6px] outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />

            {passwordError && (
              <p className="text-[12px] text-red-500 mt-1">
                {passwordError}
              </p>
            )}
          </div>


          {/* CHECKBOX */}
          <div className="flex gap-2 text-[13px] text-[#667085]">
            <input
              type="checkbox"
              className="mt-1"
              checked={accept}
              onChange={(e) => setAccept(e.target.checked)}
            />

            <span>
              ยอมรับ{" "}
              <span className="text-blue-600 underline cursor-pointer">
                ข้อตกลงและเงื่อนไข
              </span>{" "}
              และ{" "}
              <span className="text-blue-600 underline cursor-pointer">
                นโยบายความเป็นส่วนตัว
              </span>
            </span>
          </div>

          {acceptError && (
            <p className="text-[12px] text-red-500">
              {acceptError}
            </p>
          )}


          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full h-[44px]"
          >
            {loading ? "กำลังสมัคร..." : "ลงทะเบียน"}
          </button>

        </form>


        {/* DIVIDER */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 border-t border-[#E4E7EC]" />
          <span className="text-[12px] text-[#98A2B3]">
            หรือสมัครด้วย
          </span>
          <div className="flex-1 border-t border-[#E4E7EC]" />
        </div>


        {/* FACEBOOK */}
        <button
          onClick={() => handleOAuthLogin("facebook")}
          disabled={oauthLoading !== null}
          className="btn-secondary w-full h-[44px] flex items-center justify-center gap-2 mb-3"
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


        {/* GOOGLE */}
        <button
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
            

        {/* BACK TO LOGIN */}
        <p className="text-center text-[13px] text-blue-600 underline mt-6">
          <Link href="/auth/login">
            กลับไปหน้าเข้าสู่ระบบ
          </Link>
        </p>

      </div>

    </div>
  )

}