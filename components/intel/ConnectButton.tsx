"use client";

import { useState } from "react";
import Link from "next/link";
import { sendConnection } from "@/app/buddy/actions";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handle() {
    setLoading(true);
    setError(null);
    const res = await sendConnection(matchId);
    if (res && "error" in res && res.error) {
      setError(res.error);
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  if (sent) {
    return (
      <span className="border border-sage/30 bg-sage-light/30 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-sage">
        ✓ Request sent
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
    <div className="flex flex-col items-start gap-1">
      <button
        onClick={handle}
        disabled={loading}
        className="border border-rust bg-rust px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-warm-white hover:bg-rust/90 transition-colors disabled:opacity-50"
      >
        {loading ? "Sending…" : "Send hello →"}
      </button>
      {error && (
        <p className="font-mono text-[10px] text-rust">{error}</p>
      )}
    </div>
  );
}
