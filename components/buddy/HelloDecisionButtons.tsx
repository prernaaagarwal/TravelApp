"use client";

import { useState, useTransition } from "react";
import { acceptHello, declineHello } from "@/app/buddy/actions";

export function HelloDecisionButtons({ connectionId }: { connectionId: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<"accepted" | "declined" | null>(null);

  function handle(action: "accepted" | "declined") {
    setError(null);
    startTransition(async () => {
      const res = action === "accepted"
        ? await acceptHello(connectionId)
        : await declineHello(connectionId);
      if (res && "error" in res && res.error) {
        setError(res.error);
        return;
      }
      setDone(action);
    });
  }

  if (done) {
    return (
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
        {done === "accepted" ? "✓ Accepted" : "✕ Declined"}
      </span>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={() => handle("accepted")}
        disabled={pending}
        className="border border-sage bg-sage px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-warm-white hover:bg-sage/90 disabled:opacity-50"
      >
        {pending ? "…" : "Accept"}
      </button>
      <button
        onClick={() => handle("declined")}
        disabled={pending}
        className="border border-ww-border bg-warm-white px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-ww-muted hover:bg-sand disabled:opacity-50"
      >
        Decline
      </button>
      {error && <p className="font-mono text-[10px] text-rust">{error}</p>}
    </div>
  );
}
