"use client";

import { useEffect } from "react";

/**
 * Auto-fires window.print() once after the page has rendered, so users
 * land on /vault/print directly inside the OS print dialog ("Save as PDF").
 *
 * Wrapped in a tiny client component so the parent print page stays a
 * server component (lets us read the safety_pack row server-side without
 * bouncing through an effect).
 */
export function PrintTrigger() {
  useEffect(() => {
    const id = setTimeout(() => {
      try {
        window.print();
      } catch {
        // user navigated away or printing not supported — no-op
      }
    }, 250);
    return () => clearTimeout(id);
  }, []);

  return null;
}
