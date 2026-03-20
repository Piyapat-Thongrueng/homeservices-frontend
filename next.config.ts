import type { NextConfig } from "next";

const i18nConfig = require("./next-i18next.config.js");

const nextConfig: NextConfig = {
  i18n: i18nConfig.i18n,
  reactStrictMode: true,
};

export default nextConfig;
