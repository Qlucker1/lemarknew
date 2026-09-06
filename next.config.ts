import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  async rewrites() {
    return { beforeFiles: [], afterFiles: [], fallback: [
      { source: '/assets/:path*', destination: 'https://lemarkllc.ru/assets/:path*' },
    ] };
  },
  experimental: {
    optimizePackageImports: ["motion"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
