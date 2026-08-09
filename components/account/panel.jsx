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

export function Card({ children, className }) {
  return (
    <div className={cn("rounded-2xl border border-border bg-surface-card", className)}>{children}</div>
  );
}
