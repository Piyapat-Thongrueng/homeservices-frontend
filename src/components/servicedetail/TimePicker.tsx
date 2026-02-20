/**
 * TimePicker Component
 * 
 * A custom time picker component that allows users to select hours and minutes
 * from scrollable lists. Displays time in HH:MM format.
 * 
 * Features:
 * - Scrollable hour (00-23) and minute (00-59) selectors
 * - Visual feedback for selected values
 * - Click outside to close
 * - Confirmation button
 */

import { useState, useEffect, useRef } from "react";
import { Clock } from "lucide-react";

interface TimePickerProps {
  /** Current time value in HH:MM format */
  value: string;
  /** Callback when time changes (receives HH:MM format) */
  onChange: (time: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Label text */
  label: string;
  /** Whether the field is required */
  required?: boolean;
}

const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  placeholder = "เลือกเวลา",
  label,
  required = false,
}) => {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempTime, setTempTime] = useState({ hour: "00", minute: "00" });
  const timePickerRef = useRef<HTMLDivElement>(null);

  /**
   * Opens the time picker and initializes with current time if available
   */
  const handleOpenTimePicker = () => {
    if (value) {
      const [hour, minute] = value.split(":");
      setTempTime({ hour: hour || "00", minute: minute || "00" });
    } else {
      setTempTime({ hour: "00", minute: "00" });
    }
    setShowTimePicker(true);
  };

  /**
   * Confirms the selected time and closes the picker
   */
  const handleConfirmTime = () => {
    const timeValue = `${tempTime.hour.padStart(2, "0")}:${tempTime.minute.padStart(2, "0")}`;
    onChange(timeValue);
    setShowTimePicker(false);
  };

  /**
   * Closes time picker when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (timePickerRef.current && !timePickerRef.current.contains(event.target as Node)) {
        setShowTimePicker(false);
      }
    };

    if (showTimePicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTimePicker]);

  /**
   * Formats time for display (HH:MM)
   */
  const displayTime = value
    ? `${value.split(":")[0] || "00"}:${value.split(":")[1] || "00"}`
    : "";

  return (
    <div>
      <label className="block headline-5 text-gray-800 font-medium mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {/* Read-only input that opens picker on click */}
        <input
          type="text"
          readOnly
          value={displayTime}
          placeholder={placeholder}
          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg headline-5 text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 transition-colors cursor-pointer"
          onClick={handleOpenTimePicker}
        />
        {/* Clock icon button */}
        <button
          type="button"
          onClick={handleOpenTimePicker}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer z-10"
        >
          <Clock className="w-5 h-5" />
        </button>

        {/* Custom Time Picker Modal */}
        {showTimePicker && (
          <div
            ref={timePickerRef}
            className="absolute top-full left-0 mt-2 bg-white border-2 border-blue-600 rounded-lg shadow-lg z-50 w-full max-w-[280px]"
          >
            <div className="flex">
              {/* Hours Column - 00 to 23 */}
              <div className="flex-1 border-r border-gray-200 max-h-[240px] overflow-y-auto">
                <div className="py-2">
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i.toString().padStart(2, "0");
                    const isSelected = tempTime.hour === hour;
                    return (
                      <div
                        key={hour}
                        onClick={() => setTempTime({ ...tempTime, hour })}
                        className={`px-4 py-2 text-center headline-5 cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-blue-600 text-white"
                            : "text-gray-900 hover:bg-gray-100"
                        }`}
                      >
                        {hour}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Minutes Column - 00 to 59 */}
              <div className="flex-1 max-h-[240px] overflow-y-auto">
                <div className="py-2">
                  {Array.from({ length: 60 }, (_, i) => {
                    const minute = i.toString().padStart(2, "0");
                    const isSelected = tempTime.minute === minute;
                    return (
                      <div
                        key={minute}
                        onClick={() => setTempTime({ ...tempTime, minute })}
                        className={`px-4 py-2 text-center headline-5 cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-gray-200 text-gray-900 rounded"
                            : "text-gray-900 hover:bg-gray-100"
                        }`}
                      >
                        {minute}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer with preview and confirm button */}
            <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between bg-gray-50">
              <span className="headline-5 text-gray-900">
                {`${tempTime.hour.padStart(2, "0")}:${tempTime.minute.padStart(2, "0")}`}
              </span>
              <button
                type="button"
                onClick={handleConfirmTime}
                className="btn-primary px-4 py-2 headline-5 cursor-pointer"
              >
                ยืนยัน
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimePicker;
