import { Navigate } from "react-router-dom";
import LoadingScreen from "../common/LoadingScreen";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  isLoading: boolean | null;
  isAuthenticated: boolean;
  userRole: string | null;
  requiredRole: string;
  children: React.ReactNode;
}

function ProtectedRoute({
  isLoading,
  isAuthenticated,
  userRole,
  requiredRole,
  children,
}: ProtectedRouteProps): ReactNode {


  if (isLoading === null || isLoading) {
    // แสดงหน้าจอโหลดขณะรอการตรวจสอบสถานะการเข้าสู่ระบบและบทบาทของผู้ใช้
    return (
      <div className="flex flex-col min-h-screen">
        <div className="min-h-screen md:p-8">
          <LoadingScreen />
        </div>
      </div>
    );
  }

  if (!isAuthenticated || userRole !== requiredRole) {
    // หากผู้ใช้ไม่ได้เข้าสู่ระบบหรือบทบาทของผู้ใช้ไม่ตรงกับบทบาทที่ต้องการ ให้เปลี่ยนเส้นทางไปยังหน้าเข้าสู่ระบบ
    return <Navigate to="/login" replace />;
  }

  // ผู้ใช้ได้เข้าสู่ระบบและมีบทบาทที่ถูกต้อง
  return <>{children}</>;
}

export default ProtectedRoute;
