import "@/styles/globals.css";
import { appWithTranslation } from "next-i18next";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/contexts/AuthContext";
import jwtInterceptor from "@/utils/jwtInterceptor";
import nextI18nextConfig from "../../next-i18next.config.js";

jwtInterceptor();

function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default appWithTranslation(App, nextI18nextConfig);
