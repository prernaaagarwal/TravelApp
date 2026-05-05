import Link from "next/link";

export const metadata = {
  title: "Unsubscribed — Wander Women",
  robots: { index: false, follow: false },
};

const KIND_LABELS: Record<string, string> = {
  "digest": "the weekly digest",
  "beware-saver": "real-time beware alerts",
  "community-reply": "community reply notifications",
  "platform-updates": "platform updates",
};

type SearchParams = Promise<{ kind?: string; error?: string }>;

export default async function UnsubscribedPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { kind, error } = await searchParams;
  const label = (kind && KIND_LABELS[kind]) ?? "this email";

  return (
    <main className="mx-auto max-w-lg px-6 py-20">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-rust">
        {error ? "Hmm." : "You're unsubscribed."}
      </p>
      <h1 className="mb-4 font-serif text-3xl text-ink md:text-4xl">
        {error === "invalid"
          ? "This unsubscribe link is invalid."
          : error === "write"
            ? "Something went wrong."
            : `You won't get ${label} from us anymore.`}
      </h1>
      <p className="mb-6 font-mono text-sm leading-relaxed text-ww-muted">
        {error === "invalid"
          ? "It may have been edited or copied wrong. Sign in to manage your preferences directly."
          : error === "write"
            ? "We couldn't save your preference. Sign in to manage it directly — no one will email you in the meantime."
            : "It took effect immediately. If this was a mistake, sign in and flip the toggle back on."}
      </p>
      <div className="flex flex-wrap gap-2">
        <Link
          href="/settings#notifications"
          className="border border-ink bg-ink px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-warm-white"
        >
          Manage all preferences →
        </Link>
        <Link
          href="/"
          className="border border-ww-border bg-warm-white px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-ww-muted hover:border-ink hover:text-ink"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
