import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F6F7FB] flex justify-center md:px-4 md:py-10 sm:py-16">

      {/* Card */}
      <div className="w-full max-w-[420px] bg-white border border-[#E4E7EC] rounded-[8px] px-5 py-6 sm:px-8 sm:py-8">

        {/* Title */}
        <h1 className="text-center text-[20px] sm:text-[24px] font-semibold text-[#101828] mb-6">
          เข้าสู่ระบบ
        </h1>

        {/* Form */}
        <form className="space-y-4">

          {/* Email */}
          <div>
            <label className="block text-[14px] font-medium text-[#344054] mb-1">
              อีเมล<span className="text-[#D92D20]">*</span>
            </label>

            <input
              type="email"
              placeholder="กรุณากรอกอีเมล"
              className="w-full h-[44px] px-3 text-[14px] border border-[#D0D5DD] rounded-[6px] outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-[14px] font-medium text-[#344054] mb-1">
              รหัสผ่าน<span className="text-[#D92D20]">*</span>
            </label>

            <input
              type="password"
              placeholder="กรุณากรอกรหัสผ่าน"
              className="w-full h-[44px] px-3 text-[14px] border border-[#D0D5DD] rounded-[6px] outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>

          {/* Login Button */}
          <button className="btn-primary w-full h-[44px]">
            เข้าสู่ระบบ
          </button>

        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 border-t border-[#E4E7EC]" />
          <span className="text-[12px] text-[#98A2B3]">
            หรือลงชื่อเข้าใช้ผ่าน
          </span>
          <div className="flex-1 border-t border-[#E4E7EC]" />
        </div>

        {/* Facebook Button */}
        <button className="btn-secondary w-full h-[44px]">
        <img
  src="/icons/facebook_logos_.png"
  alt="Facebook"
  className="w-[18px] h-[18px]"
/>


          เข้าสู่ระบบด้วย Facebook
        </button>

        {/* Register link */}
        <p className="text-center text-[13px] text-[#667085] mt-6">
          ยังไม่มีบัญชีผู้ใช้ HomeService?{" "}
          <Link href="/auth/register" className="text-brand-600 text-blue-600 underline font-medium hover:underline">
            ลงทะเบียน
          </Link>
        </p>

      </div>

    </div>
  )
}
