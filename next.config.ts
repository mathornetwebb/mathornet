import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [
        { source: '/', destination: '/mathornet.html' },
        { source: '/mathornet', destination: '/mathornet.html' },
        { source: '/produkter', destination: '/produkter.html' },
        { source: '/recept', destination: '/recept.html' },
        { source: '/nyheter', destination: '/nyheter.html' },
        { source: '/aterforsaljare', destination: '/aterforsaljare.html' },
        { source: '/aterforsaljare-tack', destination: '/aterforsaljare.html' },
        { source: '/om-oss', destination: '/om-oss.html' },
        { source: '/hitta-oss', destination: '/hitta-oss.html' },
        { source: '/kontakt', destination: '/kontakt.html' },
        { source: '/kontakt-tack', destination: '/kontakt.html' },
        { source: '/kopvillkor', destination: '/kopvillkor.html' },
        { source: '/integritetspolicy', destination: '/integritetspolicy.html' },
        { source: '/cookies', destination: '/cookies.html' },
        { source: '/recept-:slug', destination: '/recept-:slug.html' },
        { source: '/nyhet-:slug', destination: '/nyhet-:slug.html' },
      ],
      fallback: [
        { source: '/:slug', destination: '/api/product-page/:slug' },
      ],
    };
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ['sharp'],
};

export default nextConfig;
