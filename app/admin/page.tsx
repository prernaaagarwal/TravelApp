import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { AlertTriangle, Clock, CheckCircle, XCircle, ChevronRight } from "lucide-react";

const SEVERITY_META: Record<string, { label: string; className: string }> = {
  critical: { label: "Critical", className: "bg-rust/20 text-rust border-rust/30" },
  high:     { label: "High",     className: "bg-gold/20 text-gold border-gold/30" },
  medium:   { label: "Medium",   className: "bg-blue/20 text-blue border-blue/30" },
  low:      { label: "Low",      className: "bg-sage/20 text-sage border-sage/30" },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default async function AdminQueuePage() {
  const supabase = await createClient();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    { data: pending, count: pendingCount },
    { count: approvedToday },
    { count: rejectedToday },
  ] = await Promise.all([
    supabase
      .from("beware_reports")
      .select("id, title, city, severity, reported_by_name, created_at, photo_urls", {
        count: "exact",
      })
      .eq("status", "pending")
      .order("created_at", { ascending: true }),
    supabase
      .from("beware_reports")
      .select("id", { count: "exact", head: true })
      .eq("status", "approved")
      .gte("reviewed_at", today.toISOString()),
    supabase
      .from("beware_reports")
      .select("id", { count: "exact", head: true })
      .eq("status", "rejected")
      .gte("reviewed_at", today.toISOString()),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-8">
        <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
          Moderation queue
        </p>
        <h1 className="font-serif text-3xl text-ink">Pending reports</h1>
      </div>

      {/* Stats bar */}
      <div className="mb-8 grid grid-cols-3 gap-3">
        {[
          {
            icon: <Clock className="h-4 w-4 text-gold" />,
            value: pendingCount ?? 0,
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

      {/* Queue */}
      {(!pending || pending.length === 0) ? (
        <div className="border border-ww-border bg-warm-white p-12 text-center">
          <CheckCircle className="mx-auto mb-3 h-8 w-8 text-sage" />
          <p className="font-serif text-xl text-ink">All caught up.</p>
          <p className="mt-1 font-mono text-xs text-ww-muted">
            No pending reports to review.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {pending.map((report) => {
            const sev = SEVERITY_META[report.severity ?? "medium"] ??
              SEVERITY_META.medium;
            const photos = Array.isArray(report.photo_urls)
              ? (report.photo_urls as string[])
              : [];

            return (
              <Link
                key={report.id}
                href={`/admin/reports/${report.id}`}
                className="flex items-center gap-4 border border-ww-border bg-warm-white p-4 transition-shadow hover:shadow-sm"
              >
                <AlertTriangle className="h-4 w-4 shrink-0 text-gold" />

                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span
                      className={`border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest ${sev.className}`}
                    >
                      {sev.label}
                    </span>
                    {report.city && (
                      <span className="font-mono text-[10px] text-ww-muted">
                        {report.city}
                      </span>
                    )}
                  </div>
                  <p className="truncate font-mono text-sm font-semibold text-ink">
                    {report.title}
                  </p>
                  <p className="font-mono text-[10px] text-ww-muted">
                    by {report.reported_by_name ?? "Anonymous"} ·{" "}
                    {timeAgo(report.created_at)}
                    {photos.length > 0 && ` · ${photos.length} photo${photos.length > 1 ? "s" : ""}`}
                  </p>
                </div>

                <ChevronRight className="h-4 w-4 shrink-0 text-ww-muted" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
