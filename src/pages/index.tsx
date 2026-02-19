import axios from "axios";
import { useState } from "react";
import Footer from "@/components/common/Footer";
import LandingPageFooterContent from "@/components/common/LandingPageFooterContent";
import ServiceListFooterContent from "@/components/common/ServiceListFooterContent";

export default function Home() {
  const [text, settext] = useState("");

  const fetchTestApi = async () => {
    try {
      const response = await axios.get(
        "https://homeservices-server.vercel.app/test",
      );
      settext(response.data.message);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <>
      <LandingPageFooterContent/>
      <ServiceListFooterContent />
      <Footer />
    </>
  );
}
