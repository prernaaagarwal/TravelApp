# Wedge, not platform — the focus memo

> Reread before every build session and every investor meeting.
> If a feature isn't named in this doc, it's V2 or it's deleted.
> Owner: Founder. Last updated: April 2026.

## The problem this doc solves

Wander Women has been built as a *platform* — 9 routes, 6 features, 4 personas,
3 monetization lines. Investors call this "kitchen sink." Founders who ship
kitchen sinks lose to founders who ship a wedge. This doc cuts the kitchen
sink down to a wedge that fits in one sentence.

## The one-sentence wedge

> **A women-only, named-contributor incident map for solo travel in India —
> with the Beware Board as the entry point and verified intel cards as the
> conversion surface.**

Everything in this product either makes that sentence more true, or it gets
deferred. Below is the full audit.

## What we are keeping (the wedge)

These features earn their seat. Each is the spine of the unit thesis.

### 1. The Beware Board (`/community/beware/[city]`)
**Why it stays:** highest virality, lowest commodity-risk, defensible primary
data. Geo-tagged, date-stamped, photo-backed. This is the *only* feature where
we are not competing on content — we are competing on incident-graph density.

**Investment:** scale from 22 cities to 50, add Hindi/regional language
support, add "verified within 30 days" filter, add public RSS for AEO citation.

### 2. Trip Intel Cards (`/intel/[slug]`)
**Why it stays:** the conversion surface for paid membership. The Beware Board
gets the click; the Intel Card converts the email; the membership unlocks
the deeper sections. Without this, Beware Board is a charity.

**Investment:** scale from 25 cards to 100, sharpen the premium gate, add the
"ask the contributor" feature (post-payment).

### 3. Contributor profiles (`/contributor/[name]`)
**Why it stays:** the trust signal that makes us not-Reddit. Named, verified,
attributed. Without contributor pages, Intel Cards are anonymous content.

**Investment:** add public earnings transparency, add contributor reputation
score, ship the contributor revenue-share dashboard.

### 4. Verification + moderation infrastructure
**Why it stays:** the moat. AI-assisted human review (today) → HyperVerge
biometric KYC (post-round). Without this, the platform is unscalable.

**Investment:** integrate HyperVerge at 500 verifications/week threshold,
ship Resident Grievance Officer page, ship public Trust & Safety report.

### 5. Account + Auth + RLS
**Why it stays:** table stakes. Cannot run a women-only platform without
verified accounts and row-level security. Already shipped — no further
investment until Stripe integration adds membership tier-gating.

## What we are deferring (Wave 2 — month 6+)

These features have merit but compete with wedge focus. They go on the back
burner and ship only after Wave 1 hits its milestones.

### `/buddy` — Buddy matching
**Why deferred:** chicken-and-egg matching market. Needs > 1,000 verified
women to be useful. Today it's a feature pretending to be a product. Mock
data on `/buddy` becomes embarrassing once investors read this document.
**When it ships:** when verified-user count crosses 1,000. **What replaces
it now:** delete the route from the nav, keep the codebase, point the URL
to `/coming-soon`.

### `/vault` — WhatsApp Vault
**Why deferred:** ₹199 product is a feature, not a product. Brand fragmentation
risk. Better as a free perk for founding members.
**When it ships:** never as a paid SKU. Bundle into the membership.
**What replaces it now:** make Vault a free founding-member benefit; remove
₹199 pricing copy.

### `/feed` — Trip Feed
**Why deferred:** competing surface to Intel Cards. Confuses the user. Two
feeds dilute attention.
**When it ships:** as a tab inside `/contributor/[name]` profile pages, not
a top-level route.
**What replaces it now:** keep the data, retire the route.

### `/shop` — Safety products
**Why deferred:** ₹500 in monthly affiliate revenue does not justify a
top-level route. Belongs as a sidebar inside Intel Cards.
**When it ships:** as inline product placement on Intel Card stay-recs.
**What replaces it now:** remove from main nav, keep as `/intel/[slug]`
inline content.

### `/onboarding` — 3-question segmentation
**Why deferred:** premature personalization. Asks users for input before
proving value. Reverse the ratio: prove value, then personalize.
**When it ships:** post first 1,000 paid members, when we have signal on
which onboarding inputs predict retention.
**What replaces it now:** delete. Let users explore and personalize via
behavior, not interrogation.

## What we are killing (cut for V1)

### Foreign-women segment as a primary persona
**Why killed:** Sara has the highest WTP but lowest accessibility. Acquisition
cost is 3× Indian users; total addressable foreign-women-visiting-India market
is ~1.5M/year vs 6M+ for Indian solo women travelers. **India-first, foreigner-
later.** We keep 3 cards for foreign women as SEO surface, but stop pretending
Sara is co-equal with Priya in V1.
**Implication:** kill the dual-CTA on the landing page. Single CTA to Priya.
Foreign-women content stays indexable but un-promoted.

### Paid acquisition at launch
**Why killed:** CAC math is unproven. Burning ₹50K on Instagram in week 4 is
gambling, not growing.
**When it returns:** post 90 days of organic data, with measured visitor-to-
paid conversion, only then does paid acquisition turn on.

### B2B safety-intel-as-a-service
**Why killed for V1:** different sales motion, different buyer, different
positioning. Distracts from consumer wedge. **Keep as a year-3 unlock.**

## The single metric

If we measure one thing, it's **paid members at end of month 6**.

Target: 500 paid members. ₹999 ARPU = ₹5L MRR run-rate. Below 200 = pivot.
Above 800 = accelerate. This is the only number that matters for Wave 1.

Sub-metrics that feed it (in order of leading indicator strength):
1. Beware Board MAU
2. Intel Card read rate (D7 within cohort)
3. Email signups per week
4. Email → paid conversion %
5. Founding contributor card velocity

## Tradeoff log

The decisions above were not free. Document the cost of each:

| Decision | What we lose | Why we accepted the loss |
|---|---|---|
| Defer Buddy | ~10% of pitch story | Chicken-and-egg without scale |
| Defer Vault | ~₹6L year-1 revenue | Brand fragmentation risk |
| Defer Feed | One persona surface | Dilutes Intel Card attention |
| Defer Shop | ~₹2L year-1 revenue | Inline placement is better UX |
| Defer Onboarding | Personalization signal | Premature; reverse the ratio |
| Kill Sara as primary | Foreign WTP advantage | India is the wedge market |
| Kill paid acquisition | Speed to scale | CAC unproven; gambling |
| Kill B2B for V1 | Diversified revenue | Consumer wedge needs focus |

Each row above is a tradeoff. None is permanent. All are defensible in an
investor meeting.

## Investor-facing one-liner

> *"V1 is the Beware Board + verified Intel Cards for solo women in India.
> Buddy, Vault, Feed, Shop are deferred until V1 proves out at 500 paid
> members. Foreign-women is V2. B2B is year 3."*

That is the wedge. Memorize it.

## Engineering implications

### ✅ Shipped (2026-05-07, commit referenced in build-status.md)

1. **Primary nav culled to 4 items.** `lib/nav.ts` now lists Intel
   (`/explore`), Beware Board (`/community/beware`), Community
   (`/community`), Safety (`/safety`). Routes for `/buddy` and `/feed`
   remain live but no longer surface in Header / MobileNav.
2. **Footer reshaped.** `components/shared/Footer.tsx` split into
   "Wander Women" (About, Methodology, Membership, Feedback) + "More"
   (Trip Reports, Buddy, Vault, Safety Kit). Deferred features remain
   discoverable but un-promoted.
3. **Single landing CTA.** `app/page.tsx` replaced the Priya/Sara
   dual CTA with one primary action ("Explore Intel" → `/explore`) +
   a secondary Beware Board action. Foreign-women content stays
   indexable via a small text link to `/intel/delhi-india`.
4. **Pricing locked.** All ₹499 mentions swept to ₹999 in earlier
   commit. Vault is bundled into the founding membership per
   `app/pricing/page.tsx`.

### 📝 Still pending

5. **Update `PRD.md`** — mark Wave 2 features as deferred. The PRD
   remains useful as a product memory, but the wedge doc is the
   *current* spec. (Founder action — a few minutes editing PRD.md.)

## How to know when to revisit this doc

Revisit when ANY of these is true:
- 500 paid members reached (the upgrade trigger)
- 200 paid members at month 6 (the pivot trigger)
- An investor pushes back hard on the deferred list (signal worth listening to)
- A deferred feature can be re-shipped in < 1 engineer-week (low-cost reactivation)
- The Beware Board legal exposure forces a posture change

Until any of those is true, **the wedge doesn't change.** The temptation to
re-add features is the single biggest threat to this product. The PRD lists
that temptation in Section 13 as the critical risk. This document is the
mitigation.

## Founder commitment

By signing below (in spirit), I commit to:
- Not adding a feature this doc doesn't name, for 6 months
- Treating "platform" pitches as a yellow flag in my own thinking
- Telling investors who push for the platform vision that we'll get there *via*
  the wedge, not in parallel to it
- Re-reading this doc before every Monday standup

Signed: *the founder*
Date: April 2026
Next review: month 6 milestone gate
