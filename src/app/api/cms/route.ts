import { NextResponse } from "next/server";
import { sql, ensureDbTables } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  "Pragma": "no-cache",
  "Expires": "0"
};

export async function GET() {
  try {
    await ensureDbTables();
    const rows = await sql`SELECT data FROM site_cms WHERE key = 'main' LIMIT 1;`;
    if (rows.length > 0 && rows[0].data) {
      return NextResponse.json(
        { status: "ok", cms: rows[0].data },
        { headers: NO_CACHE_HEADERS }
      );
    }
    return NextResponse.json(
      { status: "ok", cms: null },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    console.warn("GET /api/cms DB query fallback:", error);
    return NextResponse.json(
      { status: "ok", cms: null, fallback: true },
      { headers: NO_CACHE_HEADERS }
    );
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
    return NextResponse.json(
      {
        status: "success",
        message: "CMS state updated globally in the database",
        timestamp: new Date().toISOString()
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    console.error("POST /api/cms failed:", error);
    return NextResponse.json(
      {
        status: "error",
        persisted: false,
        error: "Database unavailable — CMS changes were not saved.",
      },
      { status: 503, headers: NO_CACHE_HEADERS }
    );
  }
}
