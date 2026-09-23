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
      // About Us canonical path is /about; redirect /about-us permanently
      {
        source: '/about-us',
        destination: '/about',
        permanent: true,
      },
      // The blog moved from /insights to /blog.
      { source: '/insights', destination: '/blog', permanent: true },
      { source: '/insights/:slug', destination: '/blog/:slug', permanent: true },
      // Admin "Resources" was renamed to "Blog".
      { source: '/admin/resources', destination: '/admin/blog', permanent: true },
      { source: '/admin/resources/:path*', destination: '/admin/blog/:path*', permanent: true },
    ];
  },
  typedRoutes: false,
};

export default nextConfig;
