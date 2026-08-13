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

/** Recoverable problems (cancelled, misconfigured, retryable) go back to the login screen. */
function retry(origin: string, message: string) {
  return NextResponse.redirect(`${origin}/admin?error=${encodeURIComponent(message)}`);
}

/**
 * A genuine authorisation failure — the account authenticated with Google but
 * is not on the admin allowlist.
 *
 * This returns a real 403 rather than bouncing back to the login screen, and
 * sets no cookie of any kind, so an unapproved account receives no session, no
 * token and no CMS data. Authenticating with Google is never, on its own,
 * sufficient to enter the studio.
 */
function accessDenied(email: string | undefined) {
  const who = email ? `<code>${email.replace(/[<>&"]/g, "")}</code>` : "That account";
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Access denied · Kiwik OS Studio</title>
<style>
  body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;
    background:#050608;color:#e5e7eb;font:400 15px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;padding:24px}
  .card{max-width:440px;text-align:center;background:rgba(23,23,23,.8);border:1px solid rgba(255,255,255,.1);
    border-radius:24px;padding:40px 32px}
  h1{font-size:20px;margin:0 0 12px;color:#fff}
  p{font-size:14px;color:#9ca3af;margin:0 0 24px}
  code{background:rgba(255,255,255,.06);padding:2px 6px;border-radius:6px;color:#e5e7eb;font-size:13px}
  a{display:inline-block;padding:10px 20px;border-radius:999px;background:#3b82f6;color:#fff;
    text-decoration:none;font-weight:700;font-size:13px}
</style></head><body><div class="card">
<h1>Access denied</h1>
<p>${who} is not an approved Kiwik administrator. No session was created.</p>
<a href="/">Return to Kiwik</a>
</div></body></html>`;

  return new NextResponse(html, {
    status: 403,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
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

  if (oauthError) return retry(origin, "Google sign-in was cancelled.");
  if (!code) return retry(origin, "Google did not return an authorization code.");

  const jar = await cookies();
  const expectedState = jar.get(OAUTH_STATE_COOKIE)?.value;
  jar.delete(OAUTH_STATE_COOKIE);

  if (!expectedState || !state || state !== expectedState) {
    return retry(origin, "Sign-in request could not be verified. Please try again.");
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return retry(origin, "Google sign-in is not configured on this deployment.");
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
      return retry(origin, "Google sign-in failed. Please try again.");
    }

    const { id_token: idToken } = await tokenRes.json();
    if (!idToken) return retry(origin, "Google did not return an identity token.");

    // Google validates the signature and expiry for us; doing it here avoids
    // pulling in a JWT library and hand-rolling key rotation.
    const infoRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`
    );
    if (!infoRes.ok) return retry(origin, "Could not verify the Google identity token.");

    const claims = await infoRes.json();

    if (claims.aud !== clientId) {
      console.error("Google id_token audience mismatch");
      return retry(origin, "Could not verify the Google identity token.");
    }
    if (claims.email_verified !== true && claims.email_verified !== "true") {
      return accessDenied(claims.email);
    }
    // Authentication succeeded; authorisation is a separate, explicit decision.
    if (!isAllowedAdminEmail(claims.email)) {
      console.warn(`Admin access denied for unlisted Google account: ${claims.email}`);
      return accessDenied(claims.email);
    }

    const token = await createSessionToken();
    if (!token) return retry(origin, "Admin auth is not configured on this deployment.");

    const res = NextResponse.redirect(`${origin}/admin`);
    res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
    return res;
  } catch (err) {
    console.error("Google callback error:", err);
    return retry(origin, "Google sign-in failed. Please try again.");
  }
}
