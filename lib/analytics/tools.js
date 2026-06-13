"use client";

import posthog from "posthog-js";

const analyticsEnabled = Boolean(
  process.env.NEXT_PUBLIC_GEIGER_POSTHOG_PROJECT_TOKEN &&
    process.env.NEXT_PUBLIC_GEIGER_POSTHOG_HOST,
);

const capture = (event, properties) => {
  if (analyticsEnabled) posthog.capture(event, properties);
};

const getSizeBucket = (bytes) => {
  if (bytes < 1024 * 1024) return "under_1_mb";
  if (bytes < 5 * 1024 * 1024) return "1_to_5_mb";
  if (bytes < 10 * 1024 * 1024) return "5_to_10_mb";
  return "10_to_25_mb";
};

export function trackToolFileSelected(tool, file) {
  capture("tool_file_selected", {
    tool,
    input_type: file.type || "unknown",
    size_bucket: getSizeBucket(file.size),
  });
}

export function trackToolProcessed(tool, properties = {}) {
  capture("tool_processing_completed", {
    tool,
    ...properties,
  });
}

export function trackToolDownload(tool, properties = {}) {
  capture("tool_download_clicked", {
    tool,
    ...properties,
  });
}

export function trackToolAssetsClick(tool) {
  capture("tool_assets_cta_clicked", { tool });
}
