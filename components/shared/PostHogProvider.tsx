"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as Provider } from "posthog-js/react";
import { createClient } from "@/lib/supabase/client";
import { useConsent } from "@/lib/consent";

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

// PostHog is GATED on consent.analytics. Init does not run at module load —
// it only fires inside this hook once the user has explicitly opted in via
// the cookie consent banner. When consent is later withdrawn, we call
// opt_out_capturing() so no further events leave the device.
function usePostHogInitOnConsent(analyticsAllowed: boolean) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!KEY) return;

    if (analyticsAllowed) {
      if (!posthog.__loaded) {
        posthog.init(KEY, {
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
        // Already initialised earlier in the session, just resume capturing.
        posthog.opt_in_capturing();
      }
    } else if (posthog.__loaded) {
      posthog.opt_out_capturing();
    }
  }, [analyticsAllowed]);
}

function PageTracker({ enabled }: { enabled: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!enabled || !KEY || !pathname || !posthog.__loaded) return;
    const url = searchParams?.toString() ? `${pathname}?${searchParams}` : pathname;
    posthog.capture("$pageview", { $current_url: url });
  }, [enabled, pathname, searchParams]);

  return null;
}

function IdentityTracker({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    if (!enabled || !KEY) return;
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
  }, [enabled]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const { state } = useConsent();
  const analyticsAllowed = state.consent.analytics;

  usePostHogInitOnConsent(analyticsAllowed);

  if (!KEY) return <>{children}</>;
  return (
    <Provider client={posthog}>
      <Suspense fallback={null}>
        <PageTracker enabled={analyticsAllowed} />
      </Suspense>
      <IdentityTracker enabled={analyticsAllowed} />
      {children}
    </Provider>
  );
}
