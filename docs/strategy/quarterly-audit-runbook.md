# Quarterly audit runbook

> Run every 90 days. Two hours of work that closes the gap between "we
> shipped good infrastructure" and "we're using it." Without this, the
> Perplexity audit, the SERP rank check, and the funnel model decay into
> dead artifacts.
>
> Schedule: first Monday of each quarter. Block 2 hours on the calendar
> permanently.

## What gets audited each quarter

Five tasks. Numbered in the order to run them — earlier tasks feed
later ones.

### 1. SERP rank check (15 min)

```bash
cd scripts/serp-audit
npx playwright test serp-rank-check.spec.ts --headed
```

- Output goes to `scripts/serp-audit/results/<timestamp>/`
- Compare to previous quarter's `summary.json`
- Track movement: are cards ranking higher/lower?

**Update:** copy `summary.json` to `docs/investor/quarterly-audits/<YYYY-Qn>-serp.json`

### 2. Perplexity citation audit (15 min)

```bash
cd scripts/serp-audit
npx playwright test perplexity-audit.spec.ts --headed
```

- Output: `scripts/serp-audit/results/perplexity-<timestamp>/`
- Check if Wander Women is cited yet (`citation_graph.we_are_cited`)
- Track top-cited domains — has the competitive landscape shifted?

**Update:** copy `summary.json` to `docs/investor/quarterly-audits/<YYYY-Qn>-perplexity.json`

### 3. Refresh keyword volumes (30 min)

If you have an Ahrefs subscription, re-pull volumes for the 30 keywords
in `docs/strategy/keyword-research.csv`. Markets shift; "is goa safe for
women" may have moved 30% in either direction since last quarter.

If not, skip this and use the previous quarter's numbers.

**Update:** the verified columns in `keyword-research.csv` and the
midpoint cell B4 in `funnel-model.xlsx`.

### 4. Refresh the funnel model (30 min)

Three updates:

#### a. Replace assumptions with measured numbers

Pull from `/admin/cohorts`:
- Real visitor → email conversion (from PostHog)
- Real email → paid conversion (from `revenue_cohorts` view)
- Real D30 retention (from `retention_cohorts` view)

Replace the corresponding cells in `funnel-model.xlsx`:
- B10 (visitor → email)
- B13 (email → paid)
- The implicit retention assumption in B16

#### b. Update content velocity

Surface count = how many cards + cities are live this quarter.
Update B3 in the xlsx.

#### c. Update RPM if you have new affiliate data

If Booking / Amazon / Airalo / World Nomads have paid out commission
this quarter, compute real RPM:

```
real_RPM = total_commission / total_clicks
```

Update B19 (paid affiliate per member) and B22 (free-tier affiliate
per visitor).

**Update:** save funnel-model.xlsx, regenerate via:
```bash
python3 scripts/build-funnel-xlsx.py
```

### 5. Update build-status doc (15 min)

In `docs/investor/build-status.md`:

- Update route count if any new routes shipped
- Update mock vs live status
- Update test counts if test files added/removed
- Update the "measured vs modeled" split based on what was modeled
  → measured this quarter

### 6. Update press log (5 min)

Re-read `docs/press/mentions.md`:
- Confirm milestone counts are current
- Add tier-summary line to investor update if any Tier-1 mentions
- Note progress toward Wikidata threshold (5+) and Wikipedia threshold (8+)

### 7. Personal review — wellbeing (10 min)

Re-read `docs/founder/wellbeing-resources.md`. Honest answers:
- Therapy weekly? Y/N
- Peer group active? Y/N
- Personal runway > 6 months? Y/N
- Sleeping 7+ hrs / 5 nights? Y/N

If any No, that's the highest-priority action item this quarter.
Higher than any business task.

## After the audit — write the quarterly update

A 1-page update to send to investors, advisors, and yourself.
Template:

```markdown
# Wander Women — Q[X] [YYYY] update

## The numbers
- Cards live: N
- Beware reports moderated this quarter: N
- New paid members: N (cumulative: N)
- D30 retention this quarter: N%
- Press mentions: T1: N · T2: N · T3: N

## SEO/AEO
- SERP rank changes: [up/down/flat] for top 5 queries
- Perplexity citation: [yes/no] · top competitors: [domains]
- Wikidata: [pre / filed / live]

## Operating
- Q[X] focus: [one-sentence theme]
- Ahead of plan: [what]
- Behind plan: [what]
- Decisions made: [what]

## Asks
[1–3 specific things investors / advisors can help with]
```

## Why this exists

Without a runbook, quarterly audits become annual audits become never.
The infrastructure is already built — `serp-audit/` scripts exist,
the cohort dashboard exists, the press log exists. This file is the
2-hour-per-quarter glue that keeps it alive.

## Calendar template

Add the following to your calendar, recurring every 3 months:

```
Title:    Wander Women quarterly audit (2 hours)
Repeats:  Every 3 months on the first Monday
Time:     09:00–11:00 IST
Notes:    Run docs/strategy/quarterly-audit-runbook.md
          Block as busy. Don't schedule meetings over.
          Outputs land in docs/investor/quarterly-audits/.
```

## Time budget

| Task | Minutes |
|---|---|
| SERP rank check | 15 |
| Perplexity audit | 15 |
| Refresh keyword volumes (with Ahrefs) | 30 |
| Refresh funnel model | 30 |
| Update build-status doc | 15 |
| Update press log + milestones | 5 |
| Personal wellbeing review | 10 |
| Write quarterly update | 30 |
| **Total** | **~150 min** |

Block half a day. The output is a single PDF or one-pager that you
send to your investor list, advisors, and put in the data room.

## Output directory structure

After 4 quarters, your audit history looks like:

```
docs/investor/quarterly-audits/
├── 2026-Q2/
│   ├── serp.json
│   ├── perplexity.json
│   ├── update.pdf
│   └── notes.md
├── 2026-Q3/
└── ...
```

That's the receipt that says "we operated this product, didn't just
ship it."

## Changelog

- **2026-05-07** — initial runbook. Audit cadence: quarterly,
  starting 2026-Q3.
