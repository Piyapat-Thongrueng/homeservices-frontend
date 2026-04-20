/**
 * ServiceFooterNav Component
 * 
 * A fixed footer navigation component for service detail pages.
 * Provides back and next/continue buttons with conditional enabling.
 * 
 * Features:
 * - Fixed position at bottom of screen
 * - Back button (optional)
 * - Next/Continue button with custom text
 * - Disabled state when cannot proceed
 * - Responsive layout
 */

import { useTranslation } from "next-i18next";

interface ServiceFooterNavProps {
  canProceed: boolean;
  onBack?: () => void;
  onNext?: () => void;
  nextText?: string;
}

const ServiceFooterNav: React.FC<ServiceFooterNavProps> = ({
  canProceed,
  onBack,
  onNext,
  nextText,
}) => {
  const { t } = useTranslation("common");
  const displayNextText = nextText || t("service_detail.nav_continue");

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-utility-white border-t border-gray-200 z-1200 py-3 md:h-[92px] md:py-0">
      <div className="relative w-full max-w-[1440px] mx-auto px-4 md:px-[160px] md:h-full">
        <div className="flex items-center justify-between gap-3 md:h-full">
          <button
            type="button"
            onClick={onBack}
            className="btn-secondary w-1/2 md:w-auto h-[44px] px-4 md:px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 md:absolute md:top-[24px] md:left-0 cursor-pointer"
          >
            <span>{"<"}</span>
            <span>{t("service_detail.nav_back")}</span>
          </button>

          <button
            type="button"
            disabled={!canProceed}
            onClick={onNext}
            className="btn-primary w-1/2 md:w-auto h-[44px] px-4 md:px-6 py-2.5 rounded-lg flex items-center justify-center gap-2.5 md:absolute md:top-[24px] md:right-0 cursor-pointer"
          >
            <span>{displayNextText}</span>
            <span>{">"}</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default ServiceFooterNav;

