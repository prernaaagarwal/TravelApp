import type { MetadataRoute } from "next";
import { createStaticClient } from "@/lib/supabase/server";
import { safeQuery } from "@/lib/safe-query";
import { env } from "@/lib/config";

const SITE_URL = env.NEXT_PUBLIC_SITE_URL;

type CardSitemapRow = { slug: string; last_updated: string | null };
type ContributorSitemapRow = { slug: string };
type TripSitemapRow = { destination_slug: string };

// Higher timeout than the SSR default — sitemap regen is server-internal,
// not a user-blocking render. Better to wait 5s than emit a half-empty sitemap
// that drops crawlable URLs out of Google's index.
const SITEMAP_QUERY_TIMEOUT = 5000;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createStaticClient();

  const [cards, contributors, trips] = await Promise.all([
    safeQuery<CardSitemapRow[]>(
      supabase.from("intel_cards").select("slug, last_updated"),
      [],
      SITEMAP_QUERY_TIMEOUT,
      "sitemap.cards",
    ),
    safeQuery<ContributorSitemapRow[]>(
      supabase.from("contributors").select("slug"),
      [],
      SITEMAP_QUERY_TIMEOUT,
      "sitemap.contributors",
    ),
    safeQuery<TripSitemapRow[]>(
      supabase.from("trip_submissions").select("destination_slug").eq("status", "approved"),
      [],
      SITEMAP_QUERY_TIMEOUT,
      "sitemap.trips",
    ),
  ]);

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`,                  lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${SITE_URL}/explore`,           lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${SITE_URL}/feed`,              lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${SITE_URL}/community`,         lastModified: now, changeFrequency: "daily",   priority: 0.8 },
    { url: `${SITE_URL}/buddy`,             lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${SITE_URL}/shop`,              lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/vault`,             lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/onboarding`,        lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/account/login`,     lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/account/signup`,    lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/account/membership`,lastModified: now, changeFrequency: "monthly", priority: 0.4 },
  ];

  const intelRoutes: MetadataRoute.Sitemap = cards.map((c) => ({
    url: `${SITE_URL}/intel/${c.slug}`,
    lastModified: c.last_updated ? new Date(c.last_updated) : now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const contributorRoutes: MetadataRoute.Sitemap = contributors.map((c) => ({
    url: `${SITE_URL}/contributor/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Beware Board pages: one per unique destination from approved trips + intel cards
  const bewareCities = new Set<string>();
  cards.forEach((c) => c.slug && bewareCities.add(c.slug));
  trips.forEach((t) => t.destination_slug && bewareCities.add(t.destination_slug));

  const bewareRoutes: MetadataRoute.Sitemap = [...bewareCities].map((slug) => ({
    url: `${SITE_URL}/community/beware/${slug}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...intelRoutes, ...contributorRoutes, ...bewareRoutes];
}
