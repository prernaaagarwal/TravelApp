"use client";

/**
 * Client-side dynamic-import wrapper for ScamMapClient.
 *
 * ScamMapClient ships ~50-100 KB of Leaflet UI code on its own (before the
 * leaflet runtime is even loaded). Wrapping it in next/dynamic with
 * ssr:false moves that bundle into a separate chunk that only downloads
 * after the route shell has rendered — better TTFB on /community/beware/*
 * and clearer "Loading map…" feedback if the chunk is still in flight.
 *
 * The leaflet runtime itself was already lazy-imported via `await import()`
 * inside the component's effect; this wrapper code-splits the surrounding
 * client component too.
 *
 * Shared copy for the stats control hint (same on every Beware city map) lives
 * in `lib/beware-map-stats-hint.ts` — import from there if you add another map.
 */

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import type { ScamMapClient as ScamMapClientType } from "./ScamMapClient";

const ScamMapClient = dynamic(
  () => import("./ScamMapClient").then((m) => ({ default: m.ScamMapClient })),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex items-center justify-center bg-warm-white"
        style={{ height: "calc(100dvh - 56px)" }}
      >
        <p className="font-mono text-[10px] uppercase tracking-widest text-ww-muted">
          Loading map…
        </p>
      </div>
    ),
  },
);

export function ScamMapWrapper(props: ComponentProps<typeof ScamMapClientType>) {
  return <ScamMapClient {...props} />;
}
