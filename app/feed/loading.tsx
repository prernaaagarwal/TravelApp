export default function FeedLoading() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8">
        <div className="mb-2 h-3 w-32 animate-pulse rounded bg-ww-border" />
        <div className="mb-3 h-10 w-72 animate-pulse rounded bg-ww-border" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-ww-border" />
      </div>
      <div className="mb-6 flex flex-wrap gap-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-7 w-20 animate-pulse rounded-full bg-ww-border" />
        ))}
      </div>
      <div className="space-y-5">
        {[...Array(4)].map((_, i) => (
          <article key={i} className="border border-ww-border bg-sand p-5">
            <div className="mb-3 flex items-start gap-3">
              <div className="h-12 w-12 shrink-0 animate-pulse rounded-full bg-ww-border" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 animate-pulse rounded bg-ww-border" />
                <div className="h-3 w-48 animate-pulse rounded bg-ww-border" />
              </div>
              <div className="h-8 w-20 animate-pulse rounded bg-ww-border" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full animate-pulse rounded bg-ww-border" />
              <div className="h-3 w-5/6 animate-pulse rounded bg-ww-border" />
              <div className="h-3 w-3/4 animate-pulse rounded bg-ww-border" />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
