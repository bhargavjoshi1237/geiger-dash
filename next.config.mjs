import { productRouteRewrites } from "./lib/product-routes.mjs";
import { posthogRelayRewrites } from "./lib/analytics/posthog-relay.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@geiger/ui", "@geiger/notify"],
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
  // PostHog's endpoints end in "/" (/e/, /flags/); proxy.js restores the /path/ → /path redirect for everything else.
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      ...posthogRelayRewrites(process.env.NEXT_PUBLIC_GEIGER_POSTHOG_HOST),
      ...productRouteRewrites,
    ];
  },
};

export default nextConfig;
