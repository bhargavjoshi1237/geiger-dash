import { CircleCheck } from "lucide-react";

export const CONTACT_LINK = "font-medium text-foreground underline underline-offset-2 transition-colors hover:text-muted-foreground";
export const CONTACT_HEADING = "text-[2.5rem] leading-[1.05] font-semibold tracking-[-0.035em] text-foreground [font-family:var(--font-display)] [font-stretch:112%] sm:text-5xl";

// Two-column shape shared by the sales and support pages: pitch on the left, form on the right.
export function ContactSplit({ title, points, note, children }) {
  return (
    <div className="grid gap-12 lg:grid-cols-2 lg:gap-0">
      <div className="lg:pr-12">
        <h1 className={CONTACT_HEADING}>{title}</h1>
        <ul className="mt-8 space-y-3">
          {points.map((point) => (
            <li key={point} className="flex items-center gap-3 text-[17px] text-foreground/85">
              <CircleCheck className="size-[18px] shrink-0 fill-foreground text-background" aria-hidden="true" />
              {point}
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm leading-6 text-muted-foreground">{note}</p>
      </div>

      <div className="lg:border-l lg:border-border lg:pl-8">
        <h2 className="text-lg font-medium text-foreground">Tell us how we can help</h2>
        {children}
      </div>
    </div>
  );
}

// Off-screen field real visitors never reach; the action ignores anything that fills it.
export function HoneypotField() {
  return (
    <input
      type="text"
      name="website"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      className="absolute -left-[9999px] h-px w-px opacity-0"
    />
  );
}

export function ContactSent() {
  return (
    <div className="mt-6 rounded-[14px] border border-border bg-surface-subtle p-6" role="status">
      <p className="text-base font-semibold text-foreground">Message received</p>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">
        Thanks for reaching out. Someone from our team will get back to you within one business day.
      </p>
    </div>
  );
}

export function ContactError({ children }) {
  return (
    <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">
      {children}
    </p>
  );
}
