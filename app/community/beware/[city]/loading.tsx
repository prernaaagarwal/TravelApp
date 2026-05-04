export default function BewareCityLoading() {
  return (
    <div className="relative h-[calc(100vh-4rem)] w-full bg-sand">
      <div className="absolute inset-0 animate-pulse bg-ww-border/40" />

      <div className="absolute left-4 right-4 top-4 z-10 sm:right-auto sm:w-96">
        <div className="rounded-lg border border-ww-border bg-warm-white p-4 shadow-md">
          <div className="mb-3 flex items-center gap-2">
            <div className="h-4 w-4 animate-pulse rounded bg-ww-border" />
            <div className="h-5 w-40 animate-pulse rounded bg-ww-border" />
          </div>
          <div className="mb-2 h-3 w-full animate-pulse rounded bg-ww-border" />
          <div className="mb-4 h-3 w-3/4 animate-pulse rounded bg-ww-border" />
          <div className="space-y-3 border-t border-ww-border pt-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-1.5">
                <div className="h-3 w-2/3 animate-pulse rounded bg-ww-border" />
                <div className="h-2.5 w-full animate-pulse rounded bg-ww-border" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-warm-white px-4 py-2 text-center shadow-md">
        <p className="font-mono text-[10px] uppercase tracking-widest text-ww-muted">
          Loading scam map…
        </p>
      </div>
    </div>
  );
}
