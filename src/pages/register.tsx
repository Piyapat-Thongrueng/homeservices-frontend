import { useState } from "react"
import { useRouter } from "next/router"

export default function RegisterPage() {

  const router = useRouter()

  const [fullName, setFullName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [accept, setAccept] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")


  // ======================
  // VALIDATE
  // ======================
  const validate = () => {

    const nameRegex = /^[A-Za-z'-]+(?: [A-Za-z'-]+)*$/
    const phoneRegex = /^[0-9]{10}$/
    const emailRegex = /^[^\s@]+@[^\s@]+\.com$/

    if (!fullName || !username || !email || !phone || !password) {
      setError("กรอกข้อมูลให้ครบ")
      return false
    }

    if (!nameRegex.test(fullName)) {
      setError("ชื่อไม่ถูกต้อง")
      return false
    }

    if (!phoneRegex.test(phone)) {
      setError("เบอร์โทรไม่ถูกต้อง")
      return false
    }

    if (!emailRegex.test(email)) {
      setError("email ต้องมี @ และ .com")
      return false
    }

    if (password.length < 12) {
      setError("password ต้อง ≥ 12 ตัว")
      return false
    }

    if (!accept) {
      setError("กรุณายอมรับ policy")
      return false
    }

    return true
  }


  // ======================
  // REGISTER
  // ======================
  const handleRegister = async () => {

    setError("")
    setSuccess("")

    if (!validate()) return

    setLoading(true)

    try {

      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          full_name: fullName,
          username,
          email,
          password,
          phone
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error)
      }

      setSuccess("Register success ✅")

      alert("Register success")

      router.push("/auth/login")

    }
    catch (err: any) {

      setError(err.message)

    }
    finally {

      setLoading(false)

    }

  }



  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl w-[400px]">

        <h1 className="text-2xl font-bold mb-6 text-center">
          Register
        </h1>


        {error && (
          <div className="text-red-500 mb-3">
            {error}
          </div>
        )}

        {success && (
          <div className="text-green-600 mb-3">
            {success}
          </div>
        )}


        <input
          placeholder="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border p-2 mb-3"
        />

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border p-2 mb-3"
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 mb-3"
        />

        <input
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border p-2 mb-3"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 mb-3"
        />


        <div className="mb-4">

          <label className="flex gap-2">

            <input
              type="checkbox"
              checked={accept}
              onChange={(e) => setAccept(e.target.checked)}
            />

            Accept policy

          </label>

        </div>


        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-black text-white p-2 rounded"
        >
          {loading ? "Registering..." : "Register"}
        </button>

      </div>

    </div>

  )

}