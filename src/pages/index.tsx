import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"

import Navbar from "@/components/common/Navbar"
import HeroSection from "@/components/herosection/HeroSection"
import Footer from "@/components/common/Footer"
import LandingPageFooterContent from "@/components/common/LandingPageFooterContent"
import ServiceListFooterContent from "@/components/common/ServiceListFooterContent"
import HomeServices from "./HomeServices"


export default function Home() {

  const router = useRouter()

  const [loading, setLoading] = useState(true)


  useEffect(() => {

    let isMounted = true

    const checkUser = async () => {

      const { data, error } = await supabase.auth.getUser()

      // ❌ เอา redirect ออก
      // if (!data.user) {
      //   router.push("/auth/login")
      //   return
      // }

      // ✅ ไม่ว่าจะ login หรือไม่ ก็ render homepage ได้
      if (isMounted) {
        setLoading(false)
      }

    }

    checkUser()

    // ✅ สำคัญมาก: listen เมื่อ login/logout/change session
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {

      if (isMounted) {
        setLoading(false)
      }

    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }

  }, [])


  // ป้องกัน render ก่อน auth check เสร็จ
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    )
  }


  return (
    <div>
      <Navbar />
      <HeroSection />
      <HomeServices />
      <LandingPageFooterContent />
      <Footer />
    </div>
  )
}