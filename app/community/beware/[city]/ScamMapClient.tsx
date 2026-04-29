"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type * as LeafletNS from "leaflet";
import type { Map as LeafletMap } from "leaflet";
import type { MapReport } from "@/lib/beware-cities";

const COLORS: Record<MapReport["type"], string> = {
  scam:       "#c4522a",
  harassment: "#8b2252",
  transport:  "#b5710a",
  stay:       "#1a4a7a",
  safe:       "#2d6a4f",
};

function createIcon(L: typeof LeafletNS, type: MapReport["type"]) {
  const color = COLORS[type];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="32" viewBox="0 0 24 32">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 20 12 20S24 21 24 12C24 5.373 18.627 0 12 0z" fill="${color}"/>
    <circle cx="12" cy="12" r="4" fill="white"/>
  </svg>`;
  return L.divIcon({ html: svg, className: "", iconSize: [24, 32], iconAnchor: [12, 32] });
}

type Props = {
  citySlug: string;
  cityName: string;
  center: [number, number];
  zoom: number;
  demoReports: MapReport[];
  dbReports: MapReport[];
};

export function ScamMapClient({ citySlug, cityName, center, zoom, demoReports, dbReports }: Props) {
  const dbTitles = new Set(dbReports.map((r) => r.title.trim().toLowerCase()));
  const demo = demoReports.filter((r) => !dbTitles.has(r.title.trim().toLowerCase()));
  const reports = [...dbReports, ...demo];

  const [activeFilter, setActiveFilter] = useState("All");
  const [visibleCount, setVisibleCount] = useState(reports.length);
  const [selected, setSelected]         = useState<MapReport | null>(null);

  const mapDivRef      = useRef<HTMLDivElement>(null);
  const mapRef         = useRef<LeafletMap | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clusterRef     = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef     = useRef<{ marker: any; report: MapReport }[]>([]);
  const setSelectedRef = useRef(setSelected);
  setSelectedRef.current = setSelected;

  const FILTER_LABELS = ["All", "Scam", "Harassment", "Transport", "Stay", "Safe"];

  function applyFilter(f: string) {
    setActiveFilter(f);
    const cluster = clusterRef.current;
    if (!cluster) return;
    cluster.clearLayers();
    const visible = markersRef.current.filter(({ report }) =>
      f === "All" ? true : report.type === f.toLowerCase()
    );
    visible.forEach(({ marker }) => cluster.addLayer(marker));
    setVisibleCount(visible.length);
  }

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (mapRef.current) return;

    let cancelled = false;

    async function initMap() {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      await import("leaflet.markercluster/dist/MarkerCluster.css");
      await import("leaflet.markercluster/dist/MarkerCluster.Default.css");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { MarkerClusterGroup } = await import("leaflet.markercluster") as any;

      if (cancelled || !mapDivRef.current) return;

      const map = L.map(mapDivRef.current, {
        center,
        zoom,
        zoomControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      const cluster = new MarkerClusterGroup({ maxClusterRadius: 50 });
      markersRef.current = [];
      reports.forEach((r) => {
        const marker = L.marker([r.lat, r.lng], { icon: createIcon(L, r.type) });
        marker.on("click", () => setSelectedRef.current(r));
        cluster.addLayer(marker);
        markersRef.current.push({ marker, report: r });
      });
      map.addLayer(cluster);
      clusterRef.current = cluster;

      mapRef.current = map;
    }

    initMap();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const FILTER_BAR_H = 40;

  return (
    <div className="flex flex-col" style={{ height: "calc(100dvh - 56px)" }}>
      {/* Filter chips */}
      <div
        className="flex shrink-0 items-center gap-2 overflow-x-auto border-b border-ww-border bg-warm-white px-4 scrollbar-none"
        style={{ height: FILTER_BAR_H }}
      >
        {FILTER_LABELS.map((f) => (
          <button
            key={f}
            onClick={() => applyFilter(f)}
            className={`shrink-0 border px-3 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors ${
              activeFilter === f
                ? "border-ink bg-ink text-warm-white"
                : "border-ww-border bg-sand text-ww-muted hover:border-ink hover:text-ink"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Map + floating overlays */}
      <div className="relative flex-1">
        <div ref={mapDivRef} className="h-full w-full" />

        {/* Stats pill */}
        <div className="absolute left-1/2 top-3 z-[999] -translate-x-1/2 rounded-full border border-ww-border bg-warm-white/90 px-3 py-1 shadow-sm backdrop-blur-sm">
          <span className="font-mono text-[10px] text-ww-muted">
            {visibleCount} reports · {cityName} · Updated today
          </span>
        </div>

        {/* Legend */}
        <div className="absolute right-3 top-3 z-[999] flex flex-col gap-1.5 rounded border border-ww-border bg-warm-white/90 p-2 shadow-sm backdrop-blur-sm">
          {(["scam", "harassment", "transport", "stay", "safe"] as MapReport["type"][]).map((t) => (
            <div key={t} className="flex items-center gap-1.5">
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: COLORS[t] }} />
              <span className="font-mono text-[9px] capitalize text-ww-muted">{t}</span>
            </div>
          ))}
        </div>

        {/* Locate-me */}
        <button
          onClick={() => {
            navigator.geolocation?.getCurrentPosition((pos) => {
              mapRef.current?.flyTo([pos.coords.latitude, pos.coords.longitude], 14);
            });
          }}
          title="My location"
          className="absolute bottom-20 left-3 z-[999] flex h-10 w-10 items-center justify-center rounded-full border border-ww-border bg-warm-white shadow-md hover:bg-sand"
        >
          📍
        </button>

        {/* FAB */}
        <Link
          href={`/contribute/report?destination=${citySlug}`}
          title="Add a report"
          className="absolute bottom-20 right-3 z-[999] flex h-12 w-12 items-center justify-center rounded-full bg-rust text-xl text-white shadow-md hover:bg-rust/90"
        >
          +
        </Link>
      </div>

      {/* Bottom sheet */}
      {selected && (
        <div
          className="fixed inset-x-0 bottom-0 z-[9999] flex flex-col border-t border-ww-border bg-warm-white shadow-2xl"
          style={{ maxHeight: "55dvh" }}
        >
          <div className="flex shrink-0 items-center justify-between px-4 pt-3 pb-2">
            <span
              className="rounded px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-white"
              style={{ background: COLORS[selected.type] }}
            >
              {selected.type}
            </span>
            <button
              onClick={() => setSelected(null)}
              className="font-mono text-sm text-ww-muted hover:text-ink"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="overflow-y-auto px-4 pb-6 space-y-3">
            <h3 className="font-serif text-xl leading-snug text-ink">{selected.title}</h3>
            <p className="font-mono text-[11px] text-ww-muted">📍 {selected.place}</p>
            <p className="font-mono text-xs leading-relaxed text-ink">{selected.desc}</p>
            <div className="flex flex-wrap gap-3 font-mono text-[10px] text-ww-muted">
              <span>{selected.date}</span>
              <span>✓ {selected.confirms} confirmed</span>
              <span>— {selected.reporter}</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <button className="border border-rust px-3 py-1.5 font-mono text-[10px] text-rust transition-colors hover:bg-rust hover:text-white">
                ⚠️ I experienced this too
              </button>
              <button className="border border-ww-border px-3 py-1.5 font-mono text-[10px] text-ww-muted transition-colors hover:border-ink hover:text-ink">
                ✓ Seems fine now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
