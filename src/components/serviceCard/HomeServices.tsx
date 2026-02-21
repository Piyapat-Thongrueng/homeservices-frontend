import { ArrowRight, Tag } from "lucide-react"; // เพิ่มการ import Tag

interface serviceListProps {
  id: number;
  name: string;
  description: string;
  price: number;
  category_name: string;
  category_name_th: string;
  image: string;
}

interface HomeServicesProps {
  serviceLists: serviceListProps[];
}

export default function HomeServices({ serviceLists }: HomeServicesProps) {
  return (
    <div className="min-h-screen  bg-gray-50 py-16 text-gray-900 font-prompt">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* หัวข้อกลางหน้าจอ */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-3xl font-bold text-gray-900">
            บริการยอดฮิตของเรา
          </h2>
        </div>

        {/* ส่วนแสดงผลการ์ดบริการ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceLists.map((service) => (
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

              <div className="p-6 flex flex-col flex-grow">
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full w-max mb-3">
                  {service.category_name_th}
                </span>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {service.name}
                </h3>

                {/* ส่วนราคา: เพิ่มไอคอนป้ายราคาตรงนี้ครับ */}
                <div className="flex items-center gap-2 text-gray-500 mb-6 flex-grow">
                  <Tag className="w-4 h-4 text-blue-500 shrink-0" />
                  <p className="text-sm">{service.price}</p>
                </div>

                <button className="text-blue-600 hover:text-blue-800 font-bold transition-colors cursor-pointer self-start underline underline-offset-4 decoration-blue-600/30 hover:decoration-blue-800 text-base">
                  เลือกบริการ
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ปุ่มดูบริการทั้งหมด */}
        <div className="mt-16 flex justify-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-10 rounded-xl transition-all hover:shadow-lg flex items-center gap-2 cursor-pointer text-lg">
            ดูบริการทั้งหมด <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
