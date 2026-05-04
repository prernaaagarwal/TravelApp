import { describe, it, expect, vi } from "vitest";
import { checkBanned } from "@/lib/ban-check";
import type { SupabaseClient } from "@supabase/supabase-js";

function mockProfilesSelect(profileRow: { is_banned?: boolean } | null) {
  return {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq:     vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: profileRow, error: null }),
    })),
  } as unknown as SupabaseClient;
}

describe("checkBanned", () => {
  it("returns banned=true when profile.is_banned is true", async () => {
    const r = await checkBanned(mockProfilesSelect({ is_banned: true }), "user-1");
    expect(r.banned).toBe(true);
    expect(r.message).toMatch(/suspended/i);
  });

  it("returns banned=false when is_banned is false", async () => {
    const r = await checkBanned(mockProfilesSelect({ is_banned: false }), "user-1");
    expect(r.banned).toBe(false);
    expect(r.message).toBe("");
  });

  it("returns banned=false when profile row is missing", async () => {
    const r = await checkBanned(mockProfilesSelect(null), "user-1");
    expect(r.banned).toBe(false);
  });

  it("returns banned=false when is_banned column is absent (treats as not banned)", async () => {
    const r = await checkBanned(mockProfilesSelect({}), "user-1");
    expect(r.banned).toBe(false);
  });

  it("never leaks a ban reason in the user-facing message", async () => {
    const r = await checkBanned(mockProfilesSelect({ is_banned: true }), "user-1");
    // Message must be generic — leaking reasons would let bad actors learn
    // exactly what triggered enforcement
    expect(r.message).not.toMatch(/spam|scam|abuse|violation/i);
  });
});
