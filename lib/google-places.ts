/**
 * Google Places library loader.
 *
 * Lazily loads the Google Maps JS Places library on first use, caches the
 * result. Used by the PlaceAutocomplete component for the report-submission
 * flow.
 *
 * The browser-side key (NEXT_PUBLIC_GOOGLE_PLACES_API_KEY) MUST be:
 *   1. Restricted to specific HTTP referrers (your production domain + localhost)
 *   2. Restricted to the "Places API (New)" product only
 * in Google Cloud Console → Credentials. See README/CLAUDE.md.
 *
 * Without a key the loader resolves to null — the component falls back to
 * plain text inputs so the form still works.
 */

import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

type PlacesLibrary = google.maps.PlacesLibrary;

let loaderPromise: Promise<PlacesLibrary | null> | null = null;
let optionsApplied = false;

const PLACES_VERSION = "weekly"; // tracks Google's stable channel

export function getPlacesApiKey(): string | null {
  return process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY ?? null;
}

export function isPlacesAvailable(): boolean {
  return !!getPlacesApiKey();
}

/**
 * Load and return the Google Maps Places library.
 * Returns null when no API key is configured (graceful degradation).
 * Throws if the load itself fails (network, auth) so callers can show errors.
 */
export async function loadPlacesLibrary(): Promise<PlacesLibrary | null> {
  const apiKey = getPlacesApiKey();
  if (!apiKey) return null;

  if (loaderPromise) return loaderPromise;

  loaderPromise = (async () => {
    if (!optionsApplied) {
      setOptions({ key: apiKey, v: PLACES_VERSION });
      optionsApplied = true;
    }
    return (await importLibrary("places")) as PlacesLibrary;
  })();

  return loaderPromise;
}

/**
 * Public shape of a place selection — what the form receives back from
 * the autocomplete. Matches what the server action expects in formData.
 */
export interface SelectedPlace {
  /** Stable Google Place ID — primary key for re-resolving later. */
  placeId: string;
  /** Human-readable canonical address — what we display to users. */
  formattedAddress: string;
  /** Latitude in WGS84 — what goes on the map. */
  lat: number;
  /** Longitude in WGS84. */
  lng: number;
  /** Best-effort city extraction from address components. May be empty. */
  city: string;
  /** Best-effort country extraction. May be empty. */
  country: string;
  /** Short display name (e.g. "Eiffel Tower"). Falls back to formattedAddress if missing. */
  displayName: string;
}

/**
 * Extract a SelectedPlace from a fully-fetched google.maps.places.Place.
 * Caller must have already called place.fetchFields() with at least:
 *   ['id', 'displayName', 'formattedAddress', 'location', 'addressComponents']
 */
export function placeToSelected(place: google.maps.places.Place): SelectedPlace | null {
  const location = place.location;
  if (!location || !place.id) return null;

  const components = place.addressComponents ?? [];
  // Locality is the city in most countries. Fall back through alternates so
  // we still capture something for places like London (postal_town) or
  // Indian villages (sublocality_level_1).
  const cityComponent =
    components.find((c) => c.types.includes("locality")) ??
    components.find((c) => c.types.includes("postal_town")) ??
    components.find((c) => c.types.includes("administrative_area_level_2")) ??
    components.find((c) => c.types.includes("sublocality_level_1"));

  const countryComponent = components.find((c) => c.types.includes("country"));

  const lat = typeof location.lat === "function" ? location.lat() : Number(location.lat);
  const lng = typeof location.lng === "function" ? location.lng() : Number(location.lng);

  return {
    placeId: place.id,
    formattedAddress: place.formattedAddress ?? "",
    lat,
    lng,
    city: cityComponent?.longText ?? cityComponent?.shortText ?? "",
    country: countryComponent?.longText ?? countryComponent?.shortText ?? "",
    displayName: place.displayName ?? place.formattedAddress ?? "",
  };
}
