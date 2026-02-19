import Navbar from "@/components/common/Navbar";
import HeroSection from "@/components/herosection/HeroSection";
import Footer from "@/components/common/Footer";
import LandingPageFooterContent from "@/components/common/LandingPageFooterContent";
import ServiceListFooterContent from "@/components/common/ServiceListFooterContent";
import HomeServices from "./HomeServices";

export default function Home() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <HomeServices />
      <LandingPageFooterContent />
      <Footer />
    </div>
  );
}
