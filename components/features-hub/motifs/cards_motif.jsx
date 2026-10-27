import { Award, Copy, Nfc } from "lucide-react";
import { Fit } from "@/components/features-hub/motion";
import { Lines, QrGlyph } from "@/components/features-hub/motifs/motif_kit";
import styles from "@/components/features-hub/features_hub.module.css";

const CARD = "absolute inset-0 m-auto h-[150px] w-[250px] overflow-hidden rounded-2xl border border-border bg-surface-card shadow-xl shadow-black/10";

// Two notches punched where the stub tears off.
const TICKET_MASK =
  "radial-gradient(circle at calc(100% - 64px) 0, transparent 9px, #000 9.5px) top / 100% 51% no-repeat, radial-gradient(circle at calc(100% - 64px) 100%, transparent 9px, #000 9.5px) bottom / 100% 51% no-repeat";

function Shine() {
  return (
    <span className={`pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-linear-to-r from-transparent via-foreground/[0.07] to-transparent ${styles.shine}`} />
  );
}

function TicketFace() {
  return (
    <div className="flex h-full" style={{ mask: TICKET_MASK, WebkitMask: TICKET_MASK }}>
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.2em] text-(--ink) uppercase">Admit one</p>
          <p className="mt-1.5 text-sm font-semibold text-foreground">Summer Sessions</p>
          <p className="text-[11px] text-muted-foreground">Fri 14 Aug · 7:00 PM</p>
        </div>
        <div className="flex gap-4 font-mono text-[10px] text-text-tertiary">
          <span>SEC B</span>
          <span>ROW 4</span>
          <span>SEAT 12</span>
        </div>
      </div>
      <div className="flex w-16 items-center justify-center border-l-2 border-dashed border-border bg-(--ink)/10">
        <span className="rotate-180 font-mono text-[11px] font-semibold tracking-[0.18em] text-foreground [writing-mode:vertical-rl]">$48.00</span>
      </div>
    </div>
  );
}

function PassFace({ seed }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between bg-(--ink) px-4 py-2 text-[11px] font-semibold text-(--ink-fg)">
        <span>Geiger Events</span>
        <Nfc className="size-3.5" />
      </div>
      <div className="flex flex-1 items-center justify-between gap-3 px-4">
        <div>
          <p className="text-[10px] tracking-[0.16em] text-muted-foreground uppercase">Attendee</p>
          <p className="text-sm font-semibold text-foreground">Maya Rodrigues</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Gate C · Doors 6:30</p>
        </div>
        <QrGlyph seed={seed} className="size-16 rounded-md bg-foreground p-1 text-background" />
      </div>
    </div>
  );
}

function MembershipFace() {
  return (
    <div className="flex h-full flex-col justify-between bg-linear-to-br from-(--ink)/30 via-(--ink)/8 to-transparent p-4">
      <div className="flex items-start justify-between">
        <span className="h-6 w-8 rounded-md bg-linear-to-br from-foreground/45 to-foreground/15" />
        <span className="rounded-full border border-(--ink)/40 bg-(--ink)/15 px-2 py-0.5 text-[10px] font-medium text-foreground">Gold</span>
      </div>
      <div>
        <p className="font-mono text-xs tracking-[0.22em] text-foreground">•••• 2048</p>
        <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Member since 2024</span>
          <span className="flex items-center gap-1.5">
            <svg viewBox="0 0 20 20" className="size-4 -rotate-90">
              <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2.5" />
              <circle cx="10" cy="10" r="8" fill="none" stroke="var(--ink)" strokeWidth="2.5" pathLength="100" strokeDasharray="100" className={styles.renew} />
            </svg>
            Renews monthly
          </span>
        </div>
      </div>
    </div>
  );
}

function CertificateFace() {
  return (
    <div className="m-1.5 flex h-[calc(100%-12px)] flex-col items-center justify-center rounded-xl border border-(--ink)/30 text-center">
      <p className="font-mono text-[9px] tracking-[0.24em] text-muted-foreground uppercase">Certificate of attendance</p>
      <p className="mt-1.5 text-sm font-semibold text-foreground">Clinical Practice Summit</p>
      <Lines widths={["120px", "84px"]} className="mt-2.5 flex flex-col items-center" />
      <span className={`absolute right-3 bottom-3 flex size-11 items-center justify-center rounded-full bg-(--ink) text-(--ink-fg) shadow-lg ${styles.stamp}`}>
        <Award className="size-5" />
      </span>
      <span className="absolute bottom-3 left-4 font-mono text-[11px] font-semibold text-(--ink)">4.0 CEU</span>
    </div>
  );
}

function TemplateFace() {
  return (
    <div className="flex h-full flex-col p-3">
      <div className="h-12 rounded-lg bg-linear-to-br from-(--ink)/40 to-(--ink)/10" />
      <p className="mt-2.5 text-xs font-semibold text-foreground">Quarterly Meetup</p>
      <Lines widths={["70%", "45%"]} className="mt-1.5" />
    </div>
  );
}

const FACES = {
  ticket: TicketFace,
  pass: PassFace,
  membership: MembershipFace,
  certificate: CertificateFace,
  template: TemplateFace,
};

// A fanned stack of tickets, passes or cards: the front one floats and catches the light, the
// back two spread wider on hover. Templates clone copies out of the stack instead.
export function CardsMotif({ variant, seed }) {
  const Face = FACES[variant] || TicketFace;
  const isTemplate = variant === "template";
  const isPass = variant === "pass";

  return (
    <Fit width={440} height={250}>
      {isTemplate ? (
        [
          { tx: "-118px", ty: "18px", d: "0s" },
          { tx: "118px", ty: "18px", d: "0.25s" },
        ].map((clone) => (
          <div
            key={clone.tx}
            className={`${CARD} scale-[0.82] ${styles.cloneOut}`}
            style={{ "--tx": clone.tx, "--ty": clone.ty, "--d": clone.d }}
          >
            <Face seed={seed} />
          </div>
        ))
      ) : (
        <>
          <div className={`${CARD} -translate-x-9 translate-y-3 -rotate-[9deg] opacity-60 transition-all duration-500 group-hover:-translate-x-16 group-hover:-rotate-[14deg]`} />
          <div className={`${CARD} translate-x-9 translate-y-2 rotate-[7deg] opacity-80 transition-all duration-500 group-hover:translate-x-16 group-hover:rotate-[12deg]`} />
        </>
      )}
      <div className={`${CARD} ${isPass ? styles.passRise : styles.floatY}`}>
        <Face seed={seed} />
        <Shine />
      </div>
      {isTemplate ? (
        <span className="absolute bottom-1 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-border bg-surface-card px-2.5 py-1 text-[11px] text-muted-foreground shadow-sm">
          <Copy className="size-3 text-(--ink)" /> Duplicated in one click
        </span>
      ) : null}
    </Fit>
  );
}
