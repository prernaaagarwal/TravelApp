"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type * as LeafletNS from "leaflet";
import type { Map as LeafletMap } from "leaflet";
import type { MapReport, Neighbourhood } from "@/lib/beware-cities";
import { toggleBewareHelpful, reportBeware } from "@/app/community/actions";

// All map colours in one place — change here only.
// Matches globals.css CSS variables where exact; map-specific shades named explicitly.
const MAP_COLORS = {
  rust:       "#c4522a",  // = --rust
  sage:       "#4a7c59",  // = --sage
  harassment: "#8b2252",  // deep crimson — no CSS var equivalent
  transport:  "#b5710a",  // amber — no CSS var equivalent
  stay:       "#1a4a7a",  // navy — no CSS var equivalent
  heatMid:    "#f5c842",  // heat gradient mid
  heatHigh:   "#e8760a",  // heat gradient high
} as const;

const COLORS: Record<MapReport["type"], string> = {
  scam:       MAP_COLORS.rust,
  harassment: MAP_COLORS.harassment,
  transport:  MAP_COLORS.transport,
  stay:       MAP_COLORS.stay,
  safe:       MAP_COLORS.sage,
};

const TYPES: MapReport["type"][] = ["scam", "harassment", "transport", "stay", "safe"];

const INTENSITY: Record<MapReport["type"], number> = {
  harassment: 1.0,
  scam:       0.8,
  transport:  0.7,
  stay:       0.6,
  safe:       0.1,
};

const HEAT_GRADIENT = {
  0.1: MAP_COLORS.sage,
  0.4: MAP_COLORS.heatMid,
  0.7: MAP_COLORS.heatHigh,
  1.0: MAP_COLORS.rust,
};

const ZOOM_BREAKPOINT = 13;
const LABEL_MIN_ZOOM  = 12;
const LABEL_MAX_ZOOM  = 13;

function createIcon(L: typeof LeafletNS, type: MapReport["type"]) {
  const color = COLORS[type];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="32" viewBox="0 0 24 32">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 20 12 20S24 21 24 12C24 5.373 18.627 0 12 0z" fill="${color}"/>
    <circle cx="12" cy="12" r="4" fill="white"/>
  </svg>`;
  return L.divIcon({ html: svg, className: "", iconSize: [24, 32], iconAnchor: [12, 32] });
}

function createLabelIcon(L: typeof LeafletNS, name: string) {
  const html = `<div style="
    font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
    font-size: 11px;
    font-weight: 500;
    color: #1a1510;
    background: rgba(250,248,244,0.85);
    padding: 2px 6px;
    border-radius: 3px;
    border: 0.5px solid rgba(0,0,0,0.12);
    white-space: nowrap;
    pointer-events: none;
  ">${name}</div>`;
  return L.divIcon({ html, className: "", iconAnchor: [0, 0] });
}

// Extract outer ring(s) from a GeoJSON geometry — returns coordinates in GeoJSON [lng,lat] order.
// Used to build the outside-dim mask via L.geoJSON + fillRule:"evenodd".
function extractGeoJSONOuterRings(geojson: { type: string; coordinates: unknown }): number[][][] {
  if (geojson.type === "Polygon") {
    return [(geojson.coordinates as number[][][])[0]];
  }
  if (geojson.type === "MultiPolygon") {
    return (geojson.coordinates as number[][][][]).map((poly) => poly[0]);
  }
  return [];
}

type Props = {
  citySlug: string;
  cityName: string;
  center: [number, number];
  zoom: number;
  country: string;
  boundaryQuery?: string;
  boundaryOsmId?: string;
  neighbourhoods: Neighbourhood[];
  demoReports: MapReport[];
  dbReports: MapReport[];
  isLoggedIn: boolean;
};

export function ScamMapClient({
  citySlug,
  cityName,
  center,
  zoom,
  country,
  boundaryQuery,
  boundaryOsmId,
  neighbourhoods,
  demoReports,
  dbReports,
  isLoggedIn,
}: Props) {
  const dbTitles = new Set(dbReports.map((r) => r.title.trim().toLowerCase()));
  const demo = demoReports.filter((r) => !dbTitles.has(r.title.trim().toLowerCase()));
  const reports = [...dbReports, ...demo];

  const [activeTypes, setActiveTypes] = useState<Set<MapReport["type"]>>(new Set(TYPES));
  const [visibleCount, setVisibleCount] = useState(reports.length);
  const [selected, setSelected]         = useState<MapReport | null>(null);
  const [viewMode, setViewMode]         = useState<"overview" | "pins">("overview");

  const mapDivRef     = useRef<HTMLDivElement>(null);
  const mapRef        = useRef<LeafletMap | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clusterRef    = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const heatLayerRef  = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const labelsLayerRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const boundaryRef   = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef    = useRef<{ marker: any; report: MapReport }[]>([]);
  const activeTypesRef = useRef<Set<MapReport["type"]>>(new Set(TYPES));

  function buildHeatData(types: Set<MapReport["type"]>) {
    return reports
      .filter((r) => types.has(r.type))
      .map((r) => [r.lat, r.lng, INTENSITY[r.type]] as [number, number, number]);
  }

  function refreshLayers(types: Set<MapReport["type"]>) {
    activeTypesRef.current = types;

    // Update cluster (used in pins mode)
    const cluster = clusterRef.current;
    if (cluster) {
      cluster.clearLayers();
      const visible = markersRef.current.filter(({ report }) => types.has(report.type));
      visible.forEach(({ marker }) => cluster.addLayer(marker));
      setVisibleCount(visible.length);
    }

    // Update heatmap (used in overview mode)
    const heat = heatLayerRef.current;
    if (heat) heat.setLatLngs(buildHeatData(types));
  }

  function toggleType(t: MapReport["type"]) {
    const next = new Set(activeTypes);
    if (next.has(t)) next.delete(t);
    else next.add(t);
    setActiveTypes(next);
    refreshLayers(next);
  }

  function toggleAll() {
    const allOn = activeTypes.size === TYPES.length;
    const next = allOn ? new Set<MapReport["type"]>() : new Set(TYPES);
    setActiveTypes(next);
    refreshLayers(next);
  }

  function applyViewMode(mode: "overview" | "pins", L: typeof LeafletNS, map: LeafletMap) {
    const cluster = clusterRef.current;
    const heat = heatLayerRef.current;
    if (mode === "pins") {
      if (heat && map.hasLayer(heat)) map.removeLayer(heat);
      if (cluster && !map.hasLayer(cluster)) map.addLayer(cluster);
    } else {
      if (cluster && map.hasLayer(cluster)) map.removeLayer(cluster);
      if (heat && !map.hasLayer(heat)) map.addLayer(heat);
    }
  }

  function applyLabelVisibility(zoomLevel: number, map: LeafletMap) {
    const labels = labelsLayerRef.current;
    if (!labels) return;
    const shouldShow = zoomLevel >= LABEL_MIN_ZOOM && zoomLevel <= LABEL_MAX_ZOOM;
    if (shouldShow && !map.hasLayer(labels)) map.addLayer(labels);
    if (!shouldShow && map.hasLayer(labels)) map.removeLayer(labels);
  }

  function handleManualToggle(mode: "overview" | "pins") {
    const map = mapRef.current;
    if (!map) return;
    const target = mode === "pins" ? Math.max(map.getZoom(), 14) : Math.min(map.getZoom(), 11);
    setViewMode(mode);
    map.setZoom(target);
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await import("leaflet.heat") as any;

      if (cancelled || !mapDivRef.current) return;

      const map = L.map(mapDivRef.current, {
        center,
        zoom,
        zoomControl: false,
      });

      // CartoDB Positron — minimal, near-white tiles with sparse labels.
      // Significantly less visual noise than OSM standard; heatmap and pins
      // read much more clearly against the clean background.
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Build markers + cluster
      const cluster = new MarkerClusterGroup({ maxClusterRadius: 50 });
      markersRef.current = [];
      reports.forEach((r) => {
        const marker = L.marker([r.lat, r.lng], { icon: createIcon(L, r.type) });
        marker.on("click", () => setSelected(r));
        cluster.addLayer(marker);
        markersRef.current.push({ marker, report: r });
      });
      clusterRef.current = cluster;

      // Build heat layer
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const heat = (L as any).heatLayer(buildHeatData(activeTypesRef.current), {
        radius: 35,
        blur: 25,
        maxZoom: ZOOM_BREAKPOINT,
        gradient: HEAT_GRADIENT,
      });
      heatLayerRef.current = heat;

      // Neighbourhood labels group
      if (neighbourhoods.length > 0) {
        const labels = L.layerGroup(
          neighbourhoods.map((n) =>
            L.marker([n.lat, n.lng], {
              icon: createLabelIcon(L, n.name),
              interactive: false,
              keyboard: false,
            })
          )
        );
        labelsLayerRef.current = labels;
      }

      // Initial layer state — overview/heat by default
      map.addLayer(heat);

      // Zoom event drives layer + label visibility + view mode state
      map.on("zoomend", () => {
        const z = map.getZoom();
        if (z >= ZOOM_BREAKPOINT) {
          applyViewMode("pins", L, map);
          setViewMode("pins");
        } else {
          applyViewMode("overview", L, map);
          setViewMode("overview");
        }
        applyLabelVisibility(z, map);
      });

      mapRef.current = map;
      applyLabelVisibility(map.getZoom(), map);

      // Fetch + draw city boundary, then fit bounds
      try {
        const base = `/api/city-boundary?slug=${encodeURIComponent(citySlug)}`;
        const boundaryUrl = boundaryOsmId
          ? `${base}&osmId=${encodeURIComponent(boundaryOsmId)}`
          : `${base}&q=${encodeURIComponent(boundaryQuery ?? cityName)}&country=${encodeURIComponent(country)}`;
        const res = await fetch(boundaryUrl);
        const json = await res.json();
        if (cancelled || !mapRef.current) return;
        if (!json?.geojson) return;

        // 90% dim mask outside the city.
        // L.geoJSON + fillRule:"evenodd" avoids the diagonal stitching artifact
        // that L.polygon produces when given a world-ring + hole approach.
        const worldRing: number[][] = [[-180, 85], [180, 85], [180, -85], [-180, -85], [-180, 85]];
        const cityGeoRings = extractGeoJSONOuterRings(json.geojson as { type: string; coordinates: unknown });
        const maskFeature = {
          type: "Feature" as const,
          properties: {},
          geometry: { type: "Polygon" as const, coordinates: [worldRing, ...cityGeoRings] },
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const maskLayer = L.geoJSON(maskFeature as any, {
          style: {
            fillColor: "#ffffff",
            fillOpacity: 0.9,
            stroke: false,
            fillRule: "evenodd",
          } as L.PathOptions,
          interactive: false,
        }).addTo(map);

        // Prominent dashed boundary ring on top of the mask
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const boundaryLine = L.geoJSON(json.geojson as any, {
          style: {
            color: MAP_COLORS.rust,
            weight: 5,
            opacity: 1,
            fillOpacity: 0,
            dashArray: "10, 6",
          },
          interactive: false,
        }).addTo(map);

        boundaryRef.current = L.layerGroup([maskLayer, boundaryLine]);

        // Only auto-fit when the full boundary fits at or above the configured zoom.
        // For large admin areas (Goa state, Tokyo islands) keep the configured
        // center/zoom so heatmap data stays in focus.
        const fitted = boundaryLine.getBounds();
        const targetZoom = map.getBoundsZoom(fitted, false, L.point(32, 32));
        if (targetZoom >= zoom) {
          map.fitBounds(fitted, { padding: [32, 32], maxZoom: zoom + 2 });
        }
      } catch (err) {
        console.error("[beware-map] boundary fetch failed:", err);
      }
    }

    initMap();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // Re-init only when the city changes; other props are derived from citySlug.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [citySlug]);

  const FILTER_BAR_H = 40;
  const allOn = activeTypes.size === TYPES.length;

  return (
    <div className="flex flex-col" style={{ height: "calc(100dvh - 56px)" }}>
      {/* Filter bar — view-mode toggle + type chips */}
      <div
        className="flex shrink-0 items-center gap-2 overflow-x-auto border-b border-ww-border bg-warm-white px-4 scrollbar-none"
        style={{ height: FILTER_BAR_H }}
      >
        {/* View mode toggle */}
        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={() => handleManualToggle("overview")}
            className={`shrink-0 border px-3 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors ${
              viewMode === "overview"
                ? "border-ink bg-ink text-warm-white"
                : "border-ww-border bg-sand text-ww-muted hover:border-ink hover:text-ink"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => handleManualToggle("pins")}
            className={`shrink-0 border px-3 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors ${
              viewMode === "pins"
                ? "border-ink bg-ink text-warm-white"
                : "border-ww-border bg-sand text-ww-muted hover:border-ink hover:text-ink"
            }`}
          >
            Pins
          </button>
        </div>

        <div className="h-5 w-px shrink-0 bg-ww-border/60" />

        <button
          onClick={toggleAll}
          className={`shrink-0 border px-3 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors ${
            allOn
              ? "border-ink bg-ink text-warm-white"
              : "border-ww-border bg-sand text-ww-muted hover:border-ink hover:text-ink"
          }`}
        >
          All
        </button>
        {TYPES.map((t) => {
          const on = activeTypes.has(t);
          return (
            <button
              key={t}
              onClick={() => toggleType(t)}
              className={`shrink-0 border px-3 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                on
                  ? "border-ink bg-ink text-warm-white"
                  : "border-ww-border bg-sand text-ww-muted hover:border-ink hover:text-ink"
              }`}
            >
              {t}
            </button>
          );
        })}
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
          {TYPES.map((t) => (
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

        {/* Detail panel */}
        {selected && (
          <DetailPanel
            key={selected.id}
            report={selected}
            onClose={() => setSelected(null)}
            isLoggedIn={isLoggedIn}
          />
        )}
      </div>
    </div>
  );
}

function DetailPanel({
  report,
  onClose,
  isLoggedIn,
}: {
  report: MapReport;
  onClose: () => void;
  isLoggedIn: boolean;
}) {
  const [liked, setLiked] = useState(report.isHelpfulByMe ?? false);
  const [count, setCount] = useState(report.confirms);
  const [busy, setBusy] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reported, setReported] = useState(false);

  async function onHelpful() {
    if (!isLoggedIn) {
      window.location.href = "/account/login?next=/community";
      return;
    }
    if (busy) return;
    const prevLiked = liked;
    const prevCount = count;
    setLiked(!prevLiked);
    setCount(prevLiked ? Math.max(0, prevCount - 1) : prevCount + 1);

    if (report.isDemo) return;

    setBusy(true);
    const res = await toggleBewareHelpful(report.id);
    setBusy(false);
    if ("error" in res) {
      setLiked(prevLiked);
      setCount(prevCount);
    } else if (typeof res.count === "number") {
      setCount(res.count);
      setLiked(!!res.liked);
    }
  }

  async function submitReport(reason: string) {
    if (!isLoggedIn) {
      window.location.href = "/account/login?next=/community";
      return;
    }
    if (report.isDemo) {
      setReported(true);
      setReportOpen(false);
      return;
    }
    const res = await reportBeware(report.id, reason);
    if (!("error" in res)) {
      setReported(true);
      setReportOpen(false);
    }
  }

  return (
    <div
      className="fixed z-[9999] flex flex-col border-ww-border bg-warm-white shadow-2xl inset-x-0 bottom-0 border-t md:inset-y-0 md:left-0 md:right-auto md:top-14 md:bottom-0 md:w-[380px] md:max-h-none md:border-r md:border-t-0"
      style={{ maxHeight: "55dvh" }}
    >
      <div className="flex shrink-0 items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-2">
          <span
            className="rounded px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-white"
            style={{ background: COLORS[report.type] }}
          >
            {report.type}
          </span>
          {report.isDemo && (
            <span className="rounded border border-ww-border bg-sand px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-ww-muted">
              Demo
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="font-mono text-sm text-ww-muted hover:text-ink"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      <div className="overflow-y-auto px-4 pb-6 space-y-3">
        <h3 className="font-serif text-xl leading-snug text-ink">{report.title}</h3>
        <p className="font-mono text-[11px] text-ww-muted">📍 {report.place}</p>
        <p className="font-mono text-xs leading-relaxed text-ink">{report.desc}</p>
        <div className="flex flex-wrap gap-3 font-mono text-[10px] text-ww-muted">
          <span>{report.date}</span>
          <span>— {report.reporter}</span>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={onHelpful}
            disabled={busy}
            className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors ${
              liked
                ? "border-sage bg-sage text-warm-white"
                : "border-sage/30 bg-sage-light/50 text-sage hover:bg-sage-light"
            }`}
          >
            Helpful ({count})
          </button>
          <button
            onClick={() => setReportOpen((o) => !o)}
            disabled={reported}
            className="border border-ww-border bg-sand px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-ww-muted hover:border-rust hover:text-rust transition-colors disabled:opacity-50"
          >
            {reported ? "Reported ✓" : "Report"}
          </button>
        </div>

        {reportOpen && !reported && (
          <div className="border border-ww-border bg-sand p-3 space-y-2">
            <p className="font-mono text-[10px] uppercase tracking-widest text-ww-muted">
              Why are you reporting?
            </p>
            <div className="flex flex-wrap gap-2">
              {["Spam", "Inappropriate", "Wrong info", "Other"].map((r) => (
                <ReasonButton key={r} reason={r} onSubmit={submitReport} />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setReportOpen(false)}
              className="font-mono text-[10px] uppercase tracking-widest text-ww-muted hover:text-ink"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ReasonButton({ reason, onSubmit }: { reason: string; onSubmit: (r: string) => Promise<void> }) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await onSubmit(reason);
        setBusy(false);
      }}
      className="border border-ww-border bg-warm-white px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-ww-muted hover:border-rust hover:text-rust disabled:opacity-50"
    >
      {reason}
    </button>
  );
}
