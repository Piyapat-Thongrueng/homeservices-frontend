import { useEffect } from "react"
import { useRouter } from "next/router"
import { useAuth } from "@/contexts/AuthContext"

export function useRequireAuth() {

  const router = useRouter()

  const { user, loading } = useAuth()

  useEffect(() => {

    if (loading) return

    if (!user) {

      router.replace("/auth/login")

    }

  }, [user, loading, router])

  return {
    user,
    loading,
    isAuthenticated: !!user,
  }

}