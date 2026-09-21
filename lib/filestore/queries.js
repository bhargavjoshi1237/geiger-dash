// Reads against the filestore schema. Returns camelCase view models; the DB
// stays snake_case behind this boundary.
//
// Provider secrets never leave this file as values — normalizeProvider reports
// only WHICH secret fields are set, so the whole view model is safe to hand to a
// client component. Server code that needs real credentials goes through
// pool.js instead.

import { filestoreClient } from "./service.js";
import { describeSecrets } from "./crypto.js";
import { mimeGroup } from "./utils.js";

export function normalizeProvider(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name ?? "",
    driver: row.driver,
    status: row.status ?? "unverified",
    priority: row.priority ?? 100,
    capacityBytes: Number(row.capacity_bytes ?? 0),
    usedBytes: Number(row.used_bytes ?? 0),
    objectCount: Number(row.object_count ?? 0),
    config: row.config || {},
    capabilities: row.capabilities || {},
    publicUrlTemplate: row.public_url_template ?? "",
    secretsSet: describeSecrets(row.secrets),
    lastProbeAt: row.last_probe_at,
    lastProbeOk: row.last_probe_ok,
    lastProbeError: row.last_probe_error,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function normalizeNamespace(row) {
  if (!row) return null;
  return {
    id: row.id,
    key: row.key,
    name: row.name ?? "",
    project: row.project ?? "",
    quotaBytes: Number(row.quota_bytes ?? 0),
    usedBytes: Number(row.used_bytes ?? 0),
    objectCount: Number(row.object_count ?? 0),
    createdAt: row.created_at,
  };
}

export function normalizeNode(row) {
  if (!row) return null;

  const placement = Array.isArray(row.placements)
    ? row.placements.find((item) => item.is_current) || null
    : row.placements || null;

  return {
    id: row.id,
    namespaceId: row.namespace_id,
    parentId: row.parent_id,
    kind: row.kind,
    name: row.name ?? "",
    path: row.path ?? "/",
    sizeBytes: Number(row.size_bytes ?? 0),
    mimeType: row.mime_type ?? "",
    mimeGroup: mimeGroup(row.mime_type),
    checksum: row.checksum,
    status: row.status ?? "pending",
    metadata: row.metadata || {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    placement: placement
      ? {
          id: placement.id,
          providerId: placement.provider_id,
          providerName: placement.providers?.name ?? "",
          driver: placement.providers?.driver ?? "",
          providerKey: placement.provider_key ?? "",
          providerUrl: placement.provider_url ?? "",
          state: placement.state,
          sizeBytes: Number(placement.size_bytes ?? 0),
        }
      : null,
  };
}

export function normalizeRule(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name ?? "",
    priority: row.priority ?? 100,
    enabled: row.enabled ?? true,
    match: row.match || {},
    target: row.target || {},
    createdAt: row.created_at,
  };
}

export function normalizeApiKey(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name ?? "",
    project: row.project ?? "",
    namespaceId: row.namespace_id,
    namespaceKey: row.namespaces?.key ?? "",
    prefix: row.prefix ?? "",
    scopes: row.scopes || [],
    active: row.active ?? true,
    lastUsedAt: row.last_used_at,
    createdAt: row.created_at,
  };
}

export function normalizeEvent(row) {
  if (!row) return null;
  return {
    id: row.id,
    type: row.type,
    nodeId: row.node_id,
    providerId: row.provider_id,
    namespaceId: row.namespace_id,
    bytes: Number(row.bytes ?? 0),
    detail: row.detail || {},
    createdAt: row.created_at,
  };
}

// Placements are joined optionally: a pending upload has none yet, and a node
// whose only placement was orphaned must still list.
const NODE_SELECT =
  "*, placements(id, provider_id, provider_key, provider_url, state, size_bytes, is_current, providers(name, driver))";

export async function getProviders() {
  const supabase = filestoreClient();
  const { data, error } = await supabase
    .from("providers")
    .select("*")
    .is("deleted_at", null)
    .order("priority", { ascending: true });

  if (error) {
    console.error("[filestore.getProviders]", error.message);
    return [];
  }
  return (data || []).map(normalizeProvider);
}

export async function getNamespaces() {
  const supabase = filestoreClient();
  const { data, error } = await supabase
    .from("namespaces")
    .select("*")
    .is("deleted_at", null)
    .order("key", { ascending: true });

  if (error) {
    console.error("[filestore.getNamespaces]", error.message);
    return [];
  }
  return (data || []).map(normalizeNamespace);
}

export async function getNamespaceByKey(key) {
  const supabase = filestoreClient();
  const { data, error } = await supabase
    .from("namespaces")
    .select("*")
    .eq("key", key)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) {
    console.error("[filestore.getNamespaceByKey]", error.message);
    return null;
  }
  return normalizeNamespace(data);
}

// Every node in a namespace. The tree is small enough (folders + files for one
// app) that the browser builds the hierarchy client-side from a flat list.
export async function getNodes(namespaceId, limit = 2000) {
  if (!namespaceId) return [];

  const supabase = filestoreClient();
  const { data, error } = await supabase
    .from("nodes")
    .select(NODE_SELECT)
    .eq("namespace_id", namespaceId)
    .is("deleted_at", null)
    .order("path", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("[filestore.getNodes]", error.message);
    return [];
  }
  return (data || []).map(normalizeNode);
}

export async function getNodeById(id) {
  if (!id) return null;

  const supabase = filestoreClient();
  const { data, error } = await supabase
    .from("nodes")
    .select(NODE_SELECT)
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) {
    console.error("[filestore.getNodeById]", error.message);
    return null;
  }
  return normalizeNode(data);
}

export async function getNodeByPath(namespaceId, path) {
  if (!namespaceId || !path) return null;

  const supabase = filestoreClient();
  const { data, error } = await supabase
    .from("nodes")
    .select(NODE_SELECT)
    .eq("namespace_id", namespaceId)
    .eq("path", path)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) {
    console.error("[filestore.getNodeByPath]", error.message);
    return null;
  }
  return normalizeNode(data);
}

export async function getRules() {
  const supabase = filestoreClient();
  const { data, error } = await supabase
    .from("rules")
    .select("*")
    .is("deleted_at", null)
    .order("priority", { ascending: true });

  if (error) {
    console.error("[filestore.getRules]", error.message);
    return [];
  }
  return (data || []).map(normalizeRule);
}

export async function getApiKeys() {
  const supabase = filestoreClient();
  const { data, error } = await supabase
    .from("api_keys")
    .select("*, namespaces(key)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[filestore.getApiKeys]", error.message);
    return [];
  }
  return (data || []).map(normalizeApiKey);
}

export async function getEvents(limit = 150) {
  const supabase = filestoreClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[filestore.getEvents]", error.message);
    return [];
  }
  return (data || []).map(normalizeEvent);
}

// The largest files in the pool, across every namespace — one of the overview
// panels and the first thing you look at when the pool is filling up.
export async function getLargestFiles(limit = 10) {
  const supabase = filestoreClient();
  const { data, error } = await supabase
    .from("nodes")
    .select(NODE_SELECT)
    .eq("kind", "file")
    .is("deleted_at", null)
    .order("size_bytes", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[filestore.getLargestFiles]", error.message);
    return [];
  }
  return (data || []).map(normalizeNode);
}

// Flat list of every committed file, used to derive the mime breakdown and the
// growth curve without shipping a second aggregate query per panel.
export async function getFileIndex(limit = 5000) {
  const supabase = filestoreClient();
  const { data, error } = await supabase
    .from("nodes")
    .select("id, namespace_id, size_bytes, mime_type, created_at, status")
    .eq("kind", "file")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[filestore.getFileIndex]", error.message);
    return [];
  }

  return (data || []).map((row) => ({
    id: row.id,
    namespaceId: row.namespace_id,
    sizeBytes: Number(row.size_bytes ?? 0),
    mimeType: row.mime_type ?? "",
    mimeGroup: mimeGroup(row.mime_type),
    createdAt: row.created_at,
    status: row.status,
  }));
}
