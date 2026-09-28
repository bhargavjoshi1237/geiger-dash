"use server";

import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/supabase/user/getUser";
import { getUserPlan } from "@/lib/billing/store";
import { derivePlanState } from "@/lib/billing/plan_state";

// The global plan banner's state for the signed-in user, or null when there's nothing to show; the auth check here is the real one.
export async function getPlanBannerState() {
  const supabase = await createClient();
  const user = await getUser(supabase);
  if (!user) return null;

  const state = derivePlanState(await getUserPlan(user.id));
  if (state.phase === "trialing") {
    return { phase: "trialing", daysRemaining: state.daysRemaining };
  }
  if (state.phase === "grace") {
    return { phase: "grace", deletionDaysRemaining: state.deletionDaysRemaining };
  }
  return null;
}
