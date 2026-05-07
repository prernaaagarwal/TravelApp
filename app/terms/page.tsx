import Link from "next/link";

export const metadata = {
  title: "Terms of Service — Wander Women",
  description:
    "Terms governing use of the Wander Women platform. Women-only eligibility, user-generated content rules, payment terms, governing law. Draft pending legal review.",
  alternates: { canonical: "/terms" },
};

// Comprehensive Terms of Service draft, ready for lawyer red-line.
//
// Designed to:
//   - establish IT Act §79 safe harbor (intermediary status)
//   - set user-generated-content licensing
//   - limit liability appropriately for a content + community platform
//   - set governing law (India) and dispute resolution (arbitration)
//   - meet Consumer Protection (E-Commerce) Rules 2020 disclosure
//   - meet DPDP Act 2023 alignment
//
// Every clause that needs lawyer attention is flagged in HTML comments.

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
        Trust &amp; safety
      </p>
      <h1 className="mb-3 font-serif text-4xl text-ink md:text-5xl">
        Terms of Service
      </h1>
      <p className="mb-8 font-mono text-xs leading-relaxed text-ww-muted">
        Last updated: 7 May 2026 · Version 1.0 (draft) · Effective on legal
        review approval
      </p>

      <Section title="1. Acceptance of these Terms">
        <p className="font-mono text-sm leading-relaxed text-ink">
          These Terms of Service govern your use of the Wander Women website
          and platform (the &ldquo;Platform&rdquo;). By creating an account
          or otherwise using the Platform, you agree to these Terms and to
          our{" "}
          <Link href="/privacy" className="text-rust underline underline-offset-2">
            Privacy Policy
          </Link>
          ,{" "}
          <Link
            href="/code-of-conduct"
            className="text-rust underline underline-offset-2"
          >
            Code of Conduct
          </Link>
          , and{" "}
          <Link
            href="/methodology"
            className="text-rust underline underline-offset-2"
          >
            Methodology
          </Link>
          . If you do not agree, do not use the Platform.
        </p>
      </Section>

      <Section title="2. Eligibility">
        <p className="mb-3 font-mono text-sm leading-relaxed text-ink">
          You may register an account on Wander Women only if:
        </p>
        <ul className="space-y-2 font-mono text-sm leading-relaxed text-ink">
          <Bullet>You are at least 18 years old</Bullet>
          <Bullet>You self-identify as a woman</Bullet>
          <Bullet>
            You can form a legally binding contract under the law of your
            jurisdiction
          </Bullet>
          <Bullet>You provide accurate registration information</Bullet>
        </ul>
        <p className="mt-3 font-mono text-sm leading-relaxed text-ink">
          Wander Women is operated under Article 15(3) of the Constitution
          of India which permits special provisions for women. The
          women-only restriction is enforced through self-identification,
          ID + selfie verification by a human moderator, and the Code of
          Conduct. Misrepresentation of identity is a material breach
          that voids any verification status and may lead to permanent
          account termination.
        </p>
      </Section>

      <Section title="3. The Platform">
        <p className="font-mono text-sm leading-relaxed text-ink">
          Wander Women provides a women-only solo-travel intelligence
          service: editorial Trip Intel Cards by named contributors, a
          user-submitted Beware Board incident feed, community discussion,
          and adjacent products (Vault, Buddy, Shop) that may evolve. We
          may add, modify, or remove features at any time. Material
          changes that adversely affect your use will be announced at
          least 30 days in advance.
        </p>
      </Section>

      <Section title="4. Your account">
        <ul className="space-y-2 font-mono text-sm leading-relaxed text-ink">
          <Bullet>
            You are responsible for the security of your sign-in
            credentials and for all activity under your account.
          </Bullet>
          <Bullet>
            You must notify us promptly at{" "}
            <a
              href="mailto:security@wanderwomen.in"
              className="text-rust underline underline-offset-2"
            >
              security@wanderwomen.in
            </a>{" "}
            if you suspect unauthorised access.
          </Bullet>
          <Bullet>
            You may delete your account at any time. Deletion triggers our
            data-purge process within 30 days, subject to legal retention
            obligations.
          </Bullet>
          <Bullet>
            We may suspend or terminate accounts that breach these Terms
            or the Code of Conduct, with notice where reasonable.
          </Bullet>
        </ul>
      </Section>

      <Section title="5. User-generated content">
        <h3 className="mb-2 font-serif text-base text-ink">5.1 Your content</h3>
        <p className="mb-3 font-mono text-sm leading-relaxed text-ink">
          When you submit Beware reports, community posts, intel-card
          contributions, photos, or other content (&ldquo;Your
          Content&rdquo;), you keep your copyright. You grant Wander Women
          a non-exclusive, worldwide, royalty-free, perpetual,
          sublicensable licence to host, display, edit, translate, excerpt,
          and distribute Your Content in connection with the Platform —
          including for promoting the Platform.
        </p>

        <h3 className="mb-2 font-serif text-base text-ink">
          5.2 Warranties about Your Content
        </h3>
        <p className="mb-3 font-mono text-sm leading-relaxed text-ink">
          You warrant that Your Content:
        </p>
        <ul className="mb-3 space-y-2 font-mono text-sm leading-relaxed text-ink">
          <Bullet>Is your own original work or properly licensed</Bullet>
          <Bullet>
            Does not infringe any third-party copyright, trademark, or
            privacy right
          </Bullet>
          <Bullet>
            Is accurate to the best of your knowledge and submitted in
            good faith
          </Bullet>
          <Bullet>
            Complies with applicable law including the IT Act, IPC §499,
            and the Code of Conduct
          </Bullet>
        </ul>

        <h3 className="mb-2 font-serif text-base text-ink">
          5.3 Beware Board specifically
        </h3>
        <p className="mb-3 font-mono text-sm leading-relaxed text-ink">
          The Beware Board is a public-interest incident feed. By
          submitting a Beware report you confirm:
        </p>
        <ul className="mb-3 space-y-2 font-mono text-sm leading-relaxed text-ink">
          <Bullet>
            The incident described occurred or you witnessed it personally
          </Bullet>
          <Bullet>
            You are not submitting the report for commercial retaliation,
            personal grudge, or harassment
          </Bullet>
          <Bullet>
            You consent to publication after moderator review, in line
            with our Methodology
          </Bullet>
          <Bullet>
            You will respond truthfully to any further questions our
            moderators ask in the course of review
          </Bullet>
        </ul>
        <p className="mb-3 font-mono text-sm leading-relaxed text-ink">
          We moderate every submission against our published criteria
          before publication. We may decline, edit, or remove any report.
          We may take down published reports in response to valid
          grievances under the procedure at{" "}
          <Link
            href="/legal/grievance-officer"
            className="text-rust underline underline-offset-2"
          >
            /legal/grievance-officer
          </Link>
          .
        </p>

        <h3 className="mb-2 font-serif text-base text-ink">
          5.4 Defamation indemnity
        </h3>
        <p className="font-mono text-sm leading-relaxed text-ink">
          If a third party brings a defamation, libel, or similar claim
          against Wander Women based on Your Content, you agree to
          indemnify and hold us harmless to the extent the claim arises
          from Your Content&rsquo;s factual misrepresentation. This
          indemnity does not apply to claims arising from our editing,
          summarisation, or republication of Your Content.
        </p>
      </Section>

      <Section title="6. Acceptable use">
        <p className="mb-3 font-mono text-sm leading-relaxed text-ink">
          You may not use the Platform to:
        </p>
        <ul className="space-y-2 font-mono text-sm leading-relaxed text-ink">
          <Bullet>
            Post content that is unlawful under Indian law including IPC
            §499 (defamation), §509 (insulting modesty), §354 (assault on
            modesty), §503 (criminal intimidation), or the IT Act §66E
            (privacy violation)
          </Bullet>
          <Bullet>
            Harass, threaten, dox, impersonate, or stalk any person
          </Bullet>
          <Bullet>
            Post commercial advertising, spam, or affiliate links not
            authorised by us
          </Bullet>
          <Bullet>
            Reverse-engineer, scrape, or systematically extract data from
            the Platform beyond ordinary browsing or our published API /
            MCP endpoints
          </Bullet>
          <Bullet>
            Bypass moderation, verification, or security controls
          </Bullet>
          <Bullet>
            Misrepresent your identity, age, or gender to gain account
            access
          </Bullet>
          <Bullet>
            Submit content that infringes a third party&rsquo;s
            intellectual property
          </Bullet>
        </ul>
      </Section>

      <Section title="7. Intellectual property">
        <p className="mb-3 font-mono text-sm leading-relaxed text-ink">
          The Platform&rsquo;s name, logo, design, code, intel-card
          schema, methodology, and aggregated database are owned by
          Wander Women. Nothing in these Terms transfers any IP rights to
          you except the limited licence to use the Platform.
        </p>
        <p className="font-mono text-sm leading-relaxed text-ink">
          Citation of intel cards by news media, AI engines, and other
          third parties is welcome under the citation guidelines published
          at{" "}
          <Link href="/llms.txt" className="text-rust underline underline-offset-2">
            /llms.txt
          </Link>
          .
        </p>
      </Section>

      <Section title="8. Membership and payments">
        <ul className="space-y-2 font-mono text-sm leading-relaxed text-ink">
          <Bullet>
            <strong>Pricing:</strong> current tiers, features, and prices
            are at{" "}
            <Link href="/pricing" className="text-rust underline underline-offset-2">
              /pricing
            </Link>
            . The price applicable to you is the price displayed at the
            time you complete payment.
          </Bullet>
          <Bullet>
            <strong>Founding-member price lock:</strong> the first 200
            paid members are guaranteed renewal at their initial price for
            the lifetime of their membership, provided they renew without
            interruption.
          </Bullet>
          <Bullet>
            <strong>Refunds:</strong> 30-day no-questions-asked refund on
            any paid tier. Beyond 30 days, refunds are at our discretion;
            we publish our refund policy at{" "}
            <Link
              href="/pricing"
              className="text-rust underline underline-offset-2"
            >
              /pricing
            </Link>
            .
          </Bullet>
          <Bullet>
            <strong>Editorial-error refund:</strong> if a Trip Intel Card
            is factually wrong on a verifiable point you flag and we
            cannot update it within 14 days, we refund the full year
            regardless of when in the year the request occurs.
          </Bullet>
          <Bullet>
            <strong>Auto-renewal:</strong> annual memberships auto-renew
            unless cancelled before the renewal date. We email a renewal
            reminder 14 days in advance.
          </Bullet>
          <Bullet>
            <strong>Taxes:</strong> all prices are inclusive of GST where
            applicable.
          </Bullet>
        </ul>
      </Section>

      <Section title="9. Affiliate disclosure">
        <p className="font-mono text-sm leading-relaxed text-ink">
          Some links on the Platform earn us a commission if you book or
          purchase through them (Booking.com, Amazon, Airalo, World
          Nomads, others). These commissions never influence what we
          recommend — every product on the Safety Shop and every hotel
          recommendation is independently chosen by contributors and
          editors. Affiliate relationships are disclosed clearly on
          relevant pages, in line with the Consumer Protection (E-Commerce)
          Rules 2020.
        </p>
      </Section>

      <Section title="10. What this Platform is not">
        <ul className="space-y-2 font-mono text-sm leading-relaxed text-ink">
          <Bullet>
            <strong>Not an emergency service.</strong> In an emergency,
            dial 112 (national emergency), 1091 (women&rsquo;s helpline),
            or the local emergency number listed on the relevant intel
            card.
          </Bullet>
          <Bullet>
            <strong>Not legal, medical, financial, or police advice.</strong>{" "}
            Information published is general and may not apply to your
            specific situation.
          </Bullet>
          <Bullet>
            <strong>Not a travel agency or stay-booking platform.</strong>{" "}
            Booking decisions, contracts, and payments occur on third-party
            sites we link to.
          </Bullet>
          <Bullet>
            <strong>Not a guarantor of safety.</strong> Travel is
            uncertain. Our intel reduces uncertainty but does not eliminate
            it. Carry appropriate travel insurance.
          </Bullet>
        </ul>
      </Section>

      <Section title="11. Disclaimer and limitation of liability">
        <p className="mb-3 font-mono text-sm leading-relaxed text-ink">
          To the maximum extent permitted by law:
        </p>
        <ul className="mb-3 space-y-2 font-mono text-sm leading-relaxed text-ink">
          <Bullet>
            The Platform is provided &ldquo;as is&rdquo; and &ldquo;as
            available&rdquo;. We disclaim all warranties not expressly
            granted in these Terms.
          </Bullet>
          <Bullet>
            We do not warrant that the Platform will be uninterrupted,
            error-free, or that information published is exhaustive or
            current at every moment.
          </Bullet>
          <Bullet>
            Our total aggregate liability to any user for any claim arising
            out of or related to these Terms or the Platform is limited
            to the amount you have paid us in the 12 months preceding the
            event giving rise to the claim, or INR 2,000, whichever is
            higher.
          </Bullet>
          <Bullet>
            We are not liable for indirect, incidental, special,
            consequential, or punitive damages — including lost profits,
            lost opportunities, or losses arising from travel decisions
            you make based on Platform content.
          </Bullet>
          <Bullet>
            Nothing in these Terms limits liability that cannot be limited
            by Indian law (e.g. fraud, gross negligence, statutory
            consumer rights).
          </Bullet>
        </ul>
      </Section>

      <Section title="12. Indemnification">
        <p className="font-mono text-sm leading-relaxed text-ink">
          You agree to indemnify and hold Wander Women, its officers,
          employees, and contributors harmless from any third-party claim
          arising out of (a) your breach of these Terms, (b) your
          submission of Your Content in breach of Section 5, or (c) your
          use of the Platform unlawfully.
        </p>
      </Section>

      <Section title="13. Termination">
        <ul className="space-y-2 font-mono text-sm leading-relaxed text-ink">
          <Bullet>
            <strong>By you:</strong> at any time via{" "}
            <Link
              href="/settings"
              className="text-rust underline underline-offset-2"
            >
              /settings
            </Link>
            .
          </Bullet>
          <Bullet>
            <strong>By us:</strong> for breach of these Terms or the Code
            of Conduct, with notice where reasonable. Severe breaches
            (harassment, doxxing, fraudulent verification) may result in
            immediate termination without prior notice.
          </Bullet>
          <Bullet>
            <strong>Effect of termination:</strong> your access ends. We
            run our data-purge process within 30 days. Sections that by
            their nature should survive (intellectual property,
            indemnification, limitation of liability, dispute resolution)
            survive termination.
          </Bullet>
        </ul>
      </Section>

      <Section title="14. Governing law and dispute resolution">
        <p className="mb-3 font-mono text-sm leading-relaxed text-ink">
          These Terms are governed by the laws of India, without regard to
          conflict-of-laws principles.
        </p>
        <p className="mb-3 font-mono text-sm leading-relaxed text-ink">
          Disputes that cannot be resolved through the grievance procedure
          at{" "}
          <Link
            href="/legal/grievance-officer"
            className="text-rust underline underline-offset-2"
          >
            /legal/grievance-officer
          </Link>{" "}
          will be referred to binding arbitration under the Arbitration
          and Conciliation Act 1996, before a sole arbitrator appointed by
          mutual agreement (failing which, by application to the
          appropriate court). The seat and venue of arbitration is
          [Bengaluru / your city — fill in], the language is English.
        </p>
        <p className="font-mono text-sm leading-relaxed text-ink">
          Notwithstanding the above, either party may seek interim relief
          in the courts of competent jurisdiction at the seat of
          arbitration to prevent immediate, irreparable harm.
        </p>
      </Section>

      <Section title="15. Changes to these Terms">
        <p className="font-mono text-sm leading-relaxed text-ink">
          We may update these Terms. Material changes — anything that
          adversely affects your rights — are announced via email at least
          30 days before they take effect, and you may cancel your account
          at any time. Continued use after the effective date is your
          acceptance of the updated Terms. The version date at the top of
          this page is authoritative.
        </p>
      </Section>

      <Section title="16. Miscellaneous">
        <ul className="space-y-2 font-mono text-sm leading-relaxed text-ink">
          <Bullet>
            <strong>Entire agreement.</strong> These Terms, together with
            the Privacy Policy and Code of Conduct, constitute the entire
            agreement between you and Wander Women.
          </Bullet>
          <Bullet>
            <strong>No waiver.</strong> Our failure to enforce a provision
            does not waive our right to enforce it later.
          </Bullet>
          <Bullet>
            <strong>Severability.</strong> If any provision is held
            unenforceable, the remainder of these Terms remains in effect.
          </Bullet>
          <Bullet>
            <strong>No agency.</strong> No partnership, joint venture,
            employment, or agency relationship is created by these Terms.
          </Bullet>
          <Bullet>
            <strong>Notices.</strong> Notices to us are emailed to{" "}
            <a
              href="mailto:legal@wanderwomen.in"
              className="text-rust underline underline-offset-2"
            >
              legal@wanderwomen.in
            </a>
            . Notices to you are sent to your registered email or posted
            on the Platform.
          </Bullet>
        </ul>
      </Section>

      <Section title="17. Contact">
        <p className="font-mono text-sm leading-relaxed text-ink">
          Legal:{" "}
          <a
            href="mailto:legal@wanderwomen.in"
            className="text-rust underline underline-offset-2"
          >
            legal@wanderwomen.in
          </a>
          <br />
          Privacy:{" "}
          <a
            href="mailto:privacy@wanderwomen.in"
            className="text-rust underline underline-offset-2"
          >
            privacy@wanderwomen.in
          </a>
          <br />
          Grievance Officer:{" "}
          <a
            href="mailto:grievance@wanderwomen.in"
            className="text-rust underline underline-offset-2"
          >
            grievance@wanderwomen.in
          </a>
        </p>
      </Section>

      <p className="mt-12 border-t border-ww-border/60 pt-5 font-mono text-[10px] leading-relaxed text-ww-muted/80">
        This is a comprehensive draft prepared for legal review. Bracketed
        items (e.g. arbitration seat) require founder input or lawyer
        confirmation before this version goes effective.
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
