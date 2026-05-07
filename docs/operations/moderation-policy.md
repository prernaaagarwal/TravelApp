# Moderation policy — one-page internal doc

> Audience: founder, current and future moderators, outside counsel,
> investors who ask "show me your moderation policy."
> Length: one page. Read in 4 minutes. Train a new moderator in 30.
> Last updated: 7 May 2026 · v1.0

## What gets moderated and where

Three queues, three tables, three SLAs.

| Queue | Source | Where | SLA | Decision codes |
|---|---|---|---|---|
| **Beware reports** | User submissions to `/contribute/report` | `beware_reports` | 36 hours | approve / reject / request edit |
| **User verifications** | `/account/verify` flow | `user_verifications` | 72 hours | approve / reject (with reason) |
| **Community + buddy reports** | Community/buddy "Report" action | `beware_report_flags`, `buddy_profile_reports`, `user_reports`, `community_post_reports` | 24 hours | dismiss / warn / suspend / ban |

Every decision writes a row to `moderation_audit_log` with actor, target, action, optional reason. Retained for 180 days minimum per IT Rules 2021.

---

## Beware report decision tree

A Beware report goes through this in order. Stop at the first match.

### Auto-reject (do not publish)

- ❌ Names a private individual without specific factual context (e.g. "Rajesh from Goa is creepy" with no incident)
- ❌ Pure opinion, no specific incident ("Goa beaches are unsafe" without dates/locations)
- ❌ Defamatory framing without supporting detail
- ❌ Submitted by an unverified user (require completed `/account/verify`)
- ❌ Hate speech, slurs, or coded harassment
- ❌ Potential commercial retaliation (reporter has clear conflict with named business)
- ❌ Duplicate of an already-published report within 30 days for same location

### Request edit (return to user)

- 🔄 Specific incident but missing date or location
- 🔄 Names a business but accusation lacks corroboration
- 🔄 Includes a person's full name when first name + role would suffice
- 🔄 Photo is identifying of bystanders (face-blur required)

### Approve (publish)

- ✅ Date, location, and incident clear
- ✅ Names a business or location (not a private individual) with sufficient detail
- ✅ Reporter is verified
- ✅ No duplicate within 30 days
- ✅ Photo (if any) is non-identifying or properly blurred

### Severity tagging on approval

Use the existing `severity` column:
- **critical** — physical safety incident (assault, attempted assault, robbery)
- **high** — financial fraud, stalking, aggressive harassment
- **medium** — pricing scam, tout aggression, inconsistent service
- **low** — minor annoyance, recurring nuisance worth flagging

If unsure, default to medium.

---

## User-verification decision tree

### Approve

- ✅ Photo clearly shows person holding government ID
- ✅ Face on selfie matches face on ID (qualitative — same person)
- ✅ ID is government-issued (Aadhaar, passport, driving license)
- ✅ ID details (name, photo) are legible
- ✅ Person presents as a woman (we self-identify; visual review is a sanity check, not a gating mechanism — see "trans-inclusive" below)

### Reject (with reason — the user receives this)

- ❌ Photo is blurry or ID details unreadable
  - reason: "Please re-upload — ID details aren't clear in the photo."
- ❌ Photo doesn't show ID + face together (e.g. ID alone, selfie alone)
  - reason: "Please re-upload showing both your face and your ID in one photo."
- ❌ ID is expired
  - reason: "Please re-upload with a current government ID."
- ❌ ID is not government-issued (e.g. college ID, club card)
  - reason: "We need a government-issued ID — Aadhaar, passport, or driving license."
- ❌ Face on selfie doesn't appear to be the same person as the ID
  - reason: "We couldn't verify the photo matches the ID. Please try again with a clearer selfie."
- ❌ Suspected fake or doctored
  - reason: Internal note only; user gets a generic "We weren't able to verify."

### Trans-inclusive policy

We do not reject a verification on gender presentation. If the ID
shows a gender marker different from the user's self-identification:
- Approve if all other criteria met
- Note in `moderation_audit_log` for awareness, not as a flag
- Do not contact the user about the mismatch — that is invasive

The platform is women-only by self-identification under our community
terms. The verification step confirms identity, not gender.

### Photo deletion is mandatory on approve

Code already deletes the photo on approval (`storage.from("id-verification").remove(...)`). If for any reason this fails, manually delete via Supabase Storage UI. No exceptions.

---

## Community + buddy report decision tree

For posts/replies/buddy-profile reports.

### Dismiss
- Disagreement, not violation
- Off-topic but not harmful
- Reporter has a clear conflict and report is retaliatory

### Warn (private DM via email; one strike on profile)
- Mild violation: incivility, off-topic, link spam
- First offense from an otherwise-active user

### Suspend (24h–7d)
- Repeated incivility after a warn
- Posting personal information of another user
- Promotional content disguised as advice
- Manipulating the verification system

### Ban (permanent, with profile data purge)
- Hate speech, threats, harassment campaigns
- Doxxing
- Predatory behavior toward other women
- Confirmed fake verification
- Banned account attempting to re-create

Banned users get a single email explaining the decision. We do not engage in extended back-and-forth.

---

## Conflict of interest rules

### When a moderator must recuse

- Report is about the moderator personally
- Report is about a business the moderator owns or has a stake in
- Report is about the moderator's employer or family member
- Moderator has had a public dispute with the reporter or the reported

Flag to founder; another moderator handles. If the founder is the only moderator, the founder recuses by deferring the decision 7 days and consulting a peer founder.

### When the founder must recuse

Same rules apply to the founder. In a single-founder period, the founder may consult an outside reviewer (lawyer, mentor, peer founder) for any case where they have a personal stake.

---

## Escalation matrix

| Type | Escalate to |
|---|---|
| Police request / legal notice | Founder + outside counsel within 24 hours |
| Threat of self-harm by reporter | Founder + iCall (9152987821) referral, immediately |
| Active threat to a user named in a Beware report | Founder + local police consultation, within 12 hours |
| Press inquiry about a Beware report | Founder only, within 24 hours |
| User claims defamation by published report | Founder + outside counsel; 36-hour takedown SLA per IT Rules 2021 |
| Suspected coordinated brigading or fake reports | Founder; suspend affected pipeline pending review |

---

## Data hygiene rules

- Never copy-paste user names, photos, or ID details into Slack, email, or any system outside Supabase + admin UI
- Screenshots of ID photos are forbidden
- Do not discuss specific user cases in any chat tool — admin UI only
- All decisions go through the admin UI, which writes to `moderation_audit_log`. No "I just approved this" off-the-record actions
- Quarterly: rotate moderator credentials, review audit log for anomalies

---

## Quality assurance

- **20% sample** of all approvals reviewed by a second moderator weekly (when 2+ moderators exist; until then, founder self-reviews 20% one week later — fresh eyes)
- **All rejections** with the same reason >5 times/month: review whether the rejection criteria need updating
- **Moderator agreement rate** (when 2+ moderators): target ≥85% on independent review of the same case. Below 80% means policy needs sharpening
- **Quarterly metrics review**: false-acceptance rate (FAR), false-rejection rate (FRR), throughput, queue depth, average decision time

---

## Public-facing transparency

What we publish (post-V1):

- Aggregate decision counts per quarter (approved / rejected / pending)
- Average decision time
- Number of takedown requests received and resolved within SLA
- Number of users banned

What we do NOT publish:

- Individual decisions (privacy)
- Moderator identities (safety)
- Reasoning for specific bans (privacy + legal exposure)

The transparency report goes at `/transparency` (not yet built — V1.5
deliverable). Until then, this document is the policy of record.

---

## Training a new moderator

30-minute onboarding:

1. Read this document end-to-end (10 min)
2. Read `docs/legal/trust-and-verification.md` (3 min)
3. Read `/methodology` (5 min)
4. Walk through 3 example cases with founder (10 min)
5. Shadow first 5 decisions; founder reviews each before publish (2 min/case)
6. After 5 shadowed decisions: solo, with 100% second-review for first 20 cases
7. After 20 cases: regular 20% sample QA

---

## Updating this policy

This document is canonical. Update it whenever:

- A new edge case shows up that wasn't covered (add to the relevant decision tree)
- A legal requirement changes (e.g. IT Rules amendment)
- A new queue is added (e.g. video reports if we ever support them)
- An incident reveals a gap

Each update gets a dated changelog entry below.

### Changelog
- **2026-05-07** — v1.0. Initial policy doc.

---

## What to send when an investor asks "what's your moderation policy?"

This document. URL or PDF. Question is closed in 4 minutes.
