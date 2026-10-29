// Shared heading block for landing sections: display headline, optional supporting line and right-hand slot.
export function SectionIntro({ title, description, children }) {
  return (
    <div className="mb-10 flex flex-col gap-6 sm:mb-12 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-2xl">
        <h2 className="text-3xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance text-foreground [font-family:var(--font-display)] [font-stretch:110%] sm:text-[2.6rem]">
          {title}
        </h2>
        {description ? (
          <p className="mt-4 max-w-xl text-base leading-relaxed text-text-secondary dark:text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

export default SectionIntro;
