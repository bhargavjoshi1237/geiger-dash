import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PublicHeader } from "@/components/header";
import Footer from "@/components/footer";

export function LegalPage({ eyebrow, title, summary, updated, children }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PublicHeader />
      <main className="mx-auto w-full max-w-5xl px-4 pb-24 pt-28 sm:px-6 sm:pt-36">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Geiger
        </Link>

        <header className="mt-10 border-b border-border pb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
            {summary}
          </p>
          <p className="mt-5 text-xs text-muted-foreground">Last updated: {updated}</p>
        </header>

        <article className="legal-content py-12">{children}</article>
      </main>
      <Footer />
    </div>
  );
}
