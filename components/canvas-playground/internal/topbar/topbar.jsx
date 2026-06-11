"use client";

import Link from "next/link";
import { PenLine, Plus } from "lucide-react";

export default function Topbar({ onNewBoard }) {
  return (
    <header className="sticky top-0 z-40 flex items-center gap-4 px-6 h-14 bg-background border-b border-border shrink-0">
      {/* Branding */}
      <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
        <div className="w-7 h-7 rounded-lg bg-surface-hover border border-border flex items-center justify-center group-hover:border-border-strong transition-colors">
          <PenLine className="w-3.5 h-3.5 text-muted-foreground" />
        </div>
        <span className="text-sm font-semibold text-foreground tracking-tight">
          Geiger{" "}
          <span className="text-text-secondary font-normal">Canvas</span>
        </span>
      </Link>

      <div className="flex-1" />

      {/* New board button */}
      <button
        onClick={onNewBoard}
        className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-colors"
      >
        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
        New Board
      </button>
    </header>
  );
}
