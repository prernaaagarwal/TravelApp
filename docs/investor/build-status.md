# Build status — what's live, what's mocked, what's coming

> Single source of truth for "is this real?" Send this to investors in the
> data room. Updated: April 2026. Owner: Founder.

## TL;DR for the investor with 90 seconds

We have 62 routes. **36 are backed by live Supabase data and real auth.**
6 still read mock JSON (intentional, low-priority surfaces). 33 Postgres
tables. 52 SQL migrations. 22 cities indexed on the Beware Board with real
moderated reports. Auth uses magic links. Admin moderation tools work.
**Payments are not yet live** — that is the first thing the round funds.

This is not a Figma deck. It is a working V1 with measurable gaps.

---

## Layer 1 — Frontend routes (62 total)

### Live, Supabase-backed (36 routes)

Every route below reads from Postgres on every request. No build-time data.

| Route | Backed by | Notes |
|---|---|---|
| `/explore` | `intel_cards` | Filterable by region, audience |
| `/intel/[slug]` | `intel_cards`, `contributors` | 25 cards live; premium gating wired |
| `/contributor/[name]` | `contributors`, `intel_cards` | 8 contributor profiles |
| `/community` | `community_posts` | 4 tabs, all DB-backed |
| `/community/post/[id]` | `community_posts`, `community_replies` | Real reply threading |
| `/community/beware` | `beware_reports` | 22 cities, ~100 reports |
| `/community/beware/[city]` | `beware_reports`, boundary GeoJSON | Leaflet map + heatmap + clustering |
| `/account/login` | Supabase Auth | OTP magic link via Resend |
| `/account/signup` | Supabase Auth | Profile auto-created via trigger |
| `/account/profile` | `profiles` | Editable settings |
| `/account/verify` | `user_verifications` | ID + selfie + AI-assisted human review |
| `/account/membership` | `profiles.membership_tier` | UI live; payment integration pending |
| `/account/settings` | `profiles` | Notification + privacy toggles |
| `/account/messages` | `buddy_messages` | Buddy intro inbox |
| `/contribute/report` | `beware_reports`, Supabase Storage | Photo upload + moderation queue |
| `/auth/callback` | Supabase Auth | Magic-link redemption |
| `/admin` | `moderation_audit_log` | Queue dashboard |
| `/admin/cohorts` | cohort SQL views | **NEW** — D1/D7/D30 retention triangle |
| `/admin/metrics` | live aggregates | Today / 7d / 30d signup counts |
| `/admin/intel` | `intel_cards` | Card editor UI |
| `/admin/reports` | `beware_reports`, `beware_report_flags` | Moderation queue |
| `/admin/reports/[id]` | `beware_reports` | Full review + decision UI |
| `/admin/buddy-reports` | `buddy_profile_reports` | Harassment review queue |
| `/admin/contributors` | `contributors` | Contributor management |
| `/admin/team` | `profiles.role` | Role assignment |
| `/admin/verifications` | `user_verifications` | Pending KYC queue |
| `/api/cron/weekly-digest` | Vercel cron, Sundays 3 AM | Sends Resend email digest |
| `/api/track-click` | `affiliate_clicks` | Click logging endpoint |
| `/safety/safety-pack/request` | `vault_signups`, Resend | PDF email-out |
| `/feedback` | `feedback` | User feedback form |
| `/sitemap.xml` | dynamic | Indexes all live cards + cities |
| `/robots.txt` | static | Crawler-permissive |
| `/og-image/*` | dynamic | OG cards generated on demand |
| `/trips/[slug]` | `trips` | Saved trip planner |
| `/saved` | `saved_destinations` | User bookmarks |
| `/notifications` | `notifications` | In-app notif feed |

### Mock JSON (6 routes — intentional, V0 holdovers)

| Route | Reads from | Why still mocked |
|---|---|---|
| `/` (landing hero counts) | `lib/mock-data/community-posts.json` | Display only — counts swap to live pre-launch |
| `/feed` | `lib/mock-data/trip-feed.json` | Low-priority surface; migration scheduled Q3 |
| `/buddy` | `lib/mock-data/buddy-matches.json` | Awaiting verified-user volume to populate live |
| `/shop` | `lib/mock-data/shop-products.json` | Affiliate product list — fine as static |
| `/safety/womens-basics` | `lib/mock-data/womens-basics.json` | Editorial content — not user-generated |
| `/community` (fallback) | `lib/mock-data/community-posts.json` | Renders if DB query fails (defense in depth) |

**These six are listed honestly. Do not pretend they are live.**

---

## Layer 2 — Backend (Supabase)

### Tables (33 total, defined across 53 migrations)

**Core (5)**
- `profiles` — user accounts, segment, membership tier, role
- `intel_cards` — 25 destination intel cards, JSONB-typed schema
- `contributors` — 8 named contributor profiles
- `community_posts` — discussion + Q&A + Beware (4 tabs in one table)
- `community_replies` — threaded replies

**Beware Board (4)**
- `beware_reports` — geo-tagged incident feed
- `beware_report_flags` — community flagging
- `community_post_reports` — generic report flagging
- `moderation_audit_log` — every moderator action, timestamped

**Trust & verification (3)**
- `user_verifications` — ID + selfie verification queue
- `stay_verifications` — accommodation photo verification (uses Anthropic SDK)
- `user_reports` — user-against-user safety reports

**Community & social (5)**
- `buddy_matches` — passive match cards
- `buddy_connections` — accepted/declined connections
- `buddy_messages` — single-shot intro messages
- `buddy_profile_reports` — harassment reports
- `saved_destinations` — bookmarks

**Commerce (5)**
- `safety_products` — Amazon affiliate product listing
- `affiliate_clicks` — click telemetry (no commission data — that lives at partner)
- `leads` — pre-payment lead capture
- `vault_purchases` — Vault product purchases (UI live; payment pending)
- `vault_signups` — Vault waitlist

**Engagement (5)**
- `intel_card_views` — read tracking, dedupe by user+day
- `notifications` — in-app notifications
- `feedback` — user feedback form
- `email_captures` — landing page email capture
- `user_checklists` — pre-trip checklist progress

**Editorial (3)**
- `trips` — user-saved trip plans
- (plus 3 SQL views — `signup_cohorts`, `activation_cohorts`,
  `retention_cohorts`, `revenue_cohorts`)

### RLS policies
- Read-public: `intel_cards`, `contributors`, `beware_reports` (approved)
- Read-own-only: `profiles`, `notifications`, `saved_destinations`
- Service-role-only: `moderation_audit_log`, all cohort views, `user_verifications`

### Auth
- `@supabase/ssr` — cookie-based sessions
- Email magic links via Resend
- Three roles: user / moderator / admin (column on `profiles.role`)
- Admin gate via email allowlist + role check (defense in depth)

---

## Layer 3 — External services

| Service | What it does | Status | Cost today |
|---|---|---|---|
| Supabase | Postgres, Auth, Storage | Live, Free tier | ₹0 |
| Vercel | Hosting, Cron, OG images | Live, Free tier | ₹0 |
| Resend | Transactional + digest email | Live, Free tier | ₹0 |
| Anthropic Claude | AI-assisted verification + stay analysis | Live, pay-as-you-go | ~₹500/mo |
| Sentry | Error tracking | Wired, env-gated | ₹0 |
| PostHog | Product analytics, A/B flags | Wired, consent-gated | ₹0 |
| Stripe / Razorpay | **Payments** | **NOT LIVE** | — |
| HyperVerge / IDfy | KYC at scale | **NOT LIVE** (post-round) | — |

---

## Layer 4 — Tests

| Type | Count | Lines | What it covers |
|---|---|---|---|
| Vitest unit | 8 specs | 854 | Schema validation, search, JSON-LD, rate-limit, ban-check, email |
| Playwright E2E | 4 specs | 411 | Critical path, responsive 375/1280, smoke, safety hub |
| GitHub Actions CI | 1 workflow | — | Lint + type-check + test:coverage + build on every push |

E2E gated by `vars.E2E_ENABLED` (requires Supabase secrets in CI).

---

## Layer 5 — What's measured today vs. what's modeled

**Measured (real numbers from production):**
- Signup count, weekly cohort buckets
- Intel card view count, unique daily reads
- Moderation queue throughput
- Email digest open rates (Resend dashboard)
- Affiliate clicks (our side)

**Modeled (assumptions, not data):**
- Visitor → email conversion (4% assumption; not yet measured)
- Email → paid conversion (3% assumption; payments not live)
- Affiliate RPM (₹40 industry benchmark; not measured)
- LTV (₹1,550/year × 2.5 years; pre-cohort)
- CAC (₹400 Indian / ₹1,200 foreign; not yet tested)

**This split is the central honesty of the pitch.** Every modeled number
becomes measured within 60 days of payments going live.

---

## What ships in the first 90 days post-funding

In strict order:

1. **Week 1–2:** Razorpay integration + Stripe for foreign cards. ₹999
   founding membership becomes a real charge.
2. **Week 2–3:** Resident Grievance Officer page live, Privacy Policy and
   ToS finalized with outside counsel (see `docs/legal/legal-review-rfp.md`).
3. **Week 3–4:** Stripe webhooks populate `revenue_cohorts`. The fourth
   cohort view becomes useful.
4. **Week 4–6:** Founding contributor cohort onboarded — 50 paid
   contributors at ₹2,000/card. Target 100 cards live by week 12.
5. **Week 6–8:** First paid acquisition test — ₹50K Instagram budget for
   the Priya segment. Measured CAC populates the model.
6. **Week 8–12:** AEO/GEO foundation ships — `llms.txt`, FAQPage schema,
   minimal MCP server.
7. **Week 12:** First investor update with measured (not modeled) cohort
   data. The dashboard at `/admin/cohorts` becomes the headline slide.

---

## Bus factor

Solo-founder. AI-assisted codebase. Bus factor mitigations:

- `CLAUDE.md` is the engineering co-founder substitute (project memory)
- `AGENTS.md` covers Next 16 quirks
- This doc is the build-state runbook
- `docs/auth-setup.md`, `docs/backup-verification.md`, `docs/testing.md` cover
  ops basics
- Escrowed credentials: pending (action item)
- Designated technical successor: **GAP — to be filled with first hire**

The post-round technical co-founder fills this.

---

## How to verify everything in this doc

If you have read access to the repo:

```bash
# Count the routes
find app -name "page.tsx" | wc -l

# Find what's still mock
grep -rn "lib/mock-data" app --include="*.tsx" | head

# Count the migrations
ls supabase/migrations | wc -l

# Count the tables
grep -rn "create table" supabase/migrations | wc -l

# See the cohort dashboard locally
npm run dev → /admin/cohorts (requires admin role on your account)
```

Every claim in this document is verifiable. That is the claim that matters.
