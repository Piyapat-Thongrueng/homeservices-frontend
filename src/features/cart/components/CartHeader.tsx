import React from "react";
import { useTranslation } from "next-i18next";
import { ShoppingCart } from "lucide-react";

export default function CartHeader() {
  const { t } = useTranslation("common");
  return (
    <header className="w-full bg-blue-600 py-4 md:py-5">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <h1 className="headline-2 text-utility-white text-center flex items-center justify-center gap-2">
          <ShoppingCart className="w-10 h-8" /> {t("cart.heading")}
        </h1>
      </div>
    </header>
  );
}

