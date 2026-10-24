"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { GoogleAnalytics } from "@next/third-parties/google";
import { isPublicSite } from "@/lib/analytics/public-site";

const GA_ID = process.env.NEXT_PUBLIC_GEIGER_GA_MEASUREMENT_ID;
const noopSubscribe = () => () => {};

// Loads GA4 once a visitor reaches a public page; instrumentation-client.js mutes it after a hop into the app.
export function PublicGoogleAnalytics() {
  const pathname = usePathname();
  const hostname = useSyncExternalStore(noopSubscribe, () => window.location.hostname, () => null);

  if (!GA_ID || hostname === null || !isPublicSite(hostname, pathname)) return null;
  return <GoogleAnalytics gaId={GA_ID} />;
}
