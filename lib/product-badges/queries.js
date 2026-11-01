const TABLE = "suite_product_badges";

// Every product for the Version control screen, alphabetical; the session client is enough because reads are public.
export async function listProductBadges(supabase) {
  const { data, error } = await supabase
    .from(TABLE)
    .select("href, name, badge")
    .is("deleted_at", null)
    .order("name");

  if (error) {
    console.error("[productBadges.list]", error.message);
    return [];
  }
  return data || [];
}
