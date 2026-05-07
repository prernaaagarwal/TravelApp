# Keyword research worksheet — 30 target queries

> Goal: replace the "600–900 monthly searches" estimate in the pitch with a
> verified midpoint. Total time: ~90 min in Ahrefs free trial OR Google
> Keyword Planner. Do this *before* the next investor meeting.

## How to do the research (90 min, one sitting)

### Option A — Ahrefs free trial (recommended)
1. Sign up at <https://ahrefs.com/keyword-generator> (free, no card)
2. For each keyword below, enter it → set country to "India" → record
   the "Search Volume" number
3. Also record "KD" (keyword difficulty 0–100) — anything < 30 is a
   year-1 win, > 60 is a year-3 stretch
4. If Ahrefs blocks free volume after 5 lookups, switch to Option B

### Option B — Google Keyword Planner (free, but requires Ads account)
1. <https://ads.google.com/aw/keywordplanner/home>
2. "Get search volume and forecasts" → paste keywords (50 at a time)
3. Set location: India + "All countries" (do both runs)
4. Record "Avg. monthly searches" — note GKP shows ranges, take midpoint

### Option C — Free alternates if A and B blocked
- Keywords Everywhere browser extension (paid, ₹1,200 lifetime — worth it)
- Ubersuggest free tier (3 lookups/day; spread across 10 days)
- Google Trends (relative, not absolute volume — useful for trajectory)

---

## The 30 keywords (mapped to live product)

Three groups: 12 destination-safety (intel cards), 12 city-scam (Beware Board),
6 brand+category. Volumes below are **EST — verify and replace**.

### Group 1 — Destination safety (12 keywords)

These map 1:1 to your intel card slugs. Each is the "is X safe for solo
women" intent.

| # | Keyword | Card slug | EST vol/mo (India + global) | KD est | Real vol | Real KD | Your rank |
|---|---|---|---|---|---|---|---|
| 1 | is goa safe for solo female travelers | goa-india | 1,500 | 25 | | | |
| 2 | is jaipur safe for women | jaipur-india | 800 | 22 | | | |
| 3 | solo female travel rishikesh | rishikesh-india | 400 | 18 | | | |
| 4 | is varanasi safe for women | varanasi-india | 600 | 20 | | | |
| 5 | manali solo female travel | manali-india | 700 | 22 | | | |
| 6 | is delhi safe for women tourists | delhi-india | 1,800 | 35 | | | |
| 7 | is mumbai safe for solo female | mumbai-india | 900 | 28 | | | |
| 8 | agra safety for women | agra-india | 500 | 18 | | | |
| 9 | udaipur solo female travel | udaipur-india | 300 | 15 | | | |
| 10 | hampi solo travel safety | hampi-india | 200 | 12 | | | |
| 11 | spiti valley solo female travel | spiti-valley-india | 400 | 14 | | | |
| 12 | bangkok solo female travel | bangkok-thailand | 1,800 | 32 | | | |

### Group 2 — City scams (Beware Board entry queries) (12 keywords)

These are the highest-intent Beware Board queries. Investigative, not
inspirational. Lower volume but very high conversion.

| # | Keyword | City | EST vol/mo | KD est | Real vol | Real KD | Your rank |
|---|---|---|---|---|---|---|---|
| 13 | jaipur tourist scams | jaipur-india | 600 | 20 | | | |
| 14 | goa scams to avoid | goa-india | 1,200 | 25 | | | |
| 15 | delhi tourist scams | delhi-india | 2,400 | 40 | | | |
| 16 | mumbai taxi scams | mumbai-india | 800 | 28 | | | |
| 17 | varanasi tourist scams | varanasi-india | 400 | 18 | | | |
| 18 | agra tourist scams | agra-india | 700 | 22 | | | |
| 19 | bangkok scams 2026 | bangkok-thailand | 1,500 | 30 | | | |
| 20 | tokyo scams to avoid | tokyo-japan | 600 | 25 | | | |
| 21 | paris tourist scams | paris-france | 4,000 | 45 | | | |
| 22 | dubai tourist scams | dubai-uae | 800 | 28 | | | |
| 23 | seoul scams | seoul-south-korea | 400 | 22 | | | |
| 24 | hanoi tourist scams | hanoi-vietnam | 700 | 24 | | | |

### Group 3 — Brand + category (6 keywords)

Higher volume, higher difficulty, lower conversion — but these are the
"brand build" queries. Win these in year 2.

| # | Keyword | EST vol/mo | KD est | Real vol | Real KD | Your rank |
|---|---|---|---|---|---|---|
| 25 | solo female travel india | 8,000 | 55 | | | |
| 26 | is india safe for women | 12,000 | 62 | | | |
| 27 | women only travel india | 1,500 | 30 | | | |
| 28 | solo travel safety tips women | 3,500 | 50 | | | |
| 29 | safest places for solo female travel | 2,800 | 48 | | | |
| 30 | foreign women in india safety | 1,200 | 35 | | | |

---

## Compute the midpoint

After filling in "Real vol" for all 30:

```
Total monthly searches = sum of all 30 "Real vol" cells
Midpoint per keyword = total / 30
Total surface area at scale = midpoint × 190 keyword targets
```

### Estimated values (replace with real)

| | Sum | Midpoint per kw | Surface area (×190) |
|---|---|---|---|
| Estimated (this doc) | 49,400 | 1,647 | 312,930 |
| Real (after research) | | | |

### What to do with the real number

| If midpoint is | Pitch impact |
|---|---|
| < 400 | "We're long-tail-only" — emphasize Beware Board defensible data; soften organic projections by 50% in pitch |
| 400–800 | Use the founder-original ₹1.2 Cr year-1 model; conservative |
| 800–1,500 | Use the model. The 600–900 estimate was too low. Walk in confident. |
| > 1,500 | Surface area is bigger than modeled. Either accelerate cards or raise capture-rate assumption. Be cautious — high-volume queries usually have high KD. |

---

## Apply the real number to the pitch model

After research, update **two specific lines** in the funnel model
(`docs/investor/funnel-model.md`):

1. **Cell B2** ("Total addressable monthly searches") — replace 140,000
   with: `your real midpoint × 190`
2. **Year-3 surface area** — if Real KD averages above 50, push the
   "100 cards live" milestone from year 3 to year 4.

---

## Honest framing in the pitch

> "We did the keyword research across 30 representative queries in our 190
> SEO surfaces. Verified midpoint is X searches/month per keyword. Total
> addressable surface: ~Y monthly searches. Average difficulty Z, which puts
> us in the [tier-2 / tier-3] competitive bracket. That's a real number from
> Ahrefs/GKP, not a model assumption."

Investors will believe a number you can defend better than a number that
sounds good.

---

## Bonus — what to also pull while you're in the tool

While Ahrefs is open, run these one-off searches for the comparables doc:

1. **Lonely Planet's domain** (`lonelyplanet.com`) — note their organic
   traffic estimate (Ahrefs shows it on Site Explorer). Use this as the
   ceiling.
2. **TripAdvisor** — same. Use as the absolute ceiling.
3. **JourneyWoman** (`journeywoman.com`) — use as the floor for women-only
   travel content.
4. **Pinkpangea** (defunct — try Wayback Machine) — peak traffic before
   shutdown.
5. **Indian travel content sites** — `tripoto.com`, `thrillophilia.com`,
   `holidify.com`. Note their traffic to anchor "what's possible in India".

These five numbers go into `docs/strategy/comparables.md`.

---

## Time budget

| Step | Minutes |
|---|---|
| Sign up Ahrefs / GKP | 10 |
| Pull 30 keyword volumes | 45 |
| Pull 5 comparable domains | 15 |
| Compute midpoint, update doc | 10 |
| Update model + comparables doc | 10 |
| **Total** | **90** |

Block one morning. Don't pitch again without these numbers.
