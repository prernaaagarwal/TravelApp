# Legal review — Request for Proposal

> Send this document to outside counsel. Three firms recommended at the bottom.
> Goal: a 1-page legal opinion + a 5-page risk memo within 21 days, ₹40K–₹80K.

## Who we are

Wander Women is a women-only solo-travel intelligence platform launching in
India. Mock-data demo evolved into a live V1: 33 Postgres tables, ~280 organic
visitors, 8 contributors, ~100 user-submitted incident reports across 22 cities.
Built on Next.js 16, Supabase (Postgres + Auth + Storage), hosted on Vercel.

Pre-revenue. Pre-incorporation (Pvt Ltd registration in process).

## What we need reviewed

Six work-streams. The first three are blocking; the last three are advisory.

### Workstream 1 — Beware Board defamation exposure (BLOCKING)

The Beware Board (`/community/beware/[city]`) is a user-generated feed of
geo-tagged, date-stamped scam and safety incident reports. Reports may name
businesses (auto stands, hostels, restaurants, tour operators) and, rarely,
individuals (drivers, vendors).

**Specific questions:**
1. Under IPC §499/§500 (defamation), what is the platform's exposure for a
   user-submitted report that names a real business or person, where the
   accusation is later proven false?
2. Does our IT Act §79 safe harbor apply? Specifically:
   - Are we compliant with IT (Intermediary Guidelines and Digital Media Ethics
     Code) Rules, 2021?
   - What is our Resident Grievance Officer obligation at our current scale?
   - At what user threshold does the Significant Social Media Intermediary
     classification apply, and what additional obligations follow?
3. What contractual indemnity language do we need in our user submission flow
   to shift defamation liability to the reporter while preserving safe harbor?
4. If a named business issues a takedown notice, what is our minimum compliant
   response time and audit-log requirement?
5. Recommended modification of our 36-hour internal SLA — too tight, too loose,
   or correct?

**Documents we'll provide:**
- Current submission UX screenshots (`/contribute/report`)
- `moderation_audit_log` schema and retention policy
- Draft Terms of Service and Beware Board disclaimer
- 10 representative submitted reports

### Workstream 2 — DPDP Act 2023 compliance (BLOCKING)

We collect government IDs (Aadhaar, passport, driving license) and selfies for
contributor verification, store them in Supabase (data residency: AWS Mumbai
ap-south-1), and process them via Anthropic's Claude API (cross-border to US).

**Specific questions:**
1. Are we a Data Fiduciary under DPDP Act 2023? At what user threshold do we
   become a Significant Data Fiduciary?
2. Is our consent flow at `/account/verify` legally sufficient for:
   - ID upload
   - Selfie upload
   - Cross-border transfer to Anthropic for image analysis
3. What is the minimum consent revocation flow we must build?
4. What retention period is permissible for verified ID after a user deletes
   their account?
5. Are children (under-18) at risk of using the platform, and if so, what
   age-gating is legally required?
6. What are our Data Protection Officer obligations at current scale?

**Documents we'll provide:**
- Verification flow walkthrough
- `user_verifications` table schema
- Anthropic API data-processing terms
- Draft Privacy Policy

### Workstream 3 — Women-only platform legal posture (BLOCKING)

We restrict full platform participation to people who self-identify as women,
verified through ID + selfie + human review. We do not perform automated
gender classification.

**Specific questions:**
1. Under Article 15(3) of the Constitution and the Indian Penal Code, what is
   our legal posture for a women-only platform? Is this analogous to
   Sheroes / Bumble Women / Eves24?
2. What is our exposure if a man, self-identifying as a woman, is denied
   access by our human reviewer?
3. What is our exposure for trans women — what does inclusive policy look
   like that is also legally defensible?
4. Recommended Terms of Service language for the women-only restriction.
5. Any recent case law (2023–2026) on women-only digital platforms in India?

### Workstream 4 — Contributor compensation & contractor classification (advisory)

We pay contributors ₹2,000 per published intel card and a per-message fee for
Q&A responses, scaling to ~₹50,000/month for top contributors.

**Specific questions:**
1. Are contributors independent contractors or deemed employees under
   recent gig-economy jurisprudence (Code on Social Security 2020)?
2. What is the minimum contractual structure — written agreement, IP
   assignment, indemnity?
3. TDS / GST obligations on contributor payouts at various scales.
4. Implication of paying foreign-resident contributors (FEMA compliance)?

### Workstream 5 — Affiliate, payments, and consumer protection (advisory)

We embed affiliate links to Booking.com, Amazon, Airalo, World Nomads.
Membership pricing displayed as ₹499/₹999/year. Stripe/Razorpay integration
post-funding.

**Specific questions:**
1. Affiliate disclosure obligations under Consumer Protection (E-Commerce)
   Rules 2020 — what disclosure language do we need on every affiliate page?
2. Membership refund policy enforceability — are we exposed under CPA 2019
   for any reason?
3. What are the GST implications of digital subscription sales at our scale?
4. Cross-border payment compliance for foreign members (mostly Sara persona).

### Workstream 6 — IP and AI-generated code (advisory)

The codebase was authored substantially with Anthropic Claude assistance.

**Specific questions:**
1. Under Indian Copyright Act, who owns AI-generated code? Same as the US
   position (output assigned to user under Anthropic ToS)?
2. Recommended internal IP register / code-origin policy.
3. Licensee / OSV scan report review — are we clean for OSS contamination?

## Deliverables

1. A **1-page legal opinion** on Workstreams 1–3 (BLOCKING items): are we
   safe to launch publicly, with what specific changes?
2. A **5-page risk memo** covering all 6 workstreams with prioritized
   remediation list, marked H/M/L.
3. **Drafts** (or red-line edits) of:
   - Terms of Service
   - Privacy Policy
   - Beware Board User Submission Agreement
   - Contributor Agreement
   - Resident Grievance Officer page text
   - Cookie / consent banner copy
4. **One 60-minute call** with the founder to walk through the memo.

## Engagement parameters

- **Budget:** ₹40K–₹80K all-in. We'll consider higher for white-glove drafting.
- **Timeline:** kickoff this week, deliverables within 21 calendar days.
- **Format:** flat fee preferred. No retainer.
- **Confidentiality:** mutual NDA; we provide read access to a private GitHub
  repo and a Notion data room.
- **Follow-up:** option for ongoing ₹X/quarter advisory engagement post-launch.

## Recommended counsel (research-grade picks; verify yourself)

1. **Spice Route Legal** — strong on tech / startup / IT Act / DPDP. Their
   founder Praveen Raju has written on intermediary liability.
2. **Ikigai Law** — privacy + tech-policy specialists. Heavy on DPDP.
3. **NDA Law** (Nishith Desai Associates) — premium, expensive, but they wrote
   the textbook on Indian internet law. Use them if budget allows.

## What we'll send on engagement

A single Notion data room with:
- Product walkthrough (Loom, 12 min)
- Architecture diagram
- All draft policies (current state)
- 30 representative submitted reports
- `moderation_audit_log` sample (anonymized)
- Verification flow walkthrough
- Founder interview (10 min Loom)

## What we explicitly do NOT need (yet)

- Litigation strategy
- Trademark filing (separate workstream — see `trademark-filing-checklist.md`)
- Investment documents (separate counsel for SAFE / SHA)
- Tax structuring beyond the contributor question

## Founder contact

[Name], [email], [phone]. Available for kickoff call within 48h of engagement.
