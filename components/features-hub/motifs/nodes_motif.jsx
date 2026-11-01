"use client";

import { Clock, Mail, MessageSquare, Plus, Tag, Ticket, Workflow } from "lucide-react";
import { cn } from "@/lib/utils";
import { LINE, Window } from "@/components/product-pages/mock_kit";
import { Button, Field, Input, Select, Status } from "@/components/product-pages/apps/events/events_kit";
import { CANVAS_DOTS } from "@/components/product-pages/plan/plan_kit";
import { useScene } from "@/components/features-hub/motion";
import { Cursor, Fit, Show } from "@/components/features-hub/motifs/motif_kit";

const STEP_TYPES = [
  { label: "Send email", icon: Mail },
  { label: "Send SMS", icon: MessageSquare },
  { label: "Add tag", icon: Tag },
  { label: "Wait / delay", icon: Clock },
];

const BAR_H = 48;
const CARD_X = 26;
const CARD_W = 232;
const TRIGGER_Y = 18;
const EMAIL_Y = 98;
const CARD_H = 56;

const SCENE = [600, 800, 350, 750, 800, 280, 3400];

function StepCard({ kind, title, detail, icon: Icon, y, className }) {
  return (
    <div className={cn("absolute flex items-center gap-2.5 rounded-xl border border-foreground/[0.1] bg-surface-card px-3 shadow-sm shadow-black/10 dark:bg-surface-dialog", className)} style={{ left: CARD_X, top: y, width: CARD_W, height: CARD_H }}>
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-foreground/[0.1] bg-foreground/[0.05] text-foreground/80">
        <Icon className="size-4" strokeWidth={1.75} />
      </span>
      <span className="min-w-0">
        <span className="block text-[11px] text-muted-foreground">{kind}</span>
        <span className="block truncate text-[13px] font-medium">{title}</span>
      </span>
      {detail ? <span className="ml-auto text-[11px] whitespace-nowrap text-muted-foreground">{detail}</span> : null}
    </div>
  );
}

// The workflow builder only: a step is added under the trigger and the workflow is switched on. Nothing shows it running.
export function NodesMotif({ running }) {
  const step = useScene(SCENE, running);
  const menuOpen = step === 2 || step === 3;
  const hasEmail = step >= 4;
  const active = step === 6;
  const plusY = hasEmail ? 170 : 90;
  const canvasCenter = CARD_X + CARD_W / 2;

  const cursor = step <= 2 ? [canvasCenter + 6, BAR_H + 96] : step === 3 ? [canvasCenter - 20, BAR_H + 134] : [430, 26];

  return (
    <Fit>
      <div className="relative h-[330px] w-[480px]">
        <Window className="h-[330px] w-[480px]">
          <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-5", LINE)}>
            <Workflow className="size-4 text-muted-foreground" strokeWidth={1.75} />
            <span className="text-muted-foreground">Workflows</span>
            <span className="text-muted-foreground/60">›</span>
            <span className="truncate font-medium">VIP welcome</span>
            <Status status={active ? "Active" : "Draft"} className="ml-1" />
            <Button className={cn("ml-auto h-7 text-[11px] transition-[scale] duration-150", step === 5 ? "scale-95" : "", active ? "opacity-50" : "")}>Activate</Button>
          </div>
          <div className="flex min-h-0 flex-1">
            <div className="relative w-[284px] shrink-0" style={CANVAS_DOTS}>
              <span className="absolute w-px bg-foreground/25" style={{ left: canvasCenter, top: TRIGGER_Y + CARD_H, height: plusY - TRIGGER_Y - CARD_H, transition: "height 0.5s ease-out" }} />
              <StepCard kind="Trigger" title="Ticket purchased" detail="Full pass" icon={Ticket} y={TRIGGER_Y} />
              <Show when={hasEmail}>
                <StepCard kind="Action" title="Send email" detail="To buyer" icon={Mail} y={EMAIL_Y} className={step === 4 ? "border-foreground/30" : ""} />
              </Show>
              <span
                className={cn("absolute flex size-6 items-center justify-center rounded-full border border-foreground/20 bg-surface-card text-foreground/80 transition-[top,scale] duration-500 dark:bg-surface-dialog", menuOpen ? "scale-110 border-foreground/40" : "")}
                style={{ left: canvasCenter - 12, top: plusY }}
              >
                <Plus className="size-3.5" />
              </span>
              <Show when={menuOpen} className="absolute z-[5]">
                <div className="absolute w-[172px] rounded-xl border border-foreground/[0.1] bg-surface-card p-1 text-[12px] shadow-xl shadow-black/25 dark:bg-surface-dialog" style={{ left: 54, top: 120 }}>
                  {STEP_TYPES.map(({ label, icon: Icon }, index) => (
                    <div key={label} className={cn("flex h-7 items-center gap-2 rounded-md px-2", index === 0 && step === 3 ? "bg-foreground/[0.08] text-foreground" : "text-foreground/80")}>
                      <Icon className="size-3.5 text-muted-foreground" strokeWidth={1.75} />
                      {label}
                    </div>
                  ))}
                </div>
              </Show>
            </div>
            <div className={cn("relative min-w-0 flex-1 border-l", LINE)}>
              <div className={cn("absolute inset-0 flex flex-col gap-3 p-3.5 transition-opacity duration-300", hasEmail ? "opacity-0" : "opacity-100")}>
                <div className="text-[12px] font-medium">Trigger</div>
                <Field label="When">
                  <Select className="text-[11px]">Ticket purchased</Select>
                </Field>
                <Field label="Ticket type">
                  <Select className="text-[11px]">Full pass</Select>
                </Field>
              </div>
              <div className={cn("absolute inset-0 flex flex-col gap-3 p-3.5 transition-opacity duration-300", hasEmail ? "opacity-100" : "opacity-0")}>
                <div className="text-[12px] font-medium">Send email</div>
                <Field label="To">
                  <Select className="text-[11px]">Buyer</Select>
                </Field>
                <Field label="Subject">
                  <Input className="text-[11px]">
                    <span className="truncate">Your Northside pass</span>
                  </Input>
                </Field>
              </div>
            </div>
          </div>
        </Window>
        <Cursor at={cursor} down={step === 2 || step === 5} hidden={step === 0 || active} />
      </div>
    </Fit>
  );
}
