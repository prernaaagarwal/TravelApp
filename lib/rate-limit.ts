import type { SupabaseClient } from "@supabase/supabase-js";

export interface RateLimitConfig {
  /** Table to count rows in */
  table: string;
  /** Column on `table` referencing the user (e.g. "user_id", "author_id", "reported_by_id") */
  userColumn: string;
  /** Time window in minutes (1440 = 24h) */
  windowMinutes: number;
  /** Max rows the user is allowed to create within the window */
  max: number;
}

export interface RateLimitResult {
  allowed: boolean;
  used: number;
  max: number;
  /** Human-friendly message safe to surface to the user */
  message?: string;
}

/**
 * Checks how many rows the given user has created in `table` within the
 * configured window. Backed by a simple SELECT count(*) — no external
 * Redis dependency. Production-grade for moderate traffic; swap for
 * Upstash if you ever exceed ~50 RPS sustained on a single endpoint.
 *
 * Indexes on (userColumn, created_at) are required for this to stay
 * O(log n) at scale — see migration 016_indexes.sql.
 */
export async function checkRateLimit(
  supabase: SupabaseClient,
  userId: string,
  config: RateLimitConfig,
): Promise<RateLimitResult> {
  const since = new Date(Date.now() - config.windowMinutes * 60_000).toISOString();

  const { count } = await supabase
    .from(config.table)
    .select("*", { count: "exact", head: true })
    .eq(config.userColumn, userId)
    .gte("created_at", since);

  const used = count ?? 0;
  const allowed = used < config.max;

  return {
    allowed,
    used,
    max: config.max,
    message: allowed
      ? undefined
      : `Rate limit reached: ${config.max} per ${formatWindow(config.windowMinutes)}. Try again later.`,
  };
}

function formatWindow(minutes: number): string {
  if (minutes >= 1440) return `${minutes / 1440} day${minutes === 1440 ? "" : "s"}`;
  if (minutes >= 60)   return `${minutes / 60} hour${minutes === 60 ? "" : "s"}`;
  return `${minutes} minute${minutes === 1 ? "" : "s"}`;
}

/** Pre-baked configs used by the app — keeps limits in one place. */
export const LIMITS = {
  TRIP_SUBMISSIONS: {
    table: "trip_submissions",
    userColumn: "user_id",
    windowMinutes: 1440,
    max: 3,
  } satisfies RateLimitConfig,

  COMMUNITY_POSTS: {
    table: "community_posts",
    userColumn: "author_id",
    windowMinutes: 1440,
    max: 10,
  } satisfies RateLimitConfig,

  BEWARE_REPORTS: {
    table: "beware_reports",
    userColumn: "reported_by_id",
    windowMinutes: 1440,
    max: 5,
  } satisfies RateLimitConfig,
} as const;
