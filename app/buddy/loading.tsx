export default function BuddyLoading() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-10">
        <div className="mb-2 h-3 w-32 animate-pulse rounded bg-ww-border" />
        <div className="mb-3 h-10 w-64 animate-pulse rounded bg-ww-border" />
        <div className="h-4 w-full animate-pulse rounded bg-ww-border" />
        <div className="mt-1 h-4 w-3/4 animate-pulse rounded bg-ww-border" />
      </div>
      <div className="space-y-5">
        {[...Array(3)].map((_, i) => (
          <article key={i} className="border border-ww-border bg-sand p-5">
            <div className="flex flex-wrap items-start gap-4">
              <div className="h-16 w-16 shrink-0 animate-pulse rounded-full bg-ww-border" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-7 w-40 animate-pulse rounded bg-ww-border" />
                <div className="h-3 w-56 animate-pulse rounded bg-ww-border" />
                <div className="h-3 w-32 animate-pulse rounded bg-ww-border" />
                <div className="mt-2 flex gap-1.5">
                  <div className="h-5 w-16 animate-pulse rounded-full bg-ww-border" />
                  <div className="h-5 w-20 animate-pulse rounded-full bg-ww-border" />
                </div>
              </div>
            </div>
            <div className="mt-5 border-t border-ww-border pt-4">
              <div className="h-9 w-32 animate-pulse rounded bg-ww-border" />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
