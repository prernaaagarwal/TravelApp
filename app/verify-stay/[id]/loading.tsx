import { RefreshCw } from "lucide-react";

export default function VerifyStayLoading() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 md:py-16 text-center">
      <RefreshCw className="h-10 w-10 text-rust animate-spin mx-auto mb-4" />
      <h1 className="font-serif text-2xl text-ink mb-2">Researching your listing…</h1>
      <p className="text-ww-muted text-sm">
        Searching the web for scam reports, hidden reviews, and destination-specific risks.
      </p>
      <div className="mt-8 space-y-3">
        {[80, 60, 70, 50].map((w, i) => (
          <div key={i} className="h-14 rounded-lg bg-ww-border/40 animate-pulse" style={{ width: `${w}%`, margin: "0 auto" }} />
        ))}
      </div>
    </main>
  );
}
