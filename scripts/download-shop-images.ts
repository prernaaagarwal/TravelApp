/**
 * download-shop-images.ts
 *
 * For each product in shop-products.json:
 *   1. Resolve the amzn.to short URL → full Amazon product URL
 *   2. Fetch the page HTML
 *   3. Extract the og:image (the main product photo)
 *   4. Download the image to /public/images/shop/{product-id}.jpg
 *   5. Rewrite the JSON's imageUrl to the local path
 *
 * Run locally — your laptop's IP isn't blocked by Amazon like a server's is:
 *   npm run images:shop
 *
 * Then commit /public/images/shop/ + the JSON change. Same pattern as the
 * intel images flow. Idempotent: skips files already on disk.
 */
import { promises as fs } from "fs";
import path from "path";

type Product = {
  id: string;
  name: string;
  imageUrl: string;
  amazonUrl: string;
  [k: string]: unknown;
};

const ROOT = process.cwd();
const SHOP_JSON = path.join(ROOT, "lib/mock-data/shop-products.json");
const SHOP_DIR = path.join(ROOT, "public/images/shop");

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-IN,en;q=0.9",
};

const MAX_RETRIES = 3;

async function fetchWithRetry(url: string): Promise<Response> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url, {
        headers: BROWSER_HEADERS,
        redirect: "follow",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res;
    } catch (err) {
      lastErr = err;
      if (attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, 2 ** attempt * 500));
      }
    }
  }
  throw new Error(`fetch failed: ${(lastErr as Error)?.message}`);
}

/** Pull og:image (or a m.media-amazon.com fallback) from Amazon HTML. */
function extractProductImage(html: string): string | null {
  const og = html.match(
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
  );
  if (og?.[1]) return og[1];
  const og2 = html.match(
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
  );
  if (og2?.[1]) return og2[1];
  // Fallback: any m.media-amazon.com image with a reasonable size suffix.
  const fallback = html.match(
    /https:\/\/m\.media-amazon\.com\/images\/I\/[A-Za-z0-9._-]+\.(jpg|png|webp)/,
  );
  return fallback?.[0] ?? null;
}

async function downloadImage(url: string, destPath: string): Promise<void> {
  const res = await fetchWithRetry(url);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.byteLength < 1024) throw new Error(`too small (${buf.byteLength}b)`);
  await fs.writeFile(destPath, buf);
}

async function main() {
  const raw = await fs.readFile(SHOP_JSON, "utf-8");
  const products: Product[] = JSON.parse(raw);
  await fs.mkdir(SHOP_DIR, { recursive: true });

  let ok = 0;
  let skipped = 0;
  const failed: string[] = [];

  for (const product of products) {
    const localRel = `/images/shop/${product.id}.jpg`;
    const dest = path.join(ROOT, "public", localRel);

    // Skip if already on disk and the JSON already points to local path.
    try {
      const stat = await fs.stat(dest);
      if (stat.size > 1024 && product.imageUrl === localRel) {
        skipped++;
        continue;
      }
    } catch {
      /* not yet downloaded */
    }

    if (!/^https:\/\/amzn\.to\//.test(product.amazonUrl)) {
      console.log(`  - ${product.id} skipped (not an Amazon link)`);
      skipped++;
      continue;
    }

    try {
      // Step 1+2: resolve short URL and fetch the product page.
      const pageRes = await fetchWithRetry(product.amazonUrl);
      const html = await pageRes.text();

      // Step 3: extract image URL.
      const imgUrl = extractProductImage(html);
      if (!imgUrl) throw new Error("no og:image found in page HTML");

      // Step 4: download the image.
      await downloadImage(imgUrl, dest);

      // Step 5: rewrite JSON to local path.
      product.imageUrl = localRel;
      ok++;
      console.log(`  ✓ ${product.id.padEnd(12)} ${product.name.slice(0, 50).padEnd(50)} → ${localRel}`);
    } catch (err) {
      failed.push(`${product.id}: ${(err as Error).message}`);
      console.log(`  ✗ ${product.id.padEnd(12)} ${(err as Error).message}`);
    }

    // Be polite to Amazon — small delay between products.
    await new Promise((r) => setTimeout(r, 800));
  }

  await fs.writeFile(SHOP_JSON, JSON.stringify(products, null, 2) + "\n");

  console.log(`\n${ok} downloaded, ${skipped} already-local, ${failed.length} failed`);
  if (failed.length) {
    console.log("\nFailures:");
    failed.forEach((f) => console.log(`  - ${f}`));
    console.log(
      "\nRe-running may help if these were transient (Amazon rate-limits aggressive scraping).",
    );
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
