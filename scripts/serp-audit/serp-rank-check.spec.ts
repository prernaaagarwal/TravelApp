// SERP rank check automation
//
// Runs Google searches for our target queries in incognito Chromium with
// India locale, finds where wanderwomen.in ranks (top 100), and saves
// JSON + screenshots to scripts/serp-audit/results/<timestamp>/
//
// Run:
//   cd scripts/serp-audit
//   npx playwright install chromium       # one-time
//   npx playwright test serp-rank-check.spec.ts --headed
//
// The --headed flag shows the browser so you can solve any "I'm not a
// robot" CAPTCHA Google may surface. Without --headed, Google may block
// queries 4–8 in (rate limiting on automation).
//
// Output JSON shape:
//   { ran_at, results: [{ query, card_slug, rank: number|null,
//                         total_results_seen, screenshot_path, ... }] }
//
// Then upload the JSON + screenshots to your investor data room. The
// rank column is what investors want to see — "we're at position X for
// query Y today" is more honest than any traffic projection.

import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

// ── Config ────────────────────────────────────────────────────────────────
const SITE_DOMAIN = "wanderwomen.in"; // change if your domain differs
const QUERIES: { query: string; cardSlug: string }[] = [
  { query: "is goa safe for solo female travelers", cardSlug: "goa-india" },
  { query: "is jaipur safe for women", cardSlug: "jaipur-india" },
  { query: "solo female travel rishikesh", cardSlug: "rishikesh-india" },
  { query: "bangkok solo female travel", cardSlug: "bangkok-thailand" },
  { query: "spiti valley solo female travel", cardSlug: "spiti-valley-india" },
];

// ── Output paths ──────────────────────────────────────────────────────────
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, "-");
const OUT_DIR = path.join(__dirname, "results", TIMESTAMP);
fs.mkdirSync(OUT_DIR, { recursive: true });

type ResultRow = {
  query: string;
  card_slug: string;
  rank: number | null;
  total_results_seen: number;
  screenshot_path: string;
  notes: string;
  timestamp: string;
};

const results: ResultRow[] = [];

// ── Test config — single browser, India locale ────────────────────────────
test.use({
  locale: "en-IN",
  timezoneId: "Asia/Kolkata",
  geolocation: { latitude: 28.6139, longitude: 77.2090 }, // Delhi
  permissions: ["geolocation"],
  viewport: { width: 1280, height: 900 },
});

for (const { query, cardSlug } of QUERIES) {
  test(`SERP: "${query}"`, async ({ page }) => {
    const screenshotPath = path.join(
      OUT_DIR,
      `${cardSlug}-serp.png`,
    );

    // 1. Open Google with India region forced
    await page.goto(
      `https://www.google.com/search?q=${encodeURIComponent(query)}&gl=in&hl=en&pws=0&num=100`,
      { waitUntil: "domcontentloaded" },
    );

    // Solve any captcha manually if running --headed; else this throws.
    try {
      await page.waitForSelector("div#search, div#main", { timeout: 15_000 });
    } catch {
      results.push({
        query,
        card_slug: cardSlug,
        rank: null,
        total_results_seen: 0,
        screenshot_path: "",
        notes: "Google blocked automation — re-run with --headed and solve captcha",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // 2. Pull all result links
    const links = await page.locator('div#search a[href*="://"]').evaluateAll(
      (anchors) =>
        anchors
          .map((a) => (a as HTMLAnchorElement).href)
          .filter(
            (href) =>
              !href.includes("google.com") &&
              !href.includes("/url?") &&
              !href.startsWith("javascript:"),
          ),
    );

    // 3. Find first link matching our domain
    let rank: number | null = null;
    for (let i = 0; i < links.length; i++) {
      if (links[i].includes(SITE_DOMAIN)) {
        rank = i + 1;
        break;
      }
    }

    // 4. Screenshot
    await page.screenshot({ path: screenshotPath, fullPage: true });

    // 5. Record
    results.push({
      query,
      card_slug: cardSlug,
      rank,
      total_results_seen: links.length,
      screenshot_path: path.relative(OUT_DIR, screenshotPath),
      notes:
        rank === null
          ? "Not in top results — check indexing in GSC"
          : rank > 50
          ? "Ranked but deep (page 5+); needs content investment"
          : rank > 20
          ? "Ranked on page 2-5; close to break-in"
          : rank > 10
          ? "Page 2 — within striking distance"
          : "Top 10 — strong",
      timestamp: new Date().toISOString(),
    });

    // 6. Visible assertion so the test status is meaningful
    expect(links.length).toBeGreaterThan(0);
  });
}

test.afterAll(async () => {
  const summary = {
    ran_at: new Date().toISOString(),
    site_domain: SITE_DOMAIN,
    region: "India (en-IN)",
    google_url_pattern:
      "https://www.google.com/search?q=...&gl=in&hl=en&pws=0&num=100",
    results,
    summary: {
      indexed_in_top_100: results.filter((r) => r.rank !== null).length,
      indexed_in_top_10: results.filter((r) => r.rank !== null && r.rank <= 10).length,
      indexed_in_top_50: results.filter((r) => r.rank !== null && r.rank <= 50).length,
      not_indexed: results.filter((r) => r.rank === null).length,
    },
  };
  const outFile = path.join(OUT_DIR, "summary.json");
  fs.writeFileSync(outFile, JSON.stringify(summary, null, 2));
  console.log(`\n✓ SERP audit complete. Results: ${outFile}`);
  console.log(JSON.stringify(summary.summary, null, 2));
});
