/**
 * DateInput Component
 * 
 * A reusable date input component that displays dates in DD/MM/YYYY format
 * while storing them internally in YYYY-MM-DD format for compatibility.
 * 
 * Features:
 * - Text input with DD/MM/YYYY format display
 * - Native calendar picker integration
 * - Auto-formatting as user types
 * - Date validation
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

  // Sync displayDate when value prop changes (e.g., from calendar picker)
  useEffect(() => {
    if (value && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const formatted = formatDateToDDMMYYYY(value);
      setDisplayDate(formatted);
    } else if (!value) {
      setDisplayDate("");
    }
  }, [value]);

  /**
   * Handles text input changes
   * Formats input as DD/MM/YYYY and validates before storing
   */
  const handleDateChange = (inputValue: string) => {
    // Remove all non-numeric characters
    let digits = inputValue.replace(/\D/g, "");
    
    // Limit to 8 digits (DDMMYYYY)
    digits = digits.slice(0, 8);
    
    // Format as DD/MM/YYYY for display
    let formatted = "";
    if (digits.length > 0) {
      formatted = digits.slice(0, 2);
      if (digits.length > 2) {
        formatted += "/" + digits.slice(2, 4);
      }
      if (digits.length > 4) {
        formatted += "/" + digits.slice(4, 8);
      }
    }
    
    // Update display
    setDisplayDate(formatted);
    
    // Convert to YYYY-MM-DD for storage only if complete and valid
    if (formatted.length === 10 && validateDate(formatted)) {
      onChange(formatDateToYYYYMMDD(formatted));
    } else if (formatted.length === 0) {
      // Clear date if empty
      onChange("");
    }
  };

  /**
   * Handles native calendar picker changes
   */
  const handleDatePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
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
        {/* Hidden date input for native picker */}
        <input
          type="date"
          id="date-input"
          value={value}
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
          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg headline-5 text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 transition-colors"
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
    </div>
  );
};

export default DateInput;
