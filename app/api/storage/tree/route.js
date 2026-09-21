// Storage subtree delete — the server-side behind deleteObjectsByPrefix.
//
//   DELETE /api/storage/tree
//   Authorization: Bearer gs_live_xxx   (scope: delete)
//   { "prefix": "/p/<projectId>/a/<assetId>" }
//
// Soft-deletes every node at or below the prefix, removes each file object
// from its provider, and releases the bytes. Capped at 1000 nodes per call;
// when more remain the caller loops with the same prefix until
// truncated is false.

import { authorize } from "@/lib/filestore/auth";
import { listSubtree, softDeleteNodes } from "@/lib/filestore/nodes";
import { deleteFile } from "@/lib/filestore/uploads";
import { normalizePath } from "@/lib/filestore/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_NODES = 1000;

export async function DELETE(request) {
  const { auth, response } = await authorize(request, "delete");
  if (response) return response;

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const raw = body?.prefix ?? body?.path ?? "";
  if (!raw) {
    return Response.json({ error: "`prefix` is required." }, { status: 400 });
  }
  const prefix = normalizePath(raw);

  const subtree = await listSubtree(auth.namespace.id, prefix);
  const truncated = subtree.length > MAX_NODES;
  const batch = truncated ? subtree.slice(0, MAX_NODES) : subtree;

  const files = batch.filter((item) => item.kind === "file");
  const folders = batch.filter((item) => item.kind !== "file");

  let bytes = 0;
  for (const file of files) {
    bytes += Number(file.size_bytes ?? 0);
    const result = await deleteFile({ nodeId: file.id, apiKeyId: auth.key.id });
    if (!result.ok) {
      console.error("[filestore.tree] delete failed:", file.path, result.error);
    }
  }

  if (folders.length) {
    await softDeleteNodes(folders.map((item) => item.id));
  }

  return Response.json({
    deleted: batch.length,
    bytes,
    truncated,
  });
}
