import { Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full">
      {/* Upper Section - White Background */}
      <div className="bg-utility-white py-8 px-4 md:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-8">
            {/* Left: Logo */}
            <div className="flex items-center min-w-0 shrink-0">
              <img
                src="/homeservices_logo.svg"
                alt="HomeServices Logo"
                className="h-11 w-auto" 
              />
            </div>

            {/* Middle: Company Information in Thai */}
            <div className="flex flex-col min-w-0 flex-1">
              <p className="mb-1 headline-4 text-gray-950">บริษัท โฮมเซอร์วิสเซส จำกัด</p>
              <p className="body-3 text-gray-800">452 ซอยสุขุมวิท 79 แขวงพระโขนงเหนือ เขตวัฒนา กรุงเทพมหานคร 10260</p>
            </div>

            {/* Right: Contact Information */}
            <div className="flex flex-col gap-2 text-gray-800 min-w-0 shrink-0">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-500 shrink-0" />
                <a href="tel:080-540-6357" className="body-2 font-normal hover:text-blue-600 transition-colors break-all">
                  080-540-6357
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-500 shrink-0" />
                <a href="mailto:contact@homeservices.co" className="body-2 font-normal hover:text-blue-600 transition-colors break-all">
                  contact@homeservices.co
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Section - Light Grey Background */}
      <div className="bg-gray-100 py-4 px-4 md:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-gray-700">
            {/* Terms and Privacy Policy Links - Stacked vertically on mobile */}
            <div className="flex flex-col md:flex-row md:flex-wrap md:items-center gap-6 order-1 md:order-2 min-w-0">
              <a
                href="#"
                className="body-3 hover:text-blue-600 transition-colors"
              >
                เงื่อนไขและข้อตกลงการใช้งานเว็บไซต์
              </a>
              <a
                href="#"
                className="body-3 hover:text-blue-600 transition-colors"
              >
                นโยบายความเป็นส่วนตัว
              </a>
            </div>

            {/* Copyright - Bottom on mobile, Left on desktop */}
            <div className="order-2 md:order-1 min-w-0">
              <p className="body-4 text-gray-500">copyright © 2021 HomeServices.com All rights reserved</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
