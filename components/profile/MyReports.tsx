"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, CheckCircle, XCircle, ChevronDown, ChevronUp } from "lucide-react";

interface Report {
  id: string;
  title: string;
  city: string | null;
  severity: string | null;
  status: string;
  rejection_reason: string | null;
  created_at: string;
  reviewed_at: string | null;
}

interface Props {
  reports: Report[];
}

const STATUS_META = {
  pending:  { label: "Under review", icon: Clock,         className: "border-gold/30 bg-gold/10 text-gold" },
  approved: { label: "Approved",     icon: CheckCircle,   className: "border-sage/30 bg-sage/10 text-sage" },
  rejected: { label: "Needs revision", icon: XCircle,    className: "border-rust/30 bg-rust/10 text-rust" },
} as const;

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function MyReports({ reports }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (reports.length === 0) {
    return (
      <div className="border border-ww-border bg-warm-white p-8 text-center">
        <p className="font-serif text-lg text-ink">No reports filed yet.</p>
        <p className="mt-1 font-mono text-xs text-ww-muted">
          Help protect other travellers — submit a scam or safety warning.
        </p>
        <Link
          href="/contribute/report"
          className="mt-4 inline-block border border-rust bg-rust px-5 py-2 font-mono text-[10px] uppercase tracking-widest text-warm-white transition-opacity hover:opacity-90"
        >
          File a report →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {reports.map((report) => {
        const meta =
          STATUS_META[report.status as keyof typeof STATUS_META] ??
          STATUS_META.pending;
        const Icon = meta.icon;
        const isExpanded = expanded === report.id;

        return (
          <div
            key={report.id}
            className="border border-ww-border bg-warm-white"
          >
            <button
              onClick={() => setExpanded(isExpanded ? null : report.id)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left"
            >
              <Icon className={`h-4 w-4 shrink-0 ${meta.className.split(" ").find((c) => c.startsWith("text-"))}`} />

              <div className="min-w-0 flex-1">
                <p className="truncate font-mono text-xs font-semibold text-ink">
                  {report.title}
                </p>
                <p className="font-mono text-[10px] text-ww-muted">
                  {report.city ?? "Unknown city"} · {timeAgo(report.created_at)}
                </p>
              </div>

              <span
                className={`shrink-0 border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest ${meta.className}`}
              >
                {meta.label}
              </span>

              {isExpanded ? (
                <ChevronUp className="h-3.5 w-3.5 shrink-0 text-ww-muted" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 shrink-0 text-ww-muted" />
              )}
            </button>

            {isExpanded && (
              <div className="border-t border-ww-border px-4 pb-4 pt-3">
                {report.status === "pending" && (
                  <p className="font-mono text-xs text-ww-muted">
                    Your report is being reviewed. This usually takes up to 24 hours.
                  </p>
                )}

                {report.status === "approved" && (
                  <p className="font-mono text-xs text-sage">
                    Your report is live on the Beware Board. Thank you for keeping
                    the community safe.
                  </p>
                )}

                {report.status === "rejected" && (
                  <div className="space-y-3">
                    <div className="border-l-2 border-rust pl-3">
                      <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-rust">
                        Reviewer note
                      </p>
                      <p className="font-mono text-xs leading-relaxed text-ww-muted">
                        {report.rejection_reason ??
                          "Your report did not meet our guidelines."}
                      </p>
                    </div>
                    <Link
                      href={`/contribute/report/edit/${report.id}`}
                      className="inline-block border border-rust bg-rust/10 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-rust transition-colors hover:bg-rust hover:text-warm-white"
                    >
                      Edit and resubmit →
                    </Link>
                  </div>
                )}

                {report.reviewed_at && (
                  <p className="mt-2 font-mono text-[9px] text-ww-muted/60">
                    Reviewed{" "}
                    {new Date(report.reviewed_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}

      <div className="pt-2">
        <Link
          href="/contribute/report"
          className="font-mono text-[10px] uppercase tracking-widest text-rust hover:underline"
        >
          + File another report
        </Link>
      </div>
    </div>
  );
}
