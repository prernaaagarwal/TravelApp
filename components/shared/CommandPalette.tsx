"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { Search, X, FileText, Compass, ShieldAlert, MessagesSquare } from "lucide-react";
import type { SearchResult, SearchResultType } from "@/lib/search";

const TYPE_META: Record<SearchResultType, { label: string; Icon: typeof FileText; tone: string }> = {
  intel:  { label: "Intel",   Icon: Compass,         tone: "border-rust  text-rust"  },
  beware: { label: "Beware",  Icon: ShieldAlert,     tone: "border-gold  text-gold"  },
  post:   { label: "Post",    Icon: MessagesSquare,  tone: "border-sage  text-sage"  },
};

const DEBOUNCE_MS      = 180;
const MIN_QUERY_LENGTH = 2;

// useSyncExternalStore lets us read a browser-only value (the platform string)
// without setState-in-effect or hydration mismatches. Server always returns
// "⌘K"; client returns the platform-correct shortcut on first render.
const subscribe = () => () => {};
const getServerShortcut = () => "⌘K";
const getClientShortcut = () =>
  /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent) ? "⌘K" : "Ctrl K";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const shortcutKey = useSyncExternalStore(subscribe, getClientShortcut, getServerShortcut);

  // Cmd+K / Ctrl+K to toggle
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {/* Desktop: pill with label + platform-correct shortcut hint */}
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="Search"
          className="hidden items-center gap-2 border border-ww-border bg-warm-white/60 px-3 py-1.5 font-mono text-[11px] text-ww-muted transition-colors hover:border-ink hover:text-ink md:inline-flex"
        >
          <Search className="h-3.5 w-3.5" />
          <span>Search</span>
          <kbd className="ml-2 border border-ww-border bg-sand px-1.5 py-0.5 text-[9px] uppercase tracking-widest text-ww-muted">
            {shortcutKey}
          </kbd>
        </button>
      </Dialog.Trigger>

      {/* Mobile: icon-only tap target — no kbd shortcut shown */}
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="Search"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ww-muted transition-colors hover:bg-warm-white/60 hover:text-ink md:hidden"
        >
          <Search className="h-4 w-4" />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex max-h-[80vh] w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden border border-ww-border bg-sand shadow-2xl sm:w-full sm:max-w-xl">
          <Dialog.Title className="sr-only">Search Wander Women</Dialog.Title>
          <Dialog.Description className="sr-only">
            Search across intel cards, beware reports, and community posts.
          </Dialog.Description>
          <PaletteBody onClose={() => setOpen(false)} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// Body — mounts only while palette is open. State naturally resets on close
// because Radix unmounts Dialog.Content's children when open=false.
function PaletteBody({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [query,   setQuery]   = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [active,  setActive]  = useState(0);

  const inputRef   = useRef<HTMLInputElement>(null);
  const abortRef   = useRef<AbortController | null>(null);
  const requestSeq = useRef(0);

  const trimmedLength = query.trim().length;

  // Debounced fetch with abort + sequence guard so a stale response can't
  // overwrite a newer one. Cleanup cancels both the timer and the in-flight
  // fetch — no setState in the cleanup itself.
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < MIN_QUERY_LENGTH) return;

    const seq = ++requestSeq.current;
    const handle = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setLoading(true);

      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });
        if (!res.ok) return;
        const data = (await res.json()) as { results: SearchResult[] };
        if (seq !== requestSeq.current) return; // stale
        setResults(data.results);
        setActive(0);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setResults([]);
        }
      } finally {
        if (seq === requestSeq.current) setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(handle);
      abortRef.current?.abort();
    };
  }, [query]);

  // Derived: only show results when the query meets the minimum length.
  // Avoids syncing setState in an effect just to clear results.
  const visibleResults = trimmedLength >= MIN_QUERY_LENGTH ? results : [];

  const select = useCallback(
    (result: SearchResult) => {
      onClose();
      router.push(result.href);
    },
    [router, onClose]
  );

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (visibleResults.length === 0 ? 0 : (i + 1) % visibleResults.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) =>
        visibleResults.length === 0 ? 0 : (i - 1 + visibleResults.length) % visibleResults.length
      );
    } else if (e.key === "Enter" && visibleResults[active]) {
      e.preventDefault();
      select(visibleResults[active]);
    }
  }

  // Auto-focus the input when palette opens (PaletteBody mount = palette open)
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <>
      {/* Input */}
      <div className="flex items-center gap-3 border-b border-ww-border bg-warm-white px-4 py-3">
        <Search className="h-4 w-4 shrink-0 text-ww-muted" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Search destinations, scams, posts…"
          className="flex-1 bg-transparent font-mono text-sm text-ink placeholder:text-ww-muted focus:outline-none"
          maxLength={100}
          autoComplete="off"
          spellCheck={false}
        />
        <Dialog.Close asChild>
          <button
            type="button"
            aria-label="Close"
            className="rounded-sm p-1 text-ww-muted transition-colors hover:bg-sand hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </Dialog.Close>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {trimmedLength < MIN_QUERY_LENGTH ? (
          <EmptyState message="Type at least 2 characters to search." />
        ) : loading && visibleResults.length === 0 ? (
          <EmptyState message="Searching…" />
        ) : visibleResults.length === 0 ? (
          <EmptyState message={`No results for "${query.trim()}".`} />
        ) : (
          <ul role="listbox" className="divide-y divide-ww-border">
            {visibleResults.map((r, i) => {
              const meta = TYPE_META[r.type];
              const Icon = meta.Icon;
              const isActive = i === active;
              return (
                <li key={`${r.type}-${r.id}`} role="option" aria-selected={isActive}>
                  <button
                    type="button"
                    onClick={() => select(r)}
                    onMouseEnter={() => setActive(i)}
                    className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors ${
                      isActive ? "bg-warm-white" : "bg-transparent hover:bg-warm-white/60"
                    }`}
                  >
                    <span className={`mt-0.5 inline-flex shrink-0 items-center gap-1 border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest ${meta.tone}`}>
                      <Icon className="h-3 w-3" />
                      {meta.label}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-serif text-base text-ink">
                        {r.title}
                      </span>
                      {r.excerpt && (
                        <span className="mt-0.5 block truncate font-mono text-[11px] text-ww-muted">
                          {r.excerpt}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-ww-border bg-warm-white px-4 py-2 font-mono text-[10px] text-ww-muted">
        <span className="flex items-center gap-3">
          <Hint k="↑↓"  label="navigate" />
          <Hint k="↵"   label="open" />
          <Hint k="esc" label="close" />
        </span>
        <span>Wander Women</span>
      </div>
    </>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="px-4 py-12 text-center font-mono text-xs text-ww-muted">
      {message}
    </div>
  );
}

function Hint({ k, label }: { k: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <kbd className="border border-ww-border bg-sand px-1.5 py-0.5 text-[9px] uppercase tracking-widest">
        {k}
      </kbd>
      <span>{label}</span>
    </span>
  );
}
