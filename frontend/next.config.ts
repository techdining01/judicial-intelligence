import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // 👇 THIS SILENCES THE ERROR
  turbopack: {},

};

export default nextConfig;
