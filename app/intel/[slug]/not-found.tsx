import Link from "next/link";

export default function IntelNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
        404
      </p>
      <h1 className="mb-3 font-serif text-4xl text-ink">Card not found</h1>
      <p className="mb-8 max-w-sm font-mono text-xs leading-relaxed text-ww-muted">
        We don&apos;t have intel for that destination yet. Browse what we&apos;ve got — 15
        cards and counting.
      </p>
      <Link
        href="/explore"
        className="border border-ink bg-ink px-6 py-2.5 font-mono text-xs uppercase tracking-widest text-warm-white hover:bg-ink/80 transition-colors"
      >
        Browse all destinations →
      </Link>
    </div>
  );
}
