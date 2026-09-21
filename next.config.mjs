import { productRouteRewrites } from "./lib/product-routes.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@geiger/ui"],
  // next-themes v0.4.6 is a "use client" module and renders its FOUC-prevention
  // inline <script> inside that client boundary, so React 19 logs a dev-only,
  // benign "script tag while rendering" warning. It's upstream and harmless in
  // production; v0.4.6 is the latest and exposes no prop to disable the script.
  reactStrictMode: false,
  // Dev assets are served same-origin only by default; allow the LAN host so
  // the page hydrates (and stays interactive) when opened via network IP.
  allowedDevOrigins: ['127.0.0.1', '100.67.60.79'],
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
