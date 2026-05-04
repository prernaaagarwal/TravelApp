export default function ContributorLoading() {
  return (
    <>
      <div className="bg-sand px-6 py-12">
        <div className="mx-auto flex max-w-3xl flex-col items-start gap-6 sm:flex-row sm:items-center">
          <div className="h-24 w-24 shrink-0 animate-pulse rounded-full bg-ww-border" />
          <div className="flex-1 space-y-3">
            <div className="h-3 w-28 animate-pulse rounded bg-ww-border" />
            <div className="h-9 w-2/3 animate-pulse rounded bg-ww-border" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-ww-border" />
          </div>
        </div>
      </div>

      <div className="border-y border-ww-border bg-warm-white px-6 py-6">
        <div className="mx-auto grid max-w-3xl grid-cols-3 divide-x divide-ww-border">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="h-8 w-12 animate-pulse rounded bg-ww-border" />
              <div className="h-3 w-20 animate-pulse rounded bg-ww-border" />
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-12 space-y-14">
        <div className="space-y-3">
          <div className="h-3 w-24 animate-pulse rounded bg-ww-border" />
          <div className="h-4 w-full animate-pulse rounded bg-ww-border" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-ww-border" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-ww-border" />
        </div>
        <div className="space-y-4">
          <div className="h-3 w-32 animate-pulse rounded bg-ww-border" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border border-ww-border bg-warm-white">
                <div className="aspect-[4/3] w-full animate-pulse bg-ww-border" />
                <div className="space-y-2 p-4">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-ww-border" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-ww-border" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
