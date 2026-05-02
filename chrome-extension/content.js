// Injected into the active tab to extract place/page data.
// Returns a plain object — no imports allowed here.

(function () {
  function getMeta(name) {
    const el =
      document.querySelector(`meta[property="${name}"]`) ||
      document.querySelector(`meta[name="${name}"]`);
    return el?.content?.trim() || "";
  }

  function getText(selectors) {
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el?.textContent?.trim()) return el.textContent.trim();
    }
    return "";
  }

  // ── Place name ────────────────────────────────────────────────────────────
  const placeName =
    getMeta("og:title") ||
    getText(["h1", ".property-name", ".hotel-name", '[data-testid="property-header-title"]']) ||
    document.title.split(/[|\-–]/)[0].trim();

  // ── City ──────────────────────────────────────────────────────────────────
  const breadcrumbs = Array.from(
    document.querySelectorAll(
      ".breadcrumbs a, nav[aria-label] a, .bui-breadcrumb a, [data-testid='breadcrumb'] a"
    )
  ).map((el) => el.textContent.trim());

  // Try breadcrumbs, then og:locality, then URL path segments
  const ogLocality = getMeta("og:locality");
  const urlParts = window.location.pathname.split("/").filter(Boolean);
  const city =
    breadcrumbs[breadcrumbs.length - 2] ||
    ogLocality ||
    urlParts.find((p) => p.length > 3 && !/^\d+$/.test(p) && p !== "hotel" && p !== "attraction") ||
    "";

  // ── Description seed ──────────────────────────────────────────────────────
  const descSeed = getText([
    ".review-container .entry",
    '[data-testid="review-title"]',
    ".bui-review-title",
    ".tp-review-text",
    "article p",
    ".description",
  ]).slice(0, 400);

  // ── Platform → category hint ───────────────────────────────────────────────
  const host = window.location.hostname;
  let platformCategory = "Other";
  if (host.includes("booking.com") || host.includes("airbnb") || host.includes("hostelworld"))
    platformCategory = "Accommodation";
  else if (host.includes("tripadvisor") || host.includes("yelp"))
    platformCategory = "Food & drink";
  else if (host.includes("maps.google") || host.includes("maps.app.goo"))
    platformCategory = "Street / market";

  // ── Destination slug guess ────────────────────────────────────────────────
  // Match city name against known slug patterns (city-india, city-japan, etc.)
  const KNOWN_SUFFIXES = [
    "india","japan","thailand","vietnam","uae","france","indonesia",
    "portugal","spain","italy","greece","germany","netherlands","uk",
    "singapore","malaysia","philippines","cambodia","myanmar","nepal","sri-lanka",
  ];
  const cityLower = city.toLowerCase().replace(/\s+/g, "-");
  let destinationSlug = "";
  for (const suffix of KNOWN_SUFFIXES) {
    if (window.location.href.toLowerCase().includes(suffix) ||
        breadcrumbs.some((b) => b.toLowerCase().includes(suffix))) {
      destinationSlug = `${cityLower}-${suffix}`;
      break;
    }
  }

  return { placeName, city, platformCategory, descSeed, destinationSlug, pageUrl: window.location.href };
})();
