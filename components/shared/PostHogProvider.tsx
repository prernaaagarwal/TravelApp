"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as Provider } from "posthog-js/react";
import { createClient } from "@/lib/supabase/client";

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

if (typeof window !== "undefined" && KEY && !posthog.__loaded) {
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
}

function PageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!KEY || !pathname) return;
    const url = searchParams?.toString() ? `${pathname}?${searchParams}` : pathname;
    posthog.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams]);

  return null;
}

function IdentityTracker() {
  useEffect(() => {
    if (!KEY) return;
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        posthog.identify(data.user.id, { email: data.user.email ?? "" });
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        posthog.identify(session.user.id, { email: session.user.email ?? "" });
      }
      if (event === "SIGNED_OUT") {
        posthog.reset();
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  if (!KEY) return <>{children}</>;
  return (
    <Provider client={posthog}>
      <Suspense fallback={null}>
        <PageTracker />
      </Suspense>
      <IdentityTracker />
      {children}
    </Provider>
  );
}
