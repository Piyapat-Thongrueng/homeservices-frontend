/**
 * Service list Banner Component
 *
 * Displays a full-width hero banner for the service list page with a
 * background image, color overlay, and marketing copy in Thai.
 */
import { useTranslation } from "next-i18next";

const Banner = () => {
  const { t } = useTranslation("common");

  return (
    <div>
      <section className="relative w-full h-42 overflow-hidden md:h-60">
        <img
          src="./banner.jpg"
          alt="Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-95"
        />
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "#00195199" }}
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-6">
          <h1 className="font-prompt text-[20px] font-bold mb-4 tracking-wide sm:text-[36px]">
            {t("service_list.banner_title")}
          </h1>
          <p className="font-prompt text-[14px] leading-relaxed max-w-2xl sm:text-[18px] whitespace-pre-line">
            {t("service_list.banner_desc")}
          </p>
        </div>
      </section>
    </div>
  );
};

export default Banner;
