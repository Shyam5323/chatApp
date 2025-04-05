import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

export default nextConfig;
