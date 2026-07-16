"use server";

import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/supabase/user/getUser";
import { startTrial } from "@/lib/billing/store";

// Starts a cardless 15-day Basic trial for the signed-in user, applied to the
// chosen organization. No Stripe involved. Returns { ok } on success or { error }
// the client maps to a toast/redirect.
export async function startTrialAction({ organizationId } = {}) {
  const supabase = await createClient();
  const user = await getUser(supabase);
  if (!user) return { error: "auth" };
  if (!organizationId) return { error: "invalid_org" };

  // Prove membership via the user's own (RLS-scoped) client — a returned row
  // means the user belongs to the org.
  const { data: org } = await supabase
    .from("organizations")
    .select("id")
    .eq("id", organizationId)
    .is("deleted_at", null)
    .maybeSingle();
  if (!org) return { error: "invalid_org" };

  const result = await startTrial({ userId: user.id, organizationId });
  if (!result) return { error: "failed" };
  if (result.error) return { error: result.error };
  return { ok: true };
}
