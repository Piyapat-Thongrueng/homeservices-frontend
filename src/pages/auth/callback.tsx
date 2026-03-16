import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/utils/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthCallback() {
  const router = useRouter();
  const { fetchUser } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      // ดึง session หลังจาก Google redirect กลับมา
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        // ถ้าไม่มี session → กลับไปหน้า login
        router.replace("/login");
        return;
      }

      // เก็บ token ใน localStorage เหมือน login ปกติ
      localStorage.setItem("token", data.session.access_token);

      // ดึงข้อมูล user จาก backend เหมือนกับ login ปกติ
      await fetchUser();

      // redirect ไปหน้าหลัก
      router.replace("/");
    };

    handleCallback();
  }, []);

  // แสดง loading ระหว่างรอ
  return (
    <div className="min-h-screen flex flex-col items-center justify-center font-prompt gap-3">
      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-[14px] text-gray-500">กำลังเข้าสู่ระบบ...</p>
    </div>
  );
}