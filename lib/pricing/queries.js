// Reads of public.pricing_versions, whose newest row is live; with no rows the code defaults apply.
import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/utils/supabase/admin";
import { normalizePricingConfig } from "./config.js";
import { createPricing } from "./plans.js";

export const PRICING_CACHE_TAG = "pricing";

const TABLE = "pricing_versions";
// Only reached if an admin write's tag invalidation is missed.
const REVALIDATE_SECONDS = 60;
// PostgREST and Postgres codes for "table doesn't exist", so a deploy ahead of its migration runs on the defaults.
const MISSING_TABLE = new Set(["PGRST205", "42P01"]);

function publicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
}

const toPricing = (row) => (row ? createPricing(normalizePricingConfig(row.config), row.id) : createPricing());

// The live row, or null when nothing has been published; throws on a real read failure so callers can decide what's safe.
async function readLiveRow() {
  const supabase = publicClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from(TABLE)
    .select("id, config")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error && !MISSING_TABLE.has(error.code)) throw new Error(error.message);
  return data ?? null;
}

// Only the raw row is cached: the merged config holds Infinity, which doesn't survive the cache's JSON.
const readCachedRow = unstable_cache(readLiveRow, ["pricing-live"], { revalidate: REVALIDATE_SECONDS, tags: [PRICING_CACHE_TAG] });

// For rendering pages. A failed read shows the defaults, which is safe because checkout re-checks the version.
export async function getPricing() {
  try {
    return toPricing(await readCachedRow());
  } catch (error) {
    console.error("[pricing.getPricing]", error.message);
    return createPricing();
  }
}

// For anything that charges or grants access: uncached, and null on failure so the caller refuses rather than guesses a price.
export async function getLivePricing() {
  try {
    return toPricing(await readLiveRow());
  } catch (error) {
    console.error("[pricing.getLivePricing]", error.message);
    return null;
  }
}

// The version a purchase was made under, the defaults for a purchase from before versioning, or null if the read fails.
export async function getPricingForVersion(versionId) {
  if (!versionId) return createPricing();
  const supabase = publicClient();
  if (!supabase) return null;
  const { data, error } = await supabase.from(TABLE).select("id, config").eq("id", versionId).maybeSingle();
  if (error || !data) {
    console.error("[pricing.getPricingForVersion]", error?.message || `missing version ${versionId}`);
    return null;
  }
  return toPricing(data);
}

// Publish history for the admin screen. Service-role because note and author aren't public; the page only calls this for editors.
export async function listPricingVersions() {
  const supabase = createAdminClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from(TABLE)
    .select("id, config, note, created_by_email, created_at")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) {
    if (!MISSING_TABLE.has(error.code)) console.error("[pricing.listPricingVersions]", error.message);
    return [];
  }
  return (data || []).map((row) => ({
    id: row.id,
    config: normalizePricingConfig(row.config),
    note: row.note ?? "",
    author: row.created_by_email ?? "",
    createdAt: row.created_at,
  }));
}
