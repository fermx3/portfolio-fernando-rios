import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  images: {
    domains: ['placeholder.com'],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    mdxRs: true,
  },
};

export default nextConfig;
