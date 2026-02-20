import { Search } from "lucide-react";
import { ChevronDown } from "lucide-react";

const SearchAndFilterBar = () => {
  return (
    <div className="w-full px-4 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:py-8 sm:gap-0 sm:px-6 md:px-10 lg:px-45 shadow-lg sticky top-0 z-10 bg-white">
      {/* Search Input */}
      <div className="flex gap-3 items-center sm:flex-1 sm:min-w-0 sm:pr-4 overflow-hidden">
        <div className="flex-1 flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-3 min-w-0">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="ค้นหาบริการ..."
            className="flex-1 min-w-0 bg-transparent font-prompt text-sm text-gray-700 placeholder-gray-700 outline-none"
          />
        </div>

        {/* Search Button (mobile only) */}
        <button className="btn-primary px-6 py-3 headline-5 font-medium sm:hidden shrink-0">
          ค้นหา
        </button>
      </div>

      {/* Filter Row */}
      <div className="font-prompt flex items-stretch gap-0 pt-3 border-t border-gray-100 sm:pt-0 sm:border-t-0 sm:border-l sm:border-gray-200 sm:shrink-0 overflow-hidden">
        {/* Filter: หมวดหมู่บริการ */}
        <div className="flex-1 sm:flex-none flex flex-col gap-1 pr-3 border-r border-gray-200 sm:px-4 md:px-5">
          <span className="text-[12px] text-gray-700 whitespace-nowrap">
            หมวดหมู่บริการ
          </span>
          <button className="flex items-center gap-1 text-[16px] font-medium text-gray-950 whitespace-nowrap">
            บริการทั้งหมด
            <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
          </button>
        </div>

        {/* Filter: ราคา */}
        <div className="flex-1 sm:flex-none flex flex-col gap-1 px-3 border-r border-gray-200 sm:px-4 md:px-5">
          <span className="text-[12px] text-gray-700 whitespace-nowrap">
            ราคา
          </span>
          <button className="flex items-center gap-1 text-[16px] font-medium text-gray-950 whitespace-nowrap">
            0-2000฿
            <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
          </button>
        </div>

        {/* Filter: เรียงตาม */}
        <div className="flex-1 sm:flex-none flex flex-col gap-1 pl-3 sm:pl-4 md:pl-5">
          <span className="text-[12px] text-gray-700 whitespace-nowrap">
            เรียงตาม
          </span>
          <button className="flex items-center gap-1 text-[16px] font-medium text-gray-950 whitespace-nowrap">
            <span className="sm:hidden">ตามตัวอัก...</span>
            <span className="hidden sm:inline lg:hidden">ตามตัวอักษร</span>
            <span className="hidden lg:inline">ตามตัวอักษร(จากน้อยไปมาก)</span>
            <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
          </button>
        </div>
      </div>

      {/* Search Button (sm+ only) */}
      <button className="hidden sm:inline-flex btn-primary px-5 py-3 headline-5 font-medium shrink-0 sm:ml-4 md:ml-6">
        ค้นหา
      </button>
    </div>
  );
};

export default SearchAndFilterBar;
