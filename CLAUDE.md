# CLAUDE.md — Wander Women V0

> This file is read by Claude Code at the start of every session.
> Keep it short. Keep it current. Update it when something changes.

## What we're building

Wander Women V0 — a working Next.js demo of a women-only solo travel intelligence platform, designed to pitch investors. **Mock data only. No real backend. No real payments.** See `/PRD.md` for full scope.

## Who I am

I am the solo founder. I have a content/marketing background, no formal engineering training, but I can read code and ship product. **Treat me as a smart non-technical operator who needs simple English explanations for every technical decision.**

## How I want you to communicate

- **Lead with plain English.** Before any code, explain in 1-2 sentences what you're about to do and why. Example: "I'm going to add a card component to display each Trip Intel preview. It uses the existing button + image patterns we set up in Phase 2."
- **Translate jargon.** When you say `getStaticProps`, follow it with "(this is how we tell Next.js to pre-build a page using our JSON data instead of fetching it on every request)."
- **Surface trade-offs.** When you face a decision, say *"Two options: A or B. A is simpler now, B is more flexible later. Recommending A because we're in V0."* Then proceed.
- **Be brutally honest.** If I ask for something stupid, expensive, or out of V0 scope: tell me. Don't just comply.
- **No flattery.** Don't open with "Great question!" or "Excellent idea!" Just answer.

## The non-negotiable rules

### 1. Mock data only. Forever (in V0).
- Every page reads from `/lib/mock-data/*.json`
- Zero database connections. No Supabase, Postgres, Mongo, Firebase.
- Zero real auth. No Clerk, Auth.js, Auth0.
- Zero real payments. No Stripe, no Razorpay.
- If I ask for a "real" feature, remind me of this rule and propose a mock equivalent.

### 2. Stay in scope.
The 9 routes in `/PRD.md` Section 3.1 are the entire product. If I ask for a 10th route, ask me: *"This isn't in the PRD. Are you adding to V0 or V1? If V0, what are we removing to keep scope?"*

### 3. Reuse before you build.
- Use shadcn/ui primitives wherever possible. Don't build a Button from scratch.
- Use Tailwind utility classes. Don't write custom CSS files unless absolutely required.
- Use Next.js conventions (App Router, RSC by default, `'use client'` only when needed).
- Use Unsplash for images. Don't generate or source elsewhere.

### 4. Mobile-first, every time.
- Build the 375px-wide mobile view first. Desktop second.
- Test responsive at 375 / 768 / 1280 widths.
- If a feature is hard on mobile, simplify it on mobile. Don't hide it.

### 5. Don't optimize prematurely.
- No SSR optimization, edge functions, ISR, or caching strategies in V0.
- Use `getStaticProps` / static generation everywhere. Pages are static.
- No image optimization beyond Next.js's default `<Image>` component.
- Lighthouse target is 85, not 100.

### 6. Don't add libraries without asking.
- Anything beyond Next.js, React, Tailwind, shadcn/ui, lucide-react: ASK FIRST.
- I want to know what's in `package.json`. Every new dep is a tax.

### 7. Always show me the file tree.
When you create new files, end your message with a short tree:
```
new files:
  /app/intel/[slug]/page.tsx
  /components/intel/IntelCard.tsx
  /lib/get-intel-card.ts
```

### 8. Commit messages I can read.
Format: `<area>: <what changed in plain English>`
Examples:
- `intel-card: add neighborhoods accordion`
- `landing: fix mobile hero overflow`
- `data: add 3 more Beware Board entries`

### 9. Errors get explained, not just fixed.
When you fix a bug: tell me what the bug *was*, why it happened, and what you changed. One sentence each.

### 10. When in doubt, refer to the PRD.
- `/PRD.md` Section 0 is the philosophy.
- `/PRD.md` Section 7 is the page-by-page spec.
- `/PRD.md` Section 10 is what NOT to build.

## Stack (locked)

```
Next.js 16 (App Router) — bumped from 15 on 2026-04-28; current stable
TypeScript (strict mode)
Tailwind CSS v4
shadcn/ui (theme: stone base, customized colors)
lucide-react (icons)
Cormorant Garamond (Google Fonts) — display
DM Mono (Google Fonts) — body + UI
```

If you suggest anything outside this list, you must (a) tell me why, (b) propose alternatives, and (c) get my "yes" before installing.

> Next.js 16 has breaking changes from 15 (async cookies/headers, caching defaults, etc.). Read the relevant docs in `node_modules/next/dist/docs/` before assuming v15 behavior. See `/AGENTS.md`.

@AGENTS.md

## Design tokens (paste into globals.css)

```css
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
```

## File structure (target)

```
/app
  /(marketing)/page.tsx              # Landing /
  /intel/[slug]/page.tsx
  /explore/page.tsx
  /community/page.tsx
  /feed/page.tsx
  /buddy/page.tsx
  /vault/page.tsx
  /contributor/[name]/page.tsx
  /onboarding/page.tsx
  /shop/page.tsx
  /coming-soon/page.tsx
  layout.tsx
  globals.css
/components
  /ui                                # shadcn primitives
  /intel                             # Trip Intel Card sub-components
  /community                         # Community tab components
  /shared                            # Header, Footer, etc.
/lib
  /mock-data                         # All JSON files
    intel-cards.json
    contributors.json
    community-posts.json
    beware-entries.json
    trip-feed.json
    buddy-matches.json
  utils.ts
/public
  /images                            # Local fallback images
  favicon.ico
/scripts
  excel-to-json.ts                   # Port existing Excel to JSON
```

## Build phases (current state)

> Update this section as we progress.

- [x] Phase 1 — Setup + content port (Days 1-3)
- [x] Phase 2 — Layout + shell (Days 4-5)
- [x] Phase 3 — Core content pages (Days 6-9)
- [x] Phase 4 — Community + secondary (Days 10-12)
- [ ] Phase 5 — Polish (Days 13-14) ← in progress
- [ ] Phase 6 — Investor layer (Day 15)

## Workflow expectations

### When I open a session
- I'll tell you what phase we're in and what I want to build today
- You confirm the scope in 1-2 sentences before writing code
- You ask one clarifying question if needed (max one)
- You write the code, then explain what you did

### When you finish a task
- Show the file tree of what you created/changed
- Confirm I can `npm run dev` and see the result
- Tell me what to test on mobile vs desktop
- Suggest the next step (small) — but wait for my "go" before doing it

### When you're unsure
- Stop and ask. I'd rather you ask than guess.
- Frame the question: "Two options. A: ___. B: ___. Which?"

### When something breaks
- Try to fix it once
- If still broken after one attempt, stop and explain what you see
- Don't keep guessing or installing new packages to "try"

## Things I'll never know unless you tell me

These are technical realities I will not catch on my own. Always flag them:

- Performance issues that will hurt mobile users (images too big, layout shift)
- Accessibility issues (color contrast, missing labels)
- Hardcoded values that should be in JSON (so I can edit content without touching code)
- Anything I'm asking for that's a security risk if shipped to production
- Anything that would break when we eventually move from mock data to real backend

## What I'll never do (so don't expect me to)

- Open a terminal and run complex commands without your guidance
- Debug TypeScript errors without you walking me through them
- Modify config files (next.config.js, tailwind.config.js, tsconfig.json) without your help
- Resolve merge conflicts
- Set up CI/CD pipelines
- Write tests (V0 has zero tests; I know this is a tradeoff)

## Tools available to you in this repo

- Filesystem read/write
- npm install (but ask before adding new deps)
- Run `npm run dev`, `npm run build`, `npm run lint`
- Search the web if you genuinely need current docs (Next.js, shadcn, Tailwind v4)
- Read existing Excel research files in `/research-source` (will be added) — these are the content source for Trip Intel Cards

## What you should NOT do

- Push to GitHub or deploy on my behalf without me asking
- Modify `.env` or any secrets file
- Delete files without confirming
- Refactor code that already works "for cleanliness"
- Add features I didn't ask for, even if they seem helpful
- Suggest a SaaS tool to solve a problem unless it's free and zero-config

## How we measure progress

We are done when the 8 success criteria in `/PRD.md` Section 12 are met. Not before. Not after.

## Founder mood check

If I am clearly stressed, frustrated, or talking about scope-creep — pause and ask: *"Are you adding scope or building toward the 8 success criteria? I want to make sure we ship V0."*

Be honest with me. The biggest risk to this project is me, not the code.

## How to add a new beware-board city

Follow these steps in order. Takes ~15 minutes.

**1. Add city config** — `lib/beware-cities-data.json`
```json
"barcelona-spain": {
  "config": { "slug": "barcelona-spain", "name": "Barcelona", "center": [41.3851, 2.1734], "zoom": 12 },
  "reports": []
}
```

**2. Add OSM relation ID** — `lib/beware-cities.ts`, `BOUNDARY_OSM_ID_BY_SLUG`
Look up the ID at `nominatim.openstreetmap.org/search?q=Barcelona&country=ES`.
Click the result → note the OSM relation number (e.g. R347950).
```ts
"barcelona-spain": "R347950",
```

**3. Pre-fetch the boundary file** (run this locally, requires internet)
```bash
npx ts-node scripts/fetch-boundary.ts barcelona-spain
```
This saves `lib/mock-data/boundaries/barcelona-spain.json` and prints next steps.

**4. Commit and deploy**
```bash
git add lib/mock-data/boundaries/barcelona-spain.json
git commit -m "data: add boundary for barcelona-spain"
git push origin main
```

After deploy: heatmap, pins, boundary line, and white fog mask all work immediately.
The city slug is also registered as a static route automatically via `generateStaticParams`.

> **Country codes** — 50+ country suffixes are already mapped in `COUNTRY_BY_SUFFIX`
> (lib/beware-cities.ts). If your suffix isn't there, add it before running the script.

## End of file
