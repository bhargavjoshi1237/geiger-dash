// Pure helpers shared by the filestore server code and the admin UI. No server
// imports here — client components pull formatters and lookups from this file.

export const PROVIDER_STATUS_MAP = {
  active: { label: "Active", dotClass: "bg-emerald-400" },
  unverified: { label: "Unverified", dotClass: "bg-amber-400" },
  readonly: { label: "Read-only", dotClass: "bg-sky-400" },
  draining: { label: "Draining", dotClass: "bg-violet-400" },
  error: { label: "Error", dotClass: "bg-red-400" },
  disabled: { label: "Disabled", dotClass: "bg-zinc-500" },
};

export const NODE_STATUS_MAP = {
  ready: { label: "Ready", dotClass: "bg-emerald-400" },
  pending: { label: "Uploading", dotClass: "bg-amber-400" },
  failed: { label: "Failed", dotClass: "bg-red-400" },
};

export const CAPABILITY_LABELS = {
  cdn: "CDN",
  publicRead: "Public read",
  presign: "Presigned uploads",
  multipart: "Multipart",
};

const UNITS = ["B", "KB", "MB", "GB", "TB", "PB"];

export function formatBytes(bytes, digits = 1) {
  const value = Number(bytes) || 0;
  if (value <= 0) return "0 B";

  const exponent = Math.min(
    UNITS.length - 1,
    Math.floor(Math.log(value) / Math.log(1024))
  );
  const scaled = value / 1024 ** exponent;
  return `${scaled.toFixed(exponent === 0 ? 0 : digits)} ${UNITS[exponent]}`;
}

export function parseBytes(input) {
  if (input === null || input === undefined || input === "") return 0;
  if (typeof input === "number") return Math.max(0, Math.round(input));

  const match = String(input).trim().match(/^([\d.]+)\s*([a-z]*)$/i);
  if (!match) return 0;

  const size = Number(match[1]) || 0;
  const unit = (match[2] || "B").toUpperCase();
  const exponent = UNITS.indexOf(unit === "" ? "B" : unit);
  return exponent < 0 ? Math.round(size) : Math.round(size * 1024 ** exponent);
}

// Headroom left on a provider. Capacity 0 means "unlimited", which has no
// meaningful percentage — callers render those differently.
export function headroom(provider) {
  if (!provider.capacityBytes) return Infinity;
  return Math.max(0, provider.capacityBytes - provider.usedBytes);
}

export function usagePercent(used, capacity) {
  if (!capacity) return 0;
  return Math.min(100, Math.round((used / capacity) * 100));
}

// "/a//b/c.png" -> "/a/b/c.png". Always absolute, never trailing-slashed.
export function normalizePath(input) {
  const parts = String(input || "")
    .split("/")
    .map((part) => part.trim())
    .filter((part) => part && part !== "." && part !== "..");
  return `/${parts.join("/")}`;
}

export function splitPath(input) {
  const path = normalizePath(input);
  const segments = path.slice(1).split("/").filter(Boolean);
  return {
    path,
    segments,
    name: segments[segments.length - 1] || "",
    parentSegments: segments.slice(0, -1),
    parentPath: segments.length > 1 ? `/${segments.slice(0, -1).join("/")}` : "/",
  };
}

export function formatRelative(iso) {
  if (!iso) return "never";
  const then = new Date(iso).getTime();
  const seconds = Math.round((Date.now() - then) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Public origin of the current request, so gateway links in an API response
// point at the host the caller actually reached us on.
export function requestOrigin(request) {
  const host =
    request.headers.get("x-forwarded-host") || request.headers.get("host");
  if (host) {
    const proto = request.headers.get("x-forwarded-proto") || "https";
    return `${proto}://${host}`;
  }

  try {
    return new URL(request.url).origin;
  } catch {
    return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  }
}

// Coarse buckets for the "what is in the pool" breakdown.
export function mimeGroup(mime) {
  const value = String(mime || "").toLowerCase();
  if (value.startsWith("image/")) return "Images";
  if (value.startsWith("video/")) return "Video";
  if (value.startsWith("audio/")) return "Audio";
  if (value.includes("pdf")) return "Documents";
  if (/(zip|tar|gzip|compress|7z|rar)/.test(value)) return "Archives";
  if (value.startsWith("text/") || value.includes("json") || value.includes("xml")) {
    return "Text & data";
  }
  return "Other";
}
