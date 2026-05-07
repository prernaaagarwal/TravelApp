# Data room index

> The investor opens the data room and has 10 minutes. This index is
> what they read first. Every doc in the room is listed below with a
> one-line description and what investors typically use it for.
>
> Drop this URL into the follow-up email. Pin it as the README of
> your Notion / Drive / GitHub data room.

## Read in this order if you have 10 minutes

1. `docs/investor/build-status.md` — what's actually built (3 min)
2. `docs/strategy/wedge.md` — what's in scope and what's deferred (2 min)
3. `docs/investor/modeled-vs-measured.md` — the honesty slide: what we know vs what we're modeling (1 min)
4. `docs/investor/funnel-model.xlsx` — open in Sheets, poke any cell (3 min)
5. `docs/investor/sensitivity-table.md` — 3×3 grid that defends every cell (1 min)
6. `docs/legal/trust-and-verification.md` — the 101-word verification para (1 min)

That's the 10-minute briefing. Anything beyond is for diligence.

## Full index, organized by question

### "What did you actually build?"

| Doc | What it is | When investors ask for it |
|---|---|---|
| `docs/investor/build-status.md` | Live vs mocked across 62 routes, 33 tables, 53 migrations | First thing — disarms "is this real" |
| Live URL: `wanderwomen.in/methodology` | How verification + moderation works | When they ask "how do you verify women" |
| Live URL: `wanderwomen.in/admin/cohorts` (admin only) | Live cohort retention dashboard | When they ask for retention proof |
| `docs/investor/cohort-metrics.md` | What each view in `/admin/cohorts` actually computes | When they question the dashboard's math |

### "What's the unit economics?"

| Doc | What it is | When investors ask for it |
|---|---|---|
| `docs/investor/funnel-model.xlsx` | Editable year-1 to year-3 model with formulas | First number question |
| `docs/investor/funnel-model.md` | Walkthrough of every assumption + sensitivity discussion | If they want narrative, not numbers |
| `docs/investor/sensitivity-table.md` | 3×3 capture × conversion grid | When they push on any single assumption |
| `docs/strategy/keyword-research-refined.md` | 30 target keywords with confidence-banded volume estimates | When they question the SEO surface |
| `docs/strategy/keyword-research.csv` | Same data in spreadsheet format | When their analyst takes over |

### "What's defensible?"

| Doc | What it is | When investors ask for it |
|---|---|---|
| `docs/strategy/wedge.md` | The one-sentence wedge + kill list + keep list | When they ask "is this a platform or wedge" |
| `docs/strategy/comparables.md` | Pinkpangea, Lonely Planet, Tripoto, etc. with what we learn from each | When they ask "why hasn't this been done" |
| `docs/strategy/perplexity-audit-protocol.md` | How we audit the AI citation graph quarterly | When they push on AEO/GEO |

### "Is this legal?"

| Doc | What it is | When investors ask for it |
|---|---|---|
| `docs/legal/legal-review-rfp.md` | What we're sending outside counsel | When they question DPDP / IT Rules / defamation |
| `docs/legal/trust-and-verification.md` | The 101-word verification paragraph + code references | When they ask "how do you verify women" with rigor |
| `docs/legal/verification-stack-memo.md` | Today / 500/wk / 5000/wk cost trigger memo | When they ask about scale |
| `docs/legal/kyc-vendor-rfq.md` | RFQ template for HyperVerge / IDfy / Persona | When they ask "what's your KYC vendor" |
| `docs/legal/trademark-filing-checklist.md` | 14-day trademark plan, 3 classes | When they ask about IP |
| Live URL: `wanderwomen.in/privacy` | Comprehensive privacy policy draft | When their counsel does diligence |
| Live URL: `wanderwomen.in/terms` | Comprehensive ToS draft | Same |
| Live URL: `wanderwomen.in/legal/grievance-officer` | IT Rules 2021 RGO page | Required for safe-harbor diligence |

### "How do you operate this?"

| Doc | What it is | When investors ask for it |
|---|---|---|
| `docs/operations/moderation-policy.md` | One-page moderation policy, all 3 queues | When they ask "what's your trust & safety" |
| `docs/strategy/quarterly-audit-runbook.md` | Quarterly 150-min audit flow | When they ask about cadence |
| `docs/investor/pre-pitch-checklist.md` | 50-min pre-pitch refresh | If you forward your own cadence |
| `app/api/cron/daily-ops-digest/route.ts` (live) | Daily 5-min ops email infrastructure | When they ask "do you read your own dashboards" |

### "Who's the team?"

| Doc | What it is | When investors ask for it |
|---|---|---|
| `docs/investor/founder-bio.md` | Founder one-pager (you fill in actual content) | First slide of every diligence call |
| `docs/founder/wellbeing-resources.md` | Founder resilience plan | NOT for investors — private |

### "What about the round?"

| Doc | What it is | When investors ask for it |
|---|---|---|
| `docs/investor/pitch-deck-outline.md` | The 10-slide structure | If they want the deck structure separately |
| `docs/investor/cap-table-memo.md` | Seed cap table thinking, dilution math, vesting | When term sheet conversation starts |
| `docs/investor/funds-not-to-pitch.md` | Fund-fit list (private; not for investors) | NOT for investors |
| `docs/investor/follow-up-email-template.md` | The email after each meeting | Templates for own use |
| `docs/investor/30-second-pitch-script.md` | 10/30/60-second compressed pitches | Templates for own use |
| `docs/investor/pitch-practice-script.md` | 5-archetype pre-meeting drill | Templates for own use |
| `docs/investor/quarterly-update-template.md` | Quarterly investor letter format | Template for own use |
| `docs/investor/loom-script.md` | 60-second product walkthrough script | When they ask for a Loom |

### "Show me the AEO/GEO infrastructure"

| Doc / live URL | What it is |
|---|---|
| Live URL: `wanderwomen.in/llms.txt` | LLM citation guidelines |
| Live URL: `wanderwomen.in/.well-known/mcp.json` | MCP manifest |
| Live URL: `wanderwomen.in/api/mcp` | Read-only MCP server |
| Live URL: `wanderwomen.in/methodology` | Citable methodology page |
| `docs/strategy/perplexity-audit-protocol.md` | Quarterly competitive citation audit |
| `docs/strategy/bing-submission-checklist.md` | IndexNow + Bing setup |
| `docs/strategy/wikipedia-wikidata-plan.md` | 12-month Wikidata + Wikipedia roadmap |
| `scripts/serp-audit/` | Playwright automation for both audits |

## Live URLs they should bookmark

- `wanderwomen.in` — landing
- `wanderwomen.in/explore` — intel cards index
- `wanderwomen.in/intel/goa-india` — flagship intel card
- `wanderwomen.in/community/beware/goa-india` — flagship Beware Board
- `wanderwomen.in/contributor/[name]` — flagship contributor profile (replace with real)
- `wanderwomen.in/methodology` — verification methodology
- `wanderwomen.in/pricing` — three-tier bundle
- `wanderwomen.in/legal/grievance-officer` — RGO page
- `wanderwomen.in/llms.txt` — AEO/GEO manifest
- `wanderwomen.in/api/mcp` (POST) — MCP server (technical investors)

## What's NOT in the data room

These exist but are NOT shared with investors:

- `docs/founder/wellbeing-resources.md` — private
- `docs/investor/funds-not-to-pitch.md` — internal
- `docs/strategy/nav-trigger-recommendation.md` — internal decision memo
- Any internal Slack / DM / email
- Specific moderation cases or user data
- Personal financial information

## Format for sharing

Recommended: **Notion data room** with this index as the home page.
- Each section above becomes a Notion section
- Each doc gets a Notion sub-page that mirrors the markdown
- Live URLs are linked
- Set sharing to "anyone with link can view"
- Generate a unique URL per investor for tracking

Alternative: **GitHub-private** repo with this docs structure
intact. Investors love seeing the actual filesystem layout.

Alternative: **Drive folder** with PDFs of each markdown. Worst
option — markdown is more readable than PDF for diligence.

## Per-investor variations

If a specific investor has a focus, send them a *targeted* index.
Example for a women-focused fund:

> "Top 4 docs for our conversation:
> 1. `wedge.md` — the focus
> 2. `methodology` (live URL) — how we verify
> 3. `moderation-policy.md` — trust & safety
> 4. `funnel-model.xlsx` — unit economics"

This forces them to engage with what matters to them, instead of
drowning in 30 docs.

## Maintenance

- After every diligence call, update this index with what was useful
  and what was missed
- Quarterly: re-check that every link is alive and every doc is current
- Before any major pitch: refresh the index date and the headline
  one-line above

## Changelog

- **2026-05-07** — initial. Reflects all docs shipped through commit
  f8f8184. New docs (added later) should be appended here.
