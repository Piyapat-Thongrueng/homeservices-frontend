import Navbar from "@/components/common/Navbar";
import HeroSection from "@/components/herosection/HeroSection";
import Footer from "@/components/common/Footer";
import LandingPageFooterContent from "@/components/common/LandingPageFooterContent";
export default function Home() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <LandingPageFooterContent />
      <Footer />
    </div>
  );
}
