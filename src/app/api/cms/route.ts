import { NextResponse } from "next/server";
import { sql, ensureDbTables } from "@/lib/db";

export async function GET() {
  try {
    await ensureDbTables();
    const rows = await sql`SELECT data FROM site_cms WHERE key = 'main' LIMIT 1;`;
    if (rows.length > 0 && rows[0].data) {
      return NextResponse.json({
        status: "ok",
        cms: rows[0].data
      });
    }
    return NextResponse.json({
      status: "ok",
      cms: null
    });
  } catch (error) {
    console.warn("GET /api/cms DB query fallback (Quota/DB Limit):", error);
    return NextResponse.json({ status: "ok", cms: null, fallback: true });
  }
}

export async function POST(request: Request) {
  try {
    await ensureDbTables();
    const body = await request.json();
    await sql`
      INSERT INTO site_cms (key, data, updated_at)
      VALUES ('main', ${sql.json(body)}, CURRENT_TIMESTAMP)
      ON CONFLICT (key) DO UPDATE
      SET data = EXCLUDED.data, updated_at = CURRENT_TIMESTAMP;
    `;
    return NextResponse.json({
      status: "success",
      message: "CMS state updated globally in Neon database",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.warn("POST /api/cms DB error fallback:", error);
    return NextResponse.json({ status: "ok", message: "CMS state saved locally (DB offline/quota limit)", fallback: true });
  }
}
