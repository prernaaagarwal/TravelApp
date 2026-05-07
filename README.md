# Wander Women

Verified solo female travel intelligence — built by women who actually travel solo in India and beyond.

Currently in beta. Live URL: [wanderwomen.in](https://wanderwomen.in)

## What ships today

The product surface is four things, in primary nav order:

| Surface | Route | What it is |
| :--- | :--- | :--- |
| **Intel** | `/explore` · `/intel/[slug]` | Per-city safety guides with neighborhoods, scams, transport, money, female-run stays. 50+ cards live. |
| **Beware Board** | `/community?tab=beware` · `/community/beware/[city]` | Geo-mapped scam + harassment reports. 200+ entries, moderated under a 36-hour SLA. |
| **Community** | `/community` | Ask-a-local-sister, trip reports, tips. |
| **Safety** | `/safety` | The 4-tool hub: Safety Shop, WhatsApp Vault, Beware Board, Verify Stay. |

Discovery surfaces (deferred from primary nav, still live): `/buddy`, `/feed`, `/vault`, `/shop`, `/contributor/[name]`.

## Trust & compliance surfaces

These are public commitments, not internal policy.

- **`/methodology`** — 7-pillar verification process for every Trip Intel Card.
- **`/safety/contributor-safety`** — 4 promises: identity tiers, 4-hour takedown SLA, escalation to NCW/POSH/POCSO, 3-tier moderation roster.
- **`/legal/grievance-officer`** — IT Rules 2021 RGO contact + statutory escalation timeline.
- **`/privacy`** · **`/terms`** — DPDP / GDPR / CCPA-aware privacy policy and 17-section ToS draft.
- **`/code-of-conduct`** — what every member agrees to.

Pricing: **free during beta. Founding members lock at ₹999/year for life when payment opens. Public price ₹1,999/year. Pay nothing now.** No live payment processing yet — see `/pricing`.

## AEO / GEO infrastructure

Search-engine + AI-engine surfaces that aren't in the primary nav:

- **`/llms.txt`** — markdown manifest for LLM crawlers, dynamically generated from live data.
- **`/.well-known/mcp.json`** + **`/api/mcp`** — Model Context Protocol JSON-RPC endpoint with 3 tools (`tools/list`, `tools/call` for intel + beware queries). No SDK dependency.
- **FAQPage JSON-LD** — every Trip Intel Card emits Article + Breadcrumb + FAQPage structured data, with the 5 FAQs auto-derived from the card's structured fields via `intelCardFaqs()` in `lib/jsonld.ts`.
- **IndexNow** — new Beware Board approvals ping Bing/ChatGPT search via `lib/indexnow.ts`.

## Stack

```
Next.js 16 (App Router, RSC default)    TypeScript (strict)
Tailwind CSS v4                          shadcn/ui (stone base)
Supabase (Postgres + Auth + Storage)     @supabase/ssr
Sentry — error tracking                  PostHog — product analytics
Resend — transactional email             Leaflet + leaflet.heat — maps
Zod — schema validation                  Vitest + Playwright — tests
```

54 SQL migrations · 33 tables · ~80 routes · 8 unit-test suites · 4 E2E specs.

## Running locally

```bash
cp .env.example .env.local       # fill in Supabase + Resend + PostHog keys
npm install
npm run dev                      # http://localhost:3000
```

### Verifying a build

```bash
npm run lint                     # ESLint, max-warnings 0
npm run type-check               # tsc --noEmit
npm test                         # vitest run, 101 tests
npm run test:coverage            # branches/lines/funcs/stmts ≥ 70%
npm run build                    # production build
npm run test:e2e                 # Playwright (gated on E2E_ENABLED var)
```

## Operations

- **Migrations** live in `supabase/migrations/`. Apply via the Supabase SQL Editor.
- **Daily ops digest cron** runs at 08:00 IST (`vercel.json`) — pulls queue depths, flags SLA breaches, emails the founder.
- **Cohort dashboard** at `/admin/cohorts` (admin-only) reads `053_cohort_views.sql`.
- **Affiliate reconciliation** — clicks captured live, conversions ingested monthly via `scripts/reconcile-affiliate.ts` (Amazon / Booking / Airalo / World Nomads CSV → SQL). View at `affiliate_reconciliation_monthly`.
- **DPDP right-to-erasure** — admin-only purge at `/admin/users/[id]/purge` with `PURGE-{userId}` confirmation gate.

## Docs

| File | What it is |
| :--- | :--- |
| `CLAUDE.md` | Session-level coding conventions for Claude Code |
| `AGENTS.md` | Notes for AI agents working in this repo |
| `PRD.md` | Full product spec |
| `docs/strategy/wedge.md` | Wedge memo: what's in scope, what's deferred |
| `docs/investor/data-room-index.md` | Investor data-room index, organized by question type |
| `docs/investor/modeled-vs-measured.md` | The honesty slide — measured vs modeled |
| `docs/legal/` | Legal RFPs, KYC vendor RFQ, trademark checklist |
| `docs/operations/` | Moderation policy, bus-factor runbook |
