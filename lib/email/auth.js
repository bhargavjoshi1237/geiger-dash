// Verifies an inbound API key for the send API.

import { emailServiceClient } from "./service.js";
import { hashApiKey } from "./keys.js";

// Pull a bearer token out of an Authorization header (or x-api-key).
export function extractApiKey(request) {
  const auth = request.headers.get("authorization");
  if (auth && auth.toLowerCase().startsWith("bearer ")) {
    return auth.slice(7).trim();
  }
  return request.headers.get("x-api-key")?.trim() || null;
}

// Returns the active api_keys row for a valid key, or null. Touches
// last_used_at on success (best-effort).
export async function verifyApiKey(rawKey) {
  if (!rawKey) return null;

  const supabase = emailServiceClient();
  const { data, error } = await supabase
    .from("api_keys")
    .select("id, name, project, active")
    .eq("key_hash", hashApiKey(rawKey))
    .eq("active", true)
    .maybeSingle();

  if (error || !data) return null;

  await supabase
    .from("api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", data.id);

  return data;
}
