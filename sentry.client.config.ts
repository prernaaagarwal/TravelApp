import * as Sentry from "@sentry/nextjs";

// Session Replay was previously enabled at 1% session sampling. Even at 1%
// the replay integration adds ~50 KB to every client bundle and uploads
// recorded DOM diffs from sampled sessions. For a V1 product the on-error
// stack traces Sentry already captures are sufficient — drop replay.
// Re-enable later with `Sentry.lazyLoadIntegration("replayIntegration")`
// only when we actually need session video for a hard-to-repro bug.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Capture 100% of errors, 5% of performance traces in production
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.05 : 1.0,

  enabled: process.env.NODE_ENV === "production",
});
