# KYC vendor RFQ — request for quote template

> Send this to HyperVerge, IDfy, Signzy, and Persona. Cost: ₹0. Time: 30
> minutes per vendor. Outcome: a real ₹/verification number on letterhead
> that you cite in the next investor meeting instead of "industry
> benchmark."

## Why send this now (pre-funding)

You don't need to commit. You need a **written quote** so you can:
1. Replace estimates in `verification-stack-memo.md` with real numbers
2. Tell investors "HyperVerge quoted us ₹X in writing" — anchors credibility
3. Have a vendor relationship started before the round closes (faster
   integration day-1)
4. Use one quote against another to negotiate when you do commit

Vendors quote pre-funding companies regularly. Don't be shy about asking.

## How to send (tactical)

- **Channel:** LinkedIn → sales contact at the vendor; or `sales@<vendor>.com`
- **Subject line:** "RFQ — Aadhaar/PAN KYC for women-only travel platform
  (~5,000 verifications / month at peak)"
- **Format:** paste the body below as a plain email. Do not attach. Sales
  reps respond faster to plain text than to PDFs.
- **Volume to quote at:** 500 / month (today's projection) AND 5,000 /
  month (year-2 projection). Get tiered pricing.
- **Follow up after:** if no response in 5 business days, follow up once.
  If still nothing, move on. Reps who don't respond pre-funding don't
  improve post-funding.

## The email body — copy/paste, fill bracketed bits

---

**Subject:** RFQ — Aadhaar/PAN KYC for women-only travel platform (volume
~5,000/mo at peak)

Hi [Sales rep first name],

I'm the founder of Wander Women — a women-only solo-travel intelligence
platform launching in India this quarter. We verify contributor identity
via government ID + selfie before a contributor is allowed to publish.

Today we run the verification step manually with human review only.
We're scoping the integration of a regulated KYC provider for the
volume-trigger that hits at month 5–8 post-launch. I'd appreciate a
written quote covering the use cases below.

## Use cases we need

1. **Document authentication**
   - Aadhaar (offline e-KYC OR XML-based) — required
   - PAN — required
   - Passport (India + foreign) — required
   - Driving license — nice-to-have
2. **Liveness detection** (passive — no active prompts; we don't want to
   ask users to blink/turn head)
3. **Face match (1:1)** — selfie ↔ ID photo
4. **Anti-spoof** — printed photo, screen replay, video replay
5. **Webhook delivery** of decision + score to our backend

## Volume projections

- Today: ~50 verifications / week
- Month 5–8 (target trigger): 500 / week → ~2,000 / month
- Year 2 target: 5,000 / week → ~20,000 / month
- Year 3 stretch: 25,000 / week

Please quote tiered pricing for each volume band.

## Compliance + technical questions

Please confirm:

1. **Data residency** — is processing fully India-resident? AWS Mumbai
   or equivalent?
2. **DPDP Act 2023** — do you sign a Data Processing Agreement that
   meets DPDP Data Processor obligations?
3. **CERT-IN empanelled auditor** — yes/no, latest audit date.
4. **API integration** — REST + webhook. SDKs available for Node.js?
5. **Sandbox access** — can we test with synthetic data before contract?
6. **SLA** — uptime guarantee, response time guarantee.
7. **Aadhaar offline e-KYC** — UIDAI authorization status.
8. **Failure mode** — what's the API behavior if your service goes
   down? Graceful degradation?

## Pricing transparency

Please specify in the quote:
- Per-verification cost at each volume band
- Setup fee (one-time, if any)
- Minimum monthly commitment (yes/no)
- Annual contract vs pay-as-you-go pricing
- Any add-on fees (e.g. for webhook delivery, storage of past results)
- Currency: INR preferred for India-resident provider; USD acceptable
  for global

## Response format

A 2–4 page proposal is fine. Or a one-page pricing sheet + a one-page
compliance attestation. Whichever is your standard format.

## Timeline

We are not committing this quarter. We're collecting quotes from 3–4
providers in parallel for our investor data room. We expect to commit
to one provider within 6 months of receiving funding.

## About us (so you can size the deal)

- Founded: 2026
- Stage: pre-seed, raising
- Team: solo founder, hiring technical co-founder this quarter
- Tech stack: Next.js 16 + Supabase + Vercel
- Live URL: [https://wanderwomen.in or staging URL]
- Test account: I can provide credentials to your sandbox if helpful

Looking forward to your quote. Happy to take a 30-minute call to
walk through the use cases.

Best,
[Founder name]
[Phone]
[Email]
[Website]

---

## After receiving quotes

### What to do with them

1. **Save** each quote in `docs/legal/kyc-quotes/<vendor>-<date>.pdf` in
   the data room
2. **Update** `docs/legal/verification-stack-memo.md` — replace the
   ₹15–25 estimate range with the real numbers
3. **Add** a single comparison row to that memo:

```
| Vendor | Per-verification @ 2K/mo | Per-verification @ 20K/mo | Setup | Min commit |
|---|---|---|---|---|
| HyperVerge | ₹X | ₹Y | ₹Z | ₹A/mo |
| IDfy       | ₹X | ₹Y | ₹Z | ₹A/mo |
| Signzy     | ₹X | ₹Y | ₹Z | ₹A/mo |
```

4. **Cite in the pitch.** The line becomes:

> *"We have written quotes from HyperVerge, IDfy, and Signzy. Per-
> verification cost is ₹X at our 2,000/month projected volume, dropping
> to ₹Y at 20,000/month. Integration is a 2-3 week build. Trigger is
> volume, not capability."*

That's a measurably stronger pitch than "we'll integrate KYC
eventually."

## Common vendor objections (and your responses)

### "We don't quote pre-funded companies"
- Response: *"Understandable. We're collecting indicative pricing for
  our investor data room — even a tiered range would help. We expect
  to be in market with a real contract within 6 months."*
- Most vendors quote anyway.

### "Our minimum monthly commit is ₹50K"
- Response: *"Accepted for year 2 volumes. Could we structure year 1 as
  pay-as-you-go up to that floor and convert to commit when we cross it?"*
- Most vendors will agree.

### "Sandbox access requires an MSA"
- Response: *"Happy to sign a mutual NDA for sandbox testing. Full MSA
  on commit. Can we do a 30-day NDA-only sandbox?"*
- This is the standard ask.

### "Send us your incorporation docs first"
- Response (if pre-incorporation): *"We're incorporating this quarter.
  Could you scope the technical fit on our staging URL while we
  finalize the entity?"*
- Reasonable; some vendors will agree, some won't. Move on if they
  won't.

## Backup vendors (if the top 4 don't respond)

In rough preference order:
- HyperVerge
- IDfy
- Signzy
- Persona (US, useful if foreign contributors join)
- Jumio (premium tier)
- Onfido (UK, premium)
- Hyperface
- DigiLocker-direct (DIY — not a vendor, but worth knowing the option
  exists; Aadhaar offline KYC via UIDAI)

## Time budget

| Step | Time |
|---|---|
| Customize email per vendor | 5 min × 4 vendors = 20 min |
| Send via LinkedIn / email | 10 min |
| Read replies, follow up | 30 min over 2 weeks |
| Save quotes to data room | 10 min |
| Update verification-stack-memo | 10 min |
| **Total founder time** | **~80 min over 2 weeks** |

Cost: ₹0. Outcome: a number-on-letterhead in your data room. Worth
every minute.

## Action this week

- [ ] Tuesday: Send to HyperVerge + IDfy
- [ ] Wednesday: Send to Signzy + Persona
- [ ] Following Tuesday: Follow up with non-responders
- [ ] Two weeks later: Save quotes, update memo
- [ ] Tell next investor: "We have N quotes from KYC providers in
      writing. Per-verification cost at our projected volume is ₹X."
