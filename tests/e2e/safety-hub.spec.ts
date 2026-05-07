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

      await expect(page.locator("h1")).toContainText(/Four tools.+one place/i);
      await expect(page.locator("body")).toContainText(
        "The kit you pack. The vault on your phone."
      );

      for (const card of EXPECTED_CARDS) {
        // Scope to the safety-hub card itself by combining href with the
        // unique card class signature. Without the class scope, the Header
        // primary nav and MobileNav both also link to /community?tab=beware
        // and /shop, and the (DOM-order-first) Header link is hidden at
        // mobile widths via md:flex — making .first() pick a hidden node.
        const cardLink = page.locator(
          `a.group.flex.flex-col.border[href="${card.href}"]`,
        );
        await expect(cardLink, `safety-hub card link to ${card.href}`).toBeVisible();
        const eyebrow = cardLink.getByText(card.eyebrow, { exact: true });
        await expect(eyebrow, `eyebrow "${card.eyebrow}" should be inside card`).toBeVisible();
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
