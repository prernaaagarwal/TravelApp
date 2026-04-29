export default function AccountLoading() {
  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <div className="mb-6 h-7 w-40 animate-pulse rounded bg-ww-border" />
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="h-4 w-24 animate-pulse rounded bg-ww-border" />
            <div className="h-10 w-full animate-pulse rounded bg-ww-border" />
          </div>
        ))}
        <div className="mt-2 h-10 w-full animate-pulse rounded bg-rust/20" />
      </div>
    </div>
  );
}
