// The gateway. Every file map hands back a link to this route rather than the
// provider's own URL, so a file can be migrated between providers without any
// published link breaking.
//
//   GET    /api/storage/f/<id>   302 -> the current placement's URL
//   DELETE /api/storage/f/<id>   remove the file and return its bytes to the pool
//
// GET is unauthenticated on purpose: these links are embedded in <img> tags and
// shared documents across the suite, and knowledge of the uuid is the capability.
// Objects on providers marked non-public are redirected to a short-lived signed
// URL instead of a permanent one.

import { filestoreClient } from "@/lib/filestore/service";
import { loadProviderRow } from "@/lib/filestore/pool";
import { resolveReadUrl } from "@/lib/filestore/drivers";
import { authorize } from "@/lib/filestore/auth";
import { deleteFile } from "@/lib/filestore/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const { id } = await params;
  const supabase = filestoreClient();

  const { data: node } = await supabase
    .from("nodes")
    .select("id, kind, status, mime_type")
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  if (!node || node.kind !== "file") {
    return Response.json({ error: "Not found." }, { status: 404 });
  }
  if (node.status !== "ready") {
    return Response.json({ error: "This file is still uploading." }, { status: 409 });
  }

  const { data: placement } = await supabase
    .from("placements")
    .select("provider_id, provider_key, provider_url")
    .eq("node_id", id)
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

  // Signed URLs expire, so those must not be cached as long as public ones.
  const isSigned = providerRow.capabilities?.publicRead === false;
  return new Response(null, {
    status: 302,
    headers: {
      Location: target,
      "Cache-Control": isSigned
        ? "private, max-age=60"
        : "public, max-age=300, s-maxage=3600",
    },
  });
}

export async function DELETE(request, { params }) {
  const { auth, response } = await authorize(request, "delete");
  if (response) return response;

  const { id } = await params;
  const supabase = filestoreClient();

  const { data: node } = await supabase
    .from("nodes")
    .select("id, namespace_id")
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  if (!node) return Response.json({ error: "Not found." }, { status: 404 });
  if (node.namespace_id !== auth.namespace.id) {
    return Response.json({ error: "Not found." }, { status: 404 });
  }

  const result = await deleteFile({ nodeId: id, apiKeyId: auth.key.id });
  if (!result.ok) return Response.json({ error: result.error }, { status: 500 });

  return Response.json({ ok: true, id });
}
