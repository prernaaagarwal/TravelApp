// Pure HTML helpers for transactional emails.
// Kept separate from lib/email.ts (which holds the Resend SDK glue) so
// that the templated/escaped output can be unit-tested without mocking
// any external service.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export interface BodyOptions {
  cta?:    { label: string; href: string };
  reason?: string;
  // Optional footer link rendered above the wanderwomen.in mark — used for
  // unsubscribe / notification-preference links on opt-in emails.
  footer?: { label: string; href: string };
  // One-click unsubscribe URL. Rendered as a separate prominent line above
  // the standard footer so safety-first users never feel trapped — they
  // can leave with one click, no login required.
  unsubscribeUrl?: string;
}

/**
 * Renders a complete transactional email body.
 * Heading and message text are inserted verbatim — callers must ensure
 * they aren't user-controlled. The optional `reason` block IS escaped
 * because it comes from admin free-text input.
 */
export function buildBody(heading: string, message: string, opts: BodyOptions = {}): string {
  const ctaBlock = opts.cta
    ? `<p style="margin:24px 0 0"><a href="${opts.cta.href}" style="background:#1a1510;color:#faf8f4;padding:10px 20px;font-family:monospace;font-size:11px;letter-spacing:0.1em;text-decoration:none;text-transform:uppercase">${opts.cta.label}</a></p>`
    : "";

  const reasonBlock = opts.reason
    ? `<div style="margin:20px 0 0;padding:14px 16px;border-left:3px solid #c4522a;background:#faf8f4">
         <p style="font-family:monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#8a7d72;margin:0 0 6px">Reason</p>
         <p style="font-family:Georgia,serif;font-size:14px;line-height:1.5;color:#1a1510;margin:0">${escapeHtml(opts.reason)}</p>
       </div>`
    : "";

  const footerLink = opts.footer
    ? `<a href="${opts.footer.href}" style="color:#8a7d72;text-decoration:underline;margin-right:12px">${opts.footer.label}</a>`
    : "";

  const unsubscribeBlock = opts.unsubscribeUrl
    ? `<p style="font-family:monospace;font-size:11px;color:#8a7d72;margin:24px 0 0">
         Don&rsquo;t want these? <a href="${opts.unsubscribeUrl}" style="color:#c4522a;text-decoration:underline">Unsubscribe in one click</a>
         &mdash; no login needed.
       </p>`
    : "";

  return `<div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;color:#1a1510;background:#f5f0e6;padding:32px">
    <p style="font-family:monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#8a7d72;margin:0 0 20px">Wander Women</p>
    <h1 style="font-size:24px;font-weight:400;margin:0 0 16px">${heading}</h1>
    <p style="font-family:monospace;font-size:13px;line-height:1.6;color:#8a7d72;margin:0">${message}</p>
    ${reasonBlock}
    ${ctaBlock}
    ${unsubscribeBlock}
    <hr style="border:none;border-top:1px solid #e0d8cc;margin:32px 0 16px"/>
    <p style="font-family:monospace;font-size:10px;color:#8a7d72;margin:0">
      ${footerLink}<a href="${SITE_URL}" style="color:#c4522a;text-decoration:none">wanderwomen.in</a>
    </p>
  </div>`;
}
