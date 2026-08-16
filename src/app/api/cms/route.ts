import { NextResponse } from "next/server";
import { cachedJson } from "@/lib/api-cache";
import { sql, ensureDbTables } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  "Pragma": "no-cache",
  "Expires": "0"
};

export async function GET(request: Request) {
  try {
    await ensureDbTables();
    const rows = await sql`SELECT data FROM site_cms WHERE key = 'main' LIMIT 1;`;
    if (rows.length > 0 && rows[0].data) {
      return cachedJson({ status: "ok", cms: rows[0].data }, request);
    }
    return cachedJson({ status: "ok", cms: null }, request);
  } catch (error) {
    console.warn("GET /api/cms DB query fallback:", error);
    return cachedJson({ status: "ok", cms: null, fallback: true }, request);
  }
}

export async function POST(request: Request) {
  try {
    await ensureDbTables();
    const body = await request.json();

    // GET returns { status, cms: <data> } but this handler used to store the
    // whole body verbatim. A client that read the CMS, edited it, and posted it
    // back in the same shape it received therefore wrote { cms: { ... } } into
    // the row, burying every key one level down. Nothing failed loudly: the
    // response still said "success", and the site fell back to store defaults
    // so the damage only showed up as edits that silently stopped applying.
    //
    // Accept either shape, and unwrap defensively in case a row was already
    // written nested.
    let payload = body;
    let unwrapped = 0;
    while (
      payload &&
      typeof payload === "object" &&
      !Array.isArray(payload) &&
      payload.cms &&
      typeof payload.cms === "object" &&
      unwrapped < 5
    ) {
      payload = payload.cms;
      unwrapped++;
    }
    if (unwrapped > 0) {
      console.warn(`POST /api/cms: unwrapped ${unwrapped} level(s) of { cms: … } nesting.`);
    }

    // A CMS document is an object with many keys; refusing anything else stops
    // a malformed request from replacing the whole site's content.
    if (!payload || typeof payload !== "object" || Array.isArray(payload) || Object.keys(payload).length === 0) {
      return NextResponse.json(
        { status: "error", persisted: false, error: "Invalid CMS payload." },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    await sql`
      INSERT INTO site_cms (key, data, updated_at)
      VALUES ('main', ${sql.json(payload)}, CURRENT_TIMESTAMP)
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
