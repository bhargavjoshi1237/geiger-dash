"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/supabase/user/getUser";
import { isContentEditor } from "@/lib/studio/access";
import { PRODUCT_BADGES } from "./shared.js";

// AdminGate is client-side only, so the editor check here is the real gate; RLS enforces the same rule on the write.
export async function setProductBadgeAction(href, badge) {
  if (badge !== null && !PRODUCT_BADGES.includes(badge)) {
    return { ok: false, error: "That badge isn't available." };
  }

  const supabase = await createClient();
  const user = await getUser(supabase);
  if (!user) return { ok: false, error: "You must be signed in." };
  if (!(await isContentEditor(supabase))) {
    return { ok: false, error: "Only content editors can change badges." };
  }

  const { data, error } = await supabase
    .from("suite_product_badges")
    .update({ badge })
    .eq("href", href)
    .select("href")
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("[productBadges.set]", error.message);
    return { ok: false, error: "Couldn't update the badge." };
  }

  revalidatePath("/admin/version-control");
  return { ok: true };
}
