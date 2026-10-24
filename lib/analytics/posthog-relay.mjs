// PostHog is relayed through our own domain: blocklists drop posthog.com and the stock "/ingest" path, but not this one.
export const POSTHOG_RELAY_PATH = "/rly";

// NEXT_PUBLIC_GEIGER_POSTHOG_HOST is the region's app URL (https://eu.posthog.com); ingestion lives on its i./assets hosts.
export function posthogRelayRewrites(host = "") {
  const region = /\/\/eu\./.test(host) ? "eu" : "us";
  return [
    { source: `${POSTHOG_RELAY_PATH}/static/:path*`, destination: `https://${region}-assets.i.posthog.com/static/:path*` },
    { source: `${POSTHOG_RELAY_PATH}/array/:path*`, destination: `https://${region}-assets.i.posthog.com/array/:path*` },
    { source: `${POSTHOG_RELAY_PATH}/:path*`, destination: `https://${region}.i.posthog.com/:path*` },
  ];
}
