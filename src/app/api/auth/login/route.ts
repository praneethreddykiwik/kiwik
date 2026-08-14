import { NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";
import { verifyAdminPassword, isPasswordLoginOn } from "@/lib/admin-security";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const password = (body?.password ?? "").toString();

  if (!(await isPasswordLoginOn())) {
    return NextResponse.json(
      { error: "Password login is disabled. Use Continue with Google." },
      { status: 403 }
    );
  }

  if (!(await verifyAdminPassword(password))) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  console.warn("Admin session issued via password login.");

  const token = await createSessionToken();
  if (!token) {
    return NextResponse.json(
      { error: "Admin auth is not configured on this deployment (AUTH_SECRET missing)." },
      { status: 503 }
    );
  }
  const res = NextResponse.json({ status: "success" });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return res;
}
