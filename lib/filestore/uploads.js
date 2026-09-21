// Upload orchestration: reserve -> transfer -> commit.
//
// Bytes never pass through our functions except in `proxy` mode, so capacity has
// to be debited before the client starts transferring and corrected once the
// provider reports the real size. The `uploads` row is what ties a commit back
// to a reservation; without it a caller could commit a file nobody accounted for.

import { filestoreClient } from "./service.js";
import { resolveProvider } from "./placement.js";
import {
  loadProviderRow,
  contextFor,
  driverFor,
  reserveBytes,
  releaseBytes,
  settleBytes,
  bumpNamespace,
  deleteObject,
  logEvent,
} from "./pool.js";
import { createFileNode, currentPlacements, markPlacements } from "./nodes.js";
import { buildObjectKey } from "./drivers/shared.js";
import { normalizeNode } from "./queries.js";
import { splitPath } from "./utils.js";

const MAX_PLACEMENT_ATTEMPTS = 3;

function appOrigin(origin) {
  return (
    origin || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ).replace(/\/+$/, "");
}

// The "map" a caller gets back: logical location, stable link, raw CDN link, and
// exactly which provider is holding the bytes.
export function buildFileMap({ node, placement, provider, namespace, origin }) {
  return {
    id: node.id,
    path: node.path,
    name: node.name,
    namespace: namespace?.key || "",
    size: node.sizeBytes ?? node.size_bytes ?? 0,
    mimeType: node.mimeType ?? node.mime_type ?? "",
    status: node.status,
    url: `${appOrigin(origin)}/api/storage/f/${node.id}`,
    directUrl: placement?.provider_url || placement?.providerUrl || "",
    placement: provider
      ? {
          provider: provider.name,
          driver: provider.driver,
          key: placement?.provider_key || placement?.providerKey || "",
          cdn: Boolean(provider.capabilities?.cdn),
        }
      : null,
    createdAt: node.createdAt ?? node.created_at,
  };
}

// Phase 1. Picks a provider, reserves the bytes, creates the pending node and
// its reserved placement, and returns the ticket describing the transfer.
export async function beginUpload({
  namespace,
  path,
  size = 0,
  mimeType = "",
  require = [],
  overwrite = false,
  apiKeyId = null,
  createdBy = null,
  metadata = {},
}) {
  const supabase = filestoreClient();
  const { name } = splitPath(path);
  const excluded = [];
  let placement = null;
  let providerRow = null;

  for (let attempt = 0; attempt < MAX_PLACEMENT_ATTEMPTS; attempt += 1) {
    const resolved = await resolveProvider({
      size,
      mime: mimeType,
      namespaceKey: namespace.key,
      require,
      exclude: excluded,
    });

    if (!resolved.provider) {
      return { ok: false, code: resolved.code, error: resolved.error };
    }

    // Reserve first: if a concurrent upload just filled this provider the RPC
    // refuses and we spill to the next candidate.
    if (await reserveBytes(resolved.provider.id, size)) {
      providerRow = resolved.provider;
      break;
    }
    excluded.push(resolved.provider.id);
  }

  if (!providerRow) {
    return {
      ok: false,
      code: "pool_full",
      error: "Could not reserve space on any eligible provider.",
    };
  }

  let node;
  let replacedId;
  try {
    ({ node, replacedId } = await createFileNode({
      namespaceId: namespace.id,
      path,
      sizeBytes: size,
      mimeType,
      createdBy,
      overwrite,
      metadata,
    }));
  } catch (err) {
    await releaseBytes(providerRow.id, size);
    return { ok: false, code: "invalid_path", error: err.message };
  }

  // A replaced file's old bytes are no longer reachable; orphan the placement so
  // reconciliation can free them.
  if (replacedId) {
    const stale = await currentPlacements([replacedId]);
    await markPlacements(
      stale.map((item) => item.id),
      { is_current: false, state: "orphaned" }
    );
  }

  const objectKey = buildObjectKey({
    prefix: providerRow.config?.prefix,
    nodeId: node.id,
    filename: name,
  });

  let created;
  try {
    created = await driverFor(providerRow).createTicket(contextFor(providerRow), {
      key: objectKey,
      size,
      mime: mimeType,
      filename: name,
    });
  } catch (err) {
    await releaseBytes(providerRow.id, size);
    await supabase
      .from("nodes")
      .update({ status: "failed" })
      .eq("id", node.id);
    return { ok: false, code: "driver_error", error: err.message };
  }

  const { data: placementRow, error: placementError } = await supabase
    .from("placements")
    .insert({
      node_id: node.id,
      provider_id: providerRow.id,
      provider_key: created.providerKey || objectKey,
      size_bytes: size,
      state: "reserved",
      is_current: true,
    })
    .select("*")
    .single();

  if (placementError) {
    await releaseBytes(providerRow.id, size);
    return { ok: false, code: "placement_error", error: placementError.message };
  }
  placement = placementRow;

  const { data: upload, error: uploadError } = await supabase
    .from("uploads")
    .insert({
      namespace_id: namespace.id,
      node_id: node.id,
      provider_id: providerRow.id,
      placement_id: placement.id,
      api_key_id: apiKeyId,
      mode: created.mode,
      reserved_bytes: size,
      ticket: created.ticket,
      driver_state: created.driverState || {},
    })
    .select("id, expires_at")
    .single();

  if (uploadError) {
    await releaseBytes(providerRow.id, size);
    return { ok: false, code: "ticket_error", error: uploadError.message };
  }

  return {
    ok: true,
    uploadId: upload.id,
    expiresAt: upload.expires_at,
    mode: created.mode,
    ticket: created.ticket,
    node,
    objectKey,
    provider: { id: providerRow.id, name: providerRow.name, driver: providerRow.driver },
  };
}

// Phase 3. Finalizes with the driver, settles the ledger against the real size,
// and returns the file map.
export async function commitUpload({
  uploadId,
  parts = [],
  response = null,
  providerKey = null,
  origin = null,
}) {
  const supabase = filestoreClient();

  const { data: upload, error } = await supabase
    .from("uploads")
    .select("*")
    .eq("id", uploadId)
    .maybeSingle();

  if (error || !upload) return { ok: false, code: "not_found", error: "Unknown upload ticket." };
  if (upload.state !== "open") {
    return { ok: false, code: "already_settled", error: `This ticket is ${upload.state}.` };
  }

  const providerRow = await loadProviderRow(upload.provider_id);
  if (!providerRow) return { ok: false, code: "no_provider", error: "Provider is gone." };

  let result;
  try {
    result = await driverFor(providerRow).commit(contextFor(providerRow), {
      mode: upload.mode,
      driverState: upload.driver_state || {},
      providerKey: providerKey || upload.driver_state?.key,
      parts,
      response,
      size: Number(upload.reserved_bytes || 0),
    });
  } catch (err) {
    await failUpload(upload, providerRow, err.message);
    return { ok: false, code: "driver_error", error: err.message };
  }

  const actualSize = Number(result.size) || Number(upload.reserved_bytes || 0);
  await settleBytes(upload.provider_id, Number(upload.reserved_bytes || 0), actualSize);

  await supabase
    .from("placements")
    .update({
      provider_key: result.key,
      provider_url: result.url || "",
      size_bytes: actualSize,
      etag: result.etag,
      state: "committed",
    })
    .eq("id", upload.placement_id);

  const { data: node } = await supabase
    .from("nodes")
    .update({
      status: "ready",
      size_bytes: actualSize,
      ...(result.mime ? { mime_type: result.mime } : {}),
    })
    .eq("id", upload.node_id)
    .select("*")
    .single();

  await supabase.from("uploads").update({ state: "committed" }).eq("id", upload.id);
  await bumpNamespace(upload.namespace_id, actualSize, 1);

  const { data: namespace } = await supabase
    .from("namespaces")
    .select("key")
    .eq("id", upload.namespace_id)
    .maybeSingle();

  await logEvent({
    type: "upload",
    nodeId: upload.node_id,
    providerId: upload.provider_id,
    namespaceId: upload.namespace_id,
    apiKeyId: upload.api_key_id,
    bytes: actualSize,
    detail: { path: node?.path, mode: upload.mode },
  });

  return {
    ok: true,
    file: buildFileMap({
      node: normalizeNode(node),
      placement: { provider_url: result.url, provider_key: result.key },
      provider: providerRow,
      namespace,
      origin,
    }),
  };
}

async function failUpload(upload, providerRow, message) {
  const supabase = filestoreClient();

  await releaseBytes(upload.provider_id, Number(upload.reserved_bytes || 0));
  await supabase.from("uploads").update({ state: "aborted" }).eq("id", upload.id);
  await supabase
    .from("placements")
    .update({ state: "orphaned", is_current: false })
    .eq("id", upload.placement_id);
  await supabase.from("nodes").update({ status: "failed" }).eq("id", upload.node_id);

  // Multipart uploads leave server-side state behind; tell the provider to drop it.
  const driver = driverFor(providerRow);
  if (upload.mode === "multipart" && typeof driver.abort === "function") {
    await driver.abort(contextFor(providerRow), {
      key: upload.driver_state?.key,
      uploadId: upload.driver_state?.uploadId,
    });
  }

  await logEvent({
    type: "error",
    nodeId: upload.node_id,
    providerId: upload.provider_id,
    detail: { stage: "commit", message },
  });
}

// Server-side transfer for `proxy` mode and the ?direct=1 shortcut. Capped by
// the platform's request body limit, which is why the placement engine keeps
// maxObjectSize low on proxy-only providers.
export async function transferBytes({ uploadId, body, mime }) {
  const supabase = filestoreClient();

  const { data: upload } = await supabase
    .from("uploads")
    .select("*")
    .eq("id", uploadId)
    .maybeSingle();

  if (!upload || upload.state !== "open") {
    return { ok: false, error: "Unknown or settled upload ticket." };
  }

  const providerRow = await loadProviderRow(upload.provider_id);
  if (!providerRow) return { ok: false, error: "Provider is gone." };

  const { data: placement } = await supabase
    .from("placements")
    .select("provider_key")
    .eq("id", upload.placement_id)
    .maybeSingle();

  try {
    const stored = await driverFor(providerRow).receive(contextFor(providerRow), {
      key: placement?.provider_key,
      filename: placement?.provider_key?.split("/").pop() || "file",
      mime,
      body,
    });
    return { ok: true, stored };
  } catch (err) {
    await failUpload(upload, providerRow, err.message);
    return { ok: false, error: err.message };
  }
}

// Soft-delete a file, drop the object, and give the bytes back to the pool.
export async function deleteFile({ nodeId, apiKeyId = null }) {
  const supabase = filestoreClient();

  const { data: node } = await supabase
    .from("nodes")
    .select("*")
    .eq("id", nodeId)
    .is("deleted_at", null)
    .maybeSingle();

  if (!node) return { ok: false, error: "File not found." };

  const placements = await currentPlacements([nodeId]);

  for (const placement of placements) {
    if (placement.providers) {
      await deleteObject(placement.providers, placement.provider_key);
      await releaseBytes(placement.provider_id, Number(placement.size_bytes || 0));
    }
  }

  await markPlacements(
    placements.map((item) => item.id),
    { is_current: false, state: "orphaned" }
  );
  await supabase
    .from("nodes")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", nodeId);
  await bumpNamespace(node.namespace_id, -Number(node.size_bytes || 0), -1);

  await logEvent({
    type: "delete",
    nodeId,
    namespaceId: node.namespace_id,
    apiKeyId,
    bytes: Number(node.size_bytes || 0),
    detail: { path: node.path },
  });

  return { ok: true };
}

// Move a file's bytes to another provider. The node, its path and its gateway
// link are untouched — only the placement changes, which is the whole point of
// keeping them apart.
export async function migrateNode({ nodeId, targetProviderId }) {
  const supabase = filestoreClient();

  const { data: node } = await supabase
    .from("nodes")
    .select("*")
    .eq("id", nodeId)
    .is("deleted_at", null)
    .maybeSingle();

  if (!node) return { ok: false, error: "File not found." };

  const [current] = await currentPlacements([nodeId]);
  if (!current) return { ok: false, error: "File has no current placement." };
  if (current.provider_id === targetProviderId) {
    return { ok: false, error: "That file is already on this provider." };
  }

  const target = await loadProviderRow(targetProviderId);
  if (!target || target.status !== "active") {
    return { ok: false, error: "Target provider is not active." };
  }

  const size = Number(current.size_bytes || node.size_bytes || 0);
  if (!(await reserveBytes(targetProviderId, size))) {
    return { ok: false, error: "Target provider has no room for this file." };
  }

  try {
    const sourceUrl = current.provider_url;
    if (!sourceUrl) throw new Error("Source placement has no readable URL.");

    const response = await fetch(sourceUrl);
    if (!response.ok) throw new Error(`Could not read the source object (${response.status}).`);
    const body = Buffer.from(await response.arrayBuffer());

    const key = buildObjectKey({
      prefix: target.config?.prefix,
      nodeId: node.id,
      filename: node.name,
    });

    const stored = await driverFor(target).receive(contextFor(target), {
      key,
      filename: node.name,
      mime: node.mime_type,
      body,
    });

    await supabase
      .from("placements")
      .update({ is_current: false, state: "orphaned" })
      .eq("id", current.id);

    await supabase.from("placements").insert({
      node_id: nodeId,
      provider_id: targetProviderId,
      provider_key: stored.key,
      provider_url: stored.url,
      size_bytes: size,
      state: "committed",
      is_current: true,
    });

    if (current.providers) {
      await deleteObject(current.providers, current.provider_key);
      await releaseBytes(current.provider_id, size);
    }

    await logEvent({
      type: "migrate",
      nodeId,
      providerId: targetProviderId,
      namespaceId: node.namespace_id,
      bytes: size,
      detail: { from: current.provider_id, to: targetProviderId, path: node.path },
    });

    return { ok: true };
  } catch (err) {
    await releaseBytes(targetProviderId, size);
    console.error("[filestore.migrateNode]", err.message);
    return { ok: false, error: err.message };
  }
}
