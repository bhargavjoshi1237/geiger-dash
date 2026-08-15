"use server";

// Server actions for the notice admin surface. UI components call these; they
// never touch Supabase directly. Each action gates on a signed-in user, returns
// a plain `{ ok, ... }` result (the UI owns the toast), and invalidates both the
// admin route and the cached banner read.
//
// The AdminGate over /admin is client-side only, so the auth check here is the
// real one — a server action is a public endpoint.

import { revalidatePath, revalidateTag } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { getUser } from "@/supabase/user/getUser";
import { NOTICE_CACHE_TAG, normalizeNotice } from "./queries.js";

const ADMIN_PATH = "/admin/notice";
const TABLE = "dash_notices";
const NOTICE_TYPES = ["warning", "info"];

async function requireAuth() {
  const supabase = await createClient();
  const user = await getUser(supabase);
  if (!user) return { user: null, error: "You must be signed in." };
  return { user, error: null };
}

// Bust the strip everywhere: the tag covers the cached read, the path refreshes
// the editor's own list.
function revalidateNotices() {
  revalidateTag(NOTICE_CACHE_TAG);
  revalidatePath(ADMIN_PATH);
  revalidatePath("/", "layout");
}

// camelCase draft -> snake_case columns. Emits a column only when the key is
// present, so the same helper serves a create and a single-field toggle.
function toRow(input) {
  const row = {};
  if ("message" in input) row.message = (input.message || "").trim();
  if ("type" in input) {
    row.type = NOTICE_TYPES.includes(input.type) ? input.type : "warning";
  }
  if ("dismissible" in input) row.dismissible = Boolean(input.dismissible);
  if ("linkText" in input) row.link_text = input.linkText?.trim() || null;
  if ("linkHref" in input) row.link_href = input.linkHref?.trim() || null;
  if ("linkExternal" in input) row.link_external = Boolean(input.linkExternal);
  if ("isActive" in input) row.is_active = Boolean(input.isActive);
  if ("startsAt" in input) row.starts_at = input.startsAt || null;
  if ("endsAt" in input) row.ends_at = input.endsAt || null;
  return row;
}

// Only one notice can be live at a time, so switching one on switches the rest
// off — otherwise "which one shows?" is decided by an invisible updated_at race.
async function deactivateOthers(supabase, keepId) {
  const query = supabase
    .from(TABLE)
    .update({ is_active: false })
    .eq("is_active", true)
    .is("deleted_at", null);

  const { error } = keepId ? await query.neq("id", keepId) : await query;
  if (error) console.error("[notices.deactivateOthers]", error.message);
}

// Create or update a notice. `id` absent means create.
export async function saveNoticeAction(draft) {
  const { user, error: authError } = await requireAuth();
  if (authError) return { ok: false, error: authError };

  const message = (draft?.message || "").trim();
  if (!message) return { ok: false, error: "A notice needs a message." };
  if (draft?.linkHref && !draft?.linkText) {
    return { ok: false, error: "Give the link a label, or clear the URL." };
  }
  if (draft?.startsAt && draft?.endsAt && draft.endsAt <= draft.startsAt) {
    return { ok: false, error: "The end time must come after the start time." };
  }

  const supabase = createAdminClient();
  if (!supabase) return { ok: false, error: "Supabase is not configured." };

  const row = toRow({ ...draft, message });

  if (draft.id) {
    if (row.is_active) await deactivateOthers(supabase, draft.id);
    const { data, error } = await supabase
      .from(TABLE)
      .update(row)
      .eq("id", draft.id)
      .select("*")
      .single();

    if (error) {
      console.error("[notices.saveNotice]", error.message);
      return { ok: false, error: error.message };
    }
    revalidateNotices();
    return { ok: true, notice: normalizeNotice(data) };
  }

  if (row.is_active) await deactivateOthers(supabase, null);
  const { data, error } = await supabase
    .from(TABLE)
    .insert({ ...row, created_by: user.id })
    .select("*")
    .single();

  if (error) {
    console.error("[notices.saveNotice]", error.message);
    return { ok: false, error: error.message };
  }
  revalidateNotices();
  return { ok: true, notice: normalizeNotice(data) };
}

// Switch a notice on or off without opening the editor.
export async function setNoticeActiveAction(id, isActive) {
  const { error: authError } = await requireAuth();
  if (authError) return { ok: false, error: authError };
  if (!id) return { ok: false, error: "Missing notice." };

  const supabase = createAdminClient();
  if (!supabase) return { ok: false, error: "Supabase is not configured." };

  if (isActive) await deactivateOthers(supabase, id);

  const { data, error } = await supabase
    .from(TABLE)
    .update({ is_active: Boolean(isActive) })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error("[notices.setNoticeActive]", error.message);
    return { ok: false, error: error.message };
  }
  revalidateNotices();
  return { ok: true, notice: normalizeNotice(data) };
}

// Soft delete — lists filter deleted_at is null.
export async function deleteNoticeAction(id) {
  const { error: authError } = await requireAuth();
  if (authError) return { ok: false, error: authError };
  if (!id) return { ok: false, error: "Missing notice." };

  const supabase = createAdminClient();
  if (!supabase) return { ok: false, error: "Supabase is not configured." };

  const { error } = await supabase
    .from(TABLE)
    .update({ deleted_at: new Date().toISOString(), is_active: false })
    .eq("id", id);

  if (error) {
    console.error("[notices.deleteNotice]", error.message);
    return { ok: false, error: error.message };
  }
  revalidateNotices();
  return { ok: true };
}
