import axios from "axios";
import type {
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosError,
} from "axios";
import { supabase } from "@/lib/supabaseClient";

interface ErrorResponse {
  error: string;
  message?: string;
}

const clearLegacyToken = (): void => {
  localStorage.removeItem("token");
};

const shouldForceLogout = (error: AxiosError<ErrorResponse>): boolean => {
  if (error.response?.status !== 401) return false;
  const url = error.config?.url ?? "";
  return url.includes("/api/auth/get-user");
};

function jwtInterceptor() {
  // Request — แนบ token อัตโนมัติ
  axios.interceptors.request.use(
    async (
      config: InternalAxiosRequestConfig,
    ): Promise<InternalAxiosRequestConfig> => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (!error && data.session?.access_token) {
          config.headers.Authorization = `Bearer ${data.session.access_token}`;
        } else if (config.headers.Authorization) {
          delete config.headers.Authorization;
        }
      } catch (err) {
        console.error("Failed to read session token:", err);
        if (config.headers.Authorization) {
          delete config.headers.Authorization;
        }
      }
      return config;
    },
    (error: AxiosError): Promise<AxiosError> => {
      return Promise.reject(error);
    },
  );

  // Response — จัดการ 401
  axios.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => {
      return response;
    },
    async (error: AxiosError<ErrorResponse>): Promise<AxiosError> => {
      if (shouldForceLogout(error)) {
        await supabase.auth.signOut();
        clearLegacyToken();

        if (window.location.pathname !== "/login") {
          window.location.replace("/login");
        }
      }
      return Promise.reject(error);
    },
  );
}

export default jwtInterceptor;
