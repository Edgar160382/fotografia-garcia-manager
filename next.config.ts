import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 allowedDevOrigins: [
  "192.168.100.150",
  "marina-lock-geographical-kind.trycloudflare.com",
],
};

export default nextConfig;