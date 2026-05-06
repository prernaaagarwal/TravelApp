import * as Sentry from "@sentry/nextjs";

/**
 * Wraps a Supabase query so that a slow or failing DB doesn't hang the page.
 *
 * Server components that `await` a Supabase call block the entire SSR render
 * until the query resolves. If Supabase is unreachable, slow, or returns an
 * error, the user sees Next.js's loading.tsx spinner indefinitely (or a
 * 500-class error). For demo / V0 / V1 polish we'd rather return a sensible
 * fallback fast and keep the rest of the page rendering.
 *
 * Two outcomes always within `timeoutMs`:
 *   - the query resolves -> return its `.data ?? fallback`
 *   - the query rejects or the timer wins -> return `fallback`
 *
 * For list queries pass an empty array as fallback. For single-row queries
 * (`.single()` / `.maybeSingle()`) pass `null` and let the caller's existing
 * `if (!data) notFound()` logic handle it the same way it handles a true
 * "row not found".
 *
 * Observability: when the fallback path fires (query rejected, or timer won
 * before query settled), we emit a console.error AND capture a Sentry
 * exception tagged with the optional `label`. Sentry's nextjs SDK is only
 * `enabled: NODE_ENV === "production"` per /sentry.*.config.ts, so dev runs
 * are quiet aside from the console line. Without this, a slow / dead DB
 * looks identical to a healthy one — no alerts, no dashboards, flying blind.
 *
 * Note: a query that resolves with `data: null` for `.single()` / `.maybeSingle()`
 * is treated as the "row not found" happy-path and is NOT logged. We only
 * log true error paths (reject + timeout).
 */
export async function safeQuery<T>(
  thenable: PromiseLike<{ data: T | null }>,
  fallback: T,
  timeoutMs = 1500,
  label?: string,
): Promise<T> {
  let settled = false;

  const queryPromise = Promise.resolve(thenable)
    .then((r) => {
      settled = true;
      return r.data ?? fallback;
    })
    .catch((err) => {
      settled = true;
      reportFallback("rejected", label, err, timeoutMs);
      return fallback;
    });

  const timeoutPromise = new Promise<T>((resolve) =>
    setTimeout(() => {
      // Only log if the timer actually beat the query. If the query already
      // settled, this firing is harmless residue and would be misleading noise.
      if (!settled) {
        reportFallback("timeout", label, undefined, timeoutMs);
      }
      resolve(fallback);
    }, timeoutMs),
  );

  return Promise.race([queryPromise, timeoutPromise]);
}

type FallbackReason = "rejected" | "timeout";

function reportFallback(
  reason: FallbackReason,
  label: string | undefined,
  err: unknown,
  timeoutMs: number,
): void {
  const tag = label ?? "(unlabeled)";
  const message =
    reason === "timeout"
      ? `safeQuery[${tag}]: timeout exceeded ${timeoutMs}ms`
      : `safeQuery[${tag}]: query rejected: ${err instanceof Error ? err.message : String(err)}`;

  // Always console.error so dev sees the signal locally without needing Sentry.
  console.error(message);

  // Production: capture as a Sentry event so on-call has a dashboard + alerts.
  // Sentry.captureException is a safe no-op in dev (sentry.*.config.ts gates
  // `enabled: NODE_ENV === "production"`).
  Sentry.captureException(
    err instanceof Error ? err : new Error(message),
    {
      level: "warning",
      tags: { source: "safeQuery", reason, label: tag },
      extra: { timeoutMs },
    },
  );
}
