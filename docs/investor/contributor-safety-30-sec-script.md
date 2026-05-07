# Contributor safety — 30-second pitch script

> When you only get one shot at the answer. Memorize this.

---

## The 30-second answer

Investor: *"How do you protect your women contributors?"*

> **"Four contracts, all public, all on `/safety/contributor-safety`.**
>
> **One: every contributor picks one of four identity tiers — full name,
> first-name-and-city, handle, or anonymous — editable any time, propagates
> in 60 seconds.**
>
> **Two: 4-hour takedown SLA, 24/7, monitored. We publish the median and
> 95th-percentile takedown time in our quarterly community update.**
>
> **Three: documented escalation to NCW 1091, POSH, POCSO, and IT Rules
> 2021 — we don't keep abuse cases inside our system.**
>
> **Four: 3-tier moderation roster so the SLA is real even when I'm asleep.
> Tier 2 backup moderator under retainer, rotated quarterly.**
>
> **The promise on a public URL is the moat — anyone can copy the
> features, but our SLA is something we can be held to."**

---

## The 10-second compressed version

When the investor is moving fast or you're in a hallway:

> *"Four public promises on /safety/contributor-safety. Identity tiers,
> 4-hour takedown SLA, escalation to NCW and POSH, and a 3-tier roster
> so the SLA holds at 3 AM. The URL is the moat."*

---

## The follow-up they'll ask

### "What if you're personally unreachable?"

> *"3-tier roster. Tier 2 is a paid backup moderator under quarterly
> contract. Tier 3 is a trusted advisor with admin access for catastrophic
> cases. The runbook is reviewed monthly and tested with synthetic 02:00 IST
> drills."*

### "What if a contributor is being doxxed right now?"

> *"Email grievance@ — acknowledged in 4 hours, content hidden the same
> 4 hours. We provide a written incident summary suitable for filing
> with NCW or local cybercrime cell. We don't replace the police; we
> route to them and assist."*

### "How is this different from what every platform claims?"

> *"Three things. One, the SLA is published — a missed SLA is a public
> promise broken, not an internal metric we hide. Two, we publish actual
> takedown numbers each quarter. Three, the 4 tiers of identity are
> enforced by an ESLint rule in the codebase — bypassing them fails CI
> and blocks the merge. Privacy by construction, not by good intent."*

### "Are you actually in conversation with NCW?"

> *Honest answer based on whether you've actually called: either*
>
> **"Yes — 15-minute intro call on [DATE]. We're aligning on what kind
> of cases we route to them and what they refer to us."**
>
> *or*
>
> **"Not yet — we're routing escalations to the 1091 helpline (which is
> their public-facing channel), but I haven't done a direct intro call
> with the Commissioner's office yet. That's on my Q2 outreach list."**

---

## Don't say these things

- ❌ "We're building [feature X]" — only commit to what's shipped or
  publicly documented as a contract.
- ❌ "Our community is self-policing" — investors hear this as "we have
  no plan."
- ❌ "We use AI to detect [Y]" — unless it's a real production model with
  measurable precision/recall, it's a red flag.
- ❌ Any number that isn't measured. (See `modeled-vs-measured.md`.)

---

## How to practice

Read the 30-second answer out loud once a day for a week before any
investor meeting. Time yourself — if you can't say it in under 35
seconds, cut a clause. The fewer words, the more credible the commitment
sounds.
