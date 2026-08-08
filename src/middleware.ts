import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

// Only mutations to CMS content require an authenticated admin session.
// Public reads (GET) and public write endpoints (visitor telemetry, chat) stay open.
const PROTECTED_WRITE_PREFIXES = ["/api/cms", "/api/projects", "/api/products"];
const WRITE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtectedPath = PROTECTED_WRITE_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  if (!isProtectedPath || !WRITE_METHODS.has(req.method.toUpperCase())) {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!(await verifySessionToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
