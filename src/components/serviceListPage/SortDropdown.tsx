/**
 * SortDropdown Component
 *
 * A controlled dropdown used by the search bar to select how service
 * results should be ordered (recommended, popular, alphabetical, etc).
 * Emits the underlying filter/sort parameters back to the parent.
 */
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { ServiceFilterParams } from "@/types/serviceListTypes/type";
import { useTranslation } from "next-i18next";

interface SortOption {
  key: string;
  params: Pick<ServiceFilterParams, "filter" | "sort_by" | "order">;
}

const SORT_OPTIONS: SortOption[] = [
  { key: "service_list.sort_recommended", params: { filter: "recommended" } },
  { key: "service_list.sort_popular", params: { filter: "popular" } },
  { key: "service_list.sort_az", params: { sort_by: "name", order: "ASC" } },
  { key: "service_list.sort_za", params: { sort_by: "name", order: "DESC" } },
];

interface SortDropdownProps {
  selectedLabel: string;
  onSelect: (
    params: Pick<ServiceFilterParams, "filter" | "sort_by" | "order">,
    label: string,
  ) => void;
}

export default function SortDropdown({
  selectedLabel,
  onSelect,
}: SortDropdownProps) {
  const { t } = useTranslation("common");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative flex-1 sm:flex-none" ref={ref}>
      <div
        className="flex flex-col gap-1 pl-3 sm:pl-4 md:pl-5 cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="text-[12px] text-gray-700 whitespace-nowrap">
          {t("service_list.sort_label")}
        </span>
        <button className="flex items-center gap-1 text-[16px] font-medium text-gray-950 whitespace-nowrap">
          <span className="sm:hidden">
            {selectedLabel.length > 8
              ? selectedLabel.slice(0, 8) + "..."
              : selectedLabel}
          </span>
          <span className="hidden sm:inline lg:hidden">
            {selectedLabel.length > 12
              ? selectedLabel.slice(0, 12) + "..."
              : selectedLabel}
          </span>
          <span className="hidden lg:inline">{selectedLabel}</span>
          <ChevronDown
            className={`w-4 h-4 text-gray-500 shrink-0 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
          <div className="p-2">
            {SORT_OPTIONS.map((opt) => {
              const label = t(opt.key);
              return (
                <button
                  key={opt.key}
                  onClick={() => {
                    onSelect(opt.params, label);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-[15px] font-medium transition-colors duration-150
                    ${
                      selectedLabel === label
                        ? "text-blue-600 bg-blue-50 font-semibold"
                        : "text-gray-800 hover:bg-gray-50"
                    }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
