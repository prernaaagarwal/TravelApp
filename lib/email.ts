import { Resend } from "resend";
import { buildBody } from "@/lib/email-template";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.EMAIL_FROM ?? "Wander Women <noreply@wanderwomen.in>";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

function getResend(): Resend | null {
  if (!RESEND_API_KEY) return null;
  return new Resend(RESEND_API_KEY);
}

export async function sendTripApproved(to: string) {
  const resend = getResend();
  if (!resend) return;
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Your trip receipt is live on Wander Women",
    html: buildBody(
      "Your trip receipt is live.",
      "It has been reviewed and approved — it is now visible on the trip feed and will help future solo travellers budget their trips.",
      { cta: { label: "View the feed →", href: `${SITE_URL}/feed` } }
    ),
  });
}

export async function sendTripRejected(to: string, reason?: string) {
  const resend = getResend();
  if (!resend) return;
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Update on your Wander Women submission",
    html: buildBody(
      "Your trip submission was not approved.",
      "Our team reviewed your receipt and it did not meet our current guidelines. You are welcome to submit a revised version. If you think this is an error, reply to this email.",
      { reason }
    ),
  });
}

export async function sendPostApproved(to: string) {
  const resend = getResend();
  if (!resend) return;
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Your community post is live on Wander Women",
    html: buildBody(
      "Your post is live.",
      "It has been approved and is now visible in the community feed.",
      { cta: { label: "Go to community →", href: `${SITE_URL}/community` } }
    ),
  });
}

export async function sendPostRejected(to: string, reason?: string) {
  const resend = getResend();
  if (!resend) return;
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Update on your Wander Women post",
    html: buildBody(
      "Your community post was not approved.",
      "Our team reviewed your post and it did not meet our community guidelines. You are welcome to submit a revised version.",
      { reason }
    ),
  });
}

export async function sendBewareApproved(to: string) {
  const resend = getResend();
  if (!resend) return;
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Your beware report is live on Wander Women",
    html: buildBody(
      "Your beware report is live.",
      "It has been approved and is now visible on the Beware Board. Thank you for keeping the community safer.",
      { cta: { label: "View Beware Board →", href: `${SITE_URL}/community` } }
    ),
  });
}

export async function sendBewareRejected(to: string, reason?: string) {
  const resend = getResend();
  if (!resend) return;
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Update on your Wander Women beware report",
    html: buildBody(
      "Your beware report was not approved.",
      "Our team reviewed it and it did not meet our submission criteria. You are welcome to submit a revised version with more specific details.",
      { reason }
    ),
  });
}

// ── Identity verification (Buddy gate) ──────────────────────────────────────
export async function sendVerificationApproved(to: string) {
  const resend = getResend();
  if (!resend) return;
  await resend.emails.send({
    from: FROM,
    to,
    subject: "You're verified on Wander Women",
    html: buildBody(
      "You're verified.",
      "Phone confirmed and ID reviewed — you can now send hellos on the Buddy page. As promised, we've deleted your ID photo from our servers; we keep only the verified flag and the date.",
      { cta: { label: "Find a buddy →", href: `${SITE_URL}/buddy` } }
    ),
  });
}

export async function sendVerificationRejected(to: string, reason?: string) {
  const resend = getResend();
  if (!resend) return;
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Update on your Wander Women verification",
    html: buildBody(
      "We couldn't verify your account.",
      "Our team reviewed your submission and couldn't confirm your identity from the photo. You can re-upload a clearer ID-and-selfie photo at any time.",
      { reason, cta: { label: "Try again →", href: `${SITE_URL}/account/verify` } }
    ),
  });
}

// ── Buddy profile reports ───────────────────────────────────────────────────
export async function sendBuddyReportAcknowledged(to: string) {
  const resend = getResend();
  if (!resend) return;
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Thanks for the report — we'll review within 24 hours",
    html: buildBody(
      "Thanks for the report.",
      "A member of our team will review the profile within 24 hours. If two or more members of the community have flagged the same profile, it has already been auto-paused while we review. We'll email you once we've reached a decision."
    ),
  });
}

export async function sendBuddyReportResolved(
  to: string,
  outcome: "actioned" | "dismissed",
) {
  const resend = getResend();
  if (!resend) return;
  const dismissed = outcome === "dismissed";
  await resend.emails.send({
    from: FROM,
    to,
    subject: dismissed
      ? "We reviewed the profile you flagged"
      : "We took action on the profile you flagged",
    html: buildBody(
      dismissed ? "Reviewed — no violation found." : "We took action.",
      dismissed
        ? "Our team reviewed the profile you reported and didn't find a violation of our community guidelines. The profile is back online. If you see new behaviour that worries you, please report again."
        : "Our team reviewed the profile you reported and removed it from Buddy matching. Thank you for keeping this community safer."
    ),
  });
}

// Sunday-morning digest. Bundles medium-severity bewares + new intel cards
// in saved destinations + (optionally) platform-wide new intel cards into
// one calm email. Critical/high beware reports keep their per-approval
// path in lib/notify-saved-destinations.ts.
//
// `htmlBody` is built by lib/digest.ts:formatDigestEmail (already includes
// the unsubscribe link in the footer). We also set RFC 8058 List-Unsubscribe
// headers so Gmail / Apple Mail render their inline native "Unsubscribe"
// button at the top of the email.
export async function sendWeeklyDigest(
  to: string,
  htmlBody: string,
  unsubscribeUrl: string,
) {
  const resend = getResend();
  if (!resend) return;
  await resend.emails.send({
    from: FROM,
    to,
    subject: "This week in your saved destinations — Wander Women",
    html: htmlBody,
    headers: {
      // RFC 2369 + RFC 8058: client-rendered native unsubscribe button.
      "List-Unsubscribe": `<${unsubscribeUrl}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  });
}

// Sent to a user who saved a destination when a new beware report is approved
// for that destination. The retention loop: dossier read → save → return when
// something changes. Sender is responsible for batching / rate-limiting.
export async function sendBewareAlertToSaver(
  to: string,
  args: {
    destinationLabel: string;
    destinationSlug: string;
    reportTitle: string;
    reportSeverity: string;
    reportLocation: string | null;
  },
) {
  const resend = getResend();
  if (!resend) return;

  const severityLine = args.reportSeverity
    ? `Severity: ${args.reportSeverity}.`
    : "";
  const locationLine = args.reportLocation
    ? ` Reported at ${args.reportLocation}.`
    : "";

  await resend.emails.send({
    from: FROM,
    to,
    subject: `New safety report in ${args.destinationLabel} — ${args.reportTitle}`,
    html: buildBody(
      `New safety report in ${args.destinationLabel}.`,
      `${args.reportTitle}. ${severityLine}${locationLine} You're getting this because you saved ${args.destinationLabel} on Wander Women.`,
      {
        cta: {
          label: `View the Beware Board →`,
          href: `${SITE_URL}/community?tab=beware&country=india&city=${args.destinationSlug}`,
        },
        footer: {
          label: "Manage these alerts",
          href:  `${SITE_URL}/settings#notifications`,
        },
      },
    ),
  });
}
