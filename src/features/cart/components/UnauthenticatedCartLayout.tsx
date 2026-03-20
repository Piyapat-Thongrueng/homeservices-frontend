import React from "react";
import { useTranslation } from "next-i18next";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export default function UnauthenticatedCartLayout() {
  const { t } = useTranslation("common");
  return (
    <div className="min-h-screen bg-utility-bg font-prompt flex flex-col">
      <Navbar />
      <header className="w-full bg-blue-600 py-4 md:py-5">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <h1 className="headline-2 text-utility-white text-center">
            {t("cart.heading")}
          </h1>
        </div>
      </header>
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8 flex items-center justify-center">
        <p className="body-2 text-gray-600">{t("cart.login_required")}</p>
      </main>
      <Footer />
    </div>
  );
}

