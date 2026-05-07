import { env } from "@/lib/config";

const SITE_URL = env.NEXT_PUBLIC_SITE_URL;

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Wander Women",
    url: SITE_URL,
    logo: `${SITE_URL}/icons/icon-192.png`,
    description:
      "Trip intelligence platform for solo women travellers — real safety reports, costs, and intel from named contributors.",
    sameAs: ["https://instagram.com/wanderwomenapp"],
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Wander Women",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/explore?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function intelCardLd(card: {
  slug: string;
  destination: string;
  country: string;
  hero_image_url: string | null;
  last_updated: string | null;
  contributor_name?: string | null;
}) {
  const url = `${SITE_URL}/intel/${card.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${card.destination}, ${card.country} — Solo travel intel`,
    description: `Safety reports, neighbourhoods, transport, and costs for solo women travelling to ${card.destination}.`,
    image: card.hero_image_url ?? `${SITE_URL}/og-default.jpg`,
    datePublished: card.last_updated ?? new Date().toISOString(),
    dateModified: card.last_updated ?? new Date().toISOString(),
    author: card.contributor_name
      ? { "@type": "Person", name: card.contributor_name }
      : { "@type": "Organization", name: "Wander Women" },
    publisher: {
      "@type": "Organization",
      name: "Wander Women",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icons/icon-192.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    about: {
      "@type": "TouristDestination",
      name: card.destination,
      addressCountry: card.country,
    },
  };
}

export function contributorLd(contributor: {
  slug: string;
  name: string;
  full_name?: string | null;
  bio?: string | null;
  photo_url?: string | null;
  home_city?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: contributor.full_name ?? contributor.name,
    alternateName: contributor.name,
    description: contributor.bio ?? undefined,
    image: contributor.photo_url ?? undefined,
    homeLocation: contributor.home_city
      ? { "@type": "Place", name: contributor.home_city }
      : undefined,
    url: `${SITE_URL}/contributor/${contributor.slug}`,
    worksFor: { "@type": "Organization", name: "Wander Women" },
  };
}

export function breadcrumbLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Google surfaces FAQPage schema as featured snippets in search results.
// Pass an array of {question, answer} pairs and we emit valid FAQPage JSON-LD.
// Caller is responsible for selecting the questions worth surfacing — pages
// with > ~10 entries get diminishing returns, so cap at the most relevant ones.
export function faqPageLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

// Build the canonical 4–5 FAQ entries for an intel card from its structured
// fields. Designed for AI engines (Perplexity, ChatGPT, Google AI Overviews)
// that lift FAQPage schema directly when answering long-tail safety queries.
//
// Why pre-computed: if we let the page emit FAQs from a hand-written list per
// card, contributors will skip the field. Pulling from the structured fields
// guarantees coverage on every card without extra editorial work.
export function intelCardFaqs(card: {
  destination: string;
  country: string;
  scams: { title: string; what?: string; avoid?: string }[];
  transport?: { mode: string; tip: string; approxCost?: string }[];
  estimatedDailyBudget?: {
    backpacker?: number;
    midRange?: number;
    comfortable?: number;
    currency?: string;
  } | null;
  lastUpdated?: string | null;
  contributorName?: string | null;
}): { question: string; answer: string }[] {
  const { destination, country } = card;
  const items: { question: string; answer: string }[] = [];
  const sourceLine = card.contributorName
    ? `Verified by ${card.contributorName}, a named contributor on Wander Women.`
    : "Verified by Wander Women's editorial team.";
  const updatedSuffix = card.lastUpdated
    ? ` Last verified ${card.lastUpdated}.`
    : "";

  // Q1 — the headline safety question every search engine sees
  const topScam = card.scams[0];
  items.push({
    question: `Is ${destination} safe for solo female travelers?`,
    answer: topScam
      ? `${destination}, ${country} is generally manageable for solo women travelers who plan ahead. The most commonly reported issue is "${topScam.title}"${topScam.avoid ? ` — ${topScam.avoid}` : ""}. ${sourceLine}${updatedSuffix}`
      : `${destination}, ${country} is generally manageable for solo women travelers who plan ahead. ${sourceLine}${updatedSuffix}`,
  });

  // Q2 — the top 3 scams as one consolidated answer (lifts well in AI summaries)
  if (card.scams.length > 0) {
    const scamSummary = card.scams
      .slice(0, 3)
      .map((s, i) => `${i + 1}. ${s.title}${s.what ? `: ${s.what}` : ""}`)
      .join(" ");
    items.push({
      question: `What are the most common scams in ${destination}?`,
      answer: `Top reported scams in ${destination}, ${country}: ${scamSummary} ${sourceLine}`,
    });
  }

  // Q3 — daily budget (high-intent query, often searched as "cost to travel")
  if (card.estimatedDailyBudget) {
    const cur = card.estimatedDailyBudget.currency ?? "INR";
    const parts: string[] = [];
    if (card.estimatedDailyBudget.backpacker)
      parts.push(`backpacker ~${card.estimatedDailyBudget.backpacker} ${cur}/day`);
    if (card.estimatedDailyBudget.midRange)
      parts.push(`mid-range ~${card.estimatedDailyBudget.midRange} ${cur}/day`);
    if (card.estimatedDailyBudget.comfortable)
      parts.push(`comfortable ~${card.estimatedDailyBudget.comfortable} ${cur}/day`);
    if (parts.length > 0) {
      items.push({
        question: `How much does it cost to travel solo in ${destination}?`,
        answer: `Estimated daily budgets for solo women travelers in ${destination}: ${parts.join(", ")}. Includes accommodation, food, and local transport. ${sourceLine}`,
      });
    }
  }

  // Q4 — transport (often the most-asked tactical question)
  const topTransport = card.transport?.[0];
  if (topTransport) {
    items.push({
      question: `What is the best way to get around ${destination}?`,
      answer: `${topTransport.mode} is the most reliable option in ${destination}: ${topTransport.tip}${topTransport.approxCost ? ` (approx ${topTransport.approxCost})` : ""}. ${sourceLine}`,
    });
  }

  // Q5 — emergency / "what should I know" — broad-intent capstone
  items.push({
    question: `What should I know before traveling solo to ${destination}?`,
    answer: `Read the latest verified intel for ${destination} on Wander Women — covers neighborhoods, scams, transport, hidden gems, and budget. ${sourceLine}${updatedSuffix}`,
  });

  return items;
}
