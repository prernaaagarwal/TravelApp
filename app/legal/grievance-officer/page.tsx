import Link from "next/link";
import { ShieldAlert, Mail, FileWarning, Clock, MapPin } from "lucide-react";

export const metadata = {
  title: "Grievance Officer — Wander Women",
  description:
    "Resident Grievance Officer for Wander Women under Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021. Acknowledgement within 24 hours, resolution within 15 days.",
  alternates: { canonical: "/legal/grievance-officer" },
};

// Compliance page required of intermediaries under Rule 3(2) of the IT
// (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021.
// Must be publicly accessible, must list a real RGO contact, must
// describe the grievance redressal mechanism and timelines.
//
// Section 79 of the IT Act gives intermediaries safe harbor from third-
// party content liability *only if* this page exists, the RGO is
// reachable, and grievances are resolved within 15 days.

export default function GrievanceOfficerPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
        Compliance · IT Rules 2021
      </p>
      <h1 className="mb-3 font-serif text-4xl text-ink md:text-5xl">
        Resident Grievance Officer
      </h1>
      <p className="mb-8 font-mono text-xs leading-relaxed text-ww-muted">
        Last updated: 7 May 2026 · This page satisfies Rule 3(2) of the
        Information Technology (Intermediary Guidelines and Digital Media
        Ethics Code) Rules, 2021.
      </p>

      <section className="mb-10 border border-rust/30 bg-rust/5 p-5">
        <div className="mb-3 flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-rust" />
          <h2 className="font-serif text-xl text-ink">Officer details</h2>
        </div>
        <ul className="space-y-2 font-mono text-sm leading-relaxed text-ink">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 w-24 shrink-0 text-ww-muted">Name</span>
            <span>[Founder name — fill in]</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 w-24 shrink-0 text-ww-muted">Designation</span>
            <span>Resident Grievance Officer, Wander Women</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 w-24 shrink-0 text-ww-muted">Email</span>
            <a
              href="mailto:grievance@wanderwomen.in"
              className="text-rust underline underline-offset-2"
            >
              grievance@wanderwomen.in
            </a>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 w-24 shrink-0 text-ww-muted">Address</span>
            <span>
              [Registered office address — fill in once Pvt Ltd registration completes]
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 w-24 shrink-0 text-ww-muted">Hours</span>
            <span>Monday–Friday, 09:00–18:00 IST (excluding public holidays)</span>
          </li>
        </ul>
      </section>

      <Section title="What you can write to the Grievance Officer about">
        <ul className="space-y-3 font-mono text-sm leading-relaxed text-ink">
          <Bullet>
            <strong>Defamatory or false content</strong> — a Beware Board
            report, intel-card claim, or community post you believe is
            defamatory, factually wrong, or unlawfully attributes harm to
            you or your business.
          </Bullet>
          <Bullet>
            <strong>Personal information misuse</strong> — content that
            shares your private information without consent (DPDP Act 2023
            and Rule 3(2)(b)).
          </Bullet>
          <Bullet>
            <strong>Impersonation</strong> — an account or profile
            pretending to be you, your business, or a person you represent.
          </Bullet>
          <Bullet>
            <strong>Intellectual property infringement</strong> — content
            that copies your photographs, text, or registered marks without
            permission (separate IP-takedown email at{" "}
            <a
              href="mailto:ip@wanderwomen.in"
              className="text-rust underline underline-offset-2"
            >
              ip@wanderwomen.in
            </a>
            ).
          </Bullet>
          <Bullet>
            <strong>Account or moderation decisions</strong> — appeals
            against suspensions, bans, or rejected verifications.
          </Bullet>
          <Bullet>
            <strong>Other rule-violating content</strong> as defined in
            Rule 3(1)(b) of the IT Rules 2021.
          </Bullet>
        </ul>
      </Section>

      <Section title="How to file a grievance">
        <ol className="space-y-3 font-mono text-sm leading-relaxed text-ink">
          <Bullet>
            <strong>Step 1.</strong> Email{" "}
            <a
              href="mailto:grievance@wanderwomen.in"
              className="text-rust underline underline-offset-2"
            >
              grievance@wanderwomen.in
            </a>{" "}
            with the subject line:{" "}
            <code className="bg-sand px-1.5 py-0.5">
              Grievance — [type] — [URL or content ID]
            </code>
          </Bullet>
          <Bullet>
            <strong>Step 2.</strong> Include in the body:
            <ul className="mt-2 space-y-1 pl-4">
              <li>
                — Your full name and contact phone (kept confidential)
              </li>
              <li>
                — A clear description of the issue
              </li>
              <li>
                — The exact URL of the content you are flagging
              </li>
              <li>
                — Why the content violates law or our rules
              </li>
              <li>
                — Any supporting evidence (screenshots, links, documents)
              </li>
              <li>
                — A signed statement that the information you are providing
                is true to the best of your knowledge
              </li>
            </ul>
          </Bullet>
          <Bullet>
            <strong>Step 3.</strong> You will receive an automated
            acknowledgement within 24 hours. The Grievance Officer will
            review and respond with a decision within 15 days, in line with
            Rule 3(2)(b).
          </Bullet>
          <Bullet>
            <strong>Step 4 (if unresolved).</strong> You may escalate to the
            Grievance Appellate Committee under Rule 3A of the IT Rules
            2021, accessible at{" "}
            <a
              href="https://gac.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-rust underline underline-offset-2"
            >
              gac.gov.in
            </a>
            .
          </Bullet>
        </ol>
      </Section>

      <Section title="What we do when we receive a grievance">
        <ul className="space-y-3 font-mono text-sm leading-relaxed text-ink">
          <Bullet>
            <Clock className="inline h-4 w-4 text-rust" />{" "}
            <strong>Within 24 hours:</strong> automated acknowledgement of
            your complaint with a tracking ID.
          </Bullet>
          <Bullet>
            <Clock className="inline h-4 w-4 text-rust" />{" "}
            <strong>Within 36 hours:</strong> the flagged content goes to
            our moderation queue and is reviewed against our{" "}
            <Link
              href="/code-of-conduct"
              className="text-rust underline underline-offset-2"
            >
              Code of Conduct
            </Link>{" "}
            and applicable law. Content that is clearly defamatory or
            unlawful may be removed during this initial review pending
            full investigation.
          </Bullet>
          <Bullet>
            <FileWarning className="inline h-4 w-4 text-rust" />{" "}
            <strong>Within 15 days:</strong> a final written decision —
            either action taken (content removed, user banned, etc.) or a
            reasoned explanation if no action is taken.
          </Bullet>
          <Bullet>
            <strong>Audit log retention:</strong> every grievance and the
            decision is logged in our internal{" "}
            <code className="bg-sand px-1.5 py-0.5">moderation_audit_log</code>{" "}
            and retained for 180 days minimum, in line with Rule 5 of the
            IT Rules 2021.
          </Bullet>
        </ul>
      </Section>

      <Section title="What we cannot help with">
        <ul className="space-y-2 font-mono text-sm leading-relaxed text-ink">
          <Bullet>
            Civil disputes between two users that do not involve content
            on our platform — these are between the parties and, if
            necessary, the police or civil courts.
          </Bullet>
          <Bullet>
            Emergencies — call 112 (national emergency) or 1091 (women's
            helpline). The Grievance Officer is not an emergency contact.
          </Bullet>
          <Bullet>
            Editorial disagreements — we may decline to edit a published
            intel card if the underlying claim is verified, even if you
            disagree with the framing.
          </Bullet>
          <Bullet>
            Removing content from third-party sites that have copied or
            embedded our content — please contact the third-party platform
            directly.
          </Bullet>
        </ul>
      </Section>

      <Section title="If you are a law-enforcement officer">
        <p className="font-mono text-sm leading-relaxed text-ink">
          Lawful information requests under the IT Act, CrPC, or Bharatiya
          Nagarik Suraksha Sanhita should be sent to{" "}
          <a
            href="mailto:legal@wanderwomen.in"
            className="text-rust underline underline-offset-2"
          >
            legal@wanderwomen.in
          </a>{" "}
          on letterhead, with the requesting officer&rsquo;s rank, ID
          number, jurisdiction, and the legal authority cited. We respond
          to lawful requests promptly while protecting users&rsquo; rights
          to the maximum extent permitted by law.
        </p>
      </Section>

      <Section title="Contact summary">
        <ul className="space-y-2 font-mono text-sm leading-relaxed text-ink">
          <li className="flex items-start gap-2">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-rust" />
            <span>
              <strong>Grievances:</strong>{" "}
              <a
                href="mailto:grievance@wanderwomen.in"
                className="text-rust underline underline-offset-2"
              >
                grievance@wanderwomen.in
              </a>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-rust" />
            <span>
              <strong>IP / Copyright:</strong>{" "}
              <a
                href="mailto:ip@wanderwomen.in"
                className="text-rust underline underline-offset-2"
              >
                ip@wanderwomen.in
              </a>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-rust" />
            <span>
              <strong>Law-enforcement requests:</strong>{" "}
              <a
                href="mailto:legal@wanderwomen.in"
                className="text-rust underline underline-offset-2"
              >
                legal@wanderwomen.in
              </a>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-rust" />
            <span>
              <strong>Privacy / DPDP requests:</strong>{" "}
              <a
                href="mailto:privacy@wanderwomen.in"
                className="text-rust underline underline-offset-2"
              >
                privacy@wanderwomen.in
              </a>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-rust" />
            <span>
              <strong>Postal:</strong>{" "}
              [Registered address to be added once Pvt Ltd registration
              completes]
            </span>
          </li>
        </ul>
      </Section>

      <p className="mt-12 border-t border-ww-border/60 pt-5 font-mono text-[10px] leading-relaxed text-ww-muted/80">
        This page is provided to comply with Rule 3(2) of the Information
        Technology (Intermediary Guidelines and Digital Media Ethics Code)
        Rules, 2021. The named Grievance Officer&rsquo;s details are
        published in good faith. Wander Women reserves the right to change
        the Grievance Officer with notice on this page.
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
