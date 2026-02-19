import { Html, Head, Main, NextScript } from "next/document";
import HomeServices from "./HomeServices";

export default function Document() {
  return (
    <Html lang="th">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="antialiased">
        <HomeServices/>
        <Main />
        <NextScript />
        
      </body>
    </Html>
  );
}
