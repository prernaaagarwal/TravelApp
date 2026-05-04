import { describe, it, expect, vi } from "vitest";
import { checkRateLimit, LIMITS, type RateLimitConfig } from "@/lib/rate-limit";
import type { SupabaseClient } from "@supabase/supabase-js";

// Build a minimal SupabaseClient mock that returns a fixed `count`
function mockSupabase(count: number | null) {
  const builder = {
    select: vi.fn().mockReturnThis(),
    eq:     vi.fn().mockReturnThis(),
    gte:    vi.fn().mockResolvedValue({ count, data: null, error: null }),
  };
  return {
    from: vi.fn(() => builder),
  } as unknown as SupabaseClient;
}

const cfg: RateLimitConfig = {
  table:         "trip_submissions",
  userColumn:    "user_id",
  windowMinutes: 1440,
  max:           3,
};

describe("checkRateLimit", () => {
  it("allows when count is under the cap", async () => {
    const r = await checkRateLimit(mockSupabase(2), "user-1", cfg);
    expect(r.allowed).toBe(true);
    expect(r.used).toBe(2);
    expect(r.max).toBe(3);
    expect(r.message).toBeUndefined();
  });

  it("blocks at the cap (boundary)", async () => {
    const r = await checkRateLimit(mockSupabase(3), "user-1", cfg);
    expect(r.allowed).toBe(false);
    expect(r.used).toBe(3);
    expect(r.message).toMatch(/Rate limit reached/);
  });

  it("blocks above the cap", async () => {
    const r = await checkRateLimit(mockSupabase(99), "user-1", cfg);
    expect(r.allowed).toBe(false);
    expect(r.used).toBe(99);
  });

  it("treats null count from supabase as zero", async () => {
    const r = await checkRateLimit(mockSupabase(null), "user-1", cfg);
    expect(r.allowed).toBe(true);
    expect(r.used).toBe(0);
  });
});

describe("checkRateLimit — message formatting (window math)", () => {
  it("reports days when windowMinutes >= 1440", async () => {
    const r = await checkRateLimit(mockSupabase(5), "u", { ...cfg, max: 3, windowMinutes: 1440 });
    expect(r.message).toContain("1 day");
  });

  it("reports hours when 60 <= windowMinutes < 1440", async () => {
    const r = await checkRateLimit(mockSupabase(5), "u", { ...cfg, max: 3, windowMinutes: 60 });
    expect(r.message).toContain("1 hour");
  });

  it("reports minutes for short windows", async () => {
    const r = await checkRateLimit(mockSupabase(5), "u", { ...cfg, max: 3, windowMinutes: 5 });
    expect(r.message).toContain("5 minutes");
  });
});

describe("LIMITS pre-baked configs", () => {
  it("trip submissions: 3 per day", () => {
    expect(LIMITS.TRIP_SUBMISSIONS).toMatchObject({
      table:         "trip_submissions",
      userColumn:    "user_id",
      windowMinutes: 1440,
      max:           3,
    });
  });

  it("community posts: 10 per day", () => {
    expect(LIMITS.COMMUNITY_POSTS).toMatchObject({
      table:         "community_posts",
      userColumn:    "author_id",
      max:           10,
    });
  });

  it("beware reports: 5 per day", () => {
    expect(LIMITS.BEWARE_REPORTS).toMatchObject({
      table:         "beware_reports",
      userColumn:    "reported_by_id",
      max:           5,
    });
  });
});
