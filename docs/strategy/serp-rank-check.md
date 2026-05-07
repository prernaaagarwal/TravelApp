# SERP rank check protocol — 5 live cards, 30 min

> Goal: know whether you're indexed and where you rank for your target
> queries. Determines whether your "60-day to traffic" pitch is honest
> or whether you should say "6–9 months."

## Why this matters more than you think

Most founders pitch SEO as if Google instantly indexes new content. Reality:
- Index time for a brand-new domain: 2–8 weeks
- Time to rank in top 100: 1–3 months for low-KD queries
- Time to rank in top 10: 4–9 months for KD < 30, 12–18 months for KD > 50

If your live cards aren't even in the top 100 yet, your pitch should say
*"organic traffic kicks in around month 6, not month 2."* Investors who
catch this discrepancy in week 4 of diligence will walk.

## The 5 cards to check

Pick the 5 highest-intent intel cards. Suggested:

| # | Card slug | Live URL | Best query to test |
|---|---|---|---|
| 1 | goa-india | `wanderwomen.in/intel/goa-india` | is goa safe for solo female travelers |
| 2 | jaipur-india | `wanderwomen.in/intel/jaipur-india` | is jaipur safe for women |
| 3 | rishikesh-india | `wanderwomen.in/intel/rishikesh-india` | solo female travel rishikesh |
| 4 | bangkok-thailand | `wanderwomen.in/intel/bangkok-thailand` | bangkok solo female travel |
| 5 | spiti-valley-india | `wanderwomen.in/intel/spiti-valley-india` | spiti valley solo female travel |

Replace `wanderwomen.in` with your actual domain.

## How to check (4 methods, in order of preference)

### Method 1 — `site:` operator (5 min, no tools)

For each card, search Google:
```
site:yourdomain.in/intel/goa-india
```

- **Result returned** → page is indexed. Note the meta title shown.
- **No result** → not yet indexed. Submit URL via Google Search Console.

### Method 2 — Direct query, incognito (15 min)

For each query in the table above:
1. Open Chrome incognito or Firefox private window
2. Go to <https://google.com>
3. Set location to India: footer → Settings → Search Settings → Region
   → India (or add `&gl=in&hl=en` to the URL)
4. Run the query
5. Click through pages (10 results per page) until you find your card
6. Note the position (1–100) or "not found"

**Why incognito:** Google personalizes results based on history. Logged-in
results are not what a stranger sees.

### Method 3 — Free SERP checker (5 min, more accurate)

- <https://www.serprobot.com/free-serp-check/> — free, 5 checks/day
- <https://www.smallseotools.com/keyword-position/> — free, ad-supported
- Set country to India, device to mobile, paste URL + query

### Method 4 — Google Search Console (free, post-setup)

If you've added wanderwomen.in to GSC:
1. Performance → Search results
2. Filter by Query → enter your target query
3. See "Average position" column

GSC is the *only* source that shows real impressions and clicks. Set this
up if not already.

## Results template

Fill this in as you check:

| Card | Indexed? | Best query | Rank | Impressions (GSC) | Clicks (GSC) |
|---|---|---|---|---|---|
| goa-india | | | | | |
| jaipur-india | | | | | |
| rishikesh-india | | | | | |
| bangkok-thailand | | | | | |
| spiti-valley-india | | | | | |

## Interpret the results

### Scenario A — All 5 cards indexed, 3+ in top 50
**Pitch line:** *"We're already ranking on long-tail queries; organic
compounds from here. Year-1 traffic projections are based on extrapolating
current SERP trajectory."*
**Action:** keep the original 60–90 day timeline.

### Scenario B — All indexed, none in top 100
**Pitch line:** *"Cards are indexed; we're not ranking yet. Industry-
typical for a 3-month-old domain. We're 4–6 months from meaningful
organic, which is why we don't model paid traffic until month 6."*
**Action:** push the cohort revenue milestone from month 6 to month 9 in
the model.

### Scenario C — Some not indexed
**Pitch line:** Don't pitch this until you've fixed it. Submit URLs in
GSC, add to sitemap, wait 2 weeks, recheck.
**Action:** check `app/sitemap.ts` includes all cards; verify
robots.txt doesn't block; submit each URL via GSC's "URL Inspection"
tool with "Request indexing."

### Scenario D — Indexed but ranking deep (page 5+)
**Pitch line:** *"We're indexed at position N for these queries. Top
result is [X]; gap is [content depth / backlinks / freshness]. Year-1
content investment closes the gap on at least 60% of our 190 surfaces."*
**Action:** identify what the top-3 results have that you don't (word
count, schema, backlinks via Ahrefs Site Explorer). Plan content
investment.

## What to ALSO pull during this check (15 min bonus)

For your top-3 organic competitors per query, check:

1. **Their domain's total organic traffic** (Ahrefs Site Explorer free)
2. **Their top page** for that query (length, sections, schema)
3. **Backlinks they have** (Ahrefs free shows top 100)
4. **Their domain rating (DR)** — if they're DR 40+ and you're DR 5,
   you need 6–12 months of link-building

This data goes in:
- `docs/strategy/comparables.md` (the competitive landscape section)

## Honest pitch framing after the check

Replace the model assumption *"Year 1 we capture 5% of that as organic
traffic"* with one of:

| Real result | Pitch framing |
|---|---|
| 3+ cards in top 50 | "We're at <2% capture rate today and trending up. 5% by year-end is conservative." |
| All indexed, none top 100 | "Capture rate is <0.5% today — we're early. The model assumes 5% by month 18, not month 6." |
| Some not indexed | "Indexing fixes are in flight. Until they ship, we don't model SEO traffic." |

The honest version is always more fundable than the optimistic version
because the investor knows you'll be measured against it next quarter.

## After the check — update these files

1. `docs/investor/funnel-model.md` — adjust the "year 1 capture rate"
   assumption to match your real starting point
2. `docs/investor/build-status.md` — add a "SEO indexing status" row to
   the build status section
3. `docs/strategy/comparables.md` — add the competitor traffic + DR
   table you pulled

## Time budget

| Step | Minutes |
|---|---|
| Set up Google Search Console (one-time) | 15 |
| Run `site:` operator on 5 cards | 5 |
| Run incognito query check on 5 queries | 15 |
| Pull competitor data (top 3 per query) | 15 |
| Update model + build status | 10 |
| **Total** | **60** |

Block an hour. Do this before the next meeting.
