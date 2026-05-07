import Link from "next/link";

// Contributor Safety Policy — public-facing.
//
// WHY THIS PAGE EXISTS:
// Investors will ask: "How do you protect women contributors when their
// content goes live? What happens when someone reports them, doxxes them,
// or threatens them?" Having a public URL beats a private commitment.
// The promise on a stable page is a moat — it's hard to replicate without
// actually doing the work.
//
// This page covers four contracts, in plain English:
//   1. Identity tiers — every contributor picks how visible they want to be
//   2. Takedown SLA — 4 hours, 24/7, documented
//   3. Escalation paths — NCW 1091, POSH 2013, POCSO 2012, IT Rules 2021
//   4. Coverage — who reads moderation when the founder is asleep
//
// This is a draft. The production version requires legal review (see
// docs/legal/legal-review-rfp.md). The numbers and SLAs are real
// commitments — change them carefully.

export const metadata = {
  title: "Contributor Safety Policy — Wander Women",
  description:
    "How Wander Women protects women contributors: identity tiers, 4-hour takedown SLA, escalation to NCW/POSH/POCSO, and 24/7 moderation coverage.",
  alternates: { canonical: "/safety/contributor-safety" },
};

type Section = {
  eyebrow: string;
  title: string;
  body: string | string[];
};

const PROMISES: Section[] = [
  {
    eyebrow: "Promise 1",
    title: "You choose your visibility, not us",
    body: [
      "Every contributor picks one of four identity tiers when they publish. The tier is editable any time from /account/profile and propagates to past contributions within 60 seconds.",
      "Full name + city — the public-recognition mode used by named contributors who want the byline credit.",
      "First name + city — first name only, with home-city context for trust without full identification.",
      "Handle only — a chosen handle (e.g. @ananya_hp). No real name displayed anywhere on the platform.",
      "Anonymous — no identifier of any kind. Used for incident reporting, abuse reports, and contributors in active hostile situations.",
      "What we collect (verification, KYC) is separate from what we display. We never show identification photos, government IDs, phone numbers, or email addresses publicly. If a tier change requires us to redact past content, we redact within the same 60-second window.",
    ],
  },
  {
    eyebrow: "Promise 2",
    title: "4-hour takedown SLA — 24/7, documented, public",
    body: [
      "Any contributor can request takedown of their own content for any reason — no justification required. Requests sent to grievance@wanderwomen.in are acknowledged within 4 hours and the content is hidden within the same 4 hours, regardless of timezone, day of week, or holiday.",
      "Third-party takedown requests (e.g. a person mentioned in a beware report) follow IT Rules 2021 timelines: 36-hour acknowledgement, 15-day investigation, with hidden-pending-review status starting at acknowledgement.",
      "The 4-hour SLA is monitored. Every takedown request creates a row in moderation_audit_log. The daily-ops-digest cron flags any request older than 2 hours that hasn't been acknowledged. We publish the prior month's median and 95th-percentile takedown times in the quarterly community update.",
    ],
  },
  {
    eyebrow: "Promise 3",
    title: "Escalation paths to authorities, not just to us",
    body: [
      "Wander Women is a private platform. We do not have police powers. When a contributor faces threats, harassment, or content that crosses into criminal territory, we route to the right authority and assist with the report — we don't keep the matter inside our system.",
      "Sexual harassment / threats: National Commission for Women helpline 1091 (24/7, free). For workplace incidents: PoSH Act 2013 internal committee referrals.",
      "Threats involving minors: POCSO Act 2012 — mandatory referral to the local Special Court / Child Welfare Committee within 24 hours.",
      "Defamation / impersonation: IT Rules 2021 takedown plus advisable filing under IPC §499 (defamation) / §500.",
      "Doxxing or release of private information: IT Act §66E (privacy violation) plus immediate platform-side hide.",
      "We maintain templates for each escalation type. The Grievance Officer (see /legal/grievance-officer) is the single point of contact for any of these.",
    ],
  },
  {
    eyebrow: "Promise 4",
    title: "Coverage when one human is asleep",
    body: [
      "A 4-hour SLA is fiction unless someone is actually reading the inbox. Wander Women operates a documented coverage roster.",
      "Tier 1 — Founder, primary on-call, 06:00–22:00 IST. Receives SMS for any urgent flag (severity ≥ 4 or contributor-safety keywords).",
      "Tier 2 — Backup moderator (named in the internal runbook, rotated quarterly), 22:00–06:00 IST + founder-out-of-pocket windows. Acknowledges via shared inbox.",
      "Tier 3 — Founder + 1 trusted advisor with admin access. Activated when neither Tier 1 nor Tier 2 acknowledges within 1 hour of an urgent flag.",
      "When the founder is on a flight or in a no-network area, the roster is updated in advance. The bus-factor runbook is reviewed monthly. Internal version with names + numbers lives at docs/operations/moderation-bus-factor.md and is deliberately not public for safety reasons.",
    ],
  },
];

const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "Can I change my identity tier after I've published a Trip Intel Card?",
    a: "Yes, any time. Your past contributions update to the new tier within 60 seconds. There is no penalty and no review — visibility is your call, not ours.",
  },
  {
    q: "What if my employer or family finds out I write here?",
    a: "Pick the Anonymous or Handle-only tier. We never display real names, locations, or any unique identifier from your profile when these tiers are selected. KYC data we hold for verification is encrypted at rest and never appears in any public surface, search engine, AI training crawl, or SQL view.",
  },
  {
    q: "What happens if someone threatens me on the platform?",
    a: "Email grievance@wanderwomen.in immediately. We acknowledge within 4 hours, hide the threatening content within the same 4 hours, and assist you in filing with NCW (1091), local police (112 or your state cybercrime cell), or the IT Rules 2021 Grievance Officer of the threatening user's platform if they're cross-posting. We provide a written summary of the incident on request, suitable for filing with authorities.",
  },
  {
    q: "What if Wander Women itself misbehaves?",
    a: "Three external escalation paths: (1) the Grievance Officer page on this site lists the IT Rules 2021 contact details and statutory escalation timeline; (2) the National Commission for Women accepts complaints against private companies; (3) the Ministry of Electronics and IT (MeitY) accepts IT Rules 2021 violation reports. We cannot promise we'll never make a mistake — we promise we'll be reachable when we do.",
  },
  {
    q: "Do you publish takedown numbers?",
    a: "Yes, every quarter, in the community update. Median takedown time, 95th-percentile takedown time, total takedown count, and the breakdown by type (contributor self-takedown, third-party request, court order, platform-initiated). The first quarterly update is at the close of the quarter we exit beta in.",
  },
];

export default function ContributorSafetyPage() {
  return (
    <main className="bg-warm-white">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="border-b border-ww-border px-6 pt-20 pb-12 md:px-10 md:pt-28">
        <div className="mx-auto max-w-3xl">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-rust">
            Contributor Safety
          </p>
          <h1 className="mb-6 font-serif text-4xl leading-tight text-ink md:text-5xl">
            Four promises to anyone who publishes here.
          </h1>
          <p className="font-serif text-lg italic leading-relaxed text-ww-muted">
            Trust is the product. These promises are public so they can be
            cited, audited, and held against us. If we fall short, the
            Grievance Officer page tells you exactly how to escalate.
          </p>
        </div>
      </section>

      {/* ── Promises ─────────────────────────────────────────────────── */}
      <section className="border-b border-ww-border px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-3xl space-y-12">
          {PROMISES.map((p) => (
            <article key={p.title} className="border-l-2 border-rust pl-6">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-rust">
                {p.eyebrow}
              </p>
              <h2 className="mb-4 font-serif text-2xl leading-snug text-ink md:text-3xl">
                {p.title}
              </h2>
              <div className="space-y-3">
                {(Array.isArray(p.body) ? p.body : [p.body]).map((para, i) => (
                  <p
                    key={i}
                    className="text-sm leading-relaxed text-ink/80 md:text-base"
                  >
                    {para}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="border-b border-ww-border bg-sand px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-ww-muted">
            Questions we get
          </p>
          <h2 className="mb-8 font-serif text-3xl leading-tight text-ink md:text-4xl">
            What contributors ask before they publish.
          </h2>
          <dl className="space-y-8">
            {FAQ_ITEMS.map((item) => (
              <div key={item.q}>
                <dt className="mb-2 font-serif text-lg italic text-ink">
                  {item.q}
                </dt>
                <dd className="text-sm leading-relaxed text-ink/80 md:text-base">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Escalation card ─────────────────────────────────────────── */}
      <section className="px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="border border-rust/40 bg-rust/5 p-8">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-rust">
              Need help right now?
            </p>
            <h2 className="mb-4 font-serif text-2xl leading-snug text-ink md:text-3xl">
              Three places to reach a human.
            </h2>
            <ul className="space-y-3 text-sm text-ink/80 md:text-base">
              <li>
                <strong className="text-ink">grievance@wanderwomen.in</strong>{" "}
                — 4-hour acknowledgement, 24/7. Use this for any contributor
                or content concern on Wander Women.
              </li>
              <li>
                <strong className="text-ink">NCW Helpline 1091</strong> —
                24/7, free, English + Hindi. National Commission for Women.
                Use for harassment or threat outside our platform.
              </li>
              <li>
                <strong className="text-ink">112</strong> — National
                emergency number. Use for immediate physical danger.
              </li>
            </ul>
            <p className="mt-6 font-mono text-xs text-ww-muted">
              The{" "}
              <Link
                href="/legal/grievance-officer"
                className="underline hover:text-ink"
              >
                Grievance Officer
              </Link>{" "}
              page lists the statutory IT Rules 2021 escalation if you need
              to act against Wander Women itself.
            </p>
          </div>
        </div>
      </section>

      {/* ── Cross-links ─────────────────────────────────────────────── */}
      <section className="border-t border-ww-border bg-sand px-6 py-12 md:px-10">
        <div className="mx-auto max-w-3xl">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-ww-muted">
            Related
          </p>
          <ul className="grid grid-cols-1 gap-3 text-sm md:grid-cols-3">
            <li>
              <Link
                href="/methodology"
                className="block border border-ww-border bg-warm-white p-4 transition-colors hover:border-rust"
              >
                <span className="block font-serif text-base text-ink">
                  Verification methodology
                </span>
                <span className="mt-1 block font-mono text-xs text-ww-muted">
                  How we check sources before content goes live.
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/legal/grievance-officer"
                className="block border border-ww-border bg-warm-white p-4 transition-colors hover:border-rust"
              >
                <span className="block font-serif text-base text-ink">
                  Grievance Officer
                </span>
                <span className="mt-1 block font-mono text-xs text-ww-muted">
                  IT Rules 2021 contact + statutory timelines.
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/code-of-conduct"
                className="block border border-ww-border bg-warm-white p-4 transition-colors hover:border-rust"
              >
                <span className="block font-serif text-base text-ink">
                  Code of Conduct
                </span>
                <span className="mt-1 block font-mono text-xs text-ww-muted">
                  What every member agrees to when posting.
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
