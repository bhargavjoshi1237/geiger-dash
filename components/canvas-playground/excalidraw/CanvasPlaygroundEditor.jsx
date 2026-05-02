"use client";

import "@excalidraw/excalidraw/index.css";

import { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Save, Check, FolderOpen } from "lucide-react";

// ── Lazy-load Excalidraw (browser-only, no SSR) ──────────────────────────────
const ExcalidrawComponent = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 flex items-center justify-center bg-[#1e1e1e]">
        <div className="flex flex-col items-center gap-3">
          <svg className="w-8 h-8 text-[#474747] animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-[#737373]">Loading canvas…</p>
        </div>
      </div>
    ),
  }
);

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
        Saved locally
      </span>
    );
  return (
    <span className="flex items-center gap-1.5 text-xs text-[#737373]">
      <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] inline-block" />
      Unsaved changes
    </span>
  );
}

// ── Main editor component ─────────────────────────────────────────────────────
export default function CanvasPlaygroundEditor() {
  const [saveStatus, setSaveStatus] = useState("saved");
  const [boardName, setBoardName] = useState("Geiger Canvas Demo");
  
  const saveTimer = useRef(null);

  const handleChange = useCallback((elements, appState, files) => {
    setSaveStatus("unsaved");
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => setSaveStatus("saved"), 1000);
  }, []);

  const handleManualSave = useCallback(() => {
    clearTimeout(saveTimer.current);
    setSaveStatus("saving");
    setTimeout(() => setSaveStatus("saved"), 400);
  }, []);

  useEffect(() => () => clearTimeout(saveTimer.current), []);

  const initialData = {
    elements: [
      {
        id: "rect-suite-container",
        type: "rectangle",
        x: 100,
        y: 100,
        width: 600,
        height: 480,
        angle: 0,
        strokeColor: "#8b5cf6",
        backgroundColor: "transparent",
        fillStyle: "hachure",
        strokeWidth: 2,
        strokeStyle: "solid",
        roughness: 1,
        opacity: 100,
        roundness: { type: 3 }
      },
      {
        id: "text-title",
        type: "text",
        x: 130,
        y: 60,
        width: 290,
        height: 45,
        angle: 0,
        strokeColor: "#a78bfa",
        backgroundColor: "transparent",
        fillStyle: "hachure",
        strokeWidth: 1,
        strokeStyle: "solid",
        roughness: 1,
        opacity: 100,
        text: "Geiger Studio Suite",
        fontSize: 36,
        fontFamily: 1,
        textAlign: "left",
        verticalAlign: "top"
      },
      {
        id: "rect-canvas",
        type: "rectangle",
        x: 150,
        y: 150,
        width: 200,
        height: 150,
        angle: 0,
        strokeColor: "#10b981",
        backgroundColor: "#d1fae5",
        fillStyle: "hachure",
        strokeWidth: 1,
        strokeStyle: "solid",
        roughness: 1,
        opacity: 100,
        roundness: { type: 3 }
      },
      {
        id: "text-canvas",
        type: "text",
        x: 165,
        y: 170,
        width: 170,
        height: 25,
        angle: 0,
        strokeColor: "#059669",
        backgroundColor: "transparent",
        fillStyle: "hachure",
        strokeWidth: 1,
        strokeStyle: "solid",
        roughness: 1,
        opacity: 100,
        text: "Canvas Playground",
        fontSize: 20,
        fontFamily: 1,
        textAlign: "left",
        verticalAlign: "top"
      },
      {
        id: "rect-flow",
        type: "rectangle",
        x: 400,
        y: 150,
        width: 200,
        height: 150,
        angle: 0,
        strokeColor: "#3b82f6",
        backgroundColor: "#dbeafe",
        fillStyle: "hachure",
        strokeWidth: 1,
        strokeStyle: "solid",
        roughness: 1,
        opacity: 100,
        roundness: { type: 3 }
      },
      {
        id: "text-flow",
        type: "text",
        x: 415,
        y: 170,
        width: 150,
        height: 25,
        angle: 0,
        strokeColor: "#2563eb",
        backgroundColor: "transparent",
        fillStyle: "hachure",
        strokeWidth: 1,
        strokeStyle: "solid",
        roughness: 1,
        opacity: 100,
        text: "Flow Playground",
        fontSize: 20,
        fontFamily: 1,
        textAlign: "left",
        verticalAlign: "top"
      },
      {
        id: "rect-notes",
        type: "rectangle",
        x: 150,
        y: 350,
        width: 200,
        height: 150,
        angle: 0,
        strokeColor: "#f59e0b",
        backgroundColor: "#fef3c7",
        fillStyle: "hachure",
        strokeWidth: 1,
        strokeStyle: "solid",
        roughness: 1,
        opacity: 100,
        roundness: { type: 3 }
      },
      {
        id: "text-notes",
        type: "text",
        x: 165,
        y: 370,
        width: 150,
        height: 25,
        angle: 0,
        strokeColor: "#d97706",
        backgroundColor: "transparent",
        fillStyle: "hachure",
        strokeWidth: 1,
        strokeStyle: "solid",
        roughness: 1,
        opacity: 100,
        text: "Notes Playground",
        fontSize: 20,
        fontFamily: 1,
        textAlign: "left",
        verticalAlign: "top"
      },
      {
        id: "rect-assets",
        type: "rectangle",
        x: 400,
        y: 350,
        width: 200,
        height: 150,
        angle: 0,
        strokeColor: "#ef4444",
        backgroundColor: "#fee2e2",
        fillStyle: "hachure",
        strokeWidth: 1,
        strokeStyle: "solid",
        roughness: 1,
        opacity: 100,
        roundness: { type: 3 }
      },
      {
        id: "text-assets",
        type: "text",
        x: 415,
        y: 370,
        width: 160,
        height: 25,
        angle: 0,
        strokeColor: "#dc2626",
        backgroundColor: "transparent",
        fillStyle: "hachure",
        strokeWidth: 1,
        strokeStyle: "solid",
        roughness: 1,
        opacity: 100,
        text: "Assets Playground",
        fontSize: 20,
        fontFamily: 1,
        textAlign: "left",
        verticalAlign: "top"
      }
    ],
    appState: { theme: "dark", zoom: { value: 0.75 } },
    files: {},
    scrollToContent: true,
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-[#161616]">
      <div className="flex-1 relative excalidraw-wrapper">
        <ExcalidrawComponent initialData={initialData} onChange={handleChange} />
      </div>
    </div>
  );
}
