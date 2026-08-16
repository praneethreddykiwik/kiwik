import { NextResponse } from "next/server";
import { cachedJson } from "@/lib/api-cache";
import { sql, ensureDbTables } from "@/lib/db";
import { partnerProducts as defaultProducts } from "@/data/partner-products";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  "Pragma": "no-cache",
  "Expires": "0"
};

async function seedProductsIfEmpty() {
  const existing = await sql`SELECT count(*)::int AS count FROM products;`;
  if (existing[0]?.count === 0) {
    let order = 0;
    for (const p of defaultProducts) {
      await sql`
        INSERT INTO products (id, slug, name, data, sort_order)
        VALUES (${p.id}, ${p.slug}, ${p.name}, ${sql.json({ ...p, sortOrder: p.sortOrder ?? order })}, ${p.sortOrder ?? order})
        ON CONFLICT (id) DO NOTHING;
      `;
      order++;
    }
  }
}

export async function GET(request: Request) {
  try {
    await ensureDbTables();
    const rows = await sql`
      SELECT id, slug, data FROM products
      ORDER BY sort_order ASC NULLS LAST, created_at ASC;
    `;
    if (rows && rows.length > 0) {
      const products = rows.map((r: any) =>
        r.data && typeof r.data === "object"
          ? { ...r.data, id: r.id, slug: r.slug }
          : { id: r.id, slug: r.slug }
      );
      return cachedJson({ status: "ok", products }, request);
    }
    // An empty table is a real state — the operator deleted every partner.
    // Returning the seed set here made deletions undo themselves, the same
    // bug already fixed for projects.
    return cachedJson({ status: "ok", products: [] }, request);
  } catch (error) {
    console.warn("GET /api/products DB error fallback:", error);
    return cachedJson({ status: "ok", products: defaultProducts, fallback: true }, request);
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
      INSERT INTO products (id, slug, name, data, sort_order, updated_at)
      VALUES (${p.id}, ${p.slug}, ${p.name}, ${sql.json(p)}, ${typeof p.sortOrder === "number" ? p.sortOrder : null}, CURRENT_TIMESTAMP)
      ON CONFLICT (id) DO UPDATE SET
        slug = EXCLUDED.slug,
        name = EXCLUDED.name,
        data = EXCLUDED.data,
        sort_order = COALESCE(EXCLUDED.sort_order, products.sort_order),
        updated_at = CURRENT_TIMESTAMP;
    `;
    return NextResponse.json(
      { status: "success", message: `Product ${p.name} saved globally` },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    console.error("POST /api/products failed:", error);
    return NextResponse.json(
      {
        status: "error",
        persisted: false,
        error: "Database unavailable — the product was not saved.",
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
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }
    await sql`DELETE FROM products WHERE id = ${id};`;
    return NextResponse.json(
      { status: "success", message: `Product ${id} deleted` },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    console.error("DELETE /api/products failed:", error);
    return NextResponse.json(
      {
        status: "error",
        persisted: false,
        error: "Database unavailable — the product was not deleted.",
      },
      { status: 503, headers: NO_CACHE_HEADERS }
    );
  }
}
