"use client";

import { useState, useTransition, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Upload, Download, FileJson, AlertCircle, CheckCircle2, Plus, RefreshCw, Ban } from "lucide-react";
import { previewImport, executeImport, exportAllCards, type PreviewResult, type RowStatus } from "./actions";
import type { IntelCardImport } from "@/lib/intel-card-schema";

type Step = "input" | "preview" | "done";

interface DoneState {
  created: number;
  updated: number;
  failed:  number;
  errors:  string[];
}

export function ImportClient({ templateJson }: { templateJson: string }) {
  const router  = useRouter();
  const [step,    setStep]    = useState<Step>("input");
  const [rawJson, setRawJson] = useState("");
  const [overwrite, setOverwrite] = useState(false);
  const [preview,    setPreview]    = useState<PreviewResult | null>(null);
  const [doneState, setDoneState]   = useState<DoneState | null>(null);

  const [pending, startTransition] = useTransition();
  const [error,   setError]        = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── Input step actions ────────────────────────────────────────────
  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".json")) {
      setError("Please upload a .json file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File is larger than 5 MB.");
      return;
    }
    setError("");
    const reader = new FileReader();
    reader.onload = () => setRawJson(String(reader.result ?? ""));
    reader.onerror = () => setError("Could not read the file.");
    reader.readAsText(file);
  }

  function loadTemplate() {
    setRawJson(templateJson);
    setError("");
  }

  function downloadTemplate() {
    triggerDownload(templateJson, "intel-cards-template.json");
  }

  function downloadExport() {
    setError("");
    startTransition(async () => {
      try {
        const json = await exportAllCards();
        const date = new Date().toISOString().slice(0, 10);
        triggerDownload(json, `intel-cards-export-${date}.json`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Export failed.");
      }
    });
  }

  function runPreview() {
    if (!rawJson.trim()) {
      setError("Paste some JSON or upload a file first.");
      return;
    }
    setError("");
    startTransition(async () => {
      try {
        const result = await previewImport(rawJson, overwrite);
        setPreview(result);
        setStep("preview");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Preview failed.");
      }
    });
  }

  // ─── Preview step actions ──────────────────────────────────────────
  function backToInput() {
    setStep("input");
    setPreview(null);
  }

  function confirmImport() {
    if (!preview) return;
    if (preview.importableCards.length === 0) {
      setError("Nothing to import — all rows are blocked or have errors.");
      return;
    }
    setError("");
    startTransition(async () => {
      try {
        const result = await executeImport(preview.importableCards as IntelCardImport[], overwrite);
        setDoneState({
          created: result.created,
          updated: result.updated,
          failed:  result.failed,
          errors:  result.errors,
        });
        setStep("done");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Import failed.");
      }
    });
  }

  // ─── Done step actions ─────────────────────────────────────────────
  function startOver() {
    setStep("input");
    setRawJson("");
    setOverwrite(false);
    setPreview(null);
    setDoneState(null);
    setError("");
    router.refresh();
  }

  // ─── Render ────────────────────────────────────────────────────────
  if (step === "preview" && preview) {
    return (
      <PreviewView
        preview={preview}
        overwrite={overwrite}
        pending={pending}
        error={error}
        onBack={backToInput}
        onConfirm={confirmImport}
      />
    );
  }

  if (step === "done" && doneState) {
    return (
      <DoneView
        done={doneState}
        onRestart={startOver}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={pending}
          className="inline-flex items-center gap-2 border border-ww-border bg-warm-white px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-ink transition-colors hover:border-ink disabled:opacity-40"
        >
          <Upload className="h-3 w-3" />
          Upload .json
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={handleFile}
        />
        <button
          type="button"
          onClick={loadTemplate}
          className="inline-flex items-center gap-2 border border-ww-border bg-warm-white px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-ww-muted transition-colors hover:border-ink hover:text-ink"
        >
          <FileJson className="h-3 w-3" />
          Load template
        </button>
        <button
          type="button"
          onClick={downloadTemplate}
          className="inline-flex items-center gap-2 border border-ww-border bg-warm-white px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-ww-muted transition-colors hover:border-ink hover:text-ink"
        >
          <Download className="h-3 w-3" />
          Download template
        </button>
        <button
          type="button"
          onClick={downloadExport}
          disabled={pending}
          className="ml-auto inline-flex items-center gap-2 border border-ww-border bg-sand px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-ww-muted transition-colors hover:border-ink hover:text-ink disabled:opacity-40"
          title="Download all current intel cards as JSON"
        >
          <Download className="h-3 w-3" />
          {pending ? "Exporting…" : "Export all cards"}
        </button>
      </div>

      {/* Textarea */}
      <div>
        <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-ww-muted">
          JSON payload
        </label>
        <textarea
          value={rawJson}
          onChange={(e) => setRawJson(e.target.value)}
          placeholder='Paste a JSON array of intel cards, e.g. [{"slug": "goa-india", ...}]'
          rows={18}
          className="w-full resize-y border border-ww-border bg-warm-white px-3 py-2 font-mono text-xs text-ink placeholder:text-ww-muted focus:border-ink focus:outline-none"
          spellCheck={false}
        />
        <p className="mt-1 font-mono text-[10px] text-ww-muted">
          {rawJson.length.toLocaleString("en-IN")} characters · Max 5 MB · Max 100 cards
        </p>
      </div>

      {/* Overwrite toggle */}
      <label className="flex cursor-pointer items-start gap-3 border border-ww-border bg-warm-white p-3">
        <input
          type="checkbox"
          checked={overwrite}
          onChange={(e) => setOverwrite(e.target.checked)}
          className="mt-0.5 h-4 w-4 cursor-pointer accent-ink"
        />
        <span>
          <span className="block font-mono text-xs text-ink">Overwrite existing slugs</span>
          <span className="mt-0.5 block font-mono text-[10px] leading-relaxed text-ww-muted">
            Off (default): rows whose slug already exists are blocked and reported.
            On: existing rows are updated with the imported data — irreversible without an export backup.
          </span>
        </span>
      </label>

      {error && (
        <p className="font-mono text-xs text-rust">{error}</p>
      )}

      <div className="flex items-center gap-3 border-t border-ww-border pt-4">
        <button
          type="button"
          onClick={runPreview}
          disabled={pending || !rawJson.trim()}
          className="border border-ink bg-ink px-5 py-2 font-mono text-[10px] uppercase tracking-widest text-warm-white transition-colors hover:bg-ink/80 disabled:opacity-40"
        >
          {pending ? "Validating…" : "Preview →"}
        </button>
        <Link
          href="/admin/intel"
          className="font-mono text-[10px] uppercase tracking-widest text-ww-muted transition-colors hover:text-ink"
        >
          Cancel
        </Link>
      </div>
    </div>
  );
}

// ─── Preview view ─────────────────────────────────────────────────────
function PreviewView({
  preview,
  overwrite,
  pending,
  error,
  onBack,
  onConfirm,
}: {
  preview:   PreviewResult;
  overwrite: boolean;
  pending:   boolean;
  error:     string;
  onBack:    () => void;
  onConfirm: () => void;
}) {
  if (preview.fatal) {
    return (
      <div className="space-y-5">
        <div className="border-l-2 border-rust bg-rust/5 p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-rust">Cannot import</p>
          <p className="mt-2 font-serif text-sm text-ink">{preview.fatal}</p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="border border-ww-border bg-sand px-5 py-2 font-mono text-[10px] uppercase tracking-widest text-ww-muted transition-colors hover:border-ink hover:text-ink"
        >
          ← Back
        </button>
      </div>
    );
  }

  const blocking = preview.rows.filter((r) => r.status === "error" || r.status === "missing_contributor").length;

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <SummaryStat label="New" count={preview.willCreate} tone="sage" Icon={Plus} />
        <SummaryStat label="Update" count={preview.willUpdate} tone="gold" Icon={RefreshCw} />
        <SummaryStat label="Blocked" count={preview.blocked}   tone="ww-muted" Icon={Ban} />
        <SummaryStat label="Errors" count={blocking} tone="rust" Icon={AlertCircle} />
      </div>

      {/* Mode banner */}
      <div className="border border-ww-border bg-warm-white p-3 font-mono text-xs">
        <span className="font-medium text-ink">
          {overwrite ? "Overwrite mode is ON" : "Insert-only mode"}
        </span>
        <span className="ml-2 text-ww-muted">
          {overwrite
            ? "— existing slugs will be overwritten."
            : "— rows whose slug already exists are blocked. Go back and tick “Overwrite” to update them."}
        </span>
      </div>

      {/* Row table */}
      <div className="overflow-hidden border border-ww-border bg-warm-white">
        <table className="w-full">
          <thead className="border-b border-ww-border bg-sand">
            <tr className="text-left">
              <Th>Status</Th>
              <Th>Slug</Th>
              <Th>Destination</Th>
              <Th>Country</Th>
              <Th>Notes</Th>
            </tr>
          </thead>
          <tbody>
            {preview.rows.map((row) => (
              <tr key={`${row.index}-${row.slug}`} className="border-b border-ww-border last:border-b-0">
                <Td><StatusBadge status={row.status} /></Td>
                <Td><code className="font-mono text-xs text-ink">{row.slug}</code></Td>
                <Td>{row.destination}</Td>
                <Td>{row.country}</Td>
                <Td>
                  {row.message ? (
                    <span className="font-mono text-[11px] text-rust">{row.message}</span>
                  ) : (
                    <span className="font-mono text-[10px] text-ww-muted">—</span>
                  )}
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {error && <p className="font-mono text-xs text-rust">{error}</p>}

      <div className="flex items-center gap-3 border-t border-ww-border pt-4">
        <button
          type="button"
          onClick={onConfirm}
          disabled={pending || preview.importableCards.length === 0}
          className="border border-ink bg-ink px-5 py-2 font-mono text-[10px] uppercase tracking-widest text-warm-white transition-colors hover:bg-ink/80 disabled:opacity-40"
        >
          {pending
            ? "Importing…"
            : preview.importableCards.length === 0
              ? "Nothing to import"
              : `Import ${preview.importableCards.length} card${preview.importableCards.length === 1 ? "" : "s"}`}
        </button>
        <button
          type="button"
          onClick={onBack}
          disabled={pending}
          className="border border-ww-border bg-sand px-5 py-2 font-mono text-[10px] uppercase tracking-widest text-ww-muted transition-colors hover:border-ink hover:text-ink disabled:opacity-40"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}

// ─── Done view ────────────────────────────────────────────────────────
function DoneView({ done, onRestart }: { done: DoneState; onRestart: () => void }) {
  const total = done.created + done.updated;
  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 border border-sage bg-sage/5 p-5">
        <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-sage" />
        <div>
          <p className="font-serif text-2xl text-ink">
            {total === 0 ? "No cards written." : `Imported ${total} card${total === 1 ? "" : "s"}.`}
          </p>
          <p className="mt-1 font-mono text-xs text-ww-muted">
            {done.created} created · {done.updated} updated
            {done.failed > 0 && <> · <span className="text-rust">{done.failed} failed</span></>}
          </p>
        </div>
      </div>

      {done.errors.length > 0 && (
        <div className="border-l-2 border-rust bg-rust/5 p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-rust">Errors</p>
          <ul className="mt-2 space-y-1 font-mono text-xs text-ink">
            {done.errors.map((e, i) => <li key={i}>• {e}</li>)}
          </ul>
        </div>
      )}

      <div className="flex items-center gap-3 border-t border-ww-border pt-4">
        <Link
          href="/admin/intel"
          className="border border-ink bg-ink px-5 py-2 font-mono text-[10px] uppercase tracking-widest text-warm-white transition-colors hover:bg-ink/80"
        >
          Back to intel cards →
        </Link>
        <button
          type="button"
          onClick={onRestart}
          className="border border-ww-border bg-sand px-5 py-2 font-mono text-[10px] uppercase tracking-widest text-ww-muted transition-colors hover:border-ink hover:text-ink"
        >
          Import another batch
        </button>
      </div>
    </div>
  );
}

// ─── UI primitives ────────────────────────────────────────────────────
const TONE_CLASSES: Record<string, { icon: string; text: string }> = {
  sage:     { icon: "text-sage",     text: "text-sage"  },
  gold:     { icon: "text-gold",     text: "text-gold"  },
  rust:     { icon: "text-rust",     text: "text-rust"  },
  "ww-muted": { icon: "text-ww-muted", text: "text-ink" },
};

function SummaryStat({ label, count, tone, Icon }: { label: string; count: number; tone: string; Icon: typeof Plus }) {
  const c = TONE_CLASSES[tone] ?? TONE_CLASSES["ww-muted"];
  return (
    <div className="border border-ww-border bg-warm-white p-3">
      <div className="flex items-center gap-2">
        <Icon className={`h-3.5 w-3.5 ${c.icon}`} />
        <p className="font-mono text-[10px] uppercase tracking-widest text-ww-muted">{label}</p>
      </div>
      <p className={`mt-1 font-serif text-2xl ${c.text}`}>{count}</p>
    </div>
  );
}

const STATUS_META: Record<RowStatus, { label: string; tone: string }> = {
  new:                 { label: "New",      tone: "border-sage  text-sage  bg-sage/5"  },
  update:              { label: "Update",   tone: "border-gold  text-gold  bg-gold/5"  },
  blocked:             { label: "Blocked",  tone: "border-ww-border text-ww-muted bg-sand" },
  error:               { label: "Error",    tone: "border-rust  text-rust  bg-rust/5"  },
  missing_contributor: { label: "FK error", tone: "border-rust  text-rust  bg-rust/5"  },
};

function StatusBadge({ status }: { status: RowStatus }) {
  const meta = STATUS_META[status];
  return (
    <span className={`inline-block border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${meta.tone}`}>
      {meta.label}
    </span>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-3 py-2 text-left font-mono text-[10px] uppercase tracking-widest text-ww-muted">
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-3 py-2.5 align-top text-sm text-ink">{children}</td>;
}

// ─── Helpers ──────────────────────────────────────────────────────────
function triggerDownload(content: string, filename: string) {
  const blob = new Blob([content], { type: "application/json" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
