import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#F6F7FB] flex justify-center px-4 py-10 sm:py-16">

      <div className="w-full max-w-[420px] bg-white border border-[#E4E7EC] rounded-[8px] px-5 py-6 sm:px-8 sm:py-8">

        <h1 className="text-center text-[20px] sm:text-[24px] font-semibold text-[#101828] mb-6">
          ลงทะเบียน
        </h1>

        <form className="space-y-4">

          {/* Name */}
          <div>
            <label className="block text-[14px] font-medium text-[#344054] mb-1">
              ชื่อ - นามสกุล<span className="text-[#D92D20]">*</span>
            </label>

            <input
              type="text"
              placeholder="กรุณากรอกชื่อ นามสกุล"
              className="w-full h-[44px] px-3 text-[14px] border border-[#D0D5DD] rounded-[6px] outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-[14px] font-medium text-[#344054] mb-1">
              เบอร์โทรศัพท์<span className="text-[#D92D20]">*</span>
            </label>

            <input
              type="text"
              placeholder="กรุณากรอกเบอร์โทรศัพท์"
              className="w-full h-[44px] px-3 text-[14px] border border-[#D0D5DD] rounded-[6px] outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>

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

          {/* Checkbox */}
          <div className="flex gap-2 text-[13px] text-[#667085]">
            <input type="checkbox" className="mt-1" />

            <span>
              ยอมรับ{" "}
              <span className="text-brand-600 text-blue-600 underline hover:underline cursor-pointer">
                ข้อตกลงและเงื่อนไข
              </span>{" "}
              และ{" "}
              <span className="text-brand-600 text-blue-600 underline hover:underline cursor-pointer">
                นโยบายความเป็นส่วนตัว
              </span>
            </span>
          </div>

          <button className="btn-primary w-full h-[44px]">
            ลงทะเบียน
          </button>

        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 border-t border-[#E4E7EC]" />
          <span className="text-[12px] text-[#98A2B3]">
            หรือสมัครด้วย
          </span>
          <div className="flex-1 border-t border-[#E4E7EC]" />
        </div>

        {/* Facebook */}
        <button className="btn-secondary w-full h-[44px]">

        <img
  src="/icons/facebook_logos_.png"
  alt="Facebook"
  className="w-[18px] h-[18px]"
/>

          เข้าสู่ระบบด้วย Facebook
        </button>

        <p className="text-center text-[13px] text-blue-600 underline text-brand-600 mt-6">
          <Link href="/auth/login" className="hover:underline">
            กลับไปหน้าเข้าสู่ระบบ
          </Link>
        </p>

      </div>

    </div>
  )
}
