"use server";

import { revalidatePath, updateTag } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/supabase/user/getUser";
import { isContentEditor } from "@/lib/studio/access";
import { normalizePricingConfig, validatePricingConfig } from "./config.js";
import { getLivePricing, PRICING_CACHE_TAG } from "./queries.js";

const PAGES_SHOWING_PRICES = ["/pricing", "/suite", "/why-geiger", "/admin/pricing"];

// Publishes a draft as the new live version. AdminGate is client-side only, so the editor check here is the real gate; RLS enforces it again on the insert.
// baseVersionId is the version the editor started from, so two editors can't silently overwrite each other.
export async function publishPricingAction({ config, note = "", baseVersionId = null }) {
  const supabase = await createClient();
  const user = await getUser(supabase);
  if (!user) return { ok: false, error: "You must be signed in." };
  if (!(await isContentEditor(supabase))) return { ok: false, error: "Only content editors can change pricing." };

  const errors = validatePricingConfig(config);
  if (errors.length) return { ok: false, error: errors[0], errors };

  const live = await getLivePricing();
  if (!live) return { ok: false, error: "Couldn't read the current pricing. Nothing was published." };
  if (live.versionId !== (baseVersionId ?? null)) {
    return { ok: false, conflict: true, error: "Someone else published pricing while you were editing. Reload to see their changes." };
  }

  const { data, error } = await supabase
    .from("pricing_versions")
    .insert({
      config: normalizePricingConfig(config),
      note: String(note).trim().slice(0, 500) || null,
      created_by: user.id,
      created_by_email: user.email ?? null,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[pricing.publish]", error.message);
    return { ok: false, error: "Couldn't publish pricing." };
  }

  // Expires immediately: the next visitor waits for fresh prices rather than seeing the old ones.
  updateTag(PRICING_CACHE_TAG);
  PAGES_SHOWING_PRICES.forEach((path) => revalidatePath(path));
  return { ok: true, versionId: data.id };
}
