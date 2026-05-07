// IndexNow client — pings Bing / Yandex / search engines that subscribe
// to the IndexNow protocol when content changes, so AI engines that pull
// from those indexes (notably ChatGPT search via Bing) pick up new
// content within hours instead of days.
//
// Spec: https://www.indexnow.org/
//
// Setup (one-time, founder action):
//   1. Generate a key:   openssl rand -hex 16
//   2. Set env var:      INDEXNOW_KEY=<the key>
//   3. Place key file:   public/<the key>.txt   (single line: the key)
//      (e.g. public/abc123def456.txt with content "abc123def456")
//   4. Deploy. Verify the key file is reachable at
//      https://wanderwomen.in/<key>.txt
//
// At runtime: when a beware report is approved (or any other content
// changes), call notifyIndexNow([...urls]) to ping the API. The call is
// fire-and-forget — failures are logged but don't block the calling
// flow. IndexNow is best-effort.

import { env } from "@/lib/config";

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/IndexNow";

type IndexNowPayload = {
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
};

/**
 * Notify IndexNow that one or more URLs have changed. Fire-and-forget —
 * never throws. Logs to console on failure for Sentry to pick up.
 *
 * No-op if INDEXNOW_KEY isn't configured (graceful degradation in dev).
 */
export async function notifyIndexNow(urls: string[]): Promise<void> {
  const key = env.INDEXNOW_KEY;
  if (!key) {
    return;
  }

  if (urls.length === 0) return;

  const siteUrl = env.NEXT_PUBLIC_SITE_URL;
  let host: string;
  try {
    host = new URL(siteUrl).hostname;
  } catch {
    console.warn("[indexnow] NEXT_PUBLIC_SITE_URL is not a valid URL; skipping ping.");
    return;
  }

  // IndexNow accepts up to 10,000 URLs per request, but we batch at 100
  // to keep request size sensible.
  const batches: string[][] = [];
  for (let i = 0; i < urls.length; i += 100) {
    batches.push(urls.slice(i, i + 100));
  }

  for (const batch of batches) {
    const payload: IndexNowPayload = {
      host,
      key,
      keyLocation: `${siteUrl.replace(/\/$/, "")}/${key}.txt`,
      urlList: batch,
    };

    try {
      const res = await fetch(INDEXNOW_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      // 200 / 202 = accepted. Anything else is logged but not retried —
      // the next content change will re-notify the affected URLs anyway.
      if (!res.ok) {
        console.warn(
          `[indexnow] ${res.status} ${res.statusText} for ${batch.length} url(s)`,
        );
      }
    } catch (err) {
      console.warn(
        `[indexnow] network error pinging ${batch.length} url(s):`,
        err instanceof Error ? err.message : err,
      );
    }
  }
}

/**
 * Fire-and-forget wrapper — calls notifyIndexNow without awaiting it
 * so the caller's flow isn't blocked by a slow IndexNow response.
 *
 * Use this from server actions where the flow redirects immediately
 * after the DB write — e.g. the beware-report approval action.
 */
export function notifyIndexNowFireAndForget(urls: string[]): void {
  // Intentionally unhandled promise — the function itself swallows errors.
  void notifyIndexNow(urls);
}
