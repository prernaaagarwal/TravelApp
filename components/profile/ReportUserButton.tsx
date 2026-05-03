"use client";

import { useState } from "react";
import { Flag } from "lucide-react";
import { reportUser } from "@/app/profile/[username]/actions";

const REASONS = [
  "Not a woman",
  "Harassment or abusive behaviour",
  "Spam or fake account",
  "Sharing dangerous misinformation",
  "Other",
];

export function ReportUserButton({
  reportedUserId,
  reportedName,
}: {
  reportedUserId: string;
  reportedName: string;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason) return;
    setSubmitting(true);
    setError("");
    const result = await reportUser(reportedUserId, reason, details);
    setSubmitting(false);
    if (result?.error) {
      setError(result.error);
    } else {
      setDone(true);
    }
  }

  if (done) {
    return (
      <p className="font-mono text-[10px] uppercase tracking-widest text-ww-muted">
        Report submitted. Our team will review it.
      </p>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-ww-muted transition-colors hover:text-rust"
      >
        <Flag className="h-3 w-3" />
        Report this user
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 border border-ww-border bg-warm-white p-4">
      <p className="font-mono text-[10px] uppercase tracking-widest text-ink">
        Report {reportedName}
      </p>

      <div className="space-y-1.5">
        {REASONS.map((r) => (
          <label key={r} className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="reason"
              value={r}
              checked={reason === r}
              onChange={() => setReason(r)}
              className="accent-rust"
            />
            <span className="text-sm text-ink">{r}</span>
          </label>
        ))}
      </div>

      <textarea
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        placeholder="Optional: add any details that help our team review this."
        rows={3}
        className="w-full resize-none border border-ww-border bg-sand px-3 py-2 font-mono text-xs text-ink placeholder:text-ww-muted focus:border-ink focus:outline-none"
      />

      {error && <p className="font-mono text-xs text-rust">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={!reason || submitting}
          className="bg-rust px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-warm-white transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {submitting ? "Sending…" : "Submit report"}
        </button>
        <button
          type="button"
          onClick={() => { setOpen(false); setReason(""); setDetails(""); setError(""); }}
          className="font-mono text-[10px] uppercase tracking-widest text-ww-muted hover:text-ink"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
