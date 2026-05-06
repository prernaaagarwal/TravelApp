import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock Sentry's captureException so we can assert observability without
// pulling in the real SDK (and without polluting test output). Must be at
// the top of the file before the import of the module under test.
vi.mock("@sentry/nextjs", () => ({
  captureException: vi.fn(),
}));

// Imported AFTER the mock so safeQuery.ts picks up the mocked module.
import { safeQuery } from "@/lib/safe-query";
import * as Sentry from "@sentry/nextjs";

describe("safeQuery", () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.mocked(Sentry.captureException).mockClear();
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("returns data when the query resolves with rows", async () => {
    const rows = [{ id: "a" }, { id: "b" }];
    const result = await safeQuery(
      Promise.resolve({ data: rows }),
      [],
      100,
    );
    expect(result).toEqual(rows);
    // Happy path: no observability noise.
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(Sentry.captureException).not.toHaveBeenCalled();
  });

  it("returns the fallback when data is null (treated as 'row not found', not an error)", async () => {
    const result = await safeQuery(
      Promise.resolve({ data: null }),
      [],
      100,
    );
    expect(result).toEqual([]);
    // null data is the .single() / .maybeSingle() happy path. Don't alert.
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(Sentry.captureException).not.toHaveBeenCalled();
  });

  it("returns the fallback when the query rejects, and reports it", async () => {
    const result = await safeQuery(
      Promise.reject(new Error("supabase down")),
      [{ fallback: true }],
      100,
      "test.rejected",
    );
    expect(result).toEqual([{ fallback: true }]);
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy.mock.calls[0]?.[0]).toContain("safeQuery[test.rejected]");
    expect(consoleErrorSpy.mock.calls[0]?.[0]).toContain("supabase down");
    expect(Sentry.captureException).toHaveBeenCalledTimes(1);
    const calls = vi.mocked(Sentry.captureException).mock.calls;
    const [capturedErr, capturedCtx] = calls[0] ?? [];
    expect(capturedErr).toBeInstanceOf(Error);
    expect((capturedErr as Error).message).toBe("supabase down");
    expect(capturedCtx).toMatchObject({
      tags: { source: "safeQuery", reason: "rejected", label: "test.rejected" },
    });
  });

  it("returns the fallback when the query takes longer than timeoutMs, and reports it", async () => {
    const slow = new Promise<{ data: string[] }>((resolve) =>
      setTimeout(() => resolve({ data: ["late"] }), 50),
    );
    const start = Date.now();
    const result = await safeQuery(slow, [], 10, "test.slow");
    const elapsed = Date.now() - start;
    expect(result).toEqual([]);
    expect(elapsed).toBeLessThan(40);
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy.mock.calls[0]?.[0]).toContain("safeQuery[test.slow]");
    expect(consoleErrorSpy.mock.calls[0]?.[0]).toContain("timeout");
    expect(Sentry.captureException).toHaveBeenCalledTimes(1);
    const calls = vi.mocked(Sentry.captureException).mock.calls;
    const [, capturedCtx] = calls[0] ?? [];
    expect(capturedCtx).toMatchObject({
      tags: { source: "safeQuery", reason: "timeout", label: "test.slow" },
      extra: { timeoutMs: 10 },
    });
  });

  it("works with a single-row null fallback (mimics .single() / .maybeSingle())", async () => {
    type Row = { id: string };
    const fail = Promise.reject(new Error("nope"));
    const result = await safeQuery<Row | null>(fail, null, 100);
    expect(result).toBeNull();
    expect(Sentry.captureException).toHaveBeenCalledTimes(1);
  });

  it("falls back to '(unlabeled)' tag when no label is passed", async () => {
    await safeQuery(
      Promise.reject(new Error("oops")),
      [],
      50,
    );
    expect(consoleErrorSpy.mock.calls[0]?.[0]).toContain("safeQuery[(unlabeled)]");
    const calls = vi.mocked(Sentry.captureException).mock.calls;
    const [, capturedCtx] = calls[0] ?? [];
    expect(capturedCtx).toMatchObject({
      tags: { label: "(unlabeled)" },
    });
  });

  it("does not double-report when the query resolves before the timer fires", async () => {
    // Query resolves at 5ms; timer fires at 50ms (much later).
    const fast = new Promise<{ data: number[] }>((resolve) =>
      setTimeout(() => resolve({ data: [1, 2, 3] }), 5),
    );
    const result = await safeQuery(fast, [], 50, "test.fast");
    expect(result).toEqual([1, 2, 3]);
    // Wait past the timer so any pending log would have happened.
    await new Promise((r) => setTimeout(r, 80));
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(Sentry.captureException).not.toHaveBeenCalled();
  });
});
