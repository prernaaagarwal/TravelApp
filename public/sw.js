// Wander Women service worker — production cache strategy
//
// Three caches (versioned together so a single bump invalidates all):
//   STATIC   — Next.js build output, icons, manifest. Cache-first.
//   PAGES    — HTML routes the user has visited. Network-first w/ 3s timeout.
//   FALLBACK — the /offline page, precached on install.
//
// API routes (/api/*), Supabase calls, and any non-GET request are NEVER
// cached — they always go to the network so writes hit the source of truth.
// Bump the SW_VERSION on every deploy that ships an SW change.

const SW_VERSION = "2026-05-04-1";

const STATIC_CACHE   = `ww-static-${SW_VERSION}`;
const PAGES_CACHE    = `ww-pages-${SW_VERSION}`;
const FALLBACK_CACHE = `ww-fallback-${SW_VERSION}`;
const ALL_CACHES     = [STATIC_CACHE, PAGES_CACHE, FALLBACK_CACHE];

const OFFLINE_URL = "/offline";

// Static assets that are safe to precache. Keep small — most static gets
// cached lazily on first request.
const PRECACHE_STATIC = [
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

// ─── Install ────────────────────────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const [staticCache, fallbackCache] = await Promise.all([
      caches.open(STATIC_CACHE),
      caches.open(FALLBACK_CACHE),
    ]);
    await Promise.all([
      // Some assets may 404 in dev — addAll is all-or-nothing, so use add() per item.
      ...PRECACHE_STATIC.map((url) => staticCache.add(url).catch(() => {})),
      fallbackCache.add(OFFLINE_URL).catch(() => {}),
    ]);
    // Activate immediately, but don't claim clients yet — that happens in activate
    // so the new SW only takes over after caches are in a known state.
    await self.skipWaiting();
  })());
});

// ─── Activate (delete old caches, claim clients) ────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.filter((k) => !ALL_CACHES.includes(k)).map((k) => caches.delete(k))
    );
    await self.clients.claim();
  })());
});

// ─── Allow page to trigger immediate activation ─────────────────────────
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// ─── Fetch (cache strategy router) ──────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Never intercept non-GET — POST, PUT, DELETE etc. always hit the network.
  if (req.method !== "GET") return;

  // Never cache API routes — they're per-user, may include secrets.
  if (url.pathname.startsWith("/api/")) return;

  // Never cache Supabase or any other origin's data calls.
  if (url.origin !== self.location.origin) {
    // Allow Google Fonts to be stale-while-revalidate'd separately if needed.
    return;
  }

  // Static build assets (immutable, content-hashed) — cache-first forever.
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.startsWith("/images/") ||
    url.pathname === "/manifest.json" ||
    url.pathname === "/favicon.ico"
  ) {
    event.respondWith(cacheFirst(req, STATIC_CACHE));
    return;
  }

  // Documents (page navigations, RSC payloads) — network-first with short
  // timeout. Falls back to cache, then to the offline page.
  if (
    req.mode === "navigate" ||
    req.destination === "document" ||
    req.headers.get("accept")?.includes("text/html")
  ) {
    event.respondWith(networkFirstWithTimeout(req, PAGES_CACHE, 3_000));
    return;
  }

  // Anything else (CSS, JS bundles not under _next/static, fonts hosted
  // same-origin) — stale-while-revalidate.
  event.respondWith(staleWhileRevalidate(req, STATIC_CACHE));
});

// ─── Strategies ─────────────────────────────────────────────────────────
async function cacheFirst(req, cacheName) {
  const cache  = await caches.open(cacheName);
  const cached = await cache.match(req);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    if (res.ok) cache.put(req, res.clone());
    return res;
  } catch {
    return Response.error();
  }
}

async function networkFirstWithTimeout(req, cacheName, timeoutMs) {
  const cache = await caches.open(cacheName);

  let timeoutId;
  const timeout = new Promise((resolve) => {
    timeoutId = setTimeout(() => resolve(null), timeoutMs);
  });

  try {
    const networkPromise = fetch(req).then((res) => {
      // Only cache successful HTML responses
      if (res.ok && res.type === "basic") {
        cache.put(req, res.clone());
      }
      return res;
    });

    const res = await Promise.race([networkPromise, timeout]);
    clearTimeout(timeoutId);

    if (res) return res;

    // Network too slow — try cache
    const cached = await cache.match(req);
    if (cached) return cached;

    // Wait for network to finish anyway, in case timeout fired but it eventually returned
    return await networkPromise;
  } catch {
    clearTimeout(timeoutId);

    // Offline — try cache, then offline page
    const cached = await cache.match(req);
    if (cached) return cached;

    const offlineCache = await caches.open(FALLBACK_CACHE);
    const offline      = await offlineCache.match(OFFLINE_URL);
    if (offline) return offline;

    return new Response("Offline", { status: 503, headers: { "Content-Type": "text/plain" } });
  }
}

async function staleWhileRevalidate(req, cacheName) {
  const cache  = await caches.open(cacheName);
  const cached = await cache.match(req);

  const fetchPromise = fetch(req)
    .then((res) => {
      if (res.ok) cache.put(req, res.clone());
      return res;
    })
    .catch(() => cached);

  return cached || fetchPromise;
}
