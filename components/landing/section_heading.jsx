import { DISPLAY } from "@/components/landing/landing_font";

// Landing section heading: mono eyebrow, leaning display headline, optional supporting line.
export function SectionHeading({ eyebrow, title, description, className = "" }) {
  return (
    <div className={`max-w-3xl ${className}`}>
      <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">{eyebrow}</p>
      <h2 className={`${DISPLAY} mt-4 text-5xl leading-[0.9] text-balance text-foreground sm:text-6xl`}>{title}</h2>
      {description ? (
        <p className="mt-5 max-w-xl text-base leading-relaxed text-text-secondary dark:text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

export default SectionHeading;
