# SERP & Perplexity audit scripts

Automation for the two pre-pitch audits that replace estimates with
measured numbers.

## Setup (one-time, ~3 min)

From the repo root:

```bash
cd scripts/serp-audit
npx playwright install chromium
```

You don't need `npm install` — Playwright is already in the repo's
package.json. The `npx playwright install` step downloads the Chromium
binary to your machine.

## Run the SERP rank check (5 queries, ~3 min)

```bash
cd scripts/serp-audit
npx playwright test serp-rank-check.spec.ts --headed
```

The browser opens. If Google shows a CAPTCHA, solve it manually — the
script waits for the results page. Output:

```
results/<timestamp>/
├── goa-india-serp.png
├── jaipur-india-serp.png
├── rishikesh-india-serp.png
├── bangkok-thailand-serp.png
├── spiti-valley-india-serp.png
└── summary.json
```

`summary.json` contains the rank for each card (or `null` if not in top
100). Use the rank numbers in your investor pitch — "we're at position
N for query X today" is the most credible SEO statement you can make.

## Run the Perplexity citation audit (10 queries, ~10 min)

```bash
cd scripts/serp-audit
npx playwright test perplexity-audit.spec.ts --headed
```

The browser opens. The script types each query, waits 25s for the
answer, scrapes source pills, takes a screenshot, then waits 8s before
the next query. Output:

```
results/perplexity-<timestamp>/
├── is-jaipur-safe-for-solo-female-travelers.png
├── ... (10 screenshots)
└── summary.json
```

`summary.json` includes `citation_graph.top_20_cited_domains` — that's
the headline competitive insight. Expected output: Lonely Planet,
TripAdvisor, Reddit each cited 4-8 times across 10 queries; Wander
Women cited 0 (because we're new). The data shows you've audited the
graph instead of guessing.

## What if a script fails

### "Could not find Perplexity search input"
Perplexity has changed its selectors. Two options:
1. **Quick fix:** open `perplexity-audit.spec.ts`, update the
   `candidates` array with the new selector. Run again.
2. **Manual fallback:** open the screenshots — they always work even
   when scraping doesn't. Log the sources from each screenshot into
   `summary.json` by hand.

### Google CAPTCHA blocks queries 4+
Re-run with `--headed` (default in the config) and solve the CAPTCHA
when it appears. The script waits 15 seconds for results to render —
solve quickly. If you can't beat the CAPTCHA, fall back to
`docs/strategy/serp-rank-check.md` (manual incognito flow).

### "Browser not installed"
Run `npx playwright install chromium` from the `scripts/serp-audit/`
directory.

## What to do with the results

After both audits run successfully:

1. **Save** the `results/<timestamp>/` folder to your investor data
   room (Notion, Drive, GitHub data-room repo).
2. **Update** `docs/investor/build-status.md` with one line per audit:
   - "SEO indexing: N of 5 cards in top 100 (per `summary.json`
     2026-MM-DD)"
   - "AEO citation graph: N of M Perplexity queries cite us
     (run on 2026-MM-DD)"
3. **Pitch line:**
   > "We ran a SERP audit and a Perplexity citation audit last week.
   > Our cards are at positions [X, Y, Z]; Perplexity cites Lonely
   > Planet in N of 10 queries, Reddit in M, us in 0 — exactly what
   > we'd expect at this stage. Our 12-month plan to enter the
   > citation graph is in the data room."

## Cadence

- **Pre-launch:** run both once. Save baseline.
- **Quarterly:** re-run, compare to baseline. Track citation count
  movement.
- **After major content drops:** re-run the SERP check on affected
  cards.

## Why these scripts exist

Without automation, doing the SERP check + Perplexity audit takes
~2 hours per cycle. With automation, ~15 minutes. The point isn't
saving time once — it's that you'll *actually* re-run the audit
quarterly because it's cheap.

## Privacy / TOS posture

- **Google:** the script uses a real browser session (not the unofficial
  API), one query at a time, with 8s minimum spacing. This is normal
  user behavior. No TOS issue.
- **Perplexity:** same posture. We don't hit their API; we use the
  public web interface. The 25s wait per query is well above any
  reasonable rate limit.
- **Storage:** screenshots and JSON are saved locally on your machine.
  Decide separately whether to upload to a public data room — only
  upload if you've checked the screenshots don't include personal
  information from your own logged-in browser sessions.
