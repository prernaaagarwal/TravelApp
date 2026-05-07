import type { MetadataRoute } from "next";
import { env } from "@/lib/config";

const SITE_URL = env.NEXT_PUBLIC_SITE_URL;

export default function robots(): MetadataRoute.Robots {
  // /api/mcp is the public MCP endpoint for AI agents — must be reachable
  // by Claude, ChatGPT, Perplexity, Bing, etc. /.well-known/mcp.json is its
  // discovery manifest. Both override the broader /api/ disallow.
  const sharedDisallow = [
    "/admin",
    "/admin/",
    "/account/profile",
    "/account/settings",
    "/auth/",
    "/onboarding",
    "/profile/",
    "/verify-stay/",
    "/settings",
  ];
  const sharedAllow = ["/", "/api/mcp", "/.well-known/", "/llms.txt"];

  return {
    rules: [
      {
        userAgent: "*",
        allow: sharedAllow,
        // Block private API routes by default; explicit allow above wins.
        disallow: [...sharedDisallow, "/api/"],
      },
      // Explicitly allow known AI crawlers — both for citation graph
      // entry and so they can hit the MCP endpoint without ambiguity.
      {
        userAgent: ["GPTBot", "ChatGPT-User", "OAI-SearchBot"],
        allow: sharedAllow,
        disallow: sharedDisallow,
      },
      {
        userAgent: ["ClaudeBot", "Claude-Web", "anthropic-ai"],
        allow: sharedAllow,
        disallow: sharedDisallow,
      },
      {
        userAgent: ["PerplexityBot", "Perplexity-User"],
        allow: sharedAllow,
        disallow: sharedDisallow,
      },
      {
        userAgent: ["Google-Extended", "GoogleOther"],
        allow: sharedAllow,
        disallow: sharedDisallow,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
