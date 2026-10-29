import {
  ArrowUp,
  Check,
  ChevronDown,
  Clock,
  Code2,
  Eye,
  FlaskConical,
  FolderInput,
  KeyRound,
  LayoutDashboard,
  Lock,
  Play,
  Route,
  ScanLine,
  Search,
  Sparkles,
  StickyNote,
  Ticket,
  Tag as TagIcon,
  Webhook,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AppMark, Avatar, Chip, Dot, LINE, MonoLabel, Typed, Window } from "@/components/product-pages/mock_kit";
import { BoardTile, Column, CommentCard, Cursor, Node, Note, NotesBar, NotesWindow, SessionPill, TableCard, Toast, TodoCard, Wires } from "@/components/product-pages/apps/notes/notes_kit";
import { CARD, Input as FormsInput, Segmented, Select, StatusDot, Tag, Toggle } from "@/components/product-pages/apps/forms/forms_kit";
import { Button as EventButton, PhoneFrame } from "@/components/product-pages/apps/events/events_kit";
import { CodeBlock, Method, ScreenHead, StatsRow as ContentStats, StatusPill as ContentStatusPill } from "@/components/product-pages/apps/content/content_kit";
import styles from "@/components/product-pages/product_pages.module.css";

// Hollis Audio's marketing team launches the Arc headphones: the plan in Notes, the waitlist in Forms, the listening night in Events, the pages in Content and the files in Assets.

const TEAM = ["Maya Okafor", "Daniel Reyes", "Ines Lund", "Owen Clarke"];

// Hollis's mark: a headphone band over two cups inside a ring.
export function HollisMark({ className }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("text-foreground", className)} fill="none" aria-hidden="true">
      <circle cx="20" cy="20" r="18" stroke="currentColor" strokeOpacity="0.8" strokeWidth="2" />
      <path d="M11 24v-4a9 9 0 0 1 18 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <rect x="9" y="22" width="5" height="8" rx="2" fill="currentColor" fillOpacity="0.75" />
      <rect x="26" y="22" width="5" height="8" rx="2" fill="currentColor" fillOpacity="0.75" />
    </svg>
  );
}

// The Arc headphones on a studio sweep, drawn in foreground tints so they hold in light and dark.
export function ArcPhoto({ className, style }) {
  return (
    <svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice" className={cn("text-foreground", className)} style={style} aria-hidden="true">
      <defs>
        <linearGradient id="hollis-sweep" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.16" />
          <stop offset="0.7" stopColor="currentColor" stopOpacity="0.06" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.12" />
        </linearGradient>
      </defs>
      <rect width="300" height="200" fill="url(#hollis-sweep)" />
      <ellipse cx="150" cy="176" rx="86" ry="6" fill="currentColor" fillOpacity="0.14" />
      <path d="M92 132 V108 a58 58 0 0 1 116 0 V132" fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="9" strokeLinecap="round" />
      <path d="M100 112 a50 50 0 0 1 100 0" fill="none" stroke="currentColor" strokeOpacity="0.22" strokeWidth="3" />
      <rect x="72" y="116" width="40" height="56" rx="16" fill="currentColor" fillOpacity="0.46" />
      <rect x="188" y="116" width="40" height="56" rx="16" fill="currentColor" fillOpacity="0.46" />
      <rect x="80" y="126" width="24" height="36" rx="10" fill="currentColor" fillOpacity="0.2" />
      <rect x="196" y="126" width="24" height="36" rx="10" fill="currentColor" fillOpacity="0.2" />
    </svg>
  );
}

// Hero: the Arc launch board in Notes, with the plan in columns and the team on it at once.
export function LaunchHeroWindow() {
  return (
    <NotesWindow
      bar={
        <NotesBar crumbs={["Launches", "Arc"]} live>
          <span className="flex -space-x-1.5">
            {TEAM.slice(1).map((name) => (
              <Avatar key={name} name={name} size={26} />
            ))}
          </span>
        </NotesBar>
      }
      activeTool={0}
      className="h-[700px] w-[1180px]"
    >
      <div className="absolute top-[22px] left-[32px]">
        <div className="text-[30px] leading-none font-semibold tracking-[-0.02em]">Arc launch</div>
        <div className="mt-2 text-[12px] text-muted-foreground">Hollis Audio marketing · on sale Thursday 4 March 2027</div>
      </div>
      <Node at={[32, 92]} w={250} className="overflow-hidden">
        <ArcPhoto className="block h-[150px] w-full" />
        <div className="truncate px-2.5 py-1.5 text-[11px] text-muted-foreground">Arc, sand, key image</div>
      </Node>
      <Column at={[300, 92]} w={240} title="Before launch" items={[["Open the early-access list", true], ["Brief the three reviewers", true], "Book the listening night"]} />
      <Column at={[558, 92]} w={240} title="Launch week" items={["Launch page live at 9:00", "Listening night, Calder Works", ["Press kit approved", false]]} />
      <Column at={[816, 92]} w={240} title="After" items={["Thank-you note to the list", "Reviews round-up page"]} />
      <TableCard
        at={[32, 300]}
        w={250}
        columns={["Channel", "Goes out"]}
        rows={[
          ["Launch page", "4 Mar"],
          ["Early-access form", "Now"],
          ["Listening night", "4 Mar"],
          ["Reviews page", "11 Mar"],
        ]}
      />
      <BoardTile at={[300, 352]} w={240} label="Listening night" />
      <BoardTile at={[558, 352]} w={240} label="Press kit" />
      <CommentCard at={[816, 300]} w={240} name="Ines Lund">
        Lead with the 40-hour battery. Every reviewer asked about it first.
      </CommentCard>
      <TodoCard
        at={[300, 432]}
        w={240}
        items={[
          ["Final copy for the launch page", true],
          ["Code for the waitlist tickets", false],
          ["Thank-you note drafted", false],
        ]}
      />
      <Note at={[558, 432]} w={240}>
        Waitlist gets first pick of listening-night places, then we open it to everyone.
      </Note>
      <Cursor at={[420, 240]} name="Daniel Reyes" tone={0} />
      <Cursor at={[700, 470]} name="Owen Clarke" tone={1} delay="-1.6s" />
      <Cursor at={[960, 420]} name="Ines Lund" tone={2} delay="-3.2s" />
    </NotesWindow>
  );
}

const AI_ACTIONS = ["Summarize", "Cluster", "Brainstorm", "Action items", "Custom"];
const ACTION_ITEMS = ["Send the waitlist code on 25 February", "Book the PA for Calder Works", "Get legal sign-off on the press kit"];

// The AI assistant card set to Action items, its list, and Spawn as notes.
function ActionItemsCard({ at, w = 380 }) {
  return (
    <Node at={at} w={w} selected className="flex flex-col text-[12px]">
      <div className={cn("flex items-center gap-2 border-b px-3 py-2", LINE)}>
        <Sparkles className="size-4 shrink-0" strokeWidth={1.75} />
        <span className="text-[13px] font-semibold whitespace-nowrap">AI assistant</span>
        <span className="rounded-full border border-foreground/[0.12] px-2 py-0.5 text-[10px] whitespace-nowrap text-muted-foreground">3 connected</span>
        <span className="ml-auto flex h-7 shrink-0 items-center gap-1.5 rounded-md bg-foreground px-2.5 text-[11.5px] font-medium whitespace-nowrap text-background">
          <Play className="size-3" /> Action items
        </span>
      </div>
      <div className={cn("flex flex-wrap gap-1 border-b px-3 py-2", LINE)}>
        {AI_ACTIONS.map((item) => (
          <span key={item} className={cn("rounded-md px-2 py-1 text-[11px]", item === "Action items" ? "bg-foreground/[0.09] text-foreground" : "text-muted-foreground")}>
            {item}
          </span>
        ))}
      </div>
      <div className="px-3 py-2.5 text-[12.5px] leading-[1.5]">
        <div className="mb-1 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">Action items</div>
        <ul className="ml-4 list-disc space-y-0.5 text-foreground/90">
          {ACTION_ITEMS.map((item, index) => (
            <li key={item} className={styles.popIn} style={{ "--pop-delay": `${0.4 + index * 0.12}s` }}>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className={cn("mt-auto flex items-center gap-2 border-t px-3 py-1.5", LINE)}>
        <span className="mr-auto truncate text-[10px] text-muted-foreground tabular-nums">18/02/2027, 16:04:51</span>
        <span className="flex h-6 items-center gap-1.5 rounded-md bg-foreground/[0.07] px-2 text-[11px] text-foreground">
          <StickyNote className="size-3.5" /> Spawn as notes
        </span>
      </div>
    </Node>
  );
}

// Section stage: the launch-week column, the timeline table and a comment wired into the AI card, its action items spawned as notes.
export function ActionItemsStage() {
  return (
    <div className="relative h-[620px] w-[1000px]">
      <NotesWindow crumbs={["Launches", "Arc", "Launch week"]} activeTool={-1} className="absolute top-0 left-0 h-[640px] w-[1000px]">
        <Wires
          paths={[
            { d: "M240 120 C 270 120, 270 140, 298 140", dashed: true, flow: true },
            { d: "M240 330 C 272 330, 270 180, 298 180", dashed: true, flow: true },
            { d: "M240 470 C 280 470, 276 220, 298 220", dashed: true, flow: true },
            { d: "M680 150 C 700 150, 700 66, 718 66", arrow: true, strong: true },
            { d: "M680 174 C 700 174, 700 160, 718 160", arrow: true, strong: true },
            { d: "M680 198 C 702 198, 700 254, 718 254", arrow: true, strong: true },
          ]}
        />
        <Column at={[24, 24]} w={216} title="Launch week" items={["Waitlist gets a code first", "Listening night at Calder Works", "Press kit out on the day"]} />
        <TableCard
          at={[24, 262]}
          w={216}
          columns={["Date", "What"]}
          rows={[
            ["25 Feb", "Waitlist code"],
            ["1 Mar", "Press kit"],
            ["4 Mar", "Launch"],
          ]}
        />
        <CommentCard at={[24, 420]} w={216} name="Owen Clarke">
          Legal still needs to see the battery claims before the kit goes out.
        </CommentCard>
        <ActionItemsCard at={[300, 40]} w={380} />
        {ACTION_ITEMS.map((item, index) => (
          <div key={item} className={styles.popIn} style={{ "--pop-delay": `${1 + index * 0.18}s` }}>
            <Note at={[720, 40 + index * 94]} w={230}>
              {item}
            </Note>
          </div>
        ))}
        <div className={cn("absolute top-[330px] left-[716px]", styles.popIn)} style={{ "--pop-delay": "1.6s" }}>
          <Toast title="Added 3 notes" className="w-[220px]" />
        </div>
      </NotesWindow>
    </div>
  );
}

// Cell: the launch board's sub-boards, one per workstream, each a double click away.
export function LaunchBoardsRender() {
  return (
    <NotesWindow crumbs={["Launches", "Arc"]} rail={false} className="mx-auto h-[290px] w-[460px]">
      {[
        ["Listening night", 24, 24],
        ["Early-access list", 236, 24],
        ["Launch page", 24, 100],
        ["Press kit", 236, 100],
        ["Reviews round-up", 24, 176],
      ].map(([label, x, y], index) => (
        <BoardTile key={label} at={[x, y]} w={200} label={label} selected={index === 0} />
      ))}
      <Cursor at={[150, 60]} />
    </NotesWindow>
  );
}

// Cell: a live session on the board, following the person presenting the plan.
export function FollowPlanRender() {
  return (
    <NotesWindow crumbs={["Arc"]} rail={false} className="relative mx-auto h-[300px] w-[460px]">
      <SessionPill dot action={<><X className="size-3" /> Stop</>} className="absolute top-3 left-1/2 z-[7] -translate-x-1/2">
        Following <span className="font-medium">Maya Okafor</span>
      </SessionPill>
      <Column at={[24, 56]} w={200} title="Launch week" items={["Launch page live at 9:00", "Listening night"]} />
      <Note at={[240, 56]} w={196} selected>
        Waitlist gets first pick of listening-night places.
      </Note>
      <Note at={[240, 150]} w={196}>
        Reviews round-up the week after.
      </Note>
      <Cursor at={[352, 112]} name="Maya Okafor" tone={0} />
      <Cursor at={[120, 220]} name="Daniel Reyes" tone={2} delay="-2s" />
    </NotesWindow>
  );
}

const SIGNUPS = [
  { name: "Sam Whitfield", city: "Leeds", source: "newsletter", status: "Needs review", tags: ["listening night"], time: "3m" },
  { name: "Priya Shah", city: "Manchester", source: "instagram", status: "Approved", tags: ["reviewer"], time: "21m" },
  { name: "Tomás Ortega", city: "Leeds", source: "partner-site", status: "Needs review", tags: ["listening night"], time: "48m" },
  { name: "Hannah Brook", city: "York", source: "(direct)", status: "Pending", tags: [], time: "1h" },
  { name: "Kwame Mensah", city: "Leeds", source: "newsletter", status: "Approved", tags: ["listening night"], time: "2h" },
  { name: "Lena Vogel", city: "Sheffield", source: "instagram", status: "Complete", tags: [], time: "3h" },
];

// Section showcase: the early-access form's response inbox, every sign-up with its city, source, status and tags.
export function WaitlistInboxRender() {
  return (
    <Window className="h-[460px] w-[680px]">
      <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-5", LINE)}>
        <AppMark id="forms" size={20} />
        <span className="ml-1 text-muted-foreground">Responses</span>
        <span className="text-muted-foreground/60">›</span>
        <span className="font-medium">Arc early access</span>
        <span className="ml-auto text-[12px] text-muted-foreground tabular-nums">1,284 responses</span>
      </div>
      <div className={cn("flex items-center gap-2 border-b px-4 py-2.5", LINE)}>
        <Segmented options={["All", "Needs review", "Leeds", "Reviewers"]} active={2} className="text-[11px]" />
        <span className="ml-auto flex h-7 w-[150px] items-center gap-2 rounded-md border border-foreground/[0.1] px-2.5 text-[12px] text-muted-foreground">
          <Search className="size-3.5" /> Search responses…
        </span>
      </div>
      <div className={cn("grid grid-cols-[minmax(0,1.3fr)_90px_100px_110px_44px] gap-3 border-b px-4 py-2 text-[11px] text-muted-foreground", LINE)}>
        <span>Name</span>
        <span>City</span>
        <span>Source</span>
        <span>Status</span>
        <span className="text-right">Age</span>
      </div>
      {SIGNUPS.map((row, index) => (
        <div key={row.name} className={cn("grid grid-cols-[minmax(0,1.3fr)_90px_100px_110px_44px] items-center gap-3 border-b px-4 py-2.5 text-[12px] last:border-b-0", LINE, index === 0 && "bg-foreground/[0.04]")}>
          <span className="flex min-w-0 items-center gap-2">
            <Avatar name={row.name} size={22} />
            <span className="truncate text-foreground/90">{row.name}</span>
            {row.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </span>
          <span className="truncate text-muted-foreground">{row.city}</span>
          <span className="truncate font-mono text-[11px] text-muted-foreground">{row.source}</span>
          <StatusDot status={row.status} className="text-[12px]" />
          <span className="text-right text-[11px] text-muted-foreground tabular-nums">{row.time}</span>
        </div>
      ))}
    </Window>
  );
}

const SOURCES = [
  { source: "newsletter", views: 2140, submits: 612 },
  { source: "instagram", views: 1880, submits: 344 },
  { source: "partner-site", views: 760, submits: 201 },
  { source: "(direct)", views: 690, submits: 127 },
];

// Cell: which links brought sign-ups in, grouped by UTM source.
export function SignupSourcesRender() {
  return (
    <div className={cn("mx-auto w-[460px] overflow-hidden text-[13px]", CARD)}>
      <div className={cn("flex items-center gap-2 border-b px-4 py-3", LINE)}>
        <Route className="size-4 text-muted-foreground" />
        <span className="font-semibold">Source &amp; Attribution</span>
        <Segmented options={["Source", "Medium", "Campaign"]} className="ml-auto text-[11px]" />
      </div>
      <div className={cn("grid grid-cols-[1fr_52px_1.3fr_64px] gap-3 border-b px-4 py-2 text-[11px] text-muted-foreground", LINE)}>
        <span>Source</span>
        <span className="text-right">Views</span>
        <span>Sign-ups</span>
        <span className="text-right">Conversion</span>
      </div>
      {SOURCES.map((row, index) => (
        <div key={row.source} className={cn("grid grid-cols-[1fr_52px_1.3fr_64px] items-center gap-3 border-b px-4 py-2.5 last:border-b-0", LINE)}>
          <span className="truncate font-mono text-[12px]">{row.source}</span>
          <span className="text-right text-[12px] text-muted-foreground tabular-nums">{row.views.toLocaleString("en-GB")}</span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/[0.07]">
              <span className={cn("block h-full origin-left rounded-full bg-foreground/45", styles.fill)} style={{ width: `${(row.submits / 612) * 100}%`, "--fill-delay": `${0.3 + index * 0.12}s` }} />
            </span>
            <span className="w-7 text-right text-[12px] tabular-nums">{row.submits}</span>
          </span>
          <span className="text-right text-[12px] tabular-nums">{((row.submits / row.views) * 100).toFixed(1)}%</span>
        </div>
      ))}
    </div>
  );
}

const RULE_ACTIONS = [
  ["Add tag", "listening night"],
  ["Assign to", "Daniel Reyes"],
  ["Send email", "Your place at the listening night"],
];

// Cell: an automation that tags and routes everyone who asks for a listening-night place.
export function SignupRuleRender() {
  return (
    <div className={cn("mx-auto w-[460px] p-4 text-[13px]", CARD)}>
      <div className="flex items-center gap-3">
        <Toggle />
        <FormsInput className="flex-1 text-[13px] font-medium">Listening night requests</FormsInput>
      </div>
      <div className="mt-3.5 flex items-center gap-2">
        <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">When</span>
        <Segmented options={["All match", "Any matches"]} className="text-[11px]" />
      </div>
      <div className="mt-2 grid grid-cols-[1fr_96px_96px] gap-2">
        <Select>Come to the listening night?</Select>
        <Select>Is</Select>
        <FormsInput className="h-7 text-[11px]">Yes</FormsInput>
      </div>
      <div className="mt-3.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">Then</div>
      <div className="mt-2 flex flex-col gap-2">
        {RULE_ACTIONS.map(([action, value], index) => (
          <div key={action} className={cn("grid grid-cols-[120px_1fr] gap-2", styles.popIn)} style={{ "--pop-delay": `${0.3 + index * 0.12}s` }}>
            <Select>{action}</Select>
            <FormsInput className="h-7 truncate text-[11px]">{value}</FormsInput>
          </div>
        ))}
      </div>
    </div>
  );
}

// Cell: the early-access form embedded on Hollis's teaser page, with the snippet that put it there.
export function SignupEmbedRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[460px]">
      <div className="absolute top-0 left-0 w-[300px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card dark:bg-surface-subtle">
        <div className={cn("flex h-7 items-center gap-1.5 border-b px-2.5", LINE)}>
          <span className="size-2 rounded-full bg-foreground/15" />
          <span className="size-2 rounded-full bg-foreground/15" />
          <span className="ml-1 truncate text-[10px] text-muted-foreground">hollis.example/arc</span>
        </div>
        <ArcPhoto className="block h-[92px] w-full" />
        <div className="flex flex-col gap-2 p-3 text-[12px]">
          <div className="text-[14px] leading-tight font-semibold tracking-[-0.01em]">Hear Arc first</div>
          <FormsInput className="h-7 text-[11px] text-muted-foreground">Your email</FormsInput>
          <Select className="h-7 text-[11px] text-muted-foreground">Nearest city</Select>
          <span className="flex h-7 items-center justify-center rounded-md bg-foreground text-[11px] font-medium text-background">Join the list</span>
        </div>
      </div>
      <div className={cn("absolute top-[120px] right-0 z-[2] w-[220px] overflow-hidden rounded-xl border border-foreground/[0.12] bg-surface-card shadow-2xl shadow-black/30 dark:bg-surface-dialog", styles.float)}>
        <div className={cn("flex items-center gap-2 border-b px-3 py-2 text-[12px]", LINE)}>
          <Code2 className="size-3.5 text-muted-foreground" />
          <span className="font-medium">Embed</span>
          <span className="ml-auto text-[11px] text-muted-foreground">Inline</span>
        </div>
        <div className="px-3 py-2.5 font-mono text-[10.5px] leading-[1.6] text-muted-foreground">
          <div>{'<script src="…/embed.js"'}</div>
          <div className="pl-3">async&gt;&lt;/script&gt;</div>
        </div>
      </div>
    </div>
  );
}

const TICKETS = [
  { name: "Waitlist place", price: "Free", note: "Behind code ARC-EARLY", sold: 118, total: 120, icon: KeyRound },
  { name: "General admission, wave 1", price: "£12", note: "Sold out", sold: 150, total: 150 },
  { name: "General admission, wave 2", price: "£15", note: "Opens when wave 1 sells out", sold: 41, total: 130 },
];

function SoldBar({ sold, total, delay = 0.3 }) {
  return (
    <span className="flex items-center gap-2">
      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/[0.07]">
        <span className={cn("block h-full origin-left rounded-full bg-foreground/45", styles.fill)} style={{ width: `${(sold / total) * 100}%`, "--fill-delay": `${delay}s` }} />
      </span>
      <span className="w-14 text-right text-[11px] text-muted-foreground tabular-nums">
        {sold}/{total}
      </span>
    </span>
  );
}

// Section stage: the listening night's tickets, the waitlist place behind a code, and a guest unlocking it at checkout.
export function ListeningNightStage() {
  return (
    <div className="relative h-[620px] w-[1000px]">
      <Window className="absolute top-0 left-0 h-[640px] w-[700px]">
        <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-5", LINE)}>
          <AppMark id="events" size={20} />
          <span className="ml-1 text-muted-foreground">Events</span>
          <span className="text-muted-foreground/60">›</span>
          <span className="font-medium">Arc listening night</span>
          <EventButton className="ml-auto h-7">Publish</EventButton>
        </div>
        <div className="flex flex-col gap-4 p-5">
          <div className="overflow-hidden rounded-xl border border-foreground/[0.08]">
            <div className="relative h-[150px]">
              <ArcPhoto className="absolute inset-0 size-full" />
              <div className="absolute inset-0 bg-linear-to-r from-surface-card via-surface-card/60 to-transparent dark:from-surface-subtle dark:via-surface-subtle/60" />
              <div className="absolute bottom-4 left-5">
                <MonoLabel>Calder Works · Thu 4 Mar · 19:00</MonoLabel>
                <div className="mt-1 text-[24px] leading-[1.05] font-semibold tracking-[-0.02em]">Arc listening night</div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium">Tickets</span>
            <span className="text-[12px] text-muted-foreground tabular-nums">309 of 400 places taken</span>
          </div>
          <div className="overflow-hidden rounded-xl border border-foreground/[0.08]">
            {TICKETS.map((ticket, index) => (
              <div key={ticket.name} className={cn("grid grid-cols-[minmax(0,1fr)_70px_190px] items-center gap-4 border-b px-4 py-3 last:border-b-0", LINE)}>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 truncate text-[13px] text-foreground/90">
                    {ticket.icon ? <ticket.icon className="size-3.5 shrink-0 text-muted-foreground" /> : <Ticket className="size-3.5 shrink-0 text-muted-foreground" />}
                    {ticket.name}
                  </div>
                  <div className="mt-0.5 truncate text-[11px] text-muted-foreground">{ticket.note}</div>
                </div>
                <span className="text-[13px] tabular-nums">{ticket.price}</span>
                <SoldBar sold={ticket.sold} total={ticket.total} delay={0.3 + index * 0.25} />
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {["Hidden until a code is entered", "Free tickets skip the card", "Waves open in order"].map((rule) => (
              <Chip key={rule} className="h-6 text-[11px]">
                {rule}
              </Chip>
            ))}
          </div>
        </div>
      </Window>
      <div className={cn("absolute top-[120px] left-[640px] z-[2] w-[340px] rounded-xl border border-foreground/[0.12] bg-surface-card p-5 text-[13px] shadow-2xl shadow-black/30 dark:bg-surface-dialog", styles.float)}>
        <div className="font-semibold">Checkout</div>
        <div className="mt-0.5 text-[11px] text-muted-foreground">Arc listening night · Thu 4 Mar</div>
        <div className="mt-4 text-[11px] text-muted-foreground">Access code</div>
        <div className="mt-1.5 flex gap-2">
          <span className="flex h-8 flex-1 items-center rounded-md border border-foreground/25 px-2.5 font-mono text-[12px]">
            <Typed text="ARC-EARLY" delay={1} />
          </span>
          <EventButton variant="ghost">Apply</EventButton>
        </div>
        <div className={cn("mt-3 flex items-center gap-2 rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-[12px] text-emerald-800 dark:text-emerald-200", styles.popIn)} style={{ "--pop-delay": "1.9s" }}>
          <Check className="size-3.5" strokeWidth={2.5} /> Unlocked: Waitlist place
        </div>
        <div className={cn("mt-4 flex items-center justify-between border-t pt-3", LINE)}>
          <span className="text-foreground/90">Waitlist place × 1</span>
          <span className="tabular-nums">Free</span>
        </div>
        <span className="mt-4 flex h-9 items-center justify-center rounded-md bg-foreground text-[12px] font-medium text-background">Get ticket</span>
      </div>
    </div>
  );
}

// Cell: a staff phone at the door, scanning a guest's QR ticket.
export function DoorScanRender() {
  return (
    <div className="relative mx-auto flex h-[320px] w-[460px] items-center justify-center gap-6">
      <PhoneFrame className="h-[310px] w-[180px]">
        <div className={cn("flex items-center gap-1.5 border-b px-3 py-2 text-[11px]", LINE)}>
          <ScanLine className="size-3.5 text-muted-foreground" />
          <span className="font-medium">Main door</span>
          <span className="ml-auto text-muted-foreground tabular-nums">212 / 309</span>
        </div>
        <div className="relative m-3 flex flex-1 items-center justify-center rounded-lg bg-foreground/[0.06]">
          <svg viewBox="0 0 60 60" className="size-20 text-foreground/70" aria-hidden="true">
            {Array.from({ length: 36 }, (_, index) => {
              const x = index % 6;
              const y = Math.floor(index / 6);
              return (index * 7 + y) % 3 === 0 ? null : <rect key={index} x={4 + x * 9} y={4 + y * 9} width="7" height="7" rx="1" fill="currentColor" fillOpacity={0.35 + ((x + y) % 3) * 0.2} />;
            })}
          </svg>
          <span className="absolute inset-4 rounded-md border-2 border-foreground/40" />
        </div>
        <div className={cn("mx-3 mb-3 flex items-center gap-2 rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-2 text-[11px] text-emerald-800 dark:text-emerald-200", styles.popIn)} style={{ "--pop-delay": "0.9s" }}>
          <Check className="size-3.5 shrink-0" strokeWidth={2.5} /> Admitted Sam Whitfield
        </div>
      </PhoneFrame>
      <div className="flex w-[200px] flex-col gap-2 text-[12px]">
        {[
          ["Sam Whitfield", "Waitlist place", true],
          ["Priya Shah", "General, wave 1", true],
          ["Kwame Mensah", "Waitlist place", false],
        ].map(([name, ticket, inside]) => (
          <div key={name} className={cn("flex items-center gap-2 rounded-lg border border-foreground/[0.08] bg-surface-card px-2.5 py-2 dark:bg-surface-subtle")}>
            <Avatar name={name} size={22} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-foreground/90">{name}</span>
              <span className="block truncate text-[10px] text-muted-foreground">{ticket}</span>
            </span>
            <Dot tone={inside ? "emerald" : "neutral"} />
          </div>
        ))}
      </div>
    </div>
  );
}

const WAITING = ["Hannah Brook", "Lena Vogel", "Arjun Patel"];

// Cell: places open up, and the next guests in line are promoted from the waitlist.
export function NightWaitlistRender() {
  return (
    <div className="relative mx-auto h-[290px] w-[460px]">
      <div className="overflow-hidden rounded-xl border border-foreground/[0.08] bg-surface-card text-[12px] dark:bg-surface-subtle">
        <div className={cn("border-b px-4 py-3", LINE)}>
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-medium">Waitlist</span>
            <span className="truncate text-muted-foreground">Arc listening night</span>
            <EventButton icon={ArrowUp} className="ml-auto h-7">
              Promote next
            </EventButton>
          </div>
          <div className="mt-2.5 flex items-center gap-3">
            <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/[0.08]">
              <span className={cn("absolute inset-y-0 left-0 w-[99%] origin-left rounded-full bg-foreground/45", styles.fill)} />
            </span>
            <span className="text-[11px] text-muted-foreground tabular-nums">
              396/400 · <span className="text-emerald-600 dark:text-emerald-400">4 open</span> · 22 waiting
            </span>
          </div>
        </div>
        {WAITING.map((name, index) => (
          <div key={name} className={cn("flex h-11 items-center gap-3 border-b px-4 last:border-b-0", LINE)}>
            <span className="w-5 font-mono text-[11px] text-muted-foreground">#{index + 1}</span>
            <Avatar name={name} size={22} />
            <span className="flex-1 text-foreground/90">{name}</span>
            <EventButton variant="ghost" icon={ArrowUp} className="h-7">
              Promote
            </EventButton>
          </div>
        ))}
      </div>
      <div className={cn("absolute right-3 bottom-1 z-[2] flex items-center gap-2 rounded-lg border border-emerald-500/25 bg-surface-card px-3 py-2 text-[12px] shadow-xl shadow-black/20 dark:bg-surface-dialog", styles.popIn)} style={{ "--pop-delay": "1s" }}>
        <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} />
        Promoted Hannah Brook from the waitlist.
      </div>
    </div>
  );
}

const LAUNCH_ENTRIES = [
  { title: "Arc: hear more, carry less", slug: "arc", type: "Launch page", status: "Scheduled", date: "4 Mar, 09:00", active: true },
  { title: "Forty hours on one charge", slug: "arc/battery", type: "Story", status: "In review", date: "4 Mar" },
  { title: "Arc listening night", slug: "events/arc-night", type: "Story", status: "Published", date: "18 Feb" },
  { title: "What reviewers said", slug: "arc/reviews", type: "Round-up", status: "Draft", date: "11 Mar" },
];

// Section callout: the launch's entries in the publishing queue, the launch page scheduled for 9:00.
export function LaunchQueueRender() {
  return (
    <Window className="h-[430px] w-[540px]">
      <ScreenHead title="Publishing Queue" description="Entries waiting to go live, scheduled, in review, and currently published." />
      <div className="flex flex-col gap-3 px-5 py-4">
        <ContentStats
          stats={[
            { label: "Scheduled", value: "1", footer: "Has a go-live date" },
            { label: "In review", value: "1", footer: "Awaiting approval" },
            { label: "Published", value: "1", footer: "Live now" },
          ]}
        />
        <div className="overflow-hidden rounded-xl border border-foreground/[0.08]">
          {LAUNCH_ENTRIES.map((row) => (
            <div key={row.slug} className={cn("grid grid-cols-[minmax(0,1fr)_110px_84px] items-center gap-3 border-b px-4 py-2 last:border-b-0", LINE, row.active && "bg-foreground/[0.05]")}>
              <div className="min-w-0">
                <div className="truncate font-medium text-foreground/90">{row.title}</div>
                <div className="truncate text-[11px] text-muted-foreground">
                  /{row.slug} · {row.type}
                </div>
              </div>
              <ContentStatusPill status={row.status} className="justify-self-start" />
              <span className="text-[12px] whitespace-nowrap text-muted-foreground">{row.date}</span>
            </div>
          ))}
        </div>
      </div>
    </Window>
  );
}

const STAGES = [
  { name: "Brand", who: "Ines Lund", state: "Approved" },
  { name: "Legal", who: "Owen Clarke", state: "Approved" },
  { name: "Product marketing", who: "Maya Okafor", state: "In review" },
];

// Cell: the press kit's key image moving through its approval stages in Assets, locked once the last one says yes.
export function PressKitApprovalRender() {
  return (
    <div className={cn("mx-auto w-[470px] overflow-hidden text-[12px]", CARD)}>
      <div className={cn("flex items-center gap-2 border-b px-4 py-3", LINE)}>
        <AppMark id="assets" size={20} />
        <span className="truncate font-medium">arc-sand-key-image.jpg</span>
        <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] text-foreground/80">
          <Dot tone="amber" /> In Review
        </span>
      </div>
      <div className="flex gap-4 p-4">
        <ArcPhoto className="h-[120px] w-[150px] shrink-0 rounded-lg" />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          {STAGES.map((stage, index) => (
            <div key={stage.name} className={cn("flex items-center gap-2 rounded-lg border border-foreground/[0.08] px-2.5 py-2", styles.popIn)} style={{ "--pop-delay": `${0.3 + index * 0.15}s` }}>
              <span className={cn("flex size-5 shrink-0 items-center justify-center rounded-full", stage.state === "Approved" ? "bg-emerald-500 text-background" : "border border-amber-500/60 text-amber-600 dark:text-amber-400")}>
                {stage.state === "Approved" ? <Check className="size-3" strokeWidth={3} /> : <Clock className="size-3" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-foreground/90">{stage.name}</span>
                <span className="block truncate text-[10px] text-muted-foreground">{stage.who}</span>
              </span>
              <span className="text-[10px] text-muted-foreground">{stage.state}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={cn("flex items-center gap-2 border-t px-4 py-2.5 text-[11px] text-muted-foreground", LINE)}>
        <Lock className="size-3.5" /> The approved version locks when the last stage signs off.
      </div>
    </div>
  );
}

// Cell: the launch site asks the delivery API for the launch page by its slug and builds the hero from the answer.
export function LaunchApiRender() {
  return (
    <div className="relative mx-auto h-[320px] w-[470px]">
      <div className="absolute top-0 left-0 w-[300px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card dark:bg-surface-subtle">
        <div className={cn("flex items-center gap-2 border-b px-3.5 py-2.5", LINE)}>
          <Method verb="GET" />
          <span className="truncate font-mono text-[11px] text-foreground/85">…/launch-pages/arc</span>
        </div>
        <CodeBlock
          className="px-3.5 py-2.5 text-[11px]"
          lines={[
            ["{", 0],
            ['"data": {', 1],
            ['"slug": "arc",', 2],
            ['"headline": "Hear more, carry less",', 2, "focus"],
            ['"on_sale": "2027-03-04",', 2],
            ['"hero_image": { "url": "…" },', 2],
            ['"event": "arc-night"', 2],
            ["}", 1],
            ["}", 0],
          ]}
        />
      </div>
      <div className={cn("absolute top-[54px] right-0 z-[2] w-[220px] overflow-hidden rounded-xl border border-foreground/[0.12] bg-surface-card shadow-2xl shadow-black/30 dark:bg-surface-dialog", styles.float)}>
        <div className={cn("flex h-7 items-center gap-1.5 border-b px-2.5", LINE)}>
          <span className="size-2 rounded-full bg-foreground/15" />
          <span className="size-2 rounded-full bg-foreground/15" />
          <span className="ml-1 truncate text-[10px] text-muted-foreground">hollis.example/arc</span>
        </div>
        <div className="relative h-[130px]">
          <ArcPhoto className="absolute inset-0 size-full" />
          <div className="absolute inset-x-3 bottom-3">
            <MonoLabel className="text-[9px]">On sale 4 March</MonoLabel>
            <div className="mt-0.5 text-[14px] leading-tight font-semibold tracking-[-0.02em]">Hear more, carry less</div>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-2.5">
          <HollisMark className="size-4" />
          <span className="text-[11px] text-muted-foreground">Arc · £249</span>
          <span className="ml-auto rounded-full bg-foreground px-2.5 py-1 text-[10px] font-medium text-background">Buy</span>
        </div>
      </div>
    </div>
  );
}

// Cell: approved press-kit files filed and tagged by an Assets workflow, then announced through a webhook.
export function PressKitWorkflowRender() {
  const steps = [
    { icon: Eye, title: "When", body: "An asset is approved" },
    { icon: FolderInput, title: "Move", body: "To Arc / Press kit" },
    { icon: TagIcon, title: "Tag", body: "press-kit, arc" },
    { icon: Webhook, title: "Webhook", body: "Tell the press site" },
  ];
  return (
    <div className={cn("mx-auto w-[470px] p-4 text-[12px]", CARD)}>
      <div className="flex items-center gap-2">
        <LayoutDashboard className="size-4 text-muted-foreground" />
        <span className="text-[13px] font-medium">File the press kit</span>
        <Chip className="ml-auto h-5 px-2 text-[11px]" dot="emerald">
          On
        </Chip>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        {steps.map((step, index) => (
          <div key={step.title} className={cn("flex items-center gap-3 rounded-lg border border-foreground/[0.08] px-3 py-2", styles.popIn)} style={{ "--pop-delay": `${0.3 + index * 0.12}s` }}>
            <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-foreground/[0.06]">
              <step.icon className="size-3.5 text-muted-foreground" />
            </span>
            <span className="w-16 shrink-0 font-mono text-[10px] tracking-[0.06em] text-muted-foreground uppercase">{step.title}</span>
            <span className="truncate text-foreground/90">{step.body}</span>
            <ChevronDown className="ml-auto size-3.5 -rotate-90 text-muted-foreground" />
          </div>
        ))}
      </div>
    </div>
  );
}

const TITLE_VARIANTS = [
  { name: "Control", title: "Arc early access", views: "1,240", submits: 384, conversion: 31.0, control: true },
  { name: "Variant B", title: "Hear Arc before anyone else", views: "1,240", submits: 446, conversion: 36.0, lift: "+16.1%" },
];

// Cell: two titles for the early-access form, split evenly, with the winner marked by a significance test.
export function TitleTestRender() {
  return (
    <div className={cn("mx-auto w-[460px] p-4 text-[13px]", CARD)}>
      <div className="flex items-center gap-2">
        <FlaskConical className="size-4 text-muted-foreground" />
        <span className="font-semibold">A/B Testing</span>
        <Select className="ml-auto">Arc early access</Select>
      </div>
      <div className="mt-3 flex flex-col gap-2.5">
        {TITLE_VARIANTS.map((variant, index) => (
          <div key={variant.name} className={cn("rounded-lg border p-3", variant.control ? "border-foreground/[0.09]" : "border-emerald-500/25 bg-emerald-500/[0.04]")}>
            <div className="flex items-center gap-2">
              <span className="font-medium">{variant.name}</span>
              {variant.control ? (
                <span className="rounded-md bg-foreground/[0.07] px-1.5 text-[11px] leading-5">Control</span>
              ) : (
                <span className={cn("rounded-md bg-emerald-500/15 px-1.5 text-[11px] leading-5 text-emerald-700 dark:text-emerald-300", styles.popIn)} style={{ "--pop-delay": "1.2s" }}>
                  Winning · p=0.008
                </span>
              )}
              {variant.lift ? <span className="ml-auto text-[12px] text-emerald-600 tabular-nums dark:text-emerald-400">{variant.lift}</span> : null}
            </div>
            <div className="mt-1 truncate text-[12px] text-muted-foreground">Title: “{variant.title}”</div>
            <div className="mt-2.5 flex items-center gap-3 text-[11px] text-muted-foreground tabular-nums">
              <span>{variant.views} views</span>
              <span>{variant.submits} submissions</span>
              <span className="ml-auto flex w-[130px] items-center gap-2">
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/[0.07]">
                  <span
                    className={cn("block h-full origin-left rounded-full", styles.fill, variant.control ? "bg-foreground/45" : "bg-emerald-500")}
                    style={{ width: `${variant.conversion * 2}%`, "--fill-delay": `${0.3 + index * 0.25}s` }}
                  />
                </span>
                <span className="text-foreground/90">{variant.conversion.toFixed(1)}%</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Daily [views, conversions] as bar heights, rising into launch week.
const METRIC_DAYS = [
  [30, 4],
  [34, 5],
  [33, 4],
  [41, 6],
  [46, 8],
  [44, 7],
  [52, 9],
  [58, 11],
  [55, 10],
  [66, 13],
  [74, 15],
  [70, 14],
  [86, 19],
  [96, 22],
];
const METRIC_ENTRIES = [
  ["Arc launch page", "6,420", "318"],
  ["Arc: built for the commute", "2,875", "104"],
  ["What reviewers said about Arc", "1,960", "57"],
];

// Cell: the launch entries' daily views and conversions, collected through the delivery API.
export function LaunchMetricsRender() {
  return (
    <div className="mx-auto w-[460px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card text-[13px] dark:bg-surface-subtle">
      <div className={cn("flex items-center gap-3 border-b px-4 py-2.5", LINE)}>
        <span className="font-medium">Traffic trend</span>
        <span className="ml-auto flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-sm bg-foreground/30" /> Views
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-sm bg-emerald-500" /> Conversions
          </span>
        </span>
      </div>
      <div className="flex h-[96px] items-end gap-[7px] px-4 pt-3 pb-2">
        {METRIC_DAYS.map(([views, conversions], index) => (
          <div key={index} className={cn("relative flex-1", styles.popIn)} style={{ height: `${views}%`, "--pop-delay": `${0.1 + index * 0.04}s` }}>
            <span className="absolute inset-0 rounded-t-[3px] bg-foreground/[0.16]" />
            <span className="absolute inset-x-0 bottom-0 rounded-t-[3px] bg-emerald-500/80" style={{ height: `${(conversions / views) * 100 * 1.6}%` }} />
          </div>
        ))}
      </div>
      <div className={cn("grid grid-cols-[minmax(0,1fr)_56px_44px] gap-3 border-y px-4 py-1.5 text-[11px] text-muted-foreground", LINE)}>
        <span>Entry</span>
        <span className="text-right">Views</span>
        <span className="text-right">Conv.</span>
      </div>
      {METRIC_ENTRIES.map(([entry, views, conversions]) => (
        <div key={entry} className={cn("grid grid-cols-[minmax(0,1fr)_56px_44px] gap-3 border-b px-4 py-2 last:border-b-0", LINE)}>
          <span className="truncate text-foreground/90">{entry}</span>
          <span className="text-right text-[12px] text-muted-foreground tabular-nums">{views}</span>
          <span className="text-right text-[12px] text-emerald-700 tabular-nums dark:text-emerald-400">{conversions}</span>
        </div>
      ))}
    </div>
  );
}
