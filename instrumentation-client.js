import posthog from "posthog-js";

const token = process.env.NEXT_PUBLIC_GEIGER_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_GEIGER_POSTHOG_HOST;

if (token && host) {
  posthog.init(token, {
    api_host: host,
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
