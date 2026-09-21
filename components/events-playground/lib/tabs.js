// Tab title -> url slug, matching the Events workspace. The playground never
// routes, but the overview builds hrefs from it.
export function tabToSlug(title) {
  return String(title || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}
