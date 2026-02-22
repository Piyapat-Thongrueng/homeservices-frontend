"use client";
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

  // Req3: ดึงบริการยอดนิยม 3 อันดับตอน mount
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
      {/* Req3: แสดงบริการยอดนิยม 3 รายการ, mode="landing" จะ slice(0,3) อัตโนมัติ */}
      {loading ? (
        <div className="flex justify-center items-center py-20 bg-gray-50">
          <p className="text-gray-400">กำลังโหลดบริการยอดนิยม...</p>
        </div>
      ) : (
        <HomeServices
          serviceLists={popularServices}
          mode="landing"
          // หน้า landing ไม่มี onCategoryClick → badge กดไม่ได้
        />
      )}
      <LandingPageFooterContent />
      <Footer />
    </div>
  );
}
