import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { MEDIA_PROXY_PREFIX } from "@/lib/media";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Real file upload for the admin media library.
 *
 * The studio's "Upload File" button used to be a text box for a link, so any
 * asset that was not already hosted somewhere public — a file on the laptop, a
 * Google Drive or WhatsApp share link, a blob: URL — saved fine and then
 * rendered as a broken image. Files now go into the public Supabase bucket
 * from here, server-side, and come back as a same-origin /media/... link, so
 * they also load on networks that block *.supabase.co (see lib/media.ts).
 */

const BUCKET = "partner-media";

// Vercel rejects function bodies over 4.5MB; the studio downscales images in
// the browser before sending, so this is only a backstop.
const MAX_BYTES = 4 * 1024 * 1024;

// SVG is deliberately excluded: it is served from our own origin under /media,
// and an SVG opened directly runs its embedded scripts as kiwik.one.
const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

const NO_STORE = { "Cache-Control": "no-store" };

function slugify(name: string): string {
  return (
    name
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "asset"
  );
}

export async function POST(request: Request) {
  // The middleware already requires a session for writes; checked again here
  // because this route spends a service-role credential.
  const isAdmin = await verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value);
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      { error: "Uploads are not configured: set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY." },
      { status: 503, headers: NO_STORE }
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Expected a multipart form upload." }, { status: 400, headers: NO_STORE });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file was attached." }, { status: 400, headers: NO_STORE });
  }
  const ext = ALLOWED[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "Unsupported file type. Use JPG, PNG, WebP, GIF or AVIF." },
      { status: 415, headers: NO_STORE }
    );
  }
  if (file.size === 0 || file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `File must be between 1 byte and ${MAX_BYTES / 1024 / 1024}MB.` },
      { status: 413, headers: NO_STORE }
    );
  }

  const month = new Date().toISOString().slice(0, 7);
  const objectPath = `uploads/${month}/${slugify(file.name)}-${randomUUID().slice(0, 8)}.${ext}`;

  try {
    const res = await fetch(
      `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/${BUCKET}/${objectPath}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          apikey: serviceKey,
          "Content-Type": file.type,
          "Cache-Control": "max-age=31536000",
          "x-upsert": "false",
        },
        body: Buffer.from(await file.arrayBuffer()),
      }
    );
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("Media upload to Supabase failed:", res.status, detail);
      return NextResponse.json(
        { error: `Storage rejected the upload (${res.status}).` },
        { status: 502, headers: NO_STORE }
      );
    }
  } catch (error) {
    console.error("Media upload to Supabase failed:", error);
    return NextResponse.json({ error: "Could not reach storage." }, { status: 502, headers: NO_STORE });
  }

  return NextResponse.json(
    {
      status: "success",
      url: `${MEDIA_PROXY_PREFIX}${BUCKET}/${objectPath}`,
      mimeType: file.type,
      sizeBytes: file.size,
    },
    { headers: NO_STORE }
  );
}
