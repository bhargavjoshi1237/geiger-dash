// Helpers shared by the storage drivers.

// Resolve a dotted path out of a JSON response, e.g. "file" or "data.uuid".
export function getPath(source, path) {
  if (!source || !path) return undefined;
  return path
    .split(".")
    .reduce((acc, part) => (acc == null ? undefined : acc[part]), source);
}

// Fill {placeholders} in a template. Values come from the flat `vars` bag plus
// the namespaced {secret.X} / {config.X} lookups the REST driver relies on.
export function interpolate(template, vars = {}, { config = {}, secrets = {} } = {}) {
  if (typeof template !== "string") return template;

  return template.replace(/\{([\w.]+)\}/g, (match, token) => {
    if (token.startsWith("secret.")) return secrets[token.slice(7)] ?? "";
    if (token.startsWith("config.")) return config[token.slice(7)] ?? "";
    return vars[token] ?? "";
  });
}

// The raw public/CDN URL for an object, from the provider's template.
export function renderPublicUrl(template, key, extra = {}) {
  if (!template) return "";
  return interpolate(template, { key, ...extra });
}

// Object keys are namespaced by node id so two providers never collide and an
// orphan can always be traced back to the node that owned it.
export function buildObjectKey({ prefix, nodeId, filename }) {
  const safe = String(filename || "file")
    .replace(/[^\w.\-]+/g, "_")
    .slice(-80);
  const head = prefix ? `${String(prefix).replace(/^\/+|\/+$/g, "")}/` : "";
  return `${head}${nodeId}/${safe}`;
}

// Providers answer in wildly different shapes; normalize what we care about.
export function pickSize(payload, fallback) {
  const candidate = payload?.size ?? payload?.total ?? payload?.bytes;
  const size = Number(candidate);
  return Number.isFinite(size) && size > 0 ? size : fallback;
}

export async function readJson(response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}
