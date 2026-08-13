import type { Metadata } from "next";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { AdminLogin } from "@/components/admin/admin-login";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kiwik OS Studio",
  // The studio must never appear in search results.
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Server-side gate for everything under /admin.
 *
 * The studio previously checked authentication in the browser, which meant the
 * entire admin bundle — and every CMS value baked into it — was served to
 * anyone who requested /admin, with a password prompt painted on top. The check
 * now happens on the server: without a valid session the children are never
 * rendered and never sent, so an unauthorised visitor receives only the login
 * screen.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const isAuthenticated = await verifySessionToken(token);

  if (!isAuthenticated) {
    // Password login is offered only when a password is actually configured;
    // otherwise Google is the sole route in.
    return <AdminLogin passwordLoginEnabled={Boolean(process.env.ADMIN_PASSWORD)} />;
  }

  return <>{children}</>;
}
