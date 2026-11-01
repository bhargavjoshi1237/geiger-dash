"use client";

import { Check, IdCard, Lock, ShieldCheck, TicketPercent, UserRoundCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dot, LINE, Typed, Window } from "@/components/product-pages/mock_kit";
import { Button, EVENT, Field, Input, Select } from "@/components/product-pages/apps/events/events_kit";
import { useScene } from "@/components/features-hub/motion";
import { Cursor, Expand, Fit, Show } from "@/components/features-hub/motifs/motif_kit";

const RULE_SCENE = [700, 900, 900, 900, 900, 800, 3200];

// The kit's Toggle is a still; this one slides, because flipping it is the moment here.
function Switch({ on }) {
  return (
    <span className={cn("flex h-[18px] w-8 shrink-0 items-center rounded-full p-0.5 transition-colors duration-300", on ? "bg-foreground" : "bg-foreground/15")}>
      <span className={cn("size-[14px] rounded-full bg-background transition-transform duration-300", on && "translate-x-[14px]")} />
    </span>
  );
}

function RuleRow({ icon: Icon, title, body, on }) {
  return (
    <div className={cn("flex items-center gap-3 border-b px-5 py-2.5", LINE)}>
      <Icon className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
      <div className="min-w-0 flex-1">
        <div className="text-foreground/90">{title}</div>
        <div className="truncate text-[11px] text-muted-foreground">{body}</div>
      </div>
      <Switch on={on} />
    </div>
  );
}

// Anti-scalping: the rule's protections are switched on one at a time, then it's saved to reuse on any event.
function Rule({ running }) {
  const step = useScene(RULE_SCENE, running);
  const saved = step === 6;
  const cursors = { 1: [434, 76], 2: [434, 128], 3: [150, 216], 4: [262, 216], 5: [432, 26] };

  return (
    <div className="relative h-[330px] w-[480px]">
      <Window
        title="Anti-scalping & Resale"
        icon={ShieldCheck}
        className="h-[330px] w-[480px]"
        actions={
          <Button className="h-7 px-2.5 text-[11px]" icon={saved ? Check : undefined}>
            {saved ? "Saved" : "Save"}
          </Button>
        }
      >
        <RuleRow icon={UserRoundCheck} title="Require name lock" body="Each ticket is tied to the buyer's name." on={step >= 1} />
        <RuleRow icon={IdCard} title="ID check at entry" body="Staff verify a matching ID when admitting the holder." on={step >= 2} />
        <div className="grid grid-cols-[1.3fr_1fr_1fr] gap-3 px-5 pt-3.5">
          <Field label="Transfer policy">
            <Select className="transition-colors duration-300">{step >= 3 ? "Organizer approval" : "No transfers"}</Select>
          </Field>
          <Field label="Resale price cap">
            <Select>{step >= 4 ? "Face value" : "No cap"}</Select>
          </Field>
          <Field label="Max per buyer">
            <Input className="tabular-nums">
              {step >= 4 ? 4 : 0}
              <span className="ml-auto text-[11px] text-muted-foreground">tickets</span>
            </Input>
          </Field>
        </div>
        <Show when={saved} className={cn("mx-5 mt-3.5 flex items-center gap-2 rounded-lg border px-3 py-2 text-[12px] text-muted-foreground", LINE)}>
          <Dot tone="emerald" />
          <span className="text-foreground/90">Rule saved</span>· Enable it on any event
        </Show>
      </Window>
      <Cursor at={cursors[step] ?? [430, 300]} down={false} hidden={!cursors[step]} />
    </div>
  );
}

const CODE_SCENE = [800, 1300, 800, 260, 3400];

const CODES = [
  { name: "ALUMNI10", type: "Coupon", details: "10% off" },
  { name: "SPEAKER26", type: "Coupon", details: "$140 off · max 1" },
  { name: "BRIGHTLOOP", type: "Affiliate code", details: "Brightloop" },
];

// Discounts: the buyer types a code at checkout, applies it, and the discount line lands as the total drops.
function Code({ running }) {
  const step = useScene(CODE_SCENE, running);
  const applied = step === 4;

  return (
    <div className="relative flex h-[330px] w-[480px] items-start gap-3">
      <Window className="w-[290px] shrink-0">
        <div className={cn("flex h-11 items-center gap-2 border-b px-4", LINE)}>
          <TicketPercent className="size-4 text-muted-foreground" strokeWidth={1.75} />
          <span className="font-medium">Checkout</span>
          <span className="ml-auto truncate text-[11px] text-muted-foreground">{EVENT.short}</span>
        </div>
        <div className="flex flex-col gap-3 px-4 py-3.5 text-[12px]">
          <div className="flex justify-between">
            <span className="text-muted-foreground">2 × Full pass</span>
            <span className="tabular-nums text-foreground/85">$640.00</span>
          </div>
          <Field label="Discount code">
            <div className="flex gap-2">
              <Input className={cn("flex-1 font-mono tracking-wide transition-colors duration-300", step === 1 && "border-foreground/30", applied && "border-emerald-500/40")}>
                {step === 1 ? <Typed text="ALUMNI10" delay={0} duration={0.8} /> : step > 1 ? "ALUMNI10" : null}
              </Input>
              <Button variant={applied ? "ghost" : "primary"} className={cn("transition-transform duration-150", step === 3 && "scale-95")}>
                {applied ? "Applied" : "Apply"}
              </Button>
            </div>
          </Field>
          <div>
            <Expand when={applied}>
              <div className="flex justify-between pb-2.5">
                <span className="text-muted-foreground">Discount (ALUMNI10)</span>
                <span className="text-emerald-600 tabular-nums dark:text-emerald-400">−$64.00</span>
              </div>
            </Expand>
            <div className={cn("flex justify-between border-t pt-2.5 text-[14px] font-medium", LINE)}>
              <span>Total</span>
              <span className="tabular-nums">{applied ? "$576.00" : "$640.00"}</span>
            </div>
          </div>
          <span className="flex h-9 items-center justify-center gap-2 rounded-lg bg-foreground text-[12px] font-medium text-background tabular-nums">
            <Lock className="size-3.5" /> Pay {applied ? "$576.00" : "$640.00"}
          </span>
        </div>
      </Window>
      <Window className="mt-5 min-w-0 flex-1">
        <div className={cn("flex h-11 items-center border-b px-3.5 text-[12px] font-medium", LINE)}>Discounts &amp; Codes</div>
        {CODES.map((code) => (
          <div key={code.name} className={cn("border-b px-3.5 py-2.5 last:border-b-0", LINE, code.name === "ALUMNI10" && applied && "bg-foreground/[0.05]")}>
            <div className="flex items-center gap-1.5">
              <span className="truncate font-mono text-[11px] tracking-wide text-foreground/90">{code.name}</span>
              <Dot tone="emerald" className="ml-auto" />
            </div>
            <div className="mt-1 truncate text-[11px] text-muted-foreground">{code.type}</div>
            <div className="truncate text-[11px] text-muted-foreground">{code.details}</div>
          </div>
        ))}
      </Window>
      <Cursor at={step === 2 || step === 3 ? [244, 128] : [244, 190]} down={step === 3} hidden={step !== 2 && step !== 3} />
    </div>
  );
}

export function CipherMotif({ variant, running }) {
  return <Fit>{variant === "code" ? <Code running={running} /> : <Rule running={running} />}</Fit>;
}
