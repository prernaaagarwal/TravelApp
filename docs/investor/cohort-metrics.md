# Cohort metrics — methodology and how to read this dashboard

> Audience: investors, lead engineers, the founder. Read once, cite forever.

The single most common investor question is *"show me a cohort with real retention."*
This document explains exactly how each number on `/admin/cohorts` is computed,
what it means, and what an honest answer to the investor sounds like at our
current data volume.

## The four views

### 1. `signup_cohorts`
Grouped by `date_trunc('week', profiles.created_at)`. One row = one ISO week.
Counts every authenticated signup, free or paid.

**What it tells you:** top-of-funnel growth. Week-over-week change is the
single most-watched line.

### 2. `activation_cohorts`
Activation = a signed-up user reads at least one intel card within 7 days of
signup. Source: `intel_card_views.viewer_id = profiles.id`.

**What it tells you:** the *quality* of the funnel. A rising signup line with
falling activation means we're acquiring noise. A flat signup line with rising
activation means we're acquiring better fit.

**Industry benchmark:** consumer subscription products target 40%+ activation.
Below 25% is a product-market-fit warning, not a marketing problem.

### 3. `retention_cohorts` (the headline view)
For each weekly cohort, count distinct users who returned at:
- **D1** — between 24h and 48h after signup
- **D7** — between 24h and 168h after signup
- **D30** — between 24h and 720h after signup

"Returned" = generated any `intel_card_views` event after signup day.

**What it tells you:** is the product habitual or transactional?
- D1 high, D7 falling fast = curiosity, not utility
- D7 ≈ D30 (flat retention) = healthy transactional product
- D30 < 5% = transactional product with no re-engagement loop

**Honest framing for travel content:** D30 of 8–15% is normal — solo travel is
1–3 trips/year, not weekly. We win on *re-acquisition* (search → return for
next trip), not daily-active habit. Investors who don't accept this are
pattern-matching to the wrong category.

### 4. `revenue_cohorts`
Conversion of free signup → paid (`membership_tier <> 'free'`) per cohort.

**Status:** placeholder. Returns 0 until Stripe/Razorpay webhooks populate
`membership_tier`. Architecture is shipped; the number is unmeasured.

## What to say to an investor today

> "We have N total signups across M cohorts. Activation runs at X%, which is
> [above / below / in line with] the consumer subs benchmark. Retention is
> early — meaningful read needs 60+ days of paid traffic, which is post-round.
> Today this dashboard is *plumbing proven*, not *retention proven*. The
> first ₹30L of the round buys the cohort dashboard live with paid users on it."

That's the honest answer. Do not invent numbers.

## What to fix as data accumulates

1. **Materialize the views** when `signup_cohorts` exceeds ~100K rows
   (query cost crosses 200ms). Refresh hourly is sufficient.
2. **Add segment dimension** — split each view by `profiles.segment->>'persona'`
   (priya / sara / ananya). Investors will ask for the per-segment retention
   triangle once we cross 1,000 signups.
3. **Add channel attribution** — when paid acquisition turns on, join to a
   `signup_attribution` table to compute retention by channel (organic vs
   instagram vs partner referral). That's the cohort *cube* — currently overkill.
4. **D90 column** — add once we have 4+ months of data. Until then it's noise.

## Where the data lives

```
supabase/migrations/053_cohort_views.sql        # the views themselves
app/admin/cohorts/page.tsx                       # the read-only dashboard
app/admin/layout.tsx                             # nav entry under "Cohorts"
docs/investor/cohort-metrics.md                  # this file
```

## Limits / known gaps

- Anonymous fingerprint views (no `viewer_id`) are excluded from retention.
  This *understates* retention — a real user reading without logging in counts
  as zero. Acceptable trade-off; logged-in is the cohort that matters for paid
  conversion.
- Weekly buckets (not daily) — daily is too noisy at our volume; weekly is the
  right granularity until we cross 5K signups/week.
- No exclusion for staff / test accounts. Add an `is_internal` flag on
  `profiles` and filter in views before pitching the dashboard with > 100
  total rows.
