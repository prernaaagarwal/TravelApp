"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, CheckCheck, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  related_report_id: string | null;
  created_at: string;
}

interface Props {
  initialUnread: number;
  notifications: Notification[];
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function NotificationBell({ initialUnread, notifications }: Props) {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(initialUnread);
  const [items, setItems] = useState(notifications);
  const [marking, setMarking] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function markAllRead() {
    setMarking(true);
    await fetch("/api/notifications/mark-read", { method: "POST" });
    setUnread(0);
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    setMarking(false);
  }

  if (items.length === 0 && unread === 0) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notifications${unread > 0 ? ` (${unread} unread)` : ""}`}
        className="relative p-1 text-ww-muted transition-colors hover:text-ink"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rust font-mono text-[9px] text-warm-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 border border-ww-border bg-warm-white shadow-lg">
          <div className="flex items-center justify-between border-b border-ww-border px-4 py-3">
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink">
              Notifications
            </span>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                disabled={marking}
                className="flex items-center gap-1 font-mono text-[10px] text-ww-muted transition-colors hover:text-ink disabled:opacity-50"
              >
                <CheckCheck className="h-3 w-3" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-4 py-6 text-center font-mono text-xs text-ww-muted">
                No notifications yet.
              </p>
            ) : (
              items.map((n) => {
                const isApproved = n.type === "report_approved";
                const href = n.related_report_id
                  ? `/profile/me?tab=reports`
                  : "/profile/me?tab=reports";

                return (
                  <Link
                    key={n.id}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`flex gap-3 border-b border-ww-border/50 px-4 py-3 transition-colors last:border-0 hover:bg-sand ${
                      !n.read ? "bg-rust-light/20" : ""
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isApproved ? (
                        <CheckCircle className="h-4 w-4 text-sage" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-gold" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-[11px] font-semibold text-ink">
                        {n.title}
                      </p>
                      <p className="mt-0.5 font-mono text-[10px] leading-relaxed text-ww-muted">
                        {n.body}
                      </p>
                      <p className="mt-1 font-mono text-[9px] text-ww-muted/60">
                        {timeAgo(n.created_at)}
                      </p>
                    </div>
                    {!n.read && (
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-rust" />
                    )}
                  </Link>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
