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
