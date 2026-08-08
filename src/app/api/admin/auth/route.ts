import { NextResponse } from "next/server";

// Deprecated. Admin authentication now uses a single password + signed session
// cookie via /api/auth/login. This legacy endpoint (which previously contained
// hardcoded credentials) is disabled.
export async function POST() {
  return NextResponse.json(
    { error: "Deprecated endpoint. Use /api/auth/login." },
    { status: 410 }
  );
}
