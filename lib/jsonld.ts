const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wanderwomen.app";

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
