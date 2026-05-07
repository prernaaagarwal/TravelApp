"use client";

import { useState, useTransition } from "react";
import { Flag } from "lucide-react";
import { reportBuddyProfile } from "@/app/buddy/report-actions";

const REASONS = [
  "Profile is not a woman",
  "Inappropriate message after match",
  "Suspicious profile photo (catfish)",
  "Other",
] as const;

// Inline icon button on every Buddy card. Opens a small modal with the
// 4 fixed reasons + an optional details field. Submitting calls
// reportBuddyProfile() — which inserts the row, runs the 2-flag auto-pause
// counter, and emails an ack to the reporter.

export function ReportBuddyButton({ reportedUserId }: { reportedUserId: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<string>("");
  const [details, setDetails] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  function close() {
    setOpen(false);
    setError("");
    if (done) {
      // Reset for next time the modal opens
      setTimeout(() => {
        setDone(false);
        setReason("");
        setDetails("");
      }, 200);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason) {
      setError("Pick a reason.");
      return;
    }
    setError("");
    const fd = new FormData();
    fd.set("reported_user_id", reportedUserId);
    fd.set("reason", reason);
    fd.set("details", details);
    startTransition(async () => {
      const res = await reportBuddyProfile(fd);
      if (res && "error" in res && res.error) {
        setError(res.error);
        return;
      }
      setDone(true);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Report this profile"
        className="inline-flex items-center gap-1 border border-ww-border bg-warm-white px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-ww-muted transition-colors hover:border-rust hover:text-rust"
      >
        <Flag className="h-3 w-3" aria-hidden />
        Report
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="report-buddy-title"
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 sm:items-center"
          onClick={close}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-ww-border bg-warm-white p-6 shadow-2xl"
          >
            {done ? (
              <div>
                <p
                  id="report-buddy-title"
                  className="mb-2 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-sage"
                >
                  <span aria-hidden>✓</span>
                  Report received
                </p>
                <p className="font-mono text-xs leading-relaxed text-ink">
                  Thanks. A member of our team will review within 24 hours. If
                  another member of the community has already flagged this
                  profile, it&apos;s been auto-paused while we review.
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="mt-4 border border-ink bg-ink px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-warm-white"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <p
                  id="report-buddy-title"
                  className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-rust"
                >
                  Report this profile
                </p>
                <p className="mb-4 font-mono text-xs leading-relaxed text-ww-muted">
                  Two flags from different members auto-pause a profile until
                  our team reviews. We&apos;ll email you when we&apos;ve made a
                  decision.
                </p>

                <fieldset className="space-y-2">
                  <legend className="mb-2 font-mono text-[10px] uppercase tracking-widest text-ww-muted">
                    What&apos;s the issue?
                  </legend>
                  {REASONS.map((r) => (
                    <label
                      key={r}
                      className="flex items-start gap-2 rounded border border-ww-border bg-sand/60 p-2"
                    >
                      <input
                        type="radio"
                        name="reason"
                        value={r}
                        checked={reason === r}
                        onChange={() => setReason(r)}
                        className="mt-0.5 accent-rust"
                      />
                      <span className="font-mono text-xs text-ink">{r}</span>
                    </label>
                  ))}
                </fieldset>

                <div className="mt-4">
                  <label
                    htmlFor="details"
                    className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-ww-muted"
                  >
                    Details (optional)
                  </label>
                  <textarea
                    id="details"
                    rows={3}
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    maxLength={500}
                    className="w-full border border-ww-border bg-warm-white px-3 py-2 font-mono text-xs text-ink focus:border-ink focus:outline-none"
                  />
                </div>

                {error && (
                  <p className="mt-3 font-mono text-[11px] text-rust">{error}</p>
                )}

                <div className="mt-4 flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={close}
                    className="border border-ww-border bg-sand px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-ww-muted hover:border-ink hover:text-ink"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={pending || !reason}
                    className="border border-rust bg-rust px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-warm-white transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {pending ? "Sending…" : "Submit report"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
