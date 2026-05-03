import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/client";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wanderwomen.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/explore",
    "/community",
    "/feed",
    "/buddy",
    "/vault",
    "/shop",
    "/onboarding",
    "/account/login",
    "/account/signup",
    "/account/membership",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1.0 : 0.7,
  }));

  // Intel cards (dynamic)
  const supabase = createClient();
  const { data: cards } = await supabase.from("intel_cards").select("slug, last_updated");
  const intelRoutes: MetadataRoute.Sitemap = (cards ?? []).map((c) => ({
    url: `${SITE_URL}/intel/${c.slug}`,
    lastModified: c.last_updated ? new Date(c.last_updated) : now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...intelRoutes];
}
