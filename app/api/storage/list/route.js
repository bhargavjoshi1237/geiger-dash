// Folder listing for the calling namespace.
//
//   GET /api/storage/list?path=/covers
//   GET /api/storage/list?path=/covers&recursive=1&cursor=0&limit=500
//
// Without recursive the route returns the immediate children of `path` — the
// simple tree a consumer app renders — with each file's physical placement
// attached, since that is the thing callers cannot work out for themselves.
// With recursive=1 it returns every descendant at or below `path`, ordered by
// path and paged with cursor/limit, so a caller can walk a whole subtree
// without loading it in one request.

import { authorize } from "@/lib/filestore/auth";
import { filestoreClient } from "@/lib/filestore/service";
import { normalizeNode } from "@/lib/filestore/queries";
import { normalizePath, requestOrigin } from "@/lib/filestore/utils";
import { buildFileMap } from "@/lib/filestore/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  const { auth, response } = await authorize(request, "read");
  if (response) return response;

  const url = new URL(request.url);
  const path = normalizePath(url.searchParams.get("path") || "/");
  const recursive = url.searchParams.get("recursive") === "1";
  const supabase = filestoreClient();
  const origin = requestOrigin(request);

  if (recursive) {
    const cursor = Math.max(0, Number(url.searchParams.get("cursor") || 0) || 0);
    const limit = Math.min(
      1000,
      Math.max(1, Number(url.searchParams.get("limit") || 500) || 500)
    );

    let query = supabase
      .from("nodes")
      .select(
        "*, placements(id, provider_id, provider_key, provider_url, state, size_bytes, is_current, providers(name, driver, capabilities))"
      )
      .eq("namespace_id", auth.namespace.id)
      .is("deleted_at", null)
      .order("path", { ascending: true })
      .range(cursor, cursor + limit);

    if (path !== "/") {
      query = query.or(`path.eq.${path},path.like.${path}/*`);
    }

    const { data, error } = await query;
    if (error) {
      console.error("[filestore.list]", error.message);
      return Response.json({ error: "Could not list this folder." }, { status: 500 });
    }

    const rows = data || [];
    const truncated = rows.length > limit;
    const page = truncated ? rows.slice(0, limit) : rows;

    return Response.json({
      path,
      namespace: auth.namespace.key,
      entries: page.map((row) => toEntry(row, auth.namespace, origin)),
      nextCursor: truncated ? cursor + limit : null,
      truncated,
    });
  }

  let parentId = null;
  if (path !== "/") {
    const { data: parent } = await supabase
      .from("nodes")
      .select("id, kind")
      .eq("namespace_id", auth.namespace.id)
      .eq("path", path)
      .is("deleted_at", null)
      .maybeSingle();

    if (!parent || parent.kind !== "folder") {
      return Response.json({ error: "Folder not found." }, { status: 404 });
    }
    parentId = parent.id;
  }

  let query = supabase
    .from("nodes")
    .select(
      "*, placements(id, provider_id, provider_key, provider_url, state, size_bytes, is_current, providers(name, driver, capabilities))"
    )
    .eq("namespace_id", auth.namespace.id)
    .is("deleted_at", null)
    .order("kind", { ascending: true })
    .order("name", { ascending: true });

  query = parentId ? query.eq("parent_id", parentId) : query.is("parent_id", null);

  const { data, error } = await query;
  if (error) {
    console.error("[filestore.list]", error.message);
    return Response.json({ error: "Could not list this folder." }, { status: 500 });
  }

  const entries = (data || []).map((row) => toEntry(row, auth.namespace, origin));

  return Response.json({ path, namespace: auth.namespace.key, entries });
}

function toEntry(row, namespace, origin) {
  const node = normalizeNode(row);
  if (node.kind === "folder") {
    return { id: node.id, kind: "folder", name: node.name, path: node.path };
  }

  return {
    kind: "file",
    ...buildFileMap({
      node,
      placement: {
        provider_url: node.placement?.providerUrl,
        provider_key: node.placement?.providerKey,
      },
      provider: node.placement
        ? {
            name: node.placement.providerName,
            driver: node.placement.driver,
            capabilities: row.placements?.find((p) => p.is_current)?.providers
              ?.capabilities,
          }
        : null,
      namespace,
      origin,
    }),
  };
}
