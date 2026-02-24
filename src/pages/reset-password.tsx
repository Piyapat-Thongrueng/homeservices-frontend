import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Navbar from "@/components/common/Navbar"
import { supabase } from "@/lib/supabaseClient"
import { useAuth } from "@/contexts/AuthContext"

export default function ResetPasswordPage() {

  const router = useRouter()

  const { user, loading } = useAuth()

  const [saving, setSaving] = useState(false)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [error, setError] = useState("")

  // modal state
  const [showConfirm, setShowConfirm] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)



  // =============================
  // PROTECT ROUTE
  // =============================
  useEffect(() => {

    if (!loading && !user) {
      router.replace("/auth/login")
    }

  }, [user, loading, router])



  // =============================
  // VALIDATE
  // =============================
  const validate = () => {

    setError("")

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("กรอกข้อมูลให้ครบ")
      return false
    }

    // FIX: password must be ≥ 12 chars (scope requirement)
    if (newPassword.length < 12) {
      setError("รหัสผ่านต้องมีอย่างน้อย 12 ตัวอักษร")
      return false
    }

    if (newPassword !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน")
      return false
    }

    return true

  }



  // =============================
  // RESET PASSWORD
  // =============================
  const handleResetPassword = async () => {

    if (!user) return

    if (!validate()) return

    if (saving) return

    setSaving(true)

    try {

      // STEP 1: re-authenticate
      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email: user.email!,
          password: currentPassword
        })

      if (loginError) {
        throw new Error("รหัสผ่านปัจจุบันไม่ถูกต้อง")
      }



      // STEP 2: update password
      const { error: updateError } =
        await supabase.auth.updateUser({
          password: newPassword
        })

      if (updateError) throw updateError



      // STEP 3: show success modal
      setShowConfirm(false)
      setShowSuccess(true)

    }
    catch (err: any) {

      console.error(err)
      setError(err.message || "เกิดข้อผิดพลาด")

    }
    finally {

      setSaving(false)

    }

  }



  // =============================
  // GO LOGIN
  // =============================
  const handleGoLogin = async () => {

    await supabase.auth.signOut()

    router.replace("/auth/login")

  }



  // =============================
  // LOADING SCREEN
  // =============================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    )
  }



  // =============================
  // UI (เหมือนของคุณ)
  // =============================
  return (
    <>
      <div className="min-h-screen bg-[#F9FAFB]">

        <Navbar />

        <div className="max-w-[1100px] mx-auto px-4 py-6">

          <div className="flex gap-6">

            {/* SIDEBAR */}
            <div className="hidden md:block w-[260px] bg-[#F2F4F7] rounded-xl p-5">

              <div
                onClick={() => router.push("/profile")}
                className="px-3 py-2 hover:bg-white rounded-lg cursor-pointer"
              >
                Profile
              </div>

              <div className="bg-white px-3 py-2 rounded-lg font-medium">
                Reset password
              </div>

            </div>



            {/* CONTENT */}
            <div className="flex-1 bg-[#F2F4F7] rounded-xl p-6 flex justify-center">

              <div className="w-full max-w-[420px] bg-white rounded-xl p-6">

                <h2 className="text-center text-xl font-semibold mb-6">
                  Reset password
                </h2>

                {error && (
                  <div className="text-red-500 mb-4 text-sm">
                    {error}
                  </div>
                )}

                <div className="mb-4">
                  <label>Current password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) =>
                      setCurrentPassword(e.target.value)
                    }
                    className="w-full h-[44px] border rounded-lg px-3"
                  />
                </div>

                <div className="mb-4">
                  <label>New password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) =>
                      setNewPassword(e.target.value)
                    }
                    className="w-full h-[44px] border rounded-lg px-3"
                  />
                </div>

                <div className="mb-6">
                  <label>Confirm new password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    className="w-full h-[44px] border rounded-lg px-3"
                  />
                </div>

                <button
                  onClick={() => setShowConfirm(true)}
                  disabled={saving}
                  className="w-full h-[44px] bg-black text-white rounded-full"
                >
                  {saving ? "Saving..." : "Reset password"}
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>



      {/* CONFIRM MODAL */}
      {showConfirm && (

        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">

          <div className="bg-white p-6 rounded-xl w-[400px] text-center">

            <h2 className="text-xl font-semibold mb-4">
              Reset password
            </h2>

            <p className="mb-6 text-gray-600">
              Do you want to reset your password?
            </p>

            <div className="flex justify-center gap-4">

              <button
                onClick={() => setShowConfirm(false)}
                className="px-6 py-2 border rounded-full"
              >
                Cancel
              </button>

              <button
                onClick={handleResetPassword}
                className="px-6 py-2 bg-black text-white rounded-full"
              >
                Confirm
              </button>

            </div>

          </div>

        </div>

      )}



      {/* SUCCESS MODAL */}
      {showSuccess && (

        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">

          <div className="bg-white p-6 rounded-xl w-[400px] text-center">

            <h2 className="text-2xl font-bold mb-4">
              Reset successful
            </h2>

            <p className="mb-6 text-gray-600">
              Your password has been updated. Please log in again.
            </p>

            <button
              onClick={handleGoLogin}
              className="w-full py-3 bg-black text-white rounded-full"
            >
              Go to login
            </button>

          </div>

        </div>

      )}

    </>
  )

}