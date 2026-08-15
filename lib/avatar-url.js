// The one place that builds a user's avatar URL.
//
// Avatars are stored at a fixed object name (`pfp/<user id>/latest.jpg`), so
// every upload reuses the same URL and browsers keep serving the picture they
// already have. `user_metadata.avatar_version` — stamped by updateAvatarAction
// on each upload — is the cache buster that makes the URL change with the
// picture. Every surface must build the src through here, or it will show a
// stale avatar.

const AVATAR_BUCKET = "pfp";

export function userAvatarUrl(userId, version = 0) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base || !userId) return "";
  const url = `${base}/storage/v1/object/public/${AVATAR_BUCKET}/${userId}/latest.jpg`;
  return version ? `${url}?v=${version}` : url;
}

// Same, straight from a Supabase auth user. Returns "" once the picture has
// been removed, so callers fall back to initials instead of a 404 request.
export function avatarUrlForUser(user) {
  if (!user?.id) return "";
  const meta = user.user_metadata || {};
  // A user who has never touched their picture has no avatar_version and no
  // avatar_url; the unversioned URL still resolves if an object exists.
  if ("avatar_version" in meta && !meta.avatar_version) return "";
  return userAvatarUrl(user.id, Number(meta.avatar_version) || 0);
}
