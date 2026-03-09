import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AuthenticationRoute from "@/components/auth/AuthenticationRoute";

export default function RegisterPage() {
  const { register, state, isAuthenticated } = useAuth(); // ← ใช้ context

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accept, setAccept] = useState(false);

  // error state
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [acceptError, setAcceptError] = useState("");

  // VALIDATION FUNCTION

  const validate = () => {
    let valid = true;

    setNameError("");
    setPhoneError("");
    setEmailError("");
    setPasswordError("");
    setAcceptError("");

    const nameRegex = /^[A-Za-zก-๙\s'-]+$/; // ← เพิ่มรองรับภาษาไทย
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // ← แก้ให้รองรับ .co.th ด้วย

    if (!name.trim()) {
      setNameError("โปรดกรอกชื่อ - นามสกุล");
      valid = false;
    } else if (!nameRegex.test(name)) {
      setNameError("ชื่อใช้ได้เฉพาะ A-Z a-z ภาษาไทย ' -");
      valid = false;
    }

    if (!phone.trim()) {
      setPhoneError("โปรดกรอกเบอร์โทรศัพท์");
      valid = false;
    } else if (!phoneRegex.test(phone)) {
      setPhoneError("เบอร์โทรต้องเป็นตัวเลข 10 หลัก");
      valid = false;
    }

    if (!email.trim()) {
      setEmailError("โปรดกรอกอีเมล");
      valid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError("รูปแบบอีเมลไม่ถูกต้อง");
      valid = false;
    }

    if (!password.trim()) {
      setPasswordError("โปรดกรอกรหัสผ่าน");
      valid = false;
    } else if (password.length < 8) {
      setPasswordError("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
      valid = false;
    }

    if (!accept) {
      setAcceptError("กรุณายอมรับ policy");
      valid = false;
    }

    return valid;
  };

  // REGISTER FUNCTION

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (state.loading) return;

    const isValid = validate();
    if (!isValid) return;

    // ใช้ register จาก context แทน supabase โดยตรง
    const result = await register({
      full_name: name,
      phone,
      email,
      password,
    });

    // context จะ redirect ไป /login เองอัตโนมัติถ้าสำเร็จ
    // แสดง error ถ้าไม่สำเร็จ
    if (result?.error) {
      setEmailError(result.error);
    }
  };

  // UI

  return (
    // ← ครอบด้วย AuthenticationRoute ป้องกัน user ที่ login แล้วเข้าหน้านี้
    <AuthenticationRoute
      isLoading={state.getUserLoading}
      isAuthenticated={isAuthenticated}
    >
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
                <p className="text-[12px] text-red-500 mt-1">{nameError}</p>
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
                <p className="text-[12px] text-red-500 mt-1">{phoneError}</p>
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
                <p className="text-[12px] text-red-500 mt-1">{emailError}</p>
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
                <p className="text-[12px] text-red-500 mt-1">{passwordError}</p>
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
              <p className="text-[12px] text-red-500">{acceptError}</p>
            )}

            {/* แสดง error จาก API */}
            {state.error && (
              <p className="text-[12px] text-red-500 text-center">
                {state.error}
              </p>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={state.loading ?? false}
              className="btn-primary w-full h-[44px]"
            >
              {state.loading ? "กำลังสมัคร..." : "ลงทะเบียน"}
            </button>
          </form>

          {/* BACK TO LOGIN */}
          <p className="text-center text-[13px] text-blue-600 underline mt-6">
            <Link href="/login">กลับไปหน้าเข้าสู่ระบบ</Link>
          </p>
        </div>
      </div>
    </AuthenticationRoute>
  );
}
