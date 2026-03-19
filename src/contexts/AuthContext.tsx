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
  logout: () => void;
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

  const fetchUser = async (): Promise<string | undefined> => {
    const token = localStorage.getItem("token");
    if (!token) {
      setState((prevState) => ({
        ...prevState,
        user: null,
        getUserLoading: false,
      }));
      return;
    }
    try {
      setState((prevState) => ({
        ...prevState,
        getUserLoading: true,
      }));
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/auth/get-user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      // เมื่อได้รับข้อมูลผู้ใช้สำเร็จ ให้ตั้งสถานะ user เป็นข้อมูลที่ได้รับจาก API และ getUserLoading เป็น false เพื่อแสดงว่าการโหลดข้อมูลผู้ใช้เสร็จสิ้น
      setState((prevState) => ({
        ...prevState,
        user: response.data,
        getUserLoading: false,
      }));
      return response.data.role;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (axiosError.response?.status === 401) {
        localStorage.removeItem("token");
      }
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
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/auth/login`,
        data,
      );
      const token = response.data.access_token;
      localStorage.setItem("token", token);
      const role = await fetchUser();
      return { role };
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.error || "Login failed";

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

  const loginWithGoogle = async (): Promise<void> => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) console.error("Google login error:", error);
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

  const logout = () => {
    localStorage.removeItem("token");
    setState({
      user: null,
      error: null,
      loading: false,
      getUserLoading: false,
    });
    router.push("/");
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
