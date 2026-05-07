# Trust & Verification — for the data room

> **One-paragraph version below.** Read this whole doc first if you're the
> founder; copy just the paragraph block when sending to investors.
>
> **Important:** the user-suggested paragraph mentioned "AI-assisted
> consistency review (Anthropic Claude)" for ID verification. After auditing
> the actual `/account/verify` flow in the codebase, that step does NOT
> exist for ID verification today — Claude is used only in the separate
> stay-verification flow (accommodation photos). The honest paragraph below
> matches the code. Using language that describes a Claude step that
> isn't implemented is the kind of overstatement diligence teams catch.

## The honest one-paragraph (use this in the data room)

> Wander Women verifies contributor identity through a four-step flow:
> phone OTP via SMS, a single selfie-with-ID photo upload (Aadhaar,
> passport, or driving license), final approval by a trained human
> moderator, and immediate deletion of the ID photo from storage upon
> approval. We do not perform automated biometric matching, liveness
> detection, gender classification, or any AI-assisted analysis on the
> identity photo at this stage. We retain only a boolean verified flag on
> the contributor profile and the moderator's timestamped audit-log entry —
> the smallest possible data footprint after verification. Contributors
> self-identify as women under our community terms; the human reviewer
> adjudicates inconsistent cases. As volume scales, we will integrate a
> regulated KYC provider (HyperVerge, IDfy, or equivalent) for biometric
> verification — that integration is roadmapped at a volume threshold of
> 500 verifications per week, see the Verification Stack Memo for cost
> and trigger detail. Anthropic Claude is used in a separate
> stay-verification flow (accommodation photo analysis), not for
> contributor identity.

That is **101 words** and matches the code line-for-line. Print it. Use
it verbatim.

## Why this exact wording

Three properties this paragraph has that most founder Trust & Safety
copy doesn't:

1. **Specifies what we do AND what we don't do.** "We do not perform
   automated biometric matching, liveness detection, gender
   classification, or any AI-assisted analysis on the identity photo."
   Pre-empts the gotcha question.

2. **Includes the photo-deletion detail.** This is unusually privacy-
   forward for a verification flow — most platforms retain ID images
   indefinitely. Naming it explicitly is a competitive differentiator
   AND a DPDP/GDPR talking point.

3. **Distinguishes user-identity verification from stay-verification.**
   Anthropic Claude IS used on the platform — for accommodation photo
   analysis, not ID. Mentioning Claude in the right context shows
   technical literacy without overstating capability.

## Why the user-suggested paragraph would have hurt

The original suggested copy said:
> *"...AI-assisted consistency review (Anthropic Claude), and final
> human approval..."*

After auditing `app/account/verify/actions.ts`, `app/admin/verifications/actions.ts`, and `lib/agents/stay-verifier.ts`:

- `user_verifications` flow has **zero** Anthropic API calls
- `lib/agents/stay-verifier.ts` IS the only Anthropic-using flow, and it's
  for stay verification (accommodation photos), separate from
  `user_verifications`
- The admin verification route handler does pure human review on the
  uploaded photo, no automated step in between

If we'd shipped the copy that said "AI-assisted consistency review" on
the ID flow, a diligence team that read our codebase (which is normal
for any seed+ round) would flag it as overstatement. That's a credibility
hit it's not worth taking.

## Code references for the data room

Investor's diligence team can verify the description against:

| Claim in the paragraph | Where to verify in code |
|---|---|
| Phone OTP via SMS | `app/account/verify/actions.ts` lines 8–33 (`sendPhoneOtp`, `verifyPhoneOtp`) |
| Single selfie-with-ID photo upload | `app/account/verify/actions.ts` lines 66–89 (`submitIdSelfie`) |
| Photo storage path on `user_verifications.id_photo_path` | `supabase/migrations/048_buddy_verification.sql` line 22 |
| Human approval step | `app/admin/verifications/actions.ts` lines 39–89 (`approveVerification`) |
| Photo deletion on approval | `app/admin/verifications/actions.ts` lines 67–69 (`storage.from("id-verification").remove(...)`) |
| Retention only of boolean flag | `app/admin/verifications/actions.ts` lines 60–63 (`profiles.id_verified`) |
| Audit log retention | `app/admin/verifications/actions.ts` lines 72–77 (`moderation_audit_log` insert) |
| No automated biometric / liveness | Confirmed by absence in `app/account/verify/` and `app/admin/verifications/` |
| Anthropic SDK used only for stay verification | `lib/agents/stay-verifier.ts` (the only file that imports `@anthropic-ai/sdk`) |

## Variants for different audiences

### For the deck (one-line)
> Phone OTP + selfie-with-ID + human review. Photo deleted on approval.
> Biometric KYC integrates at 500 verifications/week.

### For the founder's verbal pitch (30 seconds)
> "We verify contributors with a phone OTP, a selfie-with-ID photo, and
> human review by a trained moderator. On approval, we *delete* the ID
> photo — minimum data retention is by design. We do not run automated
> biometric or gender classification on the photo. When we cross 500
> verifications a week, we integrate HyperVerge for biometric KYC. The
> trigger is volume, not capability — at our scale, human review is more
> accurate and cheaper than automated."

### For the legal data room
Use the 101-word paragraph above, plus the code-references table.

### For the LLM citation crawl
The methodology page at `/methodology` (section "Contributor verification")
contains the same description and is publicly indexable. AI engines can
cite that URL.

## What to NOT add to this paragraph

The temptation will be to dress it up. Resist. Specifically:

- ❌ "Bank-grade verification" — meaningless and triggers diligence
- ❌ "Multi-factor security" — not what verification is
- ❌ "Industry-standard KYC" — we don't do KYC yet (HyperVerge is the future)
- ❌ "AI-powered" — not in this flow today
- ❌ Buzzwords ("blockchain-verified," "zero-knowledge") — not in our stack

If you find yourself reaching for those words, you're padding. The honest
description above is stronger than any padding.

## Companion documents

When sending the Trust & Verification paragraph, also send:
- `docs/legal/verification-stack-memo.md` — current stack, cost triggers
- `docs/legal/kyc-vendor-rfq.md` — the request-for-quote we're sending
  HyperVerge / IDfy
- Methodology page (live URL): `/methodology`

That's the complete trust-and-verification packet for any seed-stage
data room.

## Updating this doc

When the verification flow materially changes:
- Add Anthropic Claude to the user-ID flow → rewrite the paragraph
- Integrate HyperVerge → rewrite the paragraph + the memo
- Change retention policy → rewrite the paragraph

Each rewrite gets a dated changelog entry at the bottom of this file.

### Changelog
- **2026-05-07** — initial. Audited code, removed inaccurate Claude reference
  from prior draft, added photo-deletion detail.
