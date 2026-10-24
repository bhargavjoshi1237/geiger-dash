"use client";

import posthog from "posthog-js";

const analyticsEnabled = Boolean(
  process.env.NEXT_PUBLIC_GEIGER_POSTHOG_PROJECT_TOKEN &&
    process.env.NEXT_PUBLIC_GEIGER_POSTHOG_HOST,
);

// Pass { send_instantly: true } for events fired right before a full-page navigation so the batch isn't dropped.
export function capture(event, properties, options) {
  if (analyticsEnabled) posthog.capture(event, properties, options);
}
