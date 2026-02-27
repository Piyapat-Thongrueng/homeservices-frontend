/**
 * SearchAndFilterBar Component
 *
 * Provides the sticky search and filter controls for the service list page:
 * - free-text search
 * - category selector
 * - price range slider
 * - sort options
 * and orchestrates calling the services API before bubbling results and loading
 * state up to the parent page.
 */
import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import CategoryDropdown from "./CategoryDropdown";
import PriceRangeDropdown from "./PriceRangeDropdown";
import SortDropdown from "./SortDropdown";
import { fetchServices } from "@/services/serviceListsApi/serviceApi";
import { Service, ServiceFilterParams } from "@/types/serviceListTypes/type";

interface SearchAndFilterBarProps {
  onResults: (services: Service[]) => void; // callback ที่ parent (ServiceListPage) ส่งมาให้ เมื่อค้นหาเสร็จจะเรียก onResults(data) เพื่อส่งผลลัพธ์ขึ้นไปให้ parent แสดงผล
  onLoading: (loading: boolean) => void; // callback บอก parent ว่ากำลังโหลดอยู่ไหม parent จะใช้ค่านี้แสดง/ซ่อน loading spinner
  allServices: Service[]; // ข้อมูลบริการทั้งหมดจาก parent
}

export default function SearchAndFilterBar({
  onResults,
  onLoading,
  allServices,
}: SearchAndFilterBarProps) {
  // --- filter state ---
  const [searchText, setSearchText] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categoryLabel, setCategoryLabel] = useState("บริการทั้งหมด");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [sortLabel, setSortLabel] = useState("ตามตัวอักษร (A→Z)");
  const [sortParams, setSortParams] = useState<
    Pick<ServiceFilterParams, "filter" | "sort_by" | "order"> // เก็บ params จริงที่จะส่งไป backend แยกออกมาจาก sortLabel เพราะ backend ต้องการ params
  >({ sort_by: "name", order: "ASC" }); // ค่า default เริ่มต้นเป็น A→Z (sort_by: "name", order: "ASC")
  const [suggestions, setSuggestions] = useState<Service[]>([]); // สำหรับเก็บคำแนะนำการค้นหา (autocomplete suggestions)
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null); // ควบคุมการแสดง/ซ่อน dropdown คำแนะนำ

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  //กรอง suggestion จาก allServices ที่โหลดมาแล้ว ทำงานทุกครั้งที่ searchText เปลี่ยน
  const handleInputChange = (value: string) => {
    setSearchText(value);
    console.log("allServices length:", allServices.length);
    console.log("value:", value);

    if (!value.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    // กรองจาก allServices โดย match กับ service name (case-insensitive)
    const keyword = value.toLowerCase();
    const filtered = allServices
      .filter((s) => s.name.toLowerCase().includes(keyword))
      .slice(0, 3); // แสดงสูงสุด 3 รายการ

      console.log("filtered:", filtered);

    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  };

  // เมื่อ user คลิก suggestion → เติมคำในช่อง แล้วปิด dropdown รอกด search
  const handleSelectSuggestion = (service: Service) => {
    setSearchText(service.name);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // เมื่อ user กดปุ่มล้าง (X) → ล้างคำค้นหาและผลลัพธ์ที่แสดง
  const handleClear = () => {
    setSearchText("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // ฟังก์ชันนี้จะถูกเรียกเมื่อผู้ใช้คลิกปุ่มค้นหา หรือกด Enter ในช่องค้นหา มันจะรวบรวมค่าต่างๆ จาก state แล้วส่งไปให้ fetchServices เพื่อดึงข้อมูลจาก backend และส่งผลลัพธ์กลับไปให้ parent ผ่าน onResults
  const handleSearch = async () => {
    onLoading(true);
    try {
      const params: ServiceFilterParams = {
        search: searchText || undefined,
        category_id: categoryId ?? undefined,
        min_price: minPrice,
        max_price: maxPrice,
        ...sortParams,
      };
      const data = await fetchServices(params);
      onResults(data);
    } catch (err) {
      console.error("Search failed:", err);
      onResults([]);
    } finally {
      onLoading(false);
    }
  };

  return (
    <div className="w-full sticky top-0 z-20 bg-white shadow-md">
      <div className="w-full max-w-screen-2xl mx-auto px-4 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:py-6 sm:gap-0 sm:px-6 md:px-10 lg:px-18">
        {/* Search Input + Autocomplete Dropdown */}
        <div className="flex gap-3 items-center sm:flex-1 sm:min-w-0 sm:pr-4 overflow-visible">
          {/* เพิ่ม ref และ relative เพื่อให้ dropdown ชิดกับ input */}
          <div ref={searchContainerRef} className="flex-1 relative min-w-0">
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-3">
              <Search className="w-5 h-5 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="ค้นหาบริการ..."
                value={searchText}
                // 🔄 เปลี่ยนจาก onChange setSearchText → handleInputChange (ทำ filter ด้วย)
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 min-w-0 bg-transparent font-prompt text-sm text-gray-700 placeholder-gray-700 outline-none"
              />
              {/* ปุ่ม X: แสดงเฉพาะเมื่อมีข้อความใน input */}
              {searchText && (
                <button
                  onClick={handleClear}
                  className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {showSuggestions && (
              <ul className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30 overflow-hidden">
                {suggestions.map((service) => (
                  <li
                    key={service.id}
                    onClick={() => handleSelectSuggestion(service)}
                    className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    {/* ชื่อบริการ */}
                    <span className="font-prompt text-sm text-gray-800">
                      {service.name}
                    </span>
                    {/* หมวดหมู่ */}
                    <span className="font-prompt text-xs text-gray-400 ml-3 shrink-0">
                      {service.category_name_th}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ปุ่มค้นหา mobile */}
          <button
            onClick={handleSearch}
            className="btn-primary px-6 py-3 headline-5 font-medium sm:hidden shrink-0"
          >
            ค้นหา
          </button>
        </div>

        {/* Filter Row — ไม่มีการเปลี่ยนแปลง */}
        <div className="font-prompt flex items-stretch overflow-x-clip gap-0 pt-3 border-t border-gray-100 sm:pt-0 sm:border-t-0 sm:border-l sm:border-gray-200 sm:shrink-0">
          <CategoryDropdown
            selectedId={categoryId}
            selectedLabel={categoryLabel}
            onChange={(id, label) => {
              setCategoryId(id);
              setCategoryLabel(label);
            }}
          />
          <PriceRangeDropdown
            minPrice={minPrice}
            maxPrice={maxPrice}
            onChange={(min, max) => {
              setMinPrice(min);
              setMaxPrice(max);
            }}
          />
          <SortDropdown
            selectedLabel={sortLabel}
            onSelect={(params, label) => {
              setSortParams(params);
              setSortLabel(label);
            }}
          />
        </div>

        {/* ปุ่มค้นหา desktop */}
        <button
          onClick={handleSearch}
          className="hidden sm:inline-flex btn-primary px-5 py-3 headline-5 font-medium shrink-0 sm:ml-4 md:ml-6"
        >
          ค้นหา
        </button>
      </div>
    </div>
  );
}
