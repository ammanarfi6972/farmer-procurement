import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
});

const nextConfig: NextConfig = {
  turbopack: {},
  allowedDevOrigins: ["10.0.2.2", "localhost"],
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
  }
};

export default withPWA(nextConfig);
