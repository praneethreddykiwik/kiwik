import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

/**
 * Write access to the API defaults to CLOSED.
 *
 * This was an allowlist of protected prefixes — /api/cms, /api/projects,
 * /api/products — which meant a route not on that list was open to anonymous
 * writes. Adding an endpoint and forgetting to extend the list silently shipped
 * it unauthenticated, and nothing in the new route's own file would show it.
 * The safe default is the opposite: every mutating request needs a session
 * unless the path is deliberately listed as public below.
 */
const PUBLIC_WRITE_PREFIXES = [
  "/api/auth", // login, logout, the Google OAuth handshake
  "/api/chat", // the site assistant
  "/api/visitors", // anonymous presence ping
  "/api/subscribe", // newsletter signup
  "/api/contact", // contact form POST — its PATCH re-checks the session itself
];
const WRITE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!WRITE_METHODS.has(req.method.toUpperCase())) {
    return NextResponse.next();
  }

  const isPublicWrite = PUBLIC_WRITE_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  // /api/contact is public to POST but its PATCH mutates stored submissions, so
  // that verb stays behind the session check even though the prefix is public.
  const isContactAdminWrite =
    (pathname === "/api/contact" || pathname.startsWith("/api/contact/")) &&
    req.method.toUpperCase() !== "POST";

  if (isPublicWrite && !isContactAdminWrite) {
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
