import { useEffect } from "react";
import { useRouter } from "next/router";
import LoadingScreen from "@/components/common/LoadingScreen";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  isLoading: boolean | null;
  isAuthenticated: boolean;
  userRole: string | null;
  requiredRole: string;
  children: ReactNode;
}

function ProtectedRoute({
  isLoading,
  isAuthenticated,
  userRole,
  requiredRole,
  children,
}: ProtectedRouteProps): ReactNode {
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || userRole !== requiredRole)) {
      router.replace("/auth/login");
    }
  }, [isLoading, isAuthenticated, userRole]);

  // กำลังโหลดอยู่
  if (isLoading === null || isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="min-h-screen md:p-8">
          <LoadingScreen />
        </div>
      </div>
    );
  }

  // ไม่ผ่านเงื่อนไข → return null เพราะ useEffect จะ redirect ให้
  if (!isAuthenticated || userRole !== requiredRole) {
    return null;
  }

  // ผ่านทุกเงื่อนไข
  return <>{children}</>;
}

export default ProtectedRoute;
