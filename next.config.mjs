import { productRouteRewrites } from "./lib/product-routes.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // next-themes v0.4.6 is a "use client" module and renders its FOUC-prevention
  // inline <script> inside that client boundary, so React 19 logs a dev-only,
  // benign "script tag while rendering" warning. It's upstream and harmless in
  // production; v0.4.6 is the latest and exposes no prop to disable the script.
  reactStrictMode: false,
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
