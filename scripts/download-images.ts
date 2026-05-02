/**
 * download-images.ts
 *
 * One-time content step. Downloads every remote image referenced in our mock
 * data into /public/images/, then rewrites the JSON to point at the local
 * paths. After this runs, the app has zero external image dependencies — Next.js
 * Image optimization works fully and Vercel's CDN serves them globally.
 *
 * Run locally (your laptop's IP isn't blocked by Unsplash like a server's is):
 *   npm run images:download
 *
 * Then commit /public/images/ and the JSON changes.
 *
 * Safe to re-run: skips files that already exist on disk.
 */
import { promises as fs } from "fs";
import path from "path";

type IntelCard = {
  slug: string;
  destination: string;
  heroImageUrl: string;
  [k: string]: unknown;
};

type TripFeedItem = {
  id: string;
  destinationSlug: string;
  photoUrls: string[];
  [k: string]: unknown;
};

const ROOT = process.cwd();
const INTEL_JSON = path.join(ROOT, "lib/mock-data/intel-cards.json");
const FEED_JSON = path.join(ROOT, "lib/mock-data/trip-feed.json");
const INTEL_DIR = path.join(ROOT, "public/images/intel");
const FEED_DIR = path.join(ROOT, "public/images/feed");

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept:
    "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  Referer: "https://unsplash.com/",
};

const MAX_RETRIES = 4;

async function downloadOnce(url: string, destPath: string): Promise<void> {
  // Skip if already downloaded — makes re-runs cheap and resumable.
  try {
    const stat = await fs.stat(destPath);
    if (stat.size > 1024) return;
  } catch {
    /* file doesn't exist, proceed */
  }

  let lastErr: unknown;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url, { headers: BROWSER_HEADERS });
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.byteLength < 1024) throw new Error(`response too small (${buf.byteLength} bytes)`);
      await fs.writeFile(destPath, buf);
      return;
    } catch (err) {
      lastErr = err;
      if (attempt < MAX_RETRIES) {
        const delayMs = 2 ** attempt * 500; // 1s, 2s, 4s
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }
  }
  throw new Error(`failed after ${MAX_RETRIES} attempts: ${(lastErr as Error)?.message}`);
}

function isRemote(url: string): boolean {
  return /^https?:\/\//.test(url);
}

async function processIntelCards(): Promise<{ ok: number; skipped: number; failed: string[] }> {
  const raw = await fs.readFile(INTEL_JSON, "utf-8");
  const cards: IntelCard[] = JSON.parse(raw);
  await fs.mkdir(INTEL_DIR, { recursive: true });

  let ok = 0;
  let skipped = 0;
  const failed: string[] = [];

  for (const card of cards) {
    if (!card.heroImageUrl || !isRemote(card.heroImageUrl)) {
      skipped++;
      continue;
    }
    const localRel = `/images/intel/${card.slug}.jpg`;
    const dest = path.join(ROOT, "public", localRel);
    try {
      await downloadOnce(card.heroImageUrl, dest);
      card.heroImageUrl = localRel;
      ok++;
      console.log(`  ✓ ${card.destination.padEnd(20)} → ${localRel}`);
    } catch (err) {
      failed.push(`${card.slug}: ${(err as Error).message}`);
      console.log(`  ✗ ${card.destination.padEnd(20)} ${(err as Error).message}`);
    }
  }

  await fs.writeFile(INTEL_JSON, JSON.stringify(cards, null, 2) + "\n");
  return { ok, skipped, failed };
}

async function processTripFeed(): Promise<{ ok: number; skipped: number; failed: string[] }> {
  const raw = await fs.readFile(FEED_JSON, "utf-8");
  const trips: TripFeedItem[] = JSON.parse(raw);
  await fs.mkdir(FEED_DIR, { recursive: true });

  let ok = 0;
  let skipped = 0;
  const failed: string[] = [];

  for (const trip of trips) {
    if (!Array.isArray(trip.photoUrls)) continue;
    for (let i = 0; i < trip.photoUrls.length; i++) {
      const url = trip.photoUrls[i];
      if (!isRemote(url)) {
        skipped++;
        continue;
      }
      const localRel = `/images/feed/${trip.id}-${i + 1}.jpg`;
      const dest = path.join(ROOT, "public", localRel);
      try {
        await downloadOnce(url, dest);
        trip.photoUrls[i] = localRel;
        ok++;
        console.log(`  ✓ ${trip.id.padEnd(20)} #${i + 1} → ${localRel}`);
      } catch (err) {
        failed.push(`${trip.id}#${i + 1}: ${(err as Error).message}`);
        console.log(`  ✗ ${trip.id.padEnd(20)} #${i + 1} ${(err as Error).message}`);
      }
    }
  }

  await fs.writeFile(FEED_JSON, JSON.stringify(trips, null, 2) + "\n");
  return { ok, skipped, failed };
}

async function main() {
  console.log("→ Downloading Intel Card hero images");
  const intel = await processIntelCards();
  console.log(`  ${intel.ok} downloaded, ${intel.skipped} already-local\n`);

  console.log("→ Downloading Trip Feed photos");
  const feed = await processTripFeed();
  console.log(`  ${feed.ok} downloaded, ${feed.skipped} already-local\n`);

  const failed = [...intel.failed, ...feed.failed];
  if (failed.length) {
    console.log(`\n${failed.length} failure(s):`);
    failed.forEach((f) => console.log(`  - ${f}`));
    console.log(
      "\nIf failures are 403s, your IP may be rate-limited by Unsplash. " +
        "Wait 60s and re-run — the script skips files already on disk.",
    );
    process.exit(1);
  }

  console.log("Done. Commit /public/images/ and the JSON changes.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
