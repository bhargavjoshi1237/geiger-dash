// Pushes the template library (mails/registry.js) into email.templates.
//
//   npm run email:seed
//
// Re-running is safe and idempotent. It refreshes structural metadata
// (category, name, description, fields, sample data, variables) but PRESERVES
// admin-edited subject and content so a re-seed never clobbers edits made in the
// admin UI. New templates are inserted with their registry defaults.
//
// Requires DATABASE_URL (or DIRECT_URL / STRING_URI). The npm script loads .env
// via node's --env-file flag.

import { Client } from "pg";
import { TEMPLATES } from "../mails/registry.js";

const CONNECTION_STRING =
  process.env.DIRECT_URL || process.env.DATABASE_URL || process.env.STRING_URI;

if (!CONNECTION_STRING) {
  console.error(
    "ERROR: set DATABASE_URL (or DIRECT_URL / STRING_URI) before seeding."
  );
  process.exit(1);
}

const UPSERT = `
  insert into email.templates
    (key, project, category, name, description, subject, content, fields, sample_data, variables, status)
  values
    ($1, $2, $3, $4, $5, $6, $7::jsonb, $8::jsonb, $9::jsonb, $10::jsonb, 'active')
  on conflict (key) do update set
    project = excluded.project,
    category = excluded.category,
    name = excluded.name,
    description = excluded.description,
    fields = excluded.fields,
    sample_data = excluded.sample_data,
    variables = excluded.variables,
    updated_at = now()
`;

async function run() {
  const client = new Client({
    connectionString: CONNECTION_STRING,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  console.log(`Seeding ${TEMPLATES.length} templates...\n`);

  try {
    for (const t of TEMPLATES) {
      await client.query(UPSERT, [
        t.key,
        t.project,
        t.category,
        t.name,
        t.description,
        t.subject,
        JSON.stringify(t.content),
        JSON.stringify(t.fields),
        JSON.stringify(t.sampleData),
        JSON.stringify(t.variables),
      ]);
      console.log(`  upserted ${t.key}`);
    }
    console.log("\nDone.");
  } finally {
    await client.end();
  }
}

run().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
