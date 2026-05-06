import { describe, it, expect } from "vitest";
import { safeQuery } from "@/lib/safe-query";

describe("safeQuery", () => {
  it("returns data when the query resolves with rows", async () => {
    const rows = [{ id: "a" }, { id: "b" }];
    const result = await safeQuery(
      Promise.resolve({ data: rows }),
      [],
      100,
    );
    expect(result).toEqual(rows);
  });

  it("returns the fallback when data is null", async () => {
    const result = await safeQuery(
      Promise.resolve({ data: null }),
      [],
      100,
    );
    expect(result).toEqual([]);
  });

  it("returns the fallback when the query rejects", async () => {
    const result = await safeQuery(
      Promise.reject(new Error("supabase down")),
      [{ fallback: true }],
      100,
    );
    expect(result).toEqual([{ fallback: true }]);
  });

  it("returns the fallback when the query takes longer than timeoutMs", async () => {
    // A query that takes 50ms; timeout fires at 10ms.
    const slow = new Promise<{ data: string[] }>((resolve) =>
      setTimeout(() => resolve({ data: ["late"] }), 50),
    );
    const start = Date.now();
    const result = await safeQuery(slow, [], 10);
    const elapsed = Date.now() - start;
    expect(result).toEqual([]);
    // Should have returned roughly at the timeout, not after the slow query.
    expect(elapsed).toBeLessThan(40);
  });

  it("works with a single-row null fallback (mimics .single() / .maybeSingle())", async () => {
    type Row = { id: string };
    const fail = Promise.reject(new Error("nope"));
    const result = await safeQuery<Row | null>(fail, null, 100);
    expect(result).toBeNull();
  });
});
