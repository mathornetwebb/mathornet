import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [
        { source: '/', destination: '/mathornet.html' },
      ],
      fallback: [
        { source: '/:slug', destination: '/:slug.html' },
      ],
    };
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ['sharp'],
};

export default nextConfig;
