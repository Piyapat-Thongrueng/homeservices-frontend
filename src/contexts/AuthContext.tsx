import axios, { AxiosError } from "axios";
import React, { useContext, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/router";

interface User {
  id: number;
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

  // Fn1: ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้จากเซิร์ฟเวอร์ โดยจะตรวจสอบว่ามี token ใน localStorage หรือไม่ หากไม่มี token จะตั้งสถานะผู้ใช้เป็น null และสถานะการโหลดเป็น false
  const fetchUser = async (): Promise<void> => {
    // ดึง token จาก localStorage เพื่อใช้ในการตรวจสอบสิทธิ์ในการเข้าถึงข้อมูลผู้ใช้
    const token = localStorage.getItem("token");
    // หากไม่มี token ให้ตั้งสถานะ user เป็น null และ getUserLoading เป็น false เพื่อแสดงว่าการโหลดข้อมูลผู้ใช้เสร็จสิ้น และออกจากฟังก์ชัน
    if (!token) {
      setState((prevState) => ({
        ...prevState,
        user: null,
        getUserLoading: false,
      }));
      return;
    }
    // หากมี token ให้ตั้งสถานะ getUserLoading เป็น true เพื่อแสดงว่ากำลังโหลดข้อมูลผู้ใช้ จากนั้นส่งคำขอ GET ไปยัง API เพื่อดึงข้อมูลผู้ใช้ โดยแนบ token ใน header ของคำขอเพื่อยืนยันตัวตน
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

      console.log("User data fetched:", response.data);
      // เมื่อได้รับข้อมูลผู้ใช้สำเร็จ ให้ตั้งสถานะ user เป็นข้อมูลที่ได้รับจาก API และ getUserLoading เป็น false เพื่อแสดงว่าการโหลดข้อมูลผู้ใช้เสร็จสิ้น
      setState((prevState) => ({
        ...prevState,
        user: response.data,
        getUserLoading: false,
      }));
      // หากเกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้ เช่น token ไม่ถูกต้อง หรือมีปัญหาในการเชื่อมต่อกับ API ให้จับข้อผิดพลาดและตั้งสถานะ error
      // เป็นข้อความที่ได้รับจาก API หรือข้อความทั่วไป และตั้งสถานะ user เป็น null และ getUserLoading เป็น false เพื่อแสดงว่าการโหลดข้อมูลผู้ใช้เสร็จสิ้นแม้จะเกิดข้อผิดพลาด
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (axiosError.response?.status === 401) {
        // หาก token ไม่ถูกต้องหรือหมดอายุ ให้ลบ token ออกจาก localStorage และตั้งสถานะ user เป็น null
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

  // ใช้ useEffect เพื่อเรียกฟังก์ชัน fetchUser เมื่อคอมโพเนนต์ถูก mount ขึ้นมา ซึ่งจะช่วยให้โหลดข้อมูลผู้ใช้ทันทีที่แอปเริ่มต้น
  useEffect(() => {
    fetchUser(); // Load user on initial app load
  }, []);

  // Fn2: ฟังก์ชันสำหรับเข้าสู่ระบบ โดยจะรับข้อมูลการเข้าสู่ระบบจากผู้ใช้และส่งคำขอ POST ไปยัง API เพื่อทำการตรวจสอบข้อมูลการเข้าสู่ระบบ
  const login = async (data: LoginData): Promise<{ error?: string } | void> => {
    // เริ่มต้นการเข้าสู่ระบบโดยตั้งสถานะ loading เป็น true และล้าง error ก่อนที่จะทำการส่งคำขอเข้าสู่ระบบไปยัง API
    try {
      setState((prevState) => ({ ...prevState, loading: true, error: null }));
      // ส่งคำขอเข้าสู่ระบบไปยัง API และรอผลลัพธ์โดยแนบข้อมูลการเข้าสู่ระบบที่ผู้ใช้กรอกเข้ามาเข้าไปกับ request ผ่าน axios.post
      const response = await axios.post(
        "http://localhost:4000/api/auth/login",
        data,
      );
      // เมื่อการเข้าสู่ระบบสำเร็จ ให้ดึง token ที่ได้รับจาก API และเก็บไว้ใน localStorage เพื่อใช้ในการตรวจสอบสิทธิ์ในการเข้าถึงข้อมูลผู้ใช้ในอนาคต จากนั้นตั้งสถานะ loading เป็น false และล้าง error
      // จากนั้นนำทางผู้ใช้ไปยังหน้าแรกของแอปและเรียกฟังก์ชัน fetchUser เพื่อโหลดข้อมูลผู้ใช้ทันทีหลังจากเข้าสู่ระบบสำเร็จ
      const token = response.data.access_token;
      localStorage.setItem("token", token);

      // Fetch and set user details
      // นำทางผู้ใช้ไปยังหน้าแรกของแอปและเรียกฟังก์ชัน fetchUser เพื่อโหลดข้อมูลผู้ใช้ทันทีหลังจากเข้าสู่ระบบสำเร็จ
      await fetchUser();
      router.push("/");
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

  // Fn3: ฟังก์ชันสำหรับลงทะเบียน โดยจะรับข้อมูลการลงทะเบียนจากผู้ใช้และส่งคำขอ POST ไปยัง API เพื่อทำการสร้างบัญชีผู้ใช้ใหม่
  const register = async (
    data: RegisterData,
  ): Promise<{ error?: string } | void> => {
    try {
      // เริ่มต้นการลงทะเบียนโดยตั้งสถานะ loading เป็น true และล้าง error ก่อน ที่จะทำการส่งคำขอลงทะเบียนไปยัง API
      setState((prevState) => ({ ...prevState, loading: true, error: null }));
      // ส่งคำขอลงทะเบียนไปยัง API และรอผลลัพธ์โดยแนบข้อมูลการลงทะเบียนที่ผู้ใช้กรอกเข้ามาเข้าไปกับ request ผ่าน axios.post
      await axios.post("http://localhost:4000/api/auth/register", data);
      // เมื่อการลงทะเบียนสำเร็จ ให้ตั้งสถานะ loading เป็น false และล้าง error จากนั้นนำทางผู้ใช้ไปยังหน้า success
      router.push("/auth/login");
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      // หากเกิดข้อผิดพลาดในการลงทะเบียน ให้ดึงข้อความ error จาก response ของ API หากไม่มีให้ใช้ข้อความ "Registration failed" เป็นค่าเริ่มต้น
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

  // Logout user
  const logout = () => {
    localStorage.removeItem("token");
    setState({
      user: null,
      error: null,
      loading: false,
      getUserLoading: null,
    });
    router.push("/auth/login");
  };

  // คำนวณสถานะการเข้าสู่ระบบโดยตรวจสอบว่ามีข้อมูลผู้ใช้ใน state หรือไม่
  // หากมีข้อมูลผู้ใช้แสดงว่าผู้ใช้เข้าสู่ระบบแล้ว และตั้งค่า isAuthenticated เป็น true
  // หากไม่มีข้อมูลผู้ใช้แสดงว่าผู้ใช้ยังไม่ได้เข้าสู่ระบบ และตั้งค่า isAuthenticated เป็น false
  const isAuthenticated = Boolean(state.user);
  return (
    <AuthContext.Provider
      value={{
        state,
        login,
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

// Hook for consuming AuthContext
// ฟังก์ชัน useAuth เป็น custom hook ที่ช่วยให้คอมโพเนนต์อื่น ๆ สามารถเข้าถึงค่าและฟังก์ชันที่จัดการโดย AuthContext ได้อย่างง่ายดาย
// โดยจะตรวจสอบว่าคอมโพเนนต์นั้นอยู่ภายใน AuthProvider หรือไม่ และหากไม่อยู่จะทำการโยนข้อผิดพลาดเพื่อแจ้งเตือนนักพัฒนาว่าต้องใช้ useAuth ภายใน AuthProvider เท่านั้น
const useAuth = (): AuthContextValue => {
  // ใช้ useContext เพื่อเข้าถึงค่าและฟังก์ชันที่จัดการโดย AuthContext และเก็บไว้ในตัวแปร context
  const context = useContext(AuthContext);

  // ตรวจสอบว่าค่า context เป็น undefined หรือไม่ ซึ่งหมายความว่าคอมโพเนนต์ที่เรียกใช้ useAuth ไม่ได้อยู่ภายใน AuthProvider
  // และหากเป็นเช่นนั้นจะทำการโยนข้อผิดพลาดเพื่อแจ้งเตือนนักพัฒนาว่าต้องใช้ useAuth ภายใน AuthProvider เท่านั้น
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export { AuthProvider, useAuth };
export type { User, AuthState, LoginData, RegisterData };
