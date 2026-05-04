import { describe, it, expect, vi } from "vitest";
import { searchAll } from "@/lib/search";
import type { SupabaseClient } from "@supabase/supabase-js";

function mockSupabase(rows: unknown[]) {
  return {
    rpc: vi.fn().mockResolvedValue({ data: rows, error: null }),
  } as unknown as SupabaseClient;
}

function mockSupabaseError() {
  return {
    rpc: vi.fn().mockResolvedValue({ data: null, error: { message: "boom" } }),
  } as unknown as SupabaseClient;
}

describe("searchAll", () => {
  it("returns [] for queries shorter than the minimum length", async () => {
    const sb = mockSupabase([]);
    expect(await searchAll(sb, "")).toEqual([]);
    expect(await searchAll(sb, " ")).toEqual([]);
    expect(await searchAll(sb, "a")).toEqual([]);
  });

  it("returns [] when the RPC errors", async () => {
    const r = await searchAll(mockSupabaseError(), "goa");
    expect(r).toEqual([]);
  });

  it("returns [] when RPC returns null data", async () => {
    const sb = { rpc: vi.fn().mockResolvedValue({ data: null, error: null }) } as unknown as SupabaseClient;
    expect(await searchAll(sb, "goa")).toEqual([]);
  });

  it("builds intel hrefs from slug", async () => {
    const sb = mockSupabase([
      {
        result_type: "intel",
        id: "goa-india", title: "Goa, India", excerpt: "x", slug: "goa-india", rank: 0.9,
      },
    ]);
    const r = await searchAll(sb, "goa");
    expect(r[0].href).toBe("/intel/goa-india");
    expect(r[0].type).toBe("intel");
  });

  it("builds beware hrefs with the destination_slug as a fragment anchor", async () => {
    const sb = mockSupabase([
      {
        result_type: "beware",
        id: "uuid-1", title: "Tuk-tuk scam", excerpt: "x", slug: "delhi-india", rank: 0.5,
      },
    ]);
    const r = await searchAll(sb, "scam");
    expect(r[0].href).toBe("/community/beware/delhi-india#uuid-1");
  });

  it("falls back to /community#id for beware without slug", async () => {
    const sb = mockSupabase([
      { result_type: "beware", id: "uuid-2", title: "x", excerpt: "y", slug: "", rank: 0.5 },
    ]);
    const r = await searchAll(sb, "test");
    expect(r[0].href).toBe("/community#beware-uuid-2");
  });

  it("URL-encodes destination in post hrefs", async () => {
    const sb = mockSupabase([
      { result_type: "post", id: "post-1", title: "x", excerpt: "y", slug: "Goa, India", rank: 0.5 },
    ]);
    const r = await searchAll(sb, "test");
    expect(r[0].href).toBe("/community?destination=Goa%2C%20India#post-1");
  });

  it("preserves all rows and their ranks in order", async () => {
    const sb = mockSupabase([
      { result_type: "intel",  id: "a", title: "A", excerpt: "",  slug: "a", rank: 0.9 },
      { result_type: "post",   id: "b", title: "B", excerpt: "",  slug: "",  rank: 0.5 },
      { result_type: "beware", id: "c", title: "C", excerpt: "",  slug: "",  rank: 0.3 },
    ]);
    const r = await searchAll(sb, "test");
    expect(r).toHaveLength(3);
    expect(r.map((x) => x.id)).toEqual(["a", "b", "c"]);
    expect(r.map((x) => x.rank)).toEqual([0.9, 0.5, 0.3]);
  });

  it("normalizes null excerpt to empty string", async () => {
    const sb = mockSupabase([
      { result_type: "intel", id: "x", title: "X", excerpt: null, slug: "x", rank: 0.5 },
    ]);
    const r = await searchAll(sb, "test");
    expect(r[0].excerpt).toBe("");
  });
});
