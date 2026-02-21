import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const MIN = 0;
const MAX = 2000;

interface PriceRangeDropdownProps {
  minPrice: number;
  maxPrice: number;
  onChange: (min: number, max: number) => void;
}

export default function PriceRangeDropdown({
  minPrice,
  maxPrice,
  onChange,
}: PriceRangeDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const minPct = ((minPrice - MIN) / (MAX - MIN)) * 100;
  const maxPct = ((maxPrice - MIN) / (MAX - MIN)) * 100;

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(Number(e.target.value), maxPrice - 100);
    onChange(val, maxPrice);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(Number(e.target.value), minPrice + 100);
    onChange(minPrice, val);
  };

  const label = `${minPrice.toLocaleString()}-${maxPrice.toLocaleString()}฿`;

  return (
    <div className="relative flex-1 sm:flex-none" ref={ref}>
      {/* Trigger */}
      <div
        className="flex flex-col gap-1 px-3 border-r border-gray-200 sm:px-4 md:px-5 cursor-pointer"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="text-[12px] text-gray-700 whitespace-nowrap">ราคา</span>
        <button className="flex items-center gap-1 text-[16px] font-medium text-gray-950 whitespace-nowrap">
          {label}
          <ChevronDown
            className={`w-4 h-4 text-gray-500 shrink-0 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 p-5">
          <p className="text-[18px] font-semibold text-gray-900 mb-5">{label}</p>

          {/* Dual Range Slider */}
          <div className="relative h-6 flex items-center mb-4">
            <div className="absolute w-full h-1.5 bg-gray-200 rounded-full" />
            <div
              className="absolute h-1.5 bg-blue-500 rounded-full"
              style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
            />
            <input
              type="range" min={MIN} max={MAX} step={100} value={minPrice}
              onChange={handleMinChange}
              className="absolute w-full appearance-none bg-transparent pointer-events-none
                [&::-webkit-slider-thumb]:pointer-events-auto
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600
                [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white
                [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <input
              type="range" min={MIN} max={MAX} step={100} value={maxPrice}
              onChange={handleMaxChange}
              className="absolute w-full appearance-none bg-transparent pointer-events-none
                [&::-webkit-slider-thumb]:pointer-events-auto
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600
                [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white
                [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
            />
          </div>
          <div className="flex justify-between text-sm font-medium text-gray-500">
            <span>{minPrice.toLocaleString()}</span>
            <span>{maxPrice.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}