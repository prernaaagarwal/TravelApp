# Moderation bus-factor runbook

> Internal-only. Do NOT make this public. Names + numbers redacted in the
> committed version; the production runbook lives outside the repo.

A 4-hour takedown SLA is a fiction unless someone is reading the inbox
when the founder is asleep, sick, on a flight, or unreachable. This
document is the answer to the investor question: "Who covers when you
can't?"

---

## The roster (3 tiers)

### Tier 1 — Founder (primary)

- **Coverage window**: 06:00–22:00 IST
- **Channels**: SMS for severity ≥ 4 or contributor-safety keywords;
  email for everything else
- **Response target**: 1 hour acknowledgement, 4 hours action
- **Backup channel if SMS fails**: WhatsApp on `[REDACTED]`

### Tier 2 — Backup moderator

- **Coverage window**: 22:00–06:00 IST + founder-OOO windows
- **Identity**: rotated quarterly. Current: `[NAME REDACTED]`
- **Onboarding**: signed Code of Conduct + admin role granted via
  `app/admin/users/[id]` (admin-only). Briefed in 1-hour intro on
  takedown protocol, escalation paths, and the 4-hour SLA.
- **Compensation**: paid hourly retainer of `[AMOUNT]` per quarter,
  plus `[AMOUNT]` per ticket actioned outside hours.
- **Permission boundary**: can hide content, dismiss reports, send
  template notifications. Cannot delete users, cannot purge data,
  cannot change RLS or grant roles.

### Tier 3 — Trusted advisor + founder dual approval

- **When activated**: neither Tier 1 nor Tier 2 acknowledges within 1
  hour of an urgent flag, OR an action requires admin (purge,
  permanent ban) and founder is unreachable >24h.
- **Identity**: `[ADVISOR NAME REDACTED]` — verified contact `[REDACTED]`
- **Constraints**: any action they take is logged in moderation_audit_log
  with their actor_id. Founder reviews the next available business day
  and can reverse.

---

## Trigger keywords (automated escalation)

The daily-ops-digest cron also runs a keyword scan every 15 minutes on
new inserts. Hits route SMS to Tier 1 immediately, with a 30-minute
auto-fallover to Tier 2 if Tier 1 doesn't acknowledge.

Keywords (English + Hindi + Hinglish):
- `threat`, `kill`, `rape`, `assault`, `dox`, `address`, `home address`
- `dhamki`, `maarunga`, `khoon`, `pata bata`
- `screenshot`, `share kar`, `viral kar`
- Phone-number patterns matching Indian mobile (`+91 [6-9]\d{9}`)
- Email patterns inside reply text

Maintained in `lib/moderation-keywords.ts`. Update quarterly based on
what's actually appeared in the queue.

---

## OOO (out-of-office) protocol

Before going OOO for >12 hours:

1. Update `Tier 1 OOO` flag in the team Notion page (or whatever the
   founder's source-of-truth is — currently a pinned WhatsApp message
   to Tier 2)
2. Set Tier 2 to primary for the duration
3. Confirm Tier 2 has admin access (`select role from profiles where id
   = '[Tier-2-user-id]'` should return `admin` or `moderator`)
4. Test the alerting chain: post a synthetic flag, confirm Tier 2 SMS
   fires within 30 seconds
5. Send Tier 2 the previous month's queue volume + median age so they
   know the load to expect

---

## In-flight / no-network protocol

Before any flight or known no-network window:

1. Tier 2 → Tier 1 for the duration
2. Tier 3 advisor pre-notified that they may be paged
3. Founder phone has the SMS-relay number saved for landing — first
   action on landing is to check the queue

---

## Quarterly review

Every quarter (start of Jan / Apr / Jul / Oct):

1. Confirm Tier 2 contract is renewed; pay any outstanding retainer
2. Review the past quarter's: median takedown time, 95th-percentile,
   total volume, any SLA breaches
3. Publish the takedown numbers in the public quarterly community update
   (without names or content; just aggregates)
4. Update the keyword list based on what appeared in the queue
5. Run a fire drill: synthetic flag at 02:00 IST, measure end-to-end
   acknowledge + action time, fix any gaps

---

## Escalation contact tree (the actual numbers)

> **Redacted for the committed version. The production version lives in
> the founder's password manager + a printed copy in the founder's home
> safe. Tier 2 + Tier 3 each have a sealed envelope copy.**

The non-redacted tree contains:
- 4 phone numbers (founder primary, founder backup, Tier 2, Tier 3)
- 3 emails (grievance@, founder personal, Tier 2 work)
- 2 emergency external (NCW 1091, local cybercrime cell number)
- VPN / admin credential rotation procedure if any tier's credentials
  are compromised
