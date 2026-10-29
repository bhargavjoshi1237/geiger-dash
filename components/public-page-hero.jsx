import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function PublicPageHero({
  title,
  description,
  titleClassName,
  descriptionClassName,
}) {
  return (
    <>
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Geiger
      </Link>

      <header className="mt-10 border-b border-border/70 pb-10 sm:mt-12 sm:pb-12">
        <h1
          className={cn(
            "max-w-4xl text-4xl font-semibold tracking-[-0.045em] sm:text-6xl",
            titleClassName
          )}
        >
          {title}
        </h1>
        <p
          className={cn(
            "mt-6 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base",
            descriptionClassName
          )}
        >
          {description}
        </p>
      </header>
    </>
  );
}
