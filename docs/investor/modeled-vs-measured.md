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

## The slide (paste into Keynote / Slides / PDF as a 2×N table)

| Measured (what we know today) | Modeled (what we're assuming for projection) |
| :--- | :--- |
| **Surface area: 16 cities live** with verified Trip Intel, Beware Board, and Community shipped | **Coverage: 100 cities by Q4 2027** at current research velocity (3 cities/month avg) |
| **Click volume: ~12,400 affiliate clicks** captured in `affiliate_clicks` (last 60 days, post-launch) | **Click-to-conversion: 2.1%** (industry benchmark across travel affiliate networks; we have 0 months of own data) |
| **Signup count: live in `profiles`** — see the cohort dashboard for the current number | **Conversion to paid: 12% of free signups** in the founding-200 window, dropping to 4% steady-state |
| **Content output: 50+ Trip Intel Cards published, 200+ Beware Board entries** moderated and live | **ARPU: ₹999/year (founding) and ₹1,999/year (public)** — no payment processing live yet, so 0 closed transactions |
| **Editorial process: 3-source verification** documented at `/methodology` and enforced on every card | **Retention (year 1): 65%** — drawn from comparable women's-vertical SaaS (Refinery29 Premium, NotJustSouls); we have <12 months of operating history |
| **Email opt-in rate: ~7%** of unique landing visitors (PostHog session funnel, last 30d) | **CAC payback: 9 months** — assumes content-led acquisition continues at current organic rate. 0 paid spend to date |
| **Distribution: 4 partner programs live** (Amazon Associates, Booking, Airalo, World Nomads) with the click-side instrumented | **Commission RPM: ₹40 per 1,000 clicks** (industry blend); see `affiliate_conversions` table — 0 reconciled months at the time of this deck |
| **Founder/team: 1 founder full-time, 0 hires** | **Team plan: 2 hires Q1 2027** (head of content + 1 engineer) — contingent on this round closing |

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
