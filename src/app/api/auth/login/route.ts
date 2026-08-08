import { NextResponse } from "next/server";
import {
  verifyPassword,
  createSessionToken,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const password = (body?.password ?? "").toString();

  if (!verifyPassword(password)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = await createSessionToken();
  const res = NextResponse.json({ status: "success" });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return res;
}
