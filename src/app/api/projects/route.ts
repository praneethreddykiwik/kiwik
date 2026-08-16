import { NextResponse } from "next/server";
import { cachedJson } from "@/lib/api-cache";
import { sql, ensureDbTables } from "@/lib/db";
import { projects as defaultProjects } from "@/data/projects";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  "Pragma": "no-cache",
  "Expires": "0"
};

export async function GET(request: Request) {
  try {
    await ensureDbTables();
    const rows = await sql`
      SELECT id, slug, name, tagline, description, status, completion_percent as "completionPercent",
             category, cover_image as "coverImage", images, github_url as "githubUrl", live_url as "liveUrl",
             tech_stack as "techStack", data, created_at as "createdAt", updated_at as "lastUpdated"
      FROM projects
      ORDER BY sort_order ASC NULLS LAST, created_at DESC;
    `;
    if (rows && rows.length > 0) {
      const projects = rows.map((r: any) => {
        const { data, ...flat } = r;
        return data && typeof data === "object"
          ? { ...data, id: r.id, slug: r.slug, lastUpdated: r.lastUpdated }
          : flat;
      });
      return cachedJson({ status: "ok", projects }, request);
    }
    // An empty table is a real, intentional state — the operator deleted every
    // project. Returning the seed array here made the client repopulate its
    // store with defaults and then POST them all back, so deletions undid
    // themselves. Only a genuine DB failure falls back to seeds (below).
    return cachedJson({ status: "ok", projects: [] }, request);
  } catch (error) {
    console.warn("GET /api/projects DB error fallback:", error);
    return cachedJson({ status: "ok", projects: defaultProjects, fallback: true }, request);
  }
}

export async function POST(request: Request) {
  try {
    await ensureDbTables();
    const p = await request.json();

    if (!p.id || !p.slug || !p.name) {
      return NextResponse.json({ error: "Missing required fields (id, slug, name)" }, { status: 400 });
    }

    await sql`
      INSERT INTO projects (
        id, slug, name, tagline, description, status, completion_percent, category, cover_image, images, github_url, live_url, tech_stack, data, sort_order, updated_at
      ) VALUES (
        ${p.id}, ${p.slug}, ${p.name}, ${p.tagline || ""}, ${p.description || ""}, ${p.status || "beta"},
        ${p.completionPercent || 100}, ${p.category || "web"}, ${p.coverImage || ""}, ${sql.json(p.images || [])},
        ${p.githubUrl || ""}, ${p.liveUrl || ""}, ${sql.json(p.techStack || [])},
        ${sql.json(p)}, ${typeof p.sortOrder === "number" ? p.sortOrder : null}, CURRENT_TIMESTAMP
      ) ON CONFLICT (id) DO UPDATE SET
        slug = EXCLUDED.slug,
        name = EXCLUDED.name,
        tagline = EXCLUDED.tagline,
        description = EXCLUDED.description,
        status = EXCLUDED.status,
        completion_percent = EXCLUDED.completion_percent,
        category = EXCLUDED.category,
        cover_image = EXCLUDED.cover_image,
        images = EXCLUDED.images,
        github_url = EXCLUDED.github_url,
        live_url = EXCLUDED.live_url,
        tech_stack = EXCLUDED.tech_stack,
        data = EXCLUDED.data,
        sort_order = COALESCE(EXCLUDED.sort_order, projects.sort_order),
        updated_at = CURRENT_TIMESTAMP;
    `;

    return NextResponse.json(
      {
        status: "success",
        message: `Project ${p.name} updated globally in the database`
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    console.error("POST /api/projects failed:", error);
    return NextResponse.json(
      {
        status: "error",
        persisted: false,
        error: "Database unavailable — the project was not saved.",
      },
      { status: 503, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await ensureDbTables();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    await sql`DELETE FROM projects WHERE id = ${id};`;

    return NextResponse.json(
      {
        status: "success",
        message: `Project ${id} deleted from the database`
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    console.error("DELETE /api/projects failed:", error);
    return NextResponse.json(
      {
        status: "error",
        persisted: false,
        error: "Database unavailable — the project was not deleted.",
      },
      { status: 503, headers: NO_CACHE_HEADERS }
    );
  }
}
