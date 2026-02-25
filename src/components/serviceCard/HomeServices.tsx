import { ArrowRight, Tag } from "lucide-react";
import { useRouter } from "next/router";
import { getCategoryColor } from "@/components/serviceCard/CategoryColors";

interface ServiceListProps {
  id: number;
  name: string;
  description: string;
  price: number | null;
  min_price: number | null;
  max_price: number | null;
  category_name: string;
  category_name_th: string;
  category_id: number;
  image: string;
}

interface HomeServicesProps {
  serviceLists: ServiceListProps[];
  // mode: "landing" = แสดง 3 รายการ + ปุ่มดูทั้งหมด, "full" = แสดงทั้งหมด
  mode?: "landing" | "full";
  // Req1: callback เมื่อ user กด category badge บนการ์ด
  onCategoryClick?: (categoryId: number, categoryNameTh: string) => void;
}

export default function HomeServices({
  serviceLists,
  mode = "full",
  onCategoryClick,
}: HomeServicesProps) {
  const router = useRouter();

  // Req3: ถ้า mode="landing" แสดงแค่ 3 รายการแรก (ยอดนิยม ควร sort มาจาก API แล้ว)
  const displayList =
    mode === "landing" ? serviceLists.slice(0, 3) : serviceLists;

  return (
    <div className="w-full bg-gray-50 py-16 text-gray-900 font-prompt overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-10 lg:px-18">
        {/* หัวข้อ */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            {mode === "landing" ? "บริการยอดนิยมของเรา" : "บริการของเรา"}
          </h2>
        </div>

        {/* Grid การ์ด */}
        {displayList.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-gray-400 text-lg">
              ไม่พบบริการที่ตรงกับการค้นหา
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayList.map((service) => {
              const color = getCategoryColor(service.category_name);
              return (
                <div
                  key={service.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-6 flex flex-col grow">
                    {/* Req1 + Req2: category badge กดได้ + สีต่างกันตาม category */}
                    <button
                      onClick={() =>
                        onCategoryClick?.(
                          service.category_id,
                          service.category_name_th,
                        )
                      }
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold w-max mb-3 transition-opacity hover:opacity-75 cursor-pointer
                        ${color.bg} ${color.text}
                        ${onCategoryClick ? "cursor-pointer" : "cursor-default"}`}
                    >
                      {service.category_name_th}
                    </button>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {service.name}
                    </h3>

                    <div className="flex items-center gap-2 text-gray-500 mb-6 grow">
                      <Tag className="w-4 h-4 text-blue-500 shrink-0" />
                      <p className="text-sm">
                        {service.min_price?.toLocaleString()
                          ? service.min_price.toLocaleString()
                          : service.price?.toLocaleString()}
                        ฿
                      </p>
                    </div>

                    <button className="text-blue-600 hover:text-blue-800 font-bold transition-colors cursor-pointer self-start underline underline-offset-4 decoration-blue-600/30 hover:decoration-blue-800 text-base">
                      เลือกบริการ
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Req3: ปุ่ม "ดูบริการทั้งหมด" แสดงเฉพาะ mode="landing" */}
        {mode === "landing" && (
          <div className="mt-16 flex justify-center">
            <button
              onClick={() => router.push("/service-lists")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-10 rounded-xl transition-all hover:shadow-lg flex items-center gap-2 cursor-pointer text-lg"
            >
              ดูบริการทั้งหมด <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
