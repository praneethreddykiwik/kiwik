import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import {
  readAdminSecurity,
  writeAdminSecurity,
  resolveAllowedEmails,
  verifyAdminPassword,
  hashPassword,
  isValidEmail,
  normaliseEmail,
} from "@/lib/admin-security";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

/** Current access settings. Never returns the password hash or salt. */
export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // One read, everything derived from it. resolveAllowedEmails() and
  // isPasswordLoginOn() each open their own connection, so calling them here
  // alongside readAdminSecurity() would be three round trips for one payload.
  const stored = await readAdminSecurity();
  const envEmails = (process.env.ADMIN_ALLOWED_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  return NextResponse.json({
    allowedEmails: [...new Set([...stored.allowedEmails, ...envEmails])],
    passwordLoginEnabled:
      stored.passwordLoginEnabled ||
      (process.env.ADMIN_PASSWORD_LOGIN === "true" && Boolean(process.env.ADMIN_PASSWORD)),
    hasStoredPassword: Boolean(stored.passwordHash),
    envEmails,
  });
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const stored = await readAdminSecurity();
  const action = String((body as any).action || "");

  // ── Allowlist ─────────────────────────────────────────────────────────────
  if (action === "addEmail" || action === "removeEmail") {
    const email = normaliseEmail(String((body as any).email || ""));
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "That doesn't look like a valid email address." }, { status: 400 });
    }

    const current = new Set(stored.allowedEmails);

    if (action === "addEmail") {
      current.add(email);
    } else {
      current.delete(email);
      // Removing the final administrator would leave the studio unreachable,
      // so the last entry cannot be deleted from here.
      const remaining = new Set([
        ...current,
        ...(process.env.ADMIN_ALLOWED_EMAILS || "")
          .split(",")
          .map((e) => e.trim().toLowerCase())
          .filter(Boolean),
      ]);
      if (remaining.size === 0) {
        return NextResponse.json(
          { error: "You can't remove the last administrator — add another one first." },
          { status: 400 }
        );
      }
    }

    await writeAdminSecurity({ ...stored, allowedEmails: [...current] });
    console.warn(`Admin allowlist ${action === "addEmail" ? "grant" : "revoke"}: ${email}`);
    return NextResponse.json({ status: "success", allowedEmails: await resolveAllowedEmails() });
  }

  // ── Password ──────────────────────────────────────────────────────────────
  if (action === "changePassword") {
    const currentPassword = String((body as any).currentPassword || "");
    const newPassword = String((body as any).newPassword || "");

    if (newPassword.length < 8) {
      return NextResponse.json({ error: "New password must be at least 8 characters." }, { status: 400 });
    }

    // Proving knowledge of the current password stops a hijacked session from
    // silently changing the credential and locking the real owner out.
    if (!(await verifyAdminPassword(currentPassword))) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 403 });
    }

    const { hash, salt } = await hashPassword(newPassword);
    await writeAdminSecurity({
      ...stored,
      passwordHash: hash,
      passwordSalt: salt,
      passwordLoginEnabled: true,
    });
    console.warn("Admin password changed from the studio.");
    return NextResponse.json({ status: "success" });
  }

  if (action === "setPasswordLogin") {
    const enabled = Boolean((body as any).enabled);
    // Turning the password door off is always safe; turning it on requires a
    // stored password so it can't fall back to a value from git history.
    if (enabled && !stored.passwordHash) {
      return NextResponse.json(
        { error: "Set a password first, then enable password login." },
        { status: 400 }
      );
    }
    await writeAdminSecurity({ ...stored, passwordLoginEnabled: enabled });
    return NextResponse.json({ status: "success", passwordLoginEnabled: enabled });
  }

  return NextResponse.json({ error: "Unknown action." }, { status: 400 });
}
