// The virtual tree: folders and files as rows, independent of where any bytes
// physically live. Nothing in here ever talks to a provider — deleting a folder
// is a database operation; freeing the bytes behind it is pool.js's job, driven
// from the placements those nodes point at.

import { filestoreClient } from "./service.js";
import { normalizeNode } from "./queries.js";
import { splitPath, normalizePath } from "./utils.js";

// Walk a path, creating the folder nodes that don't exist yet. Returns the id of
// the folder the leaf belongs in (null at the root).
export async function ensureFolderPath(namespaceId, segments, createdBy = null) {
  const supabase = filestoreClient();
  let parentId = null;
  let walked = "";

  for (const segment of segments) {
    walked += `/${segment}`;

    const { data: existing } = await supabase
      .from("nodes")
      .select("id")
      .eq("namespace_id", namespaceId)
      .eq("path", walked)
      .is("deleted_at", null)
      .maybeSingle();

    if (existing) {
      parentId = existing.id;
      continue;
    }

    const { data: created, error } = await supabase
      .from("nodes")
      .insert({
        namespace_id: namespaceId,
        parent_id: parentId,
        kind: "folder",
        name: segment,
        path: walked,
        status: "ready",
        created_by: createdBy,
      })
      .select("id")
      .single();

    // A concurrent upload may have created the same folder between our read and
    // our insert; re-read rather than failing the upload.
    if (error) {
      const { data: raced } = await supabase
        .from("nodes")
        .select("id")
        .eq("namespace_id", namespaceId)
        .eq("path", walked)
        .is("deleted_at", null)
        .maybeSingle();

      if (!raced) throw new Error(`Could not create folder ${walked}: ${error.message}`);
      parentId = raced.id;
      continue;
    }

    parentId = created.id;
  }

  return parentId;
}

export async function createFolder({ namespaceId, path, createdBy = null }) {
  const { segments } = splitPath(path);
  if (segments.length === 0) throw new Error("A folder needs a path.");

  const parentId = await ensureFolderPath(namespaceId, segments, createdBy);
  const { data, error } = await filestoreClient()
    .from("nodes")
    .select("*")
    .eq("id", parentId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return normalizeNode(data);
}

// The file row is created up front in `pending` state so the tree is consistent
// while the client is still transferring bytes; commit flips it to `ready`.
export async function createFileNode({
  namespaceId,
  path,
  sizeBytes = 0,
  mimeType = "",
  createdBy = null,
  overwrite = false,
  metadata = {},
}) {
  const supabase = filestoreClient();
  const { path: fullPath, name, parentSegments } = splitPath(path);
  if (!name) throw new Error("A file needs a path.");

  const { data: existing } = await supabase
    .from("nodes")
    .select("id, kind")
    .eq("namespace_id", namespaceId)
    .eq("path", fullPath)
    .is("deleted_at", null)
    .maybeSingle();

  if (existing && !overwrite) {
    throw new Error(`${fullPath} already exists. Pass overwrite to replace it.`);
  }
  if (existing) {
    // Replacing: retire the old row so the unique path index stays free. Its
    // placement is orphaned by the caller, which knows the provider.
    await supabase
      .from("nodes")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", existing.id);
  }

  const parentId = await ensureFolderPath(namespaceId, parentSegments, createdBy);

  const { data, error } = await supabase
    .from("nodes")
    .insert({
      namespace_id: namespaceId,
      parent_id: parentId,
      kind: "file",
      name,
      path: fullPath,
      size_bytes: sizeBytes,
      mime_type: mimeType,
      status: "pending",
      metadata,
      created_by: createdBy,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return { node: normalizeNode(data), replacedId: existing?.id || null };
}

// Every node at or below a path — what a folder delete has to act on.
export async function listSubtree(namespaceId, path) {
  const prefix = normalizePath(path);
  const { data, error } = await filestoreClient()
    .from("nodes")
    .select("id, kind, path, size_bytes, namespace_id")
    .eq("namespace_id", namespaceId)
    .is("deleted_at", null)
    .or(`path.eq.${prefix},path.like.${prefix}/%`);

  if (error) {
    console.error("[filestore.listSubtree]", error.message);
    return [];
  }
  return data || [];
}

export async function softDeleteNodes(ids) {
  if (!ids.length) return;

  const { error } = await filestoreClient()
    .from("nodes")
    .update({ deleted_at: new Date().toISOString() })
    .in("id", ids);

  if (error) throw new Error(error.message);
}

// The current placement rows for a set of nodes, with the provider row attached
// so the caller can delete the objects and release the bytes.
export async function currentPlacements(nodeIds) {
  if (!nodeIds.length) return [];

  const { data, error } = await filestoreClient()
    .from("placements")
    .select("*, providers(*)")
    .in("node_id", nodeIds)
    .eq("is_current", true);

  if (error) {
    console.error("[filestore.currentPlacements]", error.message);
    return [];
  }
  return data || [];
}

export async function markPlacements(ids, patch) {
  if (!ids.length) return;

  const { error } = await filestoreClient().from("placements").update(patch).in("id", ids);
  if (error) console.error("[filestore.markPlacements]", error.message);
}

// Rename/move within the tree. Descendant paths are rewritten because `path` is
// materialized, which is the cost of making lookups a single indexed equality.
export async function moveNode({ namespaceId, nodeId, targetPath }) {
  const supabase = filestoreClient();
  const { data: node, error } = await supabase
    .from("nodes")
    .select("*")
    .eq("id", nodeId)
    .maybeSingle();

  if (error || !node) throw new Error("Node not found.");

  const { path: nextPath, name, parentSegments } = splitPath(targetPath);
  const parentId = await ensureFolderPath(namespaceId, parentSegments, node.created_by);
  const descendants = node.kind === "folder" ? await listSubtree(namespaceId, node.path) : [];

  const { error: updateError } = await supabase
    .from("nodes")
    .update({ path: nextPath, name, parent_id: parentId })
    .eq("id", nodeId);

  if (updateError) throw new Error(updateError.message);

  for (const child of descendants) {
    if (child.id === nodeId) continue;
    await supabase
      .from("nodes")
      .update({ path: `${nextPath}${child.path.slice(node.path.length)}` })
      .eq("id", child.id);
  }

  return true;
}
