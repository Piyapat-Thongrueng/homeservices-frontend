import Link from "next/link";
import { useState } from "react";
import type { ChangeEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AuthenticationRoute from "@/components/auth/AuthenticationRoute";
import LoginModal from "./LoginModal";

interface FormErrors {
  email: string;
  password: string;
}

const initialErrors: FormErrors = {
  email: "",
  password: "",
};

export default function LoginPage() {
  const { login, state, isAuthenticated } = useAuth();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>(initialErrors);

  const [modalType, setModalType] = useState<"success" | "error" | null>(null);
  const [apiError, setApiError] = useState<string>("");

  // ฟังก์ชันสำหรับตรวจสอบความถูกต้องของฟอร์ม

  const validate = (): boolean => {
    const newErrors: FormErrors = { ...initialErrors };
    let valid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = "โปรดกรอกอีเมล";
      valid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = "รูปแบบอีเมลไม่ถูกต้อง";
      valid = false;
    }

    if (!password.trim()) {
      newErrors.password = "โปรดกรอกรหัสผ่าน";
      valid = false;
    } else if (password.length < 8) {
      newErrors.password = "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // ฟังก์ชันสำหรับจัดการการเข้าสู่ระบบ และแสดง modal ตามผลลัพธ์
  const handleLogin = async (e: React.SyntheticEvent): Promise<void> => {
    e.preventDefault();
    if (state.loading) return;
    if (!validate()) return;

    const result = await login({ email, password });

    if (result?.error) {
      setApiError(result.error);
      setModalType("error");
    } else {
      setModalType("success");
    }
  };

  // ฟังก์ชันสำหรับปิด modal
  const handleCloseModal = (): void => {
    setModalType(null);
    setApiError("");
  };

  // UI
  return (
    <AuthenticationRoute
      isLoading={state.getUserLoading}
      isAuthenticated={isAuthenticated}
      bypassRedirect={modalType === "success"}
    >
      {/* Modal */}
      {modalType && (
        <LoginModal
          type={modalType}
          errorMessage={apiError}
          onClose={handleCloseModal}
        />
      )}

      <div className="min-h-screen bg-[#F6F7FB] flex justify-center px-4 py-10 sm:py-16">
        <div className="w-full max-w-105 bg-white border border-[#E4E7EC] rounded-md px-5 py-6 sm:px-8 sm:py-8">
          <h1 className="text-center text-[20px] sm:text-[24px] font-semibold text-[#101828] mb-6">
            เข้าสู่ระบบ
          </h1>

          <form className="space-y-4" onSubmit={handleLogin}>
            {/* EMAIL */}
            <div>
              <label className="block text-[14px] font-medium text-[#344054] mb-1">
                อีเมล
              </label>
              <input
                type="email"
                placeholder="กรุณากรอกอีเมล"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                className="w-full h-11 px-3 text-[14px] border border-[#D0D5DD] rounded-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
              {errors.email && (
                <p className="text-[12px] text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-[14px] font-medium text-[#344054] mb-1">
                รหัสผ่าน
              </label>
              <input
                type="password"
                placeholder="กรุณากรอกรหัสผ่าน"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                className="w-full h-11 px-3 text-[14px] border border-[#D0D5DD] rounded-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
              {errors.password && (
                <p className="text-[12px] text-red-500 mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* FORGOT PASSWORD */}
            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-[13px] text-blue-600 underline"
              >
                ลืมรหัสผ่าน?
              </Link>
            </div>

            <button
              type="submit"
              disabled={state.loading ?? false}
              className="btn-primary w-full h-11 text-[14px]"
            >
              {state.loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 border-t border-[#E4E7EC]" />
            <span className="text-[12px] text-[#98A2B3]">
              หรือลงชื่อเข้าใช้ผ่าน
            </span>
            <div className="flex-1 border-t border-[#E4E7EC]" />
          </div>

          {/* FACEBOOK — UI only */}
          <button
            type="button"
            disabled
            className="btn-secondary w-full h-11 flex items-center justify-center gap-2 mb-3 opacity-50 cursor-not-allowed"
          >
            <img
              src="/icons/facebook_logos_.png"
              alt="Facebook"
              className="w-4.5 h-4.5"
            />
            เข้าสู่ระบบด้วย Facebook
          </button>

          {/* GOOGLE — UI only */}
          <button
            type="button"
            disabled
            className="btn-secondary w-full h-11 flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
          >
            <img
              src="/icons/google_logos_.png"
              alt="Google"
              className="w-4.5 h-4.5"
            />
            เข้าสู่ระบบด้วย Google
          </button>

          {/* REGISTER LINK */}
          <p className="text-center text-[13px] text-[#667085] mt-6">
            ยังไม่มีบัญชีผู้ใช้ HomeService?{" "}
            <Link href="/register" className="text-blue-600 underline">
              ลงทะเบียน
            </Link>
          </p>
        </div>
      </div>
    </AuthenticationRoute>
  );
}
