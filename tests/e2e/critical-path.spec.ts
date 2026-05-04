import { test, expect } from "./fixtures";
import { createClient } from "@supabase/supabase-js";

/**
 * Critical path E2E: anonymous → authed → submit trip → verify in DB.
 *
 * Auth is bypassed via service-role cookie injection (see fixtures.ts).
 * Admin approval + visibility-in-feed assertion is DEFERRED to a follow-up
 * once a dedicated admin test user is provisioned in CI secrets.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

test.describe("trip submission flow", () => {
  test.skip(
    !SUPABASE_SERVICE_ROLE_KEY || !SUPABASE_URL,
    "Skipping authed flow: SUPABASE_SERVICE_ROLE_KEY / NEXT_PUBLIC_SUPABASE_URL must be set"
  );

  test("authenticated user can submit a trip receipt", async ({ page, testUser }) => {
    // Verify the session cookie injection actually authenticated the user
    await page.goto("/feed/submit");
    // If auth failed, /feed/submit redirects to /account/login?next=/feed/submit
    expect(page.url(), "should not be redirected to login").not.toContain("/account/login");
    await expect(page.locator("h1")).toContainText(/Log your trip costs/i);

    // Fill the form
    await page.selectOption('select[name="destination_slug"]', "goa-india");
    await page.fill('input[name="trip_start"]', "2026-04-01");
    await page.fill('input[name="trip_end"]',   "2026-04-08");
    await page.fill('input[name="cost_stay"]',       "12000");
    await page.fill('input[name="cost_food"]',        "4000");
    await page.fill('input[name="cost_transport"]',   "3000");
    await page.fill('input[name="cost_activities"]',  "2000");
    await page.fill('input[name="cost_misc"]',         "500");
    await page.fill(
      'textarea[name="notes_raw"]',
      [
        "Stay in Aldona, not Calangute -- 30% cheaper, way safer.",
        "Scooter rental: ₹400/day from the women-run garage in Mapusa.",
        "Skip the beach shacks at sunset; Curlie's at 5:30 is enough.",
      ].join("\n"),
    );
    await page.fill(
      'textarea[name="highlight"]',
      "First solo morning at Project Cafe in Aldona, three other women already there. Felt like the universe organising itself.",
    );

    // Submit and follow the server-action redirect.
    // Timeout is 30s (not 15s) because the first run after `npm start` has
    // cold-cache latency: server warmup + first Supabase round-trip.
    await Promise.all([
      page.waitForURL(/\/feed(\?.*)?$/, { timeout: 30_000 }),
      page.click('button[type="submit"]'),
    ]);

    expect(page.url(), "should land on /feed after successful submit").toMatch(/\/feed(\?.*)?$/);

    // Verify the row landed in the DB via the admin client (service-role read,
    // bypasses the "approved only" RLS policy).
    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data, error } = await admin
      .from("trip_submissions")
      .select("id, user_id, destination_slug, status, total_cost_inr")
      .eq("user_id", testUser.id)
      .single();

    expect(error, "trip_submissions query should not error").toBeNull();
    expect(data?.destination_slug).toBe("goa-india");
    expect(data?.status).toBe("pending");
    expect(data?.total_cost_inr).toBe(21500); // 12000 + 4000 + 3000 + 2000 + 500
  });

  // TODO(v1): admin approval + feed visibility assertion.
  // Requires a dedicated admin test user in CI secrets:
  //   E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD
  // The user must have profiles.role = 'admin' set in the live DB.
  // Test would: inject admin session -> /admin -> approve the submitted trip
  // -> sign out -> /feed -> assert highlight quote appears.
});
