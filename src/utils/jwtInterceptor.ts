import axios from "axios";
import type {
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosError,
} from "axios";

interface ErrorResponse {
  error: string;
  message?: string;
}

function jwtInterceptor() {
  // Request — แนบ token อัตโนมัติ
  axios.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
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
    (error: AxiosError<ErrorResponse>): Promise<AxiosError> => {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");

        if (window.location.pathname !== "/login") {
          window.location.replace("/login");
        }
      }
      return Promise.reject(error);
    },
  );
}

export default jwtInterceptor;
