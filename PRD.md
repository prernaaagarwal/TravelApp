# Wander Women — V0 Product Requirements Document

> **Status:** V0 Demo Scope · Solo founder + Claude Code build
> **Last updated:** April 2026
> **Owner:** Founder
> **Engineering:** Claude Code (Sonnet 4.6 via Claude Code CLI)

---

## ⚠️ Wedge addendum — supersedes V0 scope (added 2026-05-07)

This PRD remains canonical for V0 / demo specs and as product memory.
However, after V1 shipped (live Supabase backend, 36 routes, 33 tables),
the wedge memo at `docs/strategy/wedge.md` supersedes the platform-style
scope below for the **current V1 roadmap.**

**Deferred from V1 main nav** (routes still live, just not headline):

- `/buddy` — buddy matching (Wave 2; ships at 1,000 verified users)
- `/vault` — WhatsApp Vault as a paid SKU (now bundled into membership)
- `/feed` — trip reports / Trip Feed (Wave 2; tab inside contributor profile, not top-level)
- `/shop` — safety products (inline placement on Intel Cards, not a route in nav)
- `/onboarding` — 3-question segmentation flow (deferred indefinitely; behavior beats interrogation)

**Killed from V1** (not just deferred):

- Foreign-women segment as co-equal primary persona (kept indexable as SEO surface; not promoted in landing CTA)
- Paid acquisition at launch (turned on only after 90 days of organic data)
- B2B safety-intel-as-a-service (Year-3 unlock, not V1)

**The one-sentence wedge** (memorize):

> *A women-only, named-contributor incident map for solo travel in India —
> with the Beware Board as the entry point and verified intel cards as the
> conversion surface.*

**The single V1 metric:** 500 paid members at end of month 6.
Below 200 = pivot. Above 800 = accelerate.

For the current spec, read `docs/strategy/wedge.md` first. The sections
below remain accurate as V0 product memory.

---

## 0. The single most important page in this PRD

**Read this first. Re-read it before every build session.**

This is **not** a real product build. It is a **demo asset** designed to do exactly two things:

1. Show investors that the product is buildable, beautiful, and obviously needed
2. Show influencers/founding contributors what they'd be participating in

It is **not** designed to:
- Handle real users at scale
- Process real payments
- Store real personal data
- Be SEO-indexed
- Be production-secure

If a feature requires real authentication, real payment processing, real user-generated content moderation, or real legal infrastructure → **it is not in V0**. Hardcode it. Mock it. Fake the data. Move on.

The metric for V0 success is: *Can a stranger tap through this in 90 seconds and say "I'd use this"?*

---

## 1. Vision (one paragraph, memorize this)

Wander Women is the trip intelligence layer built by women who actually travel solo. Real intel — scams, neighborhoods, transport, hidden gems, real costs — sourced from named contributors, structured for the four user segments who need it most. Safety is the outcome of the product. It is not the feature we sell.

## 2. The four segments (segments before screens, always)

| # | Segment | Age | Description | V0 priority |
|---|---|---|---|---|
| 1 | **Curious Beginner (Indian)** | 18-24 | First trip; needs permission + proof | High — primary persona |
| 2 | **Growing Solo (Indian)** | 25-32 | 2-5 trips; better intel, less anxiety | Medium |
| 3 | **Experienced Explorer (Indian)** | 33-40 | Hidden gems, contributor candidate | High — content engine |
| 4 | **Foreign Woman in India (Sara)** | 21-45 | Highest WTP, global word-of-mouth | High — revenue + distribution |

**V0 must demonstrate value for Priya (Segment 1) and Sara (Segment 4).** Ananya (Segment 3) is shown as a contributor in the platform, not as a primary user flow.

---

## 3. V0 demo structure — what gets built

### 3.1 The 9 screens that exist

The entire demo is **9 routes**. Anything outside these routes is out of scope for V0.

| # | Route | Purpose | Persona target |
|---|---|---|---|
| 1 | `/` | Landing — hero + Priya/Sara split CTA | All |
| 2 | `/intel/[slug]` | Trip Intel Card view (single destination) | Priya, Sara |
| 3 | `/explore` | Browse all Trip Intel Cards by destination | All |
| 4 | `/community` | Community hub with 4 tabs (Ask, Sister, Rant, Beware) | Priya, Sara |
| 5 | `/feed` | Trip feed — receipts not inspiration | Priya, Ananya |
| 6 | `/buddy` | Buddy matching mock — see 3 matches | Priya |
| 7 | `/vault` | WhatsApp Vault upsell + mock chat preview | Priya, Sara |
| 8 | `/contributor/[name]` | Public profile of a contributor (Ananya) | Investors, Ananya |
| 9 | `/onboarding` | 3-question segmentation flow | New users |

**Out of scope for V0:** real signup/login, real payments, real-time chat, image uploads, push notifications, email, search across the whole platform, dashboard for the founder, admin panel, moderation tools.

### 3.2 The 6 features that get demonstrated

Each feature must be visible from at least one of the 9 routes.

1. **Trip Intel Cards** (`/intel/[slug]`) — the core content artifact, attributed to a named contributor, neighborhood-level
2. **Community Hub** (`/community`) — 4 tabs, all populated with seeded mock content
3. **Beware Board** (tab inside `/community`) — the highest-virality feature; date-stamped, location-tagged
4. **Trip Feed** (`/feed`) — real itineraries with rupee/USD costs
5. **Buddy Matching** (`/buddy`) — passive match cards, no chat in V0
6. **WhatsApp Vault upsell** (`/vault`) — landing page with mock conversation screenshots

### 3.3 The 3 features that get faked
- Onboarding (`/onboarding`) → 3 questions, store answer in localStorage, route to relevant homepage variant
- Founding membership (`₹499/year`) → button leads to a "Join the founding 200" landing page with email capture (Formspree or similar, no Stripe)
- Affiliate links (Amazon, Airalo, World Nomads) → real links with tracking parameters that go to actual partner sites

---

## 4. Data model (mock JSON only — no database)

All data lives in `/lib/mock-data/*.json`. The repo has zero DB connection in V0. Every page reads from JSON at build time.

### 4.1 The 6 JSON files

```
/lib/mock-data/
├── intel-cards.json       (15 cards: 6 India + 6 international + 3 foreign-in-India)
├── contributors.json      (8 contributors with bios, badges, attribution)
├── community-posts.json   (40 posts split across 4 community tabs)
├── beware-entries.json    (25 entries, date-stamped, location-tagged)
├── trip-feed.json         (12 trip receipts with itinerary + costs)
└── buddy-matches.json     (10 mock buddy profiles)
```

### 4.2 Trip Intel Card schema

```typescript
interface IntelCard {
  slug: string;                    // "rishikesh-india"
  destination: string;             // "Rishikesh"
  country: string;                 // "India"
  audience: 'indian' | 'foreign' | 'both';
  contributor: {
    name: string;                  // "Ananya"
    profileSlug: string;           // "ananya-mumbai"
    badge: string;                 // "Spiti Valley Expert"
    tripCount: number;             // 8
    cityHome: string;              // "Mumbai"
  };
  lastUpdated: string;             // ISO date
  neighborhoods: Neighborhood[];   // min 3
  scams: ScamWarning[];            // min 4
  transport: TransportTip[];       // min 3
  hiddenGems: HiddenGem[];         // min 3
  preBookChecklist: string[];      // min 5
  dosAndDonts: { do: string[]; dont: string[]; };
  estimatedDailyBudget: { backpacker: string; midRange: string; comfortable: string; };
  emergencyNumbers: string[];
  isPremium: boolean;              // last 1-2 sections paywalled
}
```

This schema **directly maps** to the existing Excel research already done. Every Trip Intel Card in V0 is just a JSON port of one row from the existing scam + money hacks + hidden gems spreadsheets, which means **Day 1 of building V0 = porting existing Excel research into JSON.** No new research needed for the demo.

### 4.3 Existing Excel content → V0 cards mapping

| V0 destination | Source Excel | Already has |
|---|---|---|
| Rishikesh | India_Tourist_Scams + Money_Hacks (no — not in current 12) | Need to write fresh |
| Goa | India_Tourist_Scams + Money_Hacks + Hidden_Gems | ✓ Full data |
| Jaipur | India_Tourist_Scams + Money_Hacks + Hidden_Gems | ✓ Full data |
| Manali | India_Tourist_Scams + Money_Hacks + Hidden_Gems | ✓ Full data |
| Kasol | None — popular alt | Need to write fresh |
| Hampi | None — popular alt | Need to write fresh |
| Vietnam | Vietnam_Travel_Safety_Money | ✓ Full data |
| Thailand | Thailand_Travel_Safety_Money | ✓ Full data |
| Japan | Japan_Travel_Safety_Money | ✓ Full data |
| South Korea | South_Korea_Travel_Safety_Money | ✓ Full data |
| UAE | UAE_Dubai_Travel_Safety_Money | ✓ Full data |
| Europe (Paris) | Europe_Top5_Travel_Safety_Money | ✓ Full data |
| Delhi (for foreigners) | India_Tourist_Scams (re-framed for Western women) | Half-data, need re-framing |
| Mumbai (for foreigners) | India_Tourist_Scams (re-framed) | Half-data |
| Agra (for foreigners) | India_Tourist_Scams (Sheroes Hangout already in Hidden Gems) | ✓ Strong data |

**Implication:** 9 of 15 Trip Intel Cards can be auto-generated from existing Excel data with a single `xlsx → json` script. The other 6 need 2-3 hours of writing each. **Total content writing time: ~18 hours.** That's the entire V0 content effort.

---

## 5. Tech stack (locked-in decisions, no debate in V0)

```
Framework:        Next.js 15 (App Router)
Language:         TypeScript (strict mode)
Styling:          Tailwind CSS v4 + shadcn/ui
Fonts:            Cormorant Garamond (serif) + DM Mono (mono) [from existing journey doc]
Data:             Static JSON files in /lib/mock-data
Auth:             None in V0 (all "Sign in" buttons go to a coming-soon page)
Payments:         None in V0 (stripe button goes to email capture page)
Email capture:    Formspree or ConvertKit free tier
Hosting:          Vercel (free tier)
Image hosting:    Public folder + Unsplash CDN for stock
Domain:           wanderwomen.in (suggested) or wanderwomen.app
Analytics:        Plausible or Vercel Analytics
SEO:              Static metadata only, no dynamic OG images in V0
```

**Anti-stack (do NOT add these in V0):**
- Supabase, Postgres, MongoDB, Firebase
- Clerk, Auth.js, Auth0, Lucia
- Stripe, Razorpay
- Pusher, Socket.io, Liveblocks
- AI SDK, OpenAI integration
- React Native, Expo
- tRPC, Apollo, GraphQL
- Sanity, Contentful, Strapi

If Claude Code suggests any of these, **say no.** Mock JSON only.

---

## 6. Design system (locked from existing user journey HTML)

The existing user journey HTML defines the design system. V0 must match this exactly.

### 6.1 Color tokens (from journey doc)

```css
--sand: #f5f0e6;          /* primary background */
--ink: #1a1510;           /* primary text */
--rust: #c4522a;          /* primary accent (Priya, India) */
--rust-light: #f0d5c8;
--sage: #4a7c59;          /* Ananya, contributor */
--sage-light: #d4e8d8;
--blue: #2a4d7a;          /* Sara, foreign */
--blue-light: #d8e6f5;
--gold: #b5860a;          /* premium tier */
--gold-light: #f5e8c0;
--purple: #6b3a7a;        /* community/rant */
--muted: #8a7d72;
--border: #e0d8cc;
--warm-white: #faf8f4;
```

### 6.2 Type system

- **Headings:** Cormorant Garamond, 300-400 weight, italic for accents
- **Body + UI:** DM Mono, 300-500 weight
- **Tracking:** uppercase labels at 1.5-3px letter-spacing for category eyebrows

### 6.3 Aesthetic principles (non-negotiable)

- **Warm, not corporate.** No SaaS gradients. No neon. No bright primary colors.
- **Editorial, not app-y.** This should feel like a magazine that happens to be interactive.
- **Grain texture overlay** on backgrounds (SVG noise filter, opacity 0.03-0.4)
- **Hairline borders** (0.5px solid `--border`) — never 1px+ borders
- **Generous whitespace.** Padding 24-60px on most containers.
- **Mobile-first.** Most users will see this on iPhone. Test all screens at 375px width before desktop.

### 6.4 Component primitives needed

```
Button (3 variants: primary, ghost, link)
Card (with hairline border + subtle shadow)
Pill / Tag (for tags, badges)
Tabs (for community 4-section)
Avatar (for contributors)
Badge (for "Spiti Expert", "Verified")
Persona pill (color-coded)
Quote block (for testimonials, contributor attribution)
Empty state (for sections with no content yet)
```

All from shadcn/ui with custom theming. Don't write these from scratch.

---

## 7. Page-by-page specs

### 7.1 `/` Landing page

**Hero:** Cormorant Garamond, 64px, 300 weight: *"Trip intel built by **women** who actually travel solo."*

Below hero: split CTA — two cards side by side.

| Card 1 (Priya) | Card 2 (Sara) |
|---|---|
| 🎒 First time traveling solo in India? | 🌸 Visiting India from abroad? |
| "See how 47 women plan their first solo trip." | "The only India guide written by women who actually live and travel here." |
| → /onboarding?path=beginner | → /onboarding?path=foreign |

Below: 3 horizontally-scrolling Trip Intel Cards (Goa, Rishikesh, Tokyo) — preview only, click → full card.

Below: "Built by 47 women. Trusted by 1,200." (lie. Mock numbers. Demo asset.) Then 4 contributor avatars.

Below: 3-row scam ticker — auto-scrolling Beware Board entries: *"⚠️ Jaipur — 'Auto stand outside station. ₹500 quoted for ₹120 ride. Use Rapido.' — Posted 2 days ago by Riya"*

Footer: founding membership CTA `Join the founding 200 → ₹499/year` + email capture.

### 7.2 `/intel/[slug]` Trip Intel Card

The hero of the entire product. Must look like a magazine article, not a JSON dump.

**Above the fold:**
- Destination name in 96px Cormorant
- One-line subtitle: *"Solo female intel, written by Ananya — Mumbai · 8 trips"*
- Last updated date
- "Verified by 12 women" trust signal
- Hero image (Unsplash)

**Body sections (scroll-down):**
1. **The 30-second briefing** — TLDR, 5 bullets max
2. **Neighborhoods** — accordion-style, 3-5 areas, with safety rating + character note
3. **Scams to know** — 4-6 cards, color-coded by severity (rust=critical, gold=watch out, sage=mild)
4. **Transport** — 3-4 tips, the auto/taxi/metro reality
5. **Hidden gems** — 3-5 women-run, women-friendly spots (links to existing Excel data)
6. **Pre-book checklist** — checkable list, persists in localStorage
7. **Money** — daily budgets in INR + USD, top hacks
8. **Premium section: Off-the-beaten-path** — blurred preview + "Unlock with founding membership ₹499"
9. **Contributor card** — bottom: photo + bio + "View her other intel →"

**Sticky right sidebar (desktop only):**
- "Ask the community about [destination]" → /community
- "Find a buddy going to [destination]" → /buddy
- "Set up vault for this trip — ₹199" → /vault

### 7.3 `/explore` Browse all destinations

Grid of 15 Trip Intel Cards with filter chips at top: `All | India | International | For Foreign Women`

Each card preview shows: destination, contributor name + badge, last updated, neighborhood count, scam count, "Read intel →" button.

Sort: "Most recent · Most read · Highest rated" (mock; the order is hardcoded).

### 7.4 `/community` Community Hub

Top of page: 4 tabs.
- **Ask the community** (default)
- **Ask a local sister**
- **Rant space**
- **Beware Board**

Each tab shows ~10 mock posts, infinite-scroll faked (loads remaining 30 from JSON if user scrolls).

**Beware Board** is the most important tab visually. Must look like a feed of date-stamped warnings:

```
⚠️ Jaipur — "Auto stand outside station scam"
Posted 2 days ago by Riya · Verified by 4 women
"Auto driver quoted ₹500 for ₹120 ride. Got aggressive when I refused. Use Rapido — works fine inside the city."
[Helpful (47)] [Forward to friend] [Report]
```

Visual hierarchy: each Beware entry has a colored left border (rust = critical, gold = scam, sage = mild). Date stamps are visible. Author names visible (first name only).

### 7.5 `/feed` Trip Feed

12 mock trips. Each "trip post" shows:
- Contributor name + photo + day count
- Destination + dates
- 3-photo grid (Unsplash)
- Total cost in big numbers (₹X / $Y)
- Cost breakdown table (transport, stay, food, activities)
- Top 3 "I wish I'd known" notes
- "Read full itinerary →"

The feed is a scroll-down magazine, not Instagram.

### 7.6 `/buddy` Buddy matching

Top: "You're going to **Goa, Mar 15-22**. Here are 3 women on overlapping dates."

3 large match cards stacked. Each:
- Photo, first name, age, home city
- Their planned dates: "Mar 14-20" with overlap visualized
- "Why you might match" pills: same destination, similar trip count, both first-timers
- 2 buttons: `Send a hello (locked — V1)` and `Save match`

Below: empty state "Match more travelers — verify your Instagram" → linkout to nowhere (faked).

### 7.7 `/vault` WhatsApp Vault landing

Marketing page for the ₹199 vault product.

Above fold: phone-shaped mockup showing a WhatsApp conversation:
```
You: docs
Bot: Here are your saved documents:
  📄 Passport (uploaded Mar 10)
  📄 Visa (uploaded Mar 10)
  📄 Goa hostel booking
  📄 Travel insurance policy

You: emergency
Bot: Local emergency numbers for Goa:
  Police: 112
  Tourist Police: 1800-222-262
  Mom: +91-98xxxxxx
  Hostel reception: +91-98xxxxxx
```

Below: 3 use cases, pricing card (₹199/trip, no subscription), testimonial from "Riya, Bangalore", FAQ.

CTA: "Set up vault → ₹199" → goes to email capture (no payment in V0).

### 7.8 `/contributor/[name]` Contributor profile

Built around Ananya (the founding contributor archetype).

**Above fold:** big photo, name, home city, total trips, badges (Spiti Expert, Northeast Pioneer, etc.)

**Body:**
- Her short bio (2 paragraphs, written in her voice)
- "Her Trip Intel Cards" — grid of 4-6 cards she's "authored"
- "Recent community answers" — 5 of her recent Q&A answers
- "Trips she's run" — link to her trip feed posts
- "Earnings this month: ₹2,400" — bold, visible (this is the contributor pitch)

**Why this page exists:** when you DM Ananya for the first time, you send her this URL. She sees what her future profile looks like before she signs up. The page is the pitch.

### 7.9 `/onboarding` 3-question flow

3 screens, no signup wall, stored in localStorage.

Q1: *"Have you traveled solo before?"* → Never · 1-2 trips · 3-7 trips · 8+ trips
Q2: *"Where are you going next?"* → free text + autocomplete from 15 destinations
Q3: *"What worries you most?"* → multi-select 4 options

Submit → redirects to `/intel/[matching-destination]` with a customized banner: *"Based on what you told us, start here →"*

---

## 8. The contributor incentive system (must be visible in V0)

Even though contribution isn't actually possible in V0 (no auth, no editing), the *promise* of contribution is the entire pitch to Ananya. So V0 must show:

1. Named attribution on every Trip Intel Card (top + bottom)
2. Contributor profile pages (`/contributor/ananya-mumbai`)
3. Visible "earnings" on contributor profile (mock number)
4. "Spiti Valley Expert" badge prominently shown
5. Footer of every Intel Card: *"Contribute your own intel — apply to be a founding contributor →"* with email capture

That's it. The actual editor, the real attribution, the real revenue share — V1.

---

## 9. Monetization shown in V0 (visible but non-functional)

| Revenue lever | V0 implementation | Where shown |
|---|---|---|
| ₹499 Founding Membership | Email capture form, no payment | Landing footer, every Intel Card paywall |
| Hostel affiliate (8-12%) | Real Booking.com affiliate links inside Intel Cards | Stay recommendations |
| Safety products (Amazon affiliate) | Real Amazon affiliate links | New `/shop` page (10 products) |
| WhatsApp Vault ₹199 | Email capture form on `/vault` | Vault landing page |
| Travel insurance affiliate | Real World Nomads affiliate link | Foreign-women Intel Cards |
| eSIM affiliate (Airalo) | Real Airalo affiliate link | International Intel Cards |

**Important:** every affiliate link in V0 must be a *real* link with real tracking, even though the demo is mostly mock. This is the only piece that's not faked because it's free to set up and starts earning real money on day 1 with zero ongoing work.

---

## 10. What is explicitly NOT in V0 (read this list when scope-creep tempts you)

- ❌ Real signup / email/password / OAuth / magic links
- ❌ Real-time chat / messaging between users
- ❌ User-generated content posting (everything is seeded JSON)
- ❌ Payment processing (Stripe, Razorpay, anything)
- ❌ Push notifications, email automation
- ❌ Image upload from users
- ❌ Search across the entire platform (per-page filter is fine; global search is not)
- ❌ Admin dashboard / moderation tools / contributor editor
- ❌ Mobile app (only responsive web)
- ❌ AI / chatbot integration
- ❌ Live GPS / location tracking
- ❌ SMS / WhatsApp Business API integration
- ❌ Multi-language / i18n (English only)
- ❌ A11y audit beyond basic semantic HTML and color contrast
- ❌ Server-side rendering optimization, caching layers, edge functions
- ❌ Analytics beyond basic Vercel Analytics

If a feature is on this list and Claude Code suggests it: **say no.**

---

## 11. Build phases (in order — do not parallelize)

### Phase 1 — Setup & content port (Days 1-3)
- Initialize Next.js 15 + TypeScript + Tailwind + shadcn/ui
- Create design tokens file matching journey doc colors
- Write Excel → JSON converter script
- Port 9 ready Excel destinations into `intel-cards.json`
- Write fresh content for 6 remaining destinations
- Seed `contributors.json` with 8 contributors (3 named: Ananya, Riya, Sara)
- Seed `community-posts.json` and `beware-entries.json`

### Phase 2 — Layout & shell (Days 4-5)
- Build root layout with header + footer
- Build component primitives (Button, Card, Pill, Tabs, Avatar)
- Build `/` landing page
- Build `/explore` grid

### Phase 3 — Core content pages (Days 6-9)
- Build `/intel/[slug]` template
- Build `/contributor/[name]` template
- Build `/feed` and feed item component
- Verify mobile responsiveness on all 4 pages

### Phase 4 — Community & secondary (Days 10-12)
- Build `/community` with 4 tabs
- Build `/buddy` mock match cards
- Build `/vault` upsell page
- Build `/onboarding` flow

### Phase 5 — Polish (Days 13-14)
- Add grain texture, hover states, transitions
- Add loading skeletons
- Add empty states
- Add page transitions
- Final mobile pass at 375px width
- Set up Vercel deployment + domain
- Add Plausible analytics

### Phase 6 — Investor narrative layer (Day 15)
- Write 1-page investor brief PDF (separate from this PRD)
- Record 60-second Loom walkthrough
- Set up `wanderwomen.in/pitch` route with embedded Loom

**Total: 15 working days for one solo founder using Claude Code.**

If a build session takes you off this plan for >30 minutes, you're scope-creeping. Stop. Re-read Section 0.

---

## 12. Success criteria for V0

The demo is "done" when:

1. ✅ All 9 routes render on mobile + desktop without errors
2. ✅ All 15 Intel Cards have full content
3. ✅ All affiliate links are live and tracked
4. ✅ Email capture works on at least 3 forms
5. ✅ A stranger can tap through `/` → `/intel/goa-india` → `/community` → `/buddy` in under 2 minutes without confusion
6. ✅ Loom walkthrough is recorded and embedded
7. ✅ Domain is live with HTTPS
8. ✅ Mobile Lighthouse score ≥ 85 on Performance + Accessibility

**Anything beyond these 8 criteria is V1 work and should be deferred.**

---

## 13. Risks and explicit acknowledgments

| Risk | Severity | Mitigation in V0 |
|---|---|---|
| Beware Board defamation/legal | High in V1, **N/A in V0** | All entries are seeded mock data; explicit disclaimer in footer |
| Mock data feels fake to investors | Medium | Use real numbers from existing Excel; use real Unsplash photos; reference real places |
| Founder builds alone, gets stuck | High | CLAUDE.md is your engineering co-founder. Use it. |
| Scope creeps to "real" product | Critical | This document. Re-read Section 0 weekly. |
| Investors ask "where's the user data" | Medium | Pre-write an answer: "V0 is the asset. V1 ships with the round." |

---

## 14. Open questions (decide before Day 6)

These do not block Phase 1-2 but block Phase 3:

1. Domain: `wanderwomen.in` vs `wanderwomen.app` vs `wanderwomen.travel`?
2. Founding contributor outreach: do you have 3 women in mind to feature on `/contributor/[name]` pages? If not, the pages still ship but with composite/illustrative profiles + a "based on real solo travelers" disclaimer.
3. Sara persona — do you have a real foreign woman willing to be the named voice on `/intel/delhi-for-foreigners`? If not, write under a composite name with disclaimer.
4. Founding membership price: locked at ₹499/year, or A/B test ₹299 vs ₹499 on email capture page?

---

## 15. The one-line summary (memorize this for investor calls)

> *"V0 is a working web product showing how 47 women would build a real travel intelligence layer for India and 6 international destinations. We're showing what 90 days of community contribution unlocks — without faking the contribution itself."*

End of PRD.
