// Verifies an inbound API key for the storage API, and resolves the namespace
// it is scoped to. A key can only ever see its own namespace's tree.

import { filestoreClient } from "./service.js";
import { hashApiKey } from "./keys.js";
import { normalizeNamespace } from "./queries.js";

export function extractApiKey(request) {
  const auth = request.headers.get("authorization");
  if (auth && auth.toLowerCase().startsWith("bearer ")) {
    return auth.slice(7).trim();
  }
  return request.headers.get("x-api-key")?.trim() || null;
}

// Returns { key, namespace } for a valid key, or null. Touches last_used_at
// (best-effort) so the admin surface can show dormant keys.
export async function verifyApiKey(rawKey) {
  if (!rawKey) return null;

  const supabase = filestoreClient();
  const { data, error } = await supabase
    .from("api_keys")
    .select("id, name, project, scopes, active, namespace_id, namespaces(*)")
    .eq("key_hash", hashApiKey(rawKey))
    .eq("active", true)
    .maybeSingle();

  if (error || !data) return null;

  await supabase
    .from("api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", data.id);

  return {
    key: {
      id: data.id,
      name: data.name,
      project: data.project,
      scopes: data.scopes || [],
    },
    namespace: normalizeNamespace(data.namespaces),
  };
}

export function hasScope(auth, scope) {
  return (auth?.key?.scopes || []).includes(scope);
}

// Every route starts the same way: authenticate, then check the one scope it
// needs. Returns a Response to return directly, or null to continue.
export async function authorize(request, scope) {
  const auth = await verifyApiKey(extractApiKey(request));

  if (!auth) {
    return {
      auth: null,
      response: Response.json(
        { error: "Invalid or missing API key." },
        { status: 401 }
      ),
    };
  }

  if (!auth.namespace) {
    return {
      auth: null,
      response: Response.json(
        { error: "This key is not scoped to a namespace." },
        { status: 403 }
      ),
    };
  }

  if (scope && !hasScope(auth, scope)) {
    return {
      auth: null,
      response: Response.json(
        { error: `This key lacks the "${scope}" scope.` },
        { status: 403 }
      ),
    };
  }

  return { auth, response: null };
}
