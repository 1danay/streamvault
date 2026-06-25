import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "streamvault.storage.yandexcloud.net",
      },
    ],
  },
};

export default nextConfig;
