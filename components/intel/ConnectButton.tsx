"use client";

import { useState } from "react";
import Link from "next/link";
import { sendConnection } from "@/app/buddy/actions";
import { RustButton } from "@/components/ui/RustButton";

const MAX_MESSAGE_LENGTH = 280;

export function ConnectButton({
  matchId,
  alreadySent,
  viewerVerified = true,
}: {
  matchId: string;
  alreadySent: boolean;
  viewerVerified?: boolean;
}) {
  const [sent, setSent] = useState(alreadySent);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSend() {
    setLoading(true);
    setError(null);
    const res = await sendConnection(matchId, message);
    if (res && "error" in res && res.error) {
      setError(res.error);
      setLoading(false);
      return;
    }
    setSent(true);
    setOpen(false);
    setLoading(false);
  }

  if (sent) {
    return (
      <span className="border border-sage/30 bg-sage-light/30 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-sage">
        ✓ Hello sent
      </span>
    );
  }

  if (!viewerVerified) {
    return (
      <Link
        href="/account/verify"
        className="border border-rust bg-warm-white px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-rust hover:bg-rust hover:text-warm-white transition-colors"
        title="Verify your account to send hellos"
      >
        🔒 Verify to send hello →
      </Link>
    );
  }

  return (
    <>
      <RustButton size="sm" onClick={() => setOpen(true)}>
        Send hello →
      </RustButton>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/40 px-4 py-6"
          onClick={() => !loading && setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md border border-ww-border bg-warm-white p-5"
          >
            <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
              Send a hello
            </p>
            <h3 className="mb-2 font-serif text-2xl text-ink">
              What do you want her to know?
            </h3>
            <p className="mb-4 font-mono text-[11px] leading-relaxed text-ww-muted">
              Optional — but a one-line note about your trip dates or vibe makes
              a real difference. She&apos;ll review your hello before either of you
              sees the other&apos;s details.
            </p>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, MAX_MESSAGE_LENGTH))}
              disabled={loading}
              rows={4}
              maxLength={MAX_MESSAGE_LENGTH}
              placeholder="Hi! I'm in Goa Mar 12-19, mostly North. Coffee?"
              className="w-full border border-ww-border bg-sand p-3 font-mono text-sm text-ink placeholder:text-ww-muted focus:border-rust focus:outline-none"
            />
            <div className="mt-1 flex items-center justify-between font-mono text-[10px] text-ww-muted">
              <span>{message.length}/{MAX_MESSAGE_LENGTH}</span>
              <span>You can leave this blank to send a wave.</span>
            </div>
            {error && (
              <p className="mt-3 font-mono text-[11px] text-rust">{error}</p>
            )}
            <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                disabled={loading}
                className="border border-ww-border bg-warm-white px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-ww-muted hover:bg-sand"
              >
                Cancel
              </button>
              <RustButton size="sm" onClick={handleSend} disabled={loading}>
                {loading ? "Sending…" : message.trim() ? "Send hello →" : "Send wave →"}
              </RustButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
