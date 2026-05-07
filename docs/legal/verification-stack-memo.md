# Verification stack & cost trigger memo

> Audience: investor data rooms, lead engineers, the founder.
> Length: 1 page. Read once, cite forever.
> Last updated: 7 May 2026.

## What we do today (≤ 50 verifications / week)

**Stack:**

| Step | Tool | Cost |
|---|---|---|
| Phone OTP | Supabase Auth (built-in SMS) | ~₹0.40 / SMS |
| Photo upload | Supabase Storage (bucket: `id-verification`) | included in plan |
| Storage encryption | Supabase / Postgres at-rest | included |
| Human review | Founder + 1 moderator, ~3 min/review | ~₹50 / review (founder time at ₹1K/hr) |
| Approval action | Custom server action | included |
| Photo deletion on approval | Supabase Storage `.remove()` | included |
| Audit log | Postgres `moderation_audit_log` | included |
| Email notification | Resend | ~₹0.10 / email |

**Total marginal cost per verification: ~₹50** (almost entirely human time).

**Why this works at our scale:**
- < 50 verifications / week → ~150 min of moderator time / week → manageable solo
- Human review is more accurate than automated at small N
- Zero vendor risk, no API quota concerns
- Privacy-forward: photo is deleted on approval, only boolean retained

**Why this stops working at 500 / week:**
- 500 × 3 min = 25 hours / week of moderation → full-time hire required
- Single point of failure (one human reviewer)
- Inconsistent decisions across multiple reviewers without policy doc
- No defense against sophisticated forgery (printed photos, AI-generated IDs)

---

## Trigger 1: at 500 verifications / week (estimated month 5–8 post-launch)

**What changes:** add a regulated KYC provider as a pre-filter. Human
review remains the final decision-maker.

**Stack additions:**

| Step | Tool | Estimated cost |
|---|---|---|
| Document authentication | HyperVerge OR IDfy OR Signzy | ₹15–25 / verification |
| Liveness detection | Same provider (passive liveness on selfie) | included |
| Face match (1:1 selfie ↔ ID) | Same provider | included |
| Anti-spoof (printed photo, screen replay) | Same provider | included |

**Vendor candidates** (with rough quotes — get real numbers via the
RFQ at `docs/legal/kyc-vendor-rfq.md`):

| Vendor | Strengths | Indicative ₹/verification |
|---|---|---|
| **HyperVerge** | Strong on Aadhaar/PAN; Indian-headquartered; trusted by Bajaj, IDFC | ₹15–25 |
| **IDfy** | Comprehensive KYC suite; used by Razorpay, Cred | ₹18–30 |
| **Signzy** | Aadhaar offline KYC specialist; lower volume tier | ₹12–20 |
| **Persona (US)** | Global reach; useful when foreign contributors join | $0.50–$2 (₹40–170) |
| **Jumio (US)** | Premium; for Tier-1 enterprise | $2–$5 (₹170–425) |

**Recommended:** HyperVerge or IDfy. Both are India-resident
(DPDP-friendly), both integrate via simple REST API, both are used by
fintech at our scale.

**New per-verification cost at this tier:**
- KYC provider: ₹20 (midpoint)
- Human review (now 1 min instead of 3, since automation pre-filters): ~₹17
- Other costs: ~₹1
- **Total: ~₹38 / verification**

That's *cheaper* than today, even with the added vendor. Because human
review time drops from 3 min to ~1 min.

**Operational changes at this trigger:**
- Hire 1 dedicated trust-and-safety operator (~₹6L/year salary in India)
- Document the moderation policy (one-pager covering "approve / reject /
  escalate" criteria)
- Sample 20% of approvals for QA
- Add automated weekly metrics: false-acceptance rate (FAR), false-
  rejection rate (FRR), reviewer agreement, throughput

**Engineering effort to integrate:**
- 2–3 weeks for one engineer to wire HyperVerge / IDfy into
  `submitIdSelfie` action and add a new automated-decision step before
  human review
- Migration: add `automated_decision`, `automated_score`,
  `automated_reasons` columns to `user_verifications`
- Updated admin UI showing the automated result alongside the photo

---

## Trigger 2: at 5,000 verifications / week (estimated year 2–3)

**What changes:** automated decisions for high-confidence cases, human
review only for ambiguous cases. We become a Data Fiduciary under DPDP
Act and likely a Significant Data Fiduciary depending on user count.

**Stack additions:**

| Step | Tool | Estimated cost |
|---|---|---|
| Auto-approve threshold | Internal rule on KYC provider score | included |
| Human-in-loop only for ambiguous | Existing flow, ~10% of total | as before |
| DPO appointment | Internal hire OR fractional DPO firm | ₹3–8L / year |
| Annual security audit | CERT-IN empanelled auditor | ₹3–5L / year |
| SOC 2 Type II preparation | Internal + audit firm | ₹15–30L total |
| Privacy & ToS quarterly review | Outside counsel retainer | ₹2–4L / year |
| Bug bounty program | HackerOne or BugCrowd | ₹5L / year + payouts |

**Per-verification cost at this tier:**
- KYC provider (volume discount): ₹12–18 / verification
- Human review (only 10% of cases, 1 min each): ~₹2 amortized
- Compliance amortized across volume: ~₹3
- **Total: ~₹18 / verification**

**Operational shape:**
- 3-person trust-and-safety team (lead + 2 ops)
- Published transparency report (quarterly)
- Public Trust Center page describing every control
- Designated DPO with public contact details
- Sub-24-hour SLA on all takedown / grievance requests

**Engineering effort:**
- ~1 quarter to build the auto-approve rule engine
- Continuous tuning of the FAR/FRR threshold
- Integration with subsequent products (each time a new product asks for
  identity, it should reuse this stack, not rebuild)

---

## Cost summary (the slide investors want)

| Stage | Verifications / week | ₹/verification | Vendors | Engineering |
|---|---|---|---|---|
| **Today** | ≤ 50 | ~₹50 | Supabase only | shipped |
| **Trigger 1** | 500 | ~₹38 | + HyperVerge/IDfy | 2–3 weeks |
| **Trigger 2** | 5,000 | ~₹18 | + DPO + auditors | ~1 quarter |

**Per-verification cost goes DOWN as volume goes up.** That's the unit
economics story for an investor: this is a fixed-cost-heavy capability
that becomes cheaper per unit at scale, not the other way around.

## What we are NOT doing

Honest absence list — these are off the roadmap, not just deferred:

- **Active liveness** (asking user to blink, turn head, etc.) —
  unnecessary friction at our trust signal density. Passive liveness from
  the KYC provider is enough.
- **Gender verification by ML** — illegal, unethical, unreliable. We
  rely on self-identification + ToS + community trust.
- **Continuous identity re-verification** — we verify once at onboarding;
  re-verify only on flag from the moderation queue.
- **Cross-platform identity sharing** (e.g. integrating with Bumble's
  verification) — privacy risk too high.
- **Self-hosted ML models** — we are not an ML company. Using a
  regulated provider is the right move.

## Quarterly review

This memo gets re-evaluated every quarter. Specifically:

1. Has the verification volume crossed a trigger?
2. Has a vendor's pricing materially changed?
3. Has any DPDP / IT Rules update changed our compliance obligations?
4. Has any provider had a major outage or security incident?

If yes to any — re-write this doc and re-circulate.

## What to send when an investor asks "what's your verification stack?"

1. This memo (1-page, scannable)
2. The Trust & Verification paragraph (`docs/legal/trust-and-verification.md`)
3. The methodology page URL (`/methodology` → "Contributor verification" section)

Three documents, all internally consistent, all matching the code. The
question is closed in 4 minutes instead of 40.

---

## Open items the founder needs to close

- [ ] Send RFQ to HyperVerge, IDfy, Signzy (template at `docs/legal/kyc-vendor-rfq.md`)
- [ ] Get at least 2 vendor quotes on letterhead → replace estimated
      ₹15–25 in this memo with verified numbers
- [ ] Confirm DPDP Significant Data Fiduciary threshold with outside
      counsel (legal-review-rfp.md, Workstream 2 question 1)
- [ ] Decide trigger-1 month based on actual signup velocity, not
      estimated (re-check at 100, 300, 500 verifications)
- [ ] Document the moderation policy as a one-page internal doc
      (currently informal)
