"use client";

import { Check, UserPlus } from "lucide-react";
import { Fit, useTicker } from "@/components/features-hub/motion";
import styles from "@/components/features-hub/features_hub.module.css";

const FACES = ["MR", "LO", "PN", "TB", "AL", "SW", "JK", "EV", "RD", "CN", "HB", "OS"];
const TINTS = ["bg-foreground/10", "bg-foreground/20", "bg-surface-strong", "bg-foreground/15", "bg-foreground/[0.07]", "bg-foreground/25"];

function Avatar({ face, index, className = "" }) {
  return (
    <span className={`flex size-9 items-center justify-center rounded-full border-2 border-surface-subtle text-[10px] font-semibold text-foreground ${TINTS[index % TINTS.length]} ${className}`}>
      {face}
    </span>
  );
}

function Ring({ radius, faces, offset, reverse }) {
  return (
    <div
      className={`absolute top-1/2 left-1/2 rounded-full border border-dashed border-border ${styles.orbit}`}
      style={{ width: radius * 2, height: radius * 2, marginLeft: -radius, marginTop: -radius, animationDirection: reverse ? "reverse" : "normal" }}
    >
      {faces.map((face, index) => {
        const angle = (index / faces.length) * Math.PI * 2;
        return (
          <span key={face} className="absolute" style={{ left: Math.round(radius + Math.cos(angle) * radius - 18), top: Math.round(radius + Math.sin(angle) * radius - 18) }}>
            <span className={`block ${styles.orbit}`} style={{ animationDirection: reverse ? "normal" : "reverse" }}>
              <Avatar face={face} index={index + offset} />
            </span>
          </span>
        );
      })}
    </div>
  );
}

// CRM: the audience orbits the contact count, which keeps ticking up.
function Crm({ tick }) {
  return (
    <>
      <Ring radius={66} faces={FACES.slice(0, 5)} offset={0} />
      <Ring radius={104} faces={FACES.slice(5, 12)} offset={3} reverse />
      <div className="absolute top-1/2 left-1/2 w-[112px] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-surface-card px-3 py-2 text-center shadow-xl shadow-black/10">
        <p className="font-mono text-base font-semibold text-foreground tabular-nums">{(2481 + tick).toLocaleString("en-US")}</p>
        <p className="text-[10px] text-muted-foreground">contacts</p>
      </div>
    </>
  );
}

const GUESTS = [
  ["MR", "Maya Rodrigues"],
  ["LO", "Leo Okafor"],
  ["PN", "Priya Nair"],
  ["TB", "Tom Becker"],
];

// RSVP: invitations flip to "Going" one by one, then the list resets.
function Rsvp({ tick }) {
  const going = tick % (GUESTS.length + 2);
  return (
    <div className="absolute inset-x-[50px] top-1/2 -translate-y-1/2 rounded-xl border border-border bg-surface-card p-3 shadow-xl shadow-black/10">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-xs font-semibold text-foreground">Guest list</span>
        <span className="font-mono text-[10px] text-muted-foreground tabular-nums">{84 + Math.min(going, GUESTS.length)} going</span>
      </div>
      <div className="space-y-1.5">
        {GUESTS.map(([face, name], index) => {
          const isGoing = index < going;
          return (
            <div key={face} className="flex items-center gap-2.5 rounded-lg px-1 py-1">
              <Avatar face={face} index={index} className="size-7 border-0" />
              <span className="flex-1 truncate text-xs text-foreground">{name}</span>
              <span
                className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] transition-colors duration-300 ${
                  isGoing ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-foreground/[0.06] text-muted-foreground"
                }`}
              >
                {isGoing ? <Check className="size-2.5" /> : null}
                {isGoing ? "Going" : "Invited"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Followers: someone taps Follow, the count climbs and their face joins the stack.
function Followers({ tick }) {
  return (
    <div className="absolute top-1/2 left-1/2 w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-surface-card p-4 shadow-xl shadow-black/10">
      <div className="flex items-center gap-3">
        <span className="size-11 rounded-full bg-linear-to-br from-(--ink) to-(--ink)/30" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">Northwind Live</p>
          <p className="font-mono text-[11px] text-muted-foreground tabular-nums">{(12840 + tick * 3).toLocaleString("en-US")} followers</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex -space-x-2">
          {[0, 1, 2, 3].map((slot) => {
            const index = tick + slot;
            return <Avatar key={index} face={FACES[index % FACES.length]} index={index} className={slot === 3 ? styles.popIn : ""} />;
          })}
        </div>
        <span className={`flex items-center gap-1 rounded-full bg-(--ink) px-3 py-1.5 text-[11px] font-semibold text-(--ink-fg) ${styles.press}`}>
          <UserPlus className="size-3" /> Follow
        </span>
      </div>
    </div>
  );
}

const VARIANTS = { crm: Crm, rsvp: Rsvp, followers: Followers };

export function PeopleMotif({ variant, running }) {
  const View = VARIANTS[variant] || Crm;
  const tick = useTicker(variant === "crm" ? 900 : 1600, running);
  return (
    <Fit width={400} height={250}>
      <View tick={tick} />
    </Fit>
  );
}
