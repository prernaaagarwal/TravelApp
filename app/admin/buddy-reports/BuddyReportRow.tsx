"use client";

import { useState, useTransition } from "react";
import { restoreFromPause, confirmPauseAndBan } from "./actions";

export type ReportRow = {
  id: string;
  reason: string;
  details: string | null;
  created_at: string;
  reporter_id: string;
};

export function BuddyReportRow({
  reportedUserId,
  reportedFirstName,
  reportedUsername,
  isPaused,
  pausedAt,
  reports,
}: {
  reportedUserId: string;
  reportedFirstName: string | null;
  reportedUsername: string | null;
  isPaused: boolean;
  pausedAt: string | null;
  reports: ReportRow[];
}) {
  const [showBan, setShowBan] = useState(false);
  const [reason, setReason] = useState("");
  const [pending, startTransition] = useTransition();

  function handleRestore() {
    startTransition(async () => {
      await restoreFromPause(reportedUserId);
    });
  }

  function handleBan() {
    if (!reason.trim()) return;
    startTransition(async () => {
      await confirmPauseAndBan(reportedUserId, reason.trim());
    });
  }

  return (
    <article className="rounded-xl border border-ww-border bg-warm-white p-5 shadow-sm">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-serif text-xl text-ink">
            {reportedFirstName ?? reportedUsername ?? reportedUserId.slice(0, 8)}
          </p>
          <p className="font-mono text-xs text-ww-muted">
            {reportedUsername && `@${reportedUsername} · `}
            {reports.length} pending report{reports.length === 1 ? "" : "s"}
          </p>
        </div>
        {isPaused && (
          <span className="rounded-full bg-rust/10 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-rust">
            Auto-paused {pausedAt ? `· ${new Date(pausedAt).toLocaleDateString("en-IN")}` : ""}
          </span>
        )}
      </header>

      <ul className="mt-4 space-y-2">
        {reports.map((r) => (
          <li key={r.id} className="rounded border border-ww-border bg-sand p-3">
            <p className="font-mono text-xs font-semibold text-ink">{r.reason}</p>
            {r.details && (
              <p className="mt-1 font-mono text-[11px] leading-relaxed text-ww-muted">
                {r.details}
              </p>
            )}
            <p className="mt-1 font-mono text-[10px] text-ww-muted">
              {new Date(r.created_at).toLocaleString("en-IN")}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-ww-border pt-4">
        <button
          type="button"
          onClick={handleRestore}
          disabled={pending}
          className="border border-sage bg-sage/10 px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-sage hover:bg-sage hover:text-warm-white disabled:opacity-50"
        >
          {pending ? "…" : "Restore (false positive)"}
        </button>
        <button
          type="button"
          onClick={() => setShowBan((s) => !s)}
          disabled={pending}
          className="border border-rust bg-rust px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-warm-white hover:bg-rust/90 disabled:opacity-50"
        >
          Confirm + ban
        </button>
      </div>

      {showBan && (
        <div className="mt-3 rounded border border-rust/30 bg-rust/[0.04] p-3">
          <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-rust">
            Internal reason (audit log)
          </label>
          <textarea
            rows={2}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Profile photo confirmed not a woman; reverse-image hit on a stock site"
            className="w-full border border-ww-border bg-warm-white px-2 py-1 font-mono text-xs text-ink focus:border-ink focus:outline-none"
          />
          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => { setShowBan(false); setReason(""); }}
              className="border border-ww-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-ww-muted"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleBan}
              disabled={pending || !reason.trim()}
              className="border border-rust bg-rust px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-warm-white disabled:opacity-50"
            >
              Confirm ban
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
