export default function IntelLoading() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-2 h-3 w-32 animate-pulse rounded bg-ww-border" />
      <div className="mb-4 h-10 w-2/3 animate-pulse rounded bg-ww-border" />
      <div className="mb-8 aspect-[16/9] w-full animate-pulse rounded bg-ww-border" />

      <div className="mb-8 space-y-3">
        <div className="h-3 w-24 animate-pulse rounded bg-ww-border" />
        <div className="h-4 w-full animate-pulse rounded bg-ww-border" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-ww-border" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-ww-border" />
      </div>

      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="border border-ww-border bg-sand p-4">
            <div className="mb-3 h-5 w-1/2 animate-pulse rounded bg-ww-border" />
            <div className="space-y-2">
              <div className="h-3 w-full animate-pulse rounded bg-ww-border" />
              <div className="h-3 w-4/5 animate-pulse rounded bg-ww-border" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
