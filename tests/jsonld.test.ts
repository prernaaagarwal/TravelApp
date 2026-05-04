import { describe, it, expect } from "vitest";
import {
  organizationLd,
  websiteLd,
  intelCardLd,
  contributorLd,
  breadcrumbLd,
} from "@/lib/jsonld";

describe("organizationLd", () => {
  it("returns an Organization with required fields", () => {
    const ld = organizationLd();
    expect(ld["@type"]).toBe("Organization");
    expect(ld.name).toBe("Wander Women");
    expect(ld.url).toMatch(/^https?:\/\//);
    expect(ld.logo).toContain("/icons/icon-192.png");
  });
});

describe("websiteLd", () => {
  it("declares a SearchAction pointing at /explore", () => {
    const ld = websiteLd();
    expect(ld["@type"]).toBe("WebSite");
    expect(ld.potentialAction["@type"]).toBe("SearchAction");
    expect(ld.potentialAction.target).toContain("/explore");
    expect(ld.potentialAction.target).toContain("{search_term_string}");
  });
});

describe("intelCardLd", () => {
  const card = {
    slug:           "goa-india",
    destination:    "Goa",
    country:        "India",
    hero_image_url: "https://example.com/goa.jpg",
    last_updated:   "2026-01-01",
  };

  it("emits an Article with destination in the headline", () => {
    const ld = intelCardLd(card);
    expect(ld["@type"]).toBe("Article");
    expect(ld.headline).toContain("Goa");
    expect(ld.headline).toContain("India");
  });

  it("uses provided contributor name when given", () => {
    const ld = intelCardLd({ ...card, contributor_name: "Ananya Iyer" });
    expect(ld.author["@type"]).toBe("Person");
    expect(ld.author.name).toBe("Ananya Iyer");
  });

  it("falls back to Organization author when no contributor", () => {
    const ld = intelCardLd(card);
    expect(ld.author["@type"]).toBe("Organization");
  });

  it("falls back to default OG image when hero_image_url is null", () => {
    const ld = intelCardLd({ ...card, hero_image_url: null });
    expect(ld.image).toContain("/og-default.jpg");
  });

  it("includes a TouristDestination 'about' block", () => {
    const ld = intelCardLd(card);
    expect(ld.about["@type"]).toBe("TouristDestination");
    expect(ld.about.name).toBe("Goa");
    expect(ld.about.addressCountry).toBe("India");
  });
});

describe("contributorLd", () => {
  it("emits a Person with home location", () => {
    const ld = contributorLd({
      slug:      "ananya-mumbai",
      name:      "Ananya",
      full_name: "Ananya Iyer",
      bio:       "Spiti Valley expert.",
      home_city: "Mumbai",
    });
    expect(ld["@type"]).toBe("Person");
    expect(ld.name).toBe("Ananya Iyer");
    expect(ld.alternateName).toBe("Ananya");
    expect(ld.homeLocation?.name).toBe("Mumbai");
  });

  it("falls back to alternateName when full_name missing", () => {
    const ld = contributorLd({ slug: "x", name: "Just Ananya" });
    expect(ld.name).toBe("Just Ananya");
    expect(ld.alternateName).toBe("Just Ananya");
  });
});

describe("breadcrumbLd", () => {
  it("indexes items in 1-based position order", () => {
    const ld = breadcrumbLd([
      { name: "Home", url: "https://x.com/" },
      { name: "Explore", url: "https://x.com/explore" },
      { name: "Goa", url: "https://x.com/intel/goa-india" },
    ]);
    expect(ld["@type"]).toBe("BreadcrumbList");
    expect(ld.itemListElement).toHaveLength(3);
    expect(ld.itemListElement[0].position).toBe(1);
    expect(ld.itemListElement[2].position).toBe(3);
    expect(ld.itemListElement[2].name).toBe("Goa");
  });
});
