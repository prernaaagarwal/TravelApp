import { describe, it, expect } from "vitest";
import {
  organizationLd,
  websiteLd,
  intelCardLd,
  contributorLd,
  breadcrumbLd,
  faqPageLd,
  intelCardFaqs,
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

describe("faqPageLd", () => {
  it("wraps {question, answer} pairs in valid FAQPage schema", () => {
    const ld = faqPageLd([
      { question: "Is Goa safe?", answer: "Generally yes." },
      { question: "Best transport?", answer: "Scooter." },
    ]);
    expect(ld["@type"]).toBe("FAQPage");
    expect(ld.mainEntity).toHaveLength(2);
    expect(ld.mainEntity[0]["@type"]).toBe("Question");
    expect(ld.mainEntity[0].name).toBe("Is Goa safe?");
    expect(ld.mainEntity[0].acceptedAnswer["@type"]).toBe("Answer");
    expect(ld.mainEntity[0].acceptedAnswer.text).toBe("Generally yes.");
  });

  it("handles an empty list without crashing", () => {
    const ld = faqPageLd([]);
    expect(ld.mainEntity).toEqual([]);
  });
});

describe("intelCardFaqs", () => {
  const baseCard = {
    destination: "Goa",
    country: "India",
    scams: [
      { title: "Taxi overcharge", what: "Drivers refuse meter", avoid: "Use Uber" },
      { title: "Drink spike", what: "Open drinks at clubs" },
      { title: "Beach theft" },
      { title: "Fourth scam — should be ignored" },
    ],
  };

  it("always produces the headline + emergency questions (Q1 + Q5)", () => {
    const faqs = intelCardFaqs({ ...baseCard, scams: [] });
    expect(faqs.length).toBeGreaterThanOrEqual(2);
    expect(faqs[0].question).toContain("Is Goa safe");
    expect(faqs[faqs.length - 1].question).toContain("What should I know");
  });

  it("includes the top scam in Q1 when scams exist", () => {
    const faqs = intelCardFaqs(baseCard);
    expect(faqs[0].answer).toContain("Taxi overcharge");
    expect(faqs[0].answer).toContain("Use Uber"); // avoid copy
  });

  it("emits Q2 listing the top 3 scams (caps at 3)", () => {
    const faqs = intelCardFaqs(baseCard);
    const scamQ = faqs.find((f) => f.question.includes("most common scams"));
    expect(scamQ).toBeDefined();
    expect(scamQ?.answer).toContain("Taxi overcharge");
    expect(scamQ?.answer).toContain("Drink spike");
    expect(scamQ?.answer).toContain("Beach theft");
    expect(scamQ?.answer).not.toContain("Fourth scam");
  });

  it("emits Q3 with budget tiers when daily budget provided", () => {
    const faqs = intelCardFaqs({
      ...baseCard,
      estimatedDailyBudget: { backpacker: 1500, midRange: 3000, comfortable: 6000, currency: "INR" },
    });
    const budgetQ = faqs.find((f) => f.question.includes("How much"));
    expect(budgetQ).toBeDefined();
    expect(budgetQ?.answer).toContain("backpacker ~1500 INR");
    expect(budgetQ?.answer).toContain("mid-range ~3000 INR");
    expect(budgetQ?.answer).toContain("comfortable ~6000 INR");
  });

  it("defaults currency to INR when omitted", () => {
    const faqs = intelCardFaqs({
      ...baseCard,
      estimatedDailyBudget: { backpacker: 1500 },
    });
    const budgetQ = faqs.find((f) => f.question.includes("How much"));
    expect(budgetQ?.answer).toContain("1500 INR");
  });

  it("skips Q3 entirely when budget is null or all tiers missing", () => {
    const noBudget = intelCardFaqs({ ...baseCard, estimatedDailyBudget: null });
    expect(noBudget.find((f) => f.question.includes("How much"))).toBeUndefined();

    const emptyBudget = intelCardFaqs({ ...baseCard, estimatedDailyBudget: {} });
    expect(emptyBudget.find((f) => f.question.includes("How much"))).toBeUndefined();
  });

  it("emits Q4 with transport mode + cost when transport given", () => {
    const faqs = intelCardFaqs({
      ...baseCard,
      transport: [{ mode: "Scooter", tip: "Rent in Anjuna", approxCost: "₹400/day" }],
    });
    const transportQ = faqs.find((f) => f.question.includes("get around"));
    expect(transportQ).toBeDefined();
    expect(transportQ?.answer).toContain("Scooter");
    expect(transportQ?.answer).toContain("Rent in Anjuna");
    expect(transportQ?.answer).toContain("₹400/day");
  });

  it("uses contributor attribution when provided", () => {
    const faqs = intelCardFaqs({ ...baseCard, contributorName: "Ananya Iyer" });
    expect(faqs[0].answer).toContain("Verified by Ananya Iyer");
  });

  it("falls back to editorial team line when no contributor", () => {
    const faqs = intelCardFaqs(baseCard);
    expect(faqs[0].answer).toContain("Wander Women's editorial team");
  });

  it("appends 'Last verified' suffix when lastUpdated given", () => {
    const faqs = intelCardFaqs({ ...baseCard, lastUpdated: "2026-04-01" });
    expect(faqs[0].answer).toContain("Last verified 2026-04-01");
  });
});
