/* eslint-disable react-hooks/rules-of-hooks */
// Playwright's fixture API uses `use` as a callback name -- not React's `use`.
import { test as base, expect, type BrowserContext } from "@playwright/test";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

function projectRef(): string {
  // Extract from https://<ref>.supabase.co
  const m = SUPABASE_URL.match(/^https:\/\/([^.]+)\.supabase\.co/);
  if (!m) throw new Error(`Could not parse project ref from NEXT_PUBLIC_SUPABASE_URL: "${SUPABASE_URL}"`);
  return m[1];
}

function adminClient() {
  if (!SUPABASE_SERVICE_ROLE_KEY) throw new Error("SUPABASE_SERVICE_ROLE_KEY not set");
  return createSupabaseClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function anonClient() {
  return createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export interface TestUser {
  id: string;
  email: string;
  password: string;
}

/**
 * Create a one-off Supabase user via the admin API. The email uses a
 * recognizable e2e-test-* prefix and a per-run timestamp so cleanup is
 * trivial and you can identify orphans in the dashboard.
 */
export async function createTestUser(): Promise<TestUser> {
  const ts = Date.now();
  const email = `e2e-test-${ts}-${Math.random().toString(36).slice(2, 8)}@wanderwomen.test`;
  const password = `e2e-${ts}-${Math.random().toString(36).slice(2, 12)}!Aa1`;

  const admin = adminClient();
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { e2e: true },
  });
  if (error || !data.user) throw new Error(`createUser failed: ${error?.message ?? "no user returned"}`);
  return { id: data.user.id, email, password };
}

export async function deleteTestUser(userId: string): Promise<void> {
  const admin = adminClient();
  // trip_submissions.user_id is ON DELETE SET NULL -- explicit delete avoids orphans
  await admin.from("trip_submissions").delete().eq("user_id", userId);
  await admin.auth.admin.deleteUser(userId);
}

/**
 * Sign the user in via password (creating the auth tokens) and inject the
 * resulting Supabase SSR cookies into the Playwright context. After this,
 * the test browser is logged in as the user.
 */
export async function injectSession(context: BrowserContext, user: TestUser): Promise<void> {
  const supabase = anonClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: user.password,
  });
  if (error || !data.session) throw new Error(`signInWithPassword failed: ${error?.message}`);

  const ref = projectRef();
  const cookieName = `sb-${ref}-auth-token`;
  // @supabase/ssr stores the session as a JSON-encoded array of token
  // objects, base64-encoded with the prefix "base64-". This matches what
  // createBrowserClient writes after a successful login.
  const sessionPayload = JSON.stringify(data.session);
  const cookieValue = "base64-" + Buffer.from(sessionPayload).toString("base64");

  // Cookies on localhost (HTTP) cannot be Secure. The httpOnly flag matches
  // what @supabase/ssr sets in production.
  await context.addCookies([
    {
      name: cookieName,
      value: cookieValue,
      domain: "localhost",
      path: "/",
      httpOnly: false,
      secure: false,
      sameSite: "Lax",
    },
  ]);
}

interface AuthedFixtures {
  testUser: TestUser;
}

export const test = base.extend<AuthedFixtures>({
  testUser: async ({ context }, use) => {
    const user = await createTestUser();
    try {
      await injectSession(context, user);
      await use(user);
    } finally {
      await deleteTestUser(user.id);
    }
  },
});

export { expect };
