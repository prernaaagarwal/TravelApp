"use client";

import { useState, useTransition } from "react";
import { approveVerification, rejectVerification } from "./actions";

export function VerificationRow({
  userId,
  phone,
  phoneVerifiedAt,
  submittedAt,
  signedUrl,
  firstName,
  username,
}: {
  userId: string;
  phone: string;
  phoneVerifiedAt: string | null;
  submittedAt: string;
  signedUrl: string | null;
  firstName: string | null;
  username: string | null;
}) {
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");
  const [pending, startTransition] = useTransition();

  function handleApprove() {
    startTransition(async () => {
      await approveVerification(userId);
    });
  }

  function handleReject() {
    if (!reason.trim()) return;
    startTransition(async () => {
      await rejectVerification(userId, reason.trim());
    });
  }

  return (
    <article className="rounded-xl border border-ww-border bg-warm-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start gap-5">
        <div className="w-32 shrink-0">
          {signedUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={signedUrl}
              alt="ID + selfie"
              className="aspect-square w-full rounded border border-ww-border object-cover"
            />
          ) : (
            <div className="aspect-square w-full rounded border border-dashed border-ww-border bg-sand grid place-items-center font-mono text-[10px] text-ww-muted">
              No photo
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-serif text-xl text-ink">
            {firstName ?? username ?? userId.slice(0, 8)}
          </p>
          <p className="font-mono text-xs text-ww-muted">
            {username && `@${username} · `}
            {phone}
          </p>
          <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[11px] text-ww-muted">
            <dt>Submitted</dt>
            <dd className="text-ink">{new Date(submittedAt).toLocaleString("en-IN")}</dd>
            <dt>Phone verified</dt>
            <dd className="text-ink">
              {phoneVerifiedAt ? new Date(phoneVerifiedAt).toLocaleString("en-IN") : "—"}
            </dd>
          </dl>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleApprove}
              disabled={pending}
              className="border border-sage bg-sage px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-warm-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {pending ? "…" : "Approve & delete photo"}
            </button>
            <button
              type="button"
              onClick={() => setShowReject((s) => !s)}
              disabled={pending}
              className="border border-ww-border bg-sand px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-ww-muted hover:border-ink hover:text-ink"
            >
              Reject
            </button>
          </div>

          {showReject && (
            <div className="mt-3 rounded border border-ww-border bg-sand p-3">
              <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-ww-muted">
                Reason (sent in the rejection email)
              </label>
              <textarea
                rows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Photo too blurry to confirm ID match…"
                className="w-full border border-ww-border bg-warm-white px-2 py-1 font-mono text-xs text-ink focus:border-ink focus:outline-none"
              />
              <div className="mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setShowReject(false); setReason(""); }}
                  className="border border-ww-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-ww-muted"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleReject}
                  disabled={pending || !reason.trim()}
                  className="border border-rust bg-rust px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-warm-white disabled:opacity-50"
                >
                  Confirm reject
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
