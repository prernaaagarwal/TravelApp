import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ModerationQueue } from "@/components/admin/ModerationQueue";
import { Clock, CheckCircle, XCircle, Flag } from "lucide-react";
import { deactivateUser, dismissUserFlags } from "@/app/admin/team/actions";

export const metadata = {
  title: "Moderation Queue — Wander Women Admin",
};

export const dynamic = "force-dynamic";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

type FlagProfile = { id: string; first_name: string | null; username: string | null; email: string | null };
type FlagRow = { reported_user_id: string; reason: string; created_at: string; profiles: FlagProfile[] };

export default async function AdminPage() {
  const supabase = await createClient();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayIso = today.toISOString();

  const [
    { data: pendingPosts },
    { data: pendingBewares },
    { data: pendingTrips },
    { count: approvedToday },
    { count: rejectedToday },
    { data: flaggedRaw },
  ] = await Promise.all([
    supabase
      .from("community_posts")
      .select("id,tab,title,author_id,author_name,content,destination,created_at")
      .eq("status", "pending")
      .order("created_at", { ascending: true }),
    supabase
      .from("beware_reports")
      .select("id,title,description,category,severity,city,reported_by_id,reported_by_name,created_at")
      .eq("status", "pending")
      .order("created_at", { ascending: true }),
    supabase
      .from("trip_submissions")
      .select("id,user_id,destination,destination_slug,trip_start,trip_end,day_count,total_cost_inr,highlight,created_at")
      .eq("status", "pending")
      .order("created_at", { ascending: true }),
    supabase
      .from("beware_reports")
      .select("id", { count: "exact", head: true })
      .eq("status", "approved")
      .gte("moderated_at", todayIso),
    supabase
      .from("beware_reports")
      .select("id", { count: "exact", head: true })
      .eq("status", "rejected")
      .gte("moderated_at", todayIso),
    supabase
      .from("user_reports")
      .select("reported_user_id, reason, created_at, profiles!user_reports_reported_user_id_fkey(id, first_name, username, email)")
      .eq("status", "pending")
      .order("created_at", { ascending: true }),
  ]);

  const posts   = pendingPosts   ?? [];
  const bewares = pendingBewares ?? [];
  const trips   = pendingTrips   ?? [];
  const total   = posts.length + bewares.length + trips.length;

  // Group flags by reported user
  const flagsByUser = ((flaggedRaw as unknown as FlagRow[]) ?? []).reduce<
    Record<string, { profile: FlagProfile | null; reasons: string[]; latest: string }>
  >((acc, row) => {
    if (!acc[row.reported_user_id]) {
      acc[row.reported_user_id] = { profile: row.profiles?.[0] ?? null, reasons: [], latest: row.created_at };
    }
    acc[row.reported_user_id].reasons.push(row.reason);
    if (row.created_at > acc[row.reported_user_id].latest) {
      acc[row.reported_user_id].latest = row.created_at;
    }
    return acc;
  }, {});
  const flaggedUsers = Object.entries(flagsByUser).sort(
    (a, b) => b[1].reasons.length - a[1].reasons.length,
  );

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-8">
        <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
          Moderation
        </p>
        <h1 className="font-serif text-3xl text-ink">Queue</h1>
        <p className="mt-1 font-mono text-xs text-ww-muted">
          {total === 0
            ? "Nothing pending."
            : `${total} item${total === 1 ? "" : "s"} waiting — ${posts.length} post${posts.length === 1 ? "" : "s"}, ${bewares.length} beware report${bewares.length === 1 ? "" : "s"}, ${trips.length} trip receipt${trips.length === 1 ? "" : "s"}.`}
        </p>
      </div>

      {/* Stats bar */}
      <div className="mb-8 grid grid-cols-3 gap-3">
        {[
          {
            icon: <Clock className="h-4 w-4 text-gold" />,
            value: total,
            label: "Awaiting review",
            bg: "bg-gold/10",
          },
          {
            icon: <CheckCircle className="h-4 w-4 text-sage" />,
            value: approvedToday ?? 0,
            label: "Approved today",
            bg: "bg-sage/10",
          },
          {
            icon: <XCircle className="h-4 w-4 text-rust" />,
            value: rejectedToday ?? 0,
            label: "Rejected today",
            bg: "bg-rust/10",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`${stat.bg} border border-ww-border p-4`}
          >
            <div className="mb-2 flex items-center gap-2">
              {stat.icon}
              <span className="font-mono text-[10px] uppercase tracking-widest text-ww-muted">
                {stat.label}
              </span>
            </div>
            <p className="font-serif text-3xl text-ink">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* CMS shortcuts */}
      <div className="mb-10 grid grid-cols-2 gap-3">
        <Link
          href="/admin/intel"
          className="border border-ww-border bg-warm-white p-4 transition-colors hover:border-ink"
        >
          <p className="font-mono text-[10px] uppercase tracking-widest text-ww-muted">Manage</p>
          <p className="mt-1 font-serif text-lg text-ink">Intel cards</p>
          <p className="mt-1 font-mono text-[10px] text-ww-muted">Create, edit, delete city guides →</p>
        </Link>
        <Link
          href="/admin/contributors"
          className="border border-ww-border bg-warm-white p-4 transition-colors hover:border-ink"
        >
          <p className="font-mono text-[10px] uppercase tracking-widest text-ww-muted">Manage</p>
          <p className="mt-1 font-serif text-lg text-ink">Contributors</p>
          <p className="mt-1 font-mono text-[10px] text-ww-muted">Add, edit contributor profiles →</p>
        </Link>
      </div>

      {/* Unified moderation queue */}
      <ModerationQueue posts={posts} bewares={bewares} trips={trips} />

      {/* Flagged users */}
      {flaggedUsers.length > 0 && (
        <div className="mt-12">
          <div className="mb-5 flex items-center gap-3">
            <Flag className="h-4 w-4 text-rust" />
            <h2 className="font-serif text-2xl text-ink">Flagged accounts</h2>
            <span className="font-mono text-[10px] uppercase tracking-widest text-ww-muted">
              {flaggedUsers.length} pending
            </span>
          </div>

          <div className="space-y-3">
            {flaggedUsers.map(([userId, { profile, reasons, latest }]) => {
              const name =
                profile?.first_name ??
                profile?.username ??
                profile?.email?.split("@")[0] ??
                "Unknown";
              const username = profile?.username;
              return (
                <div key={userId} className="border border-ww-border bg-warm-white p-4">
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-sm font-semibold text-ink">{name}</p>
                        {username && (
                          <Link
                            href={`/profile/${username}`}
                            target="_blank"
                            className="font-mono text-[10px] text-ww-muted hover:text-rust"
                          >
                            @{username} ↗
                          </Link>
                        )}
                      </div>
                      <p className="font-mono text-[10px] text-ww-muted">
                        {reasons.length} flag{reasons.length > 1 ? "s" : ""} · latest {timeAgo(latest)}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {[...new Set(reasons)].map((r) => (
                          <span
                            key={r}
                            className="border border-rust/30 bg-rust/10 px-2 py-0.5 font-mono text-[10px] text-rust"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <form action={async () => { "use server"; await dismissUserFlags(userId); }}>
                        <button className="border border-ww-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-ww-muted hover:border-ink hover:text-ink">
                          Dismiss
                        </button>
                      </form>
                      <form action={async () => { "use server"; await deactivateUser(userId); }}>
                        <button className="border border-rust bg-rust px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-warm-white hover:opacity-90">
                          Deactivate
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
