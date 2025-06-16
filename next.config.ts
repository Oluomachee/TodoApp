import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["todo-app-xg7o.vercel.app"],
  images: {
    remotePatterns:[
      {
        protocol:"https",
        hostname:"github.com",
        port:"",
        pathname: "/**"
      }
    ]
  }
};

export default nextConfig;
