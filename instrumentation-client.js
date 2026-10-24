import posthog from "posthog-js";
import { POSTHOG_RELAY_PATH } from "@/lib/analytics/posthog-relay.mjs";
import { isPublicSite } from "@/lib/analytics/public-site";

const token = process.env.NEXT_PUBLIC_GEIGER_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_GEIGER_POSTHOG_HOST;
const gaId = process.env.NEXT_PUBLIC_GEIGER_GA_MEASUREMENT_ID;

// GA's history listener fires on pushState; setting Google's opt-out flag before Next navigates keeps app pages out of GA.
function muteGoogleAnalyticsOutsidePublicSite(pathname) {
  if (gaId) window[`ga-disable-${gaId}`] = !isPublicSite(window.location.hostname, pathname);
}

muteGoogleAnalyticsOutsidePublicSite(window.location.pathname);

export function onRouterTransitionStart(url) {
  muteGoogleAnalyticsOutsidePublicSite(new URL(url, window.location.href).pathname);
}

if (token && host) {
  posthog.init(token, {
    api_host: POSTHOG_RELAY_PATH,
    ui_host: host,
    defaults: "2026-01-30",
    capture_pageview: "history_change",
    autocapture: false,
    cookieless_mode: "always",
    disable_session_recording: true,
    disable_surveys: true,
    advanced_disable_flags: true,
    person_profiles: "identified_only",
  });
}
