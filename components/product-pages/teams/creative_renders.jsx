import {
  Aperture,
  ArrowLeft,
  BadgeCheck,
  BarChart3,
  Calendar,
  Check,
  CheckCircle2,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  Clapperboard,
  Crop,
  Eye,
  FileJson,
  FileText,
  FolderInput,
  GitCompareArrows,
  GitMerge,
  History,
  Image,
  LayoutDashboard,
  Lock,
  Network,
  Palette,
  PanelsTopLeft,
  PenTool,
  Play,
  Plus,
  Rocket,
  Search,
  Share2,
  Sparkles,
  SquarePen,
  StickyNote,
  Table,
  Tag,
  Timer,
  Undo2,
  Upload,
  Users,
  Wand2,
  Webhook,
  Wrench,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AppMark, Avatar, AvatarStack, Chip, Dot, LINE, MonoLabel, Typed, Window } from "@/components/product-pages/mock_kit";
import {
  BoardTile,
  Button as NotesButton,
  CollabDialog,
  Column,
  CommentCard,
  Cursor,
  LaserTrail,
  Node,
  NotesBar,
  NotesWindow,
  SessionPill,
  TableCard,
  Toast,
  TodoCard,
  Wires,
  arcPoints,
} from "@/components/product-pages/apps/notes/notes_kit";
import { CANVAS_DOTS } from "@/components/product-pages/plan/plan_kit";
import { EditorNav, Segmented } from "@/components/product-pages/apps/assets/assets_kit";
import {
  CodeBlock,
  Input as ContentInput,
  Method,
  ScreenHead,
  StatsRow as ContentStats,
  StatusPill as ContentStatusPill,
  TypeTag,
} from "@/components/product-pages/apps/content/content_kit";
import styles from "@/components/product-pages/product_pages.module.css";

// Northcove's in-house brand team on Geiger: the Tidelines campaign board in Notes, the brand library and sign-off in Assets, and the site in Content.

// Placeholder photographs for Northcove, an outdoor clothing brand, drawn in foreground tints so they hold in light and dark.
function Scene({ scene }) {
  if (scene === "jacket") return <Jacket />;
  if (scene === "pack") return <Pack />;
  if (scene === "ridge") return <Ridge />;
  if (scene === "fabric") return <Fabric />;
  if (scene === "tent") return <Tent />;
  if (scene === "hood") return <Hood />;
  return <Cliffs />;
}

export function Photo({ scene = "cliffs", className, style }) {
  return (
    <svg viewBox="0 0 300 300" preserveAspectRatio="xMidYMid slice" className={cn("text-foreground", className)} style={style} aria-hidden="true">
      <Scene scene={scene} />
    </svg>
  );
}

// Sea cliffs at low tide with a walker on the headland: the campaign's key image.
function Cliffs() {
  return (
    <>
      <defs>
        <linearGradient id="nc-cliffs-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.2" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <rect width="300" height="300" fill="url(#nc-cliffs-sky)" />
      <circle cx="96" cy="92" r="24" fill="currentColor" fillOpacity="0.13" />
      <path d="M0 168 C 36 150 70 146 108 154 L 140 168 V300 H0Z" fill="currentColor" fillOpacity="0.14" />
      <rect y="184" width="300" height="116" fill="currentColor" fillOpacity="0.09" />
      {[198, 216, 238, 264].map((y, index) => (
        <path key={y} d={`M${8 + index * 10} ${y} q 18 -5 36 0 t 36 0 t 36 0 t 36 0`} fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.5" />
      ))}
      <path d="M300 112 C 274 112 252 124 238 146 C 224 168 216 196 212 300 H300Z" fill="currentColor" fillOpacity="0.34" />
      <path d="M300 150 C 284 152 270 162 262 180 C 254 200 250 240 248 300 H300Z" fill="currentColor" fillOpacity="0.14" />
      <circle cx="262" cy="98" r="4" fill="currentColor" fillOpacity="0.7" />
      <path d="M258 103 h8 l2 12 h-12 Z" fill="currentColor" fillOpacity="0.6" />
      <path d="M259 115 l-2 9 M265 115 l2 9" stroke="currentColor" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" />
    </>
  );
}

// The Drift rain jacket on a studio sweep, hood up and zipped.
function Jacket() {
  return (
    <>
      <defs>
        <linearGradient id="nc-jacket-sweep" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.15" />
          <stop offset="0.72" stopColor="currentColor" stopOpacity="0.06" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.11" />
        </linearGradient>
      </defs>
      <rect width="300" height="300" fill="url(#nc-jacket-sweep)" />
      <ellipse cx="150" cy="262" rx="78" ry="7" fill="currentColor" fillOpacity="0.14" />
      <path d="M114 96 L 84 214 L 100 220 L 124 126 Z M186 96 L 216 214 L 200 220 L 176 126 Z" fill="currentColor" fillOpacity="0.42" />
      <path d="M112 92 C 120 80 180 80 188 92 L 204 246 C 178 256 122 256 96 246 Z" fill="currentColor" fillOpacity="0.4" />
      <path d="M126 90 C 124 56 176 56 174 90 C 164 82 136 82 126 90 Z" fill="currentColor" fillOpacity="0.52" />
      <path d="M150 86 V 250" stroke="currentColor" strokeOpacity="0.55" strokeWidth="2.5" />
      <rect x="112" y="176" width="26" height="5" rx="2" fill="currentColor" fillOpacity="0.5" />
      <rect x="162" y="176" width="26" height="5" rx="2" fill="currentColor" fillOpacity="0.5" />
      <path d="M100 236 C 130 244 170 244 200 236" fill="none" stroke="currentColor" strokeOpacity="0.4" strokeWidth="2" />
    </>
  );
}

// The Fell 28 rucksack resting on a boulder.
function Pack() {
  return (
    <>
      <defs>
        <radialGradient id="nc-pack-light" cx="0.5" cy="0.3" r="0.6">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.18" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.04" />
        </radialGradient>
      </defs>
      <rect width="300" height="300" fill="url(#nc-pack-light)" />
      <path d="M40 300 C 52 236 96 214 150 212 C 206 210 250 232 264 300 Z" fill="currentColor" fillOpacity="0.2" />
      <rect x="104" y="92" width="92" height="136" rx="26" fill="currentColor" fillOpacity="0.42" />
      <path d="M104 118 C 104 96 120 84 150 84 C 180 84 196 96 196 118 Z" fill="currentColor" fillOpacity="0.55" />
      <rect x="120" y="150" width="60" height="52" rx="12" fill="currentColor" fillOpacity="0.28" />
      <path d="M136 84 C 136 64 164 64 164 84" fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="5" />
      <path d="M104 136 h-10 v54 h10 M196 136 h10 v54 h-10" fill="none" stroke="currentColor" strokeOpacity="0.4" strokeWidth="3" />
      <rect x="146" y="120" width="8" height="18" rx="2" fill="currentColor" fillOpacity="0.7" />
    </>
  );
}

// Layered ridgelines in morning mist, a walker with poles on the nearest crest.
function Ridge() {
  return (
    <>
      <defs>
        <linearGradient id="nc-ridge-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.08" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.18" />
        </linearGradient>
      </defs>
      <rect width="300" height="300" fill="url(#nc-ridge-sky)" />
      <circle cx="220" cy="80" r="20" fill="currentColor" fillOpacity="0.12" />
      <path d="M0 150 L 50 112 L 90 136 L 150 90 L 210 132 L 250 108 L 300 140 V300 H0Z" fill="currentColor" fillOpacity="0.1" />
      <path d="M0 190 L 60 150 L 120 182 L 180 140 L 240 176 L 300 158 V300 H0Z" fill="currentColor" fillOpacity="0.16" />
      <path d="M0 240 C 60 214 120 206 180 220 C 230 232 270 224 300 214 V300 H0Z" fill="currentColor" fillOpacity="0.28" />
      <circle cx="150" cy="190" r="4" fill="currentColor" fillOpacity="0.75" />
      <path d="M146 195 h8 l2 14 h-12 Z" fill="currentColor" fillOpacity="0.65" />
      <path d="M147 209 l-3 10 M153 209 l3 10 M142 198 l-6 22 M158 198 l6 22" stroke="currentColor" strokeOpacity="0.6" strokeWidth="1.6" strokeLinecap="round" />
    </>
  );
}

// A macro of the jacket's shell fabric with rain beading on it.
function Fabric() {
  const beads = [
    [52, 64, 9],
    [128, 40, 6],
    [214, 78, 11],
    [86, 150, 12],
    [182, 168, 7],
    [250, 206, 9],
    [40, 236, 7],
    [146, 240, 10],
    [236, 120, 5],
  ];
  return (
    <>
      <defs>
        <pattern id="nc-ripstop" width="14" height="14" patternUnits="userSpaceOnUse">
          <rect width="14" height="14" fill="currentColor" fillOpacity="0.17" />
          <path d="M0 0.5 H14 M0.5 0 V14" stroke="currentColor" strokeOpacity="0.16" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="300" height="300" fill="url(#nc-ripstop)" />
      {beads.map(([x, y, r]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r={r} fill="currentColor" fillOpacity="0.18" />
          <circle cx={x - r * 0.35} cy={y - r * 0.35} r={r * 0.3} fill="currentColor" fillOpacity="0.45" />
        </g>
      ))}
    </>
  );
}

// A lit tent on a hillside at dusk.
function Tent() {
  return (
    <>
      <defs>
        <linearGradient id="nc-tent-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.05" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.16" />
        </linearGradient>
        <radialGradient id="nc-tent-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.32" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="300" height="300" fill="url(#nc-tent-sky)" />
      {[
        [40, 40],
        [90, 66],
        [180, 34],
        [250, 58],
        [220, 96],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" fill="currentColor" fillOpacity="0.5" />
      ))}
      <path d="M0 200 C 70 168 160 160 300 186 V300 H0Z" fill="currentColor" fillOpacity="0.22" />
      <circle cx="150" cy="190" r="70" fill="url(#nc-tent-glow)" />
      <path d="M112 214 L 150 156 L 188 214 Z" fill="currentColor" fillOpacity="0.5" />
      <path d="M140 214 L 150 182 L 160 214 Z" fill="currentColor" fillOpacity="0.75" />
    </>
  );
}

// A head-and-shoulders portrait in the jacket, hood up against the wind.
function Hood() {
  return (
    <>
      <defs>
        <radialGradient id="nc-hood-bg" cx="0.5" cy="0.36" r="0.64">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.18" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.05" />
        </radialGradient>
      </defs>
      <rect width="300" height="300" fill="url(#nc-hood-bg)" />
      <path d="M50 300 C 56 232 100 206 150 206 C 200 206 244 232 250 300 Z" fill="currentColor" fillOpacity="0.36" />
      <path d="M150 210 V 300" stroke="currentColor" strokeOpacity="0.5" strokeWidth="2.5" />
      <path d="M96 150 C 92 84 120 64 150 64 C 180 64 208 84 204 150 C 200 196 178 214 150 214 C 122 214 100 196 96 150 Z" fill="currentColor" fillOpacity="0.46" />
      <ellipse cx="150" cy="148" rx="34" ry="42" fill="currentColor" fillOpacity="0.24" />
      <path d="M120 140 C 124 116 176 116 180 140" fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
    </>
  );
}

// Northcove's mark: a peak over two tide lines inside a ring.
export function NorthcoveMark({ className }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("text-foreground", className)} fill="none" aria-hidden="true">
      <circle cx="20" cy="20" r="18" stroke="currentColor" strokeOpacity="0.8" strokeWidth="2" />
      <path d="M9 24 L 17 13 L 21 18 L 24 15 L 31 24" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M10 28 q 2.5 -2 5 0 t 5 0 t 5 0 t 5 0" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

const TEAM = ["Priya Raman", "Jonas Becker", "Leila Haddad", "Tom Ashworth", "Sofia Marin"];

// Who's on the board in a live session, the person you're following ringed, then the laser.
function SessionCluster({ me = "Jonas Becker", following, laser = false }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="mr-1 flex -space-x-1.5">
        {TEAM.filter((name) => name !== me).map((name) => (
          <span key={name} className={cn("rounded-full", following === name && "ring-2 ring-foreground ring-offset-2 ring-offset-surface-card dark:ring-offset-surface-subtle")}>
            <Avatar name={name} size={26} />
          </span>
        ))}
      </span>
      <span className={cn("flex size-8 items-center justify-center rounded-md text-muted-foreground", laser && "bg-foreground/[0.08] text-red-500")}>
        <Wand2 className="size-4" strokeWidth={1.75} />
      </span>
    </div>
  );
}

// An image card: the photo with its caption underneath.
function ImageCard({ at, w = 150, h = 104, scene, caption, selected, className }) {
  return (
    <Node at={at} w={w} selected={selected} className={cn("overflow-hidden", className)}>
      <Photo scene={scene} className="block w-full" style={{ height: h }} />
      {caption ? <div className="truncate px-2.5 py-1.5 text-[11px] text-muted-foreground">{caption}</div> : null}
    </Node>
  );
}

// An embedded video: the provider and host over a still with a play button.
function VideoEmbed({ at, w = 300, h = 150, provider = "Vimeo", host = "vimeo.com", scene = "cliffs", length = "1:24", className }) {
  return (
    <Node at={at} w={w} className={cn("overflow-hidden", className)}>
      <div className={cn("flex h-8 items-center gap-2 border-b px-3 text-[11px]", LINE)}>
        <Play className="size-3.5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
        <span className="font-medium text-foreground/90">{provider}</span>
        <span className="min-w-0 flex-1 truncate text-muted-foreground">{host}</span>
      </div>
      <div className="relative" style={{ height: h }}>
        <Photo scene={scene} className="block size-full" />
        <span className="absolute top-1/2 left-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-foreground/80">
          <span className="ml-0.5 size-0 border-y-[7px] border-l-[11px] border-y-transparent border-l-background" />
        </span>
        <span className="absolute right-2 bottom-1.5 rounded bg-foreground/70 px-1 text-[10px] text-background tabular-nums">{length}</span>
      </div>
    </Node>
  );
}

// A mind map: the filled root topic, branches as curves, topics as pills; positions are local to the card.
function MindMap({ at, root, topics, curves, w = 300, h = 220, className }) {
  return (
    <div className={cn("absolute", className)} style={{ left: at[0], top: at[1], width: w, height: h }}>
      <svg aria-hidden="true" className="absolute inset-0 size-full overflow-visible text-foreground">
        {curves.map((d) => (
          <path key={d} d={d} fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.5" />
        ))}
      </svg>
      <span className="absolute rounded-full bg-foreground px-4 py-2 text-[13px] font-semibold text-background shadow-md" style={{ left: root.x, top: root.y }}>
        {root.label}
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

const MOODBOARD = [
  { scene: "cliffs", caption: "Low tide, St Agnes" },
  { scene: "hood", caption: "Hood up, side light" },
  { scene: "fabric", caption: "Rain on the shell" },
  { scene: "ridge", caption: "First light on the ridge" },
  { scene: "pack", caption: "Fell 28 on the boulder" },
  { scene: "tent", caption: "Pitch at dusk" },
];

const CAMPAIGN_MAP = {
  root: { label: "Tidelines", x: 104, y: 92 },
  topics: [
    { label: "Mood film", x: 6, y: 14 },
    { label: "Stills", x: 196, y: 6 },
    { label: "Shop windows", x: 200, y: 168 },
    { label: "Site", x: 228, y: 96 },
    { label: "Social", x: 0, y: 170 },
    { label: "6 × 15s cut-downs", x: 0, y: 64, child: true },
  ],
  curves: [
    "M128 98 C 100 60, 80 40, 66 30",
    "M168 96 C 186 60, 200 34, 222 22",
    "M190 112 C 206 110, 216 110, 228 110",
    "M178 124 C 196 150, 210 166, 226 176",
    "M120 124 C 90 150, 66 168, 40 178",
    "M40 34 C 34 46, 30 56, 30 64",
  ],
};

const PALETTE = [
  { name: "Tide", swatch: "bg-teal-700" },
  { name: "Kelp", swatch: "bg-lime-800" },
  { name: "Sand", swatch: "bg-stone-300" },
  { name: "Flare", swatch: "bg-orange-600" },
];

// A palette card on the board: the campaign's swatches with their names underneath.
function PaletteCard({ at, w = 170, compact = false }) {
  return (
    <Node at={at} w={w} className="p-2.5 text-[11px]">
      <div className="mb-2 flex items-center gap-1.5 font-medium">
        <Palette className="size-3 text-muted-foreground" strokeWidth={2} />
        Tidelines palette
      </div>
      <div className="grid grid-cols-4 gap-1">
        {PALETTE.map((colour) => (
          <span key={colour.name} className={cn("rounded-[4px] ring-1 ring-foreground/10 ring-inset", compact ? "h-8" : "h-12", colour.swatch)} />
        ))}
      </div>
      <div className="mt-1.5 grid grid-cols-4 gap-1 text-[10px] text-muted-foreground">
        {PALETTE.map((colour) => (
          <span key={colour.name} className="truncate">
            {colour.name}
          </span>
        ))}
      </div>
    </Node>
  );
}

// Hero: Jonas's view of the Tidelines campaign board in a live session, following Priya while she circles a shot with the laser.
export function CampaignHeroWindow() {
  return (
    <NotesWindow
      bar={
        <NotesBar crumbs={["Spring 27", "Tidelines"]} live>
          <SessionCluster following="Priya Raman" laser />
        </NotesBar>
      }
      activeTool={10}
      className="h-[700px] w-[1180px]"
    >
      <div className="absolute top-[22px] left-[32px]">
        <div className="text-[30px] leading-none font-semibold tracking-[-0.02em]">Tidelines</div>
        <div className="mt-2 text-[12px] text-muted-foreground">Spring 2027 campaign · Northcove brand team · shoot 14 to 16 January</div>
      </div>
      {MOODBOARD.map((photo, index) => (
        <ImageCard key={photo.caption} at={[32 + (index % 3) * 162, 92 + Math.floor(index / 3) * 150]} scene={photo.scene} caption={photo.caption} selected={index === 0} />
      ))}
      <LaserTrail points={arcPoints(108, 150, 96, 74, Math.PI * 0.9, Math.PI * 2.3, 24)} />
      <VideoEmbed at={[540, 92]} w={300} h={148} />
      <Column at={[540, 300]} w={300} title="Headlines" items={["Made for the weather you actually get", "Low tide, high ground"]}>
        <div className="rounded-[5px] border border-foreground/40 bg-surface-card px-2.5 py-2 leading-[1.4] ring-1 ring-foreground/20 dark:bg-foreground/[0.06]">
          <Typed text="Out past the last bus stop" delay={1.4} />
        </div>
      </Column>
      <MindMap at={[870, 92]} {...CAMPAIGN_MAP} w={250} />
      <TodoCard
        at={[870, 336]}
        w={230}
        items={[
          ["Drift jacket, three colourways", true],
          ["Fell 28 on the boulder", true],
          ["Hood up, wind from the left", false],
          ["Macro of rain on the shell", false],
        ]}
      />
      <CommentCard at={[32, 410]} w={300} name="Sofia Marin">
        Keep the logo off the hero shots. Let the coast do the talking.
      </CommentCard>
      <PaletteCard at={[350, 410]} w={170} compact />
      <Cursor at={[214, 214]} name="Priya Raman" tone={0} />
      <Cursor at={[780, 420]} name="Tom Ashworth" tone={1} delay="-1.6s" />
      <Cursor at={[1020, 250]} name="Leila Haddad" tone={2} delay="-3.2s" />
      <SessionPill
        dot
        action={
          <>
            <X className="size-3" /> Stop
          </>
        }
        className="absolute top-3 left-1/2 z-[7] -translate-x-1/2"
      >
        Following <span className="font-medium">Priya Raman</span>
      </SessionPill>
    </NotesWindow>
  );
}

const ASSET_STATUS = {
  approved: { label: "Approved", tone: "emerald" },
  review: { label: "In Review", tone: "amber" },
  draft: { label: "Draft", tone: "neutral" },
  processing: { label: "Processing", tone: "strong" },
};

// A library status as a dot and its label; Processing pulses while the file is worked on.
function AssetStatus({ status = "draft", className }) {
  const meta = ASSET_STATUS[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[11px] whitespace-nowrap text-foreground/80", className)}>
      {status === "processing" ? <span className={cn("size-1.5 rounded-full bg-foreground/60 text-foreground/60", styles.pulse)} /> : <Dot tone={meta.tone} />}
      {meta.label}
    </span>
  );
}

const FILE_GLYPHS = { Raw: Aperture, PDF: FileText, Video: Clapperboard };

// An asset's picture: a placeholder photo, the brand mark for logo files, or its type's glyph over a quiet tile.
function Thumb({ asset, compact = false, className }) {
  if (asset.scene) return <Photo scene={asset.scene} className={cn("block", className)} />;
  if (asset.logo) {
    return (
      <span className={cn("flex items-center justify-center bg-foreground/[0.04]", className)}>
        <NorthcoveMark className={compact ? "size-5" : "size-12"} />
      </span>
    );
  }
  const Icon = FILE_GLYPHS[asset.type] ?? FileText;
  return (
    <span className={cn("flex flex-col items-center justify-center gap-1.5 bg-foreground/[0.05]", className)}>
      <span className={cn("flex items-center justify-center rounded-lg border border-foreground/[0.1] bg-foreground/[0.04]", compact ? "size-6 border-0 bg-transparent" : "size-9")}>
        <Icon className="size-4 text-muted-foreground" strokeWidth={1.75} />
      </span>
      {compact ? null : <span className="font-mono text-[10px] tracking-[0.08em] text-muted-foreground uppercase">{asset.name.split(".").pop()}</span>}
    </span>
  );
}

const TIDELINES = [
  { name: "drift-pine-hero.jpg", scene: "jacket", type: "Image", status: "review" },
  { name: "tidelines-key-image.jpg", scene: "cliffs", type: "Image", status: "approved" },
  { name: "fell-28-boulder.jpg", scene: "pack", type: "Image", status: "approved" },
  { name: "drift-pine-0142.cr3", type: "Raw", status: "draft" },
  { name: "shell-rain-macro.jpg", scene: "fabric", type: "Image", status: "approved" },
  { name: "tidelines-mood-film.mp4", type: "Video", status: "processing" },
  { name: "northcove-mark-mono.svg", logo: true, type: "Image", status: "approved" },
  { name: "brand-guidelines-2027.pdf", type: "PDF", status: "approved" },
  { name: "ridge-first-light.jpg", scene: "ridge", type: "Image", status: "review" },
];

function LibraryTile({ asset, selected }) {
  return (
    <div className={cn("overflow-hidden rounded-lg border bg-foreground/[0.02]", selected ? "border-foreground/40 ring-2 ring-foreground/15" : "border-foreground/[0.08]")}>
      <Thumb asset={asset} className="h-[100px] w-full" />
      <div className="px-2.5 py-2">
        <div className="truncate text-[12px] font-medium text-foreground/90">{asset.name}</div>
        <div className="mt-1 flex items-center justify-between gap-2">
          <AssetStatus status={asset.status} />
          <span className="text-[11px] text-muted-foreground">{asset.type}</span>
        </div>
      </div>
    </div>
  );
}

function LibraryGridWindow({ className }) {
  return (
    <Window className={className}>
      <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-5", LINE)}>
        <AppMark id="assets" size={20} />
        <span className="ml-1 text-muted-foreground">Asset Library</span>
        <span className="text-muted-foreground/60">›</span>
        <span className="font-medium">Tidelines · Spring 27</span>
        <span className="ml-auto flex h-7 items-center gap-1.5 rounded-md bg-foreground px-2.5 text-[12px] font-medium text-background">
          <Upload className="size-3.5" /> Upload
        </span>
      </div>
      <div className={cn("flex items-center gap-2 border-b px-4 py-2.5", LINE)}>
        {["All Types", "All Statuses", "Last Modified"].map((filter) => (
          <span key={filter} className="flex h-7 items-center gap-1.5 rounded-md border border-foreground/[0.1] px-2.5 text-[12px] text-foreground/80">
            {filter} <ChevronDown className="size-3 text-muted-foreground" />
          </span>
        ))}
        <span className="ml-auto flex h-7 w-[150px] items-center gap-2 rounded-md border border-foreground/[0.1] px-2.5 text-[12px] text-muted-foreground">
          <Search className="size-3.5" /> Search assets…
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3 p-4">
        {TIDELINES.map((asset, index) => (
          <LibraryTile key={asset.name} asset={asset} selected={index === 0} />
        ))}
      </div>
    </Window>
  );
}

const DETAIL_NAV = [
  { items: [{ label: "Overview", icon: LayoutDashboard }] },
  {
    title: "Manage",
    items: [
      { label: "Asset details", icon: SquarePen },
      { label: "Relationships", icon: Share2 },
      { label: "Versions", icon: History },
      { label: "Delivery", icon: Rocket },
      { label: "Technical", icon: Wrench },
    ],
  },
];

const RELATIONS = [
  { relation: "Source", name: "drift-pine-0142.cr3", meta: "Raw · 61.2 MB", asset: { name: "drift-pine-0142.cr3", type: "Raw" } },
  { relation: "Variant", name: "drift-sand-hero.jpg", meta: "Image · 6000 × 4000", asset: { scene: "jacket" } },
  { relation: "Variant", name: "drift-slate-hero.jpg", meta: "Image · 6000 × 4000", asset: { scene: "jacket" } },
  { relation: "Derived", name: "drift-pine-hero-4x5.jpg", meta: "Image · 1600 × 2000", asset: { scene: "jacket" } },
  { relation: "Campaign", name: "Tidelines · Spring 27", meta: "Named record" },
  { relation: "Product", name: "Drift rain jacket, pine", meta: "Named record" },
];

function AssetDetailWindow({ className }) {
  return (
    <Window className={className}>
      <div className={cn("flex h-12 shrink-0 items-center gap-2.5 border-b px-5", LINE)}>
        <ArrowLeft className="size-4 text-muted-foreground" />
        <span className="text-muted-foreground">Asset Library</span>
        <span className="text-muted-foreground/60">/</span>
        <span className="truncate font-medium">drift-pine-hero.jpg</span>
        <AssetStatus status="review" className="ml-1 text-[12px]" />
        <span className="ml-auto flex h-7 items-center rounded-md bg-foreground px-2.5 text-[12px] font-medium text-background">Save</span>
      </div>
      <div className="flex min-h-0 flex-1">
        <EditorNav groups={DETAIL_NAV} active="Relationships" className="w-[170px]" />
        <div className="flex min-w-0 flex-1 flex-col p-5">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <div className="text-[15px] font-medium tracking-[-0.01em]">Relationships</div>
              <div className="mt-0.5 text-[12px] text-muted-foreground">Originals, derivatives, variants, and related records.</div>
            </div>
            <span className="flex h-7 shrink-0 items-center gap-1.5 rounded-md border border-foreground/[0.1] px-2.5 text-[12px] text-foreground/80">
              <Plus className="size-3.5" /> Add relationship
            </span>
          </div>
          <div className="mt-5 flex flex-col gap-2">
            {RELATIONS.map((row, index) => (
              <div key={row.name} className={cn("flex items-center gap-3 rounded-lg border border-foreground/[0.08] px-3 py-2", styles.popIn)} style={{ "--pop-delay": `${0.2 + index * 0.12}s` }}>
                <span className="size-9 shrink-0 overflow-hidden rounded-md border border-foreground/[0.08]">
                  {row.asset ? (
                    <Thumb asset={{ name: row.name, ...row.asset }} compact className="size-full" />
                  ) : (
                    <span className="flex size-full items-center justify-center bg-foreground/[0.04]">
                      <Tag className="size-4 text-muted-foreground" strokeWidth={1.75} />
                    </span>
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-foreground/90">{row.name}</span>
                  <span className="block truncate text-[11px] text-muted-foreground">{row.meta}</span>
                </span>
                <Chip className="h-5 px-2 text-[11px]">{row.relation}</Chip>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Window>
  );
}

// Section stage: the Tidelines folder in the library behind, the pine hero shot open on the files and records it's tied to.
export function BrandLibraryStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <LibraryGridWindow className="absolute top-0 left-0 w-[600px] opacity-85" />
      <AssetDetailWindow className={cn("absolute top-[60px] left-[372px] z-[2] h-[540px] w-[628px]", styles.float)} />
    </div>
  );
}

const VERSIONS = [
  { tag: "v4", label: "Pine matched to the fabric swatch", meta: "24.8 MB · Jan 21, 2027", current: true },
  { tag: "v3", label: "Hood shadow lifted", meta: "24.6 MB · Jan 20, 2027" },
  { tag: "v2", label: "Dust spots removed", meta: "24.5 MB · Jan 19, 2027" },
  { tag: "v1", label: "Version 1", meta: "24.1 MB · Jan 17, 2027" },
];

// Cell: the hero shot's version history, the retouch that matched the swatch current and the rest ready to restore.
export function BrandVersionsRender() {
  return (
    <div className="mx-auto w-[460px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card text-[13px] dark:bg-surface-subtle">
      <div className={cn("flex items-start gap-3 border-b px-4 py-3", LINE)}>
        <div className="min-w-0 flex-1">
          <div className="font-medium">Version Control</div>
          <div className="text-[12px] text-muted-foreground">An inspectable history of every revision.</div>
        </div>
        <span className="flex h-7 items-center gap-1.5 rounded-md border border-foreground/[0.1] px-2.5 text-[12px] text-muted-foreground">
          <Upload className="size-3.5" /> Replace file
        </span>
      </div>
      {VERSIONS.map((version, index) => (
        <div key={version.tag} className={cn("flex items-center gap-3 border-b px-4 py-2.5 last:border-b-0", LINE, styles.popIn)} style={{ "--pop-delay": `${0.2 + index * 0.12}s` }}>
          <span
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-lg border text-[12px] font-semibold tabular-nums",
              version.current ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "border-foreground/[0.1] text-muted-foreground",
            )}
          >
            {version.tag}
          </span>
          <span className="size-9 shrink-0 overflow-hidden rounded-md border border-foreground/[0.08]">
            <Photo scene="jacket" className="block size-full" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-2">
              <span className="truncate font-medium text-foreground/90">{version.label}</span>
              {version.current ? (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-1.5 text-[10px] text-emerald-700 dark:text-emerald-300">
                  <Check className="size-2.5" /> Current
                </span>
              ) : null}
            </span>
            <span className="block text-[11px] text-muted-foreground">{version.meta}</span>
          </span>
          {!version.current ? <span className="text-[12px] text-muted-foreground">Restore</span> : null}
        </div>
      ))}
    </div>
  );
}

const CROP_RATIOS = ["Free", "Original", "1:1", "4:5", "16:9", "9:16"];

// Cell: the key image cropped to 4:5 for social in the image editor, saved back to the library as a new asset.
export function SocialCropRender() {
  return (
    <div className="relative mx-auto h-[310px] w-[470px]">
      <div className="absolute top-0 left-0 w-[330px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card text-[12px] dark:bg-surface-subtle">
        <div className={cn("flex h-10 items-center gap-1 border-b px-3", LINE)}>
          <Crop className="mr-1 size-3.5 text-muted-foreground" />
          {CROP_RATIOS.map((ratio) => (
            <span key={ratio} className={cn("rounded-md px-1.5 py-0.5", ratio === "4:5" ? "bg-foreground/[0.08] text-foreground" : "text-muted-foreground")}>
              {ratio}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-center bg-foreground/[0.03] py-4">
          <div className="relative h-[200px] w-[300px] overflow-hidden rounded-sm">
            <Photo scene="cliffs" className="absolute inset-0 size-full" />
            <span className="absolute inset-y-0 left-0 w-[110px] bg-background/60" />
            <span className="absolute inset-y-0 right-0 w-[30px] bg-background/60" />
            <span className="absolute inset-y-0 right-[30px] left-[110px] border-2 border-foreground/80">
              <span className="absolute inset-y-0 left-1/3 border-l border-foreground/30" />
              <span className="absolute inset-y-0 left-2/3 border-l border-foreground/30" />
              <span className="absolute inset-x-0 top-1/3 border-t border-foreground/30" />
              <span className="absolute inset-x-0 top-2/3 border-t border-foreground/30" />
              {["-top-1 -left-1", "-top-1 -right-1", "-bottom-1 -left-1", "-bottom-1 -right-1"].map((corner) => (
                <span key={corner} className={cn("absolute size-2.5 bg-foreground", corner)} />
              ))}
            </span>
          </div>
        </div>
      </div>
      <div className={cn("absolute top-[70px] right-0 z-[2] w-[220px] rounded-xl border border-foreground/[0.12] bg-surface-card p-3.5 text-[12px] shadow-2xl shadow-black/30 dark:bg-surface-dialog", styles.float)}>
        <div className="text-[13px] font-medium">Save image</div>
        <div className="mt-2.5 text-[11px] text-muted-foreground">Save as</div>
        <Segmented items={["New asset", "New version", "Download"]} active="New asset" className="mt-1.5 flex w-full text-[11px] [&>span]:flex-1 [&>span]:px-1 [&>span]:text-center" />
        <div className="mt-2.5 text-[11px] text-muted-foreground">Format</div>
        <Segmented items={["WebP", "JPEG", "PNG"]} active="JPEG" className="mt-1.5 flex w-full text-[11px] [&>span]:flex-1 [&>span]:text-center" />
        <div className="mt-2.5 truncate rounded-md border border-foreground/[0.1] px-2.5 py-1.5 font-mono text-[11px] text-foreground/85">
          <Typed text="tidelines-key-4x5.jpg" delay={1.2} />
        </div>
        <span className="mt-3 flex h-7 items-center justify-center rounded-md bg-foreground font-medium text-background">Save asset</span>
      </div>
    </div>
  );
}

const SIZES = [
  { use: "Site hero", params: "w_2400,f_webp,q_80", out: "2400 × 1600 · WebP", w: 150 },
  { use: "Product card", params: "w_800,h_1000,c_fill,f_avif", out: "800 × 1000 · AVIF", w: 84 },
  { use: "Newsletter", params: "w_600,f_jpg,q_70", out: "600 × 400 · JPEG", w: 104 },
];

// Cell: one master file served three ways, each size and format asked for in its delivery URL.
export function DeliverySizesRender() {
  return (
    <div className="mx-auto flex w-[470px] flex-col gap-2.5">
      <div className="flex items-center gap-2.5 rounded-xl border border-foreground/[0.09] bg-surface-card px-3 py-2.5 text-[12px] dark:bg-surface-subtle">
        <span className="size-9 shrink-0 overflow-hidden rounded-md border border-foreground/[0.08]">
          <Photo scene="pack" className="block size-full" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-medium text-foreground/90">fell-28-boulder.jpg</span>
          <span className="block text-[11px] text-muted-foreground">One master · 6000 × 4000 · 22.3 MB</span>
        </span>
        <Chip dot="emerald" className="h-5 px-2 text-[11px]">
          Approved
        </Chip>
      </div>
      {SIZES.map((size, index) => (
        <div
          key={size.use}
          className={cn("flex items-center gap-3 rounded-xl border border-foreground/[0.09] bg-surface-card px-3 py-2.5 text-[12px] dark:bg-surface-subtle", styles.popIn)}
          style={{ "--pop-delay": `${0.3 + index * 0.18}s` }}
        >
          <span className="flex h-11 w-[150px] shrink-0 items-center">
            <span className="block h-full overflow-hidden rounded-md border border-foreground/[0.08]" style={{ width: size.w }}>
              <Photo scene="pack" className="block size-full" />
            </span>
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-2">
              <span className="font-medium text-foreground/90">{size.use}</span>
              <span className="ml-auto shrink-0 text-[11px] text-muted-foreground tabular-nums">{size.out}</span>
            </span>
            <code className="mt-1 block truncate font-mono text-[10.5px] text-muted-foreground">
              …/<span className="text-foreground/90">{size.params}</span>/fell-28-boulder.jpg
            </code>
          </span>
        </div>
      ))}
    </div>
  );
}

const SIGNOFF_STAGES = [
  { name: "Brand", who: "Specific people", people: ["Sofia Marin"], need: "1 of 1", state: "Approved" },
  { name: "Legal", who: "Specific people", people: ["Nadia Kowalski"], need: "0 of 1", state: "Waiting" },
  { name: "Product marketing", who: "Anyone with a role", role: "Marketing", need: "1 of 2", state: "Waiting" },
];

function StageState({ state }) {
  if (state === "Approved") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400">
        <CheckCircle2 className="size-3.5" /> Approved
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-amber-700 dark:text-amber-300">
      <span className={cn("size-1.5 rounded-full bg-amber-500 text-amber-500", styles.pulse)} /> Waiting
    </span>
  );
}

// Callout centrepiece: the Tidelines sign-off pipeline, three stages open at once, and what the last approval does.
export function SignOffPipelineRender() {
  return (
    <div className="mx-auto w-[540px] overflow-hidden rounded-xl border border-foreground/[0.1] bg-surface-card text-[13px] shadow-xl shadow-black/15 dark:bg-surface-subtle">
      <div className={cn("flex h-12 items-center gap-2 border-b px-4", LINE)}>
        <AppMark id="assets" size={20} />
        <span className="ml-1 font-medium">Tidelines sign-off</span>
        <Chip className="ml-1 h-5 px-2 text-[11px]">Asset</Chip>
        <Chip className="h-5 px-2 text-[11px]">Anytime</Chip>
        <span className="ml-auto flex items-center gap-1.5 text-[12px] text-foreground/80">
          <Dot tone="emerald" /> Active
        </span>
      </div>
      <div className="flex flex-col gap-2.5 p-4">
        <div className="text-[12px] text-muted-foreground">Every stage is open at once, so approvers can act in any order.</div>
        {SIGNOFF_STAGES.map((stage, index) => (
          <div key={stage.name} className="rounded-lg border border-foreground/[0.09] bg-foreground/[0.02] px-3.5 py-3">
            <div className="flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-md bg-foreground/[0.08] font-mono text-[11px] text-foreground/80">{index + 1}</span>
              <span className="font-medium">{stage.name}</span>
              <span className="ml-auto">
                <StageState state={stage.state} />
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2 pl-7 text-[12px] text-muted-foreground">
              {stage.people ? <AvatarStack names={stage.people} size={18} /> : <Users className="size-3.5" />}
              <span className="truncate text-foreground/80">{stage.people ? stage.people.join(", ") : `${stage.who} · ${stage.role}`}</span>
              <span className="ml-auto shrink-0 tabular-nums">{stage.need} sign-offs</span>
            </div>
          </div>
        ))}
        <div className={cn("mt-1 flex items-center gap-2.5 rounded-lg border border-dashed border-foreground/20 px-3.5 py-2.5 text-[12px] text-foreground/80", styles.popIn)} style={{ "--pop-delay": "0.8s" }}>
          <Lock className="size-4 shrink-0 text-muted-foreground" />
          On final approval: mark the assets approved and lock the approved version.
        </div>
      </div>
    </div>
  );
}

const SELECTS = [
  { name: "tidelines-key-image.jpg", scene: "cliffs", decision: "Approved" },
  { name: "drift-pine-hero.jpg", scene: "jacket", decision: "Approved" },
  { name: "ridge-first-light.jpg", scene: "ridge", decision: "Changes" },
  { name: "fell-28-boulder.jpg", scene: "pack", decision: "Approved" },
  { name: "shell-rain-macro.jpg", scene: "fabric", decision: "Pending" },
  { name: "pitch-at-dusk.jpg", scene: "tent", decision: "Pending" },
];

const DECISION_TONE = {
  Approved: "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  Changes: "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  Pending: "border-foreground/[0.12] bg-foreground/[0.04] text-muted-foreground",
};

// Cell: the hero selects under review, decided file by file, with legal's note on the shot that needs changes.
export function HeroSelectsRender() {
  return (
    <div className="relative mx-auto h-[320px] w-[470px]">
      <div className="absolute top-0 left-0 w-[400px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card text-[12px] dark:bg-surface-subtle">
        <div className={cn("flex items-center gap-2 border-b px-4 py-2.5", LINE)}>
          <span className="truncate font-medium">Tidelines hero selects</span>
          <span className="ml-auto inline-flex items-center gap-1.5 text-foreground/85">
            <Dot tone="amber" /> In Review
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 p-3">
          {SELECTS.map((item) => (
            <div key={item.name} className="overflow-hidden rounded-md border border-foreground/[0.08]">
              <Photo scene={item.scene} className="block h-[66px] w-full" />
              <div className="flex items-center px-1.5 py-1.5">
                <span className={cn("rounded-full border px-1.5 text-[10px] leading-[16px]", DECISION_TONE[item.decision])}>{item.decision}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={cn("absolute top-[132px] right-0 z-[2] w-[250px] rounded-xl border border-foreground/[0.12] bg-surface-card p-3.5 text-[12px] shadow-2xl shadow-black/30 dark:bg-surface-dialog", styles.popIn)} style={{ "--pop-delay": "0.6s" }}>
        <div className="flex items-center gap-2">
          <Avatar name="Nadia Kowalski" size={20} />
          <span className="font-medium">Nadia Kowalski</span>
          <span className="ml-auto rounded-full border border-amber-500/25 bg-amber-500/10 px-1.5 text-[10px] leading-[16px] text-amber-700 dark:text-amber-300">Changes</span>
        </div>
        <p className="mt-2 leading-[1.45] text-foreground/85">The trail sign in the ridge shot names a private estate. Clone it out before it goes live.</p>
        <div className="mt-2 text-[11px] text-muted-foreground">Legal · ridge-first-light.jpg</div>
      </div>
    </div>
  );
}

const LAUNCH_FLOW = [
  { kind: "Trigger", title: "When Asset approved", detail: "An asset passes review and is approved.", icon: BadgeCheck },
  { kind: "Action", title: "Move asset", detail: "Folder · Tidelines/Final", icon: FolderInput },
  { kind: "Action", title: "Add tag", detail: "Tag · tidelines-final", icon: Tag },
  { kind: "Action", title: "Webhook", detail: "POST · hooks.northcove.co/launch", icon: Webhook },
];

// Cell: the workflow that files every approved shot, tags it and tells the launch channel through a webhook.
export function LaunchWorkflowRender() {
  return (
    <div className="relative mx-auto h-[320px] w-[470px] overflow-hidden rounded-xl border border-foreground/[0.08]" style={CANVAS_DOTS}>
      <svg className="absolute inset-0 size-full text-foreground" aria-hidden="true">
        {LAUNCH_FLOW.slice(1).map((step, index) => (
          <path key={step.title} d={`M150 ${70 + index * 74} V${88 + index * 74}`} fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" className={styles.flow} />
        ))}
      </svg>
      {LAUNCH_FLOW.map((step, index) => {
        const Icon = step.icon;
        return (
          <div
            key={step.title}
            className={cn(
              "absolute left-[20px] flex h-[52px] w-[260px] items-center gap-2.5 rounded-xl border bg-surface-card px-3 text-[12px] shadow-sm shadow-black/10 dark:bg-surface-subtle",
              step.kind === "Trigger" ? "border-foreground/30" : "border-foreground/[0.1]",
              styles.popIn,
            )}
            style={{ top: 18 + index * 74, "--pop-delay": `${0.15 + index * 0.12}s` }}
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-foreground/[0.1] bg-foreground/[0.04]">
              <Icon className="size-3.5 text-muted-foreground" strokeWidth={1.75} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="font-medium">{step.title}</span>
                <MonoLabel className="ml-auto text-[9px]">{step.kind}</MonoLabel>
              </span>
              <span className="block truncate text-[11px] text-muted-foreground">{step.detail}</span>
            </span>
          </div>
        );
      })}
      <div className={cn("absolute top-[98px] right-[14px] z-[2] w-[170px] rounded-xl border border-foreground/[0.12] bg-surface-card p-3 text-[11px] shadow-2xl shadow-black/30 dark:bg-surface-dialog", styles.float)}>
        <div className="flex items-center gap-1.5 text-[12px] font-medium">
          <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" /> Success
        </div>
        <div className="mt-0.5 text-muted-foreground">drift-pine-hero.jpg · 3 of 3 steps</div>
        <div className={cn("mt-2 flex flex-col gap-1 border-t pt-2 font-mono text-[10px] text-muted-foreground", LINE)}>
          <span>Moved to Tidelines/Final</span>
          <span>Tagged “tidelines-final”</span>
          <span>POST → 200</span>
        </div>
      </div>
    </div>
  );
}

const LAUNCH_QUEUE = [
  { title: "Tidelines", slug: "tidelines", type: "Campaign page", status: "Scheduled", date: "Mar 3, 2027", active: true },
  { title: "Drift rain jacket", slug: "drift-rain-jacket", type: "Product story", status: "Scheduled", date: "Mar 3, 2027" },
  { title: "Fell 28 rucksack", slug: "fell-28-rucksack", type: "Product story", status: "In review", date: "Feb 24, 2027" },
  { title: "Packing for a wet weekend", slug: "packing-for-a-wet-weekend", type: "Journal", status: "In review", date: "Feb 23, 2027" },
  { title: "Behind the shoot: St Agnes", slug: "behind-the-shoot-st-agnes", type: "Journal", status: "Published", date: "Feb 18, 2027" },
  { title: "Care guide: waterproof shells", slug: "care-guide-waterproof-shells", type: "Guide", status: "Published", date: "Feb 11, 2027" },
];

// SplitShowcase render: the Publishing Queue with the Tidelines launch lined up, its date being set and an earlier publish landing.
export function LaunchQueueRender() {
  return (
    <Window className="relative h-[460px] w-[680px]">
      <ScreenHead title="Publishing Queue" description="Entries waiting to go live, scheduled, in review, and currently published." />
      <div className="flex flex-col gap-3 px-5 py-4">
        <ContentStats
          stats={[
            { label: "In queue", value: "6", footer: "Across three statuses" },
            { label: "Scheduled", value: "2", footer: "Has a go-live date" },
            { label: "In review", value: "2", footer: "Awaiting approval" },
          ]}
        />
        <div className="overflow-hidden rounded-xl border border-foreground/[0.08]">
          <div className={cn("grid grid-cols-[minmax(0,1fr)_110px_100px] gap-4 border-b bg-foreground/[0.02] px-4 py-2 text-[11px] text-muted-foreground", LINE)}>
            <span>Entry</span>
            <span>Status</span>
            <span>Date</span>
          </div>
          {LAUNCH_QUEUE.map((row) => (
            <div key={row.slug} className={cn("grid grid-cols-[minmax(0,1fr)_110px_100px] items-center gap-4 border-b px-4 py-2 last:border-b-0", LINE, row.active && "bg-foreground/[0.05]")}>
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
      <div className={cn("absolute top-[150px] right-[18px] z-[2] w-[250px] rounded-xl border border-foreground/[0.12] bg-surface-card text-[12px] shadow-2xl shadow-black/30 dark:bg-surface-dialog", styles.float)}>
        <div className={cn("flex items-center gap-2 border-b px-3.5 py-2.5", LINE)}>
          <Eye className="size-3.5 text-muted-foreground" strokeWidth={1.75} />
          <span className="font-medium">Visibility</span>
          <span className="truncate text-muted-foreground">Tidelines</span>
        </div>
        <div className="grid gap-2.5 px-3.5 py-3">
          <ContentInput label="Status">
            <Dot tone="strong" /> Scheduled
            <ChevronDown className="ml-auto size-3.5 text-muted-foreground" />
          </ContentInput>
          <ContentInput label="Scheduled date">
            <Calendar className="size-3.5 text-muted-foreground" />
            <Typed text="03/03/2027" delay={1.4} />
          </ContentInput>
        </div>
      </div>
    </Window>
  );
}

const CAMPAIGN_FIELDS = [
  { label: "Headline", key: "headline", type: "Text", flags: "required" },
  { label: "Hero image", key: "hero_image", type: "Media", flags: "required" },
  { label: "Intro", key: "intro", type: "Rich text" },
  { label: "Featured products", key: "featured_products", type: "Reference" },
  { label: "Launch date", key: "launch_date", type: "Date" },
  { label: "Season", key: "season", type: "Enum", flags: "Spring, Summer, Autumn, Winter" },
  { label: "Show newsletter sign-up", key: "show_signup", type: "Boolean" },
];

// Cell: the Campaign page content type, every field typed so each campaign is built the same way.
export function CampaignTypeRender() {
  return (
    <div className="mx-auto w-[460px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card text-[12px] dark:bg-surface-subtle">
      <div className={cn("flex items-center gap-2 border-b px-4 py-3", LINE)}>
        <FileJson className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <span className="text-[13px] font-medium">Campaign page</span>
        <span className="truncate text-muted-foreground">campaign_page · /campaign-pages</span>
        <span className="ml-auto text-[11px] text-muted-foreground tabular-nums">7 fields</span>
      </div>
      {CAMPAIGN_FIELDS.map((field, index) => (
        <div key={field.key} className={cn("grid grid-cols-[minmax(0,1fr)_104px] items-center gap-3 border-b px-4 py-2 last:border-b-0", LINE, styles.popIn)} style={{ "--pop-delay": `${0.15 + index * 0.08}s` }}>
          <div className="min-w-0">
            <div className="truncate text-foreground/90">{field.label}</div>
            <div className="truncate text-[11px] text-muted-foreground">
              {field.key}
              {field.flags ? ` · ${field.flags}` : ""}
            </div>
          </div>
          <TypeTag type={field.type} className="justify-self-start" />
        </div>
      ))}
    </div>
  );
}

const CAMPAIGN_DIFF = [
  { path: "data.headline", change: "Changed", before: '"Low tide, high ground"', after: '"Made for the weather you actually get"' },
  { path: "data.hero_image", change: "Changed", before: '"ridge-first-light.jpg"', after: '"tidelines-key-image.jpg"' },
  { path: "data.featured_products", change: "Added", before: "—", after: '["fell-28-rucksack"]' },
];

const CHANGE_TONE = {
  Changed: "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  Added: "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
};

// Cell: two snapshots of the campaign page compared path by path, with the older one ready to restore.
export function CampaignCompareRender() {
  return (
    <div className="mx-auto w-[470px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card text-[12px] dark:bg-surface-subtle">
      <div className={cn("flex items-center gap-2 border-b px-4 py-2.5", LINE)}>
        <GitCompareArrows className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <span className="text-[13px] font-medium">Compare &amp; Rollback</span>
        <span className="truncate text-muted-foreground">Tidelines</span>
        <span className="ml-auto inline-flex h-7 shrink-0 items-center gap-1.5 rounded-lg bg-foreground px-2.5 font-medium text-background">
          <Undo2 className="size-3.5" /> Restore v3
        </span>
      </div>
      <div className={cn("flex items-center gap-2 border-b px-4 py-2", LINE)}>
        <span className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-foreground/[0.1] px-2.5 text-foreground/80">
          v3 <ChevronDown className="size-3 text-muted-foreground" />
        </span>
        <span className="text-muted-foreground">→</span>
        <span className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-foreground/[0.1] px-2.5 text-foreground/80">
          v5 <ChevronDown className="size-3 text-muted-foreground" />
        </span>
        <span className="ml-auto truncate text-[11px] text-muted-foreground">Left is the baseline; rollback restores it.</span>
      </div>
      {CAMPAIGN_DIFF.map((row, index) => (
        <div key={row.path} className={cn("border-b px-4 py-2.5 last:border-b-0", LINE, styles.popIn)} style={{ "--pop-delay": `${0.2 + index * 0.15}s` }}>
          <div className="flex items-center gap-2">
            <span className="truncate font-mono text-[11.5px] text-foreground/85">{row.path}</span>
            <span className={cn("ml-auto shrink-0 rounded-full border px-1.5 text-[10px] leading-[18px]", CHANGE_TONE[row.change])}>{row.change}</span>
          </div>
          <div className="mt-1 grid grid-cols-2 gap-3 font-mono text-[10.5px]">
            <span className="truncate text-muted-foreground line-through decoration-foreground/25">{row.before}</span>
            <span className="truncate text-foreground/85">{row.after}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// Cell: the campaign page read from the delivery API by its slug, and the site's hero built from the response.
export function CampaignApiRender() {
  return (
    <div className="relative mx-auto h-[320px] w-[470px]">
      <div className="absolute top-0 left-0 w-[300px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card dark:bg-surface-subtle">
        <div className={cn("flex items-center gap-2 border-b px-3.5 py-2.5", LINE)}>
          <Method verb="GET" />
          <span className="truncate font-mono text-[11px] text-foreground/85">…/campaign-pages/tidelines</span>
        </div>
        <CodeBlock
          className="px-3.5 py-2.5 text-[11px]"
          lines={[
            ["{", 0],
            ['"data": {', 1],
            ['"slug": "tidelines",', 2],
            ['"headline": "Made for the weather…",', 2, "focus"],
            ['"season": "Spring",', 2],
            ['"launch_date": "2027-03-03",', 2],
            ['"hero_image": { "url": "…" },', 2],
            ['"featured_products": [ … ]', 2],
            ["}", 1],
            ["}", 0],
          ]}
        />
      </div>
      <div className={cn("absolute top-[54px] right-0 z-[2] w-[220px] overflow-hidden rounded-xl border border-foreground/[0.12] bg-surface-card shadow-2xl shadow-black/30 dark:bg-surface-dialog", styles.float)}>
        <div className={cn("flex h-7 items-center gap-1.5 border-b px-2.5", LINE)}>
          <span className="size-2 rounded-full bg-foreground/15" />
          <span className="size-2 rounded-full bg-foreground/15" />
          <span className="ml-1 truncate text-[10px] text-muted-foreground">northcove.example/tidelines</span>
        </div>
        <div className="relative h-[130px]">
          <Photo scene="cliffs" className="absolute inset-0 size-full" />
          <div className="absolute inset-x-3 bottom-3">
            <MonoLabel className="text-[9px]">Spring 2027</MonoLabel>
            <div className="mt-0.5 text-[14px] leading-tight font-semibold tracking-[-0.02em]">Made for the weather you actually get</div>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-2.5">
          <NorthcoveMark className="size-4" />
          <span className="text-[11px] text-muted-foreground">Drift jacket · Fell 28</span>
          <span className="ml-auto rounded-full bg-foreground px-2.5 py-1 text-[10px] font-medium text-background">Shop</span>
        </div>
      </div>
    </div>
  );
}

const SHOOT_DAYS = [
  {
    title: "Day 1 · St Agnes",
    scene: "cliffs",
    items: ["Low tide 07:42, crew on the sand by 7", ["Beach permit from the council", true], "Drift jacket in Tide and Sand"],
  },
  {
    title: "Day 2 · Fell ridge",
    scene: "ridge",
    items: ["First light 07:58 from the east crest", ["Book the hut for the night", true], "Fell 28 packed, poles out"],
  },
  {
    title: "Day 3 · Studio",
    scene: "jacket",
    items: ["Sweep in Sand, side key light", "Macro rig for the rain shots", ["Hire the rain bar", false]],
  },
];

const AI_ACTIONS = [
  { text: "Confirm the hut for the ridge night", owner: "Tom Ashworth" },
  { text: "Pack the jacket in all three colourways", owner: "Leila Haddad" },
  { text: "Hire the rain bar for the studio day", owner: "Jonas Becker" },
  { text: "Send call sheets on the Friday before", owner: "Priya Raman" },
];

// The AI card: asked to pull the action items out of the board, it lists them one by one, ready to drop on the board as notes.
function AiActionsCard({ at, w = 236 }) {
  return (
    <Node at={at} w={w} className="flex flex-col overflow-hidden text-[12px]">
      <div className={cn("flex items-center gap-2 border-b px-3 py-2", LINE)}>
        <span className="flex size-5 items-center justify-center rounded-md bg-foreground text-background">
          <Sparkles className="size-3" strokeWidth={2} />
        </span>
        <span className="font-medium">AI assistant</span>
        <MonoLabel className="ml-auto text-[9.5px]">3 columns</MonoLabel>
      </div>
      <div className="flex flex-col gap-3 px-3 py-3">
        <div className="self-end rounded-lg rounded-br-sm bg-foreground/[0.07] px-2.5 py-1.5 text-foreground/90">
          <Typed text="Pull out the action items" delay={0.8} />
        </div>
        <div>
          <MonoLabel className="text-[9.5px]">Action items</MonoLabel>
          <div className="mt-2 flex flex-col gap-2">
            {AI_ACTIONS.map((action, index) => (
              <div key={action.text} className={cn("flex items-start gap-2", styles.popIn)} style={{ "--pop-delay": `${2.4 + index * 0.45}s` }}>
                <span className="mt-0.5 size-3 shrink-0 rounded-[3px] border border-foreground/30" />
                <span className="min-w-0 flex-1 leading-[1.35] text-foreground/90">{action.text}</span>
                <Avatar name={action.owner} size={16} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={cn("mt-auto flex items-center gap-2 border-t px-3 py-2 text-[11px]", LINE)}>
        <Plus className="size-3.5 text-muted-foreground" strokeWidth={2} />
        <span className="text-foreground/85">Add as 4 notes</span>
        <span className="ml-auto rounded-md bg-foreground px-2 py-0.5 font-medium text-background">Add</span>
      </div>
    </Node>
  );
}

// Section stage: the Shoot days board nested inside Tidelines, each day a column, with the AI card reading the columns into action items.
export function ShootDaysStage() {
  return (
    <NotesWindow
      bar={
        <NotesBar crumbs={["Spring 27", "Tidelines", "Shoot days"]} live>
          <SessionCluster />
        </NotesBar>
      }
      activeTool={5}
      className="h-[620px] w-[1000px]"
    >
      <div className="absolute top-[18px] left-[24px]">
        <div className="text-[22px] leading-none font-semibold tracking-[-0.02em]">Shoot days</div>
        <div className="mt-1.5 text-[11px] text-muted-foreground">14 to 16 January · call sheets go out the Friday before</div>
      </div>
      {SHOOT_DAYS.map((day, index) => (
        <Column key={day.title} at={[24 + index * 222, 70]} w={210} title={day.title} items={day.items} selected={index === 1}>
          <Photo scene={day.scene} className="block h-[64px] w-full rounded-[5px]" />
        </Column>
      ))}
      <Wires
        paths={[
          { d: "M234 160 C 300 120, 600 90, 696 112", dashed: true, flow: true },
          { d: "M456 150 C 540 130, 640 120, 696 128", dashed: true, flow: true },
          { d: "M678 150 C 686 146, 690 142, 696 140", dashed: true, flow: true },
        ]}
      />
      <AiActionsCard at={[700, 70]} w={236} />
      <BoardTile at={[24, 404]} w={210} label="Lookbook" caption="12 cards" />
      <BoardTile at={[246, 404]} w={210} label="Shop windows" caption="8 cards" />
      <CommentCard at={[468, 396]} w={210} name="Leila Haddad">
        Studio day can reuse the sand sweep from the window build.
      </CommentCard>
      <Cursor at={[388, 250]} name="Leila Haddad" tone={2} delay="-1.2s" />
      <Cursor at={[760, 380]} name="Tom Ashworth" tone={1} delay="-2.8s" />
    </NotesWindow>
  );
}

const CARD_KINDS = [
  [StickyNote, "Note"],
  [CheckSquare, "To-do"],
  [Table, "Table"],
  [Image, "Image"],
  [PanelsTopLeft, "Embed"],
  [Network, "Mind map"],
  [PenTool, "Draw"],
  [Palette, "Palette"],
  [LayoutDashboard, "Board"],
  [Timer, "Timer"],
  [BarChart3, "Poll"],
  [Sparkles, "AI assistant"],
];

// Cell: a corner of the board with a table, a sketch and a note, and the card picker open on its first twelve kinds.
export function CardKindsRender() {
  return (
    <div className="relative h-[310px] w-[460px] overflow-hidden rounded-xl border border-foreground/[0.08] bg-foreground/[0.015]" style={CANVAS_DOTS}>
      <TableCard
        at={[18, 22]}
        w={250}
        columns={["Shot", "Lens", "Light"]}
        rows={[
          ["Headland walker", "35mm", "07:50"],
          ["Hood, side light", "85mm", "08:20"],
          ["Rain on shell", "100mm", "Studio"],
        ]}
      />
      <Node at={[18, 160]} w={150} className="overflow-hidden">
        <svg viewBox="0 0 150 96" className="block h-[96px] w-full text-foreground" aria-hidden="true">
          <path d="M14 74 L 48 34 L 66 54 L 84 40 L 132 74" fill="none" stroke="currentColor" strokeOpacity="0.7" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
          <path d="M18 84 q 8 -6 16 0 t 16 0 t 16 0 t 16 0 t 16 0 t 16 0" fill="none" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="104" cy="24" r="8" fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.8" />
        </svg>
        <div className="truncate px-2.5 py-1.5 text-[11px] text-muted-foreground">Sketch · window layout</div>
      </Node>
      <Node at={[180, 168]} w={110} className="bg-amber-100 px-2.5 py-2 text-[11px] leading-[1.35] text-amber-950 dark:bg-amber-500/15 dark:text-amber-100">
        Shoot the hero twice: wet and dry.
      </Node>
      <div
        className={cn("absolute top-[18px] right-[16px] z-[3] w-[168px] rounded-xl border border-foreground/[0.1] bg-surface-card p-1.5 shadow-2xl shadow-black/25 dark:bg-surface-dialog", styles.popIn)}
        style={{ "--pop-delay": "0.6s" }}
      >
        <div className="px-2 pt-1 pb-1.5 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">Add a card</div>
        <div className="grid grid-cols-2 gap-0.5">
          {CARD_KINDS.map(([Icon, label], index) => (
            <span key={label} className={cn("flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] text-foreground/85", index === 5 && "bg-foreground/[0.07] text-foreground")}>
              <Icon className="size-3.5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
              <span className="truncate">{label}</span>
            </span>
          ))}
        </div>
        <div className={cn("mt-1 border-t px-2 pt-1.5 pb-0.5 text-[10px] text-muted-foreground", LINE)}>And 19 more under More</div>
      </div>
    </div>
  );
}

// Cell: the path into a board inside a board inside a board, with the next level's tiles waiting.
export function NestedBoardsRender() {
  return (
    <div className="flex w-[460px] flex-col gap-3 text-[12px]">
      <div className="flex items-center gap-1.5 rounded-lg border border-foreground/[0.08] bg-foreground/[0.02] px-3 py-2">
        <AppMark id="notes" size={18} />
        {["Spring 27", "Tidelines", "Shoot days"].map((crumb, index) => (
          <span key={crumb} className="flex items-center gap-1.5">
            <ChevronRight className="size-3 text-muted-foreground/70" />
            <span className={index === 2 ? "font-medium" : "text-muted-foreground"}>{crumb}</span>
          </span>
        ))}
      </div>
      <div className="relative h-[196px] overflow-hidden rounded-xl border border-foreground/[0.08] bg-foreground/[0.015]" style={CANVAS_DOTS}>
        <BoardTile at={[16, 18]} w={200} label="Shoot days" caption="Open · 3 columns" selected />
        <BoardTile at={[16, 76]} w={200} label="Lookbook" caption="12 cards" />
        <BoardTile at={[16, 134]} w={200} label="Shop windows" caption="8 cards" />
        <Wires paths={[{ d: "M216 42 C 250 42, 250 60, 262 60", arrow: true, strong: true }]} />
        <Node at={[266, 18]} w={176} className="p-2">
          <div className="mb-1.5 flex items-center gap-1.5 px-0.5 text-[11px] font-medium">
            <LayoutDashboard className="size-3 text-muted-foreground" strokeWidth={1.75} />
            Shoot days
          </div>
          <div className="grid grid-cols-3 gap-1">
            {["cliffs", "ridge", "jacket"].map((scene) => (
              <Photo key={scene} scene={scene} className="block h-[46px] w-full rounded-[4px]" />
            ))}
          </div>
          <div className="mt-1.5 grid grid-cols-3 gap-1">
            {[0, 1, 2].map((index) => (
              <span key={index} className="h-1.5 rounded-full bg-foreground/[0.08]" />
            ))}
          </div>
        </Node>
      </div>
    </div>
  );
}

// Cell: following Priya round the board while her laser circles the shot she wants, the session's people along the bottom.
export function FollowRender() {
  return (
    <div className="relative h-[300px] w-[460px] overflow-hidden rounded-xl border border-foreground/[0.08] bg-foreground/[0.015]" style={CANVAS_DOTS}>
      <SessionPill dot className="absolute top-3 left-1/2 z-[7] -translate-x-1/2" action="Stop">
        Following <span className="font-medium">Priya Raman</span>
      </SessionPill>
      <ImageCard at={[42, 64]} w={190} h={128} scene="hood" caption="Hood up, side light" selected />
      <ImageCard at={[252, 64]} w={160} h={100} scene="fabric" caption="Rain on the shell" />
      <LaserTrail points={arcPoints(137, 128, 112, 84, Math.PI * 1.05, Math.PI * 2.55, 26)} />
      <Cursor at={[214, 196]} name="Priya Raman" tone={0} />
      <div className="absolute bottom-3 left-3 z-[6] flex items-center gap-2 rounded-full border border-foreground/[0.1] bg-surface-card py-1 pr-3 pl-1 text-[11px] shadow-lg shadow-black/15 dark:bg-surface-dialog">
        <AvatarStack names={TEAM} size={20} />
        <span className="text-muted-foreground">5 on the board</span>
        <span className={cn("size-1.5 rounded-full bg-emerald-500 text-emerald-500", styles.pulse)} />
      </div>
    </div>
  );
}

// Cell: the Collaborate dialog's Merge tab, the session's cards going back into the team's board.
export function MergeSessionRender() {
  return (
    <div className="relative h-[300px] w-[460px]">
      <CollabDialog live active="Merge" footer={false} className="absolute top-0 left-0 w-[330px]">
        <div className="flex flex-col gap-3 p-4 text-[12px]">
          <p className="leading-[1.45] text-muted-foreground">Bring what the session made back into the board it started from.</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              ["14", "New cards"],
              ["6", "Edited"],
              ["2", "Removed"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-lg border border-foreground/[0.08] bg-foreground/[0.02] px-2.5 py-2">
                <div className="text-[17px] font-medium tabular-nums">{value}</div>
                <div className="text-[10.5px] text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
          <NotesButton primary icon={GitMerge} className="w-full">
            Merge into Tidelines
          </NotesButton>
        </div>
      </CollabDialog>
      <Toast title="Session merged" body="14 cards added to Tidelines, 6 updated." className={cn("absolute right-0 bottom-2 w-[250px]", styles.popIn)} style={{ "--pop-delay": "1.4s" }} />
    </div>
  );
}
