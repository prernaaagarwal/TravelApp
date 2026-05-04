"use client";

import { useEffect, useRef } from "react";

/**
 * Fires a single POST to /api/track-view on mount. The server action
 * dedupes by (slug, user/fingerprint, day) so reloads/navigations within
 * the same day are no-ops at the database level.
 *
 * Deliberately does NOT wait for the response — view tracking must never
 * block UI or surface errors to the user.
 */
export function ViewTracker({ slug }: { slug: string }) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;

    fetch("/api/track-view", {
      method:      "POST",
      headers:     { "Content-Type": "application/json" },
      body:        JSON.stringify({ slug }),
      keepalive:   true,
      credentials: "same-origin",
    }).catch(() => {
      // Silently ignore — analytics must never break the page.
    });
  }, [slug]);

  return null;
}
