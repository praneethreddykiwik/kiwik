import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { OAUTH_STATE_COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * Step 1 of Google sign-in: send the admin to Google's consent screen.
 *
 * A random `state` value is stored in a short-lived httpOnly cookie and echoed
 * back by Google, so the callback can prove the response belongs to a flow this
 * browser actually started (CSRF protection). Without it, an attacker could
 * feed a victim a crafted callback URL.
 */
export async function GET(request: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const origin = new URL(request.url).origin;

  if (!clientId) {
    return NextResponse.redirect(
      `${origin}/admin?error=${encodeURIComponent("Google sign-in is not configured on this deployment.")}`
    );
  }

  const state = crypto.randomUUID();

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${origin}/api/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
    state,
    // `select_account` so a signed-in personal account doesn't silently become
    // the admin identity on a shared machine.
    prompt: "select_account",
  });

  const res = NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );

  (await cookies()).set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });

  return res;
}
