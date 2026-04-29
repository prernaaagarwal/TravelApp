"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Map as LeafletMap } from "leaflet";

// ── Types ────────────────────────────────────────────────────────────────────

export type MapReport = {
  id: string;
  lat: number;
  lng: number;
  type: "scam" | "harassment" | "transport" | "stay" | "safe";
  title: string;
  place: string;
  desc: string;
  date: string;
  confirms: number;
  reporter: string;
};

// ── Demo data — real Goa GPS coordinates ─────────────────────────────────────

export const DEMO_REPORTS: MapReport[] = [
  // Scams
  { id: "d1",  lat: 15.5490, lng: 73.7535, type: "scam",       title: "GoaMiles impersonator at Dabolim Airport",         place: "Dabolim Airport exit, pickup bay",                desc: "Man posing as GoaMiles driver quoted ₹2,800 for a ₹900 ride to Calangute. Wore a vest but no official ID. Always book GoaMiles inside the terminal, not outside.",                                                                        date: "2 days ago",   confirms: 12, reporter: "Ananya M." },
  { id: "d2",  lat: 15.5440, lng: 73.7556, type: "scam",       title: "Fake villa booking via Instagram",                  place: "Dabolim Airport area / online",                   desc: "Paid ₹45,000 deposit for a 'sea-view villa' via Instagram DM. Arrived to find the property didn't exist. Only book via verified platforms — never Instagram DM.",                                                                       date: "1 week ago",   confirms: 31, reporter: "Sara K." },
  { id: "d3",  lat: 15.6342, lng: 73.8267, type: "scam",       title: "Royal Enfield hidden damage scam",                 place: "Multiple rental shops, Calangute main road",      desc: "Rented a bike, returned it in the same condition. Rental shop owner claimed pre-existing damage and held ₹8,000 deposit. Always photograph the entire bike before riding. Use shops with clear written receipts.",                         date: "3 days ago",   confirms: 28, reporter: "Devika P." },
  { id: "d4",  lat: 15.5993, lng: 73.8130, type: "scam",       title: "Fake 'entry ticket' at beach shack",               place: "Candolim Beach north end",                        desc: "Man claimed our beach area required ₹200 per person entry. Completely fake — all Goa beaches are free. Walked away and he didn't follow.",                                                                                                date: "5 days ago",   confirms: 9,  reporter: "Riya S." },
  { id: "d5",  lat: 15.4909, lng: 73.8278, type: "scam",       title: "Overpriced feni sold as 'export quality'",         place: "Colva Beach souvenir shops",                      desc: "Paid ₹1,800 for feni described as export-grade. Same bottle available at government liquor stores for ₹340. Never buy alcohol from beach vendors.",                                                                                      date: "2 weeks ago",  confirms: 7,  reporter: "Priya N." },
  { id: "d6",  lat: 15.7317, lng: 73.6934, type: "scam",       title: "Dolphin tour bait-and-switch",                     place: "Arambol Beach, north end boat jetty",             desc: "Paid ₹600 per person for 'guaranteed dolphin sighting' tour. No dolphins seen. Operator refused refund claiming 'dolphins are wild.' Book through licensed operators at the main Arambol jetty only.",                                    date: "4 days ago",   confirms: 15, reporter: "Maya R." },
  { id: "d21", lat: 15.5520, lng: 73.7563, type: "scam",       title: "Fake 'Goa Tourism' desk near airport",             place: "Dabolim Airport arrival hall",                    desc: "A desk claiming to be 'Official Goa Tourism' inside the airport offered tours and taxis. Not official. The real GTDC counter is clearly signposted. This desk overcharges by 3–4× for hotel bookings.",                                  date: "1 week ago",   confirms: 23, reporter: "Riya S." },
  { id: "d22", lat: 15.6980, lng: 73.7042, type: "scam",       title: "Commission shop forced stop on Chapora route",     place: "Road between Anjuna and Chapora",                 desc: "Hired a scooter. Male 'guide' insisted on stopping at his cousin's spice shop. Very persistent. Book scooters from established rental shops and go without a guide.",                                                                   date: "3 weeks ago",  confirms: 8,  reporter: "Maya R." },

  // Harassment
  { id: "d7",  lat: 15.6266, lng: 73.8266, type: "harassment", title: "Followed from beach to guesthouse",                place: "Calangute–Baga road",                             desc: "A man followed me from Calangute Beach northward for about 10 minutes. Walking into a busy restaurant made him leave. The Calangute–Baga stretch after 7pm can get uncomfortable.",                                                      date: "1 week ago",   confirms: 19, reporter: "Anonymous" },
  { id: "d8",  lat: 15.6086, lng: 73.7537, type: "harassment", title: "Photography without consent at bus stand",         place: "Panaji KTC bus stand",                            desc: "Two men were photographing me and other solo women at the bus stand without consent. Confronting them directly worked — they stopped. Stay alert at Panaji bus stand.",                                                                   date: "3 days ago",   confirms: 8,  reporter: "Sneha T." },
  { id: "d9",  lat: 15.7094, lng: 73.7064, type: "harassment", title: "Persistent approach at Anjuna flea market",        place: "Anjuna Flea Market, Wednesday",                   desc: "A man approached me three times at the market. Second and third approach got increasingly close. Moving to the women's clothing section made him stop — too crowded.",                                                                   date: "6 days ago",   confirms: 22, reporter: "Anonymous" },
  { id: "d23", lat: 15.4909, lng: 73.8278, type: "harassment", title: "Unwanted photos at sunset at Colva",               place: "Colva Beach, evening",                            desc: "Group of men were taking photos of solo women watching the sunset. Moved closer to a group of families — they moved on. Colva is generally fine during the day; the evening crowd changes character.",                                    date: "4 days ago",   confirms: 11, reporter: "Anonymous" },

  // Transport
  { id: "d10", lat: 15.4989, lng: 73.9080, type: "transport",  title: "Taxi union blocks Uber near Margao station",       place: "Margao railway station exit",                     desc: "Taxi touts aggressively block you from booking Uber/Ola outside Margao station. Walk 5 minutes to the market area first, then book your ride. Never open ride apps visibly at the station exit.",                                       date: "1 day ago",    confirms: 34, reporter: "Ananya M." },
  { id: "d11", lat: 15.5516, lng: 73.9312, type: "transport",  title: "Auto refuses meter, demands ₹500 flat rate",       place: "Vasco bus stop and surrounding roads",            desc: "Most autos in Vasco refuse to run the meter. ₹50–80 should cover most local trips. Use Rapido if available or negotiate firmly before getting in.",                                                                                     date: "2 weeks ago",  confirms: 11, reporter: "Divya K." },
  { id: "d12", lat: 15.6342, lng: 73.8267, type: "transport",  title: "Unlicensed 'taxi' at Calangute circle",            place: "Calangute main circle roundabout",                desc: "Men without meters or official plates offering rides near Calangute circle. No ID, no receipt possible. Only use GoaMiles app or pre-booked taxis from your hotel for safety.",                                                          date: "5 days ago",   confirms: 16, reporter: "Sara K." },
  { id: "d13", lat: 15.7380, lng: 73.6964, type: "transport",  title: "Last bus from Arambol at 7pm — not 9pm",           place: "Arambol main bus stop",                           desc: "The last direct bus from Arambol to Panaji is at 7:15pm, NOT 9pm as Google Maps shows. After 7pm you need a private taxi or auto. Do not get stranded here at night.",                                                                  date: "3 days ago",   confirms: 41, reporter: "Riya S." },

  // Stays
  { id: "d14", lat: 15.6390, lng: 73.8276, type: "stay",       title: "Guesthouse manager enters room without knocking",  place: "Near Baga Beach, behind Tito's Lane",            desc: "The guesthouse owner entered my room without knocking twice. On the third time I confronted him — he stopped. Check door locks before booking anywhere on Tito's Lane. The lock-from-inside bolt was broken.",                           date: "2 weeks ago",  confirms: 6,  reporter: "Anonymous" },
  { id: "d15", lat: 15.5993, lng: 73.8130, type: "stay",       title: "Booking.com listing doesn't match reality",       place: "Candolim, 2nd cross road",                        desc: "Booking.com photos showed a private pool. Arrived to find a shared courtyard with no pool. Owner refused any refund. Screenshots of photos saved to file complaint with Booking.com — they eventually refunded 50%.",                   date: "1 week ago",   confirms: 9,  reporter: "Maya R." },

  // Safe tips
  { id: "d16", lat: 15.5174, lng: 73.9556, type: "safe",       title: "Benaulim Beach — quiet and respectful",            place: "Benaulim Beach, South Goa",                      desc: "Spent 4 days here alone. Very peaceful, far fewer touts than North Goa, no harassment in 4 days. Local fishermen are friendly and professional. Highly recommend for first-time solo women.",                                            date: "4 days ago",   confirms: 37, reporter: "Priya N." },
  { id: "d17", lat: 15.6044, lng: 73.9594, type: "safe",       title: "GoaMiles is genuinely safe and honest",            place: "All Goa — book via app",                          desc: "Used GoaMiles 12 times in 10 days. Every driver professional, meter-accurate, no issues. Always book via app, not by stopping random cars. The app shows driver name, photo, plate number.",                                             date: "1 week ago",   confirms: 52, reporter: "Ananya M." },
  { id: "d18", lat: 15.4780, lng: 73.8314, type: "safe",       title: "Palolem Beach — safest solo women experience",     place: "Palolem Beach, South Goa",                       desc: "Palolem is consistently the best solo women experience in Goa. The beach shacks are respectful, accommodation is good quality for budget, and there's a strong community of solo travelers year-round.",                                  date: "2 days ago",   confirms: 89, reporter: "Sara K." },
  { id: "d19", lat: 15.5992, lng: 73.7637, type: "safe",       title: "Panaji Old Quarter safe to walk at night",         place: "Fontainhas Latin Quarter, Panaji",               desc: "Walked the Fontainhas area alone until 10pm on multiple evenings. Very safe, well-lit, families out. The Portuguese-era streets are beautiful and genuinely comfortable for solo women.",                                                date: "5 days ago",   confirms: 28, reporter: "Devika P." },
  { id: "d20", lat: 15.7172, lng: 73.6928, type: "safe",       title: "Morjim Beach — calm north Goa option",             place: "Morjim Beach",                                   desc: "Much quieter than Calangute/Baga. Russian expat community means vendors leave tourists alone more. Good for a solo day trip. Rickshaw to Morjim from Arambol costs ₹120 fixed (negotiate first).",                                      date: "1 week ago",   confirms: 14, reporter: "Anonymous" },
];

// ── Colours & icon factory ────────────────────────────────────────────────────

const COLORS: Record<MapReport["type"], string> = {
  scam:       "#c4522a",
  harassment: "#8b2252",
  transport:  "#b5710a",
  stay:       "#1a4a7a",
  safe:       "#2d6a4f",
};

function createIcon(
  L: typeof import("leaflet").default,
  type: MapReport["type"]
) {
  const color = COLORS[type];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="32" viewBox="0 0 24 32">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 20 12 20S24 21 24 12C24 5.373 18.627 0 12 0z" fill="${color}"/>
    <circle cx="12" cy="12" r="4" fill="white"/>
  </svg>`;
  return L.divIcon({
    html: svg,
    className: "",
    iconSize:   [24, 32],
    iconAnchor: [12, 32],
  });
}

// ── Component ────────────────────────────────────────────────────────────────

type Props = { dbReports: MapReport[] };

export function ScamMapClient({ dbReports }: Props) {
  // Merge: DB reports override demo entries with the same title
  const dbTitles = new Set(dbReports.map((r) => r.title.trim().toLowerCase()));
  const demo = DEMO_REPORTS.filter((r) => !dbTitles.has(r.title.trim().toLowerCase()));
  const reports = [...dbReports, ...demo];

  const [activeFilter, setActiveFilter] = useState("All");
  const [visibleCount, setVisibleCount] = useState(reports.length);
  const [selected, setSelected]         = useState<MapReport | null>(null);

  const mapDivRef      = useRef<HTMLDivElement>(null);
  const mapRef         = useRef<LeafletMap | null>(null);
  const clusterRef     = useRef<any>(null);
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
    if (mapRef.current) return; // already initialised

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
        center: [15.5793, 73.8143],
        zoom: 11,
        zoomControl: false, // we'll reposition it
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      // Zoom control — bottom right
      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Cluster group + markers
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

        {/* Stats pill — top centre */}
        <div className="absolute left-1/2 top-3 z-[999] -translate-x-1/2 rounded-full border border-ww-border bg-warm-white/90 px-3 py-1 shadow-sm backdrop-blur-sm">
          <span className="font-mono text-[10px] text-ww-muted">
            {visibleCount} reports · Goa
          </span>
        </div>

        {/* Legend — top right */}
        <div className="absolute right-3 top-3 z-[999] flex flex-col gap-1.5 rounded border border-ww-border bg-warm-white/90 p-2 shadow-sm backdrop-blur-sm">
          {(["scam", "harassment", "transport", "stay", "safe"] as MapReport["type"][]).map((t) => (
            <div key={t} className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ background: COLORS[t] }}
              />
              <span className="font-mono text-[9px] capitalize text-ww-muted">{t}</span>
            </div>
          ))}
        </div>

        {/* Locate-me — bottom left */}
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

        {/* FAB — bottom right */}
        <Link
          href="/contribute/report?destination=goa-india"
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
          {/* Header row */}
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

          {/* Scrollable body */}
          <div className="overflow-y-auto px-4 pb-6 space-y-3">
            <h3 className="font-serif text-xl leading-snug text-ink">
              {selected.title}
            </h3>
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
