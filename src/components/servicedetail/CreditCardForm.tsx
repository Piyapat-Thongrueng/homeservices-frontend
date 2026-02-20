/**
 * CreditCardForm Component
 * 
 * A form component for entering credit card information with automatic formatting.
 * 
 * Features:
 * - Card number formatting (XXXX XXXX XXXX XXXX)
 * - Expiry date formatting (MM/YY)
 * - CVV input (3 digits only)
 * - Card name input
 */

interface CreditCardFormProps {
  /** Card number value */
  cardNumber: string;
  /** Card name value */
  cardName: string;
  /** Expiry date value (MM/YY format) */
  expiryDate: string;
  /** CVV value */
  cvv: string;
  /** Callback when card number changes */
  onCardNumberChange: (value: string) => void;
  /** Callback when card name changes */
  onCardNameChange: (value: string) => void;
  /** Callback when expiry date changes */
  onExpiryDateChange: (value: string) => void;
  /** Callback when CVV changes */
  onCvvChange: (value: string) => void;
}

const CreditCardForm: React.FC<CreditCardFormProps> = ({
  cardNumber,
  cardName,
  expiryDate,
  cvv,
  onCardNumberChange,
  onCardNameChange,
  onExpiryDateChange,
  onCvvChange,
}) => {
  /**
   * Formats card number as XXXX XXXX XXXX XXXX
   */
  const formatCardNumber = (value: string): string => {
    // Remove all non-numeric characters
    const numbers = value.replace(/\D/g, "");
    // Limit to 16 digits
    const limited = numbers.slice(0, 16);
    // Add spaces every 4 digits
    const formatted = limited.match(/.{1,4}/g);
    if (formatted) {
      return formatted.join(" ");
    }
    return limited;
  };

  /**
   * Formats expiry date as MM/YY
   */
  const formatExpiryDate = (value: string): string => {
    // Remove all non-numeric characters
    const numbers = value.replace(/\D/g, "");
    // Limit to 4 digits
    if (numbers.length > 4) return numbers.slice(0, 4);
    // Add slash after 2 digits
    if (numbers.length >= 2) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    }
    return numbers;
  };

  /**
   * Handles card number input change
   */
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    onCardNumberChange(formatted);
  };

  /**
   * Handles expiry date input change
   */
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    onExpiryDateChange(formatted);
  };

  /**
   * Handles CVV input change - only allows numbers, max 3 digits
   */
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numbers = e.target.value.replace(/\D/g, "");
    if (numbers.length <= 3) {
      onCvvChange(numbers);
    }
  };

  return (
    <div className="space-y-5">
      {/* Card Number Field */}
      <div>
        <label className="block headline-5 text-gray-900 mb-2">
          หมายเลขบัตรเครดิต<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={cardNumber}
          onChange={handleCardNumberChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg headline-5 focus:outline-none focus:border-blue-600"
          placeholder="กรุณากรอกหมายเลขบัตรเครดิต"
          inputMode="numeric"
          maxLength={19}
        />
      </div>

      {/* Card Name Field */}
      <div>
        <label className="block headline-5 text-gray-900 mb-2">
          ชื่อบนบัตร<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={cardName}
          onChange={(e) => onCardNameChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg headline-5 focus:outline-none focus:border-blue-600"
          placeholder="กรุณากรอกชื่อบนบัตร"
        />
      </div>

      {/* Expiry Date and CVV Fields - Side by Side */}
      <div className="grid grid-cols-2 gap-4">
        {/* Expiry Date Field */}
        <div>
          <label className="block headline-5 text-gray-900 mb-2">
            วันหมดอายุ<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={expiryDate}
            onChange={handleExpiryDateChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg headline-5 focus:outline-none focus:border-blue-600"
            placeholder="MM/YY"
            maxLength={5}
            inputMode="numeric"
          />
        </div>

        {/* CVV Field */}
        <div>
          <label className="block headline-5 text-gray-900 mb-2">
            รหัส CVC / CVV<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={cvv}
            onChange={handleCvvChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg headline-5 focus:outline-none focus:border-blue-600"
            placeholder="xxx"
            maxLength={3}
            inputMode="numeric"
          />
        </div>
      </div>
    </div>
  );
};

export default CreditCardForm;
