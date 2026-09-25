// Server-internal provider access: the one place that loads raw provider rows
// (secrets included), talks to drivers, and maintains the byte ledger.
//
// queries.js is the safe-to-render view of the same tables; this file is never
// imported by a component.

import { filestoreClient } from "./service.js";
import { getDriver, driverContext } from "./drivers/index.js";
import { normalizeProvider } from "./queries.js";

// Raw rows, secrets attached. Server-only.
export async function loadProviderRows({ activeOnly = false } = {}) {
  const supabase = filestoreClient();
  let query = supabase.from("providers").select("*").is("deleted_at", null);
  if (activeOnly) query = query.eq("status", "active");

  const { data, error } = await query.order("priority", { ascending: true });
  if (error) {
    console.error("[filestore.loadProviderRows]", error.message);
    return [];
  }
  return data || [];
}

export async function loadProviderRow(id) {
  if (!id) return null;

  const supabase = filestoreClient();
  const { data, error } = await supabase
    .from("providers")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[filestore.loadProviderRow]", error.message);
    return null;
  }
  return data;
}

// Driver context for a raw row. `secrets` on the row is the encrypted envelope;
// driverContext decrypts it.
export function contextFor(row) {
  return driverContext({
    id: row.id,
    config: row.config || {},
    secretsEnvelope: row.secrets,
    capabilities: row.capabilities || {},
    publicUrlTemplate: row.public_url_template || "",
  });
}

export function driverFor(row) {
  return getDriver(row.driver);
}

export async function logEvent({
  type,
  nodeId = null,
  providerId = null,
  namespaceId = null,
  apiKeyId = null,
  bytes = 0,
  detail = {},
}) {
  try {
    const { error } = await filestoreClient().from("events").insert({
      type,
      node_id: nodeId,
      provider_id: providerId,
      namespace_id: namespaceId,
      api_key_id: apiKeyId,
      bytes,
      detail,
    });
    if (error) console.error("[filestore.logEvent]", error.message);
  } catch (err) {
    console.error("[filestore.logEvent]", err.message);
  }
}

// Qualification. A provider is only usable once a real write -> read -> delete
// round trip has succeeded, so a typo'd bucket or a dead endpoint is caught
// here rather than on someone's first upload.
export async function probeProvider(id) {
  const row = await loadProviderRow(id);
  if (!row) return { ok: false, error: "Provider not found." };

  const supabase = filestoreClient();
  let result;

  try {
    result = await driverFor(row).probe(contextFor(row));
  } catch (err) {
    result = { ok: false, error: err.message, warnings: [] };
  }

  // A passing probe promotes an unverified/errored provider into service; a
  // failing one takes it out, so nothing routes to a broken provider.
  const nextStatus = result.ok
    ? ["unverified", "error"].includes(row.status)
      ? "active"
      : row.status
    : "error";

  await supabase
    .from("providers")
    .update({
      status: nextStatus,
      last_probe_at: new Date().toISOString(),
      last_probe_ok: result.ok,
      last_probe_error: result.ok ? null : result.error,
    })
    .eq("id", id);

  await logEvent({
    type: "probe",
    providerId: id,
    detail: { ok: result.ok, error: result.error, warnings: result.warnings },
  });

  return { ...result, status: nextStatus };
}

export async function reserveBytes(providerId, bytes) {
  const { data, error } = await filestoreClient().rpc("reserve_bytes", {
    p_provider: providerId,
    p_bytes: bytes,
  });

  if (error) {
    console.error("[filestore.reserveBytes]", error.message);
    return false;
  }
  return Boolean(data);
}

export async function releaseBytes(providerId, bytes) {
  const { error } = await filestoreClient().rpc("release_bytes", {
    p_provider: providerId,
    p_bytes: bytes,
  });
  if (error) console.error("[filestore.releaseBytes]", error.message);
}

export async function settleBytes(providerId, reserved, actual) {
  const { error } = await filestoreClient().rpc("settle_bytes", {
    p_provider: providerId,
    p_reserved: reserved,
    p_actual: actual,
  });
  if (error) console.error("[filestore.settleBytes]", error.message);
}

export async function bumpNamespace(namespaceId, bytes, objects) {
  const { error } = await filestoreClient().rpc("bump_namespace", {
    p_namespace: namespaceId,
    p_bytes: bytes,
    p_objects: objects,
  });
  if (error) console.error("[filestore.bumpNamespace]", error.message);
}

export async function deleteObject(providerRow, key) {
  if (!key) return false;
  try {
    return await driverFor(providerRow).remove(contextFor(providerRow), { key });
  } catch (err) {
    console.error("[filestore.deleteObject]", err.message);
    return false;
  }
}

// Sweep tickets whose transfer never completed: release the reserved bytes and
// mark the placement orphaned so a later provider-side cleanup can find it.
export async function expireStaleUploads() {
  const supabase = filestoreClient();
  const { data, error } = await supabase
    .from("uploads")
    .select("id, provider_id, placement_id, reserved_bytes")
    .eq("state", "open")
    .lt("expires_at", new Date().toISOString())
    .limit(200);

  if (error) {
    console.error("[filestore.expireStaleUploads]", error.message);
    return 0;
  }

  for (const upload of data || []) {
    await releaseBytes(upload.provider_id, Number(upload.reserved_bytes || 0));
    if (upload.placement_id) {
      await supabase
        .from("placements")
        .update({ state: "orphaned", is_current: false })
        .eq("id", upload.placement_id);
    }
    await supabase.from("uploads").update({ state: "expired" }).eq("id", upload.id);
  }

  return (data || []).length;
}

// Re-sum a provider's ledger from its committed placements and report the drift
// that was corrected. Runs after the stale-upload sweep so abandoned
// reservations are released first.
export async function reconcileProvider(id) {
  const { data, error } = await filestoreClient().rpc("reconcile_provider", {
    p_provider: id,
  });

  if (error) {
    console.error("[filestore.reconcileProvider]", error.message);
    return null;
  }

  await logEvent({ type: "reconcile", providerId: id, detail: data || {} });
  return data;
}

export async function reconcileAll() {
  const expired = await expireStaleUploads();
  const rows = await loadProviderRows();
  const results = [];

  for (const row of rows) {
    const drift = await reconcileProvider(row.id);
    results.push({ provider: normalizeProvider(row), drift });
  }

  return { expired, results };
}
