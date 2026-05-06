import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Contributor Dashboard — Wander Women",
  description: "Your contributions, attribution, and revenue share — live.",
};

interface PointsConfig {
  intel_view:         number;
  intel_verification: number;
  beware_helpful:     number;
  post_helpful:       number;
}

export default async function ContributorDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/account/login?next=/contributor/dashboard");

  // Look up the contributor row linked to this user
  const { data: contributor } = await supabase
    .from("contributors")
    .select("slug, name, full_name, photo_url, joined_date")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!contributor) {
    return <NotAContributor />;
  }

  const [
    { data: stats },
    { data: earnings },
    { data: pointsRow },
    { data: poolRow },
    { data: cards },
  ] = await Promise.all([
    supabase
      .from("contributor_stats")
      .select("*")
      .eq("slug", contributor.slug)
      .single(),
    supabase
      .from("contributor_earnings")
      .select("*")
      .eq("slug", contributor.slug)
      .single(),
    supabase
      .from("platform_settings")
      .select("value")
      .eq("key", "contributor_points")
      .single(),
    supabase
      .from("platform_settings")
      .select("value")
      .eq("key", "contributor_pool_inr_monthly")
      .single(),
    supabase
      .from("intel_cards")
      .select("slug, destination, country, view_count, verified_by_count, last_updated")
      .eq("contributor_slug", contributor.slug)
      .order("view_count", { ascending: false }),
  ]);

  const points = (pointsRow?.value as PointsConfig | null) ?? {
    intel_view: 1, intel_verification: 10, beware_helpful: 5, post_helpful: 2,
  };
  const poolInr = Number(poolRow?.value ?? 0);

  const totalPoints = (earnings?.total_points as number | undefined) ?? 0;
  const earningsInr = (earnings?.earnings_inr_monthly as number | undefined) ?? 0;

  const intelCards     = (stats?.intel_card_count     as number | undefined) ?? 0;
  const intelViews     = (stats?.intel_total_views    as number | undefined) ?? 0;
  const intelVerified  = (stats?.intel_verifications  as number | undefined) ?? 0;
  const bewareCount    = (stats?.beware_count         as number | undefined) ?? 0;
  const bewareHelpful  = (stats?.beware_total_helpful as number | undefined) ?? 0;
  const postCount      = (stats?.post_count           as number | undefined) ?? 0;
  const postHelpful    = (stats?.post_total_helpful   as number | undefined) ?? 0;

  return (
    <main className="min-h-screen bg-sand px-4 py-12">
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
              Contributor dashboard
            </p>
            <h1 className="mt-1 font-serif text-3xl text-ink md:text-4xl">
              {contributor.full_name ?? contributor.name}
            </h1>
            <p className="mt-1 font-mono text-xs text-ww-muted">
              Public profile:{" "}
              <Link href={`/contributor/${contributor.slug}`} className="text-rust hover:underline">
                /contributor/{contributor.slug} →
              </Link>
            </p>
          </div>
        </div>

        {/* Earnings card */}
        <section className="border border-ww-border bg-warm-white p-6">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ww-muted">
            This month&apos;s share
          </p>
          <p className="mt-2 font-serif text-5xl font-light text-ink md:text-6xl">
            ₹{earningsInr.toLocaleString("en-IN")}
          </p>
          <p className="mt-2 font-mono text-xs text-ww-muted">
            {totalPoints.toLocaleString("en-IN")} points · share of ₹{poolInr.toLocaleString("en-IN")} monthly contributor pool
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            <PointBreakdown
              label="Intel views"
              count={intelViews}
              perAction={points.intel_view}
            />
            <PointBreakdown
              label="Verifications"
              count={intelVerified}
              perAction={points.intel_verification}
            />
            <PointBreakdown
              label="Beware helpful"
              count={bewareHelpful}
              perAction={points.beware_helpful}
            />
            <PointBreakdown
              label="Post helpful"
              count={postHelpful}
              perAction={points.post_helpful}
            />
          </div>

          <p className="mt-5 border-t border-ww-border pt-4 font-mono text-[11px] leading-relaxed text-ww-muted">
            Earnings recompute every minute as new views and helpful votes roll in.
            Payout is processed on the 1st of the following month — UPI or bank transfer.
            <br />
            Formula: <code>(your_points / total_contributor_points) × monthly_pool</code>.
          </p>
        </section>

        {/* Activity stats */}
        <section>
          <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-ww-muted">
            Activity
          </h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <ActivityCard
              label="Intel cards"
              total={intelCards}
              detail={`${intelViews.toLocaleString("en-IN")} views · ${intelVerified} verifications`}
            />
            <ActivityCard
              label="Beware reports"
              total={bewareCount}
              detail={`${bewareHelpful} marked helpful`}
            />
            <ActivityCard
              label="Community posts"
              total={postCount}
              detail={`${postHelpful} marked helpful`}
            />
          </div>
        </section>

        {/* Per-card breakdown */}
        {cards && cards.length > 0 && (
          <section>
            <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-ww-muted">
              Your intel cards
            </h2>
            <div className="border border-ww-border bg-warm-white">
              <table className="w-full">
                <thead className="border-b border-ww-border">
                  <tr className="text-left">
                    <Th>Destination</Th>
                    <Th align="right">Views</Th>
                    <Th align="right">Verified</Th>
                    <Th align="right">Updated</Th>
                  </tr>
                </thead>
                <tbody>
                  {cards.map((c) => (
                    <tr key={c.slug as string} className="border-b border-ww-border last:border-b-0">
                      <Td>
                        <Link
                          href={`/intel/${c.slug}`}
                          className="font-serif text-base text-ink hover:text-rust"
                        >
                          {c.destination as string}
                        </Link>
                        <p className="font-mono text-[10px] text-ww-muted">
                          {c.country as string}
                        </p>
                      </Td>
                      <Td align="right">{(c.view_count as number).toLocaleString("en-IN")}</Td>
                      <Td align="right">{c.verified_by_count as number}</Td>
                      <Td align="right">
                        <span className="font-mono text-[10px] text-ww-muted">
                          {c.last_updated
                            ? new Date(c.last_updated as string).toLocaleDateString("en-IN", {
                                day: "numeric", month: "short", year: "numeric",
                              })
                            : "—"}
                        </span>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Payout history placeholder */}
        <section>
          <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-ww-muted">
            Payout history
          </h2>
          <div className="border border-dashed border-ww-border bg-warm-white p-6 text-center">
            <p className="font-mono text-xs text-ww-muted">
              No payouts yet. The first payout cycle starts when revenue begins flowing.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function NotAContributor() {
  return (
    <main className="min-h-screen bg-sand px-4 py-16">
      <div className="mx-auto max-w-md text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
          Contributor dashboard
        </p>
        <h1 className="mt-2 font-serif text-3xl text-ink">Not a contributor yet.</h1>
        <p className="mt-3 font-mono text-sm leading-relaxed text-ww-muted">
          Contributors are women who&apos;ve written intel cards, submitted high-quality
          beware reports, or answered community questions. We invite you when your
          contributions reach our quality bar — usually after 3-5 approved submissions.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Link
            href="/feed/submit"
            className="border border-ink bg-ink px-5 py-2 font-mono text-[10px] uppercase tracking-widest text-warm-white transition-colors hover:bg-ink/80"
          >
            Submit a trip receipt →
          </Link>
          <Link
            href="/contribute/report"
            className="border border-ww-border bg-warm-white px-5 py-2 font-mono text-[10px] uppercase tracking-widest text-ww-muted transition-colors hover:border-ink hover:text-ink"
          >
            Submit a report →
          </Link>
        </div>
      </div>
    </main>
  );
}

function PointBreakdown({ label, count, perAction }: { label: string; count: number; perAction: number }) {
  const pts = count * perAction;
  return (
    <div className="border border-ww-border bg-sand p-3">
      <p className="font-mono text-[10px] uppercase tracking-widest text-ww-muted">{label}</p>
      <p className="mt-1 font-serif text-xl text-ink">{count.toLocaleString("en-IN")}</p>
      <p className="mt-0.5 font-mono text-[10px] text-ww-muted">
        × {perAction} = <span className="text-ink">{pts.toLocaleString("en-IN")} pts</span>
      </p>
    </div>
  );
}

function ActivityCard({ label, total, detail }: { label: string; total: number; detail: string }) {
  return (
    <div className="border border-ww-border bg-warm-white p-5">
      <p className="font-mono text-[10px] uppercase tracking-widest text-ww-muted">{label}</p>
      <p className="mt-2 font-serif text-3xl font-light text-ink">{total}</p>
      <p className="mt-1 font-mono text-[11px] text-ww-muted">{detail}</p>
    </div>
  );
}

function Th({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" }) {
  return (
    <th className={`px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-ww-muted text-${align}`}>
      {children}
    </th>
  );
}

function Td({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" }) {
  return <td className={`px-4 py-3 text-sm text-ink text-${align}`}>{children}</td>;
}
