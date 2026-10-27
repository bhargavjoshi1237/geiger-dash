import { Logo } from "@geiger/ui";
import { SUITE_APPS } from "@/components/landing/suite_apps";
import { seededRandom } from "@/components/features-hub/random";
import styles from "@/components/features-hub/features_hub.module.css";

// Linear's features hero: four rows of app tiles drifting at their own pace, offset so no two line up.
const ROWS = [
  { duration: 30, start: "0%", offset: 0 },
  { duration: 20, start: "10%", offset: 4 },
  { duration: 30, start: "5%", offset: 8 },
  { duration: 24, start: "15%", offset: 2 },
];

const TILES_PER_ROW = 8;

// The suite's apps tile the rows; the Geiger mark blurs in over them, then the headline word by word.
export function FeaturesHero({ title, description }) {
  const random = seededRandom("features-hero");
  const rows = ROWS.map((row) => ({
    ...row,
    apps: Array.from({ length: TILES_PER_ROW }, (_, index) => ({
      app: SUITE_APPS[(row.offset + index) % SUITE_APPS.length],
      delay: Math.round(random() * 2000) + 400,
    })),
  }));
  const words = title.split(" ");

  return (
    <section className="mx-auto w-full max-w-5xl">
      <div aria-hidden="true" className={`relative flex flex-col gap-[18px] overflow-hidden select-none sm:gap-6 ${styles.heroRows}`}>
        {rows.map((row) => (
          <div key={row.start} className="flex justify-center overflow-hidden">
            {[0, 1, 2, 3].map((copy) => (
              <div key={copy} className={`flex shrink-0 items-center ${styles.track}`} style={{ "--duration": `${row.duration}s`, "--start": row.start }}>
                {row.apps.map(({ app, delay }, index) => {
                  const Icon = app.icon;
                  return (
                    <div key={index} className={`mr-[18px] flex sm:mr-6 ${styles.fadeIn}`} style={{ "--delay": `${delay}ms` }}>
                      <span className="flex size-14 items-center justify-center rounded-[14px] border border-border bg-surface-subtle bg-linear-to-b from-foreground/[0.05] to-transparent sm:size-24 sm:rounded-[24px]">
                        <Icon className="size-[26px] text-muted-foreground sm:size-8" strokeWidth={1.6} />
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ))}

        <div className={`absolute inset-0 m-auto size-[72px] sm:size-[120px] ${styles.markHalo} ${styles.iconEnter}`} style={{ "--delay": "1s" }}>
          <span className={`absolute inset-3 rounded-[24px] bg-foreground sm:inset-5 ${styles.markGlow}`} />
          <span className="relative flex size-full items-center justify-center rounded-[18px] border border-border bg-surface-card bg-linear-to-b from-foreground/[0.06] to-transparent shadow-2xl shadow-black/20 sm:rounded-[28px]">
            <Logo className="size-10 text-foreground sm:size-[60px]" />
          </span>
        </div>
      </div>

      <hgroup className="mx-auto mt-6 max-w-3xl px-4 text-center sm:mt-2">
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
        <p className={`mx-auto mt-5 max-w-md text-base leading-7 text-balance text-muted-foreground sm:text-[1.0625rem] sm:leading-[1.6] ${styles.blurIn}`} style={{ "--delay": "1.6s" }}>
          {description}
        </p>
      </hgroup>
    </section>
  );
}
