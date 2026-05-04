export default function ExploreLoading() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-10 max-w-xl">
        <div className="mb-2 h-3 w-32 animate-pulse rounded bg-ww-border" />
        <div className="mb-3 h-10 w-80 animate-pulse rounded bg-ww-border" />
        <div className="h-4 w-full animate-pulse rounded bg-ww-border" />
        <div className="mt-1 h-4 w-2/3 animate-pulse rounded bg-ww-border" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="border border-ww-border bg-warm-white">
            <div className="aspect-[4/3] w-full animate-pulse bg-ww-border" />
            <div className="space-y-2 p-4">
              <div className="h-5 w-3/4 animate-pulse rounded bg-ww-border" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-ww-border" />
              <div className="mt-3 h-3 w-full animate-pulse rounded bg-ww-border" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
