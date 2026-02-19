import React from "react";
import { ArrowRight, Tag } from "lucide-react"; // เพิ่มการ import Tag

const popularServices = [
  {
    id: 1,
    category: "บริการทั่วไป",
    title: "ทำความสะอาดทั่วไป",
    price: "ค่าบริการประมาณ 500.00 - 1,000.00 ฿",
    image: "https://carecleans.com/wp-content/uploads/2022/10/CareCleans-SEO-OCT-C02-1.jpg", 
  },
  {
    id: 2,
    category: "บริการทั่วไป",
    title: "ล้างแอร์",
    price: "ค่าบริการประมาณ 500.00 - 1,000.00 ฿",
    image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?q=80&w=500&auto=format&fit=crop",
  },
  {
    id: 3,
    category: "บริการทั่วไป",
    title: "ซ่อมเครื่องซักผ้า",
    price: "ค่าบริการประมาณ 500.00 ฿",
    image: "https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?q=80&w=500&auto=format&fit=crop",
  },
];

export default function HomeServices() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 text-gray-900 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* หัวข้อกลางหน้าจอ */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-3xl font-bold text-gray-900">
            บริการยอดฮิตของเรา
          </h2>
         
        </div>

        {/* ส่วนแสดงผลการ์ดบริการ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {popularServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full w-max mb-3">
                  {service.category}
                </span>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {service.title}
                </h3>
                
                {/* ส่วนราคา: เพิ่มไอคอนป้ายราคาตรงนี้ครับ */}
                <div className="flex items-center gap-2 text-gray-500 mb-6 flex-grow">
                  <Tag className="w-4 h-4 text-blue-500 shrink-0" />
                  <p className="text-sm">
                    {service.price}
                  </p>
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