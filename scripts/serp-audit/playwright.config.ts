// Playwright config for the audit scripts. Separate from the project's
// e2e config (tests/e2e/) so we can run audits without spinning up
// the dev server.

import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  testMatch: ["serp-rank-check.spec.ts", "perplexity-audit.spec.ts"],
  timeout: 120_000,
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  use: {
    headless: false, // Run with browser visible — solve captchas, see results
    actionTimeout: 30_000,
    navigationTimeout: 60_000,
    trace: "off",
    video: "off",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
