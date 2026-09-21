// Aggregates behind the overview dashboard.
//
// Derived in one pass from the flat reads in queries.js rather than a query per
// panel — the pool is one project's worth of files, so the arithmetic is cheap
// and this keeps the admin page to a single round of fetches.

import {
  getProviders,
  getNamespaces,
  getFileIndex,
  getLargestFiles,
  getEvents,
} from "./queries.js";
import { mimeGroup, usagePercent } from "./utils.js";

const GROWTH_DAYS = 30;

function dayKey(iso) {
  return new Date(iso).toISOString().slice(0, 10);
}

export async function getPoolSnapshot() {
  const [providers, namespaces, files, largest, events] = await Promise.all([
    getProviders(),
    getNamespaces(),
    getFileIndex(),
    getLargestFiles(8),
    getEvents(200),
  ]);

  // A provider with capacity 0 is unlimited; it contributes usage but no ceiling,
  // so the pool total is only meaningful alongside that flag.
  const bounded = providers.filter((provider) => provider.capacityBytes > 0);
  const capacityBytes = bounded.reduce((sum, p) => sum + p.capacityBytes, 0);
  const usedBytes = providers.reduce((sum, p) => sum + p.usedBytes, 0);
  const objectCount = providers.reduce((sum, p) => sum + p.objectCount, 0);
  const hasUnlimited = providers.some(
    (provider) => provider.capacityBytes === 0 && provider.status === "active"
  );

  const byMime = new Map();
  for (const file of files) {
    const group = file.mimeGroup || mimeGroup(file.mimeType);
    const entry = byMime.get(group) || { group, bytes: 0, count: 0 };
    entry.bytes += file.sizeBytes;
    entry.count += 1;
    byMime.set(group, entry);
  }

  const namespaceById = new Map(namespaces.map((ns) => [ns.id, ns]));
  const byNamespace = new Map();
  for (const file of files) {
    const ns = namespaceById.get(file.namespaceId);
    if (!ns) continue;
    const entry = byNamespace.get(ns.id) || {
      id: ns.id,
      key: ns.key,
      name: ns.name,
      bytes: 0,
      count: 0,
    };
    entry.bytes += file.sizeBytes;
    entry.count += 1;
    byNamespace.set(ns.id, entry);
  }

  // Daily added bytes for the last 30 days, plus the running total, so the chart
  // can show both the rate and the trajectory toward the ceiling.
  const today = new Date();
  const days = [];
  for (let offset = GROWTH_DAYS - 1; offset >= 0; offset -= 1) {
    const date = new Date(today);
    date.setDate(date.getDate() - offset);
    days.push(date.toISOString().slice(0, 10));
  }

  const addedByDay = new Map(days.map((day) => [day, 0]));
  let beforeWindow = 0;
  for (const file of files) {
    const key = dayKey(file.createdAt);
    if (addedByDay.has(key)) addedByDay.set(key, addedByDay.get(key) + file.sizeBytes);
    else if (key < days[0]) beforeWindow += file.sizeBytes;
  }

  let running = beforeWindow;
  const growth = days.map((day) => {
    running += addedByDay.get(day) || 0;
    return { date: day, added: addedByDay.get(day) || 0, total: running };
  });

  const healthy = providers.filter((provider) => provider.status === "active").length;
  const degraded = providers.filter((provider) =>
    ["error", "unverified"].includes(provider.status)
  ).length;

  return {
    totals: {
      capacityBytes,
      usedBytes,
      freeBytes: Math.max(0, capacityBytes - usedBytes),
      usedPercent: usagePercent(usedBytes, capacityBytes),
      objectCount,
      fileCount: files.length,
      providerCount: providers.length,
      healthy,
      degraded,
      hasUnlimited,
      namespaceCount: namespaces.length,
    },
    providers,
    namespaces,
    byMime: [...byMime.values()].sort((a, b) => b.bytes - a.bytes),
    byNamespace: [...byNamespace.values()].sort((a, b) => b.bytes - a.bytes),
    growth,
    largest,
    events,
  };
}
