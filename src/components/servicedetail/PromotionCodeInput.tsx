/**
 * PromotionCodeInput Component
 * 
 * A component for entering and applying promotion codes with validation.
 * 
 * Features:
 * - Promotion code input field
 * - Apply button
 * - Error message display
 * - Success message display
 * - Enter key support
 */

interface PromotionCodeInputProps {
  /** Current promotion code value */
  value: string;
  /** Current discount amount */
  discount: number;
  /** Error message to display */
  error: string;
  /** Callback when promotion code value changes */
  onValueChange: (value: string) => void;
  /** Callback when apply button is clicked (receives the code to validate) */
  onApply: (code: string) => void;
  /** Optional callback when user wants to reset / change code after applied */
  onReset?: () => void;
}

const PromotionCodeInput: React.FC<PromotionCodeInputProps> = ({
  value,
  discount,
  error,
  onValueChange,
  onApply,
  onReset,
}) => {
  const hasDiscount = discount > 0 && !error;

  /**
   * Handles apply button click
   */
  const handleApply = () => {
    if (hasDiscount && onReset) {
      onReset();
      return;
    }
    onApply(value);
  };

  /**
   * Handles Enter key press in input field
   */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleApply();
    }
  };

  // เช็คสถานะว่า "ใช้งานโค้ดสำเร็จแล้วหรือยัง?" (ดูจากส่วนลดที่ > 0 และต้องไม่มี Error)
  const isApplied = discount > 0 && !error;

  return (
    <div>
      <label className="block headline-5 text-gray-900 mb-2">
        Promotion Code
      </label>
      <div className="flex gap-2">
        {/* Promotion Code Input */}
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onValueChange(e.target.value)}
          className={`flex-1 px-4 py-3 border rounded-lg headline-5 focus:outline-none transition-colors ${
            error
              ? "border-red-500 focus:border-red-500 bg-white"
              : hasDiscount
              ? "border-gray-300 bg-gray-100 text-gray-800 disabled:opacity-100"
              : "border-gray-300 focus:border-blue-600 bg-white"
          }`}
          placeholder="กรุณากรอกโค้ดส่วนลด (ถ้ามี)"
          onKeyPress={handleKeyPress}
          disabled={hasDiscount}
        />
        {/* Apply Button */}
        <button
          type="button"
          className={`px-6 cursor-pointer rounded-lg font-medium transition-colors ${
            hasDiscount
              ? "bg-yellow-500 text-white hover:bg-yellow-400"
              : "btn-primary"
          }`}
          onClick={handleApply}
        >
          {hasDiscount ? "เปลี่ยนโค้ด" : "ใช้โค้ด"}
        </button>
      </div>
      
      {/* ข้อความแจ้งเตือน */}
      {error && <p className="mt-2 body-3 text-red-500">{error}</p>}
      {/* Success Message */}
      {hasDiscount && (
        <p className="mt-2 body-3 text-green-600">
          ใช้โค้ดส่วนลดสำเร็จ!
        </p>
      )}
    </div>
  );
};

export default PromotionCodeInput;
