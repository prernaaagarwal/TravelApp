import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  BarChart3,
  UserPlus,
  Mail,
  Eye,
  ShieldAlert,
  MessageSquare,
} from "lucide-react";

export const metadata = {
  title: "Metrics — Wander Women Admin",
};

// Investors will ask "how many users today?" mid-pitch and the answer needs to
// be live, not cached from build. Force dynamic so every load re-queries.
export const dynamic = "force-dynamic";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

type TopIntelRow = {
  slug: string;
  destination: string;
  country: string;
  view_count: number | null;
};

type StatTone = "rust" | "sage" | "gold" | "blue" | "purple";

const TONE_CLASSES: Record<StatTone, string> = {
  rust: "bg-rust/10 text-rust",
  sage: "bg-sage/10 text-sage",
  gold: "bg-gold/10 text-gold",
  blue: "bg-blue/10 text-blue",
  purple: "bg-purple/10 text-purple",
};

function formatNumber(n: number | null | undefined): string {
  if (n == null) return "—";
  return new Intl.NumberFormat("en-IN").format(n);
}

export default async function MetricsPage() {
  const supabase = await createClient();

  const now = new Date();
  const todayMidnight = new Date(now);
  todayMidnight.setHours(0, 0, 0, 0);
  const todayIso = todayMidnight.toISOString();
  const sevenAgoIso = new Date(now.getTime() - SEVEN_DAYS_MS).toISOString();
  const thirtyAgoIso = new Date(now.getTime() - THIRTY_DAYS_MS).toISOString();

  const [
    { count: signupsToday },
    { count: signups7d },
    { count: signups30d },
    { count: signupsTotal },
    { count: hellosPending },
    { count: hellos7d },
    { count: hellosAccepted7d },
    { count: hellosDecidedAll },
    { count: hellosAcceptedAll },
    { data: topIntelRaw },
    { count: bewares7d },
    { count: bewaresApproved7d },
    { count: bewaresApprovedAll },
    { count: posts7d },
    { count: postsApproved7d },
  ] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }).gte("created_at", todayIso),
    supabase.from("profiles").select("id", { count: "exact", head: true }).gte("created_at", sevenAgoIso),
    supabase.from("profiles").select("id", { count: "exact", head: true }).gte("created_at", thirtyAgoIso),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase
      .from("buddy_connections")
      .select("id", { count: "exact", head: true })
      .eq("recipient_decision", "pending"),
    supabase
      .from("buddy_connections")
      .select("id", { count: "exact", head: true })
      .gte("created_at", sevenAgoIso),
    supabase
      .from("buddy_connections")
      .select("id", { count: "exact", head: true })
      .gte("created_at", sevenAgoIso)
      .eq("recipient_decision", "accepted"),
    supabase
      .from("buddy_connections")
      .select("id", { count: "exact", head: true })
      .neq("recipient_decision", "pending"),
    supabase
      .from("buddy_connections")
      .select("id", { count: "exact", head: true })
      .eq("recipient_decision", "accepted"),
    supabase
      .from("intel_cards")
      .select("slug,destination,country,view_count")
      .order("view_count", { ascending: false, nullsFirst: false })
      .limit(5),
    supabase.from("beware_reports").select("id", { count: "exact", head: true }).gte("created_at", sevenAgoIso),
    supabase
      .from("beware_reports")
      .select("id", { count: "exact", head: true })
      .gte("created_at", sevenAgoIso)
      .eq("status", "approved"),
    supabase.from("beware_reports").select("id", { count: "exact", head: true }).eq("status", "approved"),
    supabase.from("community_posts").select("id", { count: "exact", head: true }).gte("created_at", sevenAgoIso),
    supabase
      .from("community_posts")
      .select("id", { count: "exact", head: true })
      .gte("created_at", sevenAgoIso)
      .eq("status", "approved"),
  ]);

  const topIntel = (topIntelRaw as TopIntelRow[] | null) ?? [];

  // All-time accept rate is a more honest number than a 7-day window: most
  // hellos sent in the last 7d are still pending, so a 7d ratio understates
  // engagement. All-time treats only decided hellos as the denominator.
  const acceptRatePct =
    (hellosDecidedAll ?? 0) > 0
      ? Math.round(((hellosAcceptedAll ?? 0) / (hellosDecidedAll ?? 1)) * 100)
      : null;

  const refreshedAt = now.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-10 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
            Founder dashboard
          </p>
          <h1 className="font-serif text-3xl text-ink">Metrics</h1>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-ww-muted">
          Live as of {refreshedAt} IST
        </p>
      </div>

      {/* ── Signups ── */}
      <Section icon={<UserPlus className="h-4 w-4" />} label="Signups">
        <StatGrid>
          <Stat tone="rust" label="Today" value={formatNumber(signupsToday)} />
          <Stat tone="rust" label="Last 7 days" value={formatNumber(signups7d)} />
          <Stat tone="rust" label="Last 30 days" value={formatNumber(signups30d)} />
          <Stat tone="rust" label="All time" value={formatNumber(signupsTotal)} />
        </StatGrid>
      </Section>

      {/* ── Buddy hellos ── */}
      <Section icon={<Mail className="h-4 w-4" />} label="Buddy hellos">
        <StatGrid>
          <Stat
            tone="gold"
            label="Pending now"
            value={formatNumber(hellosPending)}
            hint="Awaiting recipient response"
          />
          <Stat tone="sage" label="Sent (7d)" value={formatNumber(hellos7d)} />
          <Stat tone="sage" label="Accepted (7d)" value={formatNumber(hellosAccepted7d)} />
          <Stat
            tone="sage"
            label="Accept rate"
            value={acceptRatePct == null ? "—" : `${acceptRatePct}%`}
            hint="All-time, of decided hellos"
          />
        </StatGrid>
      </Section>

      {/* ── Trip Intel ── */}
      <Section icon={<Eye className="h-4 w-4" />} label="Trip intel — top 5 by views">
        {topIntel.length === 0 ? (
          <p className="font-mono text-xs text-ww-muted">No views recorded yet.</p>
        ) : (
          <ol className="divide-y divide-ww-border border border-ww-border bg-warm-white">
            {topIntel.map((card, i) => (
              <li key={card.slug} className="flex items-center justify-between gap-4 px-4 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ww-muted shrink-0">
                    #{i + 1}
                  </span>
                  <Link
                    href={`/intel/${card.slug}`}
                    className="font-serif text-base text-ink hover:text-rust truncate"
                  >
                    {card.destination}
                    <span className="ml-1 font-mono text-[10px] text-ww-muted">
                      {card.country}
                    </span>
                  </Link>
                </div>
                <span className="font-serif text-lg text-ink shrink-0">
                  {formatNumber(card.view_count)}
                  <span className="ml-1 font-mono text-[10px] uppercase tracking-widest text-ww-muted">
                    views
                  </span>
                </span>
              </li>
            ))}
          </ol>
        )}
      </Section>

      {/* ── Beware Board ── */}
      <Section icon={<ShieldAlert className="h-4 w-4" />} label="Beware Board">
        <StatGrid>
          <Stat tone="blue" label="Filed (7d)" value={formatNumber(bewares7d)} />
          <Stat tone="blue" label="Approved (7d)" value={formatNumber(bewaresApproved7d)} />
          <Stat tone="blue" label="Approved (all time)" value={formatNumber(bewaresApprovedAll)} />
        </StatGrid>
      </Section>

      {/* ── Community ── */}
      <Section icon={<MessageSquare className="h-4 w-4" />} label="Community posts">
        <StatGrid>
          <Stat tone="purple" label="Submitted (7d)" value={formatNumber(posts7d)} />
          <Stat tone="purple" label="Approved (7d)" value={formatNumber(postsApproved7d)} />
        </StatGrid>
      </Section>

      <p className="mt-12 border-t border-ww-border pt-6 font-mono text-[10px] text-ww-muted">
        <BarChart3 className="mr-1 inline h-3 w-3" />
        Numbers update on every page load. Cross-reference PostHog for funnel-level detail.
      </p>
    </div>
  );
}

function Section({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <div className="mb-3 flex items-center gap-2 text-ink">
        {icon}
        <h2 className="font-mono text-[11px] uppercase tracking-[0.2em]">{label}</h2>
      </div>
      {children}
    </section>
  );
}

function StatGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{children}</div>;
}

function Stat({
  tone,
  label,
  value,
  hint,
}: {
  tone: StatTone;
  label: string;
  value: string;
  hint?: string;
}) {
  const toneClass = TONE_CLASSES[tone];
  return (
    <div className="border border-ww-border bg-warm-white p-4">
      <div className={`mb-2 inline-flex items-center gap-1 px-1.5 py-0.5 ${toneClass}`}>
        <span className="font-mono text-[9px] uppercase tracking-widest">{label}</span>
      </div>
      <p className="font-serif text-3xl text-ink">{value}</p>
      {hint && <p className="mt-1 font-mono text-[9px] text-ww-muted">{hint}</p>}
    </div>
  );
}
