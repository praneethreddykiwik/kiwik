import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sql, ensureDbTables } from "@/lib/db";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { validateEmail, validatePhone, validateRequired, validateLength } from "@/lib/validation";

/**
 * Contact form.
 *
 * This is the only endpoint on the site where an anonymous visitor writes a row,
 * so it is the one that has to assume the caller is hostile. Everything the
 * browser sends is re-validated here — the client-side checks exist to give fast
 * feedback, not to enforce anything — and Postgres CHECK constraints sit behind
 * this as a third layer, so a malformed row cannot be written by any path.
 *
 * Nothing is trusted from the payload except the six declared fields; a caller
 * cannot set `status`, `id` or `created_at`.
 */
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" } as const;

/** Per-email and global flood limits, counted in the database.
 *  In-memory counters are useless here: each Vercel invocation may be a fresh
 *  instance, so a limiter that lives in process memory resets constantly. */
const MAX_PER_EMAIL_PER_HOUR = 3;
const MAX_GLOBAL_PER_10_MIN = 20;

type Field = { value: string; error: string | null };

function collapseWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400, headers: NO_STORE });
  }
  const b = body as Record<string, unknown>;

  // Honeypot: a field hidden from people and invisible to assistive tech is
  // only ever filled by a bot walking the DOM. Answer 200 so the bot cannot
  // tell it was caught and start probing for what tripped the filter.
  if (typeof b.website === "string" && b.website.trim() !== "") {
    console.warn("Contact honeypot triggered; submission discarded.");
    return NextResponse.json({ status: "success" }, { headers: NO_STORE });
  }

  const str = (v: unknown) => (typeof v === "string" ? v : "");
  const name = collapseWhitespace(str(b.name));
  const email = str(b.email).trim().toLowerCase();
  const phone = collapseWhitespace(str(b.phone));
  const company = collapseWhitespace(str(b.company));
  const subject = collapseWhitespace(str(b.subject));
  // Message keeps its line breaks; only the outer padding is trimmed.
  const message = str(b.message).trim();

  const fields: Record<string, Field> = {
    name: {
      value: name,
      error: validateRequired(str(b.name), "Name") ?? validateLength(name, { min: 2, max: 100, label: "Name" }),
    },
    email: { value: email, error: validateEmail(email) },
    // Optional fields validate only when the visitor actually filled them in.
    phone: { value: phone, error: phone ? validatePhone(phone) : null },
    company: { value: company, error: company ? validateLength(company, { max: 120, label: "Company" }) : null },
    subject: {
      value: subject,
      error: validateRequired(str(b.subject), "Subject") ?? validateLength(subject, { min: 3, max: 150, label: "Subject" }),
    },
    message: {
      value: message,
      error: validateRequired(str(b.message), "Message") ?? validateLength(message, { min: 10, max: 5000, label: "Message" }),
    },
  };

  const fieldErrors: Record<string, string> = {};
  for (const [key, f] of Object.entries(fields)) if (f.error) fieldErrors[key] = f.error;
  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      { error: "Please correct the highlighted fields.", fieldErrors },
      { status: 400, headers: NO_STORE }
    );
  }

  try {
    await ensureDbTables();

    const [recent] = await sql`
      SELECT
        count(*) FILTER (WHERE email = ${email} AND created_at > now() - interval '1 hour')::int AS by_email,
        count(*) FILTER (WHERE created_at > now() - interval '10 minutes')::int                  AS global
      FROM contact_submissions;
    `;

    if (Number(recent?.by_email ?? 0) >= MAX_PER_EMAIL_PER_HOUR) {
      return NextResponse.json(
        { error: "You've already sent a few messages. We'll be in touch shortly." },
        { status: 429, headers: NO_STORE }
      );
    }
    if (Number(recent?.global ?? 0) >= MAX_GLOBAL_PER_10_MIN) {
      return NextResponse.json(
        { error: "We're receiving a lot of messages right now. Please try again in a few minutes." },
        { status: 429, headers: NO_STORE }
      );
    }

    // Parameterised throughout — values never become part of the SQL text.
    const [row] = await sql`
      INSERT INTO contact_submissions (name, email, phone, company, subject, message)
      VALUES (
        ${fields.name.value}, ${fields.email.value},
        ${phone || null}, ${company || null},
        ${fields.subject.value}, ${fields.message.value}
      )
      RETURNING id, created_at;
    `;

    console.warn(`Contact submission #${row.id} received.`);
    return NextResponse.json({ status: "success", id: Number(row.id) }, { headers: NO_STORE });
  } catch (error) {
    console.error("Contact submission failed:", error);
    // Saying "sent" on a failed write is the bug this codebase already had in
    // the newsletter form; the visitor must be told it did not go through.
    return NextResponse.json(
      { error: "We couldn't send that right now. Please email us directly instead." },
      { status: 503, headers: NO_STORE }
    );
  }
}

/** Admin-only: the studio inbox. */
export async function GET() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!(await verifySessionToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE });
  }
  try {
    await ensureDbTables();
    const rows = await sql`
      SELECT id, name, email, phone, company, subject, message, status, created_at
      FROM contact_submissions
      ORDER BY created_at DESC
      LIMIT 200;
    `;
    return NextResponse.json({ status: "ok", submissions: rows }, { headers: NO_STORE });
  } catch (error) {
    console.error("GET /api/contact failed:", error);
    return NextResponse.json({ error: "Database unavailable." }, { status: 503, headers: NO_STORE });
  }
}

/** Admin-only: mark read/replied/archived, or delete. */
export async function PATCH(request: Request) {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!(await verifySessionToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE });
  }
  const body = await request.json().catch(() => null);
  const id = Number((body as { id?: unknown } | null)?.id);
  const status = String((body as { status?: unknown } | null)?.status ?? "");
  const del = Boolean((body as { delete?: unknown } | null)?.delete);

  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400, headers: NO_STORE });
  }

  try {
    if (del) {
      await sql`DELETE FROM contact_submissions WHERE id = ${id};`;
      return NextResponse.json({ status: "success" }, { headers: NO_STORE });
    }
    // Whitelist rather than pass-through, so the CHECK constraint is never the
    // thing that has to catch a bad value.
    if (!["new", "read", "replied", "archived"].includes(status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400, headers: NO_STORE });
    }
    await sql`UPDATE contact_submissions SET status = ${status} WHERE id = ${id};`;
    return NextResponse.json({ status: "success" }, { headers: NO_STORE });
  } catch (error) {
    console.error("PATCH /api/contact failed:", error);
    return NextResponse.json({ error: "Database unavailable." }, { status: 503, headers: NO_STORE });
  }
}
