"use client";

import { Heart, Mail, MessageSquare } from "lucide-react";
import { Fit, useTicker } from "@/components/features-hub/motion";
import styles from "@/components/features-hub/features_hub.module.css";

const CAMPAIGN = [
  { channel: "Email", title: "Early bird ends tonight", meta: "Opened 62%" },
  { channel: "SMS", title: "Doors open at 6:30 PM", meta: "Delivered" },
  { channel: "Email", title: "Your ticket is ready", meta: "Clicked 41%" },
  { channel: "SMS", title: "Two days to go", meta: "Delivered" },
  { channel: "Email", title: "Last chance: 12 seats left", meta: "Opened 58%" },
];

const COMMUNITY = [
  { who: "AL", text: "Who's heading to the afterparty?", mine: false, likes: 12 },
  { who: "ME", text: "Count me in!", mine: true, likes: 0 },
  { who: "LO", text: "Slides from the keynote are up", mine: false, likes: 8 },
  { who: "ME", text: "Thanks, these are great", mine: true, likes: 3 },
  { who: "PN", text: "Meetup at the coffee bar at 3?", mine: false, likes: 5 },
];

const STEP = 58;
const VISIBLE = 4;

function CampaignRow({ item }) {
  const Icon = item.channel === "SMS" ? MessageSquare : Mail;
  return (
    <div className="flex h-[50px] items-center gap-3 rounded-xl border border-border bg-surface-card px-3 shadow-md shadow-black/5">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-(--ink)/15">
        <Icon className="size-3.5 text-(--ink)" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium text-foreground">{item.title}</p>
        <p className="font-mono text-[10px] text-text-tertiary">{item.channel}</p>
      </div>
      <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-600 dark:text-emerald-400">{item.meta}</span>
    </div>
  );
}

function ChatRow({ item }) {
  return (
    <div className={`flex h-[50px] items-end gap-2 ${item.mine ? "flex-row-reverse" : ""}`}>
      <span className={`flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${item.mine ? "bg-(--ink) text-(--ink-fg)" : "bg-surface-strong text-foreground"}`}>
        {item.who}
      </span>
      <div className="relative">
        <p className={`rounded-2xl px-3 py-2 text-xs whitespace-nowrap ${item.mine ? "rounded-br-md bg-(--ink) text-(--ink-fg)" : "rounded-bl-md border border-border bg-surface-card text-foreground"}`}>
          {item.text}
        </p>
        {item.likes ? (
          <span className={`absolute -right-2 -bottom-2 flex items-center gap-0.5 rounded-full border border-border bg-surface-card px-1.5 py-0.5 text-[10px] text-muted-foreground shadow-sm ${styles.popIn}`}>
            <Heart className="size-2.5 fill-foreground text-foreground" /> {item.likes}
          </span>
        ) : null}
      </div>
    </div>
  );
}

// A live feed: each tick a new message lands at the bottom and the older ones climb and fade.
export function MessagesMotif({ variant, running }) {
  const items = variant === "community" ? COMMUNITY : CAMPAIGN;
  const Row = variant === "community" ? ChatRow : CampaignRow;
  const tick = useTicker(1900, running);

  return (
    <Fit width={320} height={250}>
      <div className={`absolute inset-x-0 top-0 bottom-3 overflow-hidden ${styles.topFade}`}>
        {Array.from({ length: VISIBLE + 1 }, (_, age) => {
          const id = tick - age;
          const item = items[((id % items.length) + items.length) % items.length];
          return (
            <div
              key={id}
              className="absolute inset-x-1 bottom-0 transition-[translate,opacity] duration-500 ease-out"
              style={{ translate: `0 ${-age * STEP}px`, opacity: age === VISIBLE ? 0 : 1 - age * 0.18 }}
            >
              <div className={age === 0 ? styles.popIn : undefined}>
                <Row item={item} />
              </div>
            </div>
          );
        })}
      </div>
    </Fit>
  );
}
