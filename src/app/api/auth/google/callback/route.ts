import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  createSessionToken,
  sessionCookieOptions,
  isAllowedAdminEmail,
  OAUTH_STATE_COOKIE,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

function deny(origin: string, message: string) {
  return NextResponse.redirect(`${origin}/admin?error=${encodeURIComponent(message)}`);
}

/**
 * Step 2 of Google sign-in.
 *
 * Exchanges the one-time code for an id_token, has Google validate that token's
 * signature via its tokeninfo endpoint, then applies two independent checks
 * before issuing a session:
 *
 *   1. the token was issued for THIS client (aud) — otherwise a token minted
 *      for any other Google app would be accepted;
 *   2. the verified email is on the admin allowlist.
 *
 * Only then is the normal Kiwik session cookie issued, so the rest of the app's
 * auth is untouched — Google is an additional way in, not a second system.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const oauthError = url.searchParams.get("error");

  if (oauthError) return deny(origin, "Google sign-in was cancelled.");
  if (!code) return deny(origin, "Google did not return an authorization code.");

  const jar = await cookies();
  const expectedState = jar.get(OAUTH_STATE_COOKIE)?.value;
  jar.delete(OAUTH_STATE_COOKIE);

  if (!expectedState || !state || state !== expectedState) {
    return deny(origin, "Sign-in request could not be verified. Please try again.");
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return deny(origin, "Google sign-in is not configured on this deployment.");
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: `${origin}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      console.error("Google token exchange failed:", tokenRes.status, await tokenRes.text());
      return deny(origin, "Google sign-in failed. Please try again.");
    }

    const { id_token: idToken } = await tokenRes.json();
    if (!idToken) return deny(origin, "Google did not return an identity token.");

    // Google validates the signature and expiry for us; doing it here avoids
    // pulling in a JWT library and hand-rolling key rotation.
    const infoRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`
    );
    if (!infoRes.ok) return deny(origin, "Could not verify the Google identity token.");

    const claims = await infoRes.json();

    if (claims.aud !== clientId) {
      console.error("Google id_token audience mismatch");
      return deny(origin, "Could not verify the Google identity token.");
    }
    if (claims.email_verified !== true && claims.email_verified !== "true") {
      return deny(origin, "That Google account does not have a verified email address.");
    }
    if (!isAllowedAdminEmail(claims.email)) {
      return deny(
        origin,
        `${claims.email || "That account"} is not authorised for the Kiwik admin studio.`
      );
    }

    const token = await createSessionToken();
    if (!token) return deny(origin, "Admin auth is not configured on this deployment.");

    const res = NextResponse.redirect(`${origin}/admin`);
    res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
    return res;
  } catch (err) {
    console.error("Google callback error:", err);
    return deny(origin, "Google sign-in failed. Please try again.");
  }
}
