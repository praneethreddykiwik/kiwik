/**
 * Copies the Supabase Storage bucket, which a SQL dump cannot carry.
 *
 *   node scripts/export-storage.mjs download
 *       Downloads every object in `partner-media` to ./storage-backup/,
 *       preserving the folder layout, and writes a manifest.
 *
 *   node scripts/export-storage.mjs upload --url=https://NEW.supabase.co --key=NEW_SERVICE_ROLE_KEY
 *       Creates `partner-media` as a public bucket on the target project and
 *       uploads everything from ./storage-backup/ with the same paths, so every
 *       URL in the database resolves once the project ref is swapped.
 *
 * The paths must match exactly. Every media URL stored in Postgres is
 * `<project>/storage/v1/object/public/partner-media/<path>`, so only the host
 * changes between projects — which is why the SQL export has a --new-ref flag.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const BUCKET = "partner-media";
const OUT = path.join(ROOT, "storage-backup");

const args = process.argv.slice(2);
const MODE = args[0];
const argVal = (name) => (args.find((a) => a.startsWith(`--${name}=`)) || "").split("=").slice(1).join("=") || null;

const env = {};
for (const line of fs.readFileSync(path.join(ROOT, ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

async function listAll(base, key) {
  const h = { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
  const files = [];
  async function walk(prefix) {
    const res = await fetch(`${base}/storage/v1/object/list/${BUCKET}`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({ prefix, limit: 1000, sortBy: { column: "name", order: "asc" } }),
    });
    const items = await res.json();
    if (!Array.isArray(items)) throw new Error(`list failed: ${JSON.stringify(items).slice(0, 200)}`);
    for (const it of items) {
      const full = prefix ? `${prefix}/${it.name}` : it.name;
      // A folder comes back with a null id and no metadata.
      if (it.id === null || !it.metadata) await walk(full);
      else files.push({ path: full, size: it.metadata.size || 0, mime: it.metadata.mimetype });
    }
  }
  await walk("");
  return files;
}

async function download() {
  const base = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  const files = await listAll(base, key);
  fs.mkdirSync(OUT, { recursive: true });

  let done = 0;
  let bytes = 0;
  for (const f of files) {
    const dest = path.join(OUT, f.path);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const res = await fetch(`${base}/storage/v1/object/public/${BUCKET}/${f.path}`);
    if (!res.ok) {
      console.error(`  FAILED ${f.path} (HTTP ${res.status})`);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buf);
    done++;
    bytes += buf.length;
    console.log(`  ${(buf.length / 1024 / 1024).toFixed(2).padStart(7)} MB  ${f.path}`);
  }
  fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(files, null, 2));
  console.log(`\nDownloaded ${done}/${files.length} objects, ${(bytes / 1024 / 1024).toFixed(2)} MB -> ${OUT}`);
}

async function upload() {
  const base = argVal("url");
  const key = argVal("key");
  if (!base || !key) {
    console.error("Usage: node scripts/export-storage.mjs upload --url=https://NEW.supabase.co --key=SERVICE_ROLE_KEY");
    process.exit(1);
  }
  const manifestPath = path.join(OUT, "manifest.json");
  if (!fs.existsSync(manifestPath)) {
    console.error("Run `download` first — no storage-backup/manifest.json found.");
    process.exit(1);
  }
  const files = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const h = { apikey: key, Authorization: `Bearer ${key}` };

  // Public bucket, matching the source. Without this the URLs 403.
  const mk = await fetch(`${base}/storage/v1/bucket`, {
    method: "POST",
    headers: { ...h, "Content-Type": "application/json" },
    body: JSON.stringify({ id: BUCKET, name: BUCKET, public: true, file_size_limit: 52428800 }),
  });
  console.log(mk.ok ? `Created bucket ${BUCKET}` : `Bucket ${BUCKET}: ${(await mk.json()).message || "already exists"}`);

  let done = 0;
  for (const f of files) {
    const src = path.join(OUT, f.path);
    if (!fs.existsSync(src)) {
      console.error(`  MISSING locally: ${f.path}`);
      continue;
    }
    const res = await fetch(`${base}/storage/v1/object/${BUCKET}/${f.path}`, {
      method: "POST",
      headers: { ...h, "Content-Type": f.mime || "application/octet-stream", "x-upsert": "true" },
      body: fs.readFileSync(src),
    });
    if (!res.ok) {
      console.error(`  FAILED ${f.path} (HTTP ${res.status}) ${(await res.text()).slice(0, 120)}`);
      continue;
    }
    done++;
    console.log(`  uploaded  ${f.path}`);
  }
  console.log(`\nUploaded ${done}/${files.length} objects to ${base}`);
}

if (MODE === "download") await download();
else if (MODE === "upload") await upload();
else {
  console.log("Usage:");
  console.log("  node scripts/export-storage.mjs download");
  console.log("  node scripts/export-storage.mjs upload --url=https://NEW.supabase.co --key=SERVICE_ROLE_KEY");
  process.exit(1);
}
