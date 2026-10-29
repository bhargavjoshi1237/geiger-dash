"use server";

import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/supabase/user/getUser";
import { startBeta } from "@/lib/billing/store";
import { BETA_APPS } from "@/lib/pricing/beta";

const BETA_APP_IDS = new Set(BETA_APPS.map((app) => app.id));

// Signs the chosen org up for the free Alpha tester plan with the picked apps; returns { ok } or { error } for the dialog.
export async function joinBetaAction({ organizationId, apps } = {}) {
  const supabase = await createClient();
  const user = await getUser(supabase);
  if (!user) return { error: "auth" };

  const products = Array.from(new Set(Array.isArray(apps) ? apps : [])).filter((id) => BETA_APP_IDS.has(id));
  if (!products.length) return { error: "no_apps" };
  if (!organizationId) return { error: "invalid_org" };

  // A row back from the user's RLS-scoped client proves they belong to the org.
  const { data: org } = await supabase
    .from("organizations")
    .select("id")
    .eq("id", organizationId)
    .is("deleted_at", null)
    .maybeSingle();
  if (!org) return { error: "invalid_org" };

  const result = await startBeta({ organizationId, products });
  if (!result) return { error: "failed" };
  return result;
}
