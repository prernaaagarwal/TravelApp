export default function GlobalLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-sand">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-ww-border border-t-rust" />
        <p className="font-mono text-xs uppercase tracking-widest text-ww-muted">Loading</p>
      </div>
    </div>
  );
}
