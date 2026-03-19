/**
 * PaymentMethodSelector Component
 * 
 * A component for selecting payment method (PromptPay or Credit Card)
 * with visual feedback for the selected method.
 * 
 * Features:
 * - Two payment method options: PromptPay and Credit Card
 * - Visual indication of selected method
 * - Icon support for each method
 */

import { CreditCard, QrCode } from "lucide-react";
import { useTranslation } from "next-i18next";

interface PaymentMethodSelectorProps {
  /** Currently selected payment method */
  method: "promptpay" | "creditcard";
  /** Callback when payment method changes */
  onChange: (method: "promptpay" | "creditcard") => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  method,
  onChange,
}) => {
  const { t } = useTranslation("common");

  return (
    <div className="flex gap-4">
      {/* PromptPay Option */}
      <button
        type="button"
        onClick={() => onChange("promptpay")}
        className={`flex-1 flex flex-col items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
          method === "promptpay"
            ? "border-blue-600 bg-blue-600 text-white"
            : "border-gray-300 bg-white hover:border-gray-400"
        }`}
      >
        <QrCode className="w-5 h-5" />
        <span className="headline-5">{t("payment.method_promptpay")}</span>
      </button>

      {/* Credit Card Option */}
      <button
        type="button"
        onClick={() => onChange("creditcard")}
        className={`flex-1 flex flex-col items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
          method === "creditcard"
            ? "border-blue-600 bg-blue-600 text-white"
            : "border-gray-300 bg-white hover:border-gray-400"
        }`}
      >
        <CreditCard className="w-5 h-5" />
        <span className="headline-5">{t("payment.method_creditcard")}</span>
      </button>
    </div>
  );
};

export default PaymentMethodSelector;
