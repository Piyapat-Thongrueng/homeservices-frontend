import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AuthenticationRoute from "@/features/auth/components/AuthenticationRoute";
import RegisterModal from "./RegisterModal";
import { Mail, Lock, Eye, EyeOff, User, Phone, ArrowLeft } from "lucide-react";
import TermsModal from "./TermsModal";
import PrivacyModal from "./PrivacyModal";

interface FormErrors {
  name: string;
  phone: string;
  email: string;
  password: string;
  accept: string;
}

const initialErrors: FormErrors = {
  name: "",
  phone: "",
  email: "",
  password: "",
  accept: "",
};

export default function RegisterPage() {
  const { register, state, isAuthenticated } = useAuth();

  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [accept, setAccept] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>(initialErrors);
  const [modalType, setModalType] = useState<"success" | "error" | null>(null);
  const [apiError, setApiError] = useState<string>("");
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = { ...initialErrors };
    let valid = true;

    const nameRegex = /^[A-Za-zก-๙\s'-]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.trim()) {
      newErrors.name = "โปรดกรอกชื่อ - นามสกุล";
      valid = false;
    } else if (!nameRegex.test(name)) {
      newErrors.name = "ชื่อใช้ได้เฉพาะ A-Z a-z ภาษาไทย ' -";
      valid = false;
    }
    if (!phone.trim()) {
      newErrors.phone = "โปรดกรอกเบอร์โทรศัพท์";
      valid = false;
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = "เบอร์โทรต้องเป็นตัวเลข 10 หลัก";
      valid = false;
    }
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
    if (!accept) {
      newErrors.accept = "กรุณายอมรับข้อตกลงและเงื่อนไข";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleRegister = async (e: React.SyntheticEvent): Promise<void> => {
    e.preventDefault();
    if (state.loading) return;
    if (!validate()) return;

    const result = await register({ full_name: name, phone, email, password });

    if (result?.error) {
      setApiError(result.error);
      setModalType("error");
    } else {
      setModalType("success");
    }
  };

  const handleCloseModal = (): void => {
    setModalType(null);
    setApiError("");
  };

  return (
    <AuthenticationRoute
      isLoading={state.getUserLoading}
      isAuthenticated={isAuthenticated}
    >
      {modalType && (
        <RegisterModal
          type={modalType}
          errorMessage={apiError}
          onClose={handleCloseModal}
        />
      )}

      <div className="min-h-screen bg-[#F6F7FB] flex items-center justify-center px-4 py-10 font-prompt">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl px-8 py-10 shadow-sm">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-[32px] font-bold text-gray-900">ลงทะเบียน</h1>
            <p className="text-[16px] text-gray-500 mt-3">
              สร้างบัญชีใหม่เพื่อเริ่มต้นใช้งานเว็บไซต์ของเรา
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleRegister}>
            {/* NAME */}
            <div>
              <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                ชื่อ - นามสกุล <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="กรุณากรอกข้อมูลเป็นภาษาไทยหรืออังกฤษเท่านั้น"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full h-11 pl-10 pr-4 text-[14px] bg-gray-50 border rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all ${
                    errors.name
                      ? "border-red-400 focus:border-red-400"
                      : "border-gray-200 focus:border-blue-500"
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-[12px] text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            {/* PHONE */}
            <div>
              <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                เบอร์โทรศัพท์ <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  placeholder="กรุณากรอกเบอร์โทรศัพท์"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full h-11 pl-10 pr-4 text-[14px] bg-gray-50 border rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all ${
                    errors.phone
                      ? "border-red-400 focus:border-red-400"
                      : "border-gray-200 focus:border-blue-500"
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="text-[12px] text-red-500 mt-1">{errors.phone}</p>
              )}
            </div>

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
                  onChange={(e) => setEmail(e.target.value)}
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
                  placeholder="อย่างน้อย 8 ตัวอักษร"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full h-11 pl-10 pr-10 text-[14px] bg-gray-50 border rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all ${
                    errors.password
                      ? "border-red-400 focus:border-red-400"
                      : "border-gray-200 focus:border-blue-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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

            {/* CHECKBOX */}
            <div>
              <label className="flex items-start gap-2.5">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    checked={accept}
                    onChange={(e) => setAccept(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    onClick={() => setAccept((v) => !v)}
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors cursor-pointer ${
                      accept
                        ? "bg-blue-600 border-blue-600"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    {accept && (
                      <svg
                        className="w-2.5 h-2.5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-[14px] text-gray-500 leading-relaxed">
                  ยอมรับ{" "}
                  <span
                    onClick={() => setShowTerms(true)}
                    className="text-blue-600 font-medium hover:underline cursor-pointer"
                  >
                    ข้อตกลงและเงื่อนไข
                  </span>{" "}
                  และ{" "}
                  <span
                    onClick={() => setShowPrivacy(true)}
                    className="text-blue-600 font-medium hover:underline cursor-pointer"
                  >
                    นโยบายความเป็นส่วนตัว
                  </span>
                </span>
              </label>
              {errors.accept && (
                <p className="text-[12px] text-red-500 mt-1">{errors.accept}</p>
              )}
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={state.loading ?? false}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-[14px] font-semibold rounded-xl transition-colors shadow-md shadow-blue-100 mt-2"
            >
              {state.loading ? "กำลังสมัคร..." : "ลงทะเบียน"}
            </button>
          </form>

          {/* LOGIN LINK */}
          <p className="text-center text-[13px] text-gray-400 mt-6">
            มีบัญชีอยู่แล้ว?{" "}
            <Link
              href="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              เข้าสู่ระบบ
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
      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}
    </AuthenticationRoute>
  );
}
