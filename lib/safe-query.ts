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
 */
export async function safeQuery<T>(
  thenable: PromiseLike<{ data: T | null }>,
  fallback: T,
  timeoutMs = 1500,
): Promise<T> {
  return Promise.race([
    Promise.resolve(thenable)
      .then((r) => r.data ?? fallback)
      .catch(() => fallback),
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), timeoutMs)),
  ]);
}
