import { useState, useEffect } from "react";
import Navbar from "@/components/common/Navbar";
import HeroSection from "@/components/herosection/HeroSection";
import Footer from "@/components/common/Footer";
import LandingPageFooterContent from "@/components/common/LandingPageFooterContent";
import HomeServices from "@/components/serviceCard/HomeServices";
import { fetchServices } from "@/services/serviceListsApi/serviceApi";
import { Service } from "@/types/serviceListTypes/type";

export default function Home() {
  const [popularServices, setPopularServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPopularServices = async () => {
      setLoading(true);
      try {
        // ส่ง filter=popular → backend เรียงตาม order_count DESC
        const data = await fetchServices({ filter: "popular" });
        setPopularServices(data);
      } catch (error) {
        console.error("Error loading popular services:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPopularServices();
  }, []);

  return (
    <div>
      <Navbar />
      <HeroSection />
      {loading ? (
        <div className="flex justify-center items-center py-20 bg-gray-50">
          <p className="text-gray-400">กำลังโหลดบริการยอดนิยม...</p>
        </div>
      ) : (
        <HomeServices
          serviceLists={popularServices}
          mode="landing"
        />
      )}
      <LandingPageFooterContent />
      <Footer />
    </div>
  );
}
