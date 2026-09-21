// API key generation + hashing for the storage API.
//
// Mirrors lib/email/keys.js: only the SHA-256 hash is persisted; the plaintext
// key is returned once at creation and never stored.

import crypto from "node:crypto";

export function hashApiKey(key) {
  return crypto.createHash("sha256").update(key).digest("hex");
}

export function generateApiKey() {
  const secret = crypto.randomBytes(24).toString("base64url");
  const key = `gs_live_${secret}`;
  return {
    key,
    prefix: `${key.slice(0, 14)}…`,
    hash: hashApiKey(key),
  };
}
