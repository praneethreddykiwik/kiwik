import { NextResponse } from "next/server";
import { sql, ensureDbTables } from "@/lib/db";

export async function GET() {
  try {
    await ensureDbTables();
    const rows = await sql`
      SELECT id, slug, name, tagline, description, status, completion_percent as "completionPercent",
             category, cover_image as "coverImage", images, github_url as "githubUrl", live_url as "liveUrl",
             tech_stack as "techStack", created_at as "createdAt", updated_at as "lastUpdated"
      FROM projects
      ORDER BY created_at DESC;
    `;
    return NextResponse.json({
      status: "ok",
      projects: rows
    });
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json({ error: "Failed to fetch projects from Neon DB" }, { status: 500 });
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
        id, slug, name, tagline, description, status, completion_percent, category, cover_image, images, github_url, live_url, tech_stack, updated_at
      ) VALUES (
        ${p.id}, ${p.slug}, ${p.name}, ${p.tagline || ""}, ${p.description || ""}, ${p.status || "beta"},
        ${p.completionPercent || 100}, ${p.category || "web"}, ${p.coverImage || ""}, ${JSON.stringify(p.images || [])}::jsonb,
        ${p.githubUrl || ""}, ${p.liveUrl || ""}, ${JSON.stringify(p.techStack || [])}::jsonb, CURRENT_TIMESTAMP
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
        updated_at = CURRENT_TIMESTAMP;
    `;

    return NextResponse.json({
      status: "success",
      message: `Project ${p.name} updated globally in Neon database`
    });
  } catch (error) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json({ error: "Failed to save project to Neon DB" }, { status: 500 });
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

    return NextResponse.json({
      status: "success",
      message: `Project ${id} deleted from Neon database`
    });
  } catch (error) {
    console.error("DELETE /api/projects error:", error);
    return NextResponse.json({ error: "Failed to delete project from Neon DB" }, { status: 500 });
  }
}
