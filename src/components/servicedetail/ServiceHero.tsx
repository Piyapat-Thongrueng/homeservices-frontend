/**
 * ServiceHero Component
 * 
 * Hero section for service detail pages with breadcrumb navigation
 * and step progress indicator.
 * 
 * Features:
 * - Background banner image
 * - Breadcrumb navigation
 * - Multi-step progress indicator
 * - Visual status for each step (completed, active, inactive)
 * - Responsive design
 */

import React from "react";
import { List, FileEdit, CreditCard } from "lucide-react";
import { useTranslation } from "next-i18next";

interface ServiceHeroProps {
  serviceName: string;
  currentStep?: 1 | 2 | 3;
  imageUrl?: string;
}

const ServiceHero: React.FC<ServiceHeroProps> = ({
  serviceName,
  currentStep = 1,
  imageUrl,
}) => {
  const { t } = useTranslation("common");

  const steps = [
    { icon: List, label: t("service_detail.step_items"), step: 1 },
    { icon: FileEdit, label: t("service_detail.step_info"), step: 2 },
    { icon: CreditCard, label: t("service_detail.step_payment"), step: 3 },
  ];

  const getStepStatus = (step: number) => {
    if (currentStep > step) {
      return "completed";
    } else if (currentStep === step) {
      return "active";
    } else {
      return "inactive";
    }
  };

  return (
    <section className="relative w-full bg-utility-bg">
      <div className="relative w-full min-h-[240px] md:h-[280px] overflow-hidden">
        <img
          src={imageUrl}
          alt={serviceName}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 md:px-8 -mt-10 md:-mt-46 pb-8 md:pb-12">
        <div className="inline-flex items-center gap-3 bg-utility-white shadow px-4 md:px-8 py-2.5 mb-14 rounded-lg w-full md:w-auto">
          <button
            type="button"
            className="headline-5 text-gray-700 hover:text-blue-600 transition-colors duration-300 ease-out cursor-pointer whitespace-nowrap"
          >
            {t("service_detail.breadcrumb")}
          </button>
          <span className="text-gray-400">{">"}</span>
          <span className="headline-1 text-blue-600 whitespace-nowrap">{serviceName}</span>
        </div>

        <div className="card-box bg-utility-white border border-gray-200 rounded-[10px] min-h-[100px] md:min-h-[129px] flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 px-6 md:px-10 py-4 md:py-5 relative">
          {steps.map((stepItem, index) => {
            const status = getStepStatus(stepItem.step);
            const Icon = stepItem.icon;
            const isLast = index === steps.length - 1;

            return (
              <React.Fragment key={stepItem.step}>
                <div className="flex flex-col items-center gap-2 relative z-10 flex-1">
                  <div
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center relative z-10 ${
                      status === "completed"
                        ? "bg-blue-600 border-blue-600"
                        : status === "active"
                        ? "bg-white border-blue-600"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        status === "completed"
                          ? "text-white"
                          : status === "active"
                          ? "text-blue-600"
                          : "text-gray-400"
                      }`}
                    />
                  </div>
                  <span
                    className={`headline-5 font-medium text-center ${
                      status === "completed" || status === "active"
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                  >
                    {stepItem.label}
                  </span>
                </div>

                {!isLast && (
                  <div className="hidden md:block flex-1 h-0.5 relative -mx-4">
                    <div className="absolute inset-0 bg-gray-300" />
                    {status === "completed" ? (
                      <div className="absolute inset-0 bg-blue-600" />
                    ) : status === "active" ? (
                      <div className="absolute left-0 right-1/2 h-full bg-blue-600" />
                    ) : null}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServiceHero;

