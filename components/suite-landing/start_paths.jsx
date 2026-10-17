import { SUITE_APP_BY_ID } from "@/components/suite-landing/suite_catalog";
import { SectionIntro } from "@/components/suite-landing/section_intro";
// Each audience's usual entry app, then the apps that tend to follow.
const PATHS = [
  { audience: "Event organisers", body: "Meetups, clubs and small conferences that sell tickets and run a door.", apps: ["events", "forms", "campaign"] },
  { audience: "Creative studios", body: "Agencies and product teams who think on a canvas and ship to clients.", apps: ["notes", "flow", "assets"] },
  { audience: "Operations teams", body: "Intake, approvals and tracking for the people who keep a company running.", apps: ["forms", "flow", "grey"] },
  { audience: "Developers", body: "Teams that run APIs, ship content and want their data close.", apps: ["pods", "grey", "content"] },
];

export function StartPaths() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pt-20 sm:px-6 sm:pt-28">
      <SectionIntro
        eyebrow="Start with one app"
        title="Most teams arrive for one job and stay for the second"
        description="Every app works on the same account from day one, so trying the next one takes a click."
      />

      <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {PATHS.map((path) => (
          <div key={path.audience} className="flex min-w-0 flex-col bg-surface-subtle p-6">
            <h3 className="text-lg font-semibold tracking-[-0.01em] text-foreground [font-family:var(--font-display)] [font-stretch:106%]">
              {path.audience}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary dark:text-muted-foreground">{path.body}</p>

            <ol className="relative mt-8 space-y-3 before:absolute before:top-3 before:bottom-3 before:left-[5px] before:w-px before:bg-border-strong">
              {path.apps.map((id, index) => {
                const app = SUITE_APP_BY_ID[id];
                const Icon = app.icon;
                return (
                  <li key={id} className="relative flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className={`relative z-10 h-4 w-[11px] shrink-0 rounded-[2px] ring-4 ring-surface-subtle ${app.accent.dot} ${index === 0 ? "" : "opacity-60"}`}
                      style={{ transform: "skewX(-30deg)" }}
                    />
                    <span className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
                      {index === 0 ? "Start" : "Then"}
                    </span>
                    <a
                      href={app.href}
                      className={`inline-flex items-center gap-1.5 text-sm underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-ring ${index === 0 ? "font-medium text-foreground" : "text-text-secondary dark:text-foreground/80"}`}
                    >
                      <Icon className={`h-3.5 w-3.5 ${app.accent.text}`} />
                      {app.name}
                    </a>
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
}

export default StartPaths;
