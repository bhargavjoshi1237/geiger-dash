// Applies the SQL migrations in supabase/migrations/ in filename order.
//
// Mirrors geiger-flow's scripts/run-sqls.js but is schema-agnostic: idempotency
// comes from the `if not exists` / `drop ... if exists` guards in the SQL, so
// re-running is safe. Statements are split on `;` with dollar-quote awareness so
// trigger/function bodies survive intact.
//
//   npm run email:migrate
//
// Requires DATABASE_URL (or DIRECT_URL / STRING_URI) in the environment. The npm
// script loads .env via node's --env-file flag.

import { Client } from "pg";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const MIGRATIONS_DIR = path.join(ROOT, "supabase", "migrations");

const CONNECTION_STRING =
  process.env.DIRECT_URL || process.env.DATABASE_URL || process.env.STRING_URI;

if (!CONNECTION_STRING) {
  console.error(
    "ERROR: set DATABASE_URL (or DIRECT_URL / STRING_URI) before running migrations."
  );
  process.exit(1);
}

function getMigrationFiles() {
  if (!fs.existsSync(MIGRATIONS_DIR)) return [];
  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((file) => file.endsWith(".sql"))
    .sort();
}

// Split on `;`, ignoring semicolons inside $$...$$ dollar-quoted bodies and
// `--` line comments.
function splitStatements(sql) {
  const statements = [];
  let current = "";
  let inDollar = false;
  let tag = "";
  let i = 0;

  while (i < sql.length) {
    if (sql[i] === "$") {
      const match = sql.slice(i).match(/^\$([a-zA-Z_]*)\$/);
      if (match) {
        const found = match[0];
        if (!inDollar) {
          inDollar = true;
          tag = found;
        } else if (found === tag) {
          inDollar = false;
          tag = "";
        }
        current += found;
        i += found.length;
        continue;
      }
    }

    if (!inDollar && sql[i] === "-" && sql[i + 1] === "-") {
      const end = sql.indexOf("\n", i);
      if (end === -1) break;
      current += sql.slice(i, end + 1);
      i = end + 1;
      continue;
    }

    if (!inDollar && sql[i] === ";") {
      const trimmed = current.trim();
      if (trimmed) statements.push(trimmed);
      current = "";
      i += 1;
      continue;
    }

    current += sql[i];
    i += 1;
  }

  const tail = current.trim();
  if (tail) statements.push(tail);
  return statements;
}

async function run() {
  const files = getMigrationFiles();
  if (files.length === 0) {
    console.log("No migrations found in supabase/migrations.");
    return;
  }

  const client = new Client({
    connectionString: CONNECTION_STRING,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log("Connected to database.\n");

  try {
    for (const file of files) {
      console.log(`========== ${file} ==========`);
      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), "utf-8");
      const statements = splitStatements(sql);

      for (const statement of statements) {
        try {
          await client.query(statement);
          console.log(`  OK: ${statement.slice(0, 72).replace(/\s+/g, " ")}`);
        } catch (err) {
          console.error(
            `  ERROR: ${statement.slice(0, 72).replace(/\s+/g, " ")}`
          );
          console.error(`         ${err.message}`);
        }
      }
      console.log("");
    }
    console.log("Done.");
  } finally {
    await client.end();
  }
}

run().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
