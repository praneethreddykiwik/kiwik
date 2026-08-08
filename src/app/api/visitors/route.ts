import { NextResponse } from "next/server";
import { sql, ensureDbTables } from "@/lib/db";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

// Fallback in-memory map for fast response when DB is initializing
const globalForVisitors = globalThis as unknown as {
  activeSessions: Map<string, { lastPing: number; pathname: string; deviceType: string; browserName: string }>;
  totalVisits: number;
};

if (!globalForVisitors.activeSessions) {
  globalForVisitors.activeSessions = new Map();
}
if (typeof globalForVisitors.totalVisits === "undefined") {
  globalForVisitors.totalVisits = 1;
}

export async function GET() {
  const isAdmin = await verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value);
  try {
    await ensureDbTables();

    // Query active visitors within last 45 seconds
    const activeRes = await sql`
      SELECT COUNT(*)::int as count 
      FROM site_visitor_sessions 
      WHERE last_ping >= NOW() - INTERVAL '45 seconds';
    `;

    // Query total unique visitors and total pageviews
    const totalsRes = await sql`
      SELECT 
        COUNT(*)::int as total_unique,
        COALESCE(SUM(pageviews), 0)::int as total_pageviews
      FROM site_visitor_sessions;
    `;

    // Query recent active sessions list for Admin Studio telemetry table
    const sessionsRes = await sql`
      SELECT 
        session_id as "sessionId",
        device_type as "deviceType",
        browser_name as "browserName",
        pathname,
        pageviews,
        first_seen as "firstSeen",
        last_ping as "lastPing"
      FROM site_visitor_sessions
      ORDER BY last_ping DESC
      LIMIT 12;
    `;

    const activeCount = Math.max(1, activeRes[0]?.count || 0);
    const totalUnique = Math.max(activeCount, totalsRes[0]?.total_unique || activeCount);
    const totalPageviews = Math.max(totalUnique, totalsRes[0]?.total_pageviews || totalUnique);

    return NextResponse.json({
      status: "ok",
      active: activeCount,
      totalUnique: totalUnique,
      totalPageviews: totalPageviews,
      // Per-visitor rows (paths they browsed, timings, device) are admin
      // telemetry, not public data. Aggregate counts stay open because the
      // public site renders the live visitor count.
      recentSessions: isAdmin ? (sessionsRes || []) : []
    });
  } catch (error) {
    console.error("GET /api/visitors DB error, falling back to memory:", error);
    
    // In-memory fallback
    const now = Date.now();
    for (const [id, s] of globalForVisitors.activeSessions.entries()) {
      if (now - s.lastPing > 45000) {
        globalForVisitors.activeSessions.delete(id);
      }
    }
    const activeCount = Math.max(1, globalForVisitors.activeSessions.size);

    return NextResponse.json({
      status: "ok",
      active: activeCount,
      totalUnique: Math.max(activeCount, globalForVisitors.totalVisits),
      totalPageviews: Math.max(activeCount, globalForVisitors.totalVisits),
      recentSessions: Array.from(globalForVisitors.activeSessions.entries()).map(([id, s]) => ({
        sessionId: id,
        deviceType: s.deviceType,
        browserName: s.browserName,
        pathname: s.pathname,
        pageviews: 1,
        lastPing: new Date(s.lastPing).toISOString()
      }))
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const userAgent = req.headers.get("user-agent") || "";
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const sessionId = body.sessionId || `sess_${Math.random().toString(36).substring(2, 10)}`;
    const pathname = body.pathname || "/";
    const deviceType = body.deviceType || (userAgent.includes("Mobile") ? "mobile" : userAgent.includes("Tablet") ? "tablet" : "desktop");
    const browserName = body.browserName || (userAgent.includes("Chrome") ? "Chrome" : userAgent.includes("Safari") ? "Safari" : userAgent.includes("Firefox") ? "Firefox" : "Browser");

    // In-memory ping recording
    globalForVisitors.totalVisits += 1;
    globalForVisitors.activeSessions.set(sessionId, {
      lastPing: Date.now(),
      pathname,
      deviceType,
      browserName
    });

    // DB Persistence
    await ensureDbTables();
    await sql`
      INSERT INTO site_visitor_sessions (
        session_id, ip_address, user_agent, device_type, browser_name, pathname, pageviews, last_ping
      ) VALUES (
        ${sessionId}, ${clientIp}, ${userAgent}, ${deviceType}, ${browserName}, ${pathname}, 1, CURRENT_TIMESTAMP
      )
      ON CONFLICT (session_id) DO UPDATE SET
        pathname = EXCLUDED.pathname,
        device_type = EXCLUDED.device_type,
        browser_name = EXCLUDED.browser_name,
        pageviews = site_visitor_sessions.pageviews + (CASE WHEN site_visitor_sessions.pathname != EXCLUDED.pathname THEN 1 ELSE 0 END),
        last_ping = CURRENT_TIMESTAMP;
    `;

    const activeRes = await sql`
      SELECT COUNT(*)::int as count 
      FROM site_visitor_sessions 
      WHERE last_ping >= NOW() - INTERVAL '45 seconds';
    `;

    const totalsRes = await sql`
      SELECT 
        COUNT(*)::int as total_unique,
        COALESCE(SUM(pageviews), 0)::int as total_pageviews
      FROM site_visitor_sessions;
    `;

    const activeCount = Math.max(1, activeRes[0]?.count || 1);
    const totalUnique = Math.max(activeCount, totalsRes[0]?.total_unique || activeCount);
    const totalPageviews = Math.max(totalUnique, totalsRes[0]?.total_pageviews || totalUnique);

    return NextResponse.json({
      status: "success",
      active: activeCount,
      totalUnique,
      totalPageviews
    });
  } catch (error) {
    console.error("POST /api/visitors DB error:", error);
    return NextResponse.json({
      status: "success",
      active: Math.max(1, globalForVisitors.activeSessions.size),
      totalUnique: globalForVisitors.totalVisits,
      totalPageviews: globalForVisitors.totalVisits
    });
  }
}
