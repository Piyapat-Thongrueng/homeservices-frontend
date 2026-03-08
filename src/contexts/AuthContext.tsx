import axios, { AxiosError } from "axios";
import React, { useContext, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/router";

interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  profile_pic: string;
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
  login: (data: LoginData) => Promise<{ error?: string } | void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<{ error?: string } | void>;
  isAuthenticated: boolean;
  fetchUser: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface ErrorResponse {
  error: string;
}

// สร้าง Context สำหรับการจัดการ Authentication และการจัดการสถานะของผู้ใช้
const AuthContext = React.createContext<AuthContextValue | undefined>(
  undefined,
);

// Provider component ที่จะครอบคลุมส่วนของแอปที่ต้องการเข้าถึงข้อมูลการ Authentication
function AuthProvider({ children }: AuthProviderProps) {
  // สถานะของ Authentication ที่จะถูกจัดการใน Context
  // ประกอบด้วยสถานะการโหลด (loading), ข้อผิดพลาด (error), และข้อมูลผู้ใช้ (user) ซึ่งจะถูกอัปเดตตามการกระทำต่าง ๆ เช่น การเข้าสู่ระบบ การลงทะเบียน และการดึงข้อมูลผู้ใช้
  const [state, setState] = useState<AuthState>({
    loading: null,
    getUserLoading: null,
    error: null,
    user: null,
  });

  const router = useRouter();

  // ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้จากเซิร์ฟเวอร์ โดยจะตรวจสอบว่ามี token ใน localStorage หรือไม่ หากไม่มี token จะตั้งสถานะผู้ใช้เป็น null และสถานะการโหลดเป็น false
  const fetchUser = async (): Promise<void> => {
    // ดึง token จาก localStorage เพื่อใช้ในการตรวจสอบสิทธิ์ในการเข้าถึงข้อมูลผู้ใช้ หากไม่มี token ให้ตั้งสถานะ user เป็น null และ getUserLoading เป็น false แล้วออกจากฟังก์ชัน
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
        "http://localhost:4000/api/auth/get-user",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setState((prevState) => ({
        ...prevState,
        user: response.data,
        getUserLoading: false,
      }));
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        user: null,
        getUserLoading: false,
        error:
          (error as AxiosError<ErrorResponse>).response?.data.error ||
          "An error occurred",
      }));
    }
  };
}
