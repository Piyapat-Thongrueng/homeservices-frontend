import "@/styles/globals.css";
import { appWithTranslation } from "next-i18next";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/contexts/AuthContext";
import jwtInterceptor from "@/utils/jwtInterceptor";

jwtInterceptor();

function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default appWithTranslation(App);
