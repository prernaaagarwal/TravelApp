"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  MapPin,
  ChevronRight,
  Plus,
  ShieldCheck,
} from "lucide-react";

/**
 * BewareNearbyPanel — geolocation-aware Beware Board snapshot.
 *
 * Server fetches the most recent approved beware_reports with gps_lat/gps_lng
 * (see app/safety/page.tsx). This client component:
 *   1. Asks the browser for geolocation on mount.
 *   2. If granted, sorts the reports by haversine distance to the user and
 *      shows the 3 nearest within NEARBY_RADIUS_KM.
 *   3. If denied / unsupported / pending, shows the 3 most recent reports
 *      with their location text instead of distance.
 *
 * The map placeholder is a CSS-grid + diagonal road overlay; it is NOT a real
 * map (no Leaflet). Pin positions are projected from (bearing, distance) when
 * geo is granted, or pseudo-distributed around the centre when not.
 */

type Report = {
  id: string;
  title: string;
  severity: string;
  category: string;
  lat: number;
  lng: number;
  location: string;
  createdAt: string;
  destinationSlug: string;
  helpfulCount: number;
};

type Props = {
  reports: Report[];
};

const NEARBY_RADIUS_KM = 50;

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function bearingDeg(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const lat1r = (lat1 * Math.PI) / 180;
  const lat2r = (lat2 * Math.PI) / 180;
  const y = Math.sin(dLng) * Math.cos(lat2r);
  const x =
    Math.cos(lat1r) * Math.sin(lat2r) -
    Math.sin(lat1r) * Math.cos(lat2r) * Math.cos(dLng);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

function formatRelativeTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (ms < 0) return "just now";
  const m = Math.floor(ms / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.floor(h / 24);
  if (d === 1) return "Yesterday";
  return `${d}d ago`;
}

function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

function severityBadgeClass(sev: string): string {
  if (sev === "critical") return "bg-rust-light text-rust";
  if (sev === "high") return "bg-gold-light text-gold";
  return "bg-sage-light text-sage";
}

function severityDotClass(sev: string): string {
  if (sev === "critical") return "bg-rust";
  if (sev === "high") return "bg-gold";
  return "bg-sage";
}

function severityShadowStyle(sev: string): string {
  if (sev === "critical") return "shadow-[0_0_0_4px_rgba(196,82,42,0.18)]";
  if (sev === "high") return "shadow-[0_0_0_4px_rgba(181,134,10,0.18)]";
  return "shadow-[0_0_0_4px_rgba(74,124,89,0.18)]";
}

function severityShortLabel(sev: string): string {
  if (sev === "critical") return "HIGH";
  if (sev === "high") return "MED";
  return "LOW";
}

type Permission = "pending" | "granted" | "denied" | "unsupported";

type Enriched = Report & { distanceKm: number | null };

export function BewareNearbyPanel({ reports }: Props) {
  const [permission, setPermission] = useState<Permission>("pending");
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Direct setState in an effect body is flagged by React 19's
    // set-state-in-effect rule. Defer with a microtask so the update
    // lands outside the render cycle. The geolocation callbacks below
    // are inherently async, so they're fine without deferral.
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      Promise.resolve().then(() => setPermission("unsupported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setPermission("granted");
      },
      () => {
        setPermission("denied");
      },
      { timeout: 5000, maximumAge: 5 * 60 * 1000 },
    );
  }, []);

  const hasGeo = permission === "granted" && userLoc !== null;

  // Build the 3-item list to render
  const visible: Enriched[] = (() => {
    if (hasGeo && userLoc) {
      return reports
        .map((r) => ({
          ...r,
          distanceKm: haversineKm(userLoc.lat, userLoc.lng, r.lat, r.lng),
        }))
        .filter((r) => r.distanceKm <= NEARBY_RADIUS_KM)
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .slice(0, 3);
    }
    return reports.slice(0, 3).map((r) => ({ ...r, distanceKm: null }));
  })();

  return (
    <section className="mb-10">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-blue">
            <span className="h-2 w-2 rounded-full bg-blue" aria-hidden />
            Beware Board
          </p>
          <h2 className="mb-2 font-serif text-3xl leading-[1.05] text-ink md:text-4xl">
            What women are reporting{" "}
            <span className="font-medium italic text-gold">near you</span>, right
            now.
          </h2>
          <p className="max-w-xl font-mono text-sm leading-relaxed text-ww-muted">
            Crowd-sourced, moderator-verified within 30 minutes. No anonymous
            trolls.
          </p>
        </div>
        <Link
          href="/contribute/report"
          className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-ink/20 bg-warm-white px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-ink transition-colors hover:bg-sand md:self-end"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden />
          Report something
        </Link>
      </div>

      {/* Permission status banner — only when not granted */}
      {permission !== "granted" && (
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-ww-border bg-warm-white px-4 py-3">
          <ShieldCheck className="h-4 w-4 shrink-0 text-blue" aria-hidden />
          <p className="flex-1 font-mono text-xs leading-relaxed text-ww-muted">
            {permission === "pending" &&
              "Asking for your location to find the nearest reports…"}
            {permission === "denied" &&
              "Location off — showing the latest verified reports across all cities."}
            {permission === "unsupported" &&
              "Location unavailable on this device — showing the latest verified reports."}
          </p>
        </div>
      )}

      {/* Empty state — geo granted but no reports nearby */}
      {hasGeo && visible.length === 0 ? (
        <div className="rounded-2xl border border-ww-border bg-warm-white p-8 text-center">
          <p className="mb-2 font-mono text-sm text-ink">
            No verified reports within {NEARBY_RADIUS_KM} km of you.
          </p>
          <p className="font-mono text-xs text-ww-muted">
            <Link
              href="/community?tab=beware"
              className="underline hover:text-ink"
            >
              Browse all reports →
            </Link>
          </p>
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border border-ww-border bg-warm-white p-8 text-center">
          <p className="mb-2 font-mono text-sm text-ink">
            No verified reports yet.
          </p>
          <p className="font-mono text-xs text-ww-muted">
            <Link
              href="/contribute/report"
              className="underline hover:text-ink"
            >
              Be the first to add one →
            </Link>
          </p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Faux map */}
          <div className="relative h-[320px] overflow-hidden rounded-3xl border border-ww-border bg-warm-white md:h-[380px]">
            {/* grid */}
            <div
              className="absolute inset-0 opacity-50"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(138,125,114,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(138,125,114,0.08) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
              aria-hidden
            />
            {/* faux roads */}
            <div
              className="absolute inset-0"
              aria-hidden
              style={{
                backgroundImage:
                  "linear-gradient(115deg, transparent 38%, rgba(138,125,114,0.18) 38%, rgba(138,125,114,0.18) 41%, transparent 41%), linear-gradient(195deg, transparent 55%, rgba(138,125,114,0.16) 55%, rgba(138,125,114,0.16) 59%, transparent 59%)",
              }}
            />

            {/* You pin (centered) — only if geolocation granted */}
            {hasGeo && (
              <div className="absolute left-[44%] top-[44%] z-10 flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sage/60" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-sage shadow-[0_0_0_4px_rgba(74,124,89,0.18)]" />
                </span>
                <span className="rounded-full border border-ww-border bg-warm-white px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-ink shadow-sm">
                  You
                </span>
              </div>
            )}

            {/* Report pins */}
            {visible.map((r, i) => {
              let x = 50;
              let y = 50;
              if (hasGeo && userLoc && r.distanceKm !== null) {
                const bearing = bearingDeg(userLoc.lat, userLoc.lng, r.lat, r.lng);
                const scale = Math.min(r.distanceKm / NEARBY_RADIUS_KM, 1) * 35;
                const radians = (bearing * Math.PI) / 180;
                x = 50 + Math.sin(radians) * scale;
                y = 50 - Math.cos(radians) * scale;
              } else {
                // No geo: pseudo-distribute around center based on index
                const angles = [60, 200, 320];
                const radians = (angles[i % angles.length] * Math.PI) / 180;
                x = 50 + Math.sin(radians) * 28;
                y = 50 - Math.cos(radians) * 28;
              }
              return (
                <span
                  key={r.id}
                  className={`absolute h-3 w-3 rounded-full ${severityDotClass(r.severity)} ${severityShadowStyle(r.severity)}`}
                  style={{ left: `${x}%`, top: `${y}%` }}
                  aria-label={`${r.severity} severity report: ${r.title}`}
                />
              );
            })}

            {/* Footer pills */}
            <div className="absolute bottom-3 left-3">
              <span className="rounded-full border border-ww-border bg-warm-white px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-ink shadow-sm">
                {hasGeo ? `Within ${NEARBY_RADIUS_KM} km` : "Latest reports"}
              </span>
            </div>
            <div className="absolute bottom-3 right-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-warm-white">
                <span className="h-1.5 w-1.5 rounded-full bg-sage" />
                Live
              </span>
            </div>
          </div>

          {/* Reports list */}
          <ul className="flex flex-col gap-3">
            {visible.map((r) => (
              <li key={r.id}>
                <Link
                  href="/community?tab=beware"
                  className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-ww-border bg-warm-white p-4 transition-colors hover:border-ink/30"
                >
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest ${severityBadgeClass(r.severity)}`}
                  >
                    {severityShortLabel(r.severity)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-base leading-snug text-ink md:text-lg">
                      {r.title}
                    </p>
                    <p className="mt-1 truncate font-mono text-[11px] text-ww-muted">
                      <MapPin
                        className="mr-1 inline h-3 w-3 align-text-bottom"
                        aria-hidden
                      />
                      {r.distanceKm !== null && (
                        <>{formatDistance(r.distanceKm)} · </>
                      )}
                      {r.distanceKm === null && r.location && (
                        <>{r.location} · </>
                      )}
                      {formatRelativeTime(r.createdAt)}
                      {r.helpfulCount > 0 && (
                        <> · Verified by {r.helpfulCount} traveler{r.helpfulCount === 1 ? "" : "s"}</>
                      )}
                    </p>
                  </div>
                  <ChevronRight
                    className="h-4 w-4 shrink-0 text-ww-muted group-hover:text-ink"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
