import { useEffect } from "react";
import { useRouter } from "next/router";
import LoadingScreen from "@/components/common/LoadingScreen";

interface AuthenticationRouteProps {
  isLoading: boolean | null;
  isAuthenticated: boolean;
  children: React.ReactNode;
}

const AuthenticationRoute = ({
  isLoading,
  isAuthenticated,
  children,
}: AuthenticationRouteProps) => {
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated]);

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

  // login แล้ว → return null เพราะ useEffect จะ redirect ให้
  if (isAuthenticated) {
    return null;
  }

  // ยังไม่ได้ login → แสดงหน้า login/register ได้เลย
  return <>{children}</>;
};

export default AuthenticationRoute;
