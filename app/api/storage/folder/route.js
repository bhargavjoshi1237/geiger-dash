// Create a folder in the calling namespace's tree.
//
//   POST /api/storage/folder   { "path": "/covers/2026" }
//
// Folders are rows, not objects — no provider is touched. Uploads create their
// parent folders implicitly, so this only exists for apps that want to lay out
// an empty tree up front.

import { authorize } from "@/lib/filestore/auth";
import { createFolder } from "@/lib/filestore/nodes";
import { normalizePath } from "@/lib/filestore/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  const { auth, response } = await authorize(request, "write");
  if (response) return response;

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const path = normalizePath(body?.path || "");
  if (path === "/") {
    return Response.json({ error: "`path` is required." }, { status: 400 });
  }

  try {
    const folder = await createFolder({ namespaceId: auth.namespace.id, path });
    return Response.json(
      { id: folder.id, path: folder.path, name: folder.name, kind: "folder" },
      { status: 201 }
    );
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}
