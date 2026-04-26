# V0_DEMO_SPEC.md — Wander Women Demo Build Guide

> Companion to `/PRD.md` and `/CLAUDE.md`.
> **This file is a build manual.** Open it next to Claude Code. Work through it linearly. Each section is one Claude Code session.

---

## Section A — Day 1: Project initialization

### A.1 Commands to run in order

```bash
# 1. Initialize Next.js
npx create-next-app@latest wander-women --typescript --tailwind --app --src-dir=false

# 2. Enter the project
cd wander-women

# 3. Install shadcn/ui
npx shadcn@latest init
# Choose: Default, Stone, CSS Variables: Yes

# 4. Add the components we'll need
npx shadcn@latest add button card tabs avatar badge accordion separator input

# 5. Install lucide-react (icons) — already comes with shadcn
npm install lucide-react

# 6. Run dev server to confirm it works
npm run dev
```

### A.2 Files to create / modify on Day 1

```
/CLAUDE.md                    [paste from /CLAUDE.md doc]
/PRD.md                       [paste from /PRD.md doc]
/V0_DEMO_SPEC.md              [paste from this file]
/app/globals.css              [add design tokens — see Section B.1]
/lib/mock-data/               [empty folder, populated Day 2]
/lib/utils.ts                 [add cn() helper if not already there]
```

### A.3 Day 1 ends when

- ✅ `npm run dev` runs without error
- ✅ `localhost:3000` shows default Next.js page
- ✅ shadcn/ui Button component imports correctly somewhere (test in `/app/page.tsx`)
- ✅ Cormorant Garamond and DM Mono fonts load via `next/font/google`
- ✅ All three docs (CLAUDE.md, PRD.md, V0_DEMO_SPEC.md) are in the repo root

---

## Section B — Day 2: Design system + fonts

### B.1 Paste this into `/app/globals.css`

```css
@import "tailwindcss";

@layer base {
  :root {
    --sand: #f5f0e6;
    --ink: #1a1510;
    --rust: #c4522a;
    --rust-light: #f0d5c8;
    --sage: #4a7c59;
    --sage-light: #d4e8d8;
    --blue: #2a4d7a;
    --blue-light: #d8e6f5;
    --gold: #b5860a;
    --gold-light: #f5e8c0;
    --purple: #6b3a7a;
    --purple-light: #ead8f0;
    --muted: #8a7d72;
    --border: #e0d8cc;
    --warm-white: #faf8f4;
  }
}

@layer base {
  body {
    background: var(--sand);
    color: var(--ink);
    font-family: var(--font-mono), monospace;
  }
  
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
    opacity: 0.4;
  }
  
  h1, h2, h3, h4 {
    font-family: var(--font-serif), 'Cormorant Garamond', serif;
    font-weight: 300;
    letter-spacing: -0.02em;
  }
  
  .label {
    font-size: 0.625rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
  }
}
```

### B.2 Paste this into `/app/layout.tsx`

```tsx
import { Cormorant_Garamond, DM_Mono } from 'next/font/google';
import './globals.css';

const serif = Cormorant_Garamond({
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-serif',
});

const mono = DM_Mono({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata = {
  title: 'Wander Women — Trip intel built by women who travel solo',
  description: 'Real intel, real costs, real names. India and 6 international destinations.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

### B.3 Day 2 ends when

- ✅ Sand-colored background visible on every page
- ✅ Both fonts render (test by adding an `<h1>` and `<p>`)
- ✅ Grain texture visible faintly on background
- ✅ shadcn Button uses your color tokens (might need theme tweak)

---

## Section C — Day 3: Mock data structure

This is the most important day. You'll port your existing Excel research into JSON. **This is what makes V0 feel real instead of fake.**

### C.1 The Excel→JSON port

Take your existing 4 India workbooks + 6 international workbooks. For each destination, pull:
- Top 4-6 scams (from Master Scam List sheet)
- Daily budgets (from Money Hacks sheet)
- 3-5 hidden gems (from Hidden Gems sheet, India only — for international, write 3 quick gems based on existing safety/money tabs)
- Pre-travel checklist (from Pre-Travel Checklist sheet)

### C.2 `intel-cards.json` — sample structure

```json
[
  {
    "slug": "goa-india",
    "destination": "Goa",
    "country": "India",
    "audience": "indian",
    "heroImage": "https://images.unsplash.com/photo-1518002054494-3a6f94352e9d",
    "contributor": {
      "name": "Ananya",
      "profileSlug": "ananya-mumbai",
      "badge": "Goa Regular",
      "tripCount": 8,
      "cityHome": "Mumbai"
    },
    "lastUpdated": "2026-04-15",
    "verifiedByCount": 12,
    "tldr": [
      "South Goa is calmer and safer than North for solo women",
      "Skip airport taxi (₹900 quote) — use Rapido (₹280)",
      "Stay near Palolem or Patnem if first solo trip",
      "Female-only dorms exist at Soul & Surf, Mojigao",
      "₹1,500-2,500/day comfortable budget"
    ],
    "neighborhoods": [
      {
        "name": "Palolem (South)",
        "safetyRating": 5,
        "vibe": "Calm beach town, families, yoga retreats. Best for first-timers.",
        "stayHere": "Yes"
      },
      {
        "name": "Anjuna / Vagator (North)",
        "safetyRating": 3,
        "vibe": "Party scene, late-night markets, more aggressive touts. Stay only if going for nightlife.",
        "stayHere": "With caution"
      },
      {
        "name": "Aldona / Assagao (Inland)",
        "safetyRating": 5,
        "vibe": "Boutique cafes, female-founder businesses, quiet. The Project Cafe area.",
        "stayHere": "Yes"
      }
    ],
    "scams": [
      {
        "title": "Airport taxi pre-paid scam",
        "severity": "high",
        "where": "Goa Airport (Dabolim & Mopa)",
        "what": "Pre-paid taxi quotes ₹900-1,500 for ₹280 ride to Anjuna",
        "avoid": "Use Rapido or Goa Miles app from outside parking. Negotiate cab fare beforehand."
      },
      {
        "title": "Beach 'massage' upsell",
        "severity": "medium",
        "where": "Calangute, Baga, Anjuna beaches",
        "what": "₹200 massage offered → 'oil extra ₹500' → 'special technique ₹1,000'",
        "avoid": "Confirm full price in writing before agreeing. Or use registered spa."
      }
    ],
    "transport": [
      {
        "mode": "Rapido / Goa Miles",
        "tip": "Use both apps. Goa Miles is local; sometimes faster availability.",
        "approxCost": "₹100-300 per ride within North Goa"
      }
    ],
    "hiddenGems": [
      {
        "name": "The Project Cafe (Aldona)",
        "why": "Founded by Drasty Shah, all-women team. 130-year-old Portuguese mansion.",
        "type": "Boutique stay + cafe",
        "approxCost": "Cafe ₹400-700; stay ₹6,000-15,000/night"
      },
      {
        "name": "Sappadu (Assagao)",
        "why": "Women-run South Indian veg restaurant. Authentic, simple, solo-comfortable.",
        "type": "Restaurant",
        "approxCost": "₹350-700 meal"
      }
    ],
    "preBookChecklist": [
      "Stay confirmed with female-friendly review (Hostelworld 4.5+)",
      "Rapido account active before landing",
      "Cash ₹3,000-5,000 for first 24h",
      "Female-only dorm filtered if hostel",
      "Mom's number + hostel reception number saved offline"
    ],
    "dosAndDonts": {
      "do": [
        "Walk back from beach in groups after sunset",
        "Use Rapido at all hours — drivers are tracked",
        "Stay in Palolem/Patnem/Assagao for first solo trip"
      ],
      "dont": [
        "Walk Anjuna→Vagator coastal path solo at night",
        "Rent scooter without verified license",
        "Accept beach 'flower' or 'free henna' — always paid"
      ]
    },
    "estimatedDailyBudget": {
      "backpacker": "₹1,200-2,000",
      "midRange": "₹2,500-4,500",
      "comfortable": "₹6,000-10,000"
    },
    "emergencyNumbers": [
      "Goa Police: 100",
      "Tourist Police Goa: 0832-2424001",
      "Women's Helpline: 1091"
    ],
    "isPremium": false,
    "premiumPreview": "Full North Goa nightlife safety map + 6 secret beaches with ride-share dropoff GPS"
  }
]
```

### C.3 `contributors.json` — sample structure

```json
[
  {
    "slug": "ananya-mumbai",
    "name": "Ananya",
    "fullName": "Ananya M.",
    "homeCity": "Mumbai",
    "ageRange": "30-32",
    "tripCount": 12,
    "tagline": "8 years solo. Spiti, Goa, Vietnam regular.",
    "bio": "Started solo travel at 23. Spent the next 8 years answering the same DMs about Spiti and Goa. Built this card so the answer lives somewhere permanent.",
    "photoUrl": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    "badges": ["Spiti Valley Expert", "Goa Regular", "Founding Contributor"],
    "destinations": ["spiti-india", "goa-india", "manali-india", "vietnam"],
    "joinedDate": "2026-03-01",
    "earningsThisMonth": 2400,
    "totalContributions": 4,
    "answersInCommunity": 27,
    "instagram": "@ananya.solo (1.2k)"
  },
  {
    "slug": "riya-bangalore",
    "name": "Riya",
    "fullName": "Riya S.",
    "homeCity": "Bangalore",
    "ageRange": "23-25",
    "tripCount": 4,
    "tagline": "First-time solo traveler turned reluctant expert.",
    "bio": "Did my first solo trip to Rishikesh in 2024 — terrified. Now planning my 5th. Writing for first-timers because I remember what that fear felt like.",
    "photoUrl": "https://images.unsplash.com/photo-1531123897727-8f129e1688ce",
    "badges": ["Rishikesh Beginner Guide", "Founding Contributor"],
    "destinations": ["rishikesh-india", "kasol-india"],
    "joinedDate": "2026-03-15",
    "earningsThisMonth": 800,
    "totalContributions": 2,
    "answersInCommunity": 14,
    "instagram": "@riya.travels (340)"
  }
]
```

### C.4 `beware-entries.json` — sample structure

```json
[
  {
    "id": "be-001",
    "title": "Airport taxi 'flat rate' scam",
    "city": "Goa",
    "country": "India",
    "severity": "high",
    "datePosted": "2026-04-20",
    "postedBy": "Riya",
    "verifiedByCount": 8,
    "helpfulCount": 47,
    "body": "Auto stand outside Goa airport quoted ₹900 to my hostel in Anjuna. Ride should be ₹280 max. Got aggressive when I refused. Used Rapido from outside parking — no issue.",
    "tags": ["transport", "airport", "first-day"],
    "stillActive": true
  },
  {
    "id": "be-002",
    "title": "Fake 'temple closed' guide outside Wat Pho",
    "city": "Bangkok",
    "country": "Thailand",
    "severity": "medium",
    "datePosted": "2026-04-12",
    "postedBy": "Sara",
    "verifiedByCount": 5,
    "helpfulCount": 31,
    "body": "Outside Wat Pho a man told me the temple was closed for ceremony, offered tuk-tuk tour to 'better' temple. Standard scam — temple was open, tuk-tuk was a gem shop trip. Walked past, entered normally.",
    "tags": ["temples", "tuk-tuk", "tourist-trap"],
    "stillActive": true
  }
]
```

### C.5 `community-posts.json` — sample structure

```json
[
  {
    "id": "post-ask-001",
    "tab": "ask",
    "question": "Is Hauz Khas Village safe for solo dinner around 9pm?",
    "askedBy": "Sara",
    "askedByCity": "London",
    "datePosted": "2026-04-22",
    "destination": "Delhi",
    "answers": [
      {
        "answeredBy": "Priya",
        "answeredByCity": "Bangalore",
        "answer": "Yes, HKV main strip is fine until ~11pm. Stick to Black Cab Cafe / Coast / Out of the Box area. Avoid the lake walk at night.",
        "verifiedByCount": 4
      }
    ],
    "answersCount": 3
  },
  {
    "id": "post-rant-001",
    "tab": "rant",
    "body": "Just got off the Mumbai-Goa overnight bus. The 'sleeper' was a metal box. Someone snored at 110dB. Eight hours of pure regret. Never again. Train next time.",
    "postedBy": "Ananya",
    "datePosted": "2026-04-18",
    "destination": "Goa",
    "supportCount": 22
  }
]
```

### C.6 Day 3 ends when

- ✅ All 6 JSON files exist with at least the minimum content (15 cards, 8 contributors, 25 Beware entries, 40 community posts, 12 trip feed entries, 10 buddy matches)
- ✅ JSON validates (no trailing commas, no missing fields)
- ✅ Helper functions exist in `/lib/get-intel-card.ts`, `/lib/get-contributor.ts` etc. — each is 5-10 lines that imports the JSON and returns by slug

---

## Section D — Days 4-5: Layout shell + landing page

### D.1 The minimum shell to ship

```
/components/shared/
├── Header.tsx       — logo + 3 nav links + "Join" CTA
├── Footer.tsx       — disclaimer + 4 nav columns + email capture
├── PageContainer.tsx — max-width wrapper, padding, mobile-aware
```

### D.2 Header — exact spec

- Sticky top, sand background, hairline bottom border
- Logo left: "Wander Women" in Cormorant Garamond italic, rust color
- Right (desktop): `Explore · Community · Contributors · Join (rust button)`
- Right (mobile): hamburger that slides a sheet from right
- Height: 64px desktop, 56px mobile

### D.3 Footer — exact spec

- 4 columns desktop, stacked mobile
- Column 1: Brand + tagline + "Built by women, for women"
- Column 2: Product links (Explore, Community, Feed, Buddy, Vault)
- Column 3: For contributors (Apply, How it works, Earnings model)
- Column 4: **Email capture** "Get the Goa intel card free → [email] [Subscribe]"
- Bottom strip: copyright + privacy + terms (links go to placeholder pages)
- **Disclaimer (small text):** "Beware Board entries are user-submitted opinions, not statements of fact. We moderate but cannot verify every claim. See full Community Guidelines."

### D.4 Landing page — section by section

**Section 1: Hero**
```
┌─────────────────────────────────────────────────┐
│ [grain texture overlay]                          │
│                                                  │
│ TRIP INTEL · BUILT BY WOMEN · LIVE NOW           │
│                                                  │
│ Trip intel built by women                        │
│ who actually travel solo.                        │
│                                                  │
│ Real intel, real costs, real names.              │
│ India + 6 international destinations.            │
│                                                  │
│ [Start with Goa →]   [Visiting India?]           │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Section 2: Two-card persona split**

Two cards side-by-side desktop / stacked mobile.

Left card (rust accent):
> 🎒 First time traveling solo in India?
> 47 women have written what they wish someone had told them.
> [See Priya's Rishikesh card →]

Right card (blue accent):
> 🌸 Visiting India from abroad?
> The only India intel written by women for foreign solo travelers.
> [See Sara's Delhi card →]

**Section 3: Trip Intel Card preview ribbon**

3 cards horizontally, scrollable on mobile. Each card preview:
- Hero image (Unsplash)
- Destination name (Cormorant 32px)
- Contributor: "by Ananya · Mumbai · 8 trips"
- 3 stats: scams covered · neighborhoods · last updated
- "Read intel →"

Default 3 to show: Goa, Rishikesh, Tokyo.

**Section 4: Beware Board ticker**

Section heading: "What women warned about this week"

3 entries scrolling vertically (CSS only, no JS). Each:
- ⚠️ icon (color by severity)
- Title in serif
- City · date · author
- 1-line preview
- "47 women found helpful"

CTA below: "See all warnings → /community"

**Section 5: How it works (3 steps)**

```
01. Find the intel.       02. Read what real women  03. Travel with a community
                              wrote.                    in your pocket.
[Goa card preview]        [Card screenshot]          [Vault chat preview]
```

**Section 6: Contributor showcase**

Heading: "Meet the women behind the intel"

4 contributor avatars in a row with name + city + trip count + 1 badge each.

CTA: "Become a founding contributor →"

**Section 7: Pricing strip**

Three pillars:
1. **Free forever** — Trip Intel Cards · Community · Beware Board
2. **Founding ₹499/year** — Premium sections · Buddy matching · Priority sister
3. **Per-trip ₹199** — WhatsApp Vault for one trip

CTA: email capture form → submits to Formspree

**Section 8: Founder story (single column)**

300-word personal note from founder. Photo. Signed.

**Footer.**

### D.5 Days 4-5 end when

- ✅ Landing page renders fully on mobile + desktop
- ✅ All 8 sections visible with real content (not lorem ipsum)
- ✅ All CTAs link somewhere (even if to /coming-soon)
- ✅ Email capture form submits to Formspree and you get a test email

---

## Section E — Days 6-9: Trip Intel Card pages

This is where the demo lives or dies. Spend time here.

### E.1 The `/intel/[slug]` page anatomy

Render order, top to bottom:

1. **Breadcrumb:** `Explore › India › Goa`
2. **Hero block** (full-bleed image with text overlay, gradient bottom)
   - Destination name (Cormorant 96px)
   - Subtitle: "Solo female intel · written by **Ananya** · Mumbai · 8 trips"
   - 3 trust badges: "Last updated April 15" · "Verified by 12 women" · "Free to read"
3. **TLDR card** (cream background, 5 bullets)
4. **Neighborhoods** (accordion, 3-5 items)
5. **Scams** (4-6 cards in 2-column grid; severity-colored left border)
6. **Transport** (table-like layout)
7. **Hidden gems** (3-5 cards with photo)
8. **Pre-book checklist** (interactive checkboxes, persists in localStorage)
9. **Money** (3-tier budget cards + 5-line money hacks list)
10. **Premium section** (blurred preview + "Unlock with founding membership ₹499 →")
11. **Emergency numbers** (small block, easy to copy)
12. **Contributor card** (photo + bio + "Read her other intel" link)
13. **Related destinations** (3 horizontal cards: "Also in India", "Also for solo women in their first year")
14. **Sticky right sidebar (desktop only):**
    - Ask the community about Goa
    - Find a buddy going to Goa
    - Set up vault for this trip — ₹199

### E.2 The premium "blur" treatment

Don't just CSS-blur a fake paragraph. Show an *actual paragraph teaser* then blur:

```
The 6 secret beaches in South Goa with safe ride-share dropoff GPS coordinates...

[blurred section follows showing 4-5 actual neighborhood lines]

🔒 Unlock the rest — Founding ₹499/year
```

### E.3 Mobile considerations

- Sticky sidebar becomes a bottom-anchored CTA bar with single primary action
- Accordions auto-collapse on mobile load
- Hero text shrinks: 96px → 56px
- Two-column scam grid → single column

### E.4 Days 6-9 end when

- ✅ All 15 destinations have a working `/intel/[slug]` page
- ✅ Each page passes a 30-second eyeball test on mobile (375px) and desktop
- ✅ Contributor name links to `/contributor/[slug]`
- ✅ Premium blur looks intentional, not buggy
- ✅ Lighthouse mobile score ≥ 80

---

## Section F — Days 10-12: Community + secondary pages

### F.1 `/community` — Tab structure

Top: 4 tabs (rust underline on active).

```
[ Ask the community ] [ Ask a local sister ] [ Rant space ] [ Beware Board ]
```

Each tab = a feed of post cards. Each post type renders slightly differently.

### F.2 Beware Board entry — anatomy

```
┌────────────────────────────────────────────┐
│ ⚠️  Severity colored left border (4px)      │
│                                            │
│ Airport taxi 'flat rate' scam              │
│ Goa, India · April 20 · by Riya            │
│                                            │
│ "Auto stand outside Goa airport quoted     │
│  ₹900 to my hostel in Anjuna. Ride         │
│  should be ₹280 max. Used Rapido instead." │
│                                            │
│ #transport #airport #first-day             │
│                                            │
│ ✓ Verified by 8 women  ❤️ 47 helpful       │
│ [Forward to friend] [Mark resolved]        │
└────────────────────────────────────────────┘
```

### F.3 The "Forward to friend" mock interaction

Click "Forward to friend" → opens modal that shows:
- A WhatsApp-style preview message: "⚠️ Heads up — saw this on Wander Women: 'Airport taxi flat rate scam in Goa...' [link]"
- Two buttons: `Copy text` / `Open WhatsApp`
- Below: "12 women have forwarded this to a friend this week"

This is the **screenshot-and-share** loop made native. Highest-virality interaction in the entire app.

### F.4 `/buddy` page — exact UX

Top: "You're going to **Goa, March 15-22**. Here are 3 women on overlapping dates."

Each match card (vertical stack on mobile, horizontal scroll on desktop):

```
┌──────────────────────────────────────┐
│ [Photo · 80x80 round]                │
│                                      │
│ Riya, 24                             │
│ Bangalore · 1st solo trip            │
│ Going Mar 14-20 (6 days overlap)     │
│                                      │
│ ✨ Why you might match                │
│ • Same destination                   │
│ • Both 1st-time solo                 │
│ • Similar age range                  │
│                                      │
│ [Save match]  [Send hello — V1]      │
└──────────────────────────────────────┘
```

The "Send hello" button is **disabled with a tooltip**: "Coming in V1 — verified IG required". Click "Save match" → toast: "Saved to your trip plan."

### F.5 `/vault` page

Marketing-style landing page. Three sections:

1. **Hero:** "Your trip's command center, in WhatsApp." Phone-mockup screenshot of the vault chat (paste mock conversation from PRD Section 7.7).
2. **3 use cases:** "Type 'docs' → instant retrieval" / "Type 'emergency' → local numbers" / "Type 'route' → saved transport routes"
3. **Pricing:** Single ₹199 card. CTA: "Set up vault → email capture form"
4. **FAQ accordion:** "Is my data safe?" / "Do I need to install anything?" / "What if I lose phone signal?" — all answers explain the V1 vision but say "Currently in private beta — join the founding 200 to access first."

### F.6 `/onboarding` flow

3 sequential screens. State stored in localStorage (`{ tripCount: 0, destination: 'goa', worry: 'transport' }`). Submit on Q3 → redirect to `/intel/[matched-destination]?from=onboarding`

The matched destination has a banner above the TLDR: "Based on your worries about [transport, scams], start with the Transport and Scams sections below ↓"

### F.7 Days 10-12 end when

- ✅ All 4 community tabs render with seeded content
- ✅ Forward-to-friend modal works (real WhatsApp link)
- ✅ Buddy matching shows 3 mock matches
- ✅ Vault landing page is complete with phone mockup
- ✅ Onboarding flow + redirect works end-to-end

---

## Section G — Days 13-15: Polish + investor narrative

### G.1 Polish checklist (Days 13-14)

| Area | Tasks |
|---|---|
| Loading states | Skeleton loaders on all data-heavy pages |
| Empty states | Show "No matches yet — check back tomorrow" style copy |
| Hover states | Subtle scale or border color shift on all clickable cards |
| Mobile pass | Re-test every page at 375px, fix overflow / awkward wraps |
| Image sizes | Set `<Image>` width/height props everywhere; use `sizes` for responsive |
| Color contrast | Run aXe DevTools or Lighthouse a11y audit, fix score <90 |
| 404 page | Custom not-found page in brand voice |
| Favicon | Custom favicon (or use a 🧳 emoji as favicon) |
| Open Graph image | Single static OG image (1200x630) |
| Plausible Analytics | Add to layout.tsx |

### G.2 Investor narrative layer (Day 15)

Create `/app/pitch/page.tsx` — a single password-protected investor walkthrough. Add a basic password gate (just a query parameter `?key=ww2026` checked client-side; this is V0).

**`/pitch` page contains:**

1. **One-paragraph brief** (the elevator pitch from PRD Section 15)
2. **Embedded Loom** (you record a 60-90 second walkthrough)
3. **The 3-card opportunity:**
   - Market — solo female travel India ($X spent, Y million women, growing N% YoY)
   - Wedge — no platform serves women specifically + globally
   - Why now — UPI, eSIM, trustless community-driven content moment
4. **Demo links** — direct deep-links to the 4 most impressive pages: best Intel Card, Beware Board, Contributor profile, Buddy match
5. **Numbers card** (mock or real wherever possible):
   - 47 contributors lined up (mock)
   - 1,200 waitlist signups (mock — replace with real number when you have it)
   - Avg revenue per Sara: ₹2,050 vs ₹499 for Indian user (real, justifiable)
   - 0 ad spend so far (real — true)
6. **Ask:** how much you're raising, what for, timeline. **(You set this.)**
7. **Founder bio + photo + Calendly link**

### G.3 Day 15 ends when

- ✅ All 9 routes pass mobile + desktop eyeball test
- ✅ Lighthouse mobile ≥ 85 on Performance + Accessibility
- ✅ Domain is live with HTTPS on Vercel
- ✅ Loom recorded and embedded
- ✅ `/pitch` is live and walkable
- ✅ At least 3 friends have walked through and given feedback

---

## Section H — What to do AFTER V0 ships

In order of priority:

1. **Send the demo to 5 founding contributors** (real Ananyas in your network or DM-able). Goal: 1 says yes to being on a real Trip Intel Card.
2. **Send the demo to 5 investors** (warm intros only). Goal: 1 takes a meeting.
3. **Send the demo to 20 potential users** (Reddit r/solotravel, Girls LOVE Travel, your own network). Goal: 50 email signups.
4. **Track the analytics for 1 week.** Where do people drop off? What page do they linger on? Use this to prioritize V1.
5. **Then and only then** — start V1. Likely first V1 feature: real auth + real contributor editor for Trip Intel Cards (so Ananya can actually write hers).

**Do not start V1 features before V0 has been seen by 30 humans.**

---

## Section I — The "I'm stuck" troubleshooting playbook

If you're stuck, work through this in order before asking Claude Code more questions:

1. **Re-read PRD Section 0.** Are you trying to build something that's not in scope?
2. **Re-read CLAUDE.md non-negotiable rules.** Are you breaking one (e.g. trying to add a real database)?
3. **Restart the dev server.** `Ctrl+C` then `npm run dev` again. Solves 30% of mystery bugs.
4. **Clear `.next/` cache.** `rm -rf .next && npm run dev`. Solves another 20%.
5. **Check the browser console for actual errors** before assuming it's a Claude Code problem.
6. **Tell Claude Code exactly what you see** — quote the error message, the file, the line.
7. **If the same bug happens twice in 30 minutes, take a 10-minute walk.** Genuinely. The reset helps.

---

## Section J — Pre-launch checklist (the day before sharing publicly)

- [ ] Domain works (HTTPS, no cert warnings)
- [ ] Mobile load time under 3 seconds on 4G
- [ ] All affiliate links tested (you click, it tracks)
- [ ] Email capture works on 3 different forms
- [ ] No `console.log` statements left in production code
- [ ] No "lorem ipsum" anywhere
- [ ] No broken images (run through every page once)
- [ ] All Trip Intel Cards have a real contributor name (not "TBD")
- [ ] Privacy policy + terms pages exist (use a generator like Termly free tier)
- [ ] Beware Board legal disclaimer is visible in footer
- [ ] You can answer one question with confidence: *"What does this product do?"*
- [ ] You have a 60-second pitch memorized

---

## End of build guide.

When V0 ships: ping me. Then we'll plan the launch.
