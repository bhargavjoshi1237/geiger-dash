"use client";

import "@excalidraw/excalidraw/index.css";

import { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, Save, Check, FolderOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// ── Lazy-load Excalidraw (browser-only, no SSR) ──────────────────────────────
const ExcalidrawComponent = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 flex items-center justify-center bg-[#1e1e1e]">
        <div className="flex flex-col items-center gap-3">
          <svg
            className="w-8 h-8 text-[#474747] animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <p className="text-sm text-[#737373]">Loading canvas…</p>
        </div>
      </div>
    ),
  }
);

// Auto-save debounce in ms — saves 2.5 s after the last change
const SAVE_DEBOUNCE_MS = 2500;

// ── Save-status indicator ─────────────────────────────────────────────────────
function SaveStatus({ status }) {
  if (status === "saving")
    return (
      <span className="flex items-center gap-1.5 text-xs text-[#737373]">
        <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
          <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
        </svg>
        Saving…
      </span>
    );
  if (status === "saved")
    return (
      <span className="flex items-center gap-1.5 text-xs text-[#737373]">
        <Check className="w-3 h-3 text-[#10b981]" />
        Saved
      </span>
    );
  // unsaved
  return (
    <span className="flex items-center gap-1.5 text-xs text-[#737373]">
      <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] inline-block" />
      Unsaved changes
    </span>
  );
}

// ── Main editor component ─────────────────────────────────────────────────────
export default function ExcalidrawEditor({ board, projectName }) {
  const [saveStatus, setSaveStatus] = useState("saved");
  const [boardName, setBoardName] = useState(board?.name || "Untitled Board");
  const [editingName, setEditingName] = useState(false);

  const saveTimer = useRef(null);
  // Keep latest canvas state in refs so the debounced callback always has fresh data
  const elementsRef = useRef([]);
  const appStateRef = useRef({});
  const filesRef = useRef({});

  const supabase = createClient();

  // ── Persist to Supabase ────────────────────────────────────────────────────
  const saveToSupabase = useCallback(
    async (elements, appState, files) => {
      setSaveStatus("saving");
      const { error } = await supabase
        .from("canvas_boards")
        .update({
          elements,
          app_state: appState,
          files,
          updated_at: new Date().toISOString(),
        })
        .eq("id", board.id);

      setSaveStatus(error ? "unsaved" : "saved");
      if (error) console.error("[Canvas] Save error:", error);
    },
    [board?.id, supabase]
  );

  // ── Debounced auto-save ────────────────────────────────────────────────────
  const handleChange = useCallback(
    (elements, appState, files) => {
      elementsRef.current = elements;
      appStateRef.current = appState;
      filesRef.current = files;
      setSaveStatus("unsaved");

      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        saveToSupabase(elements, appState, files);
      }, SAVE_DEBOUNCE_MS);
    },
    [saveToSupabase]
  );

  // ── Manual save ───────────────────────────────────────────────────────────
  const handleManualSave = useCallback(() => {
    clearTimeout(saveTimer.current);
    saveToSupabase(elementsRef.current, appStateRef.current, filesRef.current);
  }, [saveToSupabase]);

  // ── Rename board ─────────────────────────────────────────────────────────
  const handleNameSave = async () => {
    setEditingName(false);
    const trimmed = boardName.trim() || "Untitled Board";
    setBoardName(trimmed);
    if (trimmed === board.name) return;
    await supabase
      .from("canvas_boards")
      .update({ name: trimmed })
      .eq("id", board.id);
  };

  // Cleanup timer on unmount
  useEffect(() => () => clearTimeout(saveTimer.current), []);

  // ── Parse initial Excalidraw data ─────────────────────────────────────────
  const parseField = (field, fallback) => {
    if (!field) return fallback;
    if (typeof field === "string") {
      try {
        return JSON.parse(field);
      } catch {
        return fallback;
      }
    }
    return field;
  };

  const initialData = {
    elements: parseField(board?.elements, []),
    appState: {
      ...parseField(board?.app_state, {}),
      theme: "dark",
    },
    files: parseField(board?.files, {}),
    scrollToContent: true,
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#161616]">
      {/* ── Floating topbar ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 h-12 bg-[#161616] border-b border-[#2a2a2a] shrink-0 z-20 selection:bg-[#333333]">
        {/* Back */}
        <Link
          href="/"
          className="flex items-center gap-1.5 text-[#737373] hover:text-[#e7e7e7] transition-colors text-xs font-medium group shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Boards
        </Link>

        <div className="w-px h-4 bg-[#333333] shrink-0" />

        {/* Board name (inline edit) */}
        {editingName ? (
          <input
            autoFocus
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            onBlur={handleNameSave}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleNameSave();
              if (e.key === "Escape") {
                setBoardName(board.name);
                setEditingName(false);
              }
            }}
            className="text-sm font-medium text-[#e7e7e7] bg-[#2a2a2a] border border-[#474747] rounded-md px-2 py-0.5 focus:outline-none w-52 min-w-0"
          />
        ) : (
          <button
            onClick={() => setEditingName(true)}
            title="Click to rename"
            className="text-sm font-medium text-[#e7e7e7] hover:text-white transition-colors truncate max-w-xs min-w-0"
          >
            {boardName}
          </button>
        )}

        {/* Project badge */}
        {projectName && (
          <span className="hidden sm:flex items-center gap-1 text-[10px] text-[#737373] bg-[#242424] border border-[#2a2a2a] px-2 py-0.5 rounded-full shrink-0">
            <FolderOpen className="w-2.5 h-2.5" />
            {projectName}
          </span>
        )}

        <div className="flex-1" />

        {/* Save status + save button */}
        <div className="flex items-center gap-3 shrink-0">
          <SaveStatus status={saveStatus} />
          <button
            onClick={handleManualSave}
            className="flex items-center gap-1.5 text-xs font-medium bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#474747] text-[#a3a3a3] hover:text-[#e7e7e7] px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <Save className="w-3 h-3" />
            Save
          </button>
        </div>
      </div>

      {/* ── Excalidraw canvas (fills remaining height) ──────────────────── */}
      <div className="flex-1 relative">
        <ExcalidrawComponent
          initialData={initialData}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
