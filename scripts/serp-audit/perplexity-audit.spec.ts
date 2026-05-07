// Perplexity competitive citation audit (semi-automated)
//
// Opens perplexity.ai for each of 10 target queries, runs the search,
// and SCRAPES the source pills from the answer panel. Saves JSON +
// per-query screenshots.
//
// Why semi-automated: Perplexity's TOS allows browsing; we don't
// rate-press their API. The script makes one request per query, with
// 8-second pauses. If the page selectors change (Perplexity ships fast),
// the scrape may need updating — the screenshots are the source of
// truth and always work.
//
// Run:
//   cd scripts/serp-audit
//   npx playwright test perplexity-audit.spec.ts --headed --workers=1
//
// Output JSON shape:
//   { ran_at, results: [{ query, sources: [...], answer_excerpt,
//                         screenshot_path, timestamp }] }

import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const QUERIES: string[] = [
  "is jaipur safe for solo female travelers",
  "is goa safe for women alone",
  "is delhi safe for foreign female tourists",
  "is india safe for solo female travel",
  "goa scams to avoid",
  "paris tourist scams 2026",
  "bangkok scams solo traveler",
  "solo female travel rishikesh budget",
  "women only travel groups india",
  "safest neighborhoods for women in jaipur",
];

const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, "-");
const OUT_DIR = path.join(__dirname, "results", `perplexity-${TIMESTAMP}`);
fs.mkdirSync(OUT_DIR, { recursive: true });

type Source = {
  domain: string;
  url: string;
  title: string;
};

type ResultRow = {
  query: string;
  sources: Source[];
  answer_excerpt: string;
  screenshot_path: string;
  notes: string;
  timestamp: string;
};

const results: ResultRow[] = [];

test.use({
  viewport: { width: 1280, height: 1000 },
  locale: "en-IN",
});

test.describe.configure({ mode: "serial" });

for (let i = 0; i < QUERIES.length; i++) {
  const query = QUERIES[i];
  const slug = query.replace(/[^a-z0-9]+/gi, "-").slice(0, 50);

  test(`Perplexity #${i + 1}: ${query}`, async ({ page }) => {
    test.setTimeout(90_000);

    // Pause between queries to avoid rate-pressing
    if (i > 0) await page.waitForTimeout(8_000);

    const screenshotPath = path.join(OUT_DIR, `${slug}.png`);

    await page.goto("https://www.perplexity.ai/", {
      waitUntil: "domcontentloaded",
    });

    // Find the search input. Perplexity changes selectors often; we try
    // multiple. If none work, the test fails fast and you log manually.
    const candidates = [
      'textarea[placeholder*="Ask"]',
      'textarea[placeholder*="follow"]',
      'textarea',
      'input[type="text"]',
    ];
    let input = null;
    for (const sel of candidates) {
      const el = page.locator(sel).first();
      if (await el.count()) {
        input = el;
        break;
      }
    }
    expect(input, "Could not find Perplexity search input").not.toBeNull();

    await input!.click();
    await input!.fill(query);
    await page.keyboard.press("Enter");

    // Wait for the answer to render. Source pills typically appear within
    // 10-20s. We screenshot whatever's on screen at 25s — even partial.
    await page.waitForTimeout(25_000);

    // Try to scrape source links. Perplexity's source pills are usually
    // anchors inside a "Sources" section. We grab all external anchors
    // visible and dedupe by domain.
    const rawLinks = await page.locator('a[href^="https://"]').evaluateAll(
      (anchors) =>
        anchors
          .map((a) => {
            const el = a as HTMLAnchorElement;
            return {
              href: el.href,
              title: el.textContent?.trim() || "",
            };
          })
          .filter(
            (l) =>
              !l.href.includes("perplexity.ai") &&
              !l.href.includes("javascript:") &&
              !l.href.includes("twitter.com/perplexity"),
          ),
    );

    // Dedupe by domain, keep first occurrence
    const seen = new Set<string>();
    const sources: Source[] = [];
    for (const link of rawLinks) {
      try {
        const url = new URL(link.href);
        const domain = url.hostname.replace(/^www\./, "");
        if (seen.has(domain)) continue;
        seen.add(domain);
        sources.push({
          domain,
          url: link.href,
          title: link.title || domain,
        });
      } catch {
        // skip malformed URLs
      }
      if (sources.length >= 10) break;
    }

    // Answer excerpt — first 280 chars of the main response container
    let answerExcerpt = "";
    try {
      const answerEl = page.locator(
        '[class*="prose"], [class*="markdown"], main',
      ).first();
      const txt = await answerEl.innerText({ timeout: 3_000 });
      answerExcerpt = txt.slice(0, 280).replace(/\s+/g, " ").trim();
    } catch {
      answerExcerpt = "(could not extract — see screenshot)";
    }

    await page.screenshot({ path: screenshotPath, fullPage: true });

    results.push({
      query,
      sources,
      answer_excerpt: answerExcerpt,
      screenshot_path: path.relative(OUT_DIR, screenshotPath),
      notes:
        sources.length === 0
          ? "Selectors may have drifted — verify against screenshot manually"
          : sources.some((s) => s.domain.includes("wanderwomen"))
          ? "WE ARE CITED — log in detail"
          : "Standard competitor citations; we are not yet in the graph",
      timestamp: new Date().toISOString(),
    });
  });
}

test.afterAll(async () => {
  // Aggregate citation graph: count domains across all queries
  const domainCounts: Record<string, number> = {};
  for (const r of results) {
    for (const s of r.sources) {
      domainCounts[s.domain] = (domainCounts[s.domain] ?? 0) + 1;
    }
  }
  const topDomains = Object.entries(domainCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);

  const summary = {
    ran_at: new Date().toISOString(),
    queries_run: QUERIES.length,
    results,
    citation_graph: {
      total_unique_domains: Object.keys(domainCounts).length,
      top_20_cited_domains: topDomains.map(([domain, count]) => ({
        domain,
        cited_in_n_queries: count,
      })),
      we_are_cited: results.some((r) =>
        r.sources.some((s) => s.domain.includes("wanderwomen")),
      ),
    },
  };
  const outFile = path.join(OUT_DIR, "summary.json");
  fs.writeFileSync(outFile, JSON.stringify(summary, null, 2));
  console.log(`\n✓ Perplexity audit complete. Results: ${outFile}`);
  console.log("\nTop cited domains:");
  for (const [domain, count] of topDomains.slice(0, 10)) {
    console.log(`  ${count}× ${domain}`);
  }
  console.log(
    `\nWander Women cited: ${summary.citation_graph.we_are_cited ? "YES" : "no — expected at this stage"}`,
  );
});
