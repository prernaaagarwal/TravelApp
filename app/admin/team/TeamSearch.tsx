"use client";

import { useState } from "react";
import { UserPlus, Loader2 } from "lucide-react";

interface Props {
  promoteAction: (userId: string) => Promise<{ error: string } | void>;
}

export function TeamSearch({ promoteAction }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<
    { id: string; name: string; username: string | null; role: string }[]
  >([]);
  const [searching, setSearching] = useState(false);
  const [promoting, setPromoting] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function search() {
    if (!query.trim()) return;
    setSearching(true);
    setResults([]);
    setMessage(null);
    try {
      const res = await fetch(
        `/api/admin/search-users?q=${encodeURIComponent(query.trim())}`,
      );
      const json = await res.json();
      setResults(json.users ?? []);
      if ((json.users ?? []).length === 0) {
        setMessage({ type: "err", text: "No matching users found." });
      }
    } catch {
      setMessage({ type: "err", text: "Search failed. Try again." });
    } finally {
      setSearching(false);
    }
  }

  async function promote(userId: string, name: string) {
    setPromoting(userId);
    setMessage(null);
    const result = await promoteAction(userId);
    setPromoting(null);
    if (result?.error) {
      setMessage({ type: "err", text: result.error });
    } else {
      setMessage({ type: "ok", text: `${name} is now a moderator.` });
      setResults((r) => r.filter((u) => u.id !== userId));
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
          placeholder="Search by username or email..."
          className="flex-1 border border-ww-border bg-sand px-3 py-2 font-mono text-xs text-ink placeholder-ww-muted/60 outline-none focus:border-ink"
        />
        <button
          onClick={search}
          disabled={searching || !query.trim()}
          className="border border-ink bg-ink px-4 py-2 font-mono text-xs uppercase tracking-widest text-warm-white transition-opacity hover:opacity-80 disabled:opacity-40"
        >
          {searching ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            "Search"
          )}
        </button>
      </div>

      {message && (
        <p
          className={`font-mono text-[10px] ${
            message.type === "ok" ? "text-sage" : "text-rust"
          }`}
        >
          {message.text}
        </p>
      )}

      {results.length > 0 && (
        <div className="space-y-1">
          {results.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between border border-ww-border bg-warm-white px-4 py-3"
            >
              <div>
                <p className="font-mono text-xs font-semibold text-ink">
                  {u.name}
                </p>
                {u.username && (
                  <p className="font-mono text-[10px] text-ww-muted">
                    @{u.username}
                  </p>
                )}
                <p className="font-mono text-[9px] text-ww-muted/60 capitalize">
                  {u.role}
                </p>
              </div>
              {u.role === "user" && (
                <button
                  onClick={() => promote(u.id, u.name)}
                  disabled={promoting === u.id}
                  className="flex items-center gap-1.5 border border-blue/30 bg-blue/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-blue transition-colors hover:bg-blue hover:text-warm-white disabled:opacity-40"
                >
                  {promoting === u.id ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <UserPlus className="h-3 w-3" />
                  )}
                  Make moderator
                </button>
              )}
              {u.role !== "user" && (
                <span className="font-mono text-[10px] text-ww-muted capitalize">
                  Already {u.role}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
