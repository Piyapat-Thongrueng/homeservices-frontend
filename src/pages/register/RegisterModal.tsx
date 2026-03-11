import type { NextPage } from "next";
import { useRouter } from "next/router";

interface RegisterModalProps {
  type: "success" | "error";
  errorMessage?: string;
  onClose: () => void;
}

export default function RegisterModal({
  type,
  errorMessage,
  onClose,
}: RegisterModalProps) {
  const router = useRouter();

  const handleGoToLogin = () => {
    router.push("/login");
  };

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      {/* Modal Box */}
      <div className="w-full max-w-90 sm:max-w-105 bg-white rounded-[12px] px-6 py-8 sm:px-8 sm:py-10 flex flex-col items-center text-center shadow-xl">
        {type === "success" ? (
          <>
            {/* Success Icon */}
            <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-full bg-green-100 flex items-center justify-center mb-5">
              <svg
                className="w-10 h-10 sm:w-12.5 sm:h-12.5 text-green-500"
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
              ลงทะเบียนสำเร็จ!
            </h2>
            <p className="text-[13px] sm:text-[14px] text-[#667085] mb-6">
              บัญชีของคุณถูกสร้างเรียบร้อยแล้ว
            </p>

            <button
              onClick={handleGoToLogin}
              className="btn-primary w-full h-11 text-[14px]"
            >
              ไปยังหน้าเข้าสู่ระบบ
            </button>
          </>
        ) : (
          <>
            {/* Error Icon */}
            <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-full bg-red-100 flex items-center justify-center mb-5">
              <svg
                className="w-10 h-10 sm:w-12.5 sm:h-12.5 text-red-500"
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
              เกิดข้อผิดพลาด
            </h2>
            <p className="text-[13px] sm:text-[14px] text-[#667085] mb-2">
              เกิดข้อผิดพลาดในการลงทะเบียน
            </p>
            <p className="text-[13px] sm:text-[14px] text-[#667085] mb-6">
              กรุณาลองใหม่อีกครั้ง
            </p>

            {/* แสดง error message จาก API */}
            {errorMessage && (
              <p className="text-[12px] text-red-500 mb-4 bg-red-50 w-full rounded-sm px-3 py-2">
                {errorMessage}
              </p>
            )}

            <button
              onClick={onClose}
              className="btn-primary w-full h-11 text-[14px]"
            >
              กลับไปลงทะเบียน
            </button>
          </>
        )}
      </div>
    </div>
  );
}
