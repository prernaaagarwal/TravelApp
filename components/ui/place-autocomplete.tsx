"use client";

/**
 * PlaceAutocomplete — Google Places-powered location picker.
 *
 * Designed to replace the "City + Specific location" text inputs on the
 * beware report submission form. When the user selects a result, we know
 * the canonical place_id, formatted_address, lat/lng, and derived city —
 * which means new submissions appear on the map immediately, no backfill.
 *
 * Behaviour:
 *   - Lazy-loads Google Places library on first render
 *   - Falls back to plain <input> when no API key is configured (so the
 *     form still works during local dev or if the key gets pulled)
 *   - 250ms debounced keystroke -> fetchAutocompleteSuggestions
 *   - Session token reset after each selection (proper Google billing)
 *   - Keyboard navigation (Up/Down/Enter/Escape)
 *   - Click-outside to close
 *   - ARIA combobox semantics for screen readers
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  isPlacesAvailable,
  loadPlacesLibrary,
  placeToSelected,
  type SelectedPlace,
} from "@/lib/google-places";

interface Props {
  /** Pre-filled text on mount (e.g. existing report's formatted_address). */
  defaultValue?: string;
  /** Visible placeholder text. */
  placeholder?: string;
  /** Called whenever the user selects (place !== null) or clears (place === null). */
  onSelect: (place: SelectedPlace | null) => void;
  /** Disable the input entirely (e.g. when the area-level toggle is on). */
  disabled?: boolean;
  /** Extra classes for the wrapping element. */
  className?: string;
  /** Forwarded to the underlying input — useful for HTML form association. */
  inputId?: string;
}

interface Suggestion {
  placeId: string;
  mainText: string;
  secondaryText: string;
  toPlace: () => google.maps.places.Place;
}

const DEBOUNCE_MS = 250;

const PLACE_FIELDS: (keyof google.maps.places.Place)[] = [
  "id",
  "displayName",
  "formattedAddress",
  "location",
  "addressComponents",
];

export function PlaceAutocomplete({
  defaultValue = "",
  placeholder = "Search for a place — e.g. 'Lake Pichola' or 'Sarjapur Road'",
  onSelect,
  disabled = false,
  className = "",
  inputId,
}: Props) {
  const [available, setAvailable] = useState<boolean>(isPlacesAvailable());
  const [query, setQuery] = useState<string>(defaultValue);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const placesLibRef = useRef<google.maps.PlacesLibrary | null>(null);
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // Cleanup the debounce timer on unmount. The Places SDK is loaded lazily
  // inside fetchSuggestions on first keystroke, NOT on mount — pages that
  // include this component but never get typed in (rendered-but-not-used)
  // don't pay the ~35 KB loader cost.
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // Click outside the wrapper closes the dropdown.
  useEffect(() => {
    function onDocumentClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocumentClick);
    return () => document.removeEventListener("mousedown", onDocumentClick);
  }, []);

  const fetchSuggestions = useCallback(async (input: string) => {
    if (!input.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Lazy-load the Places SDK on the first real keystroke — saves ~35 KB
      // on routes that include this component but where the user never
      // types (e.g. someone landing on /contribute/report and bouncing).
      let lib = placesLibRef.current;
      if (!lib) {
        const loaded = await loadPlacesLibrary();
        if (!loaded) {
          setAvailable(false);
          setLoading(false);
          return;
        }
        lib = loaded;
        placesLibRef.current = lib;
      }
      // One session token per typing-then-selecting sequence — Google
      // bills the AutocompleteSuggestion calls + the final fetchFields
      // as a single session ($0.003 per session).
      if (!sessionTokenRef.current) {
        sessionTokenRef.current = new lib.AutocompleteSessionToken();
      }
      const result = await lib.AutocompleteSuggestion.fetchAutocompleteSuggestions({
        input,
        sessionToken: sessionTokenRef.current,
      });
      const items: Suggestion[] = (result.suggestions ?? []).flatMap((s) => {
        const pred = s.placePrediction;
        if (!pred) return [];
        return [{
          placeId: pred.placeId,
          mainText: pred.mainText?.toString() ?? pred.text?.toString() ?? "",
          secondaryText: pred.secondaryText?.toString() ?? "",
          toPlace: () => pred.toPlace(),
        }];
      });
      setSuggestions(items);
      setIsOpen(items.length > 0);
      setActiveIndex(-1);
    } catch {
      setError("Lookup failed — try again or type the location instead.");
      setSuggestions([]);
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  }, []);

  function handleInputChange(value: string) {
    setQuery(value);
    // Editing the text invalidates the previously-selected place — clear
    // it so the parent doesn't keep stale coords.
    onSelect(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(value), DEBOUNCE_MS);
  }

  const handleSelect = useCallback(
    async (suggestion: Suggestion) => {
      setLoading(true);
      setError(null);
      try {
        const place = suggestion.toPlace();
        await place.fetchFields({ fields: PLACE_FIELDS });
        const selected = placeToSelected(place);
        if (selected) {
          setQuery(selected.formattedAddress || selected.displayName);
          onSelect(selected);
        }
        setIsOpen(false);
        setSuggestions([]);
        // New session token for the next typing sequence.
        sessionTokenRef.current = null;
      } catch {
        setError("Could not load place details — try a different result.");
      } finally {
        setLoading(false);
      }
    },
    [onSelect],
  );

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        handleSelect(suggestions[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  // ─── Fallback: API unavailable. Plain text input — still submits, just
  // without coords. The parent form should treat this as area-level data.
  if (!available) {
    return (
      <div className={className}>
        <Input
          id={inputId}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onSelect(null);
          }}
          placeholder={placeholder}
          disabled={disabled}
          className="bg-warm-white border-ww-border"
        />
        {error && (
          <p className="mt-1 font-mono text-[10px] text-ww-muted">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <Input
        id={inputId}
        type="text"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls="place-autocomplete-listbox"
        aria-activedescendant={
          activeIndex >= 0 ? `place-suggestion-${activeIndex}` : undefined
        }
        aria-autocomplete="list"
        value={query}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (suggestions.length > 0) setIsOpen(true);
        }}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        spellCheck={false}
        className="bg-warm-white border-ww-border"
      />

      {isOpen && suggestions.length > 0 && (
        <ul
          id="place-autocomplete-listbox"
          role="listbox"
          className="absolute z-20 mt-1 max-h-80 w-full overflow-auto border border-ww-border bg-warm-white shadow-md"
        >
          {suggestions.map((s, i) => (
            <li
              key={s.placeId}
              id={`place-suggestion-${i}`}
              role="option"
              aria-selected={i === activeIndex}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseDown={(e) => {
                // mousedown not click — fires before the input loses focus,
                // preventing the click-outside handler from closing the
                // dropdown before we can register the selection.
                e.preventDefault();
                handleSelect(s);
              }}
              className={`cursor-pointer border-b border-ww-border/40 px-3 py-2 text-sm transition-colors last:border-b-0 ${
                i === activeIndex ? "bg-sand text-ink" : "text-ink hover:bg-sand/60"
              }`}
            >
              <div className="font-medium">{s.mainText}</div>
              {s.secondaryText && (
                <div className="font-mono text-[10px] text-ww-muted">{s.secondaryText}</div>
              )}
            </li>
          ))}
        </ul>
      )}

      {loading && (
        <p className="mt-1 font-mono text-[10px] text-ww-muted">Searching…</p>
      )}
      {error && !loading && (
        <p className="mt-1 font-mono text-[10px] text-rust">{error}</p>
      )}
    </div>
  );
}
