import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/community/beware/goa", destination: "/community/beware/goa-india", permanent: false },
    ];
  },
  images: {
    remotePatterns: [
      // i.pravatar.cc — placeholder contributor avatars (mock data)
      { protocol: "https", hostname: "i.pravatar.cc" },
      // placehold.co — fallback placeholders if a product image is missing
      { protocol: "https", hostname: "placehold.co" },
      // m.media-amazon.com — Amazon product photos for the safety shop
      { protocol: "https", hostname: "m.media-amazon.com" },
      // *.supabase.co — user-uploaded photos (Beware Board, future user content)
      { protocol: "https", hostname: "*.supabase.co" },
      // images.unsplash.com — safety net while migrating remaining hotlinked
      // hero/trip photos to /public/images. Remove once all JSON entries
      // reference local paths.
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default withSentryConfig(nextConfig, {
  // Suppress noisy source-map upload warnings when SENTRY_AUTH_TOKEN is absent
  silent: true,

  // Inline source maps into the bundle; safe to omit SENTRY_AUTH_TOKEN
  sourcemaps: {
    disable: !process.env.SENTRY_AUTH_TOKEN,
  },

  webpack: {
    // Strip Sentry debug logs from production bundle
    treeshake: {
      removeDebugLogging: true,
    },
  },
});
