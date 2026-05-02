"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function CommunityError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[community-error]", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-ww-muted">Community unavailable</p>
      <h2 className="font-serif text-xl text-ink">Couldn&apos;t load posts</h2>
      <p className="max-w-xs font-mono text-sm text-ww-muted">
        The community feed is temporarily down. Your data is safe.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="border border-ink px-5 py-2 font-mono text-xs uppercase tracking-widest text-ink transition-colors hover:bg-ink hover:text-warm-white"
        >
          Try again
        </button>
        <Link
          href="/"
          className="border border-ww-border px-5 py-2 font-mono text-xs uppercase tracking-widest text-ww-muted transition-colors hover:border-ink hover:text-ink"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
