import { productRouteRewrites } from "./lib/product-routes.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return productRouteRewrites;
  },
};

export default nextConfig;
