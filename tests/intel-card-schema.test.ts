import { describe, it, expect } from "vitest";
import { intelCardImportSchema } from "@/lib/intel-card-schema";

const minimal = {
  slug:           "test-city",
  destination:    "Test City",
  country:        "Testland",
  last_updated:   "2026-01-01",
  hero_image_url: "/images/intel/test.jpg",
  tldr:           { summary: "x" },
};

describe("intelCardImportSchema — required fields", () => {
  it("accepts the minimal required shape", () => {
    const r = intelCardImportSchema.safeParse(minimal);
    expect(r.success).toBe(true);
  });

  it("rejects a slug that's too short", () => {
    const r = intelCardImportSchema.safeParse({ ...minimal, slug: "x" });
    expect(r.success).toBe(false);
  });

  it("rejects a slug with uppercase letters", () => {
    const r = intelCardImportSchema.safeParse({ ...minimal, slug: "Test-City" });
    expect(r.success).toBe(false);
  });

  it("rejects a slug with spaces", () => {
    const r = intelCardImportSchema.safeParse({ ...minimal, slug: "test city" });
    expect(r.success).toBe(false);
  });

  it("accepts hyphens and digits in slug", () => {
    const r = intelCardImportSchema.safeParse({ ...minimal, slug: "city-2-india" });
    expect(r.success).toBe(true);
  });
});

describe("intelCardImportSchema — tldr forms", () => {
  it("accepts tldr as object with summary", () => {
    const r = intelCardImportSchema.safeParse({
      ...minimal,
      tldr: { summary: "Quick safety overview" },
    });
    expect(r.success).toBe(true);
  });

  it("accepts tldr as string array (legacy)", () => {
    const r = intelCardImportSchema.safeParse({
      ...minimal,
      tldr: ["bullet 1", "bullet 2"],
    });
    expect(r.success).toBe(true);
  });

  it("rejects tldr as plain string", () => {
    const r = intelCardImportSchema.safeParse({ ...minimal, tldr: "not an object or array" });
    expect(r.success).toBe(false);
  });
});

describe("intelCardImportSchema — hero_image_url", () => {
  it("accepts http URL", () => {
    const r = intelCardImportSchema.safeParse({ ...minimal, hero_image_url: "http://example.com/x.jpg" });
    expect(r.success).toBe(true);
  });

  it("accepts https URL", () => {
    const r = intelCardImportSchema.safeParse({ ...minimal, hero_image_url: "https://example.com/x.jpg" });
    expect(r.success).toBe(true);
  });

  it("accepts /public path", () => {
    const r = intelCardImportSchema.safeParse({ ...minimal, hero_image_url: "/images/intel/x.jpg" });
    expect(r.success).toBe(true);
  });

  it("rejects bare filename", () => {
    const r = intelCardImportSchema.safeParse({ ...minimal, hero_image_url: "x.jpg" });
    expect(r.success).toBe(false);
  });
});

describe("intelCardImportSchema — nested arrays", () => {
  it("validates a complete neighborhoods entry", () => {
    const r = intelCardImportSchema.safeParse({
      ...minimal,
      neighborhoods: [
        {
          name: "Old Town", safetyRating: 8, vibe: "v", notes: "n", stayHere: "s",
        },
      ],
    });
    expect(r.success).toBe(true);
  });

  it("rejects a neighborhood missing a required field", () => {
    const r = intelCardImportSchema.safeParse({
      ...minimal,
      neighborhoods: [{ name: "Old Town", safetyRating: 8, vibe: "v" }], // missing notes, stayHere
    });
    expect(r.success).toBe(false);
  });

  it("coerces safetyRating from string to number", () => {
    const r = intelCardImportSchema.safeParse({
      ...minimal,
      neighborhoods: [
        { name: "n", safetyRating: "8", vibe: "v", notes: "n", stayHere: "s" },
      ],
    });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.neighborhoods[0].safetyRating).toBe(8);
  });
});

describe("intelCardImportSchema — emergency_numbers polymorphism", () => {
  it("accepts array form", () => {
    const r = intelCardImportSchema.safeParse({
      ...minimal,
      emergency_numbers: [{ label: "Police", number: "100" }],
    });
    expect(r.success).toBe(true);
  });

  it("accepts map form", () => {
    const r = intelCardImportSchema.safeParse({
      ...minimal,
      emergency_numbers: { Police: "100", Ambulance: "108" },
    });
    expect(r.success).toBe(true);
  });
});

describe("intelCardImportSchema — affiliate_links optional", () => {
  it("defaults to empty object when omitted", () => {
    const r = intelCardImportSchema.safeParse(minimal);
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.affiliate_links).toEqual({});
  });

  it("validates booking URL when provided", () => {
    const r = intelCardImportSchema.safeParse({
      ...minimal,
      affiliate_links: { booking: "not-a-url" },
    });
    expect(r.success).toBe(false);
  });
});
