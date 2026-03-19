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
import {
  fetchServices,
  fetchPriceRange,
} from "@/services/servicesList/serviceApi";
import { Service, ServiceFilterParams } from "@/types/serviceListTypes/type";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

interface SearchAndFilterBarProps {
  onResults: (services: Service[]) => void;
  onLoading: (loading: boolean) => void;
  allServices: Service[];
}

export default function SearchAndFilterBar({
  onResults,
  onLoading,
  allServices,
}: SearchAndFilterBarProps) {
  const { t } = useTranslation("common");
  const { locale } = useRouter();

  // --- filter state ---
  const [searchText, setSearchText] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categoryLabel, setCategoryLabel] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [sortLabel, setSortLabel] = useState("");
  const [sortParams, setSortParams] = useState<
    Pick<ServiceFilterParams, "filter" | "sort_by" | "order">
  >({ sort_by: "name", order: "ASC" });
  const [suggestions, setSuggestions] = useState<Service[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [priceRangeMax, setPriceRangeMax] = useState(2000);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Set default labels once translation is available
  useEffect(() => {
    if (!categoryLabel) setCategoryLabel(t("service_list.all_services"));
    if (!sortLabel) setSortLabel(t("service_list.sort_az"));
  }, [t, categoryLabel, sortLabel]);

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

  useEffect(() => {
    const loadPriceRange = async () => {
      try {
        const data = await fetchPriceRange();
        setPriceRangeMax(data.max_price);
        setMaxPrice(data.max_price);
      } catch (error) {
        console.error("Error fetching price range:", error);
      }
    };
    loadPriceRange();
  }, []);

  const handleInputChange = (value: string) => {
    setSearchText(value);
    if (!value.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const keyword = value.toLowerCase();
    const filtered = allServices
      .filter((s) => {
        const name = (locale === "en" ? s.name_en : s.name_th) || s.name;
        return name.toLowerCase().includes(keyword);
      })
      .slice(0, 3);

    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  };

  const handleSelectSuggestion = (service: Service) => {
    const name =
      (locale === "en" ? service.name_en : service.name_th) || service.name;
    setSearchText(name);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleClear = () => {
    setSearchText("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

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
      <div className="w-full max-w-7xl mx-auto px-4 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:py-6 sm:gap-0 sm:px-6 md:px-10 lg:px-18">
        <div className="flex gap-3 items-center sm:flex-1 sm:min-w-0 sm:pr-4 overflow-visible">
          <div ref={searchContainerRef} className="flex-1 relative min-w-0">
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-3">
              <Search className="w-5 h-5 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder={t("service_list.search_placeholder")}
                value={searchText}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 min-w-0 bg-transparent font-prompt text-sm text-gray-700 placeholder-gray-700 outline-none"
              />
              {searchText && (
                <button
                  onClick={handleClear}
                  className="text-gray-400 hover:text-gray-600 transition-colors shrink-0 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {showSuggestions && (
              <ul className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30 overflow-hidden">
                {suggestions.map((service) => {
                  const displayName =
                    (locale === "en" ? service.name_en : service.name_th) ||
                    service.name;
                  const displayCategory =
                    (locale === "en"
                      ? service.category_name_en
                      : service.category_name_th) || service.category_name_th;
                  return (
                    <li
                      key={service.id}
                      onClick={() => handleSelectSuggestion(service)}
                      className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <span className="font-prompt text-sm text-gray-800">
                        {displayName}
                      </span>
                      <span className="font-prompt text-xs text-gray-400 ml-3 shrink-0">
                        {displayCategory}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <button
            onClick={handleSearch}
            className="btn-primary px-6 py-3 headline-5 font-medium sm:hidden shrink-0"
          >
            {t("service_list.search_button")}
          </button>
        </div>

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
            absoluteMax={priceRangeMax}
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

        <button
          onClick={handleSearch}
          className="hidden sm:inline-flex btn-primary px-5 py-3 headline-5 font-medium shrink-0 sm:ml-4 md:ml-6"
        >
          {t("service_list.search_button")}
        </button>
      </div>
    </div>
  );
}
