import { test, expect } from "@playwright/test";

const VIEWPORTS = [
  { label: "mobile-375",   viewport: { width: 375,  height: 812 } },
  { label: "desktop-1280", viewport: { width: 1280, height: 800 } },
];

const EXPECTED_CARDS = [
  { eyebrow: "Safety Shop",    href: "/shop" },
  { eyebrow: "WhatsApp Vault", href: "/vault" },
  { eyebrow: "Beware Board",   href: "/community?tab=beware" },
  { eyebrow: "Verify Stay",    href: "/account/login?next=/verify-stay" },
];

for (const vp of VIEWPORTS) {
  test.describe(`/safety @ ${vp.label}`, () => {
    test.use({ viewport: vp.viewport });

    test("renders 4 cards, no Women's Basics, headings intact", async ({ page }) => {
      const response = await page.goto("/safety");
      expect(response?.status(), "/safety must respond < 400").toBeLessThan(400);

      await expect(page.locator("h1")).toHaveText("Four tools, one place.");
      await expect(page.locator("body")).toContainText(
        "The kit you pack. The vault on your phone."
      );

      for (const card of EXPECTED_CARDS) {
        const eyebrow = page.getByText(card.eyebrow, { exact: true }).first();
        await expect(eyebrow, `eyebrow "${card.eyebrow}" should be visible`).toBeVisible();
        const link = page.locator(`a[href="${card.href}"]`).first();
        await expect(link, `link to ${card.href} should exist`).toBeVisible();
      }

      await expect(page.locator("body")).not.toContainText("Women's Basics");
      await expect(page.locator("body")).not.toContainText(
        "Where to find pads, tampons, cups"
      );

      const cards = page.locator("a.group.flex.flex-col.border");
      await expect(cards).toHaveCount(EXPECTED_CARDS.length);

      await page.screenshot({
        path: `tests/e2e/__screenshots__/safety-hub-${vp.label}.png`,
        fullPage: true,
      });
    });
  });
}
