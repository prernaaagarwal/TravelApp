import Link from "next/link";

export const metadata = {
  title: "Privacy — Wander Women",
  description: "How Wander Women collects, uses, and stores your data. V0 draft, pending legal review.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
        Trust &amp; safety
      </p>
      <h1 className="mb-3 font-serif text-4xl text-ink md:text-5xl">
        Privacy
      </h1>
      <p className="mb-8 font-mono text-xs leading-relaxed text-ww-muted">
        Last updated: 5 May 2026 · V0 draft, pending legal review before V1 launch
      </p>

      <Section title="What we collect">
        <ul className="space-y-2 font-mono text-sm leading-relaxed text-ink">
          <Bullet>
            <strong>Account</strong>: email, username, hashed password,
            optional first name and home city. Stored on Supabase
            (eu-central-1).
          </Bullet>
          <Bullet>
            <strong>Trip vault docs</strong> (only if you opt in): bookings,
            insurance, emergency contacts, passport scans. Encrypted at rest;
            never shared.
          </Bullet>
          <Bullet>
            <strong>Beware reports</strong>: photos, GPS, and venue links you
            attach. EXIF metadata is stripped on publication unless you
            explicitly opt in.
          </Bullet>
          <Bullet>
            <strong>Analytics</strong>: page views, scroll depth, click events
            via PostHog (self-hosted). No third-party ad networks.
          </Bullet>
        </ul>
      </Section>

      <Section title="What we never do">
        <ul className="space-y-2 font-mono text-sm leading-relaxed text-ink">
          <Bullet>Sell your data to anyone, ever.</Bullet>
          <Bullet>Share your email with brands, advertisers, or affiliates.</Bullet>
          <Bullet>
            Publish your name on a Beware report without your explicit
            opt-in (default is anonymous attribution by city).
          </Bullet>
          <Bullet>Share your trip vault contents with other users.</Bullet>
        </ul>
      </Section>

      <Section title="Your rights">
        <p className="font-mono text-sm leading-relaxed text-ink">
          You can download all your data, edit your profile, or delete your
          account at any time from{" "}
          <Link href="/settings" className="text-rust underline underline-offset-2">
            /settings
          </Link>
          . Email{" "}
          <a href="mailto:privacy@wanderwomen.in" className="text-rust underline underline-offset-2">
            privacy@wanderwomen.in
          </a>{" "}
          for any data request and we will respond within 30 days (sooner in
          most cases).
        </p>
      </Section>

      <p className="mt-12 border-t border-ww-border/60 pt-5 font-mono text-[10px] leading-relaxed text-ww-muted/80">
        This is a V0 draft, intentionally light on jurisdiction-specific
        language. A full DPDPA / GDPR / CCPA-compliant policy will replace
        this page before V1 launch, after legal review.
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

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-0.5 shrink-0 text-rust">•</span>
      <span>{children}</span>
    </li>
  );
}
