// Storage object metadata — the read-side lookup behind headObject(key).
//
//   GET /api/storage/stat?id=<node uuid>
//   GET /api/storage/stat?path=/logical/path
//   Authorization: Bearer gs_live_xxx   (scope: read)
//
// Resolves within the caller's namespace only; a path or id in another
// namespace 404s exactly as if it did not exist. Folders 404 — this is the
// authoritative size/mime lookup for file objects, used by commitUpload and
// the delivery routes.

import { authorize } from "@/lib/filestore/auth";
import { filestoreClient } from "@/lib/filestore/service";
import { loadProviderRow } from "@/lib/filestore/pool";
import { buildFileMap } from "@/lib/filestore/uploads";
import { normalizePath, requestOrigin } from "@/lib/filestore/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  const { auth, response } = await authorize(request, "read");
  if (response) return response;

  const url = new URL(request.url);
  const id = url.searchParams.get("id")?.trim() || "";
  const rawPath = url.searchParams.get("path")?.trim() || "";

  if (!id && !rawPath) {
    return Response.json({ error: "`id` or `path` is required." }, { status: 400 });
  }

  const supabase = filestoreClient();
  let node = null;

  if (id) {
    const { data } = await supabase
      .from("nodes")
      .select("*")
      .eq("id", id)
      .is("deleted_at", null)
      .maybeSingle();
    if (!data || data.namespace_id !== auth.namespace.id) {
      return Response.json({ error: "Not found." }, { status: 404 });
    }
    node = data;
  } else {
    const path = normalizePath(rawPath);
    const { data } = await supabase
      .from("nodes")
      .select("*")
      .eq("namespace_id", auth.namespace.id)
      .eq("path", path)
      .is("deleted_at", null)
      .maybeSingle();
    if (!data) {
      return Response.json({ error: "Not found." }, { status: 404 });
    }
    node = data;
  }

  if (!node || node.kind !== "file") {
    return Response.json({ error: "Not found." }, { status: 404 });
  }

  const { data: placement } = await supabase
    .from("placements")
    .select("provider_id, provider_key, provider_url, size_bytes, etag, state")
    .eq("node_id", node.id)
    .eq("is_current", true)
    .maybeSingle();

  const providerRow = placement ? await loadProviderRow(placement.provider_id) : null;
  const origin = requestOrigin(request);

  const file = buildFileMap({
    node: {
      id: node.id,
      path: node.path,
      name: node.name,
      sizeBytes: Number(node.size_bytes ?? 0),
      mimeType: node.mime_type ?? "",
      status: node.status,
      createdAt: node.created_at,
    },
    placement: placement
      ? { provider_url: placement.provider_url, provider_key: placement.provider_key }
      : null,
    provider: providerRow,
    namespace: auth.namespace,
    origin,
  });

  return Response.json({
    ...file,
    etag: placement?.etag ?? null,
  });
}
