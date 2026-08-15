// Reads against public.dash_notices — the global notice strip above the topbar.
// Returns camelCase view models; the DB stays snake_case behind this boundary.
//
// The public read is cached so the root layout can await it without opting every
// page out of static rendering. Admin writes bust it through NOTICE_CACHE_TAG.

import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/utils/supabase/admin";
import { toBannerConfig } from "./shared.js";

export const NOTICE_CACHE_TAG = "dash-notice";

// Short window so a scheduled notice starts/expires on its own; admin edits
// invalidate the tag immediately and don't wait for it.
const NOTICE_REVALIDATE_SECONDS = 60;

const TABLE = "dash_notices";

function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

export function normalizeNotice(row) {
  if (!row) return null;
  return {
    id: row.id,
    message: row.message ?? "",
    type: row.type ?? "warning",
    dismissible: row.dismissible ?? true,
    linkText: row.link_text ?? "",
    linkHref: row.link_href ?? "",
    linkExternal: row.link_external ?? false,
    isActive: row.is_active ?? false,
    startsAt: row.starts_at ?? null,
    endsAt: row.ends_at ?? null,
    createdAt: row.created_at ?? null,
    updatedAt: row.updated_at ?? null,
  };
}

async function fetchActiveNotice() {
  const supabase = createPublicClient();
  if (!supabase) return null;

  const nowIso = new Date().toISOString();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .is("deleted_at", null)
    .eq("is_active", true)
    .or(`starts_at.is.null,starts_at.lte.${nowIso}`)
    .or(`ends_at.is.null,ends_at.gt.${nowIso}`)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    // A missing table or unreachable DB must not take the whole app down — the
    // strip just stays hidden.
    console.error("[notices.getActiveNotice]", error.message);
    return null;
  }

  return toBannerConfig(normalizeNotice(data));
}

// The banner config the root layout renders, or null when nothing is live.
export const getActiveNotice = unstable_cache(
  fetchActiveNotice,
  ["dash-active-notice"],
  { revalidate: NOTICE_REVALIDATE_SECONDS, tags: [NOTICE_CACHE_TAG] },
);

// Every notice for the admin surface, newest first. Uncached and service-role:
// the editor must see a write the moment it lands.
export async function listNotices() {
  const supabase = createAdminClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .is("deleted_at", null)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("[notices.listNotices]", error.message);
    return [];
  }
  return (data || []).map(normalizeNotice);
}
