// AES-256-GCM envelope for provider secrets (S3 secret keys, Uploadcare private
// keys, blob tokens). These are real credentials, so they are encrypted before
// they touch the database and only ever decrypted server-side at the moment a
// driver needs them.
//
// STORAGE_SECRET_KEY is a 32-byte key, base64 or hex encoded. Generate one with:
//   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

import crypto from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const VERSION = 1;

function masterKey() {
  const raw = process.env.STORAGE_SECRET_KEY;
  if (!raw) {
    throw new Error(
      "STORAGE_SECRET_KEY is required to store provider credentials."
    );
  }

  const key = Buffer.from(raw, /^[0-9a-f]{64}$/i.test(raw) ? "hex" : "base64");
  if (key.length !== 32) {
    throw new Error("STORAGE_SECRET_KEY must decode to exactly 32 bytes.");
  }
  return key;
}

export function hasSecretKey() {
  try {
    masterKey();
    return true;
  } catch {
    return false;
  }
}

// Encrypts a plain object into a storable envelope. Returns {} for empty input
// so a provider with no secrets stores an empty jsonb rather than ciphertext.
export function encryptSecrets(secrets) {
  if (!secrets || Object.keys(secrets).length === 0) return {};

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, masterKey(), iv);
  const data = Buffer.concat([
    cipher.update(JSON.stringify(secrets), "utf8"),
    cipher.final(),
  ]);

  return {
    v: VERSION,
    iv: iv.toString("base64"),
    tag: cipher.getAuthTag().toString("base64"),
    data: data.toString("base64"),
  };
}

// Reverses encryptSecrets. Returns {} when the envelope is absent or unreadable
// so a driver fails on a missing credential rather than on a thrown decrypt.
export function decryptSecrets(envelope) {
  if (!envelope || !envelope.data) return {};

  try {
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      masterKey(),
      Buffer.from(envelope.iv, "base64")
    );
    decipher.setAuthTag(Buffer.from(envelope.tag, "base64"));
    const plain = Buffer.concat([
      decipher.update(Buffer.from(envelope.data, "base64")),
      decipher.final(),
    ]);
    return JSON.parse(plain.toString("utf8"));
  } catch (err) {
    console.error("[filestore.decryptSecrets]", err.message);
    return {};
  }
}

// Which secret fields a provider holds, without revealing any value. This is
// the only secret-shaped thing the admin UI is ever given.
export function describeSecrets(envelope) {
  const secrets = decryptSecrets(envelope);
  return Object.keys(secrets).reduce((acc, key) => {
    acc[key] = true;
    return acc;
  }, {});
}

// Merge a patch of new secret values over the stored ones. Blank values mean
// "leave this credential alone", so the UI can submit a masked form safely.
export function mergeSecrets(envelope, patch) {
  const current = decryptSecrets(envelope);
  const next = { ...current };

  for (const [key, value] of Object.entries(patch || {})) {
    if (value === null) delete next[key];
    else if (typeof value === "string" && value.trim() !== "") next[key] = value;
  }

  return encryptSecrets(next);
}
