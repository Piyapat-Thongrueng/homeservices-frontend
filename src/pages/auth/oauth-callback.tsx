import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";

export default function OAuthCallback() {

  const router = useRouter();

  useEffect(() => {

    const handleOAuth = async () => {

      // อ่าน token จาก URL hash
      const hash = window.location.hash;

      if (!hash) {
        router.push("/auth/login");
        return;
      }

      const params = new URLSearchParams(
        hash.replace("#", "")
      );

      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (!access_token || !refresh_token) {
        router.push("/auth/login");
        return;
      }

      // ✅ set session เข้า Supabase client
      const { error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      if (error) {
        console.error(error);
        router.push("/auth/login");
        return;
      }

      // ✅ login สำเร็จ
      router.push("/dashboard");
    };

    handleOAuth();

  }, []);

  return (
    <div className="flex h-screen items-center justify-center">
      กำลังเข้าสู่ระบบ...
    </div>
  );
}