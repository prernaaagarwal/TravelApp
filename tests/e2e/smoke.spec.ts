import { test, expect } from "@playwright/test";

/**
 * Smoke tests: every public route must render without crashing.
 * No auth, no DB writes. Catches catastrophic regressions where a page
 * 500s on bad data or a build error escapes lint/type-check.
 */

const ROUTES: Array<{ path: string; expectText: string | RegExp }> = [
  { path: "/",                       expectText: /Wander Women|solo travel|trip intel/i },
  { path: "/explore",                expectText: /Browse all destinations/i },
  { path: "/intel/goa-india",        expectText: /Goa/ },
  { path: "/feed",                   expectText: /What it actually cost/i },
  { path: "/community",              expectText: /Community hub|group chat/i },
  { path: "/buddy",                  expectText: /Solo, but not alone/i },
  { path: "/pitch",                  expectText: /./ }, // any non-error content
];

for (const { path, expectText } of ROUTES) {
  test(`smoke: ${path} renders 200 with expected content`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status(), `${path} should respond 200`).toBeLessThan(400);
    await expect(page.locator("body")).toContainText(expectText);
  });
}

test("signup form renders and accepts email", async ({ page }) => {
  await page.goto("/account/signup");
  await expect(page.locator("body")).toContainText(/sign up|create account|Wander Women/i);
  // Form should be present with an email input
  const emailInput = page.locator('input[type="email"], input[name="email"]').first();
  await expect(emailInput).toBeVisible();
  // Don't submit -- we don't want to actually trigger an OTP email.
});
