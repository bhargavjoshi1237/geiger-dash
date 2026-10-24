// Google Analytics measures the marketing site only; the signed-in app and internal pages are PostHog-only.
const PRIVATE_PREFIXES = [
  "/org",
  "/admin",
  "/studio",
  "/billing",
  "/profile",
  "/onboarding",
  "/invite",
  "/auth",
  "/api",
  "/pallet",
  "/palletw",
];

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "geiger.studio";

// Org custom subdomains (acme.geiger.studio) serve a workspace, never the marketing site.
export function isPublicSite(hostname, pathname) {
  const host = (hostname || "").toLowerCase();
  if (host.endsWith(`.${ROOT_DOMAIN}`) && host !== `www.${ROOT_DOMAIN}`) return false;
  return !PRIVATE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}
