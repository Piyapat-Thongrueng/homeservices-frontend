import { useState } from "react";
import { Search } from "lucide-react";
import CategoryDropdown from "./CategoryDropdown";
import PriceRangeDropdown from "./PriceRangeDropdown";
import SortDropdown from "./SortDropdown";
import { fetchServices } from "../../services/serviceListsApi/serviceApi";
import {
  Service,
  ServiceFilterParams,
} from "../../types/serviceListTypes/type";

interface SearchAndFilterBarProps {
  onResults: (services: Service[]) => void;
  onLoading: (loading: boolean) => void;
}

export default function SearchAndFilterBar({
  onResults,
  onLoading,
}: SearchAndFilterBarProps) {
  // --- filter state ---
  const [searchText, setSearchText] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categoryLabel, setCategoryLabel] = useState("บริการทั้งหมด");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [sortLabel, setSortLabel] = useState("บริการแนะนำ");
  const [sortParams, setSortParams] = useState<
    Pick<ServiceFilterParams, "filter" | "sort_by" | "order">
  >({ filter: "recommended" });

  // --- กดปุ่มค้นหา → ส่ง request ---
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
    <div className="w-full px-4 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:py-6 sm:gap-0 sm:px-6 md:px-10 lg:px-14 shadow-lg sticky top-0 z-10 bg-white">
      {/* Search Input */}
      <div className="flex gap-3 items-center sm:flex-1 sm:min-w-0 sm:pr-4 overflow-hidden">
        <div className="flex-1 flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-3 min-w-0">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="ค้นหาบริการ..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 min-w-0 bg-transparent font-prompt text-sm text-gray-700 placeholder-gray-700 outline-none"
          />
        </div>
        {/* ปุ่มค้นหา (mobile only) */}
        <button
          onClick={handleSearch}
          className="btn-primary px-6 py-3 headline-5 font-medium sm:hidden shrink-0"
        >
          ค้นหา
        </button>
      </div>

      {/* Filter Row */}
      <div className="font-prompt flex items-stretch gap-0 pt-3 border-t border-gray-100 sm:pt-0 sm:border-t-0 sm:border-l sm:border-gray-200 sm:shrink-0">
        {/* Req2: Category - ดึงข้อมูลตอน mount, ส่ง category_id */}
        <CategoryDropdown
          selectedId={categoryId}
          selectedLabel={categoryLabel}
          onChange={(id, label) => {
            setCategoryId(id);
            setCategoryLabel(label);
          }}
        />

        {/* Req3: Price Range - ส่ง min_price, max_price */}
        <PriceRangeDropdown
          minPrice={minPrice}
          maxPrice={maxPrice}
          onChange={(min, max) => {
            setMinPrice(min);
            setMaxPrice(max);
          }}
        />

        {/* Req4: Sort - ส่ง filter/sort_by/order */}
        <SortDropdown
          selectedLabel={sortLabel}
          onSelect={(params, label) => {
            setSortParams(params);
            setSortLabel(label);
          }}
        />
      </div>

      {/* ปุ่มค้นหา (sm+ only) */}
      <button
        onClick={handleSearch}
        className="hidden sm:inline-flex btn-primary px-5 py-3 headline-5 font-medium shrink-0 sm:ml-4 md:ml-6"
      >
        ค้นหา
      </button>
    </div>
  );
}
