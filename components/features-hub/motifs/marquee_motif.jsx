"use client";

import { Bot, Check, Copy, Plus, Trash2, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { Chip, LINE, Typed, Window } from "@/components/product-pages/mock_kit";
import { Button, Field, Input } from "@/components/product-pages/apps/events/events_kit";
import { useScene } from "@/components/features-hub/motion";
import { Cursor, Expand, Fit, Show } from "@/components/features-hub/motifs/motif_kit";

const SERVER_URL = "https://geiger.studio/events/api/mcp";

const APPS = ["Claude", "ChatGPT", "Cursor", "VS Code", "Claude Code", "Codex"];

const APP_NAME = "Northside ops agent";
const CALLBACK = "https://agent.northside.example/callback";

const SCENE = [600, 800, 1000, 800, 1400, 1700, 800, 260, 3200];

function AppRow({ icon: Icon, name, body, children }) {
  return (
    <div className={cn("flex items-center gap-2.5 border-b px-5 py-2", LINE)}>
      <span className="flex size-6 shrink-0 items-center justify-center rounded-md border border-foreground/[0.1] bg-foreground/[0.04] text-foreground/80">
        <Icon className="size-3.5" strokeWidth={1.75} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[12px] font-medium text-foreground/90">{name}</div>
        <div className="truncate text-[11px] text-muted-foreground">{body}</div>
      </div>
      {children}
    </div>
  );
}

// AI Apps: copy the server address, then allow a custom app, whose row lands once its callback URL is filled in.
export function MarqueeMotif({ running }) {
  const step = useScene(SCENE, running);
  const copied = step === 2;
  const dialog = step >= 4 && step <= 7;
  const added = step === 8;
  const cursors = { 1: [416, 98], 2: [416, 98], 3: [424, 214], 6: [378, 240], 7: [378, 240] };

  return (
    <div className="relative h-[330px] w-[480px]">
      <Window title="AI Apps" icon={Bot} className="h-[330px] w-[480px]">
        <div className={cn("border-b px-5 py-3", LINE)}>
          <div className="text-[11px] font-medium text-muted-foreground">Server address</div>
          <div className="mt-1.5 flex items-center gap-2">
            <code className="min-w-0 flex-1 truncate rounded-md border border-foreground/[0.1] bg-background/50 px-2.5 py-1.5 font-mono text-[11px] text-foreground/90">{SERVER_URL}</code>
            <Button variant="ghost" className="h-7 w-[76px] px-2 text-[11px]" icon={copied ? Check : Copy}>
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </div>
        <div className="px-5 pt-2.5 pb-1 text-[11px] font-medium text-muted-foreground">Apps</div>
        <div className={cn("flex flex-wrap gap-1 border-b px-5 pb-2.5", LINE)}>
          {APPS.map((app) => (
            <Chip key={app} className="h-6 px-2 text-[11px]">
              {app}
            </Chip>
          ))}
        </div>
        <div className="flex items-center px-5 pt-2.5 pb-1">
          <span className="text-[11px] font-medium text-muted-foreground">Custom apps</span>
          <Button variant="ghost" className={cn("ml-auto h-6 px-2 text-[11px] transition-transform duration-150", step === 3 && "scale-95")} icon={Plus}>
            Add app
          </Button>
        </div>
        <Expand when={added}>
          <AppRow icon={Wrench} name={APP_NAME} body={CALLBACK}>
            <Trash2 className="size-3.5 shrink-0 text-muted-foreground" />
          </AppRow>
        </Expand>
        <Expand when={!added}>
          <div className="px-5 py-2 text-[11px] text-muted-foreground">Add one to allow its sign-in, then paste the server address into the app.</div>
        </Expand>
      </Window>

      <Show when={dialog} className="absolute inset-x-[44px] top-[46px] z-10 rounded-xl border border-foreground/[0.12] bg-surface-card p-4 shadow-2xl shadow-black/30 dark:bg-surface-dialog">
        <div className="text-[14px] font-medium">Add a custom app</div>
        <div className="mt-3 flex flex-col gap-2.5">
          <Field label="App name">
            <Input className={cn(step === 4 && "border-foreground/30")}>{step === 4 ? <Typed key="name" text={APP_NAME} delay={0.1} duration={0.9} /> : step > 4 ? APP_NAME : null}</Input>
          </Field>
          <Field label="Callback URL">
            <Input className={cn("font-mono text-[11px]", step === 5 && "border-foreground/30")}>{step === 5 ? <Typed key="url" text={CALLBACK} delay={0.1} duration={1.2} /> : step > 5 ? CALLBACK : null}</Input>
          </Field>
        </div>
        <div className="mt-3.5 flex justify-end gap-2">
          <Button variant="ghost">Cancel</Button>
          <Button className={cn("transition-transform duration-150", step === 7 && "scale-95")}>Add app</Button>
        </div>
      </Show>

      <Cursor at={cursors[step] ?? [378, 240]} down={step === 2 || step === 7} hidden={!cursors[step]} />
    </div>
  );
}
