"use client";

import { useState, useTransition } from "react";
import { submitLead } from "@/app/actions/leads";

type Props = {
  // The destination string the user searched for. Captured into the leads
  // table so we know which destinations to build next. Optional — if omitted
  // (e.g. on a generic empty filter state), the form still works but the
  // signal is just "someone wanted more cards".
  destination?: string;
  compact?: boolean;
};

export function DestinationWaitlistForm({ destination, compact = false }: Props) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await submitLead(email, "destination-waitlist", destination);
      if (result.error) {
        setError(result.error);
      } else {
        setDone(true);
      }
    });
  }

  if (done) {
    return (
      <p className="font-mono text-xs text-sage">
        ✓ You&apos;re on the list — we&apos;ll email you when{" "}
        {destination ? <strong className="text-ink">{destination}</strong> : "more cards"}{" "}
        is live.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={
        compact
          ? "flex flex-col gap-2 sm:flex-row"
          : "flex flex-col gap-3 sm:flex-row"
      }
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        disabled={isPending}
        aria-label="Email address"
        className={`flex-1 border border-ww-border bg-warm-white font-mono text-ink placeholder:text-ww-muted outline-none focus:border-rust ${
          compact ? "px-3 py-2 text-xs" : "px-4 py-3 text-sm"
        }`}
      />
      <button
        type="submit"
        disabled={isPending}
        className={`shrink-0 bg-rust font-mono uppercase tracking-widest text-warm-white transition-opacity hover:opacity-90 disabled:opacity-50 ${
          compact ? "px-4 py-2 text-[10px]" : "px-6 py-3 text-xs"
        }`}
      >
        {isPending ? "Sending…" : "Notify me"}
      </button>
      {error && (
        <p className="font-mono text-[11px] text-red-600 sm:basis-full">{error}</p>
      )}
    </form>
  );
}
