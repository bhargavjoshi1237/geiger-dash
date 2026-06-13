"use client";

import { Download, LoaderCircle, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatBytes } from "@/lib/tools/image-tools";

export function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between gap-3 text-xs font-medium text-foreground">
        {label}
        {hint ? <span className="font-normal text-muted-foreground">{hint}</span> : null}
      </span>
      {children}
    </label>
  );
}

export function NumberInput(props) {
  return (
    <input
      type="number"
      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:border-foreground/40 focus:ring-2 focus:ring-ring/30"
      {...props}
    />
  );
}

export function SelectInput(props) {
  return (
    <select
      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:border-foreground/40 focus:ring-2 focus:ring-ring/30"
      {...props}
    />
  );
}

export function RangeInput(props) {
  return <input type="range" className="w-full accent-foreground" {...props} />;
}

export function ProcessButton({ busy, label, onClick }) {
  return (
    <Button type="button" size="lg" className="w-full" disabled={busy} onClick={onClick}>
      {busy ? <LoaderCircle className="animate-spin" /> : <WandSparkles />}
      {busy ? "Processing..." : label}
    </Button>
  );
}

export function ResultCard({ result, filename, onDownload }) {
  if (!result) return null;

  return (
    <div
      className="mt-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4"
      aria-live="polite"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-foreground">Your image is ready</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {filename} · {formatBytes(result.blob.size)}
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onDownload}>
          <Download />
          Download
        </Button>
      </div>
    </div>
  );
}

