# Modeled vs Measured

> One slide. Two columns. The honesty IS the slide.

The point of this slide is to lead with the gap. Investors will catch any
mismatch between what we *know* and what we *assume* the moment they pull
the deck up next to the data room. Putting it on the wall first turns the
single largest diligence flag into a credibility marker.

**Read order on the slide: left → right.** Left is the floor (we have
proof). Right is the ceiling (we have a model). Everything in between is
the work.

---

## ⚠️ Read this before pasting into the deck

**Most numbers in this template are industry benchmarks I (Claude) inserted
as placeholders, not numbers the founder has actually measured or
modeled.** Every benchmark is tagged inline with `*(benchmark — replace
with your own)*`.

Before this slide goes in front of an investor:

1. Open the founder's actual model (`docs/investor/funnel-model.xlsx`).
2. For every tagged cell below, either (a) replace the number with the
   founder's real model assumption, or (b) leave the benchmark in place
   AND keep the tag visible — it tells the investor "this is industry
   data, not our forecast."
3. Strip the `⚠️` callout from the top before printing.

The two numbers that are NOT benchmarks and don't need replacement:
**₹999/year founding price** and **₹1,999/year public price**. These are
founder-set anchors. Everything else is a placeholder.

---

## The slide (paste into Keynote / Slides / PDF as a 2×N table)

| Measured (what we know today) | Modeled (what we're assuming for projection) |
| :--- | :--- |
| **Surface area: cities live** *(replace with current count from `intel_cards` table)* with verified Trip Intel, Beware Board, and Community shipped | **Coverage target by Q4 2027** *(replace with founder roadmap)* — at current research velocity *(replace with actual cities/month rate)* |
| **Affiliate clicks captured** in `affiliate_clicks` *(replace with actual count from the table; query: `select count(*) from affiliate_clicks;`)* | **Click-to-conversion rate** *(benchmark — replace with your own)*. Industry blend across travel affiliate networks: typically 1–3%. Drop the placeholder once `affiliate_reconciliation_monthly` has 6 months of real data. |
| **Signup count: live in `profiles`** — see the cohort dashboard for the current number | **Free-to-paid conversion** *(benchmark — replace with your own)*. Founding-200 window typically converts higher than steady-state; pick a number you'll defend. |
| **Content output: Trip Intel Cards published, Beware Board entries** moderated and live *(replace with current counts)* | **ARPU: ₹999/year (founding), ₹1,999/year (public)** — payment processing not live yet, so 0 closed transactions to date. |
| **Editorial process: multi-source verification** documented at `/methodology` and enforced on every card *(replace with the actual N — 3-source, 5-source, etc.)* | **Year-1 retention** *(benchmark — replace with your own)*. Comparable women's-vertical SaaS sees a wide range; pick what your model assumes. <12 months of operating history means this number is genuinely modeled, not measured. |
| **Email opt-in rate** *(replace with actual figure from PostHog session funnel — query the last 30d cohort)* | **CAC payback** *(benchmark — replace with your own)*. Assumes content-led acquisition at current organic rate. 0 paid spend to date, so any CAC number here is theoretical. |
| **Distribution: partner programs live** (Amazon Associates, Booking, Airalo, World Nomads) — click-side instrumented, conversion-side pending | **Commission RPM** *(benchmark — replace with your own)*. ₹40 per 1,000 clicks is an industry blend; see `affiliate_conversions` table for the path to your real number. |
| **Founder/team: 1 founder full-time, 0 hires** | **Team plan: hires by [DATE]** *(replace with actual hiring plan)* — contingent on this round closing. |

---

## Speaker notes (when an investor asks)

The split looks unfavorable on the right side because it's *honest*. A
single number on the right that doesn't have a peer measurement on the
left is not a hidden assumption — it's an explicit one. We've separated
them so you don't have to.

- **Why no paid revenue yet?** Stripe wasn't a launch blocker for the wedge
  — the wedge is "is this surface area trustworthy enough to bookmark?"
  We chose to ship the trust layer first. Payment processing is gated on
  closing this round. Founding members are reserving seats now at the
  ₹999/year locked-for-life rate; the price banner on `/pricing` is
  explicit about beta status.

- **Why no conversion data?** Affiliate networks don't expose live APIs to
  small accounts. We log clicks on our side; partners report conversions
  at month-end through dashboards. The `affiliate_conversions` table
  (migration 054) ingests those reports manually each month. Once we have
  6 months of reconciled data, every right-column number above moves left.

- **What would you measure differently if you had this round?** Two things.
  First, paid acquisition cost from a real ₹50K test on Meta — that
  collapses CAC payback from "modeled" to "measured." Second, conversion
  on a paid waitlist segment — even ₹1 to credit-card-on-file gives us a
  true intent number that's denominated in money, not email opt-ins.

---

## Update cadence

Move a row from right to left the moment the measurement is real. Don't
wait for "perfect" data — `n=20` real data points beats a benchmark of
`n=∞`. When a row crosses over, note the date and the data source in the
`Measured` cell. Example:

> **Click-to-conversion: 1.4%** *(measured Q3 2026, n=14 conversions across
> Amazon + Booking; partner reconciliation in `affiliate_reconciliation_monthly`)*

Investors who get the next quarterly update want to see the left column
grow. Each migration is a credibility receipt.

---

*This doc lives in `/docs/investor/modeled-vs-measured.md`. Reference it
in the deck appendix as Slide A-1 (or wherever your appendix index puts
diligence slides).*
