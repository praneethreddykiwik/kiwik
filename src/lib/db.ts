import postgres from "postgres";
import { projects as defaultProjects } from "@/data/projects";

const CLIENT_SUPABASE_URL = "postgresql://postgres.ynueobhylfxnilqldisy:HkpXHT8%25cuL_-Yb@aws-0-ap-south-1.pooler.supabase.com:6543/postgres";

const getDbUrl = () => {
  const url = process.env.DATABASE_URL;
  // If process.env.DATABASE_URL is missing or still points to old Neon DB, use client Supabase account
  if (!url || url.includes("neon.tech")) {
    return CLIENT_SUPABASE_URL;
  }
  return url;
};

// Lazily create the Postgres client so a missing DATABASE_URL surfaces a clear
// error at query time rather than crashing module load / the whole app.
// `prepare: false` is required for Supabase's transaction pooler (port 6543);
// it is also harmless on a session pooler / direct connection.
let _sql: postgres.Sql | null = null;
function getSql(): postgres.Sql {
  if (!_sql) {
    _sql = postgres(getDbUrl(), {
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

// Best-effort DDL. On a managed database (e.g. Supabase) the app role may lack
// DDL privileges and the schema is provisioned via migrations instead — so each
// statement is isolated and permission errors are swallowed. On a self-managed
// database these create the schema on first run.
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
    () => sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id VARCHAR(100) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );`,
    () => sql`
      CREATE TABLE IF NOT EXISTS site_visitor_sessions (
        session_id VARCHAR(100) PRIMARY KEY,
        ip_address VARCHAR(100),
        user_agent TEXT,
        device_type VARCHAR(50) DEFAULT 'desktop',
        browser_name VARCHAR(50) DEFAULT 'Chrome',
        pathname VARCHAR(255) DEFAULT '/',
        pageviews INT DEFAULT 1,
        first_seen TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        last_ping TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );`,
  ];
  for (const stmt of statements) {
    try {
      await stmt();
    } catch {
      /* schema is migration-managed / role lacks DDL — ignore */
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

// Runs once per server instance (cached promise) to keep DB traffic minimal.
let ensured: Promise<void> | null = null;
export function ensureDbTables(): Promise<void> {
  if (!ensured) {
    ensured = (async () => {
      await runDDL();
      await seedProjectsIfEmpty();
    })().catch((err) => {
      console.error("ensureDbTables error:", err);
      ensured = null; // allow a retry on the next request after a hard failure
    });
  }
  return ensured;
}
