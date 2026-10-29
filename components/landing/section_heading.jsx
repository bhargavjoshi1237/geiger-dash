import { DISPLAY } from "@/components/landing/landing_font";

// Landing section heading: leaning display headline, optional supporting line.
export function SectionHeading({ title, description, className = "" }) {
  return (
    <div className={`max-w-3xl ${className}`}>
      <h2 className={`${DISPLAY} text-5xl leading-[0.9] text-balance text-foreground sm:text-6xl`}>{title}</h2>
      {description ? (
        <p className="mt-5 max-w-xl text-base leading-relaxed text-text-secondary dark:text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

export default SectionHeading;
