/**
 * ServiceListFooterContent Component
 *
 * Blue footer section dedicated to the service list page, reinforcing
 * brand trust and availability with long-form Thai marketing copy.
 */
import { useTranslation } from "next-i18next";

export default function ServiceListFooterContent() {
  const { t } = useTranslation("common");

  return (
    <div className="w-full bg-blue-600 overflow-hidden">
      <div className="flex flex-col lg:flex-row w-full mx-auto ">
        <div className="relative flex-1 bg-blue-600 px-6 py-10 lg:px-16 lg:py-0 h-71 flex flex-col justify-center items-center text-center overflow-hidden">
          <div className="relative z-10 flex flex-col gap-4 lg:gap-6 text-utility-white max-w-4xl">
            <p className="headline-3 text-center whitespace-pre-line">
              {t("service_list.footer_banner_text")}
            </p>
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
