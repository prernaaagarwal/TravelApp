import { createClient } from "@/lib/supabase/server";
import { BuddyReportRow, type ReportRow } from "./BuddyReportRow";

export const metadata = { title: "Buddy reports — Admin" };

export default async function AdminBuddyReportsPage() {
  const supabase = await createClient();

  const { data: pending } = await supabase
    .from("buddy_profile_reports")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  // Group by reported_user_id
  const byUser = new Map<string, ReportRow[]>();
  for (const r of pending ?? []) {
    const list = byUser.get(r.reported_user_id) ?? [];
    list.push({
      id: r.id,
      reason: r.reason,
      details: r.details,
      created_at: r.created_at,
      reporter_id: r.reporter_id,
    });
    byUser.set(r.reported_user_id, list);
  }

  // Fetch profile metadata + paused state
  const userIds = Array.from(byUser.keys());
  const { data: profiles } = userIds.length
    ? await supabase
        .from("profiles")
        .select("id, first_name, username, is_paused, paused_at")
        .in("id", userIds)
    : { data: [] };
  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));

  // Surface paused-with-pending-reports first; everything else after
  const sorted = userIds
    .map((id) => ({
      id,
      profile: profileById.get(id),
      reports: byUser.get(id)!,
    }))
    .sort((a, b) => {
      const ap = a.profile?.is_paused ? 1 : 0;
      const bp = b.profile?.is_paused ? 1 : 0;
      return bp - ap;
    });

  return (
    <div className="px-6 py-8">
      <header className="mb-6">
        <h1 className="font-serif text-3xl text-ink">Buddy reports</h1>
        <p className="mt-1 font-mono text-xs text-ww-muted">
          Profiles with 2+ pending reports are auto-paused and shown at the
          top. Restore = false positive (mark all reports dismissed). Confirm +
          ban = permanently remove from Buddy matching.
        </p>
      </header>

      {sorted.length === 0 ? (
        <div className="rounded-xl border border-dashed border-ww-border bg-warm-white p-8 text-center">
          <p className="font-mono text-sm text-ww-muted">
            No pending buddy reports.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map(({ id, profile, reports }) => (
            <BuddyReportRow
              key={id}
              reportedUserId={id}
              reportedFirstName={profile?.first_name ?? null}
              reportedUsername={profile?.username ?? null}
              isPaused={profile?.is_paused ?? false}
              pausedAt={profile?.paused_at ?? null}
              reports={reports}
            />
          ))}
        </div>
      )}
    </div>
  );
}
