"use client";

import { ExternalLink, Plus, Radio, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";
import { LINE, Window } from "@/components/product-pages/mock_kit";
import { Button, StatStrip, Status } from "@/components/product-pages/apps/events/events_kit";
import { useScene } from "@/components/features-hub/motion";
import { Cursor, Fit } from "@/components/features-hub/motifs/motif_kit";
import pageStyles from "@/components/product-pages/product_pages.module.css";

const COLUMNS = "grid-cols-[minmax(0,1fr)_92px_72px_36px]";

const OTHER_ROOMS = [
  { name: "Studio 2 breakout", access: "Membership", status: "Scheduled" },
  { name: "Remote keynote replay", access: "Free", status: "Offline" },
];

// Watching and unique viewers at each step, presence counts from the room going live.
const WATCHING = [0, 0, 0, 38, 126, 342];
const UNIQUE = [0, 0, 0, 41, 158, 518];

const SCENE = [600, 800, 280, 900, 1000, 3400];

function LiveSwitch({ on }) {
  return (
    <span className={cn("flex h-[18px] w-8 items-center rounded-full p-0.5 transition-colors duration-300", on ? "bg-foreground" : "bg-foreground/15")}>
      <span className="size-[14px] rounded-full bg-background transition-[translate] duration-300" style={{ translate: on ? "14px 0" : "0 0" }} />
    </span>
  );
}

// Livestream Rooms: a room flips to Live and presence climbs; the picture itself comes from the provider link it holds.
export function LiveMotif({ running }) {
  const step = useScene(SCENE, running);
  const live = step >= 3;

  return (
    <Fit>
      <div className="relative h-[330px] w-[480px]">
        <Window title="Livestream Rooms" icon={Radio} className="h-[330px] w-[480px]" actions={<Button variant="ghost" icon={Plus} className="h-7 text-[11px]">Add room</Button>}>
          <div className="px-3.5 pt-3">
            <StatStrip
              stats={[
                { label: "Live now", value: live ? "1" : "0" },
                { label: "Watching", value: WATCHING[step] },
                { label: "Unique viewers", value: UNIQUE[step] },
              ]}
            />
          </div>
          <div className={cn("mt-3 grid h-7 items-center gap-3 border-y px-4 text-[11px] text-muted-foreground", COLUMNS, LINE)}>
            <span>Room</span>
            <span>Access</span>
            <span>Status</span>
            <span className="text-right">Live</span>
          </div>
          <div className={cn("border-b bg-foreground/[0.025]", LINE)}>
            <div className={cn("grid h-10 items-center gap-3 px-4 text-[12px]", COLUMNS)}>
              <span className="truncate font-medium">Main Stage</span>
              <span className="truncate text-foreground/80">Purchase</span>
              <span className="inline-flex items-center gap-1.5 text-foreground/85">
                <span className={cn("size-1.5 rounded-full text-emerald-500 transition-colors", live ? cn("bg-emerald-500", pageStyles.pulse) : "bg-amber-500")} />
                {live ? "Live" : "Scheduled"}
              </span>
              <span className="flex justify-end">
                <LiveSwitch on={live} />
              </span>
            </div>
            <div className="mx-4 mb-3 grid grid-cols-[92px_minmax(0,1fr)] gap-x-3 gap-y-1 rounded-lg border border-foreground/[0.08] px-3 py-2 text-[11px]">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Wifi className="size-3" /> Provider
              </span>
              <span className="truncate text-foreground/90">YouTube Live</span>
              <span className="text-muted-foreground">Watch link</span>
              <span className="flex min-w-0 items-center gap-1.5 text-foreground/90">
                <span className="truncate font-mono text-[10.5px]">youtube.com/live/nsdw-main</span>
                <ExternalLink className="size-3 shrink-0 text-muted-foreground" />
              </span>
            </div>
          </div>
          {OTHER_ROOMS.map((room) => (
            <div key={room.name} className={cn("grid h-10 items-center gap-3 border-b px-4 text-[12px]", COLUMNS, LINE)}>
              <span className="truncate text-foreground/90">{room.name}</span>
              <span className="truncate text-foreground/80">{room.access}</span>
              <Status status={room.status} className="text-[12px]" />
              <span className="flex justify-end">
                <LiveSwitch on={false} />
              </span>
            </div>
          ))}
        </Window>
        <Cursor at={[440, 176]} down={step === 2} hidden={step === 0 || step >= 4} />
      </div>
    </Fit>
  );
}
