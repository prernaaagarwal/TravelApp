# Follow-up email template — send 18–24 hours after the meeting

> Goal: prove you listened, hand them the model, and remove every
> friction to the next yes. Send within 24 hours; sending faster reads
> as desperate, sending slower reads as disorganized.

## When to send

- **Best window:** 18–24 hours after the meeting ends
- **Day of week:** never Friday afternoon, never Saturday/Sunday
- **Time of day:** between 8 AM and 11 AM their local time

## What you need before sending

- [ ] The Google Sheets link to `funnel-model.csv` (sharing: anyone with
      link can comment)
- [ ] The link to `docs/investor/build-status.md` (Notion or GitHub
      private link)
- [ ] The link to `docs/investor/sensitivity-table.md` (PDF preferred)
- [ ] One specific number or quote from the meeting
- [ ] One specific request you committed to (e.g. "send the legal RFP")
- [ ] The investor's calendar link or your own (Calendly /
      cal.com / Google Calendar)

## The template (copy-paste, fill the bracketed bits)

---

**Subject:** Wander Women — model + a couple of follow-ups from yesterday

---

Hi [Investor first name],

Thanks for the time yesterday — and especially for pushing on
[one specific thing they pushed on, e.g. "the affiliate attribution
gap" or "the AEO/GEO question"]. That's the question that sharpened the
pitch the most this round.

Three follow-ups as promised.

**1. The model.** Editable Google Sheet with year-1 to year-3 funnel,
ARPU stack, and revenue lines: [LINK]

The teal cells are assumptions; everything else recomputes. Two notes:
- The free-tier affiliate row is the largest revenue line in year 1
— most people miss it on first read
- Capture rate is set to 5% for base case; sensitivity table at the
bottom shows what happens at 2% and 10%

**2. The build status.** Single page on what's live vs what's mocked
across 62 routes and 33 tables: [LINK]

Headline: 36 routes are backed by live Supabase, 6 still read mock JSON
(intentional, low-priority). Auth, Beware Board, contributor profiles,
admin moderation, AI-assisted verification — all live. Payments are
not, and that's the first 2 weeks of post-funding work.

**3. The sensitivity grid you asked for.** 3 × 3 table — capture rate
(2%/5%/10%) × email-to-paid conversion (2%/4%/6%): [LINK or attached PDF]

Even at our most pessimistic case (2% × 2%), year-1 ARR is ₹5.9L.
Base case ₹15.7L. The model isn't load-bearing on heroic assumptions.

**One specific commitment from the meeting:** [the thing they asked
for, e.g. "I'll send the legal review RFP and trademark filing checklist
by end of week — both are in the data room now."]

**One ask from me:** [pick one, e.g. "Could you make a 15-minute intro
to [specific person at specific firm]? Their thesis on women-only
platforms would be a useful sanity check." OR "Would it help if I
sent a 60-second Loom of the Beware Board flow before our next call?"]

If a follow-up call would help, here's my calendar: [LINK]
Otherwise, happy to wait until your team has poked at the numbers.

Best,
[Founder name]
[Phone]

---

## Variations

### Variant A — They were leaning yes
End with: *"Happy to walk your partner through the demo whenever they
have 30 minutes — here's my calendar: [LINK]"*

### Variant B — They were skeptical
End with: *"I know the numbers feel optimistic. The grid above is
specifically built so even the bottom-left cell — 2% capture, 2%
conversion — is a real business covered by the round. If that case
isn't believable, I want to know which input you'd weaken further."*

### Variant C — They asked a hard technical question
Add a section: *"On [specific technical question]: [one paragraph
honest answer]. Happy to send the architecture doc / loom / SQL
schema if it would help your diligence."*

### Variant D — They hesitated on the founder profile
Add a section: *"You raised the solo-founder concern. I've started
conversations with [N specific candidates] for the technical
co-founder role; first one is scheduled [date]. Will update with the
shortlist within two weeks."*

## What NOT to put in the email

- "Just checking in" / "Just following up" — wastes their time
- A summary of the meeting they were in — they remember it
- Adjectives ("excited", "thrilled", "grateful") — performative
- Multiple CTAs — pick one
- Attachments over 5MB — link instead
- More than three links — they'll skim past three
- A pitch deck attached again — they have it
- "Looking forward to your decision" — passive; let them decide on
  their own clock
- Your fundraise size or terms — that's a meeting conversation, not
  a written one

## How to make the model link work

1. Upload `funnel-model.csv` to Google Drive
2. Open with Sheets → File → Save as Sheets file
3. Convert the formula cells from text to live formulas (the rightmost
   "formula_in_sheets" column tells you which cells)
4. Format: teal-fill the assumption cells, green-fill the computed
   cells
5. Share → "Anyone with the link" → Commenter (not Editor — Commenter
   lets them suggest, not break)
6. Copy link, paste into email

## After the email

- **48 hours of silence:** Don't follow up. Silence usually means
  partner discussion in progress. Premature follow-up reads as
  desperate.
- **5 days of silence:** Send one short note: *"No pressure on
  timeline — just wanted to flag I'm meeting with [X firm] next
  week and wanted you to have full context first if you'd like to
  move."*
- **10 days of silence:** Assume soft pass. Move on. Most investors
  who want to invest reply within 5 business days. The ones who
  don't are doing the polite-no thing.

## What success looks like

The follow-up email succeeds when:
- They reply within 5 business days
- They forward the model link to their analyst / associate
- They book a follow-up call or partner meeting
- They ask one specific question about a specific cell of the model

Any of those four = your follow-up did its job.
