"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, Clipboard } from "lucide-react";

// Copies the rendered article as plain text (e.g. to paste into an AI chat), with its URL.
export function CopyPageButton() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    const article = document.getElementById("help-article");
    if (!article) return;
    try {
      await navigator.clipboard.writeText(`${article.innerText.trim()}\n\nSource: ${window.location.href.split("#")[0]}`);
      setCopied(true);
    } catch {
      toast.error("Couldn't copy the page");
    }
  };

  const Icon = copied ? Check : Clipboard;
  return (
    <button
      type="button"
      onClick={copy}
      className="flex items-center gap-2 text-sm font-medium text-text-secondary transition-colors hover:text-foreground"
    >
      <Icon className="size-3.5" />
      <span>{copied ? "Copied" : "Copy page"}</span>
    </button>
  );
}
