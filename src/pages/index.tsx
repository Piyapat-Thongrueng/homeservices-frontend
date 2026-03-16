import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"
import Navbar from "@/components/common/Navbar"
import HeroSection from "@/components/herosection/HeroSection"
import Footer from "@/components/common/Footer"
import LandingPageFooterContent from "@/components/common/LandingPageFooterContent"
import HomeServices from "@/components/serviceCard/HomeServices"
import { fetchServices } from "@/services/serviceListsApi/serviceApi"
import { Service } from "@/types/serviceListTypes/type"


export default function Home() {

  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [popularServices, setPopularServices] = useState<Service[]>([])


  useEffect(() => {

    let isMounted = true

    const checkUser = async () => {

      const { data, error } = await supabase.auth.getUser()

      

      // ไม่ว่าจะ login หรือไม่ ก็ render homepage ได้
      if (isMounted) {
        setLoading(false)
      }

    }

    checkUser()

    // listen เมื่อ login/logout/change session
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

  // Fetch popular services
  useEffect(() => {
    const loadPopularServices = async () => {
      try {
        // ส่ง filter=popular → backend เรียงตาม order_count DESC
        const data = await fetchServices({ filter: "popular" })
        setPopularServices(data)
      } catch (error) {
        console.error("Error loading popular services:", error)
      }
    }
    loadPopularServices()
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
      <HomeServices serviceLists={popularServices} mode="landing" />
      <LandingPageFooterContent />
      <Footer />
    </div>
  )
}