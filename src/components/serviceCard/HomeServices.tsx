import { ArrowRight, Tag } from "lucide-react";
import { useRouter } from "next/router";
import { getCategoryColor } from "@/components/serviceCard/CategoryColors";
import { Service } from "@/types/serviceListTypes/type";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "next-i18next";

interface HomeServicesProps {
  serviceLists: Service[];
  mode?: "landing" | "full";
  onCategoryClick?: (categoryId: number, categoryNameTh: string) => void;
}

export default function HomeServices({
  serviceLists,
  mode = "full",
  onCategoryClick,
}: HomeServicesProps) {
  const router = useRouter();
  const { locale } = router;
  const { t } = useTranslation("common");
  const { state } = useAuth();

  const displayList =
    mode === "landing" ? serviceLists.slice(0, 3) : serviceLists;

  const handleSelectService = (service: Service) => {
    if (!state.user) {
      router.push("/login");
      return;
    }

    router.push({
      pathname: "/servicedetailPage/ServiceDetails",
      query: { serviceId: service.id },
    });
  };

  return (
    <div className="w-full bg-gray-50 py-16 text-gray-900 font-prompt overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            {mode === "landing" ? t("landing.popular_title") : t("landing.all_services_title")}
          </h2>
        </div>

        {displayList.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-gray-400 text-lg">
              {t("landing.not_found")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayList.map((service) => {
              const color = getCategoryColor(service.category_name);
              const displayName = (locale === "en" ? service.name_en : service.name_th) || service.name;
              const displayCategory = (locale === "en" ? service.category_name_en : service.category_name_th) || service.category_name_th;

              return (
                <div
                  key={service.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={service.image}
                      alt={displayName}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-6 flex flex-col grow">
                    <button
                      onClick={() =>
                        onCategoryClick?.(
                          service.category_id,
                          service.category_name_th,
                        )
                      }
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold w-max mb-4 transition-opacity hover:opacity-75
                        ${color.bg} ${color.text}
                        cursor-pointer`}
                    >
                      {displayCategory}
                    </button>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 whitespace-nowrap overflow-hidden text-ellipsis">
                      {displayName}
                    </h3>

                    <div className="flex items-center gap-2 text-gray-500 mb-6 grow">
                      <Tag className="w-4 h-4 text-blue-500 shrink-0" />
                      <p className="text-base">
                        {t('landing.service_fee', 'ค่าบริการ: ')}
                        {service.min_price !== null &&
                        service.max_price !== null &&
                        service.min_price !== service.max_price
                          ? `${Math.floor(service.min_price).toLocaleString()} - ${Math.floor(service.max_price).toLocaleString()} ${t('landing.currency_thb', 'บาท')}`
                          : `${Math.floor(service.price ?? service.min_price ?? 0).toLocaleString()} ${t('landing.currency_thb', 'บาท')}`}
                      </p>
                    </div>

                    <button
                      onClick={() => handleSelectService(service)}
                      className="text-blue-600 hover:text-blue-800 font-bold transition-colors self-start underline underline-offset-4 decoration-blue-600/30 hover:decoration-blue-800 text-base cursor-pointer"
                    >
                      {t("landing.select_service")}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {mode === "landing" && (
          <div className="mt-16 flex justify-center">
            <button
              onClick={() => router.push("/service-lists")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-10 rounded-xl transition-all hover:shadow-lg flex items-center gap-2 text-lg cursor-pointer"
            >
              {t("landing.view_all")} <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
