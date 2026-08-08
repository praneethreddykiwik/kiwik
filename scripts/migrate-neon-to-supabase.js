const postgres = require("postgres");
const { neon } = require("@neondatabase/serverless");

const NEON_DB_URL = "postgresql://neondb_owner:npg_a1nVOCkRD9wI@ep-aged-cloud-auski0i0-pooler.c-10.us-east-1.aws.neon.tech/neondb?sslmode=require";

// Read Supabase DATABASE_URL from environment or fallback
const SUPABASE_DB_URL = process.env.DATABASE_URL || "postgresql://kiwik_app.exhprdqnpxsebitxsmoa:df781c1661c1c40de6564e2c5b34d914c8036db9@aws-0-ap-south-1.pooler.supabase.com:6543/postgres";

console.log("=== NEON DB TO SUPABASE DATA MIGRATION ENGINE ===");
console.log("Source (Neon DB):", NEON_DB_URL.replace(/:[^:@]+@/, ":****@"));
console.log("Destination (Supabase):", SUPABASE_DB_URL.replace(/:[^:@]+@/, ":****@"));

const neonSql = neon(NEON_DB_URL);
const supabaseSql = postgres(SUPABASE_DB_URL, {
  prepare: false,
  ssl: "require",
  idle_timeout: 10,
  connect_timeout: 20
});

async function migrate() {
  try {
    // 1. Ensure Supabase DDL schema exists
    console.log("\n[1/5] Ensuring DDL Schema on Supabase...");

    await supabaseSql`
      CREATE TABLE IF NOT EXISTS site_cms (
        key VARCHAR(100) PRIMARY KEY,
        data JSONB NOT NULL DEFAULT '{}'::jsonb,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await supabaseSql`
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

    await supabaseSql`
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

    await supabaseSql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id VARCHAR(100) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await supabaseSql`
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

    console.log("✓ Schema verification on Supabase completed!");

    // 2. Read & Migrate site_cms
    console.log("\n[2/5] Migrating site_cms table...");
    let neonCMS = [];
    try {
      neonCMS = await neonSql`SELECT * FROM site_cms;`;
    } catch (e) {
      console.warn("Neon site_cms read notice:", e.message);
    }

    if (neonCMS.length > 0) {
      for (const row of neonCMS) {
        await supabaseSql`
          INSERT INTO site_cms (key, data, updated_at)
          VALUES (${row.key}, ${supabaseSql.json(row.data)}, ${row.updated_at || new Date()})
          ON CONFLICT (key) DO UPDATE SET
            data = EXCLUDED.data,
            updated_at = EXCLUDED.updated_at;
        `;
      }
      console.log(`✓ Migrated ${neonCMS.length} site_cms record(s) from Neon to Supabase!`);
    } else {
      console.log("ℹ No site_cms records found on Neon DB to migrate.");
    }

    // 3. Read & Migrate projects
    console.log("\n[3/5] Migrating projects table...");
    let neonProjects = [];
    try {
      neonProjects = await neonSql`SELECT * FROM projects;`;
    } catch (e) {
      console.warn("Neon projects read notice:", e.message);
    }

    if (neonProjects.length > 0) {
      for (const p of neonProjects) {
        await supabaseSql`
          INSERT INTO projects (
            id, slug, name, tagline, description, status, completion_percent, category, cover_image, images, github_url, live_url, tech_stack, data, sort_order, created_at, updated_at
          ) VALUES (
            ${p.id}, ${p.slug}, ${p.name}, ${p.tagline || ""}, ${p.description || ""}, ${p.status || "beta"},
            ${p.completion_percent || p.completionPercent || 100}, ${p.category || "web"}, ${p.cover_image || p.coverImage || ""},
            ${supabaseSql.json(p.images || [])}, ${p.github_url || p.githubUrl || ""}, ${p.live_url || p.liveUrl || ""},
            ${supabaseSql.json(p.tech_stack || p.techStack || [])}, ${p.data ? supabaseSql.json(p.data) : null},
            ${p.sort_order || 0}, ${p.created_at || new Date()}, ${p.updated_at || new Date()}
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
            updated_at = EXCLUDED.updated_at;
        `;
      }
      console.log(`✓ Migrated ${neonProjects.length} project(s) from Neon to Supabase!`);
    } else {
      console.log("ℹ No projects records found on Neon DB to migrate.");
    }

    // 4. Read & Migrate admin_users
    console.log("\n[4/5] Migrating admin_users table...");
    let neonAdmins = [];
    try {
      neonAdmins = await neonSql`SELECT * FROM admin_users;`;
    } catch (e) {
      console.warn("Neon admin_users read notice:", e.message);
    }

    if (neonAdmins.length > 0) {
      for (const u of neonAdmins) {
        await supabaseSql`
          INSERT INTO admin_users (id, email, password_hash, role, created_at)
          VALUES (${u.id}, ${u.email}, ${u.password_hash}, ${u.role || "admin"}, ${u.created_at || new Date()})
          ON CONFLICT (id) DO UPDATE SET
            email = EXCLUDED.email,
            password_hash = EXCLUDED.password_hash,
            role = EXCLUDED.role;
        `;
      }
      console.log(`✓ Migrated ${neonAdmins.length} admin user(s) from Neon to Supabase!`);
    } else {
      console.log("ℹ No admin_users records found on Neon DB to migrate.");
    }

    // 5. Verify Supabase Data Counts
    console.log("\n[5/5] Verifying Supabase Tables Data...");
    const cmsCount = await supabaseSql`SELECT count(*)::int as count FROM site_cms;`;
    const projCount = await supabaseSql`SELECT count(*)::int as count FROM projects;`;
    const prodCount = await supabaseSql`SELECT count(*)::int as count FROM products;`;
    const adminCount = await supabaseSql`SELECT count(*)::int as count FROM admin_users;`;

    console.log("\n--- SUPABASE DATA VERIFICATION SUMMARY ---");
    console.log(`• site_cms records: ${cmsCount[0].count}`);
    console.log(`• projects records: ${projCount[0].count}`);
    console.log(`• products records: ${prodCount[0].count}`);
    console.log(`• admin_users records: ${adminCount[0].count}`);
    console.log("=========================================");
    console.log("🎉 MIGRATION FROM NEON DB TO SUPABASE COMPLETED SUCCESSFULLY!");

  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    await supabaseSql.end();
  }
}

migrate();
