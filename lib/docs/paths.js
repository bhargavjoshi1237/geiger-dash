// The help center lives at /help; /docs is rewritten to the Geiger Docs product (document signing).
export const HELP_BASE_PATH = "/help";
export const HELP_HOME_SLUG = "welcome";

// Public URL of a help page; the home page is the bare base path. Preview links stay in preview.
export function helpHref(slug, { anchor = "", preview = false } = {}) {
  const path = !slug || slug === HELP_HOME_SLUG ? HELP_BASE_PATH : `${HELP_BASE_PATH}/${slug}`;
  return `${path}${preview ? "?preview=1" : ""}${anchor ? `#${anchor}` : ""}`;
}
