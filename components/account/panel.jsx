import { cn } from "@/lib/utils";

// The account-surface rhythm: a small uppercase label over a bordered card.
// Shared by /billing, /profile, and /org/[id]/usage so they read as one app.
export function Section({ title, action, children, className }) {
  return (
    <section className={className}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

// A titled settings block: heading and description, a body (padded, or flush for edge-to-edge rows) and an optional action footer.
export function SettingsBlock({ title, description, action, footer, flush = false, tone, children, className }) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border bg-surface-card",
        tone === "danger" ? "border-red-500/30" : "border-border",
        className,
      )}
    >
      <header className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5 sm:px-6">
        <div className="min-w-0">
          <h2 className="text-[15px] font-semibold tracking-tight text-foreground">{title}</h2>
          {description ? <p className="mt-1 max-w-xl text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {action}
      </header>
      {children ? (
        <div className={flush ? "mt-4 divide-y divide-border border-t border-border" : "px-5 pt-4 pb-5 sm:px-6"}>{children}</div>
      ) : (
        <div className="pb-5" />
      )}
      {footer ? (
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-surface-subtle px-5 py-3 text-xs text-muted-foreground sm:px-6">
          {footer}
        </footer>
      ) : null}
    </section>
  );
}

export function Card({ children, className }) {
  return (
    <div className={cn("rounded-2xl border border-border bg-surface-card", className)}>{children}</div>
  );
}
