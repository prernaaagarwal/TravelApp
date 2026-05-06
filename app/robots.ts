import type { MetadataRoute } from "next";
import { env } from "@/lib/config";

const SITE_URL = env.NEXT_PUBLIC_SITE_URL;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api/",
          "/account/profile",
          "/account/settings",
          "/auth/",
          "/onboarding",
          "/profile/",
          "/verify-stay/",
          "/settings",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
