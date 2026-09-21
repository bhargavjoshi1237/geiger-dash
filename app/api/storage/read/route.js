// Storage byte gateway for server-side callers.
//
//   GET /api/storage/read?id=<node uuid>
//   GET /api/storage/read?path=/logical/path
//   Authorization: Bearer gs_live_xxx   (scope: read)
//
// Streams the object's bytes back through dash rather than redirecting, so
// callers that need bytes in the function (ZIP export, derivative generation)
// and <video> scrubbing (Range requests) work without exposing credentials.
// Callers that only need a browsable link keep using /api/storage/f/<id>.
//
// The Range request header is forwarded to the provider and Content-Range,
// Content-Length, Content-Type, ETag, Accept-Ranges plus the upstream status
// (200 or 206) are passed through.

import { authorize } from "@/lib/filestore/auth";
import { filestoreClient } from "@/lib/filestore/service";
import { loadProviderRow } from "@/lib/filestore/pool";
import { resolveReadUrl } from "@/lib/filestore/drivers";
import { normalizePath } from "@/lib/filestore/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PASSTHROUGH = ["content-range", "content-length", "content-type", "etag", "accept-ranges"];

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
      .select("id, kind, status, mime_type, namespace_id")
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
      .select("id, kind, status, mime_type, namespace_id")
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
  if (node.status !== "ready") {
    return Response.json({ error: "This file is still uploading." }, { status: 409 });
  }

  const { data: placement } = await supabase
    .from("placements")
    .select("provider_id, provider_key, provider_url")
    .eq("node_id", node.id)
    .eq("is_current", true)
    .maybeSingle();

  if (!placement) {
    return Response.json({ error: "This file has no current placement." }, { status: 410 });
  }

  const providerRow = await loadProviderRow(placement.provider_id);
  if (!providerRow) {
    return Response.json({ error: "Provider unavailable." }, { status: 503 });
  }

  const target = await resolveReadUrl(
    {
      driver: providerRow.driver,
      config: providerRow.config,
      secretsEnvelope: providerRow.secrets,
      capabilities: providerRow.capabilities,
      publicUrlTemplate: providerRow.public_url_template,
    },
    placement.provider_key,
    placement.provider_url
  );

  if (!target) {
    return Response.json({ error: "Could not resolve a readable URL." }, { status: 502 });
  }

  const headers = {};
  const range = request.headers.get("range");
  if (range) headers.range = range;

  let upstream;
  try {
    upstream = await fetch(target, { headers });
  } catch (err) {
    console.error("[filestore.read] provider fetch failed:", err.message);
    return Response.json({ error: "Could not read the object." }, { status: 502 });
  }

  if (upstream.status !== 200 && upstream.status !== 206) {
    return Response.json(
      { error: `Provider returned ${upstream.status}.` },
      { status: 502 }
    );
  }

  const out = {};
  for (const name of PASSTHROUGH) {
    const value = upstream.headers.get(name);
    if (value !== null) out[name] = value;
  }
  if (!out["content-type"] && node.mime_type) out["content-type"] = node.mime_type;
  out["cache-control"] = "private, max-age=60";

  return new Response(upstream.body, { status: upstream.status, headers: out });
}
