import { neon } from "@neondatabase/serverless";
import { projects as defaultProjects } from "@/data/projects";

const getDbUrl = () =>
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_a1nVOCkRD9wI@ep-aged-cloud-auski0i0-pooler.c-10.us-east-1.aws.neon.tech/neondb?sslmode=require";

export const sql = neon(getDbUrl());

export async function ensureDbTables() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS site_cms (
        key VARCHAR(100) PRIMARY KEY,
        data JSONB NOT NULL DEFAULT '{}'::jsonb,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
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
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id VARCHAR(100) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
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
      );
    `;

    const existing = await sql`SELECT count(*)::int as count FROM projects;`;
    if (existing[0]?.count === 0) {
      console.log("Seeding default projects into Neon database...");
      for (const p of defaultProjects) {
        await sql`
          INSERT INTO projects (
            id, slug, name, tagline, description, status, completion_percent, category, cover_image, images, github_url, live_url, tech_stack
          ) VALUES (
            ${p.id}, ${p.slug}, ${p.name}, ${p.tagline || ""}, ${p.description || ""}, ${p.status || "beta"},
            ${p.completionPercent || 100}, ${p.category || "web"}, ${p.coverImage || ""}, ${JSON.stringify(p.images || [])},
            ${p.githubUrl || ""}, ${p.liveUrl || ""}, ${JSON.stringify(p.techStack || [])}
          ) ON CONFLICT (id) DO NOTHING;
        `;
      }
    }
  } catch (err) {
    console.error("ensureDbTables error:", err);
  }
}
