/**
 * One-time migration: uploads /public/images/intel/*.jpg to the Supabase
 * Storage `intel-images` bucket and updates intel_cards.hero_image_url to
 * point at the new public CDN URL.
 *
 * Idempotent — re-running skips cards already pointing at Supabase Storage.
 *
 * Prerequisite: run migration 015_storage_buckets.sql first so the bucket
 * exists.
 *
 *   npx tsx scripts/migrate-intel-images.ts
 */

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, basename } from "node:path";

config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n" +
    "These must be present in .env.local."
  );
  process.exit(1);
}

const supabase = createClient(url, key);
const BUCKET = "intel-images";
const localDir = join(process.cwd(), "public", "images", "intel");

if (!existsSync(localDir)) {
  console.error(`Local image directory not found: ${localDir}`);
  process.exit(1);
}

interface IntelCardRow {
  slug: string;
  hero_image_url: string | null;
}

async function main() {
  console.log(`Reading local images from ${localDir}…`);
  const files = readdirSync(localDir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
  console.log(`Found ${files.length} image files.`);

  console.log("Fetching intel_cards from DB…");
  const { data: cards, error } = await supabase
    .from("intel_cards")
    .select("slug,hero_image_url");
  if (error) {
    console.error("Failed to read intel_cards:", error.message);
    process.exit(1);
  }

  const cardsBySlug = new Map<string, IntelCardRow>(
    (cards ?? []).map((c) => [c.slug as string, c as IntelCardRow])
  );

  let uploaded = 0;
  let skipped  = 0;
  let updated  = 0;
  let missing  = 0;

  for (const file of files) {
    const slug = basename(file).replace(/\.(jpe?g|png|webp)$/i, "");
    const card = cardsBySlug.get(slug);

    if (!card) {
      console.warn(`  ⚠ no intel_cards row for ${slug} — skipping`);
      missing++;
      continue;
    }

    // Skip cards already pointing at Supabase Storage
    if (card.hero_image_url?.includes("/storage/v1/object/public/intel-images/")) {
      console.log(`  ✓ ${slug} already migrated`);
      skipped++;
      continue;
    }

    const localPath = join(localDir, file);
    const bytes = readFileSync(localPath);
    const ext   = file.split(".").pop()?.toLowerCase() ?? "jpg";
    const path  = `${slug}.${ext}`;
    const contentType =
      ext === "png"  ? "image/png" :
      ext === "webp" ? "image/webp" :
                       "image/jpeg";

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, bytes, { contentType, upsert: true });

    if (uploadError) {
      console.error(`  ✗ upload failed for ${slug}:`, uploadError.message);
      continue;
    }
    uploaded++;

    const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path);

    const { error: updateError } = await supabase
      .from("intel_cards")
      .update({ hero_image_url: publicUrl })
      .eq("slug", slug);

    if (updateError) {
      console.error(`  ✗ DB update failed for ${slug}:`, updateError.message);
      continue;
    }

    console.log(`  ↑ ${slug} → ${publicUrl}`);
    updated++;
  }

  console.log("");
  console.log("Done.");
  console.log(`  uploaded: ${uploaded}`);
  console.log(`  updated:  ${updated}`);
  console.log(`  skipped:  ${skipped} (already migrated)`);
  console.log(`  missing:  ${missing} (no DB row)`);
  console.log("");
  console.log("After verifying the site renders correctly, you can delete");
  console.log("the local files in /public/images/intel/ — they are no");
  console.log("longer referenced by the database.");
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
