import { NextResponse } from "next/server";
import { sql, ensureDbTables } from "@/lib/db";
import { validateEmail } from "@/lib/validation";
import { clientKey, rateLimit } from "@/lib/rate-limit";

/**
 * Newsletter signup.
 *
 * The footer form used to set a "Subscribed successfully!" message locally and
 * discard the address — there was no endpoint behind it. Client-side validation
 * is repeated here because it is a convenience, not a control: anything can
 * POST to this route directly.
 */
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  // Unlimited signups let a script fill the table and burn the database quota
  // that this project has already exceeded once.
  const limit = rateLimit(clientKey(request, "subscribe"), 5, 60_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again in a minute." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  const body = await request.json().catch(() => null);
  const email = String((body as { email?: unknown } | null)?.email ?? "").trim().toLowerCase();

  const problem = validateEmail(email);
  if (problem) {
    return NextResponse.json({ error: problem }, { status: 400 });
  }

  try {
    await ensureDbTables();
    // Re-subscribing is not an error worth showing a visitor.
    await sql`
      INSERT INTO newsletter_subscribers (email, source)
      VALUES (${email}, 'footer')
      ON CONFLICT (email) DO NOTHING;
    `;
    return NextResponse.json({ status: "success", persisted: true });
  } catch (error) {
    console.error("Newsletter subscribe failed:", error);
    // Reporting success on a failed write is what made the old form dishonest.
    return NextResponse.json(
      { error: "We couldn't save that right now. Please try again shortly.", persisted: false },
      { status: 503 }
    );
  }
}
