import fs from "fs";
import path from "path";
import postgres from "postgres";

function loadEnv() {
  const envFiles = [".env.local", ".env"];
  for (const file of envFiles) {
    const filePath = path.resolve(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf8");
      content.split("\n").forEach((line) => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const key = match[1];
          let value = match[2] || "";
          if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
          if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
          if (!process.env[key]) {
            process.env[key] = value;
          }
        }
      });
    }
  }
}

loadEnv();

const SUPABASE_DB_URL = process.env.DATABASE_URL;
if (!SUPABASE_DB_URL) throw new Error("DATABASE_URL is not set — export it before running this script.");

console.log("=== POPULATING CLIENT SUPABASE DATABASE WITH ALL DATA ===");
console.log("Target Database:", SUPABASE_DB_URL ? SUPABASE_DB_URL.replace(/:[^:@]+@/, ":****@") : "MISSING");

const sql = postgres(SUPABASE_DB_URL, {
  prepare: false,
  ssl: "require",
  max: 1,
  idle_timeout: 5,
  connect_timeout: 10
});

import { projects as defaultProjects } from "../src/data/projects";
import { partnerProducts as defaultProducts } from "../src/data/partner-products";

async function seed() {
  try {
    // 1. Ensure Schema
    console.log("\n[1/4] Ensuring All Supabase Tables Exist...");
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
        data JSONB,
        sort_order INT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(100) PRIMARY KEY,
        slug VARCHAR(100) UNIQUE NOT NULL,
        name VARCHAR(255),
        data JSONB,
        sort_order INT,
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
    console.log("✓ All 5 tables created on Supabase!");

    // 2. Seed Projects
    console.log("\n[2/4] Seeding Projects into Supabase...");
    let pOrder = 0;
    for (const p of defaultProjects) {
      await sql`
        INSERT INTO projects (
          id, slug, name, tagline, description, status, completion_percent, category, cover_image, images, github_url, live_url, tech_stack, data, sort_order
        ) VALUES (
          ${p.id}, ${p.slug}, ${p.name}, ${p.tagline || ""}, ${p.description || ""}, ${p.status || "beta"},
          ${p.completionPercent || 100}, ${p.category || "web"}, ${p.coverImage || ""}, ${sql.json(p.images || [])},
          ${p.githubUrl || ""}, ${p.liveUrl || ""}, ${sql.json(p.techStack || [])}, ${sql.json(p)}, ${pOrder++}
        ) ON CONFLICT (id) DO UPDATE SET
          slug = EXCLUDED.slug,
          name = EXCLUDED.name,
          tagline = EXCLUDED.tagline,
          description = EXCLUDED.description,
          status = EXCLUDED.status,
          completion_percent = EXCLUDED.completion_percent,
          category = EXCLUDED.category,
          cover_image = EXCLUDED.cover_image,
          images = EXCLUDED.images,
          github_url = EXCLUDED.github_url,
          live_url = EXCLUDED.live_url,
          tech_stack = EXCLUDED.tech_stack,
          data = EXCLUDED.data,
          sort_order = EXCLUDED.sort_order,
          updated_at = CURRENT_TIMESTAMP;
      `;
    }
    console.log(`✓ Inserted/Upserted ${defaultProjects.length} Projects into Supabase!`);

    // 3. Seed Products
    console.log("\n[3/4] Seeding Products into Supabase...");
    if (defaultProducts && defaultProducts.length > 0) {
      let prOrder = 0;
      for (const prod of defaultProducts) {
        await sql`
          INSERT INTO products (
            id, slug, name, data, sort_order
          ) VALUES (
            ${prod.id}, ${prod.slug}, ${prod.name}, ${sql.json(prod)}, ${prOrder++}
          ) ON CONFLICT (id) DO UPDATE SET
            slug = EXCLUDED.slug,
            name = EXCLUDED.name,
            data = EXCLUDED.data,
            sort_order = EXCLUDED.sort_order,
            updated_at = CURRENT_TIMESTAMP;
        `;
      }
      console.log(`✓ Inserted/Upserted ${defaultProducts.length} Products into Supabase!`);
    }

    // 4. Seed Admin User Credentials
    console.log("\n[4/4] Seeding Admin User Credentials into Supabase...");
    await sql`
      INSERT INTO admin_users (
        id, email, password_hash, role
      ) VALUES (
        'admin-1', 'praneeth@kiwik.one', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'
      ) ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        password_hash = EXCLUDED.password_hash;
    `;
    console.log("✓ Admin User initialized on Supabase!");

    // Verification
    console.log("\n=== VERIFYING FINAL SUPABASE ROW COUNTS ===");
    const projRes = await sql`SELECT count(*)::int as count FROM projects;`;
    const prodRes = await sql`SELECT count(*)::int as count FROM products;`;
    const cmsRes = await sql`SELECT count(*)::int as count FROM site_cms;`;
    const adminRes = await sql`SELECT count(*)::int as count FROM admin_users;`;

    console.log(`• Projects count in Supabase: ${projRes[0].count}`);
    console.log(`• Products count in Supabase: ${prodRes[0].count}`);
    console.log(`• site_cms count in Supabase: ${cmsRes[0].count}`);
    console.log(`• Admin users count in Supabase: ${adminRes[0].count}`);
    console.log("==========================================");
    console.log("🎉 ALL DATA POPULATED SUCCESSFULLY INTO CLIENT SUPABASE DATABASE!");

  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    await sql.end();
  }
}

seed();
