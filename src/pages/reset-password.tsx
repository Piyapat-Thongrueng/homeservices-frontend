import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import OrderSidebar from "@/features/repairorder/OrderSidebar";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from '@/contexts/AuthContext';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { state, isAuthenticated } = useAuth();
  const { user, getUserLoading: authLoading } = state;

  useEffect(() => {
    if (authLoading === false && !isAuthenticated) {
      router.replace('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  const [saving, setSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // modal state
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // =============================
  // VALIDATE
  // =============================
  const validate = () => {
    setError("");
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return false;
    }
    if (newPassword.length < 12) {
      setError("รหัสผ่านใหม่ต้องมีอย่างน้อย 12 ตัวอักษร");
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError("รหัสผ่านใหม่กับยืนยันรหัสผ่านไม่ตรงกัน");
      return false;
    }
    return true;
  };

  // =============================
  // RESET PASSWORD LOGIC
  // =============================
  const handleResetPassword = async () => {
    if (!user || !validate() || saving) return;
    setSaving(true);
    try {
      // STEP 1: re-authenticate
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: currentPassword,
      });

      if (loginError) {
        throw new Error("รหัสผ่านปัจจุบันไม่ถูกต้อง");
      }

      // STEP 2: update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      // STEP 3: success
      setShowConfirm(false);
      setShowSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "เกิดข้อผิดพลาด");
      setShowConfirm(false);
    } finally {
      setSaving(false);
    }
  };

  const handleGoLogin = async () => {
    await supabase.auth.signOut();
    router.replace("/auth/login");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-prompt text-gray-500">
        กำลังตรวจสอบสิทธิ์...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-prompt">
      <Navbar />

      {/* Header Banner - เหมือนหน้า Dashboard */}
      <div className="bg-blue-600 text-white text-center py-8 text-2xl md:text-3xl font-bold tracking-wide shadow-inner">
        ตั้งค่ารหัสผ่านใหม่
      </div>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar - ใช้ตัวเดียวกับหน้า Dashboard */}
          <div className="w-full md:w-64 shrink-0">
          <OrderSidebar 
              activeTab="profile" // 🛑 บังคับให้ไฮไลท์เมนู "ข้อมูลผู้ใช้งาน" ไว้เสมอเวลาอยู่หน้านี้
              onTabChange={(tab) => {
                // 🛑 เวลากดเมนูอื่น ให้กลับไปหน้า profile พร้อมแนบชื่อแท็บไปด้วย
                router.push(`/profile?tab=${tab}`);
              }}
            />
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">Reset Password</h2>
              
              <div className="space-y-4 max-w-md">
                {error && (
                  <div className="p-3 bg-red-50 text-red-500 rounded-lg text-sm border border-red-100">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่านปัจจุบัน</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full h-[44px] px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="กรอกรหัสผ่านเดิม"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่านใหม่</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full h-[44px] px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="อย่างน้อย 12 ตัวอักษร"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ยืนยันรหัสผ่านใหม่</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-[44px] px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
                  />
                </div>

                <button
                  onClick={() => { if(validate()) setShowConfirm(true) }}
                  disabled={saving}
                  className="mt-6 btn-primary w-full sm:w-auto px-8 py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  ยืนยันการเปลี่ยนรหัสผ่าน
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* CONFIRM MODAL - ดีไซน์ใหม่ให้เข้ากับเว็บ */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div className="bg-white p-8 rounded-2xl w-full max-w-[400px] text-center shadow-2xl">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                <i className="fa-solid fa-key"></i>
            </div>
            <h2 className="text-xl font-bold mb-2 text-gray-800">ยืนยันการเปลี่ยนรหัสผ่าน</h2>
            <p className="mb-8 text-gray-500 text-sm">
                คุณต้องการเปลี่ยนรหัสผ่านใหม่ใช่หรือไม่? ระบบจะทำการอัปเดตข้อมูลของคุณทันที
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-all cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleResetPassword}
                disabled={saving}
                className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all cursor-pointer"
              >
                {saving ? "กำลังบันทึก..." : "ยืนยัน"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div className="bg-white p-8 rounded-2xl w-full max-w-[400px] text-center shadow-2xl">
            <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                <i className="fa-solid fa-circle-check"></i>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">เปลี่ยนรหัสผ่านสำเร็จ</h2>
            <p className="mb-8 text-gray-500">
              รหัสผ่านของคุณถูกเปลี่ยนเรียบร้อยแล้ว กรุณาเข้าสู่ระบบใหม่อีกครั้งเพื่อความปลอดภัย
            </p>
            <button
              onClick={handleGoLogin}
              className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-black shadow-xl transition-all cursor-pointer"
            >
              ตกลง (ไปที่หน้าล็อกอิน)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}