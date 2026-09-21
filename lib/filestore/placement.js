// The placement engine: which provider does this upload physically land on?
//
// Order of decisions:
//   1. candidates  — active, room for the file, size/mime allowed, and holding
//                    every capability the request demands (e.g. "cdn")
//   2. rules       — first matching rule pins a provider or narrows by capability
//   3. fill/spill  — lowest `priority` wins; when it's full the next one takes over
//
// When nothing qualifies the caller gets the specific reason, never a silent
// failure — "the pool is full" and "no CDN-capable provider has room" are very
// different operational problems.

import { loadProviderRows } from "./pool.js";
import { filestoreClient } from "./service.js";

function hasRoom(row, size) {
  const capacity = Number(row.capacity_bytes || 0);
  if (capacity === 0) return true;
  return Number(row.used_bytes || 0) + size <= capacity;
}

function withinObjectLimit(row, size) {
  const max = Number(row.capabilities?.maxObjectSize || 0);
  return max === 0 || size <= max;
}

function mimeAllowed(row, mime) {
  const allow = row.capabilities?.mimeAllow;
  if (!Array.isArray(allow) || allow.length === 0) return true;
  return allow.some((prefix) => String(mime || "").startsWith(prefix));
}

function hasCapabilities(row, required) {
  return (required || []).every((capability) => Boolean(row.capabilities?.[capability]));
}

async function loadRules() {
  const { data, error } = await filestoreClient()
    .from("rules")
    .select("*")
    .eq("enabled", true)
    .is("deleted_at", null)
    .order("priority", { ascending: true });

  if (error) {
    console.error("[filestore.loadRules]", error.message);
    return [];
  }
  return data || [];
}

function ruleMatches(rule, { size, mime, namespaceKey }) {
  const match = rule.match || {};

  if (match.mimePrefix && !String(mime || "").startsWith(match.mimePrefix)) return false;
  if (match.minSize && size < Number(match.minSize)) return false;
  if (match.maxSize && size > Number(match.maxSize)) return false;
  if (match.namespaceKey && match.namespaceKey !== namespaceKey) return false;

  return true;
}

export async function resolveProvider({
  size = 0,
  mime = "",
  namespaceKey = "",
  require = [],
  exclude = [],
} = {}) {
  const all = await loadProviderRows({ activeOnly: true });
  // `exclude` carries providers that just lost a reservation race, so the retry
  // spills to the next one instead of hammering a provider that is now full.
  const rows = all.filter((row) => !exclude.includes(row.id));

  if (rows.length === 0) {
    return {
      provider: null,
      code: "no_providers",
      error: "No active storage providers in the pool. Add and test one first.",
    };
  }

  const required = [...require];
  let pinnedId = null;

  // Rules run before the default fill so an admin can force, say, every image
  // onto a CDN-backed provider regardless of priority order.
  for (const rule of await loadRules()) {
    if (!ruleMatches(rule, { size, mime, namespaceKey })) continue;

    if (rule.target?.providerId) pinnedId = rule.target.providerId;
    for (const capability of rule.target?.requireCapabilities || []) {
      if (!required.includes(capability)) required.push(capability);
    }
    break;
  }

  let candidates = rows;
  if (pinnedId) candidates = candidates.filter((row) => row.id === pinnedId);

  const capable = candidates.filter((row) => hasCapabilities(row, required));
  if (capable.length === 0) {
    return {
      provider: null,
      code: "no_capability",
      error: required.length
        ? `No active provider offers: ${required.join(", ")}.`
        : "The rule for this upload pinned a provider that is not active.",
    };
  }

  const sizeOk = capable.filter(
    (row) => withinObjectLimit(row, size) && mimeAllowed(row, mime)
  );
  if (sizeOk.length === 0) {
    return {
      provider: null,
      code: "object_too_large",
      error: "No provider accepts a file of this size or type.",
    };
  }

  const withCapacity = sizeOk.filter((row) => hasRoom(row, size));
  if (withCapacity.length === 0) {
    return {
      provider: null,
      code: "pool_full",
      error: "Every eligible provider is full. Raise a capacity or add a provider.",
    };
  }

  // Fill then spill: already ordered by priority ascending from loadProviderRows.
  return {
    provider: withCapacity[0],
    code: "ok",
    error: null,
    pinnedByRule: Boolean(pinnedId),
    requiredCapabilities: required,
  };
}

// What the overview shows as "where would the next upload go" — and the reason
// a provider is currently ineligible.
export async function describePool() {
  const rows = await loadProviderRows();

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    driver: row.driver,
    status: row.status,
    priority: row.priority,
    capacityBytes: Number(row.capacity_bytes || 0),
    usedBytes: Number(row.used_bytes || 0),
    objectCount: Number(row.object_count || 0),
    capabilities: row.capabilities || {},
    eligible: row.status === "active" && hasRoom(row, 1),
  }));
}
