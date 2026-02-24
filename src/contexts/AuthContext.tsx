import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import type { User, Session } from "@supabase/supabase-js"

type AuthContextType = {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
})

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    let mounted = true

    // โหลด session ครั้งแรก
    const getSession = async () => {

      const { data } =
        await supabase.auth.getSession()

      if (!mounted) return

      setUser(data.session?.user ?? null)
      setLoading(false)
    }

    getSession()


    // listen auth change
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session: Session | null) => {

        if (!mounted) return

        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => {

      mounted = false

      subscription.unsubscribe()

    }

  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)