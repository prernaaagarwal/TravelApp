import { test, expect } from "@playwright/test";

/**
 * Responsive E2E: walks every core PRD route at mobile (375px) and desktop
 * (1280px). For each route × viewport it asserts:
 *   - Page responds with status < 400
 *   - A sentinel string from the page renders in the body
 *   - The right navigation pattern is showing (bottom MobileNav on phone,
 *     top Header desktop-nav on wide screens)
 *   - No horizontal scroll bar (the most common mobile-look bug)
 *   - A full-page screenshot is saved for visual review
 *
 * Routes that read live data from Supabase (intel cards, community posts,
 * contributor profiles) are skipped when the env is the CI placeholder URL,
 * since their pages 500 without a real DB. They still run in real CI where
 * NEXT_PUBLIC_SUPABASE_URL points at a live project.
 *
 * Note: /safety has its own dual-viewport spec (safety-hub.spec.ts) so it's
 * intentionally excluded here.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const HAS_REAL_DB  = SUPABASE_URL.length > 0 && !/placeholder/i.test(SUPABASE_URL);
// Pages whose primary content is rendered from Supabase queries. They return
// only the layout chrome (header + footer) when the DB is a placeholder.
const DB_DEPENDENT_PREFIXES = [
  "/intel/",
  "/contributor/",
  "/community",
  "/explore",
  "/feed",
];

const VIEWPORTS = [
  { label: "mobile-375",   viewport: { width: 375,  height: 812 } },
  { label: "desktop-1280", viewport: { width: 1280, height: 800 } },
];

const ROUTES: Array<{ path: string; expectText: RegExp; slug: string }> = [
  { path: "/",                            slug: "home",        expectText: /Wander Women|solo travel|trip intel/i },
  { path: "/explore",                     slug: "explore",     expectText: /solo female travel intel|trip intel library/i },
  { path: "/intel/goa-india",             slug: "intel-goa",   expectText: /Goa/ },
  { path: "/feed",                        slug: "feed",        expectText: /every rupee tracked|honest budget|receipts/i },
  { path: "/community",                   slug: "community",   expectText: /Community hub|group chat/i },
  { path: "/buddy",                       slug: "buddy",       expectText: /Solo, but not alone/i },
  { path: "/vault",                       slug: "vault",       expectText: /Your trip docs by WhatsApp|WhatsApp/i },
  { path: "/contributor/ananya-mumbai",   slug: "contributor", expectText: /Ananya/i },
];

for (const vp of VIEWPORTS) {
  test.describe(`responsive @ ${vp.label}`, () => {
    test.use({ viewport: vp.viewport });

    for (const route of ROUTES) {
      test(`${route.path} renders with correct nav and no overflow`, async ({ page }) => {
        const needsDb = DB_DEPENDENT_PREFIXES.some((p) => route.path.startsWith(p));
        test.skip(
          needsDb && !HAS_REAL_DB,
          `${route.path} reads from Supabase; set NEXT_PUBLIC_SUPABASE_URL to a real project to run this case.`,
        );

        const response = await page.goto(route.path);
        expect(response?.status(), `${route.path} should respond < 400`).toBeLessThan(400);

        await expect(page.locator("body")).toContainText(route.expectText);

        const mobileNav  = page.locator('[data-testid="mobile-nav"]');
        const headerNav  = page.locator('[data-testid="site-header"] nav').first();

        if (vp.viewport.width < 768) {
          // Phone: bottom bar shows; desktop primary nav is hidden
          await expect(mobileNav,  "bottom MobileNav should be visible at 375").toBeVisible();
          await expect(headerNav,  "desktop primary nav should be hidden at 375").toBeHidden();
        } else {
          // Desktop: top primary nav shows; bottom bar is hidden
          await expect(headerNav,  "desktop primary nav should be visible at 1280").toBeVisible();
          await expect(mobileNav,  "bottom MobileNav should be hidden at 1280").toBeHidden();
        }

        // Horizontal-overflow guard: page must fit the viewport.
        // Wait for network idle first — the PWA service-worker registration
        // and post-hydration prefetch can race with page.evaluate and
        // destroy the execution context. networkidle settles those.
        // Cap the wait at 5s so a never-idle route (PostHog beacon loops,
        // long-polling sockets, etc.) doesn't burn the whole test timeout.
        await page
          .waitForLoadState("networkidle", { timeout: 5000 })
          .catch(() => {});
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        expect(
          scrollWidth,
          `${route.path} must not overflow ${vp.viewport.width}px (got ${scrollWidth}px)`,
        ).toBeLessThanOrEqual(vp.viewport.width + 1);

        await page.screenshot({
          path: `tests/e2e/__screenshots__/responsive-${route.slug}-${vp.label}.png`,
          fullPage: true,
        });
      });
    }
  });
}
