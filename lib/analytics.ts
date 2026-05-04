"use client";

import posthog from "posthog-js";

type Events = {
  intel_card_viewed:        { slug: string; destination: string; country: string };
  intel_section_opened:     { slug: string; section: string };
  beware_report_clicked:    { reportId: string; severity: string; city: string | null };
  trip_card_viewed:         { tripId: string; destinationSlug: string };
  community_post_viewed:    { postId: string; tab: string };
  buddy_match_clicked:      { destination: string };
  signup_started:           { source: string };
  signup_completed:         Record<string, never>;
  membership_clicked:       { tier: string; source: string };
  trip_submitted:           { destinationSlug: string };
  beware_submitted:         { severity: string; city: string | null };
  community_post_submitted: { tab: string };
  vault_clicked:            { destinationSlug: string };
  shop_product_clicked:     { productId: string };
  intel_share_clicked:      { slug: string };
  external_link_clicked:    { href: string; label: string };
};

export function track<K extends keyof Events>(event: K, props: Events[K]) {
  if (typeof window === "undefined") return;
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
  posthog.capture(event, props);
}

export function identifyUser(userId: string, traits: Record<string, string | number | boolean>) {
  if (typeof window === "undefined") return;
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
  posthog.identify(userId, traits);
}

export function resetIdentity() {
  if (typeof window === "undefined") return;
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
  posthog.reset();
}
