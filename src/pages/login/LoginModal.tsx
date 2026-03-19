import { useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

interface LoginModalProps {
  type: "success" | "error";
  errorMessage?: string;
  onClose: () => void;
}

export default function LoginModal({
  type,
  errorMessage,
  onClose,
}: LoginModalProps) {
  const router = useRouter();
  const { t } = useTranslation("common");

  // auto redirect หลัง 3 วินาที กรณี success
  useEffect(() => {
    if (type === "success") {
      const timer = setTimeout(() => {
        router.push("/");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [type]);

  const handleGoToHome = (): void => {
    router.push("/");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-90 sm:max-w-105 bg-white rounded-[12px] px-6 py-8 sm:px-8 sm:py-10 flex flex-col items-center text-center shadow-xl">
        {type === "success" ? (
          <>
            {/* Success Icon */}
            <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-full bg-green-100 flex items-center justify-center mb-5">
              <svg
                className="w-10 h-10 sm:w-12 sm:h-12 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h2 className="text-[18px] sm:text-[22px] font-semibold text-[#101828] mb-2">
              {t("auth.modal_success_title", "เข้าสู่ระบบสำเร็จ!")}
            </h2>
            <p className="text-[13px] sm:text-[14px] text-[#667085] mb-2">
              {t("auth.modal_success_desc1", "กำลังนำท่านไปสู่หน้าเว็บไซต์")}
            </p>
            <p className="text-[12px] text-[#98A2B3] mb-6">
              {t("auth.modal_success_desc2", "หรือระบบจะนำท่านไปอัตโนมัติใน 3 วินาที")}
            </p>

            <button
              onClick={handleGoToHome}
              className="btn-primary w-full h-11 text-[14px]"
            >
              {t("auth.btn_go_to_home", "ไปยังหน้าเว็บไซต์")}
            </button>
          </>
        ) : (
          <>
            {/* Error Icon */}
            <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-full bg-red-100 flex items-center justify-center mb-5">
              <svg
                className="w-10 h-10 sm:w-12 sm:h-12 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>

            <h2 className="text-[18px] sm:text-[22px] font-semibold text-[#101828] mb-2">
              {t("auth.modal_error_title", "เกิดข้อผิดพลาด")}
            </h2>
            <p className="text-[13px] sm:text-[14px] text-[#667085] mb-2">
              {t("auth.modal_error_desc", "เกิดข้อผิดพลาดในการเข้าสู่ระบบ")}
            </p>
            <p className="text-[13px] sm:text-[14px] text-[#667085] mb-6">
              {t("auth.modal_error_retry", "กรุณาลองใหม่อีกครั้ง")}
            </p>

            {errorMessage && (
              <p className="text-[12px] text-red-500 mb-4 bg-red-50 w-full rounded-sm px-3 py-2">
                {errorMessage}
              </p>
            )}

            <button
              onClick={onClose}
              className="btn-primary w-full h-11 text-[14px]"
            >
              {t("auth.btn_back_to_login", "กลับไปเข้าสู่ระบบ")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
