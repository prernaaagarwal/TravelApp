# Perplexity competitive citation audit — protocol + log template

> Goal: know who Perplexity, ChatGPT, Claude, and Google AI Overviews cite
> when answering your target queries today. That citation list IS your
> competitive landscape in the AI era. 60 minutes, repeat quarterly.
>
> **One-line investor pitch outcome:** *"We audited Perplexity on 10 queries
> last week. Top citations are Lonely Planet, Reddit, and TripAdvisor — none
> verified, none structured, all stale. We're engineering for the citation
> graph that comes after."*

## Why this matters

Investors in 2026 ask *"who cites you when ChatGPT answers a query?"* The
honest answer for nearly every founder pre-launch is *"nobody yet."* The
defensive answer is to show you understand the citation graph competitively
— *who currently wins, why they win, and what your wedge is to displace
them.*

Run this once before the next pitch. Print the results page. Hand it
across the table when an investor pushes on AEO/GEO.

## The 10 queries to test

Mix of high-volume + long-tail to capture the full citation landscape.
Replace these with your specific cards if needed.

### Group A — Headline safety queries (high volume, AI Overview-worthy)
1. `is jaipur safe for solo female travelers`
2. `is goa safe for women alone`
3. `is delhi safe for foreign female tourists`
4. `is india safe for solo female travel`

### Group B — Scam queries (specific, high-intent)
5. `goa scams to avoid`
6. `paris tourist scams 2026`
7. `bangkok scams solo traveler`

### Group C — Long-tail (where we should win in year 1)
8. `solo female travel rishikesh budget`
9. `women only travel groups india`
10. `safest neighborhoods for women in jaipur`

## How to run the audit (60 min)

### Tool 1 — Perplexity (the primary AI search engine)

1. Go to <https://perplexity.ai>
2. Use **incognito / private window** so personalization doesn't skew results
3. Paste each query, run it
4. Note the **Sources panel** on the right — record the top 5 cited URLs
5. Note the **answer text** — does it cite a specific contributor name or
   recent date? (If yes, that's a structured-data win for the source.)
6. **Screenshot** the answer + sources (full page, not just the visible area)

### Tool 2 — Google AI Overview (powered by Gemini)

1. Go to <https://google.com/search>
2. Set location to India: footer → Settings → Search Settings → Region → India
3. Run each query
4. If an "AI Overview" appears at the top: record the cited domains
5. If no AI Overview: note "no overview shown" — that means the query is
   considered low-signal and standard SERP rules apply
6. Screenshot the AI Overview (or its absence)

### Tool 3 — ChatGPT search (only available with Plus subscription)

1. Go to <https://chatgpt.com>, set the search toggle ON
2. Use a **fresh chat** for each query
3. Run each query
4. Record cited sources from the source pills
5. Screenshot

### Tool 4 — Claude with web search (Claude.ai or Claude Code)

1. Go to <https://claude.ai>, enable web search
2. Run each query
3. Record cited sources
4. Screenshot

### Tool 5 (optional) — Bing Copilot / DuckDuckGo AI

1. <https://www.bing.com/copilot>
2. Lower priority — ChatGPT search uses Bing under the hood, so partial overlap

## Log template — paste into a spreadsheet

```
Query | Engine | Top source 1 | Top source 2 | Top source 3 | Top source 4 | Top source 5 | Answer length (words) | Cites named author? | Cites date? | We cited? (Y/N) | Screenshot URL
------|--------|--------------|--------------|--------------|--------------|--------------|----------------------|---------------------|-------------|-----------------|----------------
```

Fill one row per (query × engine) combination. **40 rows total** (10 queries
× 4 engines). Takes ~60 minutes.

## What to look for in the data

After the audit, count:

### 1. Citation graph dominance
Who appears in > 3 of the 40 rows? Those are your top competitors:
- Likely: lonelyplanet.com, tripadvisor.com, reddit.com/r/IndiaTravel, nomadicmatt.com
- Possibly: holidify.com, tripoto.com (India-specific)
- Almost never: small content sites, women-focused sites

### 2. Format wins
Do top citations have:
- FAQ schema visible (Perplexity often pulls FAQPage Q&A directly)
- Recent dates (year-month visible in citation)
- Named authors (especially women-focused queries)
- Structured data (you'll see clean Q&A blocks lifted)

If your competitors don't, that's your opening.

### 3. Gap analysis
Which of the 10 queries had:
- **No good answer** (vague, generic) → easy wins for us
- **Outdated answer** (cites 2019 article) → freshness wins for us
- **Anonymous Reddit answer** → verification wins for us

### 4. Indian context
Do top citations include any India-based source? If 9/10 results cite
Western sources, that's a positioning opportunity:

> *"Even on India-specific queries, Perplexity cites Lonely Planet's
> Western perspective. India-residing women contributors have not been
> structured into the citation graph yet. That's the wedge."*

## How to use the findings in the pitch

### Slide A — The competitive citation graph (one-page handout)
Top half: bar chart of citation count by domain across all 40 queries.
Bottom half: 3 example queries with screenshots of the AI answer.

### Slide B — The wedge
Two columns:
- **What AI cites today:** Lonely Planet (anonymous, 5y old), Reddit
  (anonymous, unverified), TripAdvisor (anonymous, no recency)
- **What we built:** Named contributors, ID-verified, structured FAQ
  schema, llms.txt, MCP endpoint, dated Beware reports

### Slide C — The 12-month plan to enter the citation graph
Each tactic numbered:
1. Ship llms.txt + FAQPage schema (week 1)
2. Stand up MCP endpoint (week 1)
3. Submit Bing sitemap (week 1)
4. Earn 5+ press mentions (months 2–6)
5. File Wikidata entry once mentions ≥ 5 (month 6)
6. File Wikipedia article once mentions ≥ 8 (months 9–12)

## Re-run cadence

- **Quarterly (every 90 days)** — track movement
- **After major events** — large content drops, press mentions, MCP
  client integration

The graph moves slowly. Don't expect to displace Lonely Planet in 6
months; expect to **enter** the citation set on long-tail queries first.

## A real claim you can make today (true post-this-audit)

> *"We ran a 40-row Perplexity citation audit last week across 10 target
> queries × 4 AI engines. Lonely Planet is cited in N of 40, Reddit in
> M of 40. Wander Women is cited in 0 — exactly what we'd expect for a
> domain at our age. Our 12-month plan to enter the citation graph is
> shipping today: llms.txt, MCP, FAQPage schema, methodology page, Bing
> submission, Wikidata pre-work."*

That's the kind of answer that separates founders who've thought about
AEO from founders who haven't.

## What goes in the data room

After completing the audit:

1. Save all 40 screenshots in a Notion / Drive folder
2. Export the spreadsheet as CSV → upload as `docs/strategy/perplexity-audit-{YYYY-MM-DD}.csv`
3. Write a 1-page summary as `docs/strategy/perplexity-audit-{YYYY-MM-DD}-summary.md`
4. Add the summary to the investor data room

This becomes evergreen evidence that you know your competitive surface.

## Common pitfalls

- **Logged-in queries** — your search history skews results. Use incognito.
- **Wrong region** — Indian users see different results from US users.
  Set region explicitly.
- **One-shot run** — citations vary day to day. Re-run any query that gave
  surprising results.
- **Self-citation panic** — yes, you won't be cited yet. That's the point
  of the audit. Don't fudge.

## After the audit, update these files

1. `docs/strategy/comparables.md` — replace `[VERIFY]` markers on
   competitor traffic numbers with real Perplexity citation counts
2. `docs/investor/build-status.md` — add an "AEO citation status" line
3. `docs/strategy/wedge.md` — confirm the AEO/GEO assumption holds

Block the calendar. 60 minutes. Print the results. Walk into the next
meeting with the citation graph as a slide.
