# Cap table thinking — seed-stage memo

> Pre-empts the "what does the cap table look like?" question every
> seed partner asks. Read this once before the next round, send it as
> a follow-up if asked.
>
> **Important:** this is general thinking, not legal/tax advice. Engage
> a CA + corporate lawyer before any actual cap table action. Costs
> ~₹15K for a clean SHA + cap table set-up at seed stage.

## Today's cap table (pre-seed)

```
Founders                                  100%
─────────────────────────────────────────────
[Founder name]                            100%
```

This is the cleanest cap table in the world. Every cell after this
gets messier — that's expected and correct. The goal isn't to keep
100%; it's to make every dilution worth more than the equity it costs.

## Recommended seed structure

### The numbers

| Item | Pre-money | Post-money |
|---|---|---|
| Seed raise | ₹2 Cr | — |
| Pre-money valuation (suggested range) | ₹8–12 Cr | — |
| Post-money valuation | — | ₹10–14 Cr |
| Investor stake (this round) | — | 14–20% |
| Founder stake post-round (no ESOP) | — | 80–86% |

**Recommended landing:** ₹2 Cr at ₹10 Cr pre / ₹12 Cr post = 16.7%
investor stake. Founder retains 83.3%. ESOP creates the next 10%
(see below) — founder ends at ~73%.

### Why these numbers

- **₹2 Cr is the right size for our milestones.** Builds: technical
  co-founder + community ops + content velocity for 18 months. Less
  is starvation; more dilutes too early.
- **₹10 Cr pre-money is defensible.** Comparable Indian seed rounds
  for women-focused / safety-tech / consumer-content companies in
  2024–25 ranged ₹6–18 Cr pre-money. We anchor at the conservative
  end of the strong-traction set.
- **16.7% investor stake is healthy.** Below 12% and the investor
  doesn't care enough; above 25% and you've over-paid for capital
  at this stage.

## The ESOP question

### Why we need it

Two reasons:
1. **Hiring.** Technical co-founder, community ops lead, content
   editors. None will join a pre-revenue startup at market salary
   without equity.
2. **Investor expectation.** Most term sheets at seed include a
   pre-money ESOP top-up — meaning the *founder* dilutes to fund
   the pool, not the new investor. If we don't allocate it
   ourselves, the term sheet imposes 10–15% pre-money.

### Recommended ESOP size

**10% post-round.** Allocates:
- ~5% for technical co-founder (vesting 4 years, 1-year cliff)
- ~2% for community ops lead
- ~1.5% pool for engineering hires 2–4
- ~1.5% reserved (uncommitted)

### Pre-money vs post-money pool

This is the single most-fought-over term in seed term sheets. In one
sentence:

- **Pre-money pool** = founder pays for the pool out of their stake
- **Post-money pool** = pool comes out of everyone's stake post-round

**Always negotiate post-money.** The math is asymmetric and most
inexperienced founders give up ~3% of equity for free by accepting
pre-money pool language without thinking about it.

### After ESOP

| Holder | Stake (recommended) |
|---|---|
| Founder | ~73% |
| Investors (this round) | ~16.7% |
| ESOP pool | 10% |
| Reserved / unallocated | ~0.3% |

That's a healthy seed-stage cap table.

## Founder vesting

### What investors expect

A 4-year vesting schedule with a 1-year cliff for ALL founder
shares. Yes, even though you're the founder. Yes, even though you
own them today.

### Why investors require this

If you stop working on the company a year in, no investor wants you
keeping 80% of equity for life. Vesting is the agreed-upon "founder
must stay engaged" mechanic.

### Acceleration triggers

Two acceleration scenarios to negotiate:

1. **Single-trigger acceleration on death/disability.** If you die
   or become incapacitated, all unvested shares vest immediately
   to your nominee.
2. **Double-trigger acceleration on acquisition + termination.** If
   the company is acquired AND you're terminated by the acquirer
   without cause within 12 months, all unvested shares vest.

These are standard at seed. If a term sheet doesn't include them,
ask for them — they're given freely in 2026 deals.

### What NOT to negotiate

Don't negotiate vesting OUT. A founder who refuses to vest signals
they don't believe in the company themselves. Investors notice.

## The investor seat at the table

### Board observer vs board member

At seed, a typical structure:
- 1 founder board seat (you)
- 1 investor board observer seat (NOT a director)
- 0 independent board members (added at Series A)

If your lead seed investor demands a board director seat at this
stage, that's a yellow flag — they're treating you like a Series A
company and may try to over-control.

### Voting rights

Standard seed: investor gets pro-rata rights, information rights,
and protective provisions for major decisions (merger, asset sale,
material debt, founder firing). They do not get day-to-day decision
rights.

### Information rights

Investor gets:
- Quarterly update letter (you'd send this anyway — see
  `docs/investor/quarterly-update-template.md`)
- Annual audited financials (Pvt Ltd compliance baseline)
- Major-decision notification (board-level, not operational)

You do NOT owe them weekly metrics, daily status, or pre-decision
veto on hires. If a term sheet asks for those, push back hard.

## Liquidation preference

### What it is

The order of payout when the company is sold. The investor gets paid
first, up to N× their investment, before founders get anything.

### Standard at seed

- **1× non-participating** is the norm in 2026 Indian seed. Investor
  gets back their ₹2 Cr first, then everyone (including investor's
  diluted equity) splits the rest pro-rata.
- **2× participating** is hostile. Don't accept it at seed.

### What this means in practice

If the company sells for ₹50 Cr and you raised ₹2 Cr at 1×
non-participating:
- Investor takes ₹2 Cr off the top
- Remaining ₹48 Cr distributed by equity stake — investor's 16.7% =
  ₹8 Cr; founder's 73% = ₹35 Cr
- Total to investor: ₹10 Cr (5× their money)
- Total to founder: ₹35 Cr

Vs hostile 2× participating:
- Investor takes ₹4 Cr off the top, then ALSO splits the remaining
  ₹46 Cr by equity
- Investor: ₹4 + ₹7.7 = ₹11.7 Cr (5.85× their money)
- Founder: ₹33.6 Cr — ₹1.4 Cr less than under non-participating

The difference is small at small exit sizes; it gets ruinous at
large ones.

## Pro-rata rights

The investor's right to maintain their percentage ownership in
future rounds. **Always grant pro-rata to lead investor.** Refuse
"super pro-rata" (right to take more than their share). Limit
pro-rata for follower investors to "best efforts" not "guaranteed"
to keep allocation flexibility for Series A leads.

## Side letters

### Common requests at seed

- **Most-favored-nation (MFN) clause.** Investor gets the best terms
  any other investor in the same round gets. Standard at small
  cheques; reasonable.
- **Right of first refusal (ROFR) on founder share sales.** Investor
  has first dibs if you want to sell. Reasonable; doesn't bind you
  to sell.
- **Anti-dilution.** If you raise a down round, investor's share
  count adjusts. Weighted-average is standard; full-ratchet is
  hostile (don't accept full-ratchet at seed).

### Requests to refuse

- **Veto on hiring/firing operational staff** — that's your job
- **Veto on product decisions below ₹X spend** — that's your job
- **Founder restriction on outside activities** — overreach unless
  literally a competitor

## Cap table table-stakes hygiene

Before any term sheet conversation:

1. **Pvt Ltd registered with MCA.** Operational entity for shares
   to exist.
2. **Founders' Agreement signed.** Even if you're solo, this signs
   the IP assignment from any pre-incorporation work to the company.
3. **CA on retainer.** ₹3–5K/mo. They sign Form-AOC and ROC
   filings. Required.
4. **Cap table maintained on a real tool.** Carta, Eqvista, or a
   well-maintained Google Sheet. Not the back of a napkin.
5. **Advisor agreements signed for any equity-comped advisors.**
   0.25–0.5% per advisor, 2-year vest, signed on letterhead.

## What I'd push back on at seed

| Term | Push back? | Why |
|---|---|---|
| Pre-money ESOP pool | Hard | Costs you ~3% of equity for free |
| 2× liquidation preference | Hard | Industry standard is 1× |
| Participating preferred | Hard | Hostile at seed |
| Investor board director seat | Soft | Observer is enough at this stage |
| Veto on operational decisions | Hard | Not their job |
| Founder vesting < 4 years | Soft | 4 years is industry standard |
| Full-ratchet anti-dilution | Hard | Weighted-average is standard |
| Protective provisions on hires | Hard | Operational; not their job |
| Pro-rata rights for lead | None | Grant happily |
| MFN for small-cheque investors | None | Cheap to give |

## What investors will push back on (and that's fine)

| Term | They want | You give | Why fine |
|---|---|---|---|
| Founder vesting | 4y / 1y cliff | Yes | Industry standard |
| Information rights | Quarterly | Yes | You'd send anyway |
| Pro-rata for lead | Yes | Yes | Aligns interest |
| Lead-investor board observer | Yes | Yes | One observer is fine |
| 1× non-participating preference | Yes | Yes | Industry standard |

## Personal financial planning

Beyond the cap table itself, three personal items:

1. **ESOP for yourself.** When you incorporate, allocate yourself
   founder shares directly (not from the ESOP pool). Founder shares
   ≠ ESOP — your tax treatment is different.
2. **Investment vehicle.** Consider routing your founder shares
   through an LLP or family trust if your CA recommends it. Tax
   implications at exit can be material.
3. **Spousal / family equity.** If you ever sell or transfer founder
   shares to a spouse or family member, get it written in advance.

## Recommended reading

- "Venture Deals" by Brad Feld — read once cover to cover
- "The Power Law" by Sebastian Mallaby — understand how funds think
- The latest YC SAFE template — even if you don't use SAFE in India,
  understanding the structure helps

## After the round closes

- Update the cap table on Carta or equivalent within 30 days
- Send the cap table summary in the next quarterly update letter
  (so all investors see consistent numbers)
- File ROC forms within 30 days (CA handles)
- Issue founder share certificates physically (lawyer handles)

## Changelog

- **2026-05-07** — initial memo. Pre-seed, no investors yet. Pre-
  empts the cap table conversation in the next term sheet.
