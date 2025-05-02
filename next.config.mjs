/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      { hostname: process.env.NEXT_PUBLIC_HOST_NAME1 },
    ],
    deviceSizes: [320, 375, 425, 550, 640, 768, 1024, 1280, 1536, 1750],
  },
};

export default nextConfig;
