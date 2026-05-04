import { describe, it, expect } from "vitest";
import { parseImport, MAX_CARDS_PER_IMPORT, MAX_PAYLOAD_BYTES } from "@/lib/intel-import";

// Minimal valid card — anything missing is required default-eligible
function validCard(overrides: Record<string, unknown> = {}) {
  return {
    slug:           "valid-city",
    destination:    "Valid City",
    country:        "Validland",
    audience:       "both",
    last_updated:   "2026-01-01",
    hero_image_url: "/images/intel/valid-city.jpg",
    tldr:           { summary: "A summary" },
    ...overrides,
  };
}

describe("parseImport — fatal errors (top-level)", () => {
  it("rejects invalid JSON", () => {
    const r = parseImport("{not json");
    expect(r.ok).toBe(false);
    expect(r.fatal).toMatch(/Invalid JSON/i);
    expect(r.cards).toEqual([]);
  });

  it("rejects non-array top-level value", () => {
    const r = parseImport(JSON.stringify({ slug: "x" }));
    expect(r.ok).toBe(false);
    expect(r.fatal).toMatch(/array/i);
  });

  it("rejects empty array", () => {
    const r = parseImport("[]");
    expect(r.ok).toBe(false);
    expect(r.fatal).toMatch(/empty/i);
  });

  it("rejects payload over 100 cards", () => {
    const bigArray = new Array(MAX_CARDS_PER_IMPORT + 1).fill(validCard());
    const r = parseImport(JSON.stringify(bigArray));
    expect(r.ok).toBe(false);
    expect(r.fatal).toMatch(/Too many cards/i);
  });

  it("rejects payload over 5MB", () => {
    // Construct a string just over the limit without parsing it (parser short-circuits on size)
    const oversized = "x".repeat(MAX_PAYLOAD_BYTES + 1);
    const r = parseImport(oversized);
    expect(r.ok).toBe(false);
    expect(r.fatal).toMatch(/too large/i);
  });
});

describe("parseImport — row-level validation", () => {
  it("accepts a single minimal valid card", () => {
    const r = parseImport(JSON.stringify([validCard()]));
    expect(r.ok).toBe(true);
    expect(r.errors).toEqual([]);
    expect(r.cards).toHaveLength(1);
    expect(r.cards[0].slug).toBe("valid-city");
  });

  it("rejects a card missing required fields", () => {
    const r = parseImport(JSON.stringify([{ slug: "x" }]));
    expect(r.ok).toBe(false);
    expect(r.cards).toEqual([]);
    expect(r.errors).toHaveLength(1);
    expect(r.errors[0].slug).toBe("x");
  });

  it("rejects a card with an invalid slug pattern", () => {
    const r = parseImport(JSON.stringify([validCard({ slug: "Invalid Slug!" })]));
    expect(r.ok).toBe(false);
    expect(r.errors[0].message).toMatch(/slug/i);
  });

  it("rejects a card with malformed last_updated", () => {
    const r = parseImport(JSON.stringify([validCard({ last_updated: "yesterday" })]));
    expect(r.ok).toBe(false);
    expect(r.errors[0].message).toMatch(/YYYY-MM-DD/);
  });

  it("rejects a card with non-URL non-path hero_image_url", () => {
    const r = parseImport(JSON.stringify([validCard({ hero_image_url: "not-a-url-or-path" })]));
    expect(r.ok).toBe(false);
    expect(r.errors[0].message).toMatch(/hero_image_url/);
  });

  it("rejects a card with invalid audience enum", () => {
    const r = parseImport(JSON.stringify([validCard({ audience: "everyone" })]));
    expect(r.ok).toBe(false);
  });

  it("partially imports — valid rows surface in cards, invalid in errors", () => {
    const r = parseImport(JSON.stringify([
      validCard({ slug: "good-one" }),
      { slug: "bad" }, // missing required fields
      validCard({ slug: "good-two" }),
    ]));
    expect(r.ok).toBe(false); // overall not ok because errors > 0
    expect(r.cards.map((c) => c.slug)).toEqual(["good-one", "good-two"]);
    expect(r.errors).toHaveLength(1);
    expect(r.errors[0].slug).toBe("bad");
  });
});

describe("parseImport — duplicate slug detection", () => {
  it("flags in-file duplicate slugs as errors", () => {
    const r = parseImport(JSON.stringify([
      validCard({ slug: "shared-slug" }),
      validCard({ slug: "unique-slug" }),
      validCard({ slug: "shared-slug" }),
    ]));
    expect(r.ok).toBe(false);
    const dupErrors = r.errors.filter((e) => e.message.includes("Duplicate"));
    expect(dupErrors).toHaveLength(1);
    expect(dupErrors[0].slug).toBe("shared-slug");
    // First occurrence is still imported, second is flagged
    expect(r.cards.filter((c) => c.slug === "shared-slug")).toHaveLength(1);
  });

  it("treats different slugs as independent", () => {
    const r = parseImport(JSON.stringify([
      validCard({ slug: "city-one" }),
      validCard({ slug: "city-two" }),
    ]));
    expect(r.ok).toBe(true);
    expect(r.cards).toHaveLength(2);
  });
});

describe("parseImport — defaults and optional fields", () => {
  it("applies defaults for omitted optional jsonb fields", () => {
    const r = parseImport(JSON.stringify([validCard()]));
    expect(r.ok).toBe(true);
    expect(r.cards[0].neighborhoods).toEqual([]);
    expect(r.cards[0].scams).toEqual([]);
    expect(r.cards[0].pre_book_checklist).toEqual([]);
    expect(r.cards[0].dos_and_donts).toEqual({ do: [], dont: [] });
    expect(r.cards[0].is_premium).toBe(false);
    expect(r.cards[0].affiliate_links).toEqual({});
  });

  it("preserves explicitly set values", () => {
    const r = parseImport(JSON.stringify([
      validCard({
        is_premium: true,
        pre_book_checklist: ["a", "b"],
        affiliate_links: { booking: "https://booking.com/x" },
      }),
    ]));
    expect(r.ok).toBe(true);
    expect(r.cards[0].is_premium).toBe(true);
    expect(r.cards[0].pre_book_checklist).toEqual(["a", "b"]);
    expect(r.cards[0].affiliate_links.booking).toBe("https://booking.com/x");
  });
});
