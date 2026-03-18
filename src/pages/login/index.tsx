import Link from "next/link";
import { useState } from "react";
import type { ChangeEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AuthenticationRoute from "@/components/auth/AuthenticationRoute";
import LoginModal from "./LoginModal";
import { Mail, Lock, Eye, EyeOff, Wrench, ArrowLeft } from "lucide-react";

interface FormErrors {
  email: string;
  password: string;
}

const initialErrors: FormErrors = {
  email: "",
  password: "",
};

export default function LoginPage() {
  const { login, state, isAuthenticated, loginWithGoogle, fetchUser } =
    useAuth();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>(initialErrors);
  const [modalType, setModalType] = useState<"success" | "error" | null>(null);
  const [apiError, setApiError] = useState<string>("");

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

  const handleLogin = async (e: React.SyntheticEvent): Promise<void> => {
    e.preventDefault();
    if (state.loading) return;
    if (!validate()) return;

    const result = await login({ email, password });

    if (result?.error) {
      setApiError(result.error);
      setModalType("error");
      return;
    }
    if (result?.role !== "user") {
      localStorage.removeItem("token");
      await fetchUser();
      setApiError("บัญชีนี้ไม่สามารถเข้าใช้งานระบบนี้ได้");
      setModalType("error");
      return;
    }
    setModalType("success");
  };

  const handleCloseModal = (): void => {
    setModalType(null);
    setApiError("");
  };

  return (
    <AuthenticationRoute
      isLoading={state.getUserLoading}
      isAuthenticated={isAuthenticated}
      bypassRedirect={modalType === "success"}
    >
      {modalType && (
        <LoginModal
          type={modalType}
          errorMessage={apiError}
          onClose={handleCloseModal}
        />
      )}

      <div className="min-h-screen bg-[#F6F7FB] flex items-center justify-center px-4 py-10 font-prompt">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl px-8 py-10 shadow-sm">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-[32px] font-bold text-gray-900">เข้าสู่ระบบ</h1>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            {/* EMAIL */}
            <div>
              <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                อีเมล <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="กรุณากรอกอีเมลของคุณ"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  className={`w-full h-11 pl-10 pr-4 text-[14px] bg-gray-50 border rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all ${
                    errors.email
                      ? "border-red-400 focus:border-red-400"
                      : "border-gray-200 focus:border-blue-500"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-[12px] text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                รหัสผ่าน <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="กรุณากรอกรหัสผ่านของคุณ"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  className={`w-full h-11 pl-10 pr-10 text-[14px] bg-gray-50 border rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all ${
                    errors.password
                      ? "border-red-400 focus:border-red-400"
                      : "border-gray-200 focus:border-blue-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
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
                className="text-[13px] text-blue-600 hover:underline"
              >
                ลืมรหัสผ่าน?
              </Link>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={state.loading ?? false}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-[14px] font-semibold rounded-xl transition-colors shadow-md shadow-blue-100 cursor-pointer"
            >
              {state.loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 border-t border-gray-100" />
            <span className="text-[12px] text-gray-400">
              หรือลงชื่อเข้าใช้ผ่าน
            </span>
            <div className="flex-1 border-t border-gray-100" />
          </div>

          {/* GOOGLE */}
          <button
            type="button"
            onClick={loginWithGoogle}
            className="w-full h-11 border border-gray-200 rounded-xl flex items-center justify-center gap-2.5 hover:bg-gray-50 transition-colors cursor-pointer text-[14px] text-gray-700 font-medium"
          >
            <img
              src="/icons/google_logos_.png"
              alt="Google"
              className="w-4.5 h-4.5"
            />
            เข้าสู่ระบบด้วยบัญชี Google
          </button>

          {/* FACEBOOK — disabled */}
          <button
            type="button"
            disabled
            className="w-full h-11 border border-gray-200 rounded-xl flex items-center justify-center gap-2.5 mt-3 opacity-40 cursor-not-allowed text-[14px] text-gray-600 font-medium"
          >
            <img
              src="/icons/facebook_logos_.png"
              alt="Facebook"
              className="w-4.5 h-4.5"
            />
            เข้าสู่ระบบด้วย Facebook
          </button>

          {/* REGISTER LINK + BACK TO HOME */}
          <p className="text-center text-[14px] text-gray-400 mt-6">
            ยังไม่มีบัญชีผู้ใช้ HomeServices?{" "}
            <Link
              href="/register"
              className="text-blue-600 font-semibold hover:underline"
            >
              ลงทะเบียน
            </Link>
          </p>

          {/* BACK TO HOME */}
          <div className="mt-5 pt-5 border-t border-gray-100 flex justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[13px] text-gray-500 hover:text-blue-600 font-medium transition-colors group"
            >
              <span className="w-7 h-7 rounded-full bg-gray-100 group-hover:bg-blue-50 flex items-center justify-center transition-colors">
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              </span>
              กลับไปยังหน้าหลัก
            </Link>
          </div>
        </div>
      </div>
    </AuthenticationRoute>
  );
}
