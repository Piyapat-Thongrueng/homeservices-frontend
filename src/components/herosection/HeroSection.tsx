import Link from "next/link";
import { useTranslation } from "next-i18next";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HeroSection = () => {
  const { t } = useTranslation("common");

  const images = [
    "/hero_house.png",
    "/hero_pool.png",
    "/hero_garden.png",
  ];
  
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  const nextSlide = () => setCurrentIdx((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrentIdx((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="w-full h-[600px] md:h-[700px] relative overflow-hidden group">
      {/* Full Width Background Slider */}
      {images.map((src, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            idx === currentIdx ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={src}
            alt={`Hero Slider ${idx + 1}`}
            className="w-full h-full object-cover"
          />
          {/* Dark gradient overlay for readable text */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>
      ))}

      {/* Content Container */}
      <div className="absolute inset-0 z-10 flex items-center">
        <div className="max-w-screen-2xl w-full mx-auto px-5 sm:px-6 md:px-16 lg:px-24">
          <div className="flex flex-col justify-center gap-5 md:w-2/3 lg:w-1/2">
            <h1 className="font-semibold font-prompt text-[45px] md:text-[55px] text-white leading-tight drop-shadow-lg">
              {t("hero.title")}
            </h1>
            <p className="font-prompt pb-2 text-[24px] md:text-[40px] font-semibold text-white drop-shadow-md">
              {t("hero.subtitle")}
            </p>
            <p className="font-prompt font-base text-[22px] md:text-[28px] text-gray-200 drop-shadow-md mb-6">
              {t("hero.description")}
            </p>
            <div>
              <Link href="/service-lists">
                <button className="btn-primary font-medium py-4 text-2xl px-10 shadow-xl hover:shadow-2xl transition-all hover:scale-105 border border-white/20">
                  {t("hero.cta")}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <button 
        onClick={prevSlide}
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 bg-black/20 backdrop-blur-md hover:bg-black/40 p-3 md:p-4 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 z-20 border border-white/10"
      >
        <ChevronLeft className="w-8 h-8 text-white" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 bg-black/20 backdrop-blur-md hover:bg-black/40 p-3 md:p-4 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 z-20 border border-white/10"
      >
        <ChevronRight className="w-8 h-8 text-white" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIdx(idx)}
            className={`h-3 rounded-full transition-all shadow-lg ${
              idx === currentIdx ? "bg-white w-10" : "bg-white/50 w-3 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
