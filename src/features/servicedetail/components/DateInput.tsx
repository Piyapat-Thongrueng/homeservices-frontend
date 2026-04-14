/**
 * DateInput Component
 * 
 * A reusable date input component that displays dates in DD/MM/YYYY format
 * while storing them internally in YYYY-MM-DD format for compatibility.
 * 
 * Features:
 * - Text input with DD/MM/YYYY format display
 * - Native calendar picker integration (past dates are grayed out via `min`)
 * - Auto-formatting as user types
 * - Date validation (past dates are rejected with an error message)
 */

import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import {
  formatDateToDDMMYYYY,
  formatDateToYYYYMMDD,
  validateDate,
} from "@/utils/date-formatters";

interface DateInputProps {
  /** Current date value in YYYY-MM-DD format */
  value: string;
  /** Callback when date changes (receives YYYY-MM-DD format) */
  onChange: (date: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Label text */
  label: string;
  /** Whether the field is required */
  required?: boolean;
}

/** Returns today's date as YYYY-MM-DD string (no time zone shift) */
const getTodayString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const DateInput: React.FC<DateInputProps> = ({
  value,
  onChange,
  placeholder = "DD/MM/YYYY",
  label,
  required = false,
}) => {
  // Display date in DD/MM/YYYY format
  const [displayDate, setDisplayDate] = useState(() => {
    return formatDateToDDMMYYYY(value);
  });

  // Whether the user has typed a past date manually
  const [isPastDate, setIsPastDate] = useState(false);

  const todayString = getTodayString();

  // Sync displayDate when value prop changes (e.g., from calendar picker)
  useEffect(() => {
    if (value && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
      setDisplayDate(formatDateToDDMMYYYY(value));
      setIsPastDate(false);
    } else if (!value) {
      setDisplayDate("");
      setIsPastDate(false);
    }
  }, [value]);

  /**
   * Handles text input changes.
   * Formats input as DD/MM/YYYY, validates the date, and rejects past dates.
   */
  const handleDateChange = (inputValue: string) => {
    let digits = inputValue.replace(/\D/g, "");
    digits = digits.slice(0, 8);

    let formatted = "";
    if (digits.length > 0) {
      formatted = digits.slice(0, 2);
      if (digits.length > 2) formatted += "/" + digits.slice(2, 4);
      if (digits.length > 4) formatted += "/" + digits.slice(4, 8);
    }

    if (formatted.length === 10 && validateDate(formatted)) {
      const dateYYYYMMDD = formatDateToYYYYMMDD(formatted);
      if (dateYYYYMMDD < todayString) {
        // Past date — clear display immediately and show error
        setIsPastDate(true);
        setDisplayDate("");
        onChange("");
      } else {
        setIsPastDate(false);
        setDisplayDate(formatted);
        onChange(dateYYYYMMDD);
      }
    } else {
      // Still typing or invalid — show partial input as-is
      setIsPastDate(false);
      setDisplayDate(formatted);
      if (formatted.length === 0) onChange("");
    }
  };

  /**
   * Handles native calendar picker changes.
   * The `min` attribute already grays out past dates in the picker UI,
   * but we guard here as a safety net.
   */
  const handleDatePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    if (selectedDate >= todayString) {
      setIsPastDate(false);
      onChange(selectedDate);
    } else {
      setIsPastDate(true);
      onChange("");
    }
  };

  /**
   * Opens the native calendar picker
   */
  const handleOpenCalendar = () => {
    const dateInput = document.getElementById("date-input") as HTMLInputElement;
    dateInput?.showPicker?.();
    dateInput?.click();
  };

  return (
    <div>
      <label className="block headline-5 text-gray-800 font-medium mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {/* Hidden date input — `min` grays out past dates in the native picker */}
        <input
          type="date"
          id="date-input"
          value={value}
          min={todayString}
          onChange={handleDatePickerChange}
          className="absolute opacity-0 pointer-events-none w-0 h-0"
        />
        {/* Visible text input with DD/MM/YYYY format */}
        <input
          type="text"
          value={displayDate}
          onChange={(e) => handleDateChange(e.target.value)}
          placeholder={placeholder}
          maxLength={10}
          className={`w-full px-4 py-3 pr-12 border rounded-lg headline-5 text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 transition-colors ${
            isPastDate
              ? "border-red-400 focus:ring-red-300 focus:border-red-400"
              : "border-gray-300 focus:ring-blue-500 focus:border-blue-600"
          }`}
        />
        {/* Calendar icon button */}
        <button
          type="button"
          onClick={handleOpenCalendar}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-gray-600 z-10 cursor-pointer"
        >
          <Calendar className="w-5 h-5" />
        </button>
      </div>
      {isPastDate && (
        <p className="mt-1 text-sm text-red-500">
          ไม่สามารถเลือกวันที่ผ่านมาแล้วได้ กรุณาเลือกวันปัจจุบันหรือวันในอนาคต
        </p>
      )}
    </div>
  );
};

export default DateInput;
