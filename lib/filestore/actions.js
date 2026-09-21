"use server";

// Server actions for the storage admin surface. UI components call these; they
// never touch Supabase directly. Each action gates on a signed-in user, returns
// a plain `{ ok, ... }` result (the UI owns the toast), and revalidates the
// admin route when it mutates.

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/supabase/user/getUser";
import { filestoreClient } from "./service.js";
import { mergeSecrets, hasSecretKey } from "./crypto.js";
import { generateApiKey } from "./keys.js";
import { getDriver } from "./drivers/index.js";
import {
  probeProvider,
  reconcileAll,
  loadProviderRow,
  logEvent,
} from "./pool.js";
import { beginUpload, commitUpload, deleteFile, migrateNode } from "./uploads.js";
import { moveNode } from "./nodes.js";
import {
  normalizeProvider,
  normalizeNamespace,
  normalizeRule,
  getNodes,
} from "./queries.js";
import { normalizePath } from "./utils.js";

const ADMIN_PATH = "/admin/storage";

async function requireAuth() {
  const supabase = await createClient();
  const user = await getUser(supabase);
  if (!user) return { user: null, error: "You must be signed in." };
  return { user, error: null };
}

// ---------------------------------------------------------------------------
// Providers
// ---------------------------------------------------------------------------

export async function saveProviderAction(input = {}) {
  const { user, error: authError } = await requireAuth();
  if (authError) return { ok: false, error: authError };

  const {
    id,
    name,
    driver,
    priority,
    capacityBytes,
    config,
    capabilities,
    publicUrlTemplate,
    secrets,
    status,
  } = input;

  if (!name?.trim()) return { ok: false, error: "Give the provider a name." };
  if (!driver) return { ok: false, error: "Pick a driver." };

  try {
    getDriver(driver);
  } catch (err) {
    return { ok: false, error: err.message };
  }

  if (secrets && Object.keys(secrets).length > 0 && !hasSecretKey()) {
    return {
      ok: false,
      error:
        "STORAGE_SECRET_KEY is not set, so credentials cannot be stored safely.",
    };
  }

  const supabase = filestoreClient();
  const existing = id ? await loadProviderRow(id) : null;

  const patch = {
    name: name.trim(),
    driver,
    priority: Number(priority) || 100,
    capacity_bytes: Number(capacityBytes) || 0,
    config: config || {},
    capabilities: capabilities || {},
    public_url_template: publicUrlTemplate || "",
  };

  // Blank secret fields mean "leave that credential alone", so a masked form can
  // be resubmitted without wiping the stored values.
  if (secrets) patch.secrets = mergeSecrets(existing?.secrets, secrets);
  if (status) patch.status = status;

  if (id) {
    const { error } = await supabase.from("providers").update(patch).eq("id", id);
    if (error) {
      console.error("[filestore.saveProvider]", error.message);
      return { ok: false, error: error.message };
    }
    revalidatePath(ADMIN_PATH);
    return { ok: true, id };
  }

  const { data, error } = await supabase
    .from("providers")
    .insert({ ...patch, created_by: user.id })
    .select("*")
    .single();

  if (error) {
    console.error("[filestore.saveProvider]", error.message);
    return { ok: false, error: error.message };
  }

  revalidatePath(ADMIN_PATH);
  return { ok: true, id: data.id, provider: normalizeProvider(data) };
}

// Qualification: a real write -> read-back -> delete against the provider.
export async function testProviderAction(id) {
  const { error: authError } = await requireAuth();
  if (authError) return { ok: false, error: authError };

  const result = await probeProvider(id);
  revalidatePath(ADMIN_PATH);
  return result;
}

export async function setProviderStatusAction(id, status) {
  const { error: authError } = await requireAuth();
  if (authError) return { ok: false, error: authError };

  const { error } = await filestoreClient()
    .from("providers")
    .update({ status })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };
  revalidatePath(ADMIN_PATH);
  return { ok: true };
}

export async function reorderProvidersAction(order = []) {
  const { error: authError } = await requireAuth();
  if (authError) return { ok: false, error: authError };

  const supabase = filestoreClient();
  for (const [index, id] of order.entries()) {
    await supabase
      .from("providers")
      .update({ priority: (index + 1) * 10 })
      .eq("id", id);
  }

  revalidatePath(ADMIN_PATH);
  return { ok: true };
}

// A provider still holding objects is never removed silently — its files would
// become unreachable. Drain or migrate them first.
export async function deleteProviderAction(id) {
  const { error: authError } = await requireAuth();
  if (authError) return { ok: false, error: authError };

  const row = await loadProviderRow(id);
  if (!row) return { ok: false, error: "Provider not found." };
  if (Number(row.object_count) > 0) {
    return {
      ok: false,
      error: `This provider still holds ${row.object_count} object(s). Migrate them first.`,
    };
  }

  const { error } = await filestoreClient()
    .from("providers")
    .update({ deleted_at: new Date().toISOString(), status: "disabled" })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };
  revalidatePath(ADMIN_PATH);
  return { ok: true };
}

export async function reconcileAction() {
  const { error: authError } = await requireAuth();
  if (authError) return { ok: false, error: authError };

  const result = await reconcileAll();
  revalidatePath(ADMIN_PATH);
  return { ok: true, ...result };
}

// ---------------------------------------------------------------------------
// Namespaces & API keys
// ---------------------------------------------------------------------------

export async function createNamespaceAction({ key, name, project, quotaBytes }) {
  const { user, error: authError } = await requireAuth();
  if (authError) return { ok: false, error: authError };

  const slug = String(key || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!slug) return { ok: false, error: "Give the namespace a key." };

  const { data, error } = await filestoreClient()
    .from("namespaces")
    .insert({
      key: slug,
      name: name?.trim() || slug,
      project: project || "geiger-dash",
      quota_bytes: Number(quotaBytes) || 0,
      created_by: user.id,
    })
    .select("*")
    .single();

  if (error) {
    console.error("[filestore.createNamespace]", error.message);
    return { ok: false, error: error.message };
  }

  revalidatePath(ADMIN_PATH);
  return { ok: true, namespace: normalizeNamespace(data) };
}

export async function createApiKeyAction({ name, project, namespaceId, scopes }) {
  const { user, error: authError } = await requireAuth();
  if (authError) return { ok: false, error: authError };

  if (!name?.trim()) return { ok: false, error: "Give the key a name." };
  if (!namespaceId) return { ok: false, error: "Pick a namespace." };

  const { key, prefix, hash } = generateApiKey();
  const { error } = await filestoreClient().from("api_keys").insert({
    name: name.trim(),
    project: project || "geiger-flow",
    namespace_id: namespaceId,
    prefix,
    key_hash: hash,
    scopes: scopes?.length ? scopes : ["read", "write"],
    created_by: user.id,
  });

  if (error) {
    console.error("[filestore.createApiKey]", error.message);
    return { ok: false, error: error.message };
  }

  revalidatePath(ADMIN_PATH);
  // Shown in full exactly once, here.
  return { ok: true, key };
}

export async function revokeApiKeyAction(id) {
  const { error: authError } = await requireAuth();
  if (authError) return { ok: false, error: authError };

  const { error } = await filestoreClient()
    .from("api_keys")
    .update({ active: false })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };
  revalidatePath(ADMIN_PATH);
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Placement rules
// ---------------------------------------------------------------------------

export async function saveRuleAction(input = {}) {
  const { user, error: authError } = await requireAuth();
  if (authError) return { ok: false, error: authError };

  const { id, name, priority, enabled, match, target } = input;
  if (!name?.trim()) return { ok: false, error: "Give the rule a name." };

  const patch = {
    name: name.trim(),
    priority: Number(priority) || 100,
    enabled: enabled !== false,
    match: match || {},
    target: target || {},
  };

  const supabase = filestoreClient();
  if (id) {
    const { error } = await supabase.from("rules").update(patch).eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath(ADMIN_PATH);
    return { ok: true, id };
  }

  const { data, error } = await supabase
    .from("rules")
    .insert({ ...patch, created_by: user.id })
    .select("*")
    .single();

  if (error) return { ok: false, error: error.message };
  revalidatePath(ADMIN_PATH);
  return { ok: true, rule: normalizeRule(data) };
}

export async function deleteRuleAction(id) {
  const { error: authError } = await requireAuth();
  if (authError) return { ok: false, error: authError };

  const { error } = await filestoreClient()
    .from("rules")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };
  revalidatePath(ADMIN_PATH);
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Files
// ---------------------------------------------------------------------------

// Admin uploads follow the same reserve -> transfer -> commit path a suite app
// does, so what the browser exercises is the real pipeline.
export async function beginAdminUploadAction({
  namespaceId,
  path,
  size,
  mimeType,
  require,
  overwrite,
}) {
  const { user, error: authError } = await requireAuth();
  if (authError) return { ok: false, error: authError };

  const { data: namespace } = await filestoreClient()
    .from("namespaces")
    .select("*")
    .eq("id", namespaceId)
    .maybeSingle();

  if (!namespace) return { ok: false, error: "Namespace not found." };

  const result = await beginUpload({
    namespace: normalizeNamespace(namespace),
    path: normalizePath(path),
    size: Number(size) || 0,
    mimeType: mimeType || "application/octet-stream",
    require: require || [],
    overwrite: Boolean(overwrite),
    createdBy: user.id,
  });

  if (!result.ok) return { ok: false, error: result.error, code: result.code };

  return {
    ok: true,
    uploadId: result.uploadId,
    mode: result.mode,
    ticket:
      result.mode === "proxy"
        ? { ...result.ticket, url: `/api/storage/upload/${result.uploadId}/bytes` }
        : result.ticket,
    provider: result.provider,
  };
}

export async function commitAdminUploadAction({ uploadId, parts, response, providerKey }) {
  const { error: authError } = await requireAuth();
  if (authError) return { ok: false, error: authError };

  const result = await commitUpload({
    uploadId,
    parts: parts || [],
    response: response || null,
    providerKey: providerKey || null,
  });

  revalidatePath(ADMIN_PATH);
  return result.ok ? { ok: true, file: result.file } : { ok: false, error: result.error };
}

// The browser switching namespaces — one fetch, not a full page reload.
export async function listNodesAction(namespaceId) {
  const { error: authError } = await requireAuth();
  if (authError) return { ok: false, error: authError, nodes: [] };

  return { ok: true, nodes: await getNodes(namespaceId) };
}

export async function deleteNodeAction(nodeId) {
  const { error: authError } = await requireAuth();
  if (authError) return { ok: false, error: authError };

  const result = await deleteFile({ nodeId });
  revalidatePath(ADMIN_PATH);
  return result;
}

export async function migrateNodeAction({ nodeId, targetProviderId }) {
  const { error: authError } = await requireAuth();
  if (authError) return { ok: false, error: authError };

  const result = await migrateNode({ nodeId, targetProviderId });
  revalidatePath(ADMIN_PATH);
  return result;
}

export async function renameNodeAction({ namespaceId, nodeId, targetPath }) {
  const { error: authError } = await requireAuth();
  if (authError) return { ok: false, error: authError };

  try {
    await moveNode({ namespaceId, nodeId, targetPath: normalizePath(targetPath) });
    await logEvent({ type: "migrate", nodeId, detail: { renamedTo: targetPath } });
    revalidatePath(ADMIN_PATH);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}
