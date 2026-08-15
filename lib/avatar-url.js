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

// The picture the OAuth provider handed us at sign-in (Google stamps one on
// every identity). Read from `identities`, not user_metadata: an upload
// overwrites user_metadata.avatar_url with our storage URL, while the identity
// keeps the provider's original.
export function providerAvatarUrl(user) {
  const identities = Array.isArray(user?.identities) ? user.identities : [];
  for (const identity of identities) {
    const data = identity?.identity_data || {};
    const url = data.avatar_url || data.picture;
    if (url) return String(url);
  }
  return "";
}

// Same, straight from a Supabase auth user. Returns "" once the picture has
// been removed, so callers fall back to initials instead of a 404 request.
export function avatarUrlForUser(user) {
  if (!user?.id) return "";
  const meta = user.user_metadata || {};
  const version = Number(meta.avatar_version) || 0;
  if (version) return userAvatarUrl(user.id, version);
  // Picture explicitly removed — honour that rather than resurrecting the
  // provider's, otherwise "Remove Picture" would appear to do nothing.
  if ("avatar_version" in meta) return "";
  // Never uploaded: a Google (or other OAuth) sign-in already has a picture, so
  // use it automatically. Only fall back to the unversioned storage URL for
  // legacy uploads made before avatar_version existed.
  return providerAvatarUrl(user) || userAvatarUrl(user.id, 0);
}
