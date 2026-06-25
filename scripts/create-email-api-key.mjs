// Mints a cross-app email API key and stores only its SHA-256 hash.
//
// The plaintext key is printed ONCE here — copy it into the calling app's
// GEIGER_EMAIL_API_KEY env. It is never recoverable afterwards.
//
//   node --env-file=.env scripts/create-email-api-key.mjs "Geiger Flow production" geiger-flow

import { Client } from "pg";
import crypto from "node:crypto";

const CONNECTION_STRING =
  process.env.DIRECT_URL || process.env.DATABASE_URL || process.env.STRING_URI;

if (!CONNECTION_STRING) {
  console.error("ERROR: set DATABASE_URL (or DIRECT_URL / STRING_URI).");
  process.exit(1);
}

const name = process.argv[2] || "Suite app";
const project = process.argv[3] || "geiger-flow";

const secret = crypto.randomBytes(24).toString("base64url");
const key = `gk_live_${secret}`;
const prefix = `${key.slice(0, 14)}…`;
const keyHash = crypto.createHash("sha256").update(key).digest("hex");

const client = new Client({
  connectionString: CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

await client.connect();

try {
  const { rows } = await client.query(
    `insert into email.api_keys (name, project, prefix, key_hash, active)
     values ($1, $2, $3, $4, true)
     returning id, name, project, prefix, created_at`,
    [name, project, prefix, keyHash]
  );

  console.log("API key created:\n");
  console.log(JSON.stringify(rows[0], null, 2));
  console.log("\nPlaintext key (store now, shown once):\n");
  console.log(`  ${key}\n`);
} finally {
  await client.end();
}
