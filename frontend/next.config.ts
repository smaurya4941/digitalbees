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
  async redirects() {
    return [
      // About split into Company sub-pages (blueprint §26.1) — permanent
      // redirect so link equity and bookmarks to the old URL still resolve.
      {
        source: '/about-us',
        destination: '/company/our-story',
        permanent: true,
      },
    ];
  },
  typedRoutes: false,
};

export default nextConfig;
