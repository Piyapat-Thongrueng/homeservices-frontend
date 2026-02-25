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
}

const PromotionCodeInput: React.FC<PromotionCodeInputProps> = ({
  value,
  discount,
  error,
  onValueChange,
  onApply,
}) => {
  /**
   * Handles apply button click
   */
  const handleApply = () => {
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
          className={`flex-1 px-4 py-3 border rounded-lg headline-5 focus:outline-none ${
            error
              ? "border-red-500 focus:border-red-500"
              : "border-gray-300 focus:border-blue-600"
          }`}
          placeholder="กรุณากรอกโค้ดส่วนลด (ถ้ามี)"
          onKeyPress={handleKeyPress}
        />
        {/* Apply Button */}
        <button
          type="button"
          className="btn-primary px-6 cursor-pointer"
          onClick={handleApply}
        >
          ใช้โค้ด
        </button>
      </div>
      {/* Error Message */}
      {error && <p className="mt-2 body-3 text-red-500">{error}</p>}
      {/* Success Message */}
      {discount > 0 && !error && (
        <p className="mt-2 body-3 text-green-600">
          ใช้โค้ดส่วนลดสำเร็จ!
        </p>
      )}
    </div>
  );
};

export default PromotionCodeInput;
