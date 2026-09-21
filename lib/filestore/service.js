// Service-role Supabase client scoped to the `filestore` schema.
//
// Server-only. Every read/write to filestore.* goes through this client because
// the tables carry RLS with no policies — provider secrets and API key hashes
// must never be reachable from a browser client. Never import this into a
// Client Component.

import { createClient } from "@supabase/supabase-js";

let cached = null;

export function filestoreClient() {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Filestore client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  cached = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    db: { schema: "filestore" },
  });

  return cached;
}

export function isFilestoreConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}
