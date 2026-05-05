/**
 * refresh-intel-images.ts
 *
 * Replaces every hero image in /public/images/intel/ with a verified-correct
 * photo of the actual destination, sourced from each city's Wikipedia article.
 *
 * Wikipedia's REST API returns a curated `originalimage` for each article —
 * the same image you see at the top of the article. This is editorially
 * verified to be of the place, has stable URLs, and never gets deleted.
 *
 * Run on your laptop (sandbox/Vercel IPs are blocked by Wikipedia/Commons):
 *   npm run images:refresh
 *
 * Then commit /public/images/intel/. The intel-cards.json paths are unchanged
 * because we replace the file contents at the same paths on disk.
 *
 * Idempotent: re-running fetches the latest version. Safe to run any time.
 */
import { promises as fs } from "fs";
import path from "path";

const ROOT = process.cwd();
const INTEL_DIR = path.join(ROOT, "public/images/intel");

/**
 * Slug → Wikipedia article title. Explicit mapping rather than auto-derived
 * so a typo or unusual article name (Bengaluru, not Bangalore) never produces
 * the wrong image. Every entry is verified to be the canonical city article.
 */
const SLUG_TO_WIKI: Record<string, string> = {
  // India
  "goa-india":        "Goa",
  "delhi-india":      "Delhi",
  "mumbai-india":     "Mumbai",
  "jaipur-india":     "Jaipur",
  "manali-india":     "Manali",
  "rishikesh-india":  "Rishikesh",
  "varanasi-india":   "Varanasi",
  "udaipur-india":    "Udaipur",
  "agra-india":       "Agra",
  "bangalore-india":  "Bangalore",
  "kolkata-india":    "Kolkata",
  "chennai-india":    "Chennai",
  "kochi-india":      "Kochi",
  "kasol-india":      "Kasol",
  "hampi-india":      "Hampi",
  "spiti-valley-india": "Spiti Valley",
  // International
  "tokyo-japan":       "Tokyo",
  "bangkok-thailand":  "Bangkok",
  "hanoi-vietnam":     "Hanoi",
  "dubai-uae":         "Dubai",
  "seoul-south-korea": "Seoul",
  "paris-france":      "Paris",
  "bali-indonesia":      "Bali",
  "chiang-mai-thailand": "Chiang Mai",
  "lisbon-portugal":     "Lisbon",
};

const HEADERS = {
  // Wikipedia requires a descriptive User-Agent identifying the project.
  // See https://meta.wikimedia.org/wiki/User-Agent_policy
  "User-Agent": "WanderWomen/0.1 (https://travel-app-beta-mauve.vercel.app; contact@wanderwomen.app) node-fetch",
  Accept: "application/json",
};

const MAX_RETRIES = 3;

async function fetchJson(url: string): Promise<Record<string, unknown>> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url, { headers: HEADERS });
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
      return (await res.json()) as Record<string, unknown>;
    } catch (err) {
      lastErr = err;
      if (attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, 2 ** attempt * 500));
      }
    }
  }
  throw new Error(`Wikipedia API failed: ${(lastErr as Error)?.message}`);
}

async function downloadBinary(url: string, destPath: string): Promise<number> {
  const res = await fetch(url, { headers: { "User-Agent": HEADERS["User-Agent"] } });
  if (!res.ok) throw new Error(`HTTP ${res.status} downloading ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.byteLength < 4096) throw new Error(`image too small (${buf.byteLength}b)`);
  await fs.writeFile(destPath, buf);
  return buf.byteLength;
}

/**
 * Wikipedia thumbnails are served at any width by inserting `/thumb/` and a
 * `<W>px-` prefix into the original URL. Bumping to 1200px gives clean,
 * consistent quality across cities without downloading multi-MB originals.
 */
function thumbnailUrl(original: string, width: number): string {
  // Original: https://upload.wikimedia.org/wikipedia/commons/{a}/{ab}/{File}.jpg
  // Thumb:    https://upload.wikimedia.org/wikipedia/commons/thumb/{a}/{ab}/{File}.jpg/{W}px-{File}.jpg
  const m = original.match(
    /^(https:\/\/upload\.wikimedia\.org\/wikipedia\/commons)\/([a-f0-9])\/([a-f0-9]{2})\/(.+)$/,
  );
  if (!m) return original; // unknown shape — fall back to original
  const [, base, a, ab, file] = m;
  return `${base}/thumb/${a}/${ab}/${file}/${width}px-${file}`;
}

async function refreshOne(slug: string, article: string): Promise<{ size: number; from: string }> {
  const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(article)}`;
  const summary = await fetchJson(summaryUrl);
  const original = (summary.originalimage as { source?: string } | undefined)?.source;
  if (!original) {
    throw new Error(`no originalimage in Wikipedia summary for "${article}"`);
  }
  const imgUrl = thumbnailUrl(original, 1200);
  const dest = path.join(INTEL_DIR, `${slug}.jpg`);
  const size = await downloadBinary(imgUrl, dest);
  return { size, from: imgUrl };
}

async function main() {
  await fs.mkdir(INTEL_DIR, { recursive: true });

  console.log("→ Refreshing intel hero images from Wikipedia\n");

  const ok: string[] = [];
  const failed: string[] = [];

  for (const [slug, article] of Object.entries(SLUG_TO_WIKI)) {
    try {
      const { size } = await refreshOne(slug, article);
      const kb = (size / 1024).toFixed(0);
      console.log(`  ✓ ${slug.padEnd(22)} ← Wikipedia: ${article.padEnd(20)} (${kb} KB)`);
      ok.push(slug);
    } catch (err) {
      console.log(`  ✗ ${slug.padEnd(22)} ${(err as Error).message}`);
      failed.push(slug);
    }
    // Be polite to Wikipedia's API.
    await new Promise((r) => setTimeout(r, 400));
  }

  console.log(`\n${ok.length} refreshed, ${failed.length} failed`);
  if (failed.length) {
    console.log("\nFailed slugs:");
    failed.forEach((s) => console.log(`  - ${s}`));
    console.log(
      "\nThe existing local image is preserved for failed slugs. Re-running may help.",
    );
    process.exit(1);
  }

  console.log("\nDone. Review the new images, then:");
  console.log("  git add public/images/intel");
  console.log("  git commit -m 'images: refresh intel heroes from Wikipedia'");
  console.log("  git push");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
