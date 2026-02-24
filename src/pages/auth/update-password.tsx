import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"

export default function UpdatePasswordPage() {

  const router = useRouter()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  // =========================
  // CHECK RECOVERY SESSION 
  // =========================

  useEffect(() => {

    const checkRecoverySession = async () => {

      const { data } = await supabase.auth.getSession()

      // ไม่มี session → redirect login
      if (!data.session) {
        router.replace("/auth/login")
        return
      }

      // session ต้องเป็น recovery เท่านั้น
      if (data.session.user.aud !== "authenticated") {
        router.replace("/auth/login")
        return
      }

      setLoading(false)

    }

    checkRecoverySession()

  }, [router])


  // =========================
  // UPDATE PASSWORD
  // =========================

  const handleUpdatePassword = async () => {

    setError("")

    if (!password || !confirmPassword) {
      setError("กรอกข้อมูลให้ครบ")
      return
    }

    if (password.length < 12) {
      setError("รหัสผ่านต้องมีอย่างน้อย 12 ตัว")
      return
    }

    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน")
      return
    }

    setSaving(true)

    try {

      const { error } = await supabase.auth.updateUser({
        password
      })

      if (error) throw error

      //  logout ก่อน redirect
      await supabase.auth.signOut()

      router.replace("/auth/login?reset=success")

    }
    catch (err: any) {

      setError(err.message)

    }
    finally {

      setSaving(false)

    }

  }


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    )
  }


  return (
    <div className="min-h-screen flex items-center justify-center">

      <div className="w-[400px] p-6 border rounded-xl">

        <h2 className="text-xl items-center font-semibold mb-4 text-center">
          ตั้งรหัสผ่านใหม่
        </h2>

        {error && (
          <div className="text-red-500 mb-3">
            {error}
          </div>
        )}

        <input
          type="password"
          placeholder="รหัสผ่านใหม่"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-10 border px-3 mb-3"
        />

        <input
          type="password"
          placeholder="ยืนยันรหัสผ่านใหม่"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full h-10 border px-3 mb-4"
        />

        <button
          onClick={handleUpdatePassword}
          disabled={saving}
          className="btn-primary w-full h-[44px] flex items-center justify-center gap-2 mb-3"
        >
          {saving ? "Saving..." : "Update password"}
        </button>

      </div>

    </div>
  )

}