import axios from "axios";
import { useState } from "react";
import Footer from "@/components/common/Footer";
import LandingPageFooterContent from "@/components/common/LandingPageFooterContent";

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
      <div className="flex justify-center flex-col items-center space-y-5">
        <h1 className="font-bold text-center mt-10 headline-1 text-blue-500">
          Welcome to HomeService Test Deployment
        </h1>
        <button className="btn-primary" onClick={fetchTestApi}>
          Button Primary
        </button>
        <div>
          <p className="text-center">{text}</p>
        </div>
        <button className="btn-primary" disabled>
          Button Primary
        </button>
        <button className="btn-primary">
          Processing
          <span className="spinner"></span>
        </button>
        <button className="btn-secondary">Button Secondary</button>

        <button className="btn-secondary" disabled>
          Button Secondary
        </button>

        <button className="btn-secondary">
          Processing
          <span className="spinner"></span>
        </button>
      </div>
      <LandingPageFooterContent />
      <Footer />
    </>
  );
}
