import { useState } from "react";
import { Menu } from "lucide-react";
import { X } from "lucide-react";

// Navbar.tsx
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="w-full max-w-screen-2xl mx-auto px-5 sm:px-6 md:px-16 lg:px-24">
        <div className="flex items-center justify-between py-5">
          <div className="flex items-center gap-15">
            <img
              src="/web-logo.svg"
              alt="HomeServices Logo"
              className="w-50 h-auto object-contain"
            />
            <a
              href="#services"
              className="hidden md:inline headline-4 font-medium text-black hover:text-blue-600 transition-colors"
            >
              บริการของเรา
            </a>
          </div>

          <div className="hidden md:flex items-center">
            <button className="font-prompt border border-blue-600 text-blue-600 rounded-lg px-8 py-2 text-lg font-medium hover:bg-blue-600 hover:text-white transition-all duration-200 cursor-pointer">
              เข้าสู่ระบบ
            </button>
          </div>

          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="cursor-pointer" />
            ) : (
              <Menu className="cursor-pointer" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-2 space-y-1">
            <a
              href="#services"
              className="font-prompt block px-4 py-3 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              บริการของเรา
            </a>
            <div className="px-4 py-2">
              <button
                className="w-full font-prompt border border-blue-600 text-blue-600 rounded-lg px-6 py-2 text-sm font-medium hover:bg-blue-600 hover:text-white transition-all duration-200 cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                เข้าสู่ระบบ
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
