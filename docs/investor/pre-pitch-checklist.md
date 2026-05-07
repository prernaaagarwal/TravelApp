# Pre-pitch checklist — refresh before each meeting

> Block 45 minutes before every investor meeting. Walk this list. Don't pitch
> with stale numbers. Investors who catch you on stale numbers don't reply.

## The 7-step checklist

### 1. Refresh the funnel model (10 min)

Pull these and replace in `docs/investor/funnel-model.xlsx`:

| Source | What to pull | Cell to update |
|---|---|---|
| `/admin/cohorts` | Last weekly signups | Note in talking points |
| `/admin/cohorts` | Latest D7 retention % | Mental anchor |
| `/admin/cohorts` | Activation rate (% reading ≥1 card) | B10 area |
| Resend dashboard | Email digest open rate | Talking points |
| Affiliate partner dashboards | Real ₹ commission this quarter | B19 if updated |

If the xlsx doesn't open formatted, regenerate:
```bash
python3 scripts/build-funnel-xlsx.py
```

### 2. Re-share the model link (2 min)

The Google Sheets link in your investor follow-up email goes stale if
you re-uploaded the xlsx. Generate a fresh shareable link and paste
into the email template at `docs/investor/follow-up-email-template.md`.

### 3. Run a fresh SERP rank check (15 min)

Only if it's been > 4 weeks since the last one. Otherwise use the
existing one.

```bash
cd scripts/serp-audit
npx playwright test serp-rank-check.spec.ts --headed
```

If a card has moved, mention it specifically:
> "We're at position N for query X today, up from M last quarter."

### 4. Update the "what's live vs what's mocked" doc (3 min)

Open `docs/investor/build-status.md` and confirm:
- Any new routes shipped?
- Any mock JSON migrated to Supabase?
- Any new tables / migrations?
- Any new tests?

If no changes: timestamp update only.

### 5. Refresh the daily ops digest evidence (3 min)

Open the latest daily ops digest email. The line:
> "Yesterday: N signups, M intel-card views, K new beware reports"

Use this as a recency proof point in the pitch:
> "I read the daily ops digest this morning — yesterday we had N signups
> and approved M Beware reports. The product is alive."

### 6. Confirm the demo URLs work (5 min)

Open in incognito:
- `wanderwomen.in` — landing
- `wanderwomen.in/intel/goa-india` — flagship intel card (replace if Goa is stale)
- `wanderwomen.in/community/beware/goa-india` — Beware Board flagship
- `wanderwomen.in/contributor/<top-contributor>` — trust signal
- `wanderwomen.in/methodology` — credibility doc
- `wanderwomen.in/pricing` — bundle

If any 404 / break: don't pitch until fixed. Investors WILL check
during the meeting on their phone.

### 7. Re-read the wedge memo (5 min)

`docs/strategy/wedge.md` — read the one-sentence wedge out loud:

> "A women-only, named-contributor incident map for solo travel in
> India — with the Beware Board as the entry point and verified intel
> cards as the conversion surface."

If you can't repeat it from memory in 10 seconds, you're not ready.
Practice it in the mirror before the call.

## What you should have ready in your data room

Send this list to your laptop / data room URL the morning of the pitch:

| Doc | Path | Why |
|---|---|---|
| Build status | `docs/investor/build-status.md` | "What's actually shipped" |
| Funnel model | `docs/investor/funnel-model.xlsx` | The editable model |
| Sensitivity grid | `docs/investor/sensitivity-table.md` | Defends every cell |
| Trust & verification | `docs/legal/trust-and-verification.md` | The 101-word para |
| Verification stack memo | `docs/legal/verification-stack-memo.md` | Cost trigger story |
| Methodology page | `wanderwomen.in/methodology` | Live, citable |
| Comparables | `docs/strategy/comparables.md` | Real precedents |
| Wedge memo | `docs/strategy/wedge.md` | Focus, not platform |
| Moderation policy | `docs/operations/moderation-policy.md` | Trust & safety credibility |
| Cohort dashboard | `wanderwomen.in/admin/cohorts` (private) | Investor-grade metrics live |

If an investor asks for a doc not in this list, don't fabricate one
during the meeting. Take the action item, send within 24 hours.

## What to NOT do before the pitch

- ❌ Don't ship code 4 hours before. Bugs will surface during the demo.
- ❌ Don't update pricing 2 days before. Your deck and your site
  will desync.
- ❌ Don't rewrite the deck. Tweaking is fine; rewriting introduces
  inconsistencies.
- ❌ Don't practice your pitch with someone who hasn't read this
  product space. They'll give bad feedback.
- ❌ Don't drink caffeine if you don't normally. Don't try anything
  new pre-pitch.

## Special case: pre-Series A pitch

If this is a Series A meeting (not seed), add:

| Step | Why |
|---|---|
| Re-run quarterly audit if > 90 days old | Series A diligence checks recency |
| Confirm cohort retention is rising, not falling | Series A KPI |
| Confirm all `[VERIFY]` markers in `comparables.md` are resolved | They will check |
| Confirm trademark filed (not just searched) | They will ask for receipts |
| Confirm legal review complete + memo on file | They will ask |

## After the pitch

- [ ] Send follow-up email within 24 hours (template:
      `docs/investor/follow-up-email-template.md`)
- [ ] Log in `docs/investor/pitch-log.md` (create if doesn't exist):
  - Date, investor, fund, outcome (yes / soft pass / no / waiting)
  - Single biggest objection
  - Single biggest insight
  - Promised follow-up items
- [ ] Update next pitch's prep based on what came up

## The morning-of-pitch ritual

In order:
1. Check the daily ops digest. If queues are clean, you can focus.
2. Walk the 7-step checklist above (45 min).
3. Eat something. Don't pitch hungry.
4. Do the demo on your laptop ONCE end-to-end. Catch any breakages.
5. Read the wedge memo one-sentence aloud, three times.
6. Open the meeting link 5 minutes early. Close every other tab.
7. Pitch.

## Time budget

| Step | Minutes |
|---|---|
| Refresh funnel model | 10 |
| Re-share model link | 2 |
| SERP rank check (skip if recent) | 15 (or 0) |
| Update build-status | 3 |
| Daily-digest evidence | 3 |
| Confirm demo URLs | 5 |
| Re-read wedge memo | 5 |
| Demo dry-run | 10 |
| **Total before each pitch** | **~50 min** |

50 minutes saves you from every "your numbers are stale" objection.

## Why this exists

Most founders walk into pitches with the same deck for 6 weeks. Every
investor in week 6 knows the deck doesn't reflect the current state of
the company. That kills round momentum. This checklist makes "current
state" easy.

## Changelog

- **2026-05-07** — initial. Use before next pitch.
