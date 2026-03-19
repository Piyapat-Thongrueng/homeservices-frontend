import { useEffect } from "react";
import { useRouter } from "next/router";
import LoadingScreen from "@/components/common/LoadingScreen";

interface AuthenticationRouteProps {
  isLoading: boolean | null;
  isAuthenticated: boolean;
  children: React.ReactNode;
  bypassRedirect?: boolean; // ← เพิ่มตรงนี้
}

const AuthenticationRoute = ({
  isLoading,
  isAuthenticated,
  children,
  bypassRedirect = false, // ← default false
}: AuthenticationRouteProps) => {
  const router = useRouter();

  useEffect(() => {
    // ถ้า bypassRedirect = true จะไม่ redirect
    if (!isLoading && isAuthenticated && !bypassRedirect) {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, bypassRedirect]);

  if (isLoading === null || isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="min-h-screen md:p-8">
          <LoadingScreen />
        </div>
      </div>
    );
  }

  if (isAuthenticated && !bypassRedirect) {
    return null;
  }

  return <>{children}</>;
};

export default AuthenticationRoute;
