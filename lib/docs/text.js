const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'", "#039": "'", nbsp: " " };

// Plain text of an editor HTML fragment, for search snippets and Ask AI context.
export function htmlToText(html) {
  return String(html || "")
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<\/(p|div|li|h[1-6]|pre|blockquote|tr)>|<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(amp|lt|gt|quot|#0?39|nbsp);/g, (_, name) => ENTITIES[name] ?? " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .trim();
}

// Lowercase, dash-separated slug segment ("Members & roles" -> "members-roles").
export function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// A full help slug: one or more slugified segments joined by "/".
export function normalizeHelpSlug(value) {
  return String(value || "")
    .split("/")
    .map(slugify)
    .filter(Boolean)
    .join("/");
}
