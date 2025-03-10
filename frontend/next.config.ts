import type { NextConfig } from "next";
const path = require("path");
const dotenv = require("dotenv");

const env = process.env.NODE_ENV || "development";
const envFile = path.resolve(__dirname, `../shared/config/.env.${env}`);
dotenv.config({ path: envFile });

 
const nextConfig: NextConfig = {
  reactStrictMode: true,

  webpack: (config) => {
    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: env === "production" ? "https" : "http",
        hostname: env === "production" ? "sunsolarpowers.com" : "localhost",
        port: process.env.PRODUCT_API_PORT || "8080", // Fallback to 8080 if undefined
        pathname: "/image_gallery/**", // Updated to match your URL
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BASE_URL}:${process.env.PRODUCT_API_PORT}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;