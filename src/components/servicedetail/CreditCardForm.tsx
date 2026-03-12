import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";

/**
 * CreditCardForm Component
 *
 * Three separate Stripe card inputs (number, expiry, CVC) with project styles.
 * Must be rendered inside <Elements> from @stripe/react-stripe-js.
 */

const elementOptions = {
  style: {
    base: {
      fontFamily: "Prompt, system-ui, -apple-system, BlinkMacSystemFont",
      fontSize: "16px",
      color: "#111827",
      "::placeholder": {
        color: "#9CA3AF",
      },
    },
    invalid: {
      color: "#DC2626",
    },
  },
};

const inputWrapperClass =
  "w-full px-4 py-3 border border-gray-300 rounded-lg headline-5 focus-within:border-blue-600 bg-white";

const CreditCardForm: React.FC = () => {
  return (
    <div className="space-y-5">
      {/* Card Number */}
      <div>
        <label className="block headline-5 text-gray-900 mb-2">
          หมายเลขบัตรเครดิต<span className="text-red-500">*</span>
        </label>
        <div className={inputWrapperClass}>
          <CardNumberElement options={elementOptions} />
        </div>
      </div>

      {/* Expiry and CVV side by side */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block headline-5 text-gray-900 mb-2">
            วันหมดอายุ<span className="text-red-500">*</span>
          </label>
          <div className={inputWrapperClass}>
            <CardExpiryElement options={elementOptions} />
          </div>
        </div>
        <div>
          <label className="block headline-5 text-gray-900 mb-2">
            รหัส CVC / CVV<span className="text-red-500">*</span>
          </label>
          <div className={inputWrapperClass}>
            <CardCvcElement options={elementOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditCardForm;
