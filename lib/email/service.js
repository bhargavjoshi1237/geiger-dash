// Service-role Supabase client scoped to the `email` schema.
//
// Server-only. Uses the service role key so it bypasses RLS — every read/write
// to email.* tables goes through this client. Never import it into a Client
// Component.

import { createClient } from "@supabase/supabase-js";

let cached = null;

export function emailServiceClient() {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Email service client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  cached = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    db: { schema: "email" },
  });

  return cached;
}
