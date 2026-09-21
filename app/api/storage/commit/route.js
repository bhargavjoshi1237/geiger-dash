// Storage upload API — phase 3. Finalizes a transfer and returns the file map.
//
//   POST /api/storage/commit
//   Authorization: Bearer gs_live_xxx
//   {
//     "uploadId": "…",
//     "providerKey": "<uuid>",        // form-post mode: the key the provider returned
//     "response": { "file": "<uuid>" },// or the provider's raw JSON response
//     "parts": [{ "partNumber": 1, "etag": "\"abc\"" }]  // multipart mode
//   }
//
// Returns the file map: logical path, stable gateway link, raw CDN link, and
// which provider physically holds the bytes.

import { authorize } from "@/lib/filestore/auth";
import { commitUpload } from "@/lib/filestore/uploads";
import { requestOrigin } from "@/lib/filestore/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  const { response: denied } = await authorize(request, "write");
  if (denied) return denied;

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { uploadId, parts, response, providerKey } = body || {};
  if (!uploadId) {
    return Response.json({ error: "`uploadId` is required." }, { status: 400 });
  }

  const result = await commitUpload({
    uploadId,
    parts: Array.isArray(parts) ? parts : [],
    response: response || null,
    providerKey: providerKey || null,
    origin: requestOrigin(request),
  });

  if (!result.ok) {
    const status = result.code === "not_found" ? 404 : 502;
    return Response.json({ error: result.error, code: result.code }, { status });
  }

  return Response.json(result.file, { status: 201 });
}
