import type { SupabaseClient } from "@supabase/supabase-js";
import { CITY_LABELS } from "@/lib/constants";
import { env } from "@/lib/config";

// Pure functions for the weekly digest. The cron handler does I/O; this
// file just turns inputs into a payload + the payload into HTML so each
// piece is unit-testable without Supabase or Resend.

export type DigestBeware = {
  id: string;
  title: string;
  severity: string | null;
  destinationSlug: string;
  destinationLabel: string;
  location: string | null;
};

export type DigestIntel = {
  slug: string;
  destination: string;
  country: string;
  contributorSlug: string | null;
};

export type DigestPayload = {
  bewares: DigestBeware[];        // medium-severity reports in saved destinations
  savedIntel: DigestIntel[];      // new intel cards in saved destinations
  platformIntel: DigestIntel[];   // all new intel cards (only if user opted into platform_updates)
};

function destinationLabel(slug: string): string {
  if (CITY_LABELS[slug]) return CITY_LABELS[slug];
  const parts = slug.split("-");
  parts.pop();
  return parts
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

// Build the per-user payload by querying the last-week slice of bewares +
// intel cards. Caller passes a service-role Supabase client.
export async function buildDigestForUser(
  admin: SupabaseClient,
  userId: string,
  since: Date,
  options: { includePlatformIntel: boolean },
): Promise<DigestPayload> {
  // 1. Saved destination slugs for the user.
  const { data: saves } = await admin
    .from("saved_destinations")
    .select("destination_slug")
    .eq("user_id", userId);

  const savedSlugs = (saves ?? [])
    .map((s) => s.destination_slug as string)
    .filter((s): s is string => !!s);

  const sinceIso = since.toISOString();

  // 2. Medium-severity bewares approved this week, in saved destinations only.
  let bewares: DigestBeware[] = [];
  if (savedSlugs.length > 0) {
    const { data: rows } = await admin
      .from("beware_reports")
      .select("id, title, severity, destination_slug, location, status, reviewed_at")
      .in("destination_slug", savedSlugs)
      .eq("status", "approved")
      .eq("severity", "medium")
      .gte("reviewed_at", sinceIso);

    bewares = (rows ?? []).map((r) => ({
      id: r.id as string,
      title: r.title as string,
      severity: (r.severity as string | null) ?? null,
      destinationSlug: r.destination_slug as string,
      destinationLabel: destinationLabel(r.destination_slug as string),
      location: (r.location as string | null) ?? null,
    }));
  }

  // 3. Intel cards published this week in saved destinations.
  let savedIntel: DigestIntel[] = [];
  if (savedSlugs.length > 0) {
    const { data: rows } = await admin
      .from("intel_cards")
      .select("slug, destination, country, contributor_slug, created_at")
      .in("slug", savedSlugs)
      .gte("created_at", sinceIso);

    savedIntel = (rows ?? []).map((r) => ({
      slug: r.slug as string,
      destination: r.destination as string,
      country: r.country as string,
      contributorSlug: (r.contributor_slug as string | null) ?? null,
    }));
  }

  // 4. Platform-wide new intel (only if user opted in to platform_updates).
  //    Excludes anything already in savedIntel so the same card doesn't
  //    appear twice in the email.
  let platformIntel: DigestIntel[] = [];
  if (options.includePlatformIntel) {
    const { data: rows } = await admin
      .from("intel_cards")
      .select("slug, destination, country, contributor_slug, created_at")
      .gte("created_at", sinceIso);

    const savedSet = new Set(savedIntel.map((i) => i.slug));
    platformIntel = (rows ?? [])
      .filter((r) => !savedSet.has(r.slug as string))
      .map((r) => ({
        slug: r.slug as string,
        destination: r.destination as string,
        country: r.country as string,
        contributorSlug: (r.contributor_slug as string | null) ?? null,
      }));
  }

  return { bewares, savedIntel, platformIntel };
}

// True if there's anything worth emailing about. Used by the cron handler
// to skip empty digests entirely — nobody wants a "nothing happened"
// Sunday email.
export function isDigestEmpty(payload: DigestPayload): boolean {
  return (
    payload.bewares.length === 0 &&
    payload.savedIntel.length === 0 &&
    payload.platformIntel.length === 0
  );
}

// Build the HTML body. Kept inline in lib/digest.ts (rather than splitting
// into email-template) because the layout is digest-specific — grouped by
// destination with section headers — and reusing buildBody's heading +
// single-paragraph format would be awkward.
const SITE_URL = env.NEXT_PUBLIC_SITE_URL;

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function formatDigestEmail(
  payload: DigestPayload,
  unsubscribeUrl: string,
): string {
  const bewareSection =
    payload.bewares.length === 0
      ? ""
      : `<div style="margin:24px 0 0">
           <p style="font-family:monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#c4522a;margin:0 0 8px">
             New beware reports in your saved destinations
           </p>
           <ul style="margin:0;padding:0;list-style:none">
             ${payload.bewares
               .map(
                 (b) =>
                   `<li style="margin:0 0 10px;padding:10px 12px;background:#faf8f4;border-left:3px solid #c4522a">
                      <p style="font-family:Georgia,serif;font-size:14px;margin:0 0 4px;color:#1a1510">${escape(b.title)}</p>
                      <p style="font-family:monospace;font-size:11px;color:#8a7d72;margin:0">
                        ${escape(b.destinationLabel)}${b.location ? " · " + escape(b.location) : ""} · medium severity
                        &nbsp;<a href="${SITE_URL}/community?tab=beware&country=india&city=${encodeURIComponent(b.destinationSlug)}" style="color:#c4522a;text-decoration:underline">View</a>
                      </p>
                    </li>`,
               )
               .join("")}
           </ul>
         </div>`;

  const savedIntelSection =
    payload.savedIntel.length === 0
      ? ""
      : `<div style="margin:24px 0 0">
           <p style="font-family:monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#4a7c59;margin:0 0 8px">
             New intel cards in your saved destinations
           </p>
           <ul style="margin:0;padding:0;list-style:none">
             ${payload.savedIntel
               .map(
                 (c) =>
                   `<li style="margin:0 0 10px;padding:10px 12px;background:#faf8f4;border-left:3px solid #4a7c59">
                      <p style="font-family:Georgia,serif;font-size:14px;margin:0 0 4px;color:#1a1510">${escape(c.destination)}, ${escape(c.country)}</p>
                      <a href="${SITE_URL}/intel/${c.slug}" style="font-family:monospace;font-size:11px;color:#c4522a;text-decoration:underline">Read the card &rarr;</a>
                    </li>`,
               )
               .join("")}
           </ul>
         </div>`;

  const platformSection =
    payload.platformIntel.length === 0
      ? ""
      : `<div style="margin:24px 0 0">
           <p style="font-family:monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#8a7d72;margin:0 0 8px">
             Also new across the platform
           </p>
           <ul style="margin:0;padding:0;list-style:none">
             ${payload.platformIntel
               .map(
                 (c) =>
                   `<li style="margin:0 0 6px">
                      <a href="${SITE_URL}/intel/${c.slug}" style="font-family:Georgia,serif;font-size:14px;color:#1a1510;text-decoration:none">
                        ${escape(c.destination)}, ${escape(c.country)} &rarr;
                      </a>
                    </li>`,
               )
               .join("")}
           </ul>
         </div>`;

  return `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1a1510;background:#f5f0e6;padding:32px">
    <p style="font-family:monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#8a7d72;margin:0 0 16px">Wander Women &middot; weekly digest</p>
    <h1 style="font-size:22px;font-weight:400;margin:0 0 8px">This week in your saved destinations.</h1>
    <p style="font-family:monospace;font-size:13px;line-height:1.6;color:#8a7d72;margin:0">
      Critical scams already arrived in your inbox the day they were posted &mdash; this email is the calm Sunday recap.
    </p>
    ${bewareSection}
    ${savedIntelSection}
    ${platformSection}
    <p style="font-family:monospace;font-size:11px;color:#8a7d72;margin:28px 0 0">
      Don&rsquo;t want these? <a href="${unsubscribeUrl}" style="color:#c4522a;text-decoration:underline">Unsubscribe in one click</a>
      &mdash; no login needed. <a href="${SITE_URL}/settings#notifications" style="color:#8a7d72;text-decoration:underline;margin-left:6px">Manage all preferences</a>
    </p>
    <hr style="border:none;border-top:1px solid #e0d8cc;margin:20px 0 12px"/>
    <p style="font-family:monospace;font-size:10px;color:#8a7d72;margin:0">
      <a href="${SITE_URL}" style="color:#c4522a;text-decoration:none">wanderwomen.in</a>
    </p>
  </div>`;
}
