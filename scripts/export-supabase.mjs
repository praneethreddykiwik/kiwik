/**
 * Generates a complete, self-contained SQL dump of the Kiwik database.
 *
 *   node scripts/export-supabase.mjs                 -> kiwik-database-export.sql
 *   node scripts/export-supabase.mjs --skip-sessions -> omits site_visitor_sessions
 *   node scripts/export-supabase.mjs --new-ref=abcd  -> rewrites storage URLs to a new project ref
 *
 * IMPORTANT — what a SQL dump can and cannot carry:
 *
 *   Postgres rows  ->  YES. Every table below, schema and data.
 *   Storage files  ->  NO.  Images, videos and PDFs live in Supabase Storage,
 *                      which is object storage, not Postgres. The database only
 *                      holds their URLs. Those files must be copied separately
 *                      (see scripts/export-storage.mjs), or every image on the
 *                      new project will 404 while the rows look perfectly fine.
 */
import fs from "node:fs";
import path from "node:path";
import postgres from "postgres";

const ROOT = process.cwd();
const args = process.argv.slice(2);
const SKIP_SESSIONS = args.includes("--skip-sessions");
const NEW_REF = (args.find((a) => a.startsWith("--new-ref=")) || "").split("=")[1] || null;

const env = {};
for (const line of fs.readFileSync(path.join(ROOT, ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}
const OLD_REF = (env.SUPABASE_PROJECT_REF || "").trim();

/** Order matters only for readability here — there are no foreign keys. */
const TABLES = [
  {
    name: "site_cms",
    ddl: `CREATE TABLE IF NOT EXISTS site_cms (
  key VARCHAR(100) PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`,
    columns: ["key", "data", "updated_at"],
    conflict: "key",
  },
  {
    name: "projects",
    ddl: `CREATE TABLE IF NOT EXISTS projects (
  id VARCHAR(100) PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  tagline TEXT,
  description TEXT,
  status VARCHAR(50) DEFAULT 'beta',
  completion_percent INT DEFAULT 100,
  category VARCHAR(100) DEFAULT 'System Engine',
  cover_image TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  github_url TEXT,
  live_url TEXT,
  tech_stack JSONB DEFAULT '[]'::jsonb,
  data JSONB,
  sort_order INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`,
    columns: ["id","slug","name","tagline","description","status","completion_percent","category","cover_image","images","github_url","live_url","tech_stack","data","sort_order","created_at","updated_at"],
    conflict: "id",
  },
  {
    name: "products",
    ddl: `CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(100) PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255),
  data JSONB,
  sort_order INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`,
    columns: ["id", "slug", "name", "data", "sort_order", "created_at", "updated_at"],
    conflict: "id",
  },
  {
    name: "admin_security",
    ddl: `CREATE TABLE IF NOT EXISTS admin_security (
  key VARCHAR(50) PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`,
    columns: ["key", "data", "updated_at"],
    conflict: "key",
  },
  {
    name: "newsletter_subscribers",
    ddl: `CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  email VARCHAR(254) PRIMARY KEY,
  source VARCHAR(100) DEFAULT 'footer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`,
    columns: ["email", "source", "created_at"],
    conflict: "email",
  },
  {
    name: "site_visitor_sessions",
    optional: true,
    ddl: `CREATE TABLE IF NOT EXISTS site_visitor_sessions (
  session_id VARCHAR(100) PRIMARY KEY,
  device_type VARCHAR(50) DEFAULT 'desktop',
  browser_name VARCHAR(50) DEFAULT 'Chrome',
  pathname VARCHAR(255) DEFAULT '/',
  pageviews INT DEFAULT 1,
  first_seen TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_ping TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`,
    columns: ["session_id","device_type","browser_name","pathname","pageviews","first_seen","last_ping"],
    conflict: "session_id",
  },
];

/** Postgres literal. Dollar-quoting avoids escaping hell inside large JSON blobs. */
function lit(value) {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : "NULL";
  if (typeof value === "boolean") return value ? "TRUE" : "FALSE";
  if (value instanceof Date) return `'${value.toISOString()}'::timestamptz`;

  let text;
  let isJson = false;
  if (typeof value === "object") {
    text = JSON.stringify(value);
    isJson = true;
  } else {
    text = String(value);
  }
  if (NEW_REF && OLD_REF) text = text.split(OLD_REF).join(NEW_REF);

  // Pick a dollar tag that cannot appear in the payload.
  let tag = "kw";
  while (text.includes(`$${tag}$`)) tag += "x";
  return `$${tag}$${text}$${tag}$` + (isJson ? "::jsonb" : "");
}

(async () => {
  const sql = postgres(env.DATABASE_URL, { prepare: false, ssl: "require", connect_timeout: 30, max: 3 });
  const out = [];
  const summary = [];

  out.push(`-- Kiwik — complete database export`);
  out.push(`-- Generated from project ref: ${OLD_REF || "(unknown)"}`);
  if (NEW_REF) out.push(`-- Storage URLs rewritten: ${OLD_REF} -> ${NEW_REF}`);
  out.push(`--`);
  out.push(`-- Paste this whole file into the new project's SQL Editor and Run.`);
  out.push(`-- It is idempotent: re-running it will not duplicate rows.`);
  out.push(`--`);
  out.push(`-- THIS FILE DOES NOT CONTAIN IMAGES OR VIDEOS. Those live in Supabase`);
  out.push(`-- Storage, not Postgres. Copy the 'partner-media' bucket separately or`);
  out.push(`-- every media URL below will point at a project that no longer serves it.`);
  out.push(``);
  out.push(`BEGIN;`);
  out.push(``);

  for (const t of TABLES) {
    if (t.optional && SKIP_SESSIONS) {
      summary.push([t.name, "skipped"]);
      continue;
    }

    let rows;
    try {
      rows = await sql.unsafe(`SELECT ${t.columns.join(", ")} FROM ${t.name};`);
    } catch (err) {
      out.push(`-- ${t.name}: not present in source (${String(err.message).split("\n")[0]})`);
      summary.push([t.name, "absent"]);
      continue;
    }

    out.push(`-- ─────────────────────────────────────────────────────────────`);
    out.push(`-- ${t.name} — ${rows.length} row(s)`);
    out.push(`-- ─────────────────────────────────────────────────────────────`);
    out.push(t.ddl);
    out.push(``);

    for (const r of rows) {
      const vals = t.columns.map((c) => lit(r[c])).join(", ");
      const updates = t.columns
        .filter((c) => c !== t.conflict)
        .map((c) => `${c} = EXCLUDED.${c}`)
        .join(", ");
      out.push(
        `INSERT INTO ${t.name} (${t.columns.join(", ")}) VALUES (${vals})\n` +
          `  ON CONFLICT (${t.conflict}) DO UPDATE SET ${updates};`
      );
    }
    out.push(``);
    summary.push([t.name, `${rows.length} rows`]);
  }

  out.push(`COMMIT;`);
  out.push(``);

  await sql.end();

  const file = path.join(ROOT, "kiwik-database-export.sql");
  fs.writeFileSync(file, out.join("\n"));

  console.log("Wrote", file, `(${(fs.statSync(file).size / 1024).toFixed(1)} KB)`);
  summary.forEach(([n, s]) => console.log("  " + n.padEnd(26) + s));
})();
