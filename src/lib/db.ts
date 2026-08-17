import postgres from "postgres";
import { projects as defaultProjects } from "@/data/projects";

// No connection string is ever hardcoded here. A committed credential in a
// public repository is a published credential: it grants full read/write/DROP
// over every table, including admin password hashes and visitor IP addresses.
// Lazily create the Postgres client connected directly to the client's Supabase instance.
// `prepare: false` is required for Supabase's transaction pooler (port 6543).
let _sql: postgres.Sql | null = null;
function getSql(): postgres.Sql {
  if (!_sql) {
    const targetUrl = process.env.DATABASE_URL;
    if (!targetUrl) {
      throw new Error(
        "DATABASE_URL is not set. Configure it in your environment (.env locally, Vercel Project Settings in production)."
      );
    }

    _sql = postgres(targetUrl, {
      prepare: false,
      ssl: "require",
      idle_timeout: 20,
      connect_timeout: 30,
      max: 5,
    });
  }
  return _sql;
}

// A Proxy preserves both tagged-template calls (`sql`...``) and property/method
// access (e.g. `sql.json`, `sql.begin`) while keeping initialization lazy.
export const sql: postgres.Sql = new Proxy((() => {}) as any, {
  apply(_target, _thisArg, args) {
    return (getSql() as any)(...args);
  },
  get(_target, prop) {
    const value = (getSql() as any)[prop];
    return typeof value === "function" ? value.bind(getSql()) : value;
  },
}) as postgres.Sql;

// Best-effort DDL for table creation.
async function runDDL() {
  const statements: Array<() => Promise<unknown>> = [
    () => sql`
      CREATE TABLE IF NOT EXISTS site_cms (
        key VARCHAR(100) PRIMARY KEY,
        data JSONB NOT NULL DEFAULT '{}'::jsonb,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );`,
    () => sql`
      CREATE TABLE IF NOT EXISTS projects (
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
    () => sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS data JSONB;`,
    () => sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS sort_order INT;`,
    () => sql`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(100) PRIMARY KEY,
        slug VARCHAR(100) UNIQUE NOT NULL,
        name VARCHAR(255),
        data JSONB,
        sort_order INT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );`,
    // The footer form previously reported "Subscribed successfully!" without
    // sending the address anywhere — there was no endpoint and no table.
    () => sql`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        email VARCHAR(254) PRIMARY KEY,
        source VARCHAR(100) DEFAULT 'footer',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );`,
    // Contact form submissions.
    //
    // `bigint identity` rather than a v4 UUID: sequential keys keep the index
    // dense, where random UUIDs scatter inserts across the btree.
    // `text` + CHECK rather than varchar(n), so the limit is a named, visible
    // constraint instead of a silent truncation rule — and it is enforced by
    // Postgres itself, not only by the API route, so a bad row cannot be
    // written by any path.
    () => sql`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        company TEXT,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'new',
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );`,
    // ADD CONSTRAINT has no IF NOT EXISTS form, so each one is guarded.
    () => sql`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contact_name_len') THEN
          ALTER TABLE contact_submissions ADD CONSTRAINT contact_name_len
            CHECK (char_length(btrim(name)) BETWEEN 2 AND 100);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contact_email_shape') THEN
          ALTER TABLE contact_submissions ADD CONSTRAINT contact_email_shape
            CHECK (char_length(email) <= 254
                   AND email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[A-Za-z]{2,}$'
                   -- consecutive dots are never valid, in either half
                   AND email !~ '\.\.');
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contact_subject_len') THEN
          ALTER TABLE contact_submissions ADD CONSTRAINT contact_subject_len
            CHECK (char_length(btrim(subject)) BETWEEN 3 AND 150);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contact_message_len') THEN
          ALTER TABLE contact_submissions ADD CONSTRAINT contact_message_len
            CHECK (char_length(btrim(message)) BETWEEN 10 AND 5000);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contact_phone_len') THEN
          ALTER TABLE contact_submissions ADD CONSTRAINT contact_phone_len
            CHECK (phone IS NULL OR char_length(phone) <= 32);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contact_company_len') THEN
          ALTER TABLE contact_submissions ADD CONSTRAINT contact_company_len
            CHECK (company IS NULL OR char_length(company) <= 120);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contact_status_enum') THEN
          ALTER TABLE contact_submissions ADD CONSTRAINT contact_status_enum
            CHECK (status IN ('new', 'read', 'replied', 'archived'));
        END IF;
      END $$;`,
    // The admin list is "newest first", so the index matches the sort.
    () => sql`CREATE INDEX IF NOT EXISTS contact_submissions_created_idx ON contact_submissions (created_at DESC);`,
    // Same posture as every other table here: RLS on with no policy, so the
    // public anon key is denied outright. The app reaches Postgres directly
    // through DATABASE_URL, which is not subject to RLS.
    () => sql`ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;`,
    () => sql`
      CREATE TABLE IF NOT EXISTS admin_security (
        key VARCHAR(50) PRIMARY KEY,
        data JSONB NOT NULL DEFAULT '{}'::jsonb,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );`,
    // admin_users is deliberately absent. It was created but never read or
    // written by any code path — admin access lives in admin_security, which
    // holds the allowlist and the PBKDF2 hash. The table is dropped here so a
    // fresh deployment does not recreate an empty, confusing duplicate.
    () => sql`DROP TABLE IF EXISTS admin_users;`,
    () => sql`
      CREATE TABLE IF NOT EXISTS site_visitor_sessions (
        session_id VARCHAR(100) PRIMARY KEY,
        device_type VARCHAR(50) DEFAULT 'desktop',
        browser_name VARCHAR(50) DEFAULT 'Chrome',
        pathname VARCHAR(255) DEFAULT '/',
        pageviews INT DEFAULT 1,
        first_seen TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        last_ping TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );`,
    // Drop the personal-data columns from deployments created before this
    // change. Nothing reads them, so this loses no functionality.
    () => sql`ALTER TABLE site_visitor_sessions DROP COLUMN IF EXISTS ip_address;`,
    () => sql`ALTER TABLE site_visitor_sessions DROP COLUMN IF EXISTS user_agent;`,
    // Retention. The dashboard only looks at a 45-second window for "online
    // now" and lifetime totals; rows older than 30 days serve no purpose and
    // indefinite retention is exactly what a regulator objects to.
    () => sql`DELETE FROM site_visitor_sessions WHERE last_ping < NOW() - INTERVAL '30 days';`,
  ];
  for (const stmt of statements) {
    try {
      await stmt();
    } catch {
      /* ignore permission errors */
    }
  }
}

async function seedProjectsIfEmpty() {
  try {
    const existing = await sql`SELECT count(*)::int as count FROM projects;`;
    if (existing[0]?.count === 0) {
      let order = 0;
      for (const p of defaultProjects) {
        await sql`
          INSERT INTO projects (
            id, slug, name, tagline, description, status, completion_percent, category, cover_image, images, github_url, live_url, tech_stack, data, sort_order
          ) VALUES (
            ${p.id}, ${p.slug}, ${p.name}, ${p.tagline || ""}, ${p.description || ""}, ${p.status || "beta"},
            ${p.completionPercent || 100}, ${p.category || "web"}, ${p.coverImage || ""}, ${sql.json(p.images || [])},
            ${p.githubUrl || ""}, ${p.liveUrl || ""}, ${sql.json(p.techStack || [])}, ${sql.json(p as any)}, ${order++}
          ) ON CONFLICT (id) DO NOTHING;
        `;
      }
    }
  } catch (err) {
    console.error("DB seed error:", err);
  }
}

let ensured: Promise<void> | null = null;
export function ensureDbTables(): Promise<void> {
  if (!ensured) {
    ensured = (async () => {
      await runDDL();
      await seedProjectsIfEmpty();
    })().catch((err) => {
      console.error("ensureDbTables error:", err);
      ensured = null;
    });
  }
  return ensured;
}
