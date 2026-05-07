import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — Wander Women",
  description:
    "How Wander Women collects, uses, stores, and shares personal data. DPDP Act 2023 + IT Rules 2021 compliant. Draft pending legal review.",
  alternates: { canonical: "/privacy" },
};

// Comprehensive Privacy Policy draft, ready for lawyer red-line.
//
// Designed to satisfy:
//   - Digital Personal Data Protection Act, 2023 (DPDP Act / India)
//   - IT Rules 2021 — Rule 3(1) & 3(2)
//   - GDPR Art. 13 / 14 (for foreign-women users from EU)
//   - California CCPA / CPRA (for foreign-women users from US)
//
// Where the policy makes a substantive choice that the lawyer needs to
// confirm or change, an inline editorial note is in HTML comments.

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
        Trust &amp; safety
      </p>
      <h1 className="mb-3 font-serif text-4xl text-ink md:text-5xl">
        Privacy Policy
      </h1>
      <p className="mb-8 font-mono text-xs leading-relaxed text-ww-muted">
        Last updated: 7 May 2026 · Version 1.0 (draft) · Effective on legal
        review approval
      </p>

      <Section title="1. Who we are">
        <p className="font-mono text-sm leading-relaxed text-ink">
          Wander Women (&ldquo;Wander Women&rdquo;, &ldquo;we&rdquo;,
          &ldquo;us&rdquo;) is a women-only solo-travel intelligence
          platform operated from India. As of the date above we are a
          pre-incorporation entity; once incorporation completes this
          policy will list the registered name and address. Our Resident
          Grievance Officer details are at{" "}
          <Link
            href="/legal/grievance-officer"
            className="text-rust underline underline-offset-2"
          >
            /legal/grievance-officer
          </Link>
          .
        </p>
      </Section>

      <Section title="2. What this policy covers">
        <p className="font-mono text-sm leading-relaxed text-ink">
          This policy applies to every personal data point we collect when
          you visit our website, create an account, submit content, make a
          purchase, or otherwise interact with the Wander Women platform.
          It does not apply to third-party services we link to — those
          have their own policies.
        </p>
      </Section>

      <Section title="3. What we collect">
        <h3 className="mb-2 font-serif text-base text-ink">3.1 Account data</h3>
        <ul className="mb-4 space-y-2 font-mono text-sm leading-relaxed text-ink">
          <Bullet>
            Email address (required for sign-up and magic-link login)
          </Bullet>
          <Bullet>
            Phone number (required for verified-contributor status; SMS OTP
            only — we do not call you)
          </Bullet>
          <Bullet>First name and home city (optional, profile only)</Bullet>
          <Bullet>
            Selected username and avatar image (avatar uploaded to
            Supabase Storage bucket <code className="bg-sand px-1">avatars</code>)
          </Bullet>
        </ul>

        <h3 className="mb-2 font-serif text-base text-ink">
          3.2 Verification data
        </h3>
        <ul className="mb-4 space-y-2 font-mono text-sm leading-relaxed text-ink">
          <Bullet>
            <strong>Government ID + selfie photo</strong> uploaded as a
            single &ldquo;selfie-with-ID&rdquo; image (Aadhaar, passport,
            or driving license). Stored briefly in Supabase Storage bucket
            <code className="mx-1 bg-sand px-1">id-verification</code>.
          </Bullet>
          <Bullet>
            <strong>Photo deletion on approval:</strong> when our human
            moderator approves a verification, the photo is{" "}
            <em>immediately deleted</em> from storage. We retain only a
            boolean flag (<code className="bg-sand px-1">id_verified</code>)
            on your profile and an audit-log entry of the moderator&rsquo;s
            decision.
          </Bullet>
          <Bullet>
            We do not run automated biometric matching, liveness detection,
            or gender classification on this photo.
          </Bullet>
        </ul>

        <h3 className="mb-2 font-serif text-base text-ink">
          3.3 Content you submit
        </h3>
        <ul className="mb-4 space-y-2 font-mono text-sm leading-relaxed text-ink">
          <Bullet>
            <strong>Beware Board reports:</strong> photos, GPS coordinates,
            and venue links you attach. EXIF metadata is stripped on
            publication unless you explicitly opt in to keep it.
          </Bullet>
          <Bullet>
            <strong>Community posts and replies:</strong> the content you
            type plus a timestamp.
          </Bullet>
          <Bullet>
            <strong>Trip Vault documents</strong> (only if you opt in):
            booking confirmations, insurance, emergency contacts, ID scans
            you choose to upload. Encrypted at rest; never shared.
          </Bullet>
          <Bullet>
            <strong>Stay verifications:</strong> photos of accommodations
            you submit for the &ldquo;verified stay&rdquo; flag.
            Processed via Anthropic Claude API for consistency analysis
            (cross-border transfer to the United States — see Section 7).
          </Bullet>
        </ul>

        <h3 className="mb-2 font-serif text-base text-ink">
          3.4 Usage and analytics
        </h3>
        <ul className="mb-4 space-y-2 font-mono text-sm leading-relaxed text-ink">
          <Bullet>
            Page views, scroll depth, click events via PostHog (cookie-
            consent-gated; you can opt out via the footer).
          </Bullet>
          <Bullet>
            Affiliate-link click events to{" "}
            <code className="bg-sand px-1">affiliate_clicks</code> table —
            outbound merchant tracks the conversion separately.
          </Bullet>
          <Bullet>
            Server error data via Sentry. We strip request bodies and
            cookies; only error stack traces are retained.
          </Bullet>
        </ul>

        <h3 className="mb-2 font-serif text-base text-ink">
          3.5 Payment data
        </h3>
        <ul className="space-y-2 font-mono text-sm leading-relaxed text-ink">
          <Bullet>
            We use Razorpay (India) and Stripe (international) for
            payments. We never see or store your card details — only a
            payment-status reference. Your billing data is governed by
            Razorpay&rsquo;s and Stripe&rsquo;s respective privacy policies.
          </Bullet>
        </ul>
      </Section>

      <Section title="4. Why we collect it (legal basis)">
        <p className="mb-3 font-mono text-sm leading-relaxed text-ink">
          Under DPDP Act 2023 and GDPR, every collection has a basis:
        </p>
        <ul className="space-y-2 font-mono text-sm leading-relaxed text-ink">
          <Bullet>
            <strong>Contract</strong> — we cannot run an account-bound
            platform without your email; we cannot let you publish without
            verifying you are a woman.
          </Bullet>
          <Bullet>
            <strong>Consent</strong> — Trip Vault docs, optional analytics,
            EXIF retention, marketing email, location-tagging on Beware
            reports. You can withdraw consent any time without affecting
            past lawful processing.
          </Bullet>
          <Bullet>
            <strong>Legitimate interest</strong> — error logs, fraud
            detection on verification submissions, audit logs of moderator
            decisions. We balance these against your privacy and minimize
            retention.
          </Bullet>
          <Bullet>
            <strong>Legal obligation</strong> — moderation audit logs
            retained 180 days under IT Rules 2021; tax records retained as
            required by Indian tax law.
          </Bullet>
        </ul>
      </Section>

      <Section title="5. How we use it">
        <ul className="space-y-2 font-mono text-sm leading-relaxed text-ink">
          <Bullet>To run your account and let you sign in</Bullet>
          <Bullet>To verify you as a woman traveler before publishing</Bullet>
          <Bullet>
            To display your published content (Beware reports, community
            posts, intel cards) attributed to your chosen handle
          </Bullet>
          <Bullet>To moderate content against our Code of Conduct</Bullet>
          <Bullet>
            To send transactional email (verification approval, weekly
            digest if subscribed, password resets)
          </Bullet>
          <Bullet>To process membership payments (via Razorpay / Stripe)</Bullet>
          <Bullet>To improve the product (privacy-respecting analytics)</Bullet>
          <Bullet>To investigate and respond to grievances and abuse</Bullet>
        </ul>
      </Section>

      <Section title="6. Who we share it with">
        <p className="mb-3 font-mono text-sm leading-relaxed text-ink">
          We share personal data with the following processors. We do not
          sell personal data to anyone, ever.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full font-mono text-xs">
            <thead className="border-b border-ww-border text-ww-muted">
              <tr>
                <th className="py-2 pr-4 text-left">Processor</th>
                <th className="py-2 pr-4 text-left">What</th>
                <th className="py-2 text-left">Where</th>
              </tr>
            </thead>
            <tbody>
              <Tr p="Supabase" w="DB, Auth, Storage" loc="AWS Mumbai (ap-south-1)" />
              <Tr p="Vercel" w="Hosting, Edge functions" loc="Global edge" />
              <Tr p="Resend" w="Transactional email" loc="US-based" />
              <Tr p="Anthropic" w="Stay-photo analysis (Claude API)" loc="US-based" />
              <Tr p="PostHog" w="Analytics (consent-gated)" loc="US/EU" />
              <Tr p="Sentry" w="Error tracking" loc="US-based" />
              <Tr p="Razorpay" w="Payments (India)" loc="India" />
              <Tr p="Stripe" w="Payments (international)" loc="US/Ireland" />
            </tbody>
          </table>
        </div>
        <p className="mt-3 font-mono text-xs text-ww-muted">
          We have or will have a Data Processing Agreement with each
          processor before processing personal data. We disclose any new
          processor on this page within 30 days of integration.
        </p>
      </Section>

      <Section title="7. Cross-border transfers">
        <p className="mb-3 font-mono text-sm leading-relaxed text-ink">
          Some of our processors operate from outside India. Specifically:
          Anthropic (US) for stay-photo analysis; Resend (US) for email;
          Sentry, PostHog, Stripe (mixed jurisdictions). These transfers
          are necessary to provide the platform.
        </p>
        <p className="font-mono text-sm leading-relaxed text-ink">
          We rely on the standard contractual clauses and the processor&rsquo;s
          adequacy frameworks where applicable. Once DPDP Act rules around
          cross-border transfer are notified, we will update this policy
          and our processor agreements within 90 days.
        </p>
      </Section>

      <Section title="8. How long we keep it">
        <ul className="space-y-2 font-mono text-sm leading-relaxed text-ink">
          <Bullet>
            <strong>Account data:</strong> until you delete your account.
            On deletion, we run our purge process within 30 days.
          </Bullet>
          <Bullet>
            <strong>Verification photos:</strong> until human moderator
            decision. <strong>Deleted from storage upon approval.</strong>{" "}
            For rejected verifications, retained 30 days for fraud-prevention
            re-review, then deleted.
          </Bullet>
          <Bullet>
            <strong>Beware report photos:</strong> retained while the report
            is published. EXIF stripped before storage by default.
          </Bullet>
          <Bullet>
            <strong>Payment records:</strong> retained per Indian tax law
            (currently 8 years for invoice-related records).
          </Bullet>
          <Bullet>
            <strong>Moderation audit logs:</strong> retained 180 days minimum
            under IT Rules 2021, longer where retained for legal reasons.
          </Bullet>
          <Bullet>
            <strong>Server logs:</strong> 30 days, then automatically purged.
          </Bullet>
          <Bullet>
            <strong>Analytics:</strong> aggregate retained indefinitely;
            user-level data purged 90 days after collection.
          </Bullet>
        </ul>
      </Section>

      <Section title="9. Your rights">
        <p className="mb-3 font-mono text-sm leading-relaxed text-ink">
          Under the DPDP Act 2023 (and GDPR / CCPA where applicable to you),
          you have the right to:
        </p>
        <ul className="mb-3 space-y-2 font-mono text-sm leading-relaxed text-ink">
          <Bullet>
            <strong>Access</strong> a copy of the personal data we hold about you
          </Bullet>
          <Bullet>
            <strong>Correct</strong> any inaccurate data
          </Bullet>
          <Bullet>
            <strong>Erase</strong> your account and all associated data
          </Bullet>
          <Bullet>
            <strong>Port</strong> your data in a machine-readable format
          </Bullet>
          <Bullet>
            <strong>Withdraw consent</strong> for any consent-based processing
          </Bullet>
          <Bullet>
            <strong>Lodge a grievance</strong> with our Resident Grievance
            Officer or, on appeal, with the Grievance Appellate Committee
            under Rule 3A IT Rules 2021
          </Bullet>
          <Bullet>
            <strong>Nominate</strong> a person to exercise your rights in
            the event of your incapacity (DPDP Act §14)
          </Bullet>
        </ul>
        <p className="font-mono text-sm leading-relaxed text-ink">
          You can exercise most rights from{" "}
          <Link href="/settings" className="text-rust underline underline-offset-2">
            /settings
          </Link>{" "}
          (download data, edit profile, delete account). For requests we
          cannot complete from the UI, email{" "}
          <a
            href="mailto:privacy@wanderwomen.in"
            className="text-rust underline underline-offset-2"
          >
            privacy@wanderwomen.in
          </a>
          . We respond within 30 days, typically faster.
        </p>
      </Section>

      <Section title="10. Children">
        <p className="font-mono text-sm leading-relaxed text-ink">
          Wander Women is not intended for users under 18. We do not
          knowingly collect personal data from anyone under 18. If you
          believe a minor has created an account, email{" "}
          <a
            href="mailto:privacy@wanderwomen.in"
            className="text-rust underline underline-offset-2"
          >
            privacy@wanderwomen.in
          </a>{" "}
          and we will purge the account within 7 days.
        </p>
      </Section>

      <Section title="11. Cookies and similar technologies">
        <p className="mb-3 font-mono text-sm leading-relaxed text-ink">
          We use cookies for:
        </p>
        <ul className="space-y-2 font-mono text-sm leading-relaxed text-ink">
          <Bullet>
            <strong>Strictly necessary</strong> — sign-in session, CSRF
            protection. These are always set; cannot be disabled.
          </Bullet>
          <Bullet>
            <strong>Analytics</strong> (PostHog) — only set after you
            accept via the consent banner. Manage at{" "}
            <Link
              href="/settings"
              className="text-rust underline underline-offset-2"
            >
              /settings
            </Link>
            .
          </Bullet>
          <Bullet>
            <strong>Functional</strong> — locale, accessibility preferences.
            Set after consent.
          </Bullet>
        </ul>
        <p className="mt-3 font-mono text-sm leading-relaxed text-ink">
          We do not use third-party advertising cookies. We do not embed
          social-media trackers (no Meta Pixel, no Google Tag Manager
          retargeting).
        </p>
      </Section>

      <Section title="12. Security">
        <p className="font-mono text-sm leading-relaxed text-ink">
          Personal data is encrypted in transit (HTTPS) and at rest
          (Supabase Postgres encryption). Verification photos are stored
          in a private bucket with row-level security policies preventing
          cross-user access. Access by staff is limited to admins and
          moderators; every access is logged. We will publish a security
          incident report within 72 hours of becoming aware of any breach
          that affects you, in line with DPDP Act §8(6).
        </p>
      </Section>

      <Section title="13. International users">
        <p className="font-mono text-sm leading-relaxed text-ink">
          If you access Wander Women from the European Economic Area, the
          UK, or California, additional rights and information apply under
          GDPR / UK GDPR / CCPA / CPRA. The substantive protections in this
          policy meet or exceed those baselines. To exercise any
          jurisdiction-specific right, email{" "}
          <a
            href="mailto:privacy@wanderwomen.in"
            className="text-rust underline underline-offset-2"
          >
            privacy@wanderwomen.in
          </a>{" "}
          and identify the framework you are invoking.
        </p>
      </Section>

      <Section title="14. Changes to this policy">
        <p className="font-mono text-sm leading-relaxed text-ink">
          Material changes — adding a new processor, changing a retention
          period, narrowing your rights — are announced via email to all
          registered users at least 30 days before they take effect.
          Non-material changes (typo fixes, clearer wording) take effect
          on publication. The version date at the top of this page is
          authoritative.
        </p>
      </Section>

      <Section title="15. Contact">
        <p className="font-mono text-sm leading-relaxed text-ink">
          Privacy questions:{" "}
          <a
            href="mailto:privacy@wanderwomen.in"
            className="text-rust underline underline-offset-2"
          >
            privacy@wanderwomen.in
          </a>
          <br />
          Grievance Officer (under IT Rules 2021):{" "}
          <a
            href="mailto:grievance@wanderwomen.in"
            className="text-rust underline underline-offset-2"
          >
            grievance@wanderwomen.in
          </a>
          <br />
          Postal: [Registered office to be added once Pvt Ltd registration completes]
        </p>
      </Section>

      <p className="mt-12 border-t border-ww-border/60 pt-5 font-mono text-[10px] leading-relaxed text-ww-muted/80">
        This is a comprehensive draft prepared for legal review. Any
        deviations between this policy and our actual practices should be
        reported to{" "}
        <a
          href="mailto:privacy@wanderwomen.in"
          className="text-rust underline underline-offset-2"
        >
          privacy@wanderwomen.in
        </a>
        . On legal review approval, the &ldquo;draft&rdquo; marker is
        removed and the effective date is set.
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

function Tr({ p, w, loc }: { p: string; w: string; loc: string }) {
  return (
    <tr className="border-b border-ww-border/40">
      <td className="py-2 pr-4 text-ink">{p}</td>
      <td className="py-2 pr-4 text-ink">{w}</td>
      <td className="py-2 text-ww-muted">{loc}</td>
    </tr>
  );
}
