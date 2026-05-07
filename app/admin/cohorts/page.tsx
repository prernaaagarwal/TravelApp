import { createClient } from "@/lib/supabase/server";
import { LineChart, Users, Activity, Repeat, IndianRupee } from "lucide-react";

export const metadata = {
  title: "Cohorts — Wander Women Admin",
};

// Force dynamic so investors get live numbers, not build-cached ones.
export const dynamic = "force-dynamic";

type SignupRow = { cohort_week: string; signups: number };
type ActivationRow = {
  cohort_week: string;
  signups: number;
  activated: number;
  activation_pct: number | null;
};
type RetentionRow = {
  cohort_week: string;
  signups: number;
  d1_returned: number;
  d7_returned: number;
  d30_returned: number;
};
type RevenueRow = {
  cohort_week: string;
  signups: number;
  paid_members: number;
  paid_conversion_pct: number | null;
};

function fmtPct(numerator: number, denominator: number): string {
  if (!denominator) return "—";
  return `${((numerator / denominator) * 100).toFixed(1)}%`;
}

function fmtWeek(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });
}

export default async function CohortsPage() {
  const supabase = await createClient();

  const [signups, activation, retention, revenue] = await Promise.all([
    supabase
      .from("signup_cohorts")
      .select("cohort_week, signups")
      .limit(12)
      .returns<SignupRow[]>(),
    supabase
      .from("activation_cohorts")
      .select("cohort_week, signups, activated, activation_pct")
      .limit(12)
      .returns<ActivationRow[]>(),
    supabase
      .from("retention_cohorts")
      .select("cohort_week, signups, d1_returned, d7_returned, d30_returned")
      .limit(12)
      .returns<RetentionRow[]>(),
    supabase
      .from("revenue_cohorts")
      .select("cohort_week, signups, paid_members, paid_conversion_pct")
      .limit(12)
      .returns<RevenueRow[]>(),
  ]);

  const signupRows = signups.data ?? [];
  const activationRows = activation.data ?? [];
  const retentionRows = retention.data ?? [];
  const revenueRows = revenue.data ?? [];

  const totalSignups = signupRows.reduce((s, r) => s + r.signups, 0);
  const last4 = signupRows.slice(0, 4).reduce((s, r) => s + r.signups, 0);
  const prev4 = signupRows.slice(4, 8).reduce((s, r) => s + r.signups, 0);
  const wow = prev4 ? ((last4 - prev4) / prev4) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-ww-border pb-4">
        <LineChart className="h-5 w-5 text-rust" />
        <div>
          <h1 className="font-serif text-2xl text-ink">Cohorts</h1>
          <p className="font-mono text-xs text-ww-muted">
            Live read of weekly cohort retention. Service-role view; no caching.
          </p>
        </div>
      </div>

      {/* Headline numbers — what an investor asks for first. */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat
          icon={<Users className="h-4 w-4" />}
          label="Signups (all time)"
          value={totalSignups.toLocaleString("en-IN")}
        />
        <Stat
          icon={<Activity className="h-4 w-4" />}
          label="Last 4 weeks"
          value={last4.toLocaleString("en-IN")}
        />
        <Stat
          icon={<Repeat className="h-4 w-4" />}
          label="WoW (4w avg)"
          value={`${wow >= 0 ? "+" : ""}${wow.toFixed(1)}%`}
        />
        <Stat
          icon={<IndianRupee className="h-4 w-4" />}
          label="Paid members"
          value={revenueRows
            .reduce((s, r) => s + r.paid_members, 0)
            .toLocaleString("en-IN")}
        />
      </div>

      {/* Retention triangle — D1/D7/D30 per cohort. The investor question. */}
      <Section title="Retention by signup week (D1 / D7 / D30)">
        <table className="w-full font-mono text-xs">
          <thead className="border-b border-ww-border text-ww-muted">
            <tr>
              <th className="py-2 text-left">Week</th>
              <th className="py-2 text-right">Signups</th>
              <th className="py-2 text-right">D1</th>
              <th className="py-2 text-right">D7</th>
              <th className="py-2 text-right">D30</th>
            </tr>
          </thead>
          <tbody>
            {retentionRows.map((r) => (
              <tr key={r.cohort_week} className="border-b border-ww-border/40">
                <td className="py-2 text-ink">{fmtWeek(r.cohort_week)}</td>
                <td className="py-2 text-right text-ink">{r.signups}</td>
                <td className="py-2 text-right text-ink">
                  {fmtPct(r.d1_returned, r.signups)}
                </td>
                <td className="py-2 text-right text-ink">
                  {fmtPct(r.d7_returned, r.signups)}
                </td>
                <td className="py-2 text-right text-ink">
                  {fmtPct(r.d30_returned, r.signups)}
                </td>
              </tr>
            ))}
            {retentionRows.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-ww-muted">
                  No cohort data yet — view counts arrive once intel cards get
                  their first reads.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Section>

      {/* Activation — leading indicator of paid conversion. */}
      <Section title="Activation: read ≥1 intel card within 7 days of signup">
        <table className="w-full font-mono text-xs">
          <thead className="border-b border-ww-border text-ww-muted">
            <tr>
              <th className="py-2 text-left">Week</th>
              <th className="py-2 text-right">Signups</th>
              <th className="py-2 text-right">Activated</th>
              <th className="py-2 text-right">Rate</th>
            </tr>
          </thead>
          <tbody>
            {activationRows.map((r) => (
              <tr key={r.cohort_week} className="border-b border-ww-border/40">
                <td className="py-2 text-ink">{fmtWeek(r.cohort_week)}</td>
                <td className="py-2 text-right text-ink">{r.signups}</td>
                <td className="py-2 text-right text-ink">{r.activated}</td>
                <td className="py-2 text-right text-ink">
                  {r.activation_pct != null ? `${r.activation_pct}%` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      {/* Revenue — placeholder until Stripe is live. */}
      <Section title="Paid conversion by cohort">
        <p className="mb-3 font-mono text-xs text-ww-muted">
          Returns 0% until Stripe webhooks populate{" "}
          <code className="rounded bg-sand px-1">membership_tier</code>.
          Architecture is wired; revenue is the post-round milestone.
        </p>
        <table className="w-full font-mono text-xs">
          <thead className="border-b border-ww-border text-ww-muted">
            <tr>
              <th className="py-2 text-left">Week</th>
              <th className="py-2 text-right">Signups</th>
              <th className="py-2 text-right">Paid</th>
              <th className="py-2 text-right">Conv %</th>
            </tr>
          </thead>
          <tbody>
            {revenueRows.map((r) => (
              <tr key={r.cohort_week} className="border-b border-ww-border/40">
                <td className="py-2 text-ink">{fmtWeek(r.cohort_week)}</td>
                <td className="py-2 text-right text-ink">{r.signups}</td>
                <td className="py-2 text-right text-ink">{r.paid_members}</td>
                <td className="py-2 text-right text-ink">
                  {r.paid_conversion_pct != null
                    ? `${r.paid_conversion_pct}%`
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <div className="rounded border border-ww-border bg-warm-white p-4 font-mono text-xs text-ww-muted">
        <p className="mb-2 text-ink">
          <strong>For investors:</strong>
        </p>
        <p>
          These four views are computed live from{" "}
          <code className="rounded bg-sand px-1">signup_cohorts</code>,{" "}
          <code className="rounded bg-sand px-1">activation_cohorts</code>,{" "}
          <code className="rounded bg-sand px-1">retention_cohorts</code>, and{" "}
          <code className="rounded bg-sand px-1">revenue_cohorts</code> SQL
          views. See{" "}
          <code className="rounded bg-sand px-1">
            supabase/migrations/053_cohort_views.sql
          </code>{" "}
          and{" "}
          <code className="rounded bg-sand px-1">
            docs/investor/cohort-metrics.md
          </code>{" "}
          for the full schema and methodology.
        </p>
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded border border-ww-border bg-warm-white p-4">
      <div className="mb-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-ww-muted">
        {icon}
        {label}
      </div>
      <div className="font-serif text-2xl text-ink">{value}</div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded border border-ww-border bg-warm-white p-4">
      <h2 className="mb-3 font-serif text-lg text-ink">{title}</h2>
      {children}
    </section>
  );
}
