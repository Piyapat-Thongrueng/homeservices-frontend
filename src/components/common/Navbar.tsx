import { useState } from "react";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="w-full px-5 sm:px-6 md:px-35">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-5 sm:gap-10 md:gap-15">
            <img
              src="/web-logo.svg"
              alt="HomeServices Logo"
              className="h-5 w-30 sm:h-10 sm:w-40"
            />
            <a
              href="#services"
              className="headline-5 font-medium text-black hover:text-blue-600 transition-colors"
            >
              บริการของเรา
            </a>
          </div>
          <div className="flex items-center">
            <button className="border border-blue-600 text-blue-600 rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-600 hover:text-white transition-all duration-200">
              เข้าสู่ระบบ
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
