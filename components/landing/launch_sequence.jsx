import { SUITE_APP_BY_ID } from "@/components/landing/suite_apps";
import { SectionHeading } from "@/components/landing/section_heading";

// One product launch in order, each step handled by the app built for it.
const STEPS = [
  { when: "4 weeks out", app: "notes", body: "Sketch the run of show on one board, with the whole team on it at once." },
  { when: "3 weeks out", app: "flow", body: "Turn the board into issues with owners, a cycle and a due date." },
  { when: "2 weeks out", app: "assets", body: "Get the poster and speaker photos approved, then share one link." },
  { when: "Launch week", app: "campaign", body: "Send the announcement to the right segment and watch the opens arrive." },
  { when: "On the night", app: "events", body: "Sell the last tickets and scan everyone in at the door." },
  { when: "Next morning", app: "forms", body: "Send the feedback form while the night is still fresh." },
];

export function LaunchSequence() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading
        eyebrow="One launch, six apps"
        title="Take a launch from first sketch to the door."
        description="The same people, files and sign-in carry through every step. Nobody exports a spreadsheet to hand work to the next tool."
      />

      <ol className="mt-14 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-6">
        {STEPS.map((step) => {
          const app = SUITE_APP_BY_ID[step.app];
          const Icon = app.icon;
          return (
            <li key={step.app} className="relative border-t border-border pt-6">
              <span aria-hidden="true" className={`absolute -top-[5px] left-0 h-2.5 w-6 -skew-x-[24deg] ${app.accent.dot}`} />
              <p className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">{step.when}</p>
              <a
                href={app.href}
                className="mt-3 inline-flex items-center gap-2 text-base font-medium text-foreground underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-ring"
              >
                <Icon className={`h-4 w-4 ${app.accent.text}`} />
                {app.name}
              </a>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary dark:text-muted-foreground">{step.body}</p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default LaunchSequence;
