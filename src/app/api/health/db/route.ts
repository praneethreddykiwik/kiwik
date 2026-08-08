import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Deployment diagnostic for the database link.
 *
 * The content APIs deliberately degrade to static defaults when Postgres is
 * unreachable, which keeps the site up but makes a misconfigured deployment
 * look identical to a healthy one. This endpoint answers the one question that
 * distinguishes them: is the app actually talking to the database?
 *
 * It reports configuration presence and connectivity only — never the
 * connection string, credentials, or raw driver output.
 */
export async function GET() {
  const configured = {
    DATABASE_URL: Boolean(process.env.DATABASE_URL),
    AUTH_SECRET: Boolean(process.env.AUTH_SECRET),
    ADMIN_PASSWORD: Boolean(process.env.ADMIN_PASSWORD),
  };

  if (!configured.DATABASE_URL) {
    return NextResponse.json(
      {
        ok: false,
        connected: false,
        configured,
        reason: "DATABASE_URL_MISSING",
        message:
          "DATABASE_URL is not set in this environment. Every write is being discarded and every read is serving static defaults.",
      },
      { status: 503 }
    );
  }

  const startedAt = Date.now();
  try {
    const [{ n: cmsRows }] = await sql`SELECT count(*)::int AS n FROM site_cms;`;
    const [{ n: projectRows }] = await sql`SELECT count(*)::int AS n FROM projects;`;
    const [{ n: productRows }] = await sql`SELECT count(*)::int AS n FROM products;`;

    return NextResponse.json({
      ok: true,
      connected: true,
      configured,
      latencyMs: Date.now() - startedAt,
      rows: { site_cms: cmsRows, projects: projectRows, products: productRows },
      message:
        cmsRows > 0
          ? "Connected. CMS content is being served from the database."
          : "Connected, but site_cms is empty — save once from the admin studio to publish the current content.",
    });
  } catch (error) {
    // Surface only the driver's error code and a truncated message; the raw
    // error can contain host and role details.
    const code = (error as { code?: string })?.code ?? "UNKNOWN";
    const raw = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        ok: false,
        connected: false,
        configured,
        latencyMs: Date.now() - startedAt,
        reason: "CONNECTION_FAILED",
        code,
        message: raw.slice(0, 120),
      },
      { status: 503 }
    );
  }
}
