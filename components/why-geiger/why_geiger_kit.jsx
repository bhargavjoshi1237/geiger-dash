import { SUITE_APPS } from "@/components/suite-landing/suite_catalog";

// Shared pieces for the /why-geiger page: the spectrum header, section heads, pills and app chips.

export const FAINT = "text-text-tertiary dark:text-text-secondary";
export const EYEBROW = `font-mono text-[11px] leading-none font-medium tracking-[0.16em] uppercase ${FAINT}`;
export const DISPLAY = "[font-family:var(--font-display)] font-semibold";
export const PANEL = "rounded-[14px] border border-border bg-surface-subtle";

const SKEW = { transform: "skewX(-30deg)" };
const HATCH = "bg-[repeating-linear-gradient(90deg,var(--border-strong)_0_1px,transparent_1px_6px)]";

function EdgeBar() {
  return <div className="min-w-0 flex-[0.5_1_0] rounded-[3px] border border-border bg-surface-card" style={SKEW} />;
}

// The Geiger mark's slanted bars, one per app in hue order; apps still on the way are hatched.
export function SpectrumHeader() {
  return (
    <div aria-hidden="true" className="-mx-10 flex h-[84px] gap-[5px] overflow-hidden px-10 md:h-[132px]">
      <EdgeBar />
      <EdgeBar />
      {SUITE_APPS.map((app) => (
        <div
          key={app.id}
          className={`relative min-w-0 flex-1 rounded-[3px] border border-border ${app.available ? `bg-gradient-to-t ${app.accent.glow} to-transparent` : HATCH}`}
          style={SKEW}
        >
          <span className={`absolute inset-x-0 bottom-0 h-[3px] ${app.accent.dot} ${app.available ? "" : "opacity-40"}`} />
        </div>
      ))}
      <EdgeBar />
      <EdgeBar />
    </div>
  );
}

export function AppChip({ app, className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block h-3.5 w-[7px] shrink-0 rounded-[2px] ${app.available ? app.accent.dot : `border border-border-strong ${HATCH}`} ${className}`}
      style={SKEW}
    />
  );
}

const PILL_DOTS = {
  good: "bg-emerald-500",
  warn: "bg-amber-500",
  off: "bg-border-strong",
};

export function Pill({ tone = "good", children }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2 py-[5px] font-mono text-[11px] leading-none font-medium whitespace-nowrap text-muted-foreground">
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${PILL_DOTS[tone]}`} />
      {children}
    </span>
  );
}

export function SectionHead({ eyebrow, title }) {
  return (
    <div className="mb-[22px] grid items-baseline gap-2.5 md:grid-cols-[180px_1fr] md:gap-6">
      <p className={`${EYEBROW} md:pt-1.5`}>{eyebrow}</p>
      <h2 className={`${DISPLAY} text-2xl leading-[1.15] tracking-[-0.025em] text-balance text-foreground [font-stretch:108%] sm:text-[2rem]`}>
        {title}
      </h2>
    </div>
  );
}

// Supporting paragraph indented to line up with section titles.
export function BodyNote({ children }) {
  return (
    <div className="mt-[18px]">
      <p className="text-center text-[15px] leading-relaxed text-muted-foreground [&_strong]:font-semibold [&_strong]:text-foreground">
        {children}
      </p>
    </div>
  );
}
