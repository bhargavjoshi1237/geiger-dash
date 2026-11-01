import { LogoLoading } from "@geiger/ui/logo-loading";
import { SUITE_APP_BY_ID } from "@/components/landing/suite_apps";
import { seededRandom } from "@/components/features-hub/random";
import styles from "@/components/features-hub/features_hub.module.css";

// Measured from linear.app/features: row 2 is one tile short, so its 20s loop runs at 42px/s against 32 and 40; apps repeat across rows.
const ROWS = [
  { duration: 30, start: "0%", apps: ["events", "notes", "flow", "forms", "campaign", "pods", "grey", "comms"] },
  { duration: 20, start: "10%", apps: ["content", "property", "content", "docs", "assets", "notes", "events"] },
  { duration: 30, start: "5%", apps: ["comms", "campaign", "grey", "pods", "property", "forms", "docs", "notes"] },
  { duration: 24, start: "15%", apps: ["assets", "comms", "events", "content", "docs", "comms", "grey", "flow"] },
];

const COPIES = 4;

// The suite's apps tile the rows; the Geiger mark blurs in over them, then the headline word by word.
export function FeaturesHero({ title, description }) {
  const random = seededRandom("features-hero");
  // Every tile in every copy draws its own delay, so the rows scatter in instead of repeating a pattern.
  const rows = ROWS.map((row) => ({
    ...row,
    copies: Array.from({ length: COPIES }, () =>
      row.apps.map((id) => ({ app: SUITE_APP_BY_ID[id], delay: Math.round(random() * 2000) + 400 })),
    ),
  }));
  const words = title.split(" ");

  return (
    <section className="mx-auto w-full max-w-5xl md:px-6">
      <div aria-hidden="true" className={`relative flex flex-col gap-[18px] overflow-hidden select-none md:gap-6 ${styles.heroRows}`}>
        {/* m-auto shrinks each row to its copies, pinning them to the left edge so they drift from there. */}
        {rows.map((row) => (
          <div key={row.start} className="m-auto flex items-center justify-center overflow-hidden">
            {row.copies.map((tiles, copy) => (
              <div key={copy} className={`flex shrink-0 items-center ${styles.track}`} style={{ "--duration": `${row.duration}s`, "--start": row.start }}>
                {tiles.map(({ app, delay }, index) => {
                  const Icon = app.icon;
                  return (
                    <div key={index} className={`mr-[18px] flex md:mr-6 ${styles.fadeIn}`} style={{ "--delay": `${delay}ms` }}>
                      <span className="flex size-14 items-center justify-center rounded-[14px] border border-border bg-surface-subtle bg-linear-to-b from-foreground/[0.05] to-transparent md:size-24 md:rounded-[24px]">
                        <Icon className="size-[26px] text-muted-foreground md:size-8" strokeWidth={1.6} />
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ))}

        <div className={`absolute inset-0 m-auto size-[72px] sm:size-[120px] ${styles.markHalo} ${styles.heroMark} ${styles.iconEnter}`} style={{ "--delay": "1s" }}>
          <span className={`absolute inset-3 rounded-[24px] bg-foreground sm:inset-5 ${styles.markGlow}`} />
          <span className="relative flex size-full items-center justify-center rounded-[18px] border border-border bg-surface-card bg-linear-to-b from-foreground/[0.06] to-transparent shadow-2xl shadow-black/20 sm:rounded-[28px]">
            <LogoLoading size={70} aria-hidden="true" className="text-foreground [&_svg]:size-10 sm:[&_svg]:size-[70px] -mt-0.5" />
          </span>
        </div>
      </div>

      <hgroup className="mx-auto max-w-3xl px-4 text-center">
        <h1 className="text-[2.6rem] leading-[1.05] font-semibold tracking-[-0.04em] text-balance text-foreground sm:text-[4rem] sm:leading-[1.06]">
          {words.map((word, index) => (
            <span key={index}>
              <span className={`inline-block ${styles.blurIn}`} style={{ "--delay": `${1 + index * 0.04}s` }}>
                {word}
              </span>
              {index < words.length - 1 ? " " : null}
            </span>
          ))}
        </h1>
        <p className={`mx-auto mt-5 max-w-md text-base sm:mt-[15px] leading-7 text-balance text-muted-foreground sm:text-[1.0625rem] sm:leading-[1.6] ${styles.blurIn}`} style={{ "--delay": "1.6s" }}>
          {description}
        </p>
      </hgroup>
    </section>
  );
}
