"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { MoreVertical, Trash2, ExternalLink, FolderOpen, Layout } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function BoardCard({ board, projectName, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const timeAgo = formatDistanceToNow(
    new Date(board.updated_at || board.created_at),
    { addSuffix: true }
  );

  const handleDelete = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setMenuOpen(false);
      onDelete();
    },
    [onDelete]
  );

  const hasElements =
    Array.isArray(board.elements)
      ? board.elements.length > 0
      : typeof board.elements === "string" &&
        board.elements !== "[]" &&
        board.elements !== "null";

  return (
    <div className="group relative flex flex-col rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#474747] transition-all duration-200 overflow-hidden hover:-translate-y-0.5">
      {/* Preview area */}
      <Link href={`/board/${board.id}`} className="block">
        <div className="h-32 bg-[#202020] border-b border-[#2a2a2a] flex items-center justify-center relative overflow-hidden">
          {/* Dot grid pattern */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, #2e2e2e 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          />
          <div className="relative z-10 flex flex-col items-center gap-2">
            <Layout className="w-8 h-8 text-[#333333]" />
            {hasElements && (
              <span className="text-[10px] text-[#525252] font-mono">
                has content
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Card info */}
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/board/${board.id}`} className="flex-1 min-w-0">
            <h3 className="text-[#e7e7e7] font-medium text-sm leading-snug truncate hover:text-white transition-colors">
              {board.name || "Untitled Board"}
            </h3>
          </Link>

          {/* Actions menu */}
          <div className="relative shrink-0">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 rounded-md hover:bg-[#2a2a2a] text-[#525252] hover:text-[#e7e7e7] transition-colors opacity-0 group-hover:opacity-100"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1 z-20 w-44 bg-[#2e2e2e] border border-[#333333] rounded-xl overflow-hidden shadow-2xl py-1">
                  <Link
                    href={`/board/${board.id}`}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#a3a3a3] hover:bg-[#333333] hover:text-[#e7e7e7] transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open Board
                  </Link>
                  <div className="my-1 border-t border-[#333333]" />
                  <button
                    onClick={handleDelete}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:bg-[#333333] transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Board
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-2 flex-wrap">
          {projectName && (
            <span className="flex items-center gap-1 text-[10px] text-[#737373] bg-[#242424] px-2 py-0.5 rounded-full border border-[#2a2a2a]">
              <FolderOpen className="w-2.5 h-2.5" />
              {projectName}
            </span>
          )}
          <span className="text-[10px] text-[#525252]">
            Updated {timeAgo}
          </span>
        </div>

        {board.description && (
          <p className="text-[11px] text-[#737373] line-clamp-1">
            {board.description}
          </p>
        )}
      </div>
    </div>
  );
}
