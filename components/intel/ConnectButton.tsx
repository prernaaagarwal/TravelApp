"use client";

import { useState } from "react";
import { sendConnection } from "@/app/buddy/actions";

export function ConnectButton({ matchId, alreadySent }: { matchId: string; alreadySent: boolean }) {
  const [sent, setSent] = useState(alreadySent);
  const [loading, setLoading] = useState(false);

  async function handle() {
    setLoading(true);
    await sendConnection(matchId);
    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <span className="border border-sage/30 bg-sage-light/30 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-sage">
        ✓ Request sent
      </span>
    );
  }

  return (
    <button
      onClick={handle}
      disabled={loading}
      className="border border-rust bg-rust px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-warm-white hover:bg-rust/90 transition-colors disabled:opacity-50"
    >
      {loading ? "Sending…" : "Send hello →"}
    </button>
  );
}
