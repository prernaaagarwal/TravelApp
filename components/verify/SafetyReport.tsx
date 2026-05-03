"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle, Flag, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { AnalysisResult, ReportSection } from "@/lib/claude";

const RISK_STYLES: Record<string, { bg: string; text: string; border: string; label: string }> = {
  low:      { bg: "bg-sage-light", text: "text-sage",   border: "border-sage/30",   label: "Low Risk" },
  medium:   { bg: "bg-gold-light", text: "text-gold",   border: "border-gold/30",   label: "Moderate Risk" },
  high:     { bg: "bg-rust-light", text: "text-rust",   border: "border-rust/30",   label: "High Risk" },
  critical: { bg: "bg-red-100",    text: "text-red-700", border: "border-red-300",  label: "Critical Risk" },
};

const SECTION_ICONS: Record<string, React.ReactNode> = {
  authenticity:     <CheckCircle className="h-4 w-4" />,
  scam_patterns:    <AlertTriangle className="h-4 w-4" />,
  host_signals:     <Flag className="h-4 w-4" />,
  neighborhood:     <CheckCircle className="h-4 w-4" />,
  action_checklist: <CheckCircle className="h-4 w-4" />,
};

function SectionRow({ section }: { section: ReportSection }) {
  const [open, setOpen] = useState(section.id === "action_checklist");

  return (
    <div className="border border-ww-border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-sand/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-ww-muted">{SECTION_ICONS[section.id]}</span>
          <span className="text-sm font-medium text-ink">{section.label}</span>
          {section.verdict && (
            <span className="text-xs text-ww-muted">— {section.verdict}</span>
          )}
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 text-ww-muted shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-ww-muted shrink-0" />
        )}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-ww-border/60 pt-3">
          {section.detail && (
            <p className="text-sm text-ink/80 leading-relaxed">{section.detail}</p>
          )}
          {section.flags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {section.flags.map((flag, i) => (
                <span
                  key={i}
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    section.id === "action_checklist"
                      ? "bg-blue-light text-blue"
                      : flag.toLowerCase().includes("safe") || flag.toLowerCase().includes("genuine")
                      ? "bg-sage-light text-sage"
                      : "bg-rust-light text-rust"
                  }`}
                >
                  {section.id === "action_checklist" ? "✓" : "⚠"} {flag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function SafetyReport({
  analysis,
  propertyName,
  platform,
  bookingUrl,
}: {
  analysis: AnalysisResult;
  propertyName: string | null;
  platform: string | null;
  bookingUrl: string;
}) {
  const [copied, setCopied] = useState(false);
  const risk = RISK_STYLES[analysis.risk_level] ?? RISK_STYLES.medium;

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Risk header */}
      <div className={`rounded-xl border p-5 ${risk.bg} ${risk.border}`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${risk.bg} ${risk.text} border ${risk.border} mb-2`}>
              {risk.label}
            </span>
            <p className={`text-sm font-medium ${risk.text} leading-snug`}>{analysis.risk_summary}</p>
          </div>
          <div className="text-right shrink-0">
            <div className={`text-3xl font-bold ${risk.text}`}>{analysis.platform_trust_score}<span className="text-sm font-normal">/10</span></div>
            <div className="text-xs text-ww-muted mt-0.5">{platform ?? "Platform"} trust</div>
          </div>
        </div>

        {propertyName && (
          <p className="mt-3 text-xs text-ink/60 font-mono truncate">{propertyName}</p>
        )}
        <a
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-ww-muted hover:text-ink underline underline-offset-2 font-mono truncate block mt-1"
        >
          {bookingUrl.length > 60 ? bookingUrl.slice(0, 60) + "…" : bookingUrl}
        </a>
      </div>

      {/* Sections */}
      <div className="space-y-2">
        {analysis.sections.map((section) => (
          <SectionRow key={section.id} section={section} />
        ))}
      </div>

      {/* CTAs */}
      <div className="flex flex-wrap gap-3 pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={copyLink}
          className="gap-2 border-ww-border text-ww-muted hover:text-ink"
        >
          {copied ? <Check className="h-4 w-4 text-sage" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied!" : "Share report"}
        </Button>
        <Button asChild variant="outline" size="sm" className="gap-2 border-ww-border text-ww-muted hover:text-ink">
          <Link href="/contribute/report">Report a scam</Link>
        </Button>
        <Button asChild size="sm" className="bg-rust text-warm-white hover:bg-rust/90 gap-2 ml-auto">
          <Link href="/verify-stay">Verify another stay</Link>
        </Button>
      </div>

      <p className="text-xs text-ww-muted leading-relaxed">
        This report is generated by AI using knowledge of platform scam patterns and destination safety data.
        It does not replace due diligence — always verify the property independently before booking.
      </p>
    </div>
  );
}
