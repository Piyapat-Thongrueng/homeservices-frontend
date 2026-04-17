import axios, { AxiosError } from "axios";
import React, { useContext, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";

interface User {
  id: number;
  auth_user_id: string;
  email: string;
  full_name: string;
  username: string;
  profile_pic: string;
  phone: string;
  role: "user";
}

interface AuthState {
  loading: boolean | null;
  getUserLoading: boolean | null;
  error: string | null;
  user: User | null;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  full_name: string;
  phone: string;
  email: string;
  password: string;
}

interface AuthContextValue {
  state: AuthState;
  login: (data: LoginData) => Promise<{ error?: string; role?: string } | void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<{ error?: string } | void>;
  isAuthenticated: boolean;
  fetchUser: () => Promise<string | undefined>;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface ErrorResponse {
  error: string;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(
  undefined,
);

function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    loading: null,
    getUserLoading: null,
    error: null,
    user: null,
  });

  const router = useRouter();

  const clearLegacyToken = (): void => {
    localStorage.removeItem("token");
  };

  const getAccessToken = async (): Promise<string | null> => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (!error && data.session?.access_token) {
        return data.session.access_token;
      }
    } catch (err) {
      console.error("getSession error:", err);
    }

    return null;
  };

  const fetchUser = async (): Promise<string | undefined> => {
    const token = await getAccessToken();

    // ไม่มี token → ไม่ต้องเรียก API ให้ reset state แล้วออกเลย
    if (!token) {
      setState((prevState) => ({
        ...prevState,
        user: null,
        getUserLoading: false,
      }));
      return;
    }

    try {
      setState((prevState) => ({ ...prevState, getUserLoading: true }));

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/auth/get-user`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // token นี้เป็นของ role อื่น (เช่น technician) → ใช้งานบน frontend นี้ไม่ได้
      // ล้าง session และ token เก่า เพื่อกัน role ปะปน
      if (response.data.role !== "user") {
        await supabase.auth.signOut();
        clearLegacyToken();
        setState((prevState) => ({
          ...prevState,
          user: null,
          getUserLoading: false,
        }));
        return;
      }

      setState((prevState) => ({
        ...prevState,
        user: response.data,
        getUserLoading: false,
      }));
      return response.data.role;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      // ล้าง token ทุกกรณีที่ API ล้มเหลว ไม่ใช่เฉพาะ 401
      // เพราะ token ที่ใช้ไม่ได้ไม่ควรค้างอยู่ใน localStorage
      // (เช่น token หมดอายุแต่ server ตอบ 403, network error ฯลฯ)
      await supabase.auth.signOut();
      clearLegacyToken();

      setState((prevState) => ({
        ...prevState,
        error:
          axiosError.response?.data?.error ||
          axiosError.message ||
          "Failed to fetch user",
        user: null,
        getUserLoading: false,
      }));
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (
    data: LoginData,
  ): Promise<{ error?: string; role?: string } | void> => {
    try {
      setState((prevState) => ({ ...prevState, loading: true, error: null }));

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/auth/login`,
        {
          ...data,
          expectedRole: "user",
        },
      );

      const { error: supabaseLoginError } = await supabase.auth.signInWithPassword(
        {
          email: data.email,
          password: data.password,
        },
      );
      if (supabaseLoginError) {
        return { error: supabaseLoginError.message };
      }

      const role = await fetchUser();

      // fetchUser() คืน undefined เมื่อ role ไม่ใช่ "user" หรือเกิด error
      // ในกรณีนี้ token ถูกล้างไปแล้วใน fetchUser() แล้ว
      // ต้องคืน error กลับไปให้ UI รับทราบ ไม่ใช่ปล่อยให้ login ผ่าน
      if (!role) {
        return { error: "ไม่มีสิทธิ์เข้าถึง หรือบัญชีนี้ไม่ใช่ผู้ใช้ทั่วไป" };
      }

      return { role };
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage =
        axiosError.response?.status === 403
          ? "บัญชีผู้ใช้ของคุณไม่ได้รับสิทธิ์เข้าใช้งานระบบนี้"
          : axiosError.response?.data?.error || "Login failed";

      setState((prevState) => ({
        ...prevState,
        error: errorMessage,
      }));

      return { error: errorMessage };
    } finally {
      // finally ทำงานเสมอไม่ว่าจะ success หรือ error → ปิด loading state
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      // Google OAuth redirect ไม่ได้ใช้ return value มากนัก
      // แต่ถ้า supabase ส่ง error กลับมา (เช่น config ผิด) ให้บันทึก state ด้วย
      if (error) {
        console.error("Google login error:", error);
        setState((prevState) => ({ ...prevState, error: error.message }));
      }
    } catch (err) {
      console.error("Unexpected Google login error:", err);
    }
  };

  const register = async (
    data: RegisterData,
  ): Promise<{ error?: string } | void> => {
    try {
      setState((prevState) => ({ ...prevState, loading: true, error: null }));
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/auth/register`,
        data,
      );
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.error || "Registration failed";

      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: errorMessage,
      }));
      return { error: errorMessage };
    } finally {
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      // แม้ supabase signOut จะ fail (เช่น network หลุด) ก็ยังต้อง logout ต่อ
      // ไม่ควรให้ error นี้หยุดการล้าง token และ redirect
      console.error("supabase signOut error:", err);
    } finally {
      // finally การันตีว่า token ถูกล้าง + state reset + redirect ทุกกรณี
      clearLegacyToken();
      setState({
        user: null,
        error: null,
        loading: false,
        getUserLoading: false,
      });
      router.push("/");
    }
  };

  const isAuthenticated = Boolean(state.user);
  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        loginWithGoogle,
        logout,
        register,
        isAuthenticated,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export { AuthProvider, useAuth };
export type { User, AuthState, LoginData, RegisterData };
