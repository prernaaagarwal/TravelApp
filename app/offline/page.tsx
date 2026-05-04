import Link from "next/link";

export const metadata = {
  title: "Offline — Wander Women",
  description: "You're offline. Check your connection and try again.",
};

// Static — no DB calls. Precached by the service worker on install.
export default function OfflinePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-sand px-6 py-12">
      <div className="max-w-md text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
          Wander Women
        </p>
        <h1 className="mt-3 font-serif text-4xl text-ink md:text-5xl">
          You&apos;re offline.
        </h1>
        <p className="mt-4 font-mono text-sm leading-relaxed text-ww-muted">
          Check your connection and try again. Pages you&apos;ve already
          visited should still load from cache.
        </p>

        <div className="mt-8 flex justify-center">
          <Link
            href="/"
            className="border border-ink bg-ink px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest text-warm-white transition-colors hover:bg-ink/80"
          >
            ← Try home
          </Link>
        </div>

        <p className="mt-8 font-mono text-[10px] leading-relaxed text-ww-muted">
          Tip: any intel card you&apos;ve opened while online stays available
          offline. Save destinations now so you have them when you land.
        </p>
      </div>
    </main>
  );
}
