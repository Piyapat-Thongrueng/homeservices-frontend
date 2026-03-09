import LoadingScreen from "@/components/common/LoadingScreen";
import { Navigate } from "react-router-dom";

interface AuthenticationRouteProps {
  isLoading: boolean | null;
  isAuthenticated: boolean;
  children: React.ReactNode;
}

// AuthenticationRoute เป็น component ที่ใช้สำหรับจัดการเส้นทางที่ต้องการการตรวจสอบสิทธิ์ผู้ใช้ 
// โดยจะตรวจสอบสถานะการโหลดและสถานะการตรวจสอบสิทธิ์ของผู้ใช้ก่อนที่จะตัดสินใจว่าจะให้แสดงเนื้อหาหรือเปลี่ยนเส้นทางไปยังหน้าอื่น
const AuthenticationRoute = ({ isLoading, isAuthenticated, children }: AuthenticationRouteProps) => {

  // ถ้ากำลังโหลดข้อมูลผู้ใช้หรือสถานะการโหลดยังไม่ถูกกำหนด (null) จะแสดงหน้าจอโหลด
  if (isLoading === null || isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="min-h-screen md:p-8">
          <LoadingScreen />
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    // หากผู้ใช้เข้าสู่ระบบแล้ว จะเปลี่ยนเส้นทางไปยังหน้าแรก
    return <Navigate to="/" replace />;
  }

  // ผู้ใช้ยังไม่ได้เข้าสู่ระบบ
  // แสดงเนื้อหาที่ต้องการให้ผู้ใช้ที่ยังไม่ได้เข้าสู่ระบบเห็น (เช่น หน้าเข้าสู่ระบบหรือหน้าสมัครสมาชิก)
  return children;
};

export default AuthenticationRoute;
