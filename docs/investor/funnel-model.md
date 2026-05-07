# Funnel model — Wander Women year 1–3

> One-tab editable model. Send the CSV (`funnel-model.csv`) to investors.
> They can poke any cell. Editable models get diligence calls; static decks
> die. Update assumptions before each pitch using the boxed cells below.

## How to use

1. **Open** `docs/investor/funnel-model.csv` in Google Sheets (File →
   Import → upload, or just drag and drop)
2. **Note the formula reference column** (rightmost). Cells with formulas
   should be replaced with live cell references after import — the CSV
   stores them as text, Sheets won't auto-execute them.
3. **Edit any teal-bordered cell** (the assumption rows). Watch the green
   cells (revenue) recompute.
4. **Save as a Sheets file** with sharing set to "anyone with link can
   view." That's the link you put in the follow-up email.

## The model at a glance

### Top of funnel — surface area + capture

| | Year 1 | Year 2 | Year 3 |
|---|---|---|---|
| SEO surfaces (URLs) | 47 | 75 | 150 |
| Keyword vol/surface (mo) | 1,000 | 1,100 | 1,200 |
| **Total searches/mo** | **47,000** | **82,500** | **180,000** |
| Capture rate | 5% | 10% | 18% |
| **Visitors/mo** | **2,350** | **8,250** | **32,400** |
| Visitors/yr | 28,200 | 99,000 | 388,800 |

**The single biggest driver is content velocity** — 47 → 75 → 150 surfaces.
Each new card or city adds ~1,000 searches/mo to the top of the funnel.

### Email funnel

| | Year 1 | Year 2 | Year 3 |
|---|---|---|---|
| Visitor → email | 4% | 5% | 6% |
| Email captures/yr | 1,128 | 4,950 | 23,328 |

Industry travel-content median: 2.8% (HubSpot 2024). We model 4% because
our email gate offers a specific deliverable (safety pack PDF), not just a
newsletter.

### Paid funnel

| | Year 1 | Year 2 | Year 3 |
|---|---|---|---|
| Email → paid (60d) | 3% | 5% | 7% |
| Direct visitor → paid | 0.5% | 0.8% | 1.2% |
| New paid members/yr | 175 | 1,039 | 6,299 |
| **Cumulative paid (90% retention)** | **175** | **1,188** | **6,900** |

### ARPU stack

| | Year 1 | Year 2 | Year 3 |
|---|---|---|---|
| Membership | ₹999 | ₹1,099 | ₹1,199 |
| Affiliate (per paid) | ₹400 | ₹500 | ₹600 |
| Vault attach (25%) | ₹50 | ₹80 | ₹100 |
| **ARPU per paid** | **₹1,449** | **₹1,679** | **₹1,899** |
| Free-tier affiliate (per visitor) | ₹40 | ₹50 | ₹60 |

### Revenue lines

| | Year 1 | Year 2 | Year 3 |
|---|---|---|---|
| Membership revenue | ₹1.7L | ₹13.1L | ₹82.7L |
| Paid affiliate | ₹0.7L | ₹5.9L | ₹41.4L |
| Vault | ₹0.1L | ₹1.0L | ₹6.9L |
| Free-tier affiliate | ₹11.3L | ₹49.5L | ₹233.3L |
| **Total revenue** | **₹13.8L** | **₹69.4L** | **₹364.3L** |

**Note the free-tier affiliate line.** This is the largest revenue line in
year 1 and most investors miss it on first pass — affiliate clicks happen
on free traffic, not just paid members. It scales with raw traffic, not
with paid conversion. Highlight this if challenged on the membership
revenue being small.

### Costs (rough, for sanity)

| | Year 1 | Year 2 | Year 3 |
|---|---|---|---|
| Contributor payouts | ₹1.0L | ₹3.0L | ₹6.0L |
| Hosting + tooling | ₹0.5L | ₹1.5L | ₹4.0L |
| Verification (KYC) | ₹0.3L | ₹1.8L | ₹9.0L |
| Team payroll | ₹18L | ₹36L | ₹72L |
| **Total costs** | **₹19.8L** | **₹42.3L** | **₹91L** |
| **Net** | **(₹6.0L)** | **₹27.1L** | **₹273L** |

Year 1 is loss-making — that's the round. Year 2 is profitable. Year 3 is
when B2B safety reports + foreign-women premium tier compound.

### Key ratios

| | Year 1 | Year 2 | Year 3 |
|---|---|---|---|
| Visitor → paid blended | 0.6% | 1.1% | 1.6% |
| ARR run-rate exit | ₹13.8L | ₹69.4L | ₹3.6 Cr |
| LTV (3-yr retention) | ₹3,500 | ₹4,500 | ₹5,500 |
| CAC payback (months) | 12 | 8 | 6 |
| LTV/CAC | 3.5× | 4.5× | 5.0× |

LTV/CAC ≥ 3 is the venture floor. We hit it year 1 and improve.

## What changes the model the most

In order of sensitivity (1 = most sensitive):

1. **Capture rate** — moving from 5% to 3% halves year-1 visitors
2. **Surface count** — content velocity directly scales top-of-funnel
3. **Email → paid conversion** — moving from 3% to 1% cuts paid revenue 67%
4. **ARPU** — affects all paid lines but not free-tier affiliate
5. **Visitor → email** — small dollar impact at our scale

**Do not pitch the moonshot.** The model above is the *base case.* The
pitch number to use: ₹13.8L year-1, ₹69.4L year-2, ₹3.6 Cr year-3 ARR.

## What's NOT in this model (intentionally)

- B2B safety intelligence revenue (year-3 unlock, not modeled)
- Foreign-women premium tier (year-2 unlock)
- Sponsorship / brand partnerships (out of scope for V1)
- App store revenue (no mobile app planned)
- Token economy / referral incentive lift

These are upside, not base case. Investors who want to see them get a
separate "upside scenarios" appendix.

## Updating before each pitch

Three numbers to refresh before every meeting:

1. **Real keyword midpoint** from `docs/strategy/keyword-research.md`
   → updates row "Keyword vol/surface"
2. **Real capture rate** from current SERP positions
   → updates row "Capture rate"
3. **Real cohort retention** from `/admin/cohorts`
   → updates the implicit assumption that cumulative paid grows at
   90% retention y2→y3

Each refresh takes 5 minutes. Doing it once before each pitch is the
difference between modeled and measured numbers.
