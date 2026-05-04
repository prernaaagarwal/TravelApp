import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.EMAIL_FROM ?? "Wander Women <noreply@wanderwomen.in>";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

function getResend(): Resend | null {
  if (!RESEND_API_KEY) return null;
  return new Resend(RESEND_API_KEY);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function body(
  heading: string,
  message: string,
  opts?: { cta?: { label: string; href: string }; reason?: string }
) {
  const ctaBlock = opts?.cta
    ? `<p style="margin:24px 0 0"><a href="${opts.cta.href}" style="background:#1a1510;color:#faf8f4;padding:10px 20px;font-family:monospace;font-size:11px;letter-spacing:0.1em;text-decoration:none;text-transform:uppercase">${opts.cta.label}</a></p>`
    : "";
  const reasonBlock = opts?.reason
    ? `<div style="margin:20px 0 0;padding:14px 16px;border-left:3px solid #c4522a;background:#faf8f4">
         <p style="font-family:monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#8a7d72;margin:0 0 6px">Reason</p>
         <p style="font-family:Georgia,serif;font-size:14px;line-height:1.5;color:#1a1510;margin:0">${escapeHtml(opts.reason)}</p>
       </div>`
    : "";
  return `<div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;color:#1a1510;background:#f5f0e6;padding:32px">
    <p style="font-family:monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#8a7d72;margin:0 0 20px">Wander Women</p>
    <h1 style="font-size:24px;font-weight:400;margin:0 0 16px">${heading}</h1>
    <p style="font-family:monospace;font-size:13px;line-height:1.6;color:#8a7d72;margin:0">${message}</p>
    ${reasonBlock}
    ${ctaBlock}
    <hr style="border:none;border-top:1px solid #e0d8cc;margin:32px 0 16px"/>
    <p style="font-family:monospace;font-size:10px;color:#8a7d72;margin:0">
      <a href="${SITE_URL}" style="color:#c4522a;text-decoration:none">wanderwomen.in</a>
    </p>
  </div>`;
}

export async function sendTripApproved(to: string) {
  const resend = getResend();
  if (!resend) return;
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Your trip receipt is live on Wander Women",
    html: body(
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
    html: body(
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
    html: body(
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
    html: body(
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
    html: body(
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
    html: body(
      "Your beware report was not approved.",
      "Our team reviewed it and it did not meet our submission criteria. You are welcome to submit a revised version with more specific details.",
      { reason }
    ),
  });
}
