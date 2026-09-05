import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'contribution.usercontent.google.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      }
    ],
  },
  async rewrites() {
    return [
      {
        source: '/backend/:path*',
        // We use an internal env var here for the proxy destination
        destination: `${process.env.BACKEND_PROXY_URL || 'http://localhost:8000'}/:path*`,
      },
    ];
  },
};

export default nextConfig;
