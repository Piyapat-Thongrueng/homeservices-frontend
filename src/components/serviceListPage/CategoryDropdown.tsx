import { useState, useRef, useEffect } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { fetchCategories } from "@/services/serviceListsApi/serviceApi";
import { Category } from "@/types/serviceListTypes/type";

interface CategoryDropdownProps {
  selectedId: number | null;
  selectedLabel: string;
  onChange: (id: number | null, label: string) => void;
}

export default function CategoryDropdown({
  selectedId,
  selectedLabel,
  onChange,
}: CategoryDropdownProps) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // ดึง categories ตอน mount ครั้งแรก (ไม่ต้องรอกดปุ่มค้นหา)
  const fetchCategoriesData = async () => {
    try {
      const data = await fetchCategories();
      console.log("Fetched categories in dropdown:", data);
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoriesData();
  }, []);

  // ปิด dropdown เมื่อ click นอก
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const displayLabel = selectedLabel || "บริการทั้งหมด";

  return (
    <div className="relative flex-1 sm:flex-none" ref={ref}>
      {/* Trigger */}
      <div
        className="flex flex-col gap-1 pr-3 border-r border-gray-200 sm:px-4 md:px-5 cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="text-[12px] text-gray-700 whitespace-nowrap">
          หมวดหมู่บริการ
        </span>
        <button className="flex items-center gap-1 text-[16px] font-medium text-gray-950 whitespace-nowrap">
          <span className="sm:hidden">
            {displayLabel.length > 8
              ? displayLabel.slice(0, 8) + "..."
              : displayLabel}
          </span>
          <span className="hidden sm:inline">{displayLabel}</span>
          <ChevronDown
            className={`w-4 h-4 text-gray-500 shrink-0 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
          {loading ? (
            // Loading state
            <div className="flex flex-col items-center justify-center gap-2 py-6 px-4">
              <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
              <span className="text-sm text-gray-500">
                กำลังดาวน์โหลดข้อมูล
              </span>
            </div>
          ) : error ? (
            <div className="py-4 px-4 text-sm text-red-500 text-center">
              โหลดข้อมูลไม่สำเร็จ
            </div>
          ) : (
            <div className="p-2">
              {/* ตัวเลือก "ทั้งหมด" */}
              <button
                onClick={() => {
                  onChange(null, "บริการทั้งหมด");
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl text-[15px] font-medium transition-colors duration-150
                  ${
                    selectedId === null
                      ? "text-blue-600 bg-blue-50 font-semibold"
                      : "text-gray-800 hover:bg-gray-50"
                  }`}
              >
                บริการทั้งหมด
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onChange(cat.id, cat.name_th);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-[15px] font-medium transition-colors duration-150
                    ${
                      selectedId === cat.id
                        ? "text-blue-600 bg-blue-50 font-semibold"
                        : "text-gray-800 hover:bg-gray-50"
                    }`}
                >
                  {cat.name_th}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
