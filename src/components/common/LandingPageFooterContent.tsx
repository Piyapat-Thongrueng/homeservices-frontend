import { useTranslation } from "next-i18next";

export default function LandingPageFooterContent() {
  const { t } = useTranslation("common");

  return (
    <div className="w-full bg-blue-600 overflow-hidden">
      <div className="flex flex-col lg:flex-row w-full mx-auto">
        {/* Left Section - Image */}
        <div className="relative w-full lg:w-[39%] ">
          <img
            src="/footer_image.svg"
            alt="Handyman with tools"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-blue-900/20 mix-blend-multiply" />
        </div>

        {/* Right Section - Content */}
        <div className="relative flex-1 bg-blue-600 px-6 py-10 lg:px-16 lg:py-0 flex flex-col justify-center">
          <div className="relative z-10 flex flex-col gap-4 lg:gap-8 text-utility-white">
            <h2 className="font-semibold text-3xl lg:text-4xl xl:text-5xl leading-tight font-prompt whitespace-pre-line">
              {t("landing_footer.title")}
            </h2>

            <p className="headline-3 font-prompt max-w-lg whitespace-pre-line">
              {t("landing_footer.subtitle")}
            </p>

            <div className="mt-2 font-prompt headline-1">
              <span>{t("landing_footer.contact")} </span>
              <a
                href="mailto:job@homeservices.co"
                className="hover:text-blue-200 transition-colors break-all cursor-pointer"
              >
                job@homeservices.co
              </a>
            </div>
          </div>

          <div
            className="absolute right-0 bottom-0 pointer-events-none opacity-60 z-0"
            style={{
              height: "130%",
              aspectRatio: "1/1",
              transform: "translate(30%, 15%)",
            }}
          >
            <img
              src="/footer_house_logo.svg"
              alt=""
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}