// Storage upload API — phase 1 of reserve -> transfer -> commit.
//
// Other suite apps (geiger-flow, geiger-notes, ...) call this instead of running
// their own storage stack. geiger-dash owns the provider pool, the capacity
// ledger, and the virtual tree.
//
//   POST /api/storage/upload
//   Authorization: Bearer gs_live_xxx        (or x-api-key: gs_live_xxx)
//   Content-Type: application/json
//   {
//     "path": "/covers/2026/cat.png",
//     "size": 27796904,
//     "mimeType": "image/png",
//     "require": ["cdn"],          // only land on CDN-backed providers
//     "overwrite": false
//   }
//
// Returns 200 { uploadId, mode, ticket, … }. The ticket says exactly how to
// transfer the bytes — straight to the provider, so there is no request-size
// ceiling — then POST /api/storage/commit with the uploadId.
//
// For small server-side uploads, POST the file itself to
// /api/storage/upload?direct=1 as multipart/form-data and all three phases run
// in one request (subject to the platform's ~4.5 MB body limit).

import { authorize } from "@/lib/filestore/auth";
import { beginUpload, commitUpload, transferBytes } from "@/lib/filestore/uploads";
import { normalizePath, requestOrigin } from "@/lib/filestore/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PLACEMENT_FAILURES = {
  no_providers: 503,
  no_capability: 507,
  pool_full: 507,
  object_too_large: 413,
  invalid_path: 409,
};

export async function POST(request) {
  const { auth, response } = await authorize(request, "write");
  if (response) return response;

  const direct = new URL(request.url).searchParams.get("direct") === "1";
  return direct
    ? handleDirect(request, auth)
    : handleTicket(request, auth);
}

async function handleTicket(request, auth) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { path, size, mimeType, require, overwrite, metadata } = body || {};
  if (!path) return Response.json({ error: "`path` is required." }, { status: 400 });

  const bytes = Number(size);
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return Response.json(
      { error: "`size` in bytes is required so the pool can reserve space." },
      { status: 400 }
    );
  }

  const result = await beginUpload({
    namespace: auth.namespace,
    path: normalizePath(path),
    size: bytes,
    mimeType: mimeType || "application/octet-stream",
    require: Array.isArray(require) ? require : [],
    overwrite: Boolean(overwrite),
    apiKeyId: auth.key.id,
    metadata: metadata || {},
  });

  if (!result.ok) {
    return Response.json(
      { error: result.error, code: result.code },
      { status: PLACEMENT_FAILURES[result.code] || 500 }
    );
  }

  // A proxy ticket only knows where to send bytes once the ticket id exists.
  const origin = requestOrigin(request);
  const ticket =
    result.mode === "proxy"
      ? { ...result.ticket, url: `${origin}/api/storage/upload/${result.uploadId}/bytes` }
      : result.ticket;

  return Response.json({
    uploadId: result.uploadId,
    expiresAt: result.expiresAt,
    mode: result.mode,
    ticket,
    file: {
      id: result.node.id,
      path: result.node.path,
      status: result.node.status,
    },
    provider: result.provider,
    commitUrl: `${origin}/api/storage/commit`,
  });
}

// One-call convenience for small files: reserve, push the bytes through us, and
// commit, returning the same file map the three-step flow ends with.
async function handleDirect(request, auth) {
  let form;
  try {
    form = await request.formData();
  } catch {
    return Response.json(
      { error: "Expected multipart/form-data with a `file` field." },
      { status: 400 }
    );
  }

  const file = form.get("file");
  if (!file || typeof file === "string") {
    return Response.json({ error: "`file` is required." }, { status: 400 });
  }

  const path = normalizePath(form.get("path") || `/${file.name}`);
  const requireRaw = form.get("require");
  const buffer = Buffer.from(await file.arrayBuffer());

  const started = await beginUpload({
    namespace: auth.namespace,
    path,
    size: buffer.byteLength,
    mimeType: file.type || "application/octet-stream",
    require: requireRaw ? String(requireRaw).split(",").map((s) => s.trim()) : [],
    overwrite: form.get("overwrite") === "true",
    apiKeyId: auth.key.id,
  });

  if (!started.ok) {
    return Response.json(
      { error: started.error, code: started.code },
      { status: PLACEMENT_FAILURES[started.code] || 500 }
    );
  }

  const transferred = await transferBytes({
    uploadId: started.uploadId,
    body: buffer,
    mime: file.type,
  });

  if (!transferred.ok) {
    return Response.json({ error: transferred.error }, { status: 502 });
  }

  const committed = await commitUpload({
    uploadId: started.uploadId,
    providerKey: transferred.stored.key,
    response: transferred.stored,
    origin: requestOrigin(request),
  });

  if (!committed.ok) {
    return Response.json({ error: committed.error, code: committed.code }, { status: 502 });
  }

  return Response.json(committed.file, { status: 201 });
}
