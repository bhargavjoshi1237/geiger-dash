"use client";

import Link from "next/link";
import { PenLine, Plus } from "lucide-react";

export default function Topbar({ onNewBoard }) {
  return (
    <header className="sticky top-0 z-40 flex items-center gap-4 px-6 h-14 bg-[#161616] border-b border-[#2a2a2a] shrink-0">
      {/* Branding */}
      <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
        <div className="w-7 h-7 rounded-lg bg-[#2a2a2a] border border-[#333333] flex items-center justify-center group-hover:border-[#474747] transition-colors">
          <PenLine className="w-3.5 h-3.5 text-[#a3a3a3]" />
        </div>
        <span className="text-sm font-semibold text-[#e7e7e7] tracking-tight">
          Geiger{" "}
          <span className="text-[#737373] font-normal">Canvas</span>
        </span>
      </Link>

      <div className="flex-1" />

      {/* New board button */}
      <button
        onClick={onNewBoard}
        className="flex items-center gap-2 bg-[#e7e7e7] hover:bg-white text-[#161616] px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-colors"
      >
        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
        New Board
      </button>
    </header>
  );
}
