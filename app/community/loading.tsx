export default function CommunityLoading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 h-8 w-48 animate-pulse rounded bg-ww-border" />
      <div className="mb-4 flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-8 w-20 animate-pulse rounded bg-ww-border" />
        ))}
      </div>
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded border border-ww-border bg-warm-white p-4">
            <div className="mb-2 h-5 w-3/4 animate-pulse rounded bg-ww-border" />
            <div className="mb-3 h-4 w-full animate-pulse rounded bg-ww-border" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-ww-border" />
          </div>
        ))}
      </div>
    </div>
  );
}
