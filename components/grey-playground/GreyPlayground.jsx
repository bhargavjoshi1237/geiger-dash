"use client";

import { useMemo, useRef, useState } from "react";
import { MousePointer2, Waypoints } from "lucide-react";
import { cn } from "@/lib/utils";
import { AskGrey } from "./AskGrey";
import { KnowledgeConstellation } from "./KnowledgeConstellation";
import { ENTITY_TYPES, LINKS, NODES, answerFor, entityAnswer } from "./knowledge-data";

const GLASS = "border border-border bg-background/80 backdrop-blur-xl";

// The legend's copy of the canvas glyphs, so a shape reads the same in both places.
function TypeGlyph({ shape }) {
  return (
    <svg viewBox="0 0 10 10" className="h-2.5 w-2.5 shrink-0 text-foreground" aria-hidden="true">
      {shape === "square" ? <rect x="1.5" y="1.5" width="7" height="7" rx="1.4" fill="currentColor" /> : null}
      {shape === "diamond" ? <path d="M5 0.6 9.4 5 5 9.4 0.6 5Z" fill="currentColor" /> : null}
      {shape === "triangle" ? <path d="M5 1 9.2 8.6H0.8Z" fill="currentColor" /> : null}
      {shape === "ring" ? <circle cx="5" cy="5" r="3.3" fill="none" stroke="currentColor" strokeWidth="1.8" /> : null}
      {shape === "circle" ? <circle cx="5" cy="5" r="4" fill="currentColor" /> : null}
    </svg>
  );
}

// The Grey stage: the knowledge graph fills the frame, with the type legend on top and the ask bar along the bottom.
export default function GreyPlayground() {
  const pulsesRef = useRef([]);
  const [answer, setAnswer] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [typeFilter, setTypeFilter] = useState(null);
  const [touched, setTouched] = useState(false);

  // A legend filter wins over the answer, so clicking a type always shows something.
  const focusIds = useMemo(() => {
    if (typeFilter) return NODES.filter((node) => node.type === typeFilter).map((node) => node.id);
    return answer?.focus?.length ? answer.focus : null;
  }, [typeFilter, answer]);

  const pulse = (id) => pulsesRef.current.push({ id, start: performance.now() });

  const show = (next) => {
    setTypeFilter(null);
    setTouched(true);
    setAnswer({ ...next, key: crypto.randomUUID() });
  };

  const ask = (text) => {
    const next = answerFor(text);
    if (!next) return;
    setSelectedId(null);
    show(next);
  };

  const selectNode = (id) => {
    if (!id) {
      setSelectedId(null);
      setTypeFilter(null);
      return;
    }
    setSelectedId(id);
    show(entityAnswer(id));
  };

  const focusSource = (id) => {
    setSelectedId(id);
    pulse(id);
  };

  return (
    <div className="relative h-full overflow-hidden bg-background">
      {/* The same top glow /pallet uses. */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-full max-w-lg -translate-x-1/2 blur-[100px] dark:bg-white/5" />

      <KnowledgeConstellation
        className="absolute inset-0"
        focusIds={focusIds}
        selectedId={selectedId}
        pulsesRef={pulsesRef}
        onSelect={selectNode}
        onInteract={() => setTouched(true)}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3 sm:p-4">
        <div className={cn("pointer-events-auto flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-xs shadow-sm", GLASS)}>
          <span className="grid h-6 w-6 place-items-center rounded-full border border-border bg-surface-hover text-foreground">
            <Waypoints className="h-3.5 w-3.5" />
          </span>
          <span className="font-medium text-foreground">Kestrel Aero</span>
          <span className="hidden text-muted-foreground sm:inline">
            {NODES.length} entities · {LINKS.length} links
          </span>
        </div>

        <div className="pointer-events-auto hidden max-w-[60%] flex-wrap justify-end gap-1.5 sm:flex">
          {ENTITY_TYPES.map((type) => (
            <button
              key={type.id}
              type="button"
              aria-pressed={typeFilter === type.id}
              onClick={() => setTypeFilter((current) => (current === type.id ? null : type.id))}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] transition-colors",
                GLASS,
                typeFilter === type.id ? "border-border-strong text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <TypeGlyph shape={type.shape} />
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-14 flex justify-center transition-opacity duration-500 sm:top-16",
          touched ? "opacity-0" : "opacity-100",
        )}
      >
        <span className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] text-muted-foreground">
          <MousePointer2 className="h-3 w-3" /> Drag to spin · click any node
        </span>
      </div>

      <AskGrey answer={answer} onAsk={ask} onClose={() => setAnswer(null)} onCite={pulse} onSourceClick={focusSource} />
    </div>
  );
}
