import type { NextConfig } from "next";

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
      // *.supabase.co — user-uploaded photos (Beware Board, future user content)
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
