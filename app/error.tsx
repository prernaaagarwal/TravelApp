"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app-error]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-sand px-4 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-ww-muted">Something went wrong</p>
      <h1 className="font-serif text-2xl text-ink">We hit a snag</h1>
      <p className="max-w-xs font-mono text-sm text-ww-muted">
        Try refreshing — if it keeps happening, come back in a few minutes.
      </p>
      <button
        onClick={reset}
        className="mt-2 border border-ink px-6 py-2 font-mono text-xs uppercase tracking-widest text-ink transition-colors hover:bg-ink hover:text-warm-white"
      >
        Try again
      </button>
    </div>
  );
}
