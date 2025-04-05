import withPWA from "./lib/next-pwa-wrapper.cjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV !== "development",
  },
  reactStrictMode: true,
  images: {
    domains: ["img.clerk.com", "utfs.io", "6subaqccvm.ufs.sh"],
  },
  /* config options here */
  async redirects() {
    return [
      {
        source: "/",
        destination: "/conversations",
        permanent: true,
      },
    ];
  },
};
const PWAWrapper = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

export default PWAWrapper(nextConfig);
