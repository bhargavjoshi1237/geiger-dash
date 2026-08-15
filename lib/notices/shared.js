// Pure notice helpers shared by the server data layer and the admin UI. No
// Supabase, no next/cache — safe to import from a client component.

// Notice view model -> the <GlobalBanner /> contract from @geiger/ui. A link
// needs both halves to render, so a half-filled one is dropped rather than
// shown broken.
export function toBannerConfig(notice) {
  if (!notice?.message) return null;
  const hasLink = Boolean(notice.linkText && notice.linkHref);
  return {
    message: notice.message,
    type: notice.type,
    dismissible: notice.dismissible,
    link: hasLink
      ? {
          text: notice.linkText,
          href: notice.linkHref,
          external: notice.linkExternal,
        }
      : null,
  };
}

// Where a notice sits relative to its schedule. Mirrors the SQL filter in
// getActiveNotice so the admin list can label rows without a round trip.
//   off       — switched off (or empty)
//   scheduled — on, but its window hasn't opened yet
//   expired   — on, but its window has closed
//   live      — on and showing right now
export function noticeStatus(notice, now = new Date()) {
  if (!notice?.isActive || !notice.message) return "off";
  if (notice.startsAt && new Date(notice.startsAt) > now) return "scheduled";
  if (notice.endsAt && new Date(notice.endsAt) <= now) return "expired";
  return "live";
}

export function isNoticeLive(notice, now = new Date()) {
  return noticeStatus(notice, now) === "live";
}
