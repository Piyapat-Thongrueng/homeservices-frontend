import { Html, Head, Main, NextScript } from "next/document";
import HomeServices from "./HomeServices";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="antialiased">
        <Main />
        <NextScript />
        <HomeServices />
      </body>
    </Html>
  );
}
