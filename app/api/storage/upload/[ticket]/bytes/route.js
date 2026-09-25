// Proxy-mode transfer. Providers whose credentials cannot be exposed to a
// client and that cannot presign (Supabase Storage, Vercel Blob) hand the caller
// a ticket pointing here; we forward the bytes on their behalf.
//
//   POST /api/storage/upload/<uploadId>/bytes
//   Content-Type: <the file's type>
//   <raw body>
//
// The ticket id IS the authorization: it is an unguessable uuid, single-use,
// expiring, and bound to one node and one reservation — and an API key was
// already required to mint it. That keeps this route identical for a suite app
// following a ticket and for the admin browser uploading a file.
//
// Subject to the platform's ~4.5 MB request body limit, which is why the
// placement engine keeps maxObjectSize low on proxy-only providers.

import { transferBytes } from "@/lib/filestore/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "600",
};

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request, { params }) {
  const { ticket } = await params;
  const contentType = request.headers.get("content-type") || "";

  let body;
  let mime = contentType;

  if (contentType.startsWith("multipart/form-data")) {
    const form = await request.formData();
    const file = form.get("file");
    if (!file || typeof file === "string") {
      return Response.json({ error: "`file` is required." }, { status: 400, headers: CORS_HEADERS });
    }
    body = Buffer.from(await file.arrayBuffer());
    mime = file.type || "application/octet-stream";
  } else {
    body = Buffer.from(await request.arrayBuffer());
  }

  if (!body?.byteLength) {
    return Response.json({ error: "Empty request body." }, { status: 400, headers: CORS_HEADERS });
  }

  const result = await transferBytes({ uploadId: ticket, body, mime });
  if (!result.ok) return Response.json({ error: result.error }, { status: 502, headers: CORS_HEADERS });

  return Response.json({
    ok: true,
    uploadId: ticket,
    providerKey: result.stored.key,
  }, { headers: CORS_HEADERS });
}
