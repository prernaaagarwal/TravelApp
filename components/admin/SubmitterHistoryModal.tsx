"use client";

import { useEffect, useState, useTransition } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Ban, Undo2 } from "lucide-react";
import { getSubmitterHistory, banUser, unbanUser, type SubmitterHistory } from "@/app/admin/actions";

interface Props {
  open:         boolean;
  onOpenChange: (open: boolean) => void;
  userId:       string | null;
  displayName:  string;
}

export function SubmitterHistoryModal({ open, onOpenChange, userId, displayName }: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex max-h-[85vh] w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden border border-ww-border bg-sand shadow-2xl sm:w-full sm:max-w-lg">
          {userId && <ModalBody userId={userId} displayName={displayName} onClose={() => onOpenChange(false)} />}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// Inner — only mounts when modal opens AND userId is set. State naturally
// resets between distinct submitters because we key on userId at the boundary.
function ModalBody({
  userId,
  displayName,
  onClose,
}: {
  userId:      string;
  displayName: string;
  onClose:     () => void;
}) {
  const [history, setHistory]       = useState<SubmitterHistory | null>(null);
  const [loading, setLoading]       = useState(true);
  const [error,   setError]         = useState("");
  const [showBanInput, setShowBanInput] = useState(false);
  const [banReason,    setBanReason]    = useState("");
  const [pending, startTransition]  = useTransition();

  // Load history on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const h = await getSubmitterHistory(userId);
        if (cancelled) return;
        if (!h) setError("Could not load submitter history.");
        else    setHistory(h);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [userId]);

  function confirmBan() {
    if (banReason.trim().length < 4) {
      setError("Ban reason is required (4+ characters).");
      return;
    }
    startTransition(async () => {
      try {
        await banUser(userId, banReason.trim());
        const refreshed = await getSubmitterHistory(userId);
        if (refreshed) setHistory(refreshed);
        setShowBanInput(false);
        setBanReason("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to ban user.");
      }
    });
  }

  function confirmUnban() {
    startTransition(async () => {
      try {
        await unbanUser(userId);
        const refreshed = await getSubmitterHistory(userId);
        if (refreshed) setHistory(refreshed);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to unban user.");
      }
    });
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-ww-border bg-warm-white px-5 py-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-ww-muted">
            Submitter history
          </p>
          <Dialog.Title className="mt-1 font-serif text-xl text-ink">{displayName}</Dialog.Title>
          {history?.email && (
            <p className="mt-1 font-mono text-xs text-ww-muted">{history.email}</p>
          )}
        </div>
        <Dialog.Close asChild>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="rounded-sm p-1 text-ww-muted transition-colors hover:bg-sand hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </Dialog.Close>
      </div>

      <Dialog.Description className="sr-only">
        View this submitter&apos;s submission history and approval rate.
      </Dialog.Description>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {loading && (
          <p className="text-center font-mono text-xs text-ww-muted">Loading history…</p>
        )}

        {!loading && history && (
          <>
            {history.is_banned && (
              <div className="border-l-2 border-rust bg-rust/5 p-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-rust">
                  Banned
                  {history.banned_at && (
                    <> · {new Date(history.banned_at).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })}</>
                  )}
                </p>
                {history.ban_reason && (
                  <p className="mt-2 font-serif text-sm italic text-ink">
                    &ldquo;{history.ban_reason}&rdquo;
                  </p>
                )}
              </div>
            )}

            <div className="grid grid-cols-3 gap-3">
              <Stat label="Posts"  total={history.posts_total}   approved={history.posts_approved}   rejected={history.posts_rejected}   />
              <Stat label="Beware" total={history.bewares_total} approved={history.bewares_approved} rejected={history.bewares_rejected} />
              <Stat label="Trips"  total={history.trips_total}   approved={history.trips_approved}   rejected={history.trips_rejected}   />
            </div>

            <ApprovalRate history={history} />
          </>
        )}

        {error && (
          <p className="font-mono text-xs text-rust">{error}</p>
        )}

        {/* Ban / unban */}
        {!loading && history && !history.is_banned && (
          <div className="border-t border-ww-border pt-4">
            {!showBanInput ? (
              <button
                type="button"
                onClick={() => setShowBanInput(true)}
                className="inline-flex items-center gap-1.5 border border-rust px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-rust transition-colors hover:bg-rust hover:text-warm-white"
              >
                <Ban className="h-3 w-3" />
                Ban this user
              </button>
            ) : (
              <div className="space-y-2">
                <label className="block font-mono text-[10px] uppercase tracking-widest text-ww-muted">
                  Ban reason
                </label>
                <textarea
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  rows={2}
                  maxLength={500}
                  placeholder="e.g. Repeat off-topic submissions after warnings."
                  className="w-full resize-none border border-ww-border bg-warm-white px-3 py-2 font-mono text-sm text-ink placeholder:text-ww-muted focus:border-ink focus:outline-none"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={confirmBan}
                    disabled={pending}
                    className="border border-rust bg-rust px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-warm-white transition-colors hover:bg-rust/90 disabled:opacity-40"
                  >
                    {pending ? "Banning…" : "Confirm ban"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowBanInput(false); setBanReason(""); }}
                    className="border border-ww-border bg-sand px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-ww-muted transition-colors hover:border-ink hover:text-ink"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {!loading && history?.is_banned && (
          <div className="border-t border-ww-border pt-4">
            <button
              type="button"
              onClick={confirmUnban}
              disabled={pending}
              className="inline-flex items-center gap-1.5 border border-sage bg-sage px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-warm-white transition-colors hover:bg-sage/90 disabled:opacity-40"
            >
              <Undo2 className="h-3 w-3" />
              {pending ? "Unbanning…" : "Unban this user"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function Stat({ label, total, approved, rejected }: { label: string; total: number; approved: number; rejected: number }) {
  return (
    <div className="border border-ww-border bg-warm-white p-3">
      <p className="font-mono text-[10px] uppercase tracking-widest text-ww-muted">{label}</p>
      <p className="mt-1 font-serif text-2xl text-ink">{total}</p>
      <div className="mt-1 flex items-center gap-2 font-mono text-[10px]">
        <span className="text-sage">✓ {approved}</span>
        <span className="text-rust">✕ {rejected}</span>
      </div>
    </div>
  );
}

function ApprovalRate({ history }: { history: SubmitterHistory }) {
  const total = history.posts_total + history.bewares_total + history.trips_total;
  const approved = history.posts_approved + history.bewares_approved + history.trips_approved;
  if (total === 0) {
    return (
      <p className="font-mono text-xs text-ww-muted">
        No prior submissions.
      </p>
    );
  }
  const rate = Math.round((approved / total) * 100);
  const tone = rate >= 70 ? "text-sage" : rate >= 40 ? "text-gold" : "text-rust";
  return (
    <div className="border-t border-ww-border pt-3">
      <p className="font-mono text-[10px] uppercase tracking-widest text-ww-muted">
        Approval rate
      </p>
      <p className={`mt-1 font-serif text-2xl ${tone}`}>
        {rate}% <span className="font-mono text-xs text-ww-muted">({approved}/{total})</span>
      </p>
    </div>
  );
}
