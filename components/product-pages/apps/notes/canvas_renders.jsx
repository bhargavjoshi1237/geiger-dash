import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowRight,
  Braces,
  Check,
  Circle,
  Code2,
  Columns2,
  Diamond,
  Eraser,
  Eye,
  FileText,
  Hand,
  Image as ImageIcon,
  LayoutDashboard,
  Link2,
  Lock,
  Map as MapIcon,
  Minus,
  MousePointer2,
  Music,
  PanelsTopLeft,
  Pencil,
  Presentation,
  Save,
  Shapes,
  Sheet,
  Sigma,
  Goal,
  Square,
  SquareKanban,
  Type,
  ExternalLink,
  Video,
  Workflow,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AvatarStack, LINE, Typed, Window } from "@/components/product-pages/mock_kit";
import {
  BoardTile,
  Button,
  Column,
  CommentCard,
  Cursor,
  DocCard,
  MORE_TOOLS,
  Node,
  Note,
  NotesBar,
  NotesWindow,
  PANEL,
  Switch,
  TableCard,
  TodoCard,
  Toast,
  Wires,
} from "@/components/product-pages/apps/notes/notes_kit";
import styles from "@/components/product-pages/product_pages.module.css";

// The board tour for Fieldnote's Atlas Coffee launch: every kind of card, nested boards, Mermaid, sketches, embeds and export.

const PollIcon = MORE_TOOLS.find(([, label]) => label === "Poll")[0];

const BUDGET = [
  ["Photography", "Samuel", "2,400"],
  ["Print run", "Hana", "1,850"],
  ["Signage", "Theo", "3,100"],
  ["Launch event", "Clara", "4,200"],
];

// A bar chart card drawn from a table: bars rise in, labels underneath.
function BarChartCard({ at, w, h, bars, title, className }) {
  const max = Math.max(...bars.map((bar) => bar.value));
  return (
    <Node at={at} w={w} h={h} className={cn("flex flex-col p-3 text-[11px]", className)}>
      <div className="flex items-center gap-2 text-[12px] font-medium">
        {title}
        <span className="ml-auto flex items-center gap-1.5 text-[11px] font-normal text-muted-foreground">
          <span className="size-2 rounded-[2px] bg-foreground/45" /> Budget
        </span>
      </div>
      <div className="relative mt-3 flex flex-1 items-end gap-3 border-b border-foreground/[0.12] px-1">
        {[0.25, 0.5, 0.75].map((line) => (
          <span key={line} className="pointer-events-none absolute inset-x-0 border-t border-dashed border-foreground/[0.07]" style={{ bottom: `${line * 100}%` }} />
        ))}
        {bars.map((bar, index) => (
          <div key={bar.label} className="relative flex h-full flex-1 flex-col justify-end">
            <span
              className={cn("block origin-bottom rounded-t-[3px]", bar.strong ? "bg-foreground/60" : "bg-foreground/30", styles.popIn)}
              style={{ height: `${(bar.value / max) * 92}%`, "--pop-delay": `${0.5 + index * 0.12}s` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-1.5 flex gap-3 px-1 text-muted-foreground">
        {bars.map((bar) => (
          <span key={bar.label} className="flex-1 truncate text-center">
            {bar.label}
          </span>
        ))}
      </div>
    </Node>
  );
}

// A mind map: a filled root topic, branches drawn as curves, child topics as pills.
function MindMap({ at, className }) {
  const topics = [
    { label: "Packaging", x: 18, y: 26 },
    { label: "Menu boards", x: 250, y: 14 },
    { label: "Website", x: 286, y: 108 },
    { label: "Loyalty card", x: 236, y: 196 },
    { label: "Signage", x: 10, y: 186 },
    { label: "Bags", x: 0, y: 86, child: true },
    { label: "Cup sleeves", x: 70, y: 128, child: true },
  ];
  const root = { x: 160, y: 106 };
  const curves = [
    "M200 118 C 160 70, 120 44, 92 40",
    "M228 112 C 250 70, 270 40, 300 34",
    "M262 120 C 280 122, 290 124, 300 124",
    "M246 130 C 262 170, 270 196, 288 206",
    "M196 130 C 150 168, 110 196, 72 200",
    "M60 52 C 40 70, 36 80, 34 88",
    "M70 52 C 90 90, 100 112, 110 130",
  ];
  return (
    <div className={cn("absolute h-[240px] w-[400px]", className)} style={{ left: at[0], top: at[1] }}>
      <svg aria-hidden="true" className="absolute inset-0 size-full overflow-visible text-foreground">
        {curves.map((d) => (
          <path key={d} d={d} fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.5" />
        ))}
      </svg>
      <span className="absolute rounded-full bg-foreground px-4 py-2 text-[13px] font-semibold text-background shadow-md" style={{ left: root.x, top: root.y }}>
        Atlas Coffee
      </span>
      {topics.map((topic) => (
        <span
          key={topic.label}
          className={cn(
            "absolute rounded-full border px-3 py-1 whitespace-nowrap",
            topic.child ? "border-foreground/[0.1] bg-surface-card text-[11px] text-muted-foreground" : "border-foreground/[0.14] bg-surface-card text-[12px] text-foreground/90 shadow-sm",
          )}
          style={{ left: topic.x, top: topic.y }}
        >
          {topic.label}
        </span>
      ))}
    </div>
  );
}

// A café front drawn in the palette's greys, for image cards.
function CafePhoto({ className }) {
  return (
    <svg viewBox="0 0 220 130" preserveAspectRatio="xMidYMid slice" className={cn("text-foreground", className)} aria-hidden="true">
      <rect width="220" height="130" fill="currentColor" fillOpacity="0.08" />
      <rect x="0" y="96" width="220" height="34" fill="currentColor" fillOpacity="0.14" />
      <rect x="30" y="26" width="160" height="72" fill="currentColor" fillOpacity="0.12" />
      {Array.from({ length: 8 }, (_, index) => (
        <path key={index} d={`M${30 + index * 20} 26h20l-4 16h-12z`} fill="currentColor" fillOpacity={index % 2 ? 0.16 : 0.32} />
      ))}
      <rect x="44" y="52" width="58" height="38" rx="2" fill="currentColor" fillOpacity="0.18" />
      <rect x="118" y="52" width="26" height="46" rx="2" fill="currentColor" fillOpacity="0.28" />
      <rect x="154" y="52" width="24" height="24" rx="2" fill="currentColor" fillOpacity="0.18" />
      <circle cx="73" cy="71" r="9" fill="currentColor" fillOpacity="0.12" />
    </svg>
  );
}

// Hero: the Atlas Coffee workshop board, dense with columns, a mind map, a table feeding a chart, and a note being typed.
export function CanvasHeroWindow() {
  return (
    <NotesWindow crumbs={["Atlas Coffee rebrand — workshop"]} activeTool={0} className="h-[700px] w-[1180px]">
      <div className="absolute top-[24px] left-[36px]">
        <div className="text-[32px] leading-none font-semibold tracking-[-0.02em]">Atlas Coffee rebrand</div>
        <div className="mt-2 text-[12px] text-muted-foreground">Workshop board · Fieldnote × Atlas Coffee · 14 October</div>
      </div>
      <Column
        at={[36, 104]}
        w={214}
        title="Moodboard"
        items={["Warm neutrals, roasted browns", "Hand-drawn type for the menu boards", "Kraft paper, no gloss", ["Pull café photos from the visit", true]]}
      />
      <Column at={[266, 104]} w={214} title="Voice" items={["Plain-spoken, a little dry", "No coffee puns"]}>
        <div className="rounded-[5px] border border-foreground/40 bg-surface-card px-2.5 py-2 leading-[1.4] ring-1 ring-foreground/20 dark:bg-foreground/[0.06]">
          <Typed text="Lead with the roastery, not the cup" delay={1.4} />
        </div>
      </Column>
      <Cursor at={[440, 262]} />
      <Node at={[266, 302]} w={214} className="overflow-hidden">
        <CafePhoto className="block h-[118px] w-full" />
        <div className="px-2.5 py-1.5 text-[11px] text-muted-foreground">Harbour café, Saturday 9am</div>
      </Node>
      <TodoCard at={[36, 400]} w={214} items={[["Print the moodboard", true], ["Book the roastery visit", true], ["Send Atlas the agenda", false]]} />

      <MindMap at={[520, 36]} />
      <BoardTile at={[936, 30]} w={174} label="Research wall" />
      <DocCard at={[936, 96]} w={174} title="Brand brief v3" lines={[90, 74, 84]} />

      <div className="absolute top-[318px] left-[520px] text-[12px] text-muted-foreground">Cup sizes and prices</div>
      <TableCard
        at={[520, 340]}
        w={280}
        columns={["Size", "Volume", "Price"]}
        rows={[
          ["Small", "8 oz", "£2.80"],
          ["Regular", "12 oz", "£3.40"],
          ["Large", "16 oz", "£3.90"],
        ]}
        numeric={[2]}
      />
      <Wires paths={[{ d: "M800 380 C 820 380, 828 372, 846 372", dashed: true, flow: true, arrow: true }]} />
      <BarChartCard
        at={[850, 300]}
        w={250}
        h={196}
        title="Price by size"
        bars={[
          { label: "Small", value: 2.8 },
          { label: "Regular", value: 3.4, strong: true },
          { label: "Large", value: 3.9 },
        ]}
      />
      <CommentCard at={[520, 486]} w={280} name="Theo Lindqvist">
        Can the sleeve carry the origin? Atlas want to talk about the farms.
      </CommentCard>
    </NotesWindow>
  );
}

// The More tools popover: every tool not in the toolbar, ready to drag onto the board.
function MoreToolsPopover({ dragging = "Poll", className, style }) {
  return (
    <div className={cn(PANEL, "w-[300px] p-3 text-[11px]", className)} style={style}>
      <p className="text-muted-foreground">Drag any tool onto the canvas.</p>
      <div className="mt-2.5 grid grid-cols-3 gap-1.5">
        {MORE_TOOLS.map(([Icon, label]) => (
          <span
            key={label}
            className={cn(
              "flex flex-col items-center gap-1 rounded-lg border px-1 py-2",
              label === dragging ? "border-dashed border-foreground/30 text-foreground/40" : "border-foreground/[0.08] text-muted-foreground",
            )}
          >
            <Icon className="size-4" strokeWidth={1.75} />
            <span className="max-w-full truncate">{label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// A Mermaid flowchart, rendered: brief to concepts, a sign-off that loops back, then artwork and print.
function FlowPreview({ className }) {
  const box = "absolute flex items-center justify-center rounded-[4px] border border-foreground/30 bg-foreground/[0.05] text-[10.5px] whitespace-nowrap text-foreground/85";
  return (
    <div className={cn("relative h-[150px] w-[214px]", className)}>
      <svg aria-hidden="true" className="absolute inset-0 size-full overflow-visible text-foreground">
        <defs>
          <marker id="flow-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill="currentColor" fillOpacity="0.55" />
          </marker>
        </defs>
        {["M48 32 L64 32", "M130 32 L144 32", "M178 54 L178 82", "M178 108 L178 122", "M164 46 C 150 76, 112 76, 100 46"].map((d) => (
          <path key={d} d={d} fill="none" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.2" markerEnd="url(#flow-arrow)" />
        ))}
        <path d="M146 32 L178 11 L210 32 L178 53 Z" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeOpacity="0.4" />
        <text x="124" y="80" className="fill-muted-foreground text-[9px]">
          No
        </text>
        <text x="184" y="72" className="fill-muted-foreground text-[9px]">
          Yes
        </text>
      </svg>
      <span className={box} style={{ left: 0, top: 20, width: 48, height: 24 }}>
        Brief
      </span>
      <span className={box} style={{ left: 66, top: 20, width: 64, height: 24 }}>
        Concepts
      </span>
      <span className="absolute w-[64px] text-center text-[9.5px] text-foreground/85" style={{ left: 146, top: 25 }}>
        Sign-off
      </span>
      <span className={box} style={{ left: 146, top: 84, width: 64, height: 24 }}>
        Artwork
      </span>
      <span className={box} style={{ left: 146, top: 124, width: 64, height: 22 }}>
        Print
      </span>
    </div>
  );
}

// An embed card's header: the provider, the link's host and the open-in-a-new-tab button.
function EmbedHeader({ icon: Icon, name, host }) {
  return (
    <div className={cn("flex h-8 items-center gap-2 border-b px-3 text-[11px]", LINE)}>
      <Icon className="size-3.5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
      <span className="font-medium text-foreground/90">{name}</span>
      <span className="min-w-0 flex-1 truncate text-muted-foreground">{host}</span>
      <ExternalLink className="size-3 shrink-0 text-muted-foreground" />
    </div>
  );
}

// A menu board drawn for the Figma embed.
function MenuBoardArt({ className }) {
  return (
    <div className={cn("flex flex-col gap-2 bg-neutral-900 px-4 py-3 text-neutral-200", className)}>
      <div className="flex items-baseline justify-between">
        <span className="text-[13px] font-semibold tracking-[-0.01em]">Atlas Coffee</span>
        <span className="font-mono text-[8px] tracking-[0.14em] text-neutral-500 uppercase">Roasted on site</span>
      </div>
      {[
        ["Flat white", "3.40"],
        ["Filter, single origin", "3.10"],
        ["Cortado", "3.00"],
      ].map(([item, price]) => (
        <div key={item} className="flex items-baseline gap-2 text-[10px]">
          <span>{item}</span>
          <span className="flex-1 border-b border-dotted border-neutral-700" />
          <span className="tabular-nums">{price}</span>
        </div>
      ))}
    </div>
  );
}

// Section stage: the Launch plan board with a table feeding a chart, a Mermaid flow and an embed, and More tools open beside the rail.
export function BoardStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <NotesWindow crumbs={["Launch plan"]} activeTool={-1} moreOpen className="absolute top-0 left-0 h-[660px] w-[1000px]">
        <div className="absolute top-[18px] left-[24px]">
          <div className="text-[20px] font-bold tracking-[-0.015em]">Launch plan</div>
          <div className="mt-1 text-[11.5px] text-muted-foreground">Atlas Coffee · opens 7 November</div>
        </div>
        <TableCard at={[330, 20]} w={290} columns={["Line", "Owner", "Budget"]} rows={BUDGET} numeric={[2]} />
        <Wires paths={[{ d: "M620 86 C 632 86, 636 96, 646 96", dashed: true, flow: true, arrow: true }]} />
        <BarChartCard
          at={[650, 20]}
          w={276}
          h={206}
          title="Launch budget"
          bars={[
            { label: "Photos", value: 2400 },
            { label: "Print", value: 1850 },
            { label: "Signage", value: 3100 },
            { label: "Event", value: 4200, strong: true },
          ]}
        />
        <Node at={[330, 246]} w={290} h={188} className="flex items-center justify-center">
          <FlowPreview />
        </Node>
        <Node at={[650, 246]} w={276} className="overflow-hidden">
          <EmbedHeader icon={PanelsTopLeft} name="Figma" host="figma.com" />
          <MenuBoardArt className="h-[120px]" />
        </Node>
        <Column at={[24, 404]} w={270} title="Launch week" items={["Roastery shoot, Tuesday", "Press kit to Atlas — Hana", ["Menu boards to print", true]]} />
        <Node at={[330, 454]} w={290} className="p-3 text-[12px]">
          <div className="flex items-center gap-2">
            <span className="font-medium">Launch readiness</span>
            <span className="ml-auto text-muted-foreground tabular-nums">16 / 25</span>
          </div>
          <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-foreground/[0.08]">
            <span className={cn("block h-full w-[64%] origin-left rounded-full bg-emerald-500", styles.fill)} />
          </div>
          <div className="mt-2 text-[11px] text-muted-foreground">64% · rolled up from the launch to-dos</div>
        </Node>
        <div className={cn("absolute top-[420px] left-[650px] flex h-[110px] w-[250px] items-center justify-center rounded-md border-2 border-dashed border-foreground/25 bg-foreground/[0.03]", styles.popIn)} style={{ "--pop-delay": "0.8s" }}>
          <span className="flex items-center gap-1.5 rounded-md border border-foreground/[0.14] bg-surface-card px-2.5 py-1.5 text-[12px] shadow-lg dark:bg-surface-dialog">
            <PollIcon className="size-3.5 text-muted-foreground" strokeWidth={1.75} />
            Poll
          </span>
        </div>
        <Cursor at={[786, 482]} delay="-1.5s" />
      </NotesWindow>
      <div className={cn("absolute top-[92px] left-[58px] z-[3]", styles.float)}>
        <MoreToolsPopover />
      </div>
    </div>
  );
}

const CARD_STYLES = [
  { label: "Classic", className: "rounded-[2px] border border-foreground/25 bg-surface-card" },
  { label: "Soft", className: "rounded-lg border border-foreground/15 bg-surface-card shadow-md shadow-black/10" },
  { label: "Outline", className: "rounded-md border border-foreground/50 bg-transparent" },
  { label: "Sketch", sketch: true },
  { label: "Sticky", className: "rounded-none bg-foreground/[0.14] shadow-[2px_4px_6px_-2px_rgb(0_0_0/0.3)] -rotate-2" },
  { label: "Brutalist", className: "rounded-none border-2 border-foreground bg-surface-card shadow-[3px_3px_0_0_var(--foreground)]" },
  { label: "Elevated", className: "rounded-lg bg-surface-card shadow-lg shadow-black/25" },
  { label: "Glass", className: "rounded-lg border border-foreground/15 bg-linear-to-br from-foreground/[0.14] to-foreground/[0.03]" },
  { label: "Bubble", className: "rounded-2xl border border-foreground/15 bg-surface-card" },
  { label: "Accent", className: "rounded-md border border-foreground/15 border-l-[3px] border-l-foreground bg-surface-card" },
  { label: "Neon", className: "rounded-md border border-foreground/70 bg-transparent shadow-[0_0_10px_1px] shadow-foreground/30" },
  { label: "Blueprint", className: "rounded-sm border border-dashed border-foreground/45 bg-[linear-gradient(to_right,color-mix(in_oklab,var(--foreground)_8%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--foreground)_8%,transparent)_1px,transparent_1px)] bg-[size:8px_8px]" },
  { label: "Terminal", terminal: true },
];

function StyleSwatch({ item }) {
  if (item.sketch) {
    return (
      <svg viewBox="0 0 70 40" preserveAspectRatio="none" className="h-[36px] w-[70px] text-foreground" aria-hidden="true">
        <path d="M3 4 C 22 2, 48 5, 67 3 C 68 14, 66 26, 68 37 C 46 39, 24 36, 2 38 C 4 26, 1 15, 3 4 Z" fill="none" stroke="currentColor" strokeOpacity="0.6" strokeWidth="1.3" />
        <path d="M5 6 C 24 5, 46 7, 65 5" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1" />
        <path d="M12 16 C 26 15, 40 17, 54 15 M12 25 C 22 24, 32 26, 40 25" fill="none" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }
  if (item.terminal) {
    return (
      <span className="flex h-[36px] w-[70px] flex-col justify-center gap-1 rounded-[3px] bg-neutral-950 px-2 font-mono text-[7px] leading-none text-neutral-300">
        <span>&gt; brief_v3</span>
        <span className="text-neutral-500">ok_</span>
      </span>
    );
  }
  return (
    <span className={cn("flex h-[36px] w-[70px] flex-col justify-center gap-1.5 px-2.5", item.className)}>
      <span className="block h-1.5 w-[80%] rounded-full bg-foreground/30" />
      <span className="block h-1.5 w-[55%] rounded-full bg-foreground/15" />
    </span>
  );
}

// Cell: Settings › Defaults › Node style, with thirteen looks for every card.
export function CardStylesRender() {
  return (
    <div className="mx-auto h-[300px] w-[460px] rounded-xl border border-foreground/[0.09] bg-surface-card px-4 py-3.5 text-[12px] dark:bg-surface-subtle">
      <div className="flex items-center gap-2 text-[13px] font-medium">
        <Shapes className="size-4 text-muted-foreground" strokeWidth={1.75} /> Node style
      </div>
      <p className="mt-1 text-[11.5px] text-muted-foreground">How every node on the canvas looks. Applies to existing nodes too.</p>
      <div className="mt-2.5 grid grid-cols-5 gap-x-2 gap-y-1.5">
        {CARD_STYLES.map((item, index) => (
          <div
            key={item.label}
            className={cn("flex flex-col items-center gap-1 rounded-lg border px-1 pt-1.5 pb-1", item.label === "Soft" ? "border-foreground/30 bg-foreground/[0.05]" : "border-transparent", styles.popIn)}
            style={{ "--pop-delay": `${0.1 + index * 0.05}s` }}
          >
            <StyleSwatch item={item} />
            <span className={cn("flex items-center gap-1 text-[11px]", item.label === "Soft" ? "text-foreground" : "text-muted-foreground")}>
              {item.label === "Soft" ? <Check className="size-3" strokeWidth={2.5} /> : null}
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const SHAPES = ["Rectangle", "Rounded", "Pill", "Ellipse", "Diamond", "Triangle", "Hexagon", "Parallelogram", "Cylinder", "Star"];

// One of the shape card's ten outlines, drawn at w × h.
function ShapeOutline({ kind, w, h, strong = false, className, children }) {
  const paint = { fill: "currentColor", fillOpacity: strong ? 0.08 : 0.04, stroke: "currentColor", strokeOpacity: strong ? 0.7 : 0.5, strokeWidth: 1.4 };
  const star = Array.from({ length: 10 }, (_, index) => {
    const radius = index % 2 ? Math.min(w, h) * 0.22 : Math.min(w, h) / 2 - 1;
    const angle = -Math.PI / 2 + (index * Math.PI) / 5;
    return `${(w / 2 + Math.cos(angle) * radius).toFixed(1)},${(h / 2 + Math.sin(angle) * radius).toFixed(1)}`;
  }).join(" ");
  const ry = Math.max(3, h * 0.14);
  const shapes = {
    Rectangle: <rect x="1" y="1" width={w - 2} height={h - 2} {...paint} />,
    Rounded: <rect x="1" y="1" width={w - 2} height={h - 2} rx={Math.min(w, h) * 0.2} {...paint} />,
    Pill: <rect x="1" y="1" width={w - 2} height={h - 2} rx={(h - 2) / 2} {...paint} />,
    Ellipse: <ellipse cx={w / 2} cy={h / 2} rx={w / 2 - 1} ry={h / 2 - 1} {...paint} />,
    Diamond: <polygon points={`${w / 2},1 ${w - 1},${h / 2} ${w / 2},${h - 1} 1,${h / 2}`} {...paint} />,
    Triangle: <polygon points={`${w / 2},1 ${w - 1},${h - 1} 1,${h - 1}`} {...paint} />,
    Hexagon: <polygon points={`${w * 0.25},1 ${w * 0.75},1 ${w - 1},${h / 2} ${w * 0.75},${h - 1} ${w * 0.25},${h - 1} 1,${h / 2}`} {...paint} />,
    Parallelogram: <polygon points={`${w * 0.22},1 ${w - 1},1 ${w * 0.78},${h - 1} 1,${h - 1}`} {...paint} />,
    Cylinder: (
      <g {...paint}>
        <path d={`M1 ${ry} L1 ${h - ry} A ${w / 2 - 1} ${ry - 1} 0 0 0 ${w - 1} ${h - ry} L${w - 1} ${ry}`} />
        <ellipse cx={w / 2} cy={ry} rx={w / 2 - 1} ry={ry - 1} />
      </g>
    ),
    Star: <polygon points={star} {...paint} />,
  };
  return (
    <span className={cn("relative inline-flex items-center justify-center text-foreground", className)} style={{ width: w, height: h }}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="absolute inset-0 overflow-visible" aria-hidden="true">
        {shapes[kind]}
      </svg>
      {children ? <span className="relative px-2 text-center text-[11px] leading-tight text-foreground/90">{children}</span> : null}
    </span>
  );
}

// Cell: a review flow built from shape cards, with the ten shapes alongside.
export function ShapesRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[460px]">
      <div className="absolute top-2 left-0 h-[286px] w-[216px] overflow-hidden rounded-xl border border-foreground/[0.08] bg-foreground/[0.02]">
        <Wires
          paths={[
            { d: "M108 54 L108 74", arrow: true, strong: true },
            { d: "M108 140 L108 162", arrow: true, strong: true },
            { d: "M108 204 L108 216", arrow: true, strong: true },
            { d: "M170 108 C 204 108, 204 36, 174 36", arrow: true },
          ]}
        />
        <ShapeOutline kind="Pill" w={124} h={36} className="absolute top-[18px] left-[46px]">
          Brief in
        </ShapeOutline>
        <ShapeOutline kind="Diamond" w={124} h={64} strong className="absolute top-[76px] left-[46px]">
          On brief?
        </ShapeOutline>
        <ShapeOutline kind="Rounded" w={124} h={38} className="absolute top-[166px] left-[46px]">
          Concepts
        </ShapeOutline>
        <ShapeOutline kind="Cylinder" w={92} h={56} className="absolute top-[218px] left-[62px]">
          Archive
        </ShapeOutline>
        <span className="absolute top-[64px] left-[190px] text-[10px] text-muted-foreground">No</span>
        <span className="absolute top-[143px] left-[114px] text-[10px] text-muted-foreground">Yes</span>
      </div>
      <div className={cn(PANEL, "absolute top-[30px] right-0 w-[226px] p-2", styles.float)}>
        <div className="px-1.5 pb-2 text-[11px] text-muted-foreground">Shape</div>
        <div className="grid grid-cols-2 gap-1">
          {SHAPES.map((shape) => (
            <span key={shape} className={cn("flex items-center gap-2 rounded-md px-1.5 py-1.5 text-[11px]", shape === "Diamond" ? "bg-foreground/[0.07] text-foreground" : "text-foreground/75")}>
              <ShapeOutline kind={shape} w={18} h={14} strong={shape === "Diamond"} />
              <span className="truncate">{shape}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const TEXT_STYLES = [
  { label: "Heading 1", className: "text-[26px] leading-none font-bold tracking-[-0.02em]", sample: "Atlas Coffee" },
  { label: "Heading 2", className: "text-[20px] leading-tight font-bold tracking-[-0.015em]", sample: "Rebrand workshop" },
  { label: "Heading 3", className: "text-[15px] leading-tight font-semibold", sample: "Day one: discovery" },
  { label: "Body", className: "text-[12.5px] leading-[1.5] text-foreground/85", sample: "We spent the morning at the roastery and the afternoon in two of the cafés." },
  { label: "Caption", className: "text-[11px] text-muted-foreground", sample: "Notes by Hana Ito, 14 October" },
];

// Cell: text cards in every style, with the style picker open on the heading.
export function TextStylesRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[460px]">
      <div className="absolute top-3 left-0 flex w-[260px] flex-col gap-3">
        {TEXT_STYLES.map((style, index) => (
          <div key={style.label} className={cn(index === 1 && "rounded-[3px] outline-1 outline-offset-4 outline-foreground/40 outline-dashed")}>
            <div className={style.className}>{style.sample}</div>
          </div>
        ))}
      </div>
      <div className={cn(PANEL, "absolute top-[34px] right-0 w-[176px] p-1.5 text-[12px]")}>
        <div className="flex gap-1 border-b border-foreground/[0.07] px-1 pb-1.5">
          {[AlignLeft, AlignCenter, AlignRight].map((Icon, index) => (
            <span key={index} className={cn("flex size-7 items-center justify-center rounded-md", index === 0 ? "bg-foreground/[0.08] text-foreground" : "text-muted-foreground")}>
              <Icon className="size-3.5" />
            </span>
          ))}
          <Type className="ml-auto size-3.5 self-center text-muted-foreground" />
        </div>
        <div className="pt-1">
          {TEXT_STYLES.map((style) => (
            <div key={style.label} className={cn("flex items-center rounded-md px-2 py-1.5", style.label === "Heading 2" ? "bg-foreground/[0.07] text-foreground" : "text-foreground/75")}>
              {style.label}
              {style.label === "Heading 2" ? <Check className="ml-auto size-3.5" /> : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const PATTERNS = [
  { label: "Dots", style: { backgroundImage: "radial-gradient(color-mix(in oklab, var(--foreground) 30%, transparent) 1px, transparent 1.3px)", backgroundSize: "10px 10px" } },
  {
    label: "Lines",
    style: {
      backgroundImage:
        "linear-gradient(to right, color-mix(in oklab, var(--foreground) 14%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--foreground) 14%, transparent) 1px, transparent 1px)",
      backgroundSize: "10px 10px",
    },
  },
  {
    label: "Cross",
    style: {
      backgroundImage:
        "linear-gradient(to right, transparent 4px, color-mix(in oklab, var(--foreground) 32%, transparent) 4px 6px, transparent 6px), linear-gradient(to bottom, transparent 4px, color-mix(in oklab, var(--foreground) 32%, transparent) 4px 6px, transparent 6px)",
      backgroundSize: "12px 12px",
      maskImage: "radial-gradient(circle, #000 0 1.2px, transparent 1.4px)",
    },
  },
  { label: "None", style: {} },
];

function Segmented({ options, active }) {
  return (
    <span className="flex gap-0.5 rounded-md bg-foreground/[0.05] p-0.5">
      {options.map((option) => (
        <span key={option} className={cn("rounded-[5px] px-2 py-0.5 text-[11px]", option === active ? "bg-surface-card font-medium text-foreground shadow-sm dark:bg-foreground/[0.12]" : "text-muted-foreground")}>
          {option}
        </span>
      ))}
    </span>
  );
}

// Cell: the Settings dialog's Canvas tab, with the four patterns drawn.
export function CanvasSettingsRender() {
  return (
    <div className="mx-auto flex h-[300px] w-[460px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card text-[12px] dark:bg-surface-subtle">
      <div className={cn("w-[112px] shrink-0 border-r p-2", LINE)}>
        <div className="px-2 pt-1 pb-2 text-[13px] font-medium">Settings</div>
        {["General", "Canvas", "Defaults", "Account"].map((tab) => (
          <div key={tab} className={cn("rounded-md px-2 py-1.5", tab === "Canvas" ? "bg-foreground/[0.07] text-foreground" : "text-muted-foreground")}>
            {tab}
          </div>
        ))}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-3.5 p-4">
        <div>
          <div className="font-medium">Default pattern</div>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {PATTERNS.map((pattern) => (
              <div key={pattern.label} className="flex flex-col items-center gap-1">
                <span
                  className={cn("block h-[46px] w-full rounded-md border", pattern.label === "Dots" ? "border-foreground/40 ring-1 ring-foreground/20" : "border-foreground/[0.1]")}
                  style={pattern.style}
                />
                <span className={cn("text-[11px]", pattern.label === "Dots" ? "text-foreground" : "text-muted-foreground")}>{pattern.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span>Grid size</span>
          <Segmented options={["S", "M", "L"]} active="S" />
        </div>
        <div className="flex items-center justify-between">
          <span>Show minimap</span>
          <Switch on />
        </div>
        <div className="flex items-center justify-between">
          <span>Max zoom</span>
          <Segmented options={["2×", "4×", "8×"]} active="4×" />
        </div>
        <div className="flex items-center justify-between">
          <span>Fit to content on open</span>
          <Switch />
        </div>
      </div>
    </div>
  );
}

const RESEARCH = [
  { text: "I come for the flat white and stay for the pastries", at: [20, 46] },
  { text: "The menu board is hard to read from the queue", at: [176, 46] },
  { text: "Love that they roast on site", at: [20, 132] },
  { text: "Didn't know there was a loyalty card", at: [176, 132] },
  { text: "The bags look like every other roaster's", at: [20, 210] },
];

const STAFF = ["Regulars ask where the beans are from", "Sleeves tear when the cup is hot", "We hand-write the specials every morning"];

// Section stage: Launch plan with its sub-boards behind, and the Research wall open in front with breadcrumbs back.
export function NestedStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <NotesWindow crumbs={["Launch plan"]} activeTool={4} className="absolute top-0 left-0 h-[540px] w-[600px] opacity-85">
        <div className="absolute top-[18px] left-[24px] text-[20px] font-bold tracking-[-0.015em]">Launch plan</div>
        <BoardTile at={[24, 64]} w={236} label="Research wall" selected />
        <BoardTile at={[24, 130]} w={236} label="Atlas Coffee rebrand — workshop" />
        <BoardTile at={[24, 196]} w={236} label="Press kit" />
        <BoardTile at={[24, 262]} w={236} label="Launch day run sheet" />
        <Column at={[280, 64]} w={230} title="Decisions" items={["Kraft bags, one-colour print", "Launch at the harbour café", ["Book the photographer", true]]} />
        <Note at={[280, 290]} w={230}>
          Everything we heard from customers lives on the Research wall.
        </Note>
        <Cursor at={[214, 92]} />
      </NotesWindow>
      <div className="absolute top-[86px] left-[330px] z-[2]">
        <NotesWindow
          bar={<NotesBar crumbs={["Launch plan", "Research wall"]} />}
          activeTool={0}
          className="h-[580px] w-[670px]"
        >
          <div className="absolute top-[16px] left-[20px] text-[15px] font-semibold">What customers said</div>
          {RESEARCH.map((note, index) => (
            <div key={note.text} className={styles.popIn} style={{ "--pop-delay": `${0.3 + index * 0.1}s` }}>
              <Note at={note.at} w={144} className="bg-foreground/[0.07] dark:bg-foreground/[0.08]" style={{ rotate: `${[-1, 1.2, 0.6, -0.8, 1][index]}deg` }}>
                {note.text}
              </Note>
            </div>
          ))}
          <div className="absolute top-[16px] left-[348px] text-[15px] font-semibold">What staff said</div>
          {STAFF.map((text, index) => (
            <Note key={text} at={[348, 46 + index * 66]} w={230}>
              {text}
            </Note>
          ))}
          <Node at={[348, 252]} w={230} className="overflow-hidden">
            <CafePhoto className="block h-[104px] w-full" />
            <div className="px-2.5 py-1.5 text-[11px] text-muted-foreground">Queue at the harbour café</div>
          </Node>
          <CommentCard at={[20, 300]} w={300} name="Hana Ito">
            Five of nine customers mentioned the menu board. That goes to the top of the brief.
          </CommentCard>
        </NotesWindow>
      </div>
    </div>
  );
}

const MERMAID_CODE = [
  ["flowchart", " LR"],
  ["  A[Brief]", " --> B[Concepts]"],
  ["  B", " --> C{Sign-off}"],
  ["  C", " -- Yes --> D[Artwork]"],
  ["  C", " -- No --> B"],
  ["  D", " --> E[Print]"],
];

// Cell: a Mermaid card in Split view, code on the left and the diagram on the right.
export function MermaidSplitRender() {
  return (
    <div className="mx-auto h-[300px] w-[460px] overflow-hidden rounded-md border border-foreground/40 bg-surface-card shadow-lg ring-1 ring-foreground/20 dark:bg-surface-subtle">
      <div className={cn("flex items-center gap-1 border-b px-2 py-1.5", LINE)}>
        <Workflow className="mx-1 size-3.5 text-muted-foreground" strokeWidth={1.75} />
        <span className="mr-auto text-[11px] font-medium text-muted-foreground">Mermaid</span>
        {[
          [Eye, "Preview"],
          [Columns2, "Split"],
          [Code2, "Code"],
        ].map(([Icon, label]) => (
          <span key={label} className={cn("flex h-6 items-center gap-1 rounded-md px-2 text-[11px]", label === "Split" ? "bg-foreground/[0.08] text-foreground" : "text-muted-foreground")}>
            <Icon className="size-3" /> {label}
          </span>
        ))}
      </div>
      <div className="flex h-[262px]">
        <div className={cn("w-[42%] shrink-0 border-r bg-foreground/[0.02] px-2.5 py-3 font-mono text-[10px] leading-[1.8]", LINE)}>
          {MERMAID_CODE.map(([head, rest], index) => (
            <div key={index} className="flex gap-2 whitespace-pre">
              <span className="w-3 text-right text-muted-foreground/60 tabular-nums">{index + 1}</span>
              <span>
                <span className="text-foreground">{head}</span>
                <span className="text-muted-foreground">{rest}</span>
              </span>
            </div>
          ))}
          <div className="flex gap-2">
            <span className="w-3 text-right text-muted-foreground/60">7</span>
            <span className="whitespace-pre text-muted-foreground">
              {"  "}
              <Typed text="E --> F[Launch]" delay={1.4} />
            </span>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center overflow-hidden">
          <FlowPreview />
        </div>
      </div>
    </div>
  );
}

// Cell: a to-do card rolled up into a progress ring, and a table summed by a formula card.
export function RollupRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[460px] overflow-hidden rounded-xl border border-foreground/[0.08] bg-foreground/[0.02]">
      <Wires
        paths={[
          { d: "M214 72 C 240 72, 246 72, 270 72", arrow: true, flow: true, dashed: true },
          { d: "M214 222 C 240 222, 246 222, 270 222", arrow: true, flow: true, dashed: true },
        ]}
      />
      <TodoCard
        at={[14, 14]}
        w={200}
        className="gap-1.5 py-2.5"
        items={[
          ["Approve the wordmark", true],
          ["Order the kraft bags", true],
          ["Brief the photographer", true],
          ["Proof the menu boards", false],
        ]}
      />
      <Node at={[272, 18]} w={174} className="flex items-center gap-3 p-3">
        <svg width="54" height="54" viewBox="0 0 54 54" className="-rotate-90 text-foreground" aria-hidden="true">
          <circle cx="27" cy="27" r="22" fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="5" />
          <circle cx="27" cy="27" r="22" fill="none" strokeWidth="5" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 22 * 0.75} 200`} className="stroke-emerald-500" />
        </svg>
        <div>
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Goal className="size-3" /> Connected
          </div>
          <div className="text-[20px] font-medium tracking-[-0.01em] tabular-nums">75%</div>
          <div className="text-[11px] text-muted-foreground">3 of 4 done</div>
        </div>
      </Node>
      <TableCard
        at={[14, 156]}
        w={200}
        columns={["Line", "Budget"]}
        rows={[
          ["Photography", "2,400"],
          ["Print run", "1,850"],
          ["Signage", "3,100"],
        ]}
        numeric={[1]}
      />
      <Node at={[272, 166]} w={174} className="p-3">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Sigma className="size-3.5" /> Sum · Currency
        </div>
        <div className="mt-1 text-[12px] font-medium">Total budget</div>
        <div className="mt-0.5 text-[24px] font-medium tracking-[-0.02em] tabular-nums">£7,350</div>
      </Node>
    </div>
  );
}

// A hand-drawn stroke: the same path twice, slightly offset, like Excalidraw's rough lines.
function Rough({ d, className, strong = false }) {
  return (
    <g className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} strokeOpacity={strong ? 0.8 : 0.6} strokeWidth="1.8" />
      <path d={d} strokeOpacity="0.25" strokeWidth="1.2" transform="translate(1.2 -0.8)" />
    </g>
  );
}

const SKETCH_TOOLS = [Lock, Hand, MousePointer2, Square, Diamond, Circle, ArrowRight, Minus, Pencil, Type, ImageIcon, Eraser];

// Section stage: the Packaging sketch with three shapes selected, pushed onto the workshop board in front.
export function SketchStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <Window className="absolute top-0 left-0 h-[500px] w-[740px]">
        <NotesBar crumbs={["Packaging sketch"]} tools={false}>
          <AvatarStack names={["Theo Lindqvist", "Hana Ito"]} size={22} />
          <span className="flex items-center gap-1 text-[12px]">
            <Check className="size-3.5 text-emerald-500" /> Saved
          </span>
          <span className="flex items-center gap-1.5 rounded-lg border border-foreground/[0.1] px-2.5 py-1 text-[12px] font-medium">
            <Save className="size-3" /> Save
          </span>
        </NotesBar>
        <div className="relative flex-1 bg-background/40">
          <div className={cn(PANEL, "absolute top-3 left-1/2 z-[2] flex -translate-x-1/2 gap-0.5 rounded-lg p-1 shadow-md")}>
            {SKETCH_TOOLS.map((Icon, index) => (
              <span key={index} className={cn("flex size-7 items-center justify-center rounded-md text-muted-foreground", index === 2 && "bg-foreground/[0.1] text-foreground")}>
                <Icon className="size-3.5" strokeWidth={1.75} />
              </span>
            ))}
          </div>
          <svg viewBox="0 0 740 452" className="absolute inset-0 h-[452px] w-[740px] text-foreground" aria-hidden="true">
            <Rough d="M100 106 C 130 100, 210 100, 242 106 L 226 316 C 218 330, 126 330, 116 316 Z" strong />
            <Rough d="M92 94 C 140 84, 210 84, 252 94 L 250 110 C 200 104, 140 104, 92 110 Z" />
            <Rough d="M108 176 C 150 182, 200 182, 236 176 L 232 234 C 194 240, 152 240, 112 234 Z" strong />
            {[126, 146, 166, 186, 206].map((x) => (
              <path key={x} d={`M${x} 182 L ${x + 18} 234`} stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.2" />
            ))}
            <Rough d="M266 206 C 290 200, 310 200, 330 204" />
            <path d="M322 198 L 332 204 L 322 212" fill="none" stroke="currentColor" strokeOpacity="0.6" strokeWidth="1.8" strokeLinecap="round" />
            <Rough d="M350 136 C 390 126, 450 126, 490 136 C 502 176, 502 236, 490 276 C 450 286, 390 286, 350 276 C 338 236, 338 176, 350 136 Z" strong />
            <Rough d="M394 182 C 410 172, 440 172, 454 182 C 460 200, 452 218, 424 222 C 400 220, 388 202, 394 182 Z" />
            <Rough d="M540 88 C 580 84, 620 84, 668 88 M 540 126 C 580 122, 616 122, 650 126" />
          </svg>
          <span className="absolute top-[64px] left-[542px] -rotate-2 text-[14px] text-foreground/75 italic">sleeve: kraft, one colour</span>
          <span className="absolute top-[102px] left-[542px] rotate-1 text-[14px] text-foreground/75 italic">origin band on the bag</span>
          <span className="absolute top-[54px] left-[96px] -rotate-1 text-[13px] text-foreground/70 italic">12 oz cup</span>
          <div className="absolute top-[78px] left-[80px] h-[262px] w-[432px] rounded-[3px] border border-dashed border-foreground/50">
            {[
              [-4, -4],
              [428, -4],
              [-4, 258],
              [428, 258],
            ].map(([left, top]) => (
              <span key={`${left}-${top}`} className="absolute size-2 rounded-[2px] border border-foreground/60 bg-surface-card" style={{ left, top }} />
            ))}
          </div>
          <Cursor at={[300, 300]} name="Theo Lindqvist" tone={1} delay="-2s" />
          <Cursor at={[262, 424]} delay="-4s" />
          <div className="absolute bottom-3.5 left-4 flex items-center gap-2">
            <span className="flex h-8 items-center rounded-lg border border-foreground/[0.1] bg-surface-card px-2.5 text-[12px] text-muted-foreground tabular-nums dark:bg-surface-dialog">100%</span>
            <span className="flex h-8 items-center gap-1.5 rounded-lg border border-foreground/[0.1] bg-surface-card px-2.5 text-[12px] font-medium text-muted-foreground dark:bg-surface-dialog">
              <Link2 className="size-3" /> Link to Notes
            </span>
            <span className="flex h-8 items-center gap-1.5 rounded-lg border border-foreground/30 bg-foreground/[0.08] px-2.5 text-[12px] font-medium text-foreground">
              <Workflow className="size-3" /> Push to board
            </span>
          </div>
        </div>
      </Window>
      <div className={cn("absolute top-[196px] left-[480px] z-[2]", styles.float)}>
        <NotesWindow crumbs={["Atlas Coffee rebrand — workshop"]} rail={false} className="h-[320px] w-[520px]">
          <Wires
            paths={[
              { d: "M172 88 L 246 88", arrow: true, strong: true },
              { d: "M106 116 L 106 160", arrow: true, strong: true },
            ]}
          />
          {[
            { kind: "Rounded", w: 132, h: 56, at: [40, 60], label: "12 oz cup" },
            { kind: "Rectangle", w: 180, h: 56, at: [250, 60], label: "Sleeve: kraft, one colour" },
            { kind: "Ellipse", w: 170, h: 60, at: [22, 164], label: "Origin band on the bag" },
          ].map((shape, index) => (
            <div key={shape.label} className={cn("absolute", styles.popIn)} style={{ left: shape.at[0], top: shape.at[1], "--pop-delay": `${0.5 + index * 0.15}s` }}>
              <ShapeOutline kind={shape.kind} w={shape.w} h={shape.h} strong>
                {shape.label}
              </ShapeOutline>
            </div>
          ))}
        </NotesWindow>
      </div>
      <div className={cn("absolute top-[456px] left-[640px] z-[3]", styles.popIn)} style={{ "--pop-delay": "1.1s" }}>
        <Toast title="Added 3 nodes and 2 edges to Atlas Coffee rebrand — workshop" className="w-[340px]" />
      </div>
    </div>
  );
}

const EMBEDS = [
  [Video, "YouTube"],
  [Video, "Vimeo"],
  [Video, "Loom"],
  [PanelsTopLeft, "Figma"],
  [FileText, "Google Docs"],
  [Sheet, "Google Sheets"],
  [Presentation, "Google Slides"],
  [MapIcon, "Google Maps"],
  [Music, "Spotify"],
  [Code2, "CodePen"],
  [Code2, "CodeSandbox"],
  [SquareKanban, "Miro"],
];

// Cell: a Figma file and a Loom video embedded on the board, and the sources an embed card recognises.
export function EmbedsRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[460px]">
      <Node at={[0, 4]} w={250} className="overflow-hidden">
        <EmbedHeader icon={PanelsTopLeft} name="Figma" host="figma.com" />
        <MenuBoardArt className="h-[118px]" />
      </Node>
      <Node at={[0, 170]} w={250} className="overflow-hidden">
        <EmbedHeader icon={Video} name="Loom" host="loom.com" />
        <div className="relative flex h-[90px] items-center justify-center bg-foreground/[0.08]">
          <span className="flex size-9 items-center justify-center rounded-full bg-foreground/80">
            <span className="ml-0.5 size-0 border-y-[6px] border-l-[10px] border-y-transparent border-l-background" />
          </span>
          <span className="absolute right-2 bottom-1.5 rounded bg-foreground/70 px-1 text-[10px] text-background tabular-nums">4:12</span>
        </div>
      </Node>
      <div className="absolute top-[6px] right-0 flex w-[192px] flex-wrap gap-1.5">
        {EMBEDS.map(([Icon, name], index) => (
          <span
            key={name}
            className={cn(
              "inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-[11px] whitespace-nowrap",
              name === "Figma" || name === "Loom" ? "border-foreground/30 bg-foreground/[0.06] text-foreground" : "border-foreground/[0.1] text-muted-foreground",
              styles.popIn,
            )}
            style={{ "--pop-delay": `${0.15 + index * 0.06}s` }}
          >
            <Icon className="size-3" strokeWidth={1.75} />
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}

const FORMATS = [
  [Braces, "JSON", "Raw board data"],
  [FileText, "PDF", "Printable document"],
  [ImageIcon, "PNG", "Board layout image"],
  [AlignLeft, "TXT", "Plain text summary"],
];

// Cell: the Download Board dialog with PNG chosen.
export function ExportRender() {
  return (
    <div className={cn(PANEL, "mx-auto w-[420px] p-5 text-[13px] shadow-xl")}>
      <div className="flex items-center gap-2 text-[15px] font-semibold">
        <LayoutDashboard className="size-4 text-muted-foreground" strokeWidth={1.75} /> Download Board
      </div>
      <p className="mt-3 text-[12.5px] text-muted-foreground">
        Choose a format to export <span className="font-medium text-foreground">Launch plan</span>.
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {FORMATS.map(([Icon, label, description]) => (
          <div key={label} className={cn("flex items-center gap-3 rounded-lg border p-2.5", label === "PNG" ? "border-foreground/35 bg-foreground/[0.06]" : "border-foreground/[0.1] bg-foreground/[0.02]")}>
            <span className={cn("rounded-md p-2", label === "PNG" ? "bg-foreground/[0.12] text-foreground" : "bg-foreground/[0.06] text-muted-foreground")}>
              <Icon className="size-4" strokeWidth={1.75} />
            </span>
            <span className="min-w-0">
              <span className="block text-[13px] leading-tight font-semibold">{label}</span>
              <span className="block truncate text-[11px] text-muted-foreground">{description}</span>
            </span>
          </div>
        ))}
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <Button>Cancel</Button>
        <Button primary>Download</Button>
      </div>
    </div>
  );
}
