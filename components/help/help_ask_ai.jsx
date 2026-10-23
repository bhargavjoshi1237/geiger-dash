"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUp, Loader2, MessageSquareText, Sparkles } from "lucide-react";
import {
  Button,
  Kbd,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Textarea,
  useModifierKeyLabel,
} from "@geiger/ui";
import { askHelpAction } from "@/app/help/actions";

const ASK_EVENT = "help:ask-ai";

// Any trigger on the page opens the one panel, optionally sending a prompt straight away.
function openAskAi(prompt = "") {
  window.dispatchEvent(new CustomEvent(ASK_EVENT, { detail: { prompt } }));
}

export function AskAiButton() {
  const modifierKey = useModifierKeyLabel();
  return (
    <button
      type="button"
      onClick={() => openAskAi()}
      className="hidden h-8 items-center gap-2 rounded-md border border-border bg-surface-card px-3 text-sm font-medium text-muted-foreground transition-colors hover:border-border-strong hover:bg-surface-active hover:text-foreground md:flex"
    >
      <Sparkles className="size-3.5" />
      <span>Ask AI</span>
      <Kbd className="border border-border bg-surface-subtle px-1.5 text-[11px] text-muted-foreground">{modifierKey} I</Kbd>
    </button>
  );
}

export function ExplainMoreButton({ pageTitle }) {
  return (
    <button
      type="button"
      onClick={() => openAskAi(`Explain "${pageTitle}" in more detail.`)}
      className="flex items-center gap-2 text-sm font-medium text-text-secondary transition-colors hover:text-foreground"
    >
      <MessageSquareText className="size-3.5" />
      <span>Explain more</span>
    </button>
  );
}

// Inline `code` and **bold** only; answers are rendered as React text, never as HTML.
function renderInline(text) {
  return text
    .split(/(`[^`]+`|\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part, index) => {
      if (part.length > 2 && part.startsWith("`") && part.endsWith("`")) {
        return (
          <code key={index} className="rounded bg-surface-hover px-1 py-0.5 font-mono text-[0.85em] text-foreground">
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.length > 4 && part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-semibold text-foreground">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
}

function AnswerText({ text }) {
  return String(text || "")
    .split(/\n{2,}/)
    .map((block, index) => {
      const lines = block.split("\n").filter((line) => line.trim());
      if (lines.length && lines.every((line) => /^\s*[-*•]\s+/.test(line))) {
        return (
          <ul key={index} className="list-disc space-y-1 pl-5">
            {lines.map((line, lineIndex) => (
              <li key={lineIndex}>{renderInline(line.replace(/^\s*[-*•]\s+/, ""))}</li>
            ))}
          </ul>
        );
      }
      if (lines.length && lines.every((line) => /^\s*\d+[.)]\s+/.test(line))) {
        return (
          <ol key={index} className="list-decimal space-y-1 pl-5">
            {lines.map((line, lineIndex) => (
              <li key={lineIndex}>{renderInline(line.replace(/^\s*\d+[.)]\s+/, ""))}</li>
            ))}
          </ol>
        );
      }
      return (
        <p key={index} className="whitespace-pre-line">
          {renderInline(block)}
        </p>
      );
    });
}

function Message({ message, signInHref, onNavigate }) {
  if (message.role === "user") {
    return (
      <div className="ml-auto max-w-[85%] rounded-lg bg-surface-active px-3 py-2 text-sm text-foreground">
        {message.content}
      </div>
    );
  }

  if (message.error) {
    return (
      <div className="space-y-3 rounded-lg border border-border bg-surface-subtle px-3 py-2.5 text-sm text-muted-foreground">
        <p>{message.content}</p>
        {message.code === "signin" ? (
          <Button asChild size="sm">
            <Link href={signInHref}>Sign in</Link>
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-3 text-sm leading-6 text-muted-foreground">
      <AnswerText text={message.content} />
      {message.sources?.length ? (
        <div className="space-y-1.5 border-t border-border pt-3">
          <p className="text-xs font-medium uppercase text-text-secondary">Sources</p>
          {message.sources.map((source) => (
            <Link
              key={source.href}
              href={source.href}
              onClick={onNavigate}
              className="block truncate text-sm text-foreground underline-offset-4 hover:underline"
            >
              {source.title}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function HelpAskAi({ pageSlug }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [isPending, startTransition] = useTransition();
  const listRef = useRef(null);

  const send = (text) => {
    const question = String(text || "").trim();
    if (!question || isPending) return;
    const history = messages.filter((message) => !message.error).map(({ role, content }) => ({ role, content }));
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setDraft("");
    startTransition(async () => {
      const result = await askHelpAction({ question, pageSlug, history });
      setMessages((prev) => [
        ...prev,
        result?.ok
          ? { role: "assistant", content: result.answer, sources: result.sources }
          : { role: "assistant", content: result?.error || "Something went wrong.", error: true, code: result?.code },
      ]);
    });
  };

  // Event listeners outlive renders, so they call the latest `send` through a ref.
  const sendRef = useRef(send);
  useEffect(() => {
    sendRef.current = send;
  });

  useEffect(() => {
    const onAsk = (event) => {
      setOpen(true);
      if (event.detail?.prompt) sendRef.current(event.detail.prompt);
    };
    const onKeyDown = (event) => {
      if (event.key?.toLowerCase() !== "i" || !(event.metaKey || event.ctrlKey)) return;
      const target = event.target;
      if (target?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target?.tagName || "")) return;
      event.preventDefault();
      setOpen((value) => !value);
    };
    window.addEventListener(ASK_EVENT, onAsk);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener(ASK_EVENT, onAsk);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages, isPending]);

  const submit = (event) => {
    event.preventDefault();
    send(draft);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-5 py-4">
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="size-4" />
            Ask AI
          </SheetTitle>
          <SheetDescription>Answers come from published Help Center pages and can be incomplete.</SheetDescription>
        </SheetHeader>

        <div ref={listRef} className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          {messages.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Ask how something in Geiger works. You&apos;ll get an answer drawn from the help center, with links to the
              pages it used.
            </p>
          ) : (
            messages.map((message, index) => (
              <Message
                key={index}
                message={message}
                signInHref={`/login?next=${encodeURIComponent(pathname)}`}
                onNavigate={() => setOpen(false)}
              />
            ))
          )}
          {isPending ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" />
              Searching the help center...
            </div>
          ) : null}
        </div>

        <form onSubmit={submit} className="border-t border-border p-3">
          <div className="flex items-end gap-2 rounded-lg border border-border bg-surface-card p-2">
            <Textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) submit(event);
              }}
              rows={2}
              maxLength={1000}
              placeholder="Ask about the Geiger suite..."
              aria-label="Your question"
              className="min-h-0 resize-none border-0 bg-transparent p-1 text-sm shadow-none focus-visible:ring-0 dark:bg-transparent"
            />
            <Button type="submit" size="icon-sm" disabled={!draft.trim() || isPending} aria-label="Send question">
              {isPending ? <Loader2 className="size-3.5 animate-spin" /> : <ArrowUp className="size-3.5" />}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
