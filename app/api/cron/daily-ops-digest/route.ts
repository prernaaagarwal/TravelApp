// Daily ops digest — the 5-minute habit object
//
// Sends a single email to the founder every morning at 08:00 IST (02:30 UTC)
// summarizing what needs attention today:
//   - moderation queue depths (beware, user verifications, community/buddy)
//   - oldest item in each queue (the SLA-pressure signal)
//   - yesterday's signups + intel-card views (activity pulse)
//   - direct links to Sentry, /admin/cohorts, /admin/reports, etc.
//
// Design: this is a habit-forming email, not a dashboard.
// If the queues are healthy, the email is short and skimmable in 60 seconds.
// If something needs attention, the email is loud about it.
//
// Auth: same x-vercel-cron OR Bearer CRON_SECRET pattern as weekly-digest.

import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { env, requireEnv } from "@/lib/config";

export const maxDuration = 30;

function isAuthedCron(request: Request): boolean {
  if (request.headers.get("x-vercel-cron")) return true;
  const auth = request.headers.get("authorization");
  if (!auth) return false;
  const match = auth.match(/^Bearer\s+(.+)$/i);
  if (!match) return false;
  const expected = env.CRON_SECRET;
  if (!expected) return false;
  const a = Buffer.from(match[1], "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function adminSupabase() {
  return createSupabaseClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

const SITE_URL = env.NEXT_PUBLIC_SITE_URL;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

type QueueStat = {
  label: string;
  table: string;
  pending: number;
  oldestHours: number | null;
  link: string;
  slaHours: number;
};

async function getQueueStats() {
  const supabase = adminSupabase();
  const stats: QueueStat[] = [];

  // Beware reports awaiting moderation — 36-hour SLA
  const beware = await supabase
    .from("beware_reports")
    .select("created_at", { count: "exact" })
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .limit(1);
  stats.push({
    label: "Beware reports",
    table: "beware_reports",
    pending: beware.count ?? 0,
    oldestHours: beware.data?.[0]?.created_at
      ? Math.floor(
          (Date.now() - new Date(beware.data[0].created_at as string).getTime()) /
            (60 * 60 * 1000),
        )
      : null,
    link: `${SITE_URL}/admin/reports`,
    slaHours: 36,
  });

  // User verifications awaiting review — 72-hour SLA
  const verif = await supabase
    .from("user_verifications")
    .select("submitted_at", { count: "exact" })
    .eq("status", "pending")
    .not("id_photo_path", "is", null)
    .order("submitted_at", { ascending: true })
    .limit(1);
  stats.push({
    label: "User verifications",
    table: "user_verifications",
    pending: verif.count ?? 0,
    oldestHours: verif.data?.[0]?.submitted_at
      ? Math.floor(
          (Date.now() - new Date(verif.data[0].submitted_at as string).getTime()) /
            (60 * 60 * 1000),
        )
      : null,
    link: `${SITE_URL}/admin/verifications`,
    slaHours: 72,
  });

  // Community + buddy reports — 24-hour SLA
  const buddyReports = await supabase
    .from("buddy_profile_reports")
    .select("created_at", { count: "exact" })
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .limit(1);
  stats.push({
    label: "Buddy profile reports",
    table: "buddy_profile_reports",
    pending: buddyReports.count ?? 0,
    oldestHours: buddyReports.data?.[0]?.created_at
      ? Math.floor(
          (Date.now() - new Date(buddyReports.data[0].created_at as string).getTime()) /
            (60 * 60 * 1000),
        )
      : null,
    link: `${SITE_URL}/admin/buddy-reports`,
    slaHours: 24,
  });

  return stats;
}

async function getActivity24h() {
  const supabase = adminSupabase();
  const since = new Date(Date.now() - ONE_DAY_MS).toISOString();

  const [signups, views, newReports] = await Promise.all([
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .gte("created_at", since),
    supabase
      .from("intel_card_views")
      .select("id", { count: "exact", head: true })
      .gte("created_at", since),
    supabase
      .from("beware_reports")
      .select("id", { count: "exact", head: true })
      .gte("created_at", since),
  ]);

  return {
    signups: signups.count ?? 0,
    intelCardViews: views.count ?? 0,
    newBewareReports: newReports.count ?? 0,
  };
}

function isBreachingSla(s: QueueStat): boolean {
  return s.oldestHours !== null && s.oldestHours > s.slaHours;
}

function fmtHours(h: number | null): string {
  if (h == null) return "—";
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d ${h % 24}h`;
}

function buildHtml(
  stats: QueueStat[],
  activity: { signups: number; intelCardViews: number; newBewareReports: number },
  dateLabel: string,
): string {
  const totalPending = stats.reduce((s, q) => s + q.pending, 0);
  const slaBreaches = stats.filter(isBreachingSla);
  const headlineColor = slaBreaches.length > 0 ? "#c4522a" : totalPending > 0 ? "#b5860a" : "#4a7c59";
  const headline =
    slaBreaches.length > 0
      ? `${slaBreaches.length} item(s) past SLA — open admin`
      : totalPending > 0
      ? `${totalPending} pending — review today`
      : "Queues clear — 5-min check anyway";

  const rows = stats
    .map((s) => {
      const breach = isBreachingSla(s);
      const bg = breach ? "#fde8e0" : "#faf8f4";
      const label = breach ? `<strong style="color:#c4522a">${s.label}</strong>` : s.label;
      return `
        <tr style="background:${bg};">
          <td style="padding:10px 12px;border-bottom:1px solid #e0d8cc;font-family:monospace;font-size:13px;">
            ${label}
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #e0d8cc;font-family:monospace;font-size:13px;text-align:right;">
            ${s.pending}
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #e0d8cc;font-family:monospace;font-size:13px;text-align:right;color:${
            breach ? "#c4522a" : "#8a7d72"
          };">
            ${fmtHours(s.oldestHours)} / ${s.slaHours}h SLA
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #e0d8cc;font-family:monospace;font-size:12px;">
            <a href="${s.link}" style="color:#1a1510;">Open →</a>
          </td>
        </tr>`;
    })
    .join("");

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Daily ops digest — ${dateLabel}</title>
</head>
<body style="margin:0;padding:24px;background:#f5f0e6;font-family:Helvetica,Arial,sans-serif;color:#1a1510;">
  <div style="max-width:560px;margin:0 auto;background:#faf8f4;border:1px solid #e0d8cc;padding:0;">
    <div style="padding:20px 24px;border-bottom:1px solid #e0d8cc;">
      <p style="margin:0 0 4px;font-family:monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#8a7d72;">
        Wander Women · Daily ops · ${dateLabel}
      </p>
      <h1 style="margin:0;font-family:Georgia,serif;font-weight:300;font-size:24px;color:${headlineColor};">
        ${headline}
      </h1>
    </div>

    <div style="padding:20px 24px;">
      <p style="margin:0 0 8px;font-family:monospace;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#8a7d72;">
        Moderation queues
      </p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <tbody>${rows}</tbody>
      </table>

      <p style="margin:0 0 8px;font-family:monospace;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#8a7d72;">
        Last 24 hours
      </p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e0d8cc;font-family:monospace;font-size:13px;">New signups</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e0d8cc;font-family:monospace;font-size:13px;text-align:right;">${activity.signups}</td>
        </tr>
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e0d8cc;font-family:monospace;font-size:13px;">Intel card views</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e0d8cc;font-family:monospace;font-size:13px;text-align:right;">${activity.intelCardViews}</td>
        </tr>
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e0d8cc;font-family:monospace;font-size:13px;">New beware reports</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e0d8cc;font-family:monospace;font-size:13px;text-align:right;">${activity.newBewareReports}</td>
        </tr>
      </table>

      <p style="margin:0 0 8px;font-family:monospace;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#8a7d72;">
        Daily 5-min check
      </p>
      <ol style="margin:0 0 24px 18px;padding:0;font-family:monospace;font-size:13px;line-height:1.6;color:#1a1510;">
        <li>Sentry — last 24h errors: <a href="https://sentry.io" style="color:#c4522a;">open dashboard</a></li>
        <li>Cohorts — D1/D7/D30: <a href="${SITE_URL}/admin/cohorts" style="color:#c4522a;">open</a></li>
        <li>Above moderation queue links — clear anything past SLA</li>
        <li>If anything is concerning, write it down. Don't just close the tab.</li>
      </ol>

      <p style="margin:24px 0 0;font-family:Georgia,serif;font-style:italic;font-size:13px;color:#8a7d72;">
        This email exists so reading the moderation queue is a habit, not a guilt trip. If queues are clean, the 5-min check is just discipline maintenance.
      </p>
    </div>

    <div style="padding:16px 24px;background:#f5f0e6;font-family:monospace;font-size:10px;color:#8a7d72;text-align:center;border-top:1px solid #e0d8cc;">
      Sent ${new Date().toISOString()} · This digest is internal — not user-visible.
    </div>
  </div>
</body>
</html>`;
}

export async function GET(request: Request) {
  if (!isAuthedCron(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const founderEmail =
    env.FOUNDER_EMAIL ?? env.ADMIN_EMAIL ?? null;
  if (!founderEmail) {
    return NextResponse.json(
      { error: "FOUNDER_EMAIL or ADMIN_EMAIL must be configured" },
      { status: 500 },
    );
  }

  const resendKey = env.RESEND_API_KEY;
  if (!resendKey) {
    return NextResponse.json(
      { error: "RESEND_API_KEY is not configured" },
      { status: 500 },
    );
  }

  const [stats, activity] = await Promise.all([getQueueStats(), getActivity24h()]);
  const totalPending = stats.reduce((s, q) => s + q.pending, 0);
  const slaBreaches = stats.filter(isBreachingSla);

  const dateLabel = new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  const subject =
    slaBreaches.length > 0
      ? `[SLA breach] Daily ops · ${dateLabel}`
      : totalPending > 0
      ? `[${totalPending} pending] Daily ops · ${dateLabel}`
      : `Daily ops · ${dateLabel} · all clear`;

  const html = buildHtml(stats, activity, dateLabel);

  const resend = new Resend(resendKey);
  const { error } = await resend.emails.send({
    from: env.RESEND_FROM ?? "Wander Women Ops <ops@wanderwomen.in>",
    to: [founderEmail],
    subject,
    html,
  });

  if (error) {
    return NextResponse.json(
      { error: "Failed to send digest", details: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({
    sent: true,
    to: founderEmail,
    queue_pending: totalPending,
    sla_breaches: slaBreaches.length,
    activity,
    dispatched_at: new Date().toISOString(),
  });
}
