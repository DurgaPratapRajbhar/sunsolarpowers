import type { NextConfig } from "next";
const path = require("path");
const dotenv = require("dotenv");

// Manually load .env from a custom path
dotenv.config({ path: path.resolve(__dirname, "../shared/config/.env") });

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080", // Ensure this matches your backend port
        pathname: "/image_gallery/**", // Change if images are stored in a different path
      },
    ],
  }
  
};

export default nextConfig;
