/**
 * Seeds the Supabase database from local JSON mock-data files.
 *
 * Run after applying 001_init.sql:
 *   npx tsx scripts/seed-supabase.ts
 */

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { join } from "node:path";

config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n" +
      "Make sure .env.local is present.\n"
  );
  process.exit(1);
}

const supabase = createClient(url, key);
const dataDir = join(process.cwd(), "lib", "mock-data");

function read<T>(filename: string): T {
  return JSON.parse(readFileSync(join(dataDir, filename), "utf8")) as T;
}

// ── intel_cards ────────────────────────────────────────────────────────────

type RawCard = {
  slug: string;
  destination: string;
  country: string;
  audience: string;
  contributorSlug: string;
  lastUpdated: string;
  verifiedByCount: number;
  heroImageUrl: string;
  tldr: unknown[];
  neighborhoods: unknown[];
  scams: unknown[];
  transport: unknown[];
  hiddenGems: unknown[];
  preBookChecklist: unknown[];
  dosAndDonts: unknown;
  estimatedDailyBudget: unknown;
  emergencyNumbers: unknown[];
  isPremium: boolean;
  premiumPreview?: string;
  affiliateLinks: unknown;
};

async function seedIntelCards() {
  const cards = read<RawCard[]>("intel-cards.json");
  const rows = cards.map((c) => ({
    slug: c.slug,
    destination: c.destination,
    country: c.country,
    audience: c.audience,
    contributor_slug: c.contributorSlug,
    last_updated: c.lastUpdated,
    verified_by_count: c.verifiedByCount,
    hero_image_url: c.heroImageUrl,
    tldr: c.tldr,
    neighborhoods: c.neighborhoods,
    scams: c.scams,
    transport: c.transport,
    hidden_gems: c.hiddenGems,
    pre_book_checklist: c.preBookChecklist,
    dos_and_donts: c.dosAndDonts,
    estimated_daily_budget: c.estimatedDailyBudget,
    emergency_numbers: c.emergencyNumbers,
    is_premium: c.isPremium,
    premium_preview: c.premiumPreview ?? null,
    affiliate_links: c.affiliateLinks,
  }));
  const { error } = await supabase
    .from("intel_cards")
    .upsert(rows, { onConflict: "slug" });
  if (error) throw new Error(`intel_cards: ${error.message}`);
  console.log(`✓ intel_cards — ${rows.length} rows`);
}

// ── contributors ───────────────────────────────────────────────────────────

type RawContributor = {
  slug: string;
  name: string;
  fullName: string;
  homeCity: string;
  ageRange: string;
  tripCount: number;
  tagline: string;
  bio: string;
  photoUrl: string;
  badges: string[];
  destinationsContributed: string[];
  joinedDate: string;
  earningsThisMonth: number;
  totalContributions: number;
  answersInCommunity: number;
  instagram: string;
};

async function seedContributors() {
  const contributors = read<RawContributor[]>("contributors.json");
  const rows = contributors.map((c) => ({
    slug: c.slug,
    name: c.name,
    full_name: c.fullName,
    home_city: c.homeCity,
    age_range: c.ageRange,
    trip_count: c.tripCount,
    tagline: c.tagline,
    bio: c.bio,
    photo_url: c.photoUrl,
    badges: c.badges,
    destinations_contributed: c.destinationsContributed,
    joined_date: c.joinedDate,
    earnings_this_month: c.earningsThisMonth,
    total_contributions: c.totalContributions,
    answers_in_community: c.answersInCommunity,
    instagram: c.instagram,
  }));
  const { error } = await supabase
    .from("contributors")
    .upsert(rows, { onConflict: "slug" });
  if (error) throw new Error(`contributors: ${error.message}`);
  console.log(`✓ contributors — ${rows.length} rows`);
}

// ── community_posts ────────────────────────────────────────────────────────

type RawPost = {
  id: string;
  tab: string;
  author: string;
  authorAgeRange: string;
  homeCity: string;
  postedAt: string;
  content: string;
  destination?: string;
  replyCount: number;
  likeCount: number;
};

async function seedCommunityPosts() {
  const posts = read<RawPost[]>("community-posts.json");
  const rows = posts.map((p) => ({
    id: p.id,
    tab: p.tab,
    author_id: null,
    author_name: p.author,
    author_age_range: p.authorAgeRange,
    home_city: p.homeCity,
    content: p.content,
    destination: p.destination ?? null,
    status: "approved",
    reply_count: p.replyCount,
    like_count: p.likeCount,
    created_at: new Date(p.postedAt).toISOString(),
  }));
  const { error } = await supabase
    .from("community_posts")
    .upsert(rows, { onConflict: "id" });
  if (error) throw new Error(`community_posts: ${error.message}`);
  console.log(`✓ community_posts — ${rows.length} rows`);
}

// ── beware_reports ─────────────────────────────────────────────────────────

type RawBeware = {
  id: string;
  destinationSlug: string;
  city: string;
  category: string;
  title: string;
  severity: string;
  description: string;
  reportedBy: string;
  reportedDate: string;
  location: string;
  helpfulCount: number;
};

async function seedBewareReports() {
  const entries = read<RawBeware[]>("beware-entries.json");
  const rows = entries.map((b) => ({
    id: b.id,
    destination_slug: b.destinationSlug,
    city: b.city,
    category: b.category,
    title: b.title,
    severity: b.severity,
    description: b.description,
    reported_by_id: null,
    reported_by_name: b.reportedBy,
    location: b.location,
    helpful_count: b.helpfulCount,
    status: "approved",
    created_at: new Date(b.reportedDate).toISOString(),
  }));
  const { error } = await supabase
    .from("beware_reports")
    .upsert(rows, { onConflict: "id" });
  if (error) throw new Error(`beware_reports: ${error.message}`);
  console.log(`✓ beware_reports — ${rows.length} rows`);
}

// ── safety_products ────────────────────────────────────────────────────────

type RawProduct = {
  id: string;
  name: string;
  category: string;
  whyItMatters: string;
  priceRange: string;
  imageUrl: string;
  amazonUrl: string;
  displayOrder: number;
};

async function seedSafetyProducts() {
  const products = read<RawProduct[]>("shop-products.json");
  const rows = products.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    why_it_matters: p.whyItMatters,
    price_range: p.priceRange,
    image_url: p.imageUrl,
    amazon_url: p.amazonUrl,
    display_order: p.displayOrder,
  }));
  const { error } = await supabase
    .from("safety_products")
    .upsert(rows, { onConflict: "id" });
  if (error) throw new Error(`safety_products: ${error.message}`);
  console.log(`✓ safety_products — ${rows.length} rows`);
}

// ── main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log("Seeding Supabase from mock-data JSON...\n");
  await seedIntelCards();
  await seedContributors();
  await seedCommunityPosts();
  await seedBewareReports();
  await seedSafetyProducts();
  console.log("\nDone. Check Supabase Studio to verify rows.");
}

main().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
