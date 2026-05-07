# Pitch deck outline — 10 slides + appendix

> The structural skeleton for the deck. Write your real deck against
> this outline. Each slide has: purpose, headline copy, what goes on
> the slide, and what NOT to do.
>
> Total deck length: 10 slides for the meeting. 5 appendix slides
> only used if asked. No deck should ever exceed 15 slides.

## Why an outline, not a deck file

A pitch deck file becomes outdated within 3 weeks. An outline tells
you the *structure* — which doesn't change — and lets you generate
fresh slide content per meeting using the docs already in the data
room.

Recommended tool: build the actual slides in Pitch.com or Figma. Don't
use Powerpoint. Don't use Google Slides. The visual quality of the
tool you choose communicates as much as the content.

## The 10-slide structure

### Slide 1 — Title

**Purpose:** establish the brand and the one-line.

**Headline:** Wander Women

**Subhead:** Verified solo-female-travel intelligence for India.

**Visuals:** the wordmark, a single hero photograph (not a stock
photo — use one of your contributor's actual trip photos with their
permission). Background: warm, editorial, not corporate.

**On the slide:** that's it. Founder name + email at the bottom in
small text. Nothing else.

**What NOT to do:** taglines, "raising ₹X", VC names, urgency
language. The first slide is brand only.

---

### Slide 2 — The user moment

**Purpose:** make the investor *feel* the problem in 15 seconds.

**Headline:** It's 11pm in Goa. You're a 26-year-old woman, alone,
and your auto driver just took a wrong turn.

**On the slide:** the headline above as the entire slide. Optional:
a small illustrated map showing two routes — the official one and
the wrong-turn one. No body copy.

**What NOT to do:** stats, definitions, framework. The user moment
slide is emotional, not analytical.

**Why this works:** investors meet 200 founders a year. Every
"travel app" sounds the same. The user-moment slide makes them
remember which deck was yours.

---

### Slide 3 — The product (one image)

**Purpose:** show the product without explaining it.

**Headline:** This is what we built.

**On the slide:** a single screenshot of `/community/beware/goa-india`
at full mobile width. Heatmap visible. 2-3 incident pins visible.
Add one annotation arrow pointing to a specific report with the
text *"submitted by Riya, 4 days ago, verified"*.

**What NOT to do:** show three screens, walk through the funnel,
explain the architecture. One image, one annotation.

**Why this works:** investors fall asleep when you explain. They
wake up when you show.

---

### Slide 4 — Why now

**Purpose:** establish the timing window. Three reasons in 30 seconds.

**Headline:** Why this only works in 2026.

**On the slide:** three bullets, big.

1. **Solo female travel from India is at all-time high.** 6M trips/yr
   (MakeMyTrip 2024), growing 22% YoY.
2. **AI killed generic travel content.** ChatGPT now answers "is Goa
   safe" before users click. Recency + verification + named source
   wins the citation graph.
3. **DPDP Act 2023 forces verification rigor.** Platforms that built
   on anonymous UGC face new liability. Verified-women-only
   platforms have arbitrage.

**What NOT to do:** 7 reasons. 3 is the maximum.

---

### Slide 5 — The wedge

**Purpose:** prove you've narrowed, not platformed.

**Headline:** A women-only, named-contributor incident map for solo
travel in India.

**On the slide:** the one-sentence wedge above + 3 supporting bullets
that define what's IN and what's OUT.

**IN:**
- Beware Board (incident map)
- Trip Intel Cards (verified contributor content)
- Verified-contributor network

**OUT (deferred to V2):**
- Buddy matching, Vault, Trip Reports, Shop, Onboarding
- Foreign-women segment as primary persona
- Paid acquisition at launch
- B2B safety intel (Year 3 unlock)

**What NOT to do:** show the kitchen sink. The wedge slide is
ruthless.

---

### Slide 6 — Defensibility

**Purpose:** answer "what's the moat in 24 months."

**Headline:** Three layers of moat.

**On the slide:** three stacked rows.

1. **Verified contributor graph** — `user_verifications` +
   `stay_verifications` + named profiles. Reproducing this requires
   12+ months of trust-building.
2. **Primary safety dataset** — `beware_reports`, geo-tagged,
   moderated, photo-backed. After 12 months this is a defensible
   dataset insurers and corporates will pay for.
3. **Brand** — editorial design + named voices. Branding is the
   slowest moat to copy and the only one Booking.com structurally
   can't replicate.

**What NOT to do:** invoke "network effects" as a moat. Investors
hate hand-waved network effect claims.

---

### Slide 7 — The proof

**Purpose:** show what's actually built, not what's planned.

**Headline:** This is V1, not a Figma deck.

**On the slide:** four boxes in a 2x2 grid:

- **62 routes live** · 36 backed by Supabase
- **33 Postgres tables** · real auth, real moderation
- **22 cities indexed** on the Beware Board
- **8 named contributors** · 25 intel cards · 100+ moderated reports

Below the grid: *"Demo: wanderwomen.in · Build status: in data room"*

**What NOT to do:** show every metric. Four big numbers beat eight
small ones.

---

### Slide 8 — The numbers

**Purpose:** make the unit economics defensible.

**Headline:** Year-1 ₹15.7L total revenue. Year-3 ₹3.6 Cr ARR.

**On the slide:** the 3×3 sensitivity grid from
`docs/investor/sensitivity-table.md`. Highlight the base case in the
center (5% capture × 4% conversion). Annotate two cells:
- Worst case (2% × 2%): "₹5.9L — covered by the round"
- Best case (10% × 6%): "₹34.7L"

Below the grid: *"Live model in data room — every cell is editable."*

**What NOT to do:** show one number for revenue. One number is a
projection; a sensitivity grid is a thesis.

---

### Slide 9 — Team

**Purpose:** show who's running this and what's missing.

**Headline:** [Founder name] is the founder. Hiring CTO + community ops next.

**On the slide:** founder photo + 3-line bio. Below it, two boxes:

- **Founder** — [N] years content/marketing, [list 1-2 specific
  credentials], [N] solo trips across India and internationally.
- **Hiring with the round** — Technical co-founder (have N candidates
  in conversation) + Community ops lead (Q4 hire)

**What NOT to do:** pretend you have a team you don't. The honest
"solo founder hiring CTO" answer is fundable; the dishonest "we have
a team" gets caught in diligence.

---

### Slide 10 — The ask

**Purpose:** name the round, the use of funds, and the milestone.

**Headline:** Raising ₹[X] at ₹[Y] post-money.

**On the slide:** four lines.

1. **Use of funds:** [breakdown — e.g. 40% team, 30% content velocity,
   20% legal/compliance, 10% reserve]
2. **Milestone:** [specific — e.g. 1,000 paid members + 100 cards live
   + measured cohort retention]
3. **Runway:** [N] months
4. **Already in:** [if you have any soft commits, name fund/individual
   here. If not, skip this line — don't fabricate]

Below: *"Term sheet expected by [date]. Closing by [date]."*

**What NOT to do:** vague ask ("around ₹2-4 Cr"). Pick a number.
Vague founders raise vague money.

---

## Appendix slides (only if asked)

### A1. Cohort retention dashboard
Live screenshot of `/admin/cohorts`. Investors who care about
retention asked for this; everyone else doesn't need it.

### A2. Comparables
The `comparables.md` table, condensed. Lonely Planet, Pinkpangea,
JourneyWoman, Tripoto, etc. with what we learn from each.

### A3. Risk + mitigations
The `docs/legal/legal-review-rfp.md` workstreams as a single slide.
Defamation, DPDP, contributor classification.

### A4. The 12-month plan
A single timeline from "today" to "Series A milestones." Three
columns: technical, content, business.

### A5. Competition matrix
A 2x2 with axes "verified vs anonymous" and "structured vs
narrative." Wander Women in the verified-structured quadrant alone.
TripAdvisor / Reddit in anonymous-narrative. Lonely Planet in
anonymous-structured. Pinkpangea (defunct) in named-narrative.

## Slide design rules

- One headline, one image, three bullets max — that's the rhythm
- 36pt minimum for any text on a slide
- Cormorant Garamond for headlines, DM Mono for body (matches the
  product)
- Sand background (#f5f0e6), ink text (#1a1510), rust accent (#c4522a)
- One photograph per slide max — never two
- No clip art, no stock photos of "diverse women smiling"
- No bullet points longer than one line
- Page numbers in the corner — "5 / 10" — so the investor knows
  where they are

## What to NOT put in the deck

- Roadmap slides ("V1 → V2 → V3"). Roadmaps date the deck instantly.
- Quotes from "industry experts" you don't actually know
- "Disrupting X" language anywhere
- "Uber for travel" / "Airbnb for X" stretches
- Logos of funds you've talked to but who haven't committed
- Press mentions you don't have yet
- Numbers without sources (every number gets a footnote source)

## Recording the deck

After your deck is built:
1. Record a 60-second walkthrough of the product (per
   `docs/investor/loom-script.md`)
2. Export the deck as PDF
3. Put both in the data room with the link in the follow-up email

The Loom is the secret weapon. Most decks land in inboxes and die.
A 60-second Loom embedded in the email earns 3x the response rate.

## Updating the deck

Refresh:
- The numbers slide (Slide 8) — pre-pitch checklist mandates this
- The team slide (Slide 9) — every time the team changes
- The ask slide (Slide 10) — when valuation expectations shift
- Slide 7's metrics — quarterly

Don't refresh:
- The wedge slide (Slide 5) — only if the wedge actually changes
- The user-moment slide (Slide 2) — never, it's brand
- The defensibility slide (Slide 6) — only when defensibility evolves

## When the deck is wrong

If, after 3 investor meetings, the same question comes up that the
deck doesn't answer — add a slide for it. The deck is a living
artifact. Track every "huh, didn't expect that question" in
`docs/investor/pitch-log.md` and let the deck evolve from real data.

## Changelog

- **2026-05-07** — initial outline.
