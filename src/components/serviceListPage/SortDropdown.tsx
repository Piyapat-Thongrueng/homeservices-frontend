import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { ServiceFilterParams } from "@/types/serviceListTypes/type";

// Pick คือการหยิบแค่บาง field จาก ServiceFilterParams มาใช้
// หมายความว่า params จะมีได้แค่ 3 key นี้ → filter, sort_by, order
interface SortOption {
  label: string;
  params: Pick<ServiceFilterParams, "filter" | "sort_by" | "order">;
}

// แต่ละ option label ↔ params คู่กัน เมื่อ user เลือก label ไหน
// ก็ส่ง params ของ label นั้นไปให้ SearchAndFilterBar
const SORT_OPTIONS: SortOption[] = [
  { label: "บริการแนะนำ", params: { filter: "recommended" } },
  { label: "บริการยอดนิยม", params: { filter: "popular" } },
  { label: "ตามตัวอักษร (A→Z)", params: { sort_by: "name", order: "ASC" } },
  { label: "ตามตัวอักษร (Z→A)", params: { sort_by: "name", order: "DESC" } },
];

// ข้อความของตัวเลือกที่ถูกเลือกอยู่ตอนนี้
// ควบคุมจากข้างนอก (SearchAndFilterBar) ไม่ได้เก็บใน component นี้เอง
// → นี่คือ "controlled component" pattern
interface SortDropdownProps {
  selectedLabel: string;
  // callback ที่เรียกเมื่อ user เลือกตัวเลือก
  // ส่ง params และ label กลับไปให้ parent (SearchAndFilterBar) จัดการต่อ
  onSelect: (
    params: Pick<ServiceFilterParams, "filter" | "sort_by" | "order">,
    label: string,
  ) => void;
}

export default function SortDropdown({
  selectedLabel,
  onSelect,
}: SortDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null); // ref ชี้ไปที่ div ของ component นี้ทั้งหมด // ใช้เพื่อตรวจว่า user click อยู่ใน component หรือนอก component

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false); // ถ้า element ที่ถูก click ไม่ได้อยู่ใน ref → ปิด dropdown
    };
    document.addEventListener("mousedown", handler); // ฟัง click ทุกที่บนหน้าจอ ถ้า click นอก component → ปิด dropdown
    return () => document.removeEventListener("mousedown", handler); // cleanup เมื่อ component ถูก unmount เพื่อไม่ให้ memory leak
  }, []);

  return (
    <div className="relative flex-1 sm:flex-none" ref={ref}>
      {/* Trigger */}
      <div
        className="flex flex-col gap-1 pl-3 sm:pl-4 md:pl-5 cursor-pointer"
        onClick={() => setOpen((prev) => !prev)} // กดแต่ละครั้ง toggle open ↔ close
      >
        <span className="text-[12px] text-gray-700 whitespace-nowrap">
          เรียงตาม
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

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute top-full right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
          <div className="p-2">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.label}
                onClick={() => {
                  onSelect(opt.params, opt.label); // ส่ง params + label กลับไปให้ SearchAndFilterBar ซึ่งจะ setSortParams และ setSortLabel
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl text-[15px] font-medium transition-colors duration-150
                  ${
                    selectedLabel === opt.label
                      ? "text-blue-600 bg-blue-50 font-semibold"
                      : "text-gray-800 hover:bg-gray-50"
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
