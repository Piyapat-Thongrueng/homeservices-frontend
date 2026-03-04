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
  onRemove: () => void;
}

const PromotionCodeInput: React.FC<PromotionCodeInputProps> = ({
  value,
  discount,
  error,
  onValueChange,
  onApply,
  onRemove,
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
          disabled={isApplied} // ล็อกช่องพิมพ์ถ้าใช้โค้ดสำเร็จแล้ว
          className={`flex-1 px-4 py-3 border rounded-lg headline-5 focus:outline-none ${
            error
              ? "border-red-500 focus:border-red-500"
              : isApplied
              ? "border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed" // สไตล์ตอนโดนล็อก (สีเทาจาง)
              : "border-gray-300 focus:border-blue-600"
          }`}
          placeholder="กรุณากรอกโค้ดส่วนลด (ถ้ามี)"
          onKeyPress={!isApplied ? handleKeyPress : undefined}
        />
        {/* สลับปุ่มตามสถานะ isApplied */}
        {isApplied ? (
          <button
            type="button"
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors whitespace-nowrap font-medium"
            onClick={onRemove}
          >
            เปลี่ยนโค้ด
          </button>
        ) : (
          <button
            type="button"
            className="btn-primary px-6 py-3 rounded-lg cursor-pointer whitespace-nowrap"
            onClick={handleApply}
          >
            ใช้โค้ด
          </button>
        )}
      </div>
      
      {/* ข้อความแจ้งเตือน */}
      {error && <p className="mt-2 body-3 text-red-500">{error}</p>}
      {isApplied && (
        <p className="mt-2 body-3 text-green-600">
          ใช้โค้ดส่วนลดสำเร็จ!
        </p>
      )}
    </div>
  );
};

export default PromotionCodeInput;
