"use client";

import { useEffect, useEffectEvent, useMemo, useState } from "react";
import { ArrowUp, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NODE_BY_ID, QUESTIONS, tokenize } from "./knowledge-data";

const GLASS = "border border-border bg-background/85 shadow-xl backdrop-blur-xl";

function Cite({ n, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Source ${n}`}
      className="mx-0.5 inline-flex h-4 min-w-4 -translate-y-px items-center justify-center rounded-[4px] bg-foreground/[0.09] px-1 align-middle font-mono text-[10px] leading-none text-foreground/80 transition-colors hover:bg-foreground hover:text-background"
    >
      {n}
    </button>
  );
}

// One answer, streamed a word at a time; each citation pings its source in the graph as it lands.
function AnswerCard({ answer, onClose, onCite, onSourceClick }) {
  const tokens = useMemo(() => tokenize(answer.text), [answer.text]);
  const [revealed, setRevealed] = useState(0);
  const citeLanded = useEffectEvent((n) => {
    const id = answer.sources[n - 1];
    if (id) onCite(id);
  });

  useEffect(() => {
    let shown = 0;
    const timer = setInterval(() => {
      shown += 1;
      const token = tokens[shown - 1];
      if (token?.cite) citeLanded(token.cite);
      setRevealed(shown);
      if (shown >= tokens.length) clearInterval(timer);
    }, 34);
    return () => clearInterval(timer);
  }, [tokens]);

  const visible = tokens.slice(0, revealed);
  const cited = Math.max(0, ...visible.map((token) => token.cite || 0));
  const streaming = revealed < tokens.length;

  return (
    <div className={cn("pointer-events-auto mx-auto w-full max-w-xl overflow-hidden rounded-2xl", GLASS)}>
      <div className="flex items-center gap-2 border-b border-border py-1.5 pl-3.5 pr-1.5">
        <Sparkles className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <p className="min-w-0 flex-1 truncate text-xs text-muted-foreground">{answer.prompt}</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close answer"
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <p className="max-h-24 overflow-y-auto px-3.5 py-2.5 text-[13px] leading-relaxed text-foreground sm:max-h-32 sm:text-sm" aria-live="polite">
        {visible.map((token, index) =>
          token.cite ? (
            <Cite key={index} n={token.cite} onClick={() => onSourceClick(answer.sources[token.cite - 1])} />
          ) : (
            <span key={index}>{token.word}</span>
          ),
        )}
        {streaming ? <span className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 animate-pulse rounded-sm bg-foreground/60" /> : null}
      </p>

      {cited ? (
        <div className="flex gap-1.5 overflow-x-auto border-t border-border px-3.5 py-2 [scrollbar-width:none]">
          {answer.sources.slice(0, cited).map((id, index) => {
            const source = NODE_BY_ID[id];
            return (
              <button
                key={id}
                type="button"
                onClick={() => onSourceClick(id)}
                className="flex shrink-0 items-center gap-1.5 rounded-md border border-border bg-surface-subtle px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
              >
                <span className="font-mono text-[10px] text-foreground/80">{index + 1}</span>
                <span className="max-w-44 truncate text-foreground/90">{source.label}</span>
                <span className="text-text-tertiary">{source.where}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

// The bottom of the stage: the current answer, suggested questions and the ask bar.
export function AskGrey({ answer, onAsk, onClose, onCite, onSourceClick }) {
  const [draft, setDraft] = useState("");

  const submit = (event) => {
    event.preventDefault();
    if (!draft.trim()) return;
    onAsk(draft);
    setDraft("");
  };

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-2.5 p-3 sm:p-4">
      {answer ? <AnswerCard key={answer.key} answer={answer} onClose={onClose} onCite={onCite} onSourceClick={onSourceClick} /> : null}

      <div className="pointer-events-auto -mx-3 flex gap-2 overflow-x-auto px-3 [scrollbar-width:none] sm:mx-auto sm:max-w-xl sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0">
        {QUESTIONS.map((question) => (
          <button
            key={question.id}
            type="button"
            onClick={() => onAsk(question.prompt)}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-xs transition-colors",
              GLASS,
              "shadow-sm",
              answer?.id === question.id ? "border-border-strong text-foreground" : "text-muted-foreground hover:border-border-strong hover:text-foreground",
            )}
          >
            {question.prompt}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className={cn("pointer-events-auto mx-auto flex w-full max-w-xl items-center gap-2 rounded-full py-1.5 pl-4 pr-1.5 focus-within:border-border-strong", GLASS)}>
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Ask about Kestrel Aero…"
          aria-label="Ask Grey a question"
          maxLength={160}
          className="h-8 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-text-tertiary"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          aria-label="Ask Grey"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-opacity hover:bg-primary/90 disabled:opacity-40"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
