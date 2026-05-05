import Link from "next/link";

export const metadata = {
  title: "Code of Conduct — Wander Women",
  description:
    "Community standards, defamation policy, moderation SLA, and submission guidelines for the Beware Board and community.",
};

export default function CodeOfConductPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
        Trust &amp; safety
      </p>
      <h1 className="mb-3 font-serif text-4xl text-ink md:text-5xl">
        Code of Conduct
      </h1>
      <p className="mb-8 font-mono text-xs leading-relaxed text-ww-muted">
        Last updated: 5 May 2026 · V0 draft, pending legal review before V1 launch
      </p>

      {/* ── In short ─────────────────────────────────────────────── */}
      <section className="mb-10 border border-sage/30 bg-sage-light/40 p-5">
        <h2 className="mb-2 font-serif text-xl text-ink">In one paragraph</h2>
        <p className="font-mono text-sm leading-relaxed text-ink">
          Wander Women is a safety platform for solo women travellers. We
          publish user-submitted reports — but only after a human moderator has
          reviewed each one against the standards on this page. We will reject
          reports that name specific people, businesses, or operators without
          evidence. We will edit reports that read as personal grievances. We
          will not publish anything that could meet a legal definition of
          defamation in India or in the country the report is about. If we are
          ever wrong, we want to hear about it — every published report has a
          flag link.
        </p>
      </section>

      {/* ── Moderation SLA ───────────────────────────────────────── */}
      <Section title="Moderation SLA">
        <ul className="space-y-3">
          <Item label="Beware reports">
            Reviewed by a moderator within <strong>24 hours</strong> of
            submission, usually faster. Nothing is published before review. The
            reporter is emailed the moderation outcome (approved with or
            without edits, or rejected with a written reason).
          </Item>
          <Item label="Community posts and replies">
            Posts: reviewed within <strong>24 hours</strong>. Replies on
            existing threads: reviewed within <strong>2 hours during day, 12 hours overnight</strong>.
          </Item>
          <Item label="Flagged content">
            Any report or post you flag: a moderator looks at it within{" "}
            <strong>4 hours during day, 24 hours overnight</strong>. If
            removal is warranted, content is taken down immediately and the
            original submitter is notified.
          </Item>
          <Item label="Defamation takedowns">
            If a named person or business contacts us claiming a published
            report is false: we{" "}
            <strong>unpublish within 24 hours</strong> while we investigate.
            Re-publication only after the original report’s author provides
            evidence that meets our standards (below).
          </Item>
        </ul>
      </Section>

      {/* ── What we accept ───────────────────────────────────────── */}
      <Section title="What gets published">
        <p className="mb-4 font-mono text-sm leading-relaxed text-ink">
          A Beware report is more likely to be approved if it:
        </p>
        <ul className="space-y-2 font-mono text-sm leading-relaxed text-ink">
          <Bullet>
            Describes a <strong>pattern of behaviour</strong>, not a single
            personal grievance — e.g. &ldquo;Tuk-tuks at this taxi stand
            consistently overcharge by 3×&rdquo;, not &ldquo;Driver X cheated
            me one time&rdquo;.
          </Bullet>
          <Bullet>
            Names a <strong>place</strong> (street, area, transport hub,
            checkpoint) rather than a single named individual or business.
            &ldquo;The Anjuna beach road after dark&rdquo; — yes.
            &ldquo;Restaurant Y on Anjuna beach road&rdquo; — only with strong
            evidence (see below).
          </Bullet>
          <Bullet>
            Is recent — <strong>within the last 12 months</strong> for active
            warnings. Older incidents may be approved as historical context if
            the pattern continues.
          </Bullet>
          <Bullet>
            Includes <strong>actionable advice</strong> — what a future solo
            traveller should do or avoid.
          </Bullet>
          <Bullet>
            Is written in <strong>your own words</strong>. Direct quotes from
            other women are fine if attributed; bulk-copying TripAdvisor or
            Reddit reports is not.
          </Bullet>
        </ul>
      </Section>

      {/* ── Defamation policy ────────────────────────────────────── */}
      <Section title="Defamation policy">
        <p className="mb-4 font-mono text-sm leading-relaxed text-ink">
          Calling out a specific named person, business, hotel, tour operator,
          or guide is allowed but the bar is high. We assume any named-business
          report could land us a legal notice. To be approved, a report that
          names a specific business <strong>must</strong>:
        </p>
        <ul className="mb-4 space-y-2 font-mono text-sm leading-relaxed text-ink">
          <Bullet>
            Stick to <strong>factual, observable behaviour</strong> — what
            happened, when, and where. Avoid characterisations
            (&ldquo;creepy&rdquo;, &ldquo;dishonest&rdquo;, &ldquo;criminal&rdquo;)
            in favour of the underlying facts.
          </Bullet>
          <Bullet>
            Include <strong>at least one corroborating signal</strong>:
            timestamped photo, screenshot of the booking or message, GPS
            coordinates, witness contact (with consent), or two independent
            other reports of the same business.
          </Bullet>
          <Bullet>
            Not allege <strong>criminal conduct</strong> (assault, fraud,
            trafficking) without a police FIR reference number. We will route
            those reports to the police directly and will not publish until
            there is a legal record.
          </Bullet>
        </ul>
        <p className="font-mono text-sm leading-relaxed text-ink">
          We <strong>will not publish</strong>: ad-hominem attacks; reports
          that read as a refund dispute; reports about businesses the reporter
          has a competitive interest in; second-hand stories without the
          original witness contactable.
        </p>
      </Section>

      {/* ── Evidence standards ───────────────────────────────────── */}
      <Section title="Evidence standards">
        <p className="mb-4 font-mono text-sm leading-relaxed text-ink">
          Our submission form captures up to three photos, GPS coordinates, and
          a Google Places venue link. The more of these you can attach, the
          faster the review. We will sometimes contact you for additional
          context before publishing.
        </p>
        <ul className="space-y-2 font-mono text-sm leading-relaxed text-ink">
          <Bullet>
            <strong>Photos</strong>: timestamped is best. We strip EXIF data on
            publication unless you explicitly opt in to keeping it.
          </Bullet>
          <Bullet>
            <strong>GPS / Place</strong>: helps us pin the report on the map
            accurately and dedupe against existing reports of the same area.
          </Bullet>
          <Bullet>
            <strong>Witness or co-traveller</strong>: optional, but a single
            witness who can confirm via WhatsApp or email — with their consent
            — significantly raises the chance of approval for sensitive
            reports.
          </Bullet>
          <Bullet>
            <strong>Police FIR / receipt / chat log</strong>: not required, but
            unlocks reporting against named individuals and businesses.
          </Bullet>
        </ul>
      </Section>

      {/* ── Rejection criteria ───────────────────────────────────── */}
      <Section title="Why we reject reports">
        <p className="mb-4 font-mono text-sm leading-relaxed text-ink">
          Every rejection comes with a written reason from the moderator,
          delivered to the reporter’s email. Common reasons:
        </p>
        <ul className="space-y-2 font-mono text-sm leading-relaxed text-ink">
          <Bullet>
            Names a specific person or business without sufficient evidence.
          </Bullet>
          <Bullet>
            Reads as a personal grievance or refund dispute rather than a
            safety pattern.
          </Bullet>
          <Bullet>
            Older than 12 months and the underlying pattern is no longer
            active.
          </Bullet>
          <Bullet>
            Alleges criminal conduct without a police FIR reference.
          </Bullet>
          <Bullet>
            Ad-hominem or characterisation-heavy language with no underlying
            facts.
          </Bullet>
          <Bullet>
            Submitter has a recent rejection rate above 50% and the pattern
            looks like coordinated targeting of a competitor.
          </Bullet>
        </ul>
        <p className="mt-4 font-mono text-sm leading-relaxed text-ink">
          You can revise and resubmit — we will tell you exactly what to
          change.
        </p>
      </Section>

      {/* ── Take-down + appeals ─────────────────────────────────── */}
      <Section title="Take-down requests &amp; appeals">
        <p className="mb-3 font-mono text-sm leading-relaxed text-ink">
          If a report names you or your business and you believe it is false
          or misleading: contact{" "}
          <a
            href="mailto:trust@wanderwomen.in"
            className="text-rust underline underline-offset-2"
          >
            trust@wanderwomen.in
          </a>{" "}
          with the report URL and a brief description of the inaccuracy. We
          will:
        </p>
        <ol className="ml-5 list-decimal space-y-2 font-mono text-sm leading-relaxed text-ink">
          <li>
            Unpublish the report within <strong>24 hours</strong> while we
            investigate.
          </li>
          <li>
            Contact the original reporter for additional evidence.
          </li>
          <li>
            Either republish (with edits if appropriate), permanently remove,
            or extend the unpublish window with a written explanation to both
            parties.
          </li>
        </ol>
      </Section>

      {/* ── Community conduct ─────────────────────────────────────── */}
      <Section title="Community conduct">
        <p className="mb-3 font-mono text-sm leading-relaxed text-ink">
          Wander Women is a women-only community. The following will get you
          banned, no warning:
        </p>
        <ul className="space-y-2 font-mono text-sm leading-relaxed text-ink">
          <Bullet>
            Misrepresenting yourself or your gender to access the platform.
          </Bullet>
          <Bullet>
            Harassment, slurs, or doxxing of other members or contributors.
          </Bullet>
          <Bullet>
            DMing other members for romantic / sexual interest. This is not
            that kind of platform.
          </Bullet>
          <Bullet>
            Coordinated reporting against a single business — you and a circle
            of friends submitting the same complaint counts as one report, not
            many.
          </Bullet>
          <Bullet>
            Posting affiliate or referral links you have not disclosed.
          </Bullet>
        </ul>
      </Section>

      {/* ── Reach us ─────────────────────────────────────────────── */}
      <Section title="Reach the moderation team">
        <p className="font-mono text-sm leading-relaxed text-ink">
          Questions about a moderation outcome:{" "}
          <a
            href="mailto:trust@wanderwomen.in"
            className="text-rust underline underline-offset-2"
          >
            trust@wanderwomen.in
          </a>
          . Defamation or take-down requests: same address, with{" "}
          <code className="bg-sand px-1.5 py-0.5 text-[11px]">
            URGENT — TAKEDOWN
          </code>{" "}
          in the subject. Press / legal:{" "}
          <a
            href="mailto:founder@wanderwomen.in"
            className="text-rust underline underline-offset-2"
          >
            founder@wanderwomen.in
          </a>
          .
        </p>
      </Section>

      <p className="mt-12 border-t border-ww-border/60 pt-5 font-mono text-[10px] leading-relaxed text-ww-muted/80">
        This page is a V0 draft. Before any user-submitted Beware report is
        published in V1, we will engage a defamation lawyer to review and
        tighten this language for India + EU + US jurisdictions. If you are
        reading this and you are a media-law lawyer who cares about women’s
        travel safety: please{" "}
        <Link href="/feedback" className="underline hover:text-ink">
          get in touch
        </Link>
        .
      </p>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="mb-3 font-serif text-2xl text-ink">{title}</h2>
      {children}
    </section>
  );
}

function Item({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <li className="border border-ww-border bg-warm-white p-4">
      <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-rust">
        {label}
      </p>
      <p className="font-mono text-sm leading-relaxed text-ink">{children}</p>
    </li>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-0.5 shrink-0 text-rust">•</span>
      <span>{children}</span>
    </li>
  );
}
