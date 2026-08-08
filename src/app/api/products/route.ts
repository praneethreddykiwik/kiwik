import { NextResponse } from "next/server";
import { sql, ensureDbTables } from "@/lib/db";
import { partnerProducts as defaultProducts } from "@/data/partner-products";

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

export async function GET() {
  try {
    await ensureDbTables();
    await seedProductsIfEmpty();
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
      return NextResponse.json({ status: "ok", products });
    }
    return NextResponse.json({ status: "ok", products: defaultProducts });
  } catch (error) {
    console.warn("GET /api/products DB error fallback:", error);
    return NextResponse.json({ status: "ok", products: defaultProducts, fallback: true });
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
    return NextResponse.json({ status: "success", message: `Product ${p.name} saved globally` });
  } catch (error) {
    // A write that never reached the database must never report success. The
    // previous 200/"saved locally" response made every failed save look like it
    // worked, so content silently vanished on reload.
    console.error("POST /api/products failed:", error);
    return NextResponse.json(
      {
        status: "error",
        persisted: false,
        error: "Database unavailable — the product was not saved.",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 503 }
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
    return NextResponse.json({ status: "success", message: `Product ${id} deleted` });
  } catch (error) {
    console.error("DELETE /api/products failed:", error);
    return NextResponse.json(
      {
        status: "error",
        persisted: false,
        error: "Database unavailable — the product was not deleted.",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 503 }
    );
  }
}
