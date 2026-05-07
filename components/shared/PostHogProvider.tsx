"use client";

/**
 * PostHog provider — lazy-loads the SDK only after the user grants analytics
 * consent. Saves ~60 KB of JS on first paint for users who haven't consented
 * (and forever, for users who deny).
 *
 * The previous version statically imported `posthog-js` plus the React
 * `<PostHogProvider>` from `posthog-js/react`, which forced the SDK into the
 * main client bundle on every route. We never call `usePostHog()` anywhere
 * in the app (grep confirms), so we don't need the React Provider — direct
 * `posthog.capture(...)` calls from this module are enough.
 *
 * Behaviour:
 *   - No consent yet -> nothing loads; `<>{children}</>` only.
 *   - Consent granted -> dynamic import('posthog-js'), then init.
 *   - Consent withdrawn after init -> opt_out_capturing() fires; SDK stays
 *     in memory but stops sending events.
 */
import { useEffect, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useConsent } from "@/lib/consent";
import type { PostHog } from "posthog-js";

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

// Module-scope cache: once loaded, the same instance is reused across
// re-renders and reused after consent is toggled off + on again.
let cachedPosthog: PostHog | null = null;

async function loadPosthog(): Promise<PostHog | null> {
  if (cachedPosthog) return cachedPosthog;
  const mod = await import("posthog-js");
  cachedPosthog = mod.default;
  return cachedPosthog;
}

function usePostHogInitOnConsent(analyticsAllowed: boolean): PostHog | null {
  const [posthog, setPosthog] = useState<PostHog | null>(cachedPosthog);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!KEY) return;

    if (!analyticsAllowed) {
      if (cachedPosthog?.__loaded) cachedPosthog.opt_out_capturing();
      return;
    }

    let cancelled = false;
    loadPosthog().then((ph) => {
      if (cancelled || !ph) return;
      if (!ph.__loaded) {
        ph.init(KEY, {
          api_host: HOST,
          person_profiles: "identified_only",
          capture_pageview: false, // we send manual pageviews to include the destination slug
          capture_pageleave: true,
          autocapture: {
            // Don't autocapture inputs — we don't want to log what users type
            element_allowlist: ["a", "button"],
          },
        });
      } else {
        ph.opt_in_capturing();
      }
      setPosthog(ph);
    });
    return () => {
      cancelled = true;
    };
  }, [analyticsAllowed]);

  return posthog;
}

function PageTracker({ posthog, enabled }: { posthog: PostHog | null; enabled: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!enabled || !posthog?.__loaded || !pathname) return;
    const url = searchParams?.toString() ? `${pathname}?${searchParams}` : pathname;
    posthog.capture("$pageview", { $current_url: url });
  }, [enabled, posthog, pathname, searchParams]);

  return null;
}

function IdentityTracker({ posthog, enabled }: { posthog: PostHog | null; enabled: boolean }) {
  useEffect(() => {
    if (!enabled || !posthog) return;
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      if (data.user && posthog.__loaded) {
        posthog.identify(data.user.id, { email: data.user.email ?? "" });
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (!posthog.__loaded) return;
      if (event === "SIGNED_IN" && session?.user) {
        posthog.identify(session.user.id, { email: session.user.email ?? "" });
      }
      if (event === "SIGNED_OUT") {
        posthog.reset();
      }
    });

    return () => sub.subscription.unsubscribe();
  }, [enabled, posthog]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const { state } = useConsent();
  const analyticsAllowed = state.consent.analytics;

  const posthog = usePostHogInitOnConsent(analyticsAllowed);

  if (!KEY) return <>{children}</>;
  return (
    <>
      <Suspense fallback={null}>
        <PageTracker posthog={posthog} enabled={analyticsAllowed} />
      </Suspense>
      <IdentityTracker posthog={posthog} enabled={analyticsAllowed} />
      {children}
    </>
  );
}
