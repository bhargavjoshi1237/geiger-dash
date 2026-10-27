import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Clock,
  Copy,
  CornerDownLeft,
  Equal,
  Eye,
  FilePlus2,
  FlaskConical,
  FolderOpen,
  FunctionSquare,
  GitBranch,
  GripVertical,
  History,
  LayoutGrid,
  LayoutTemplate,
  MoreHorizontal,
  Paintbrush,
  Palette,
  Plus,
  Redo2,
  RefreshCw,
  RotateCcw,
  Search,
  SlidersHorizontal,
  SplitSquareVertical,
  Star,
  Target,
  Undo2,
  UserPlus,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarStack, Bar, Kbd, LINE, MonoLabel, Typed, Window } from "@/components/product-pages/mock_kit";
import { ArtCover, BrightloopMark, CARD, FIELD_GROUPS, FIELD_ICON, Input, POPOVER, Segmented, Select, StatusDot, Toggle } from "@/components/product-pages/apps/forms/forms_kit";
import styles from "@/components/product-pages/product_pages.module.css";

// Geiger Forms builder renders: Brightloop's Spring Grants 2026 application on the canvas, its logic, formulas, themes and templates.

function Badge({ icon: Icon, outline = false, children }) {
  return (
    <span className={cn("inline-flex h-5 items-center gap-1 rounded-md px-1.5 text-[11px] whitespace-nowrap", outline ? "border border-foreground/[0.12] text-muted-foreground" : "bg-foreground/[0.07] text-foreground/80")}>
      {Icon ? <Icon className="size-3" strokeWidth={2} /> : null}
      {children}
    </span>
  );
}

function IconBox({ type, size = "md" }) {
  const Icon = FIELD_ICON[type];
  return (
    <span className={cn("flex shrink-0 items-center justify-center rounded-lg border border-foreground/[0.09] bg-foreground/[0.03] text-muted-foreground", size === "sm" ? "size-7" : "size-8")}>
      {Icon ? <Icon className={size === "sm" ? "size-3.5" : "size-4"} strokeWidth={1.75} /> : null}
    </span>
  );
}

// One field on the builder canvas: a compact summary, or its settings when selected.
function CanvasCard({ number, type, title, summary, badges, selected = false, className, children }) {
  return (
    <div className={cn("rounded-xl border bg-surface-card px-4 py-3 dark:bg-foreground/[0.035]", selected ? "border-foreground/30 ring-1 ring-foreground/15" : "border-foreground/[0.09]", className)}>
      <div className="flex items-center gap-3">
        <IconBox type={type} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            {number ? <span className="shrink-0 font-semibold tabular-nums">{number}.</span> : null}
            <span className="min-w-0 truncate px-1 font-semibold">{title}</span>
            {badges ? <span className="ml-auto flex shrink-0 items-center gap-1">{badges}</span> : null}
          </div>
          {summary ? <div className={cn("mt-0.5 truncate pl-px text-[12px] text-muted-foreground", type === "Calculated" && "font-mono text-[11px]")}>{summary}</div> : null}
        </div>
        {selected ? (
          <span className="flex shrink-0 items-center gap-2 text-muted-foreground">
            <Copy className="size-3.5" />
            <MoreHorizontal className="size-4" />
          </span>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function Tabs({ tabs, active = 0, className }) {
  return (
    <div className={cn("grid rounded-lg bg-foreground/[0.05] p-0.5 text-[12px]", className)} style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}>
      {tabs.map((tab, index) => (
        <span key={tab} className={cn("rounded-md py-1 text-center whitespace-nowrap", index === active ? "bg-surface-card font-medium text-foreground shadow-sm dark:bg-foreground/[0.1]" : "text-muted-foreground")}>
          {tab}
        </span>
      ))}
    </div>
  );
}

function PageLabel({ children }) {
  return (
    <div className="flex items-center gap-2 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
      <SplitSquareVertical className="size-3.5" />
      {children}
    </div>
  );
}

function DropLine() {
  return (
    <div className="relative h-0">
      <span className="absolute inset-x-0 -top-[7px] h-0.5 rounded-full bg-foreground/60" />
      <span className="absolute -top-[10px] -left-1 size-2 rounded-full border-2 border-foreground/60 bg-background" />
    </div>
  );
}

function ListItem({ children }) {
  return (
    <span className="flex h-6 items-center gap-2 rounded-md border border-foreground/[0.09] bg-background/50 px-2 text-[12px] text-foreground/85 dark:bg-foreground/[0.02]">
      <GripVertical className="size-3 text-muted-foreground/70" />
      {children}
    </span>
  );
}

function BuilderBar({ title = "Spring Grants 2026 — Application", editors = ["Elena Rossi", "Noah Fischer"], compact = false }) {
  return (
    <div className={cn("flex h-12 shrink-0 items-center gap-2.5 border-b px-4", LINE)}>
      <ArrowLeft className="size-4 text-muted-foreground" />
      <span className="truncate font-semibold">{title}</span>
      <CheckCircle2 className="size-3.5 shrink-0 text-muted-foreground" />
      <span className="ml-auto flex shrink-0 items-center gap-2.5 text-muted-foreground">
        {compact ? null : (
          <>
            <Undo2 className="size-4" />
            <Redo2 className="size-4 opacity-40" />
            <span className="h-5 w-px bg-foreground/10" />
          </>
        )}
        <AvatarStack names={editors} size={22} />
        {compact ? null : (
          <>
            <Star className="size-4" />
            <Copy className="size-4" />
          </>
        )}
        <span className="flex h-8 items-center gap-1.5 rounded-md px-2 text-[12px] text-foreground/80">
          <Eye className="size-4" /> Preview
        </span>
        <span className="flex h-8 items-center gap-1.5 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2.5 text-[12px] font-medium text-emerald-600 dark:text-emerald-400">
          <span className={cn("size-2 rounded-full bg-emerald-500 text-emerald-500", styles.pulse)} />
          Live
        </span>
      </span>
    </div>
  );
}

function PaletteGroup({ group, fields, active }) {
  return (
    <div>
      <div className="mb-1 text-[10px] font-medium tracking-[0.06em] text-muted-foreground uppercase">{group}</div>
      <div className="grid grid-cols-2 gap-1">
        {fields.map(([label, Icon]) => (
          <span
            key={label}
            className={cn("flex h-7 min-w-0 items-center gap-2 rounded-md border px-2 text-[12px]", label === active ? "border-foreground/20 bg-foreground/[0.07] text-foreground" : "border-transparent text-muted-foreground")}
          >
            <Icon className="size-3.5 shrink-0 text-foreground/55" strokeWidth={1.75} />
            <span className="truncate">{label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function PaletteSearch() {
  return (
    <span className="flex h-8 items-center gap-2 rounded-md border border-foreground/[0.1] bg-background/50 px-2.5 text-[12px] text-muted-foreground dark:bg-foreground/[0.03]">
      <Search className="size-3.5" /> Search field types…
    </span>
  );
}

function MatrixSettings() {
  return (
    <div className="mt-3 border-t border-foreground/[0.07] pt-3">
      <Tabs tabs={["Question", "Validation", "Logic · 1", "Advanced"]} />
      <div className="mt-3 grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium text-foreground/80">Rows</span>
          {["Reach", "Inclusion", "Lasting value"].map((row) => (
            <ListItem key={row}>{row}</ListItem>
          ))}
          <span className="flex items-center gap-1.5 px-1 text-[12px] text-muted-foreground">
            <Plus className="size-3" /> Add row
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium text-foreground/80">Columns</span>
          {["Low", "Some", "Strong", "Very strong"].map((column) => (
            <ListItem key={column}>{column}</ListItem>
          ))}
        </div>
      </div>
    </div>
  );
}

const SIDEBAR_FIELDS = [
  ["Short text", "Project title"],
  ["Currency", "Amount requested"],
  ["Matrix / Likert", "Rate the impact you expect", true],
  ["Calculated", "Total requested"],
  ["Booking slot", "Pick a time for your panel interview"],
  ["Ranking", "Rank what matters most to you"],
  ["Repeating group", "Who's on your team?"],
  ["File upload", "Upload a budget breakdown"],
];

const SIDEBAR_SECTIONS = [
  { icon: SplitSquareVertical, label: "Pages", count: 4 },
  { icon: GitBranch, label: "Branches" },
  { icon: Target, label: "Auto-triage & quiz", dot: true },
  { icon: Palette, label: "Design" },
  { icon: Clock, label: "Schedule & limits", dot: true },
  { icon: FolderOpen, label: "Submission" },
  { icon: History, label: "History" },
];

function SidebarSection({ icon: Icon, label, count, dot, open = false }) {
  return (
    <div className={cn("flex h-10 shrink-0 items-center gap-2 border-b px-4 font-semibold", LINE)}>
      <Icon className="size-4 text-muted-foreground" strokeWidth={1.75} />
      {label}
      {count ? <span className="rounded-full bg-foreground/[0.08] px-1.5 text-[10px] font-medium tabular-nums">{count}</span> : null}
      {dot ? <span className="size-1.5 rounded-full bg-emerald-500" /> : null}
      <ChevronDown className={cn("ml-auto size-4 text-muted-foreground", !open && "-rotate-90")} />
    </div>
  );
}

function AddRow() {
  return (
    <div className="flex justify-center gap-2 text-[12px]">
      <span className="flex h-8 items-center gap-1.5 rounded-md border border-foreground/30 bg-foreground/[0.06] px-3">
        <Plus className="size-3.5" /> Add field
      </span>
      <span className="flex h-8 items-center gap-1.5 rounded-md border border-foreground/[0.1] px-3 text-muted-foreground">
        <FunctionSquare className="size-3.5" /> Calculated
      </span>
      <span className="flex h-8 items-center gap-1.5 rounded-md border border-foreground/[0.1] px-3 text-muted-foreground">
        <SplitSquareVertical className="size-3.5" /> Add page
      </span>
    </div>
  );
}

// The hero's tilted plane: the builder with the impact matrix selected, the Add field palette filtered to choices and two teammates editing.
export function BuilderWindow() {
  return (
    <Window className="h-[700px] w-[1180px]">
      <BuilderBar />
      <div className="flex min-h-0 flex-1">
        <div className="relative min-w-0 flex-1 bg-foreground/[0.015]">
          <ArtCover className={cn("h-[72px] border-b", LINE)} />
          <div className="mx-auto flex w-[600px] flex-col gap-3 pt-5">
            <PageLabel>Page 1 · Your project</PageLabel>
            <CanvasCard number={1} type="Short text" title="Project title" summary="Short text · “Give it a name people will remember”" badges={<Badge>Required</Badge>} />
            <CanvasCard number={2} type="Currency" title="Amount requested" summary="Currency · USD" badges={<Badge>Required</Badge>} />
            <CanvasCard
              number={3}
              type="Matrix / Likert"
              title="Rate the impact you expect"
              badges={
                <>
                  <Badge icon={GitBranch} outline>
                    1
                  </Badge>
                  <Badge>Required</Badge>
                </>
              }
              selected
            >
              <MatrixSettings />
            </CanvasCard>
            <CanvasCard number={4} type="Calculated" title="Total requested" summary="= SUM({Materials}, {Venue hire}, {Artist fees})" badges={<Badge icon={FunctionSquare}>Calc</Badge>} />
            <AddRow />
          </div>
          <div className={cn("absolute top-[404px] left-[330px] z-[2] w-[440px] p-3", POPOVER)}>
            <span className="flex h-8 items-center gap-2 rounded-md border border-foreground/20 px-2.5 text-[12px]">
              <Search className="size-3.5 text-muted-foreground" />
              <Typed text="choice" delay={1.4} />
            </span>
            <div className="mt-3 text-[10px] font-medium tracking-[0.06em] text-muted-foreground uppercase">Choice</div>
            <div className="mt-1 grid grid-cols-3 gap-1">
              {FIELD_GROUPS[1].fields.map(([label, Icon], index) => (
                <span
                  key={label}
                  className={cn("flex h-7 min-w-0 items-center gap-2 rounded-md border px-2 text-[12px]", label === "Ranking" ? "border-foreground/20 bg-foreground/[0.07] text-foreground" : "border-transparent text-muted-foreground", styles.popIn)}
                  style={{ "--pop-delay": `${2 + index * 0.06}s` }}
                >
                  <Icon className="size-3.5 shrink-0 text-foreground/55" strokeWidth={1.75} />
                  <span className="truncate">{label}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
        <aside className={cn("flex w-[304px] shrink-0 flex-col overflow-hidden border-l bg-foreground/[0.015]", LINE)}>
          <SidebarSection icon={LayoutGrid} label="Add fields" />
          <SidebarSection icon={SlidersHorizontal} label="Fields" count={14} open />
          <div className={cn("flex shrink-0 flex-col gap-0.5 border-b px-3 py-2", LINE)}>
            {SIDEBAR_FIELDS.map(([type, title, selected]) => {
              const Icon = FIELD_ICON[type];
              return (
                <span key={title} className={cn("flex h-8 items-center gap-2 rounded-md px-1.5 text-[12px]", selected ? "bg-foreground/[0.07] text-foreground" : "text-muted-foreground")}>
                  <Icon className="size-3.5 shrink-0 text-foreground/55" strokeWidth={1.75} />
                  <span className="min-w-0 flex-1 truncate">{title}</span>
                  {type === "Calculated" ? <span className="rounded bg-foreground/[0.07] px-1 text-[9px] text-foreground/75">Calc</span> : null}
                  <Eye className="size-3.5 shrink-0 text-muted-foreground/70" />
                </span>
              );
            })}
          </div>
          {SIDEBAR_SECTIONS.map((section) => (
            <SidebarSection key={section.label} {...section} />
          ))}
        </aside>
      </div>
    </Window>
  );
}

// Section stage: page two of the application on the canvas, with every field type open in the Add field palette.
export function FieldsStage() {
  const columns = [FIELD_GROUPS.filter((_, index) => [0, 1, 2, 4].includes(index)), FIELD_GROUPS.filter((_, index) => [3, 5, 6, 7].includes(index))];
  return (
    <div className="relative h-[640px] w-[1000px]">
      <Window className="absolute top-0 left-0 h-[660px] w-[600px]">
        <BuilderBar title="Spring Grants 2026" editors={["Elena Rossi"]} compact />
        <div className="flex flex-col gap-3 bg-foreground/[0.015] px-8 pt-5">
          <PageLabel>Page 2 · Your plan</PageLabel>
          <CanvasCard number={5} type="Booking slot" title="Pick a time for your panel interview" summary="Booking slot" />
          <CanvasCard number={6} type="Ranking" title="Rank what matters most to you" summary="Ranking · Reach, Quality, Cost, Legacy" />
          <CanvasCard number={7} type="Repeating group" title="Who's on your team?" summary="Repeating group · Name, Role, Email" />
          <CanvasCard
            number={8}
            type="File upload"
            title="Upload a budget breakdown"
            summary="File upload"
            badges={
              <Badge icon={GitBranch} outline>
                2
              </Badge>
            }
          />
          <DropLine />
          <CanvasCard number={9} type="Long text" title="Anything else we should know?" summary="Long text" />
          <div className="mt-1">
            <AddRow />
          </div>
        </div>
      </Window>
      <div className={cn("absolute top-[36px] left-[436px] z-[2] w-[560px] p-3.5", POPOVER, styles.float)}>
        <PaletteSearch />
        <div className="mt-3 grid grid-cols-2 gap-4">
          {columns.map((groups, column) => (
            <div key={column} className="flex flex-col gap-3">
              {groups.map(({ group, fields }, index) => (
                <div key={group} className={styles.popIn} style={{ "--pop-delay": `${0.2 + (column * 4 + index) * 0.08}s` }}>
                  <PaletteGroup group={group} fields={fields} active="Signature" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ConditionRow({ joiner, field, operator, value }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-foreground/[0.08] bg-foreground/[0.02] p-2">
      <span className="flex h-5 w-9 shrink-0 items-center justify-center rounded border border-foreground/[0.1] text-[10px] font-semibold tracking-wide text-muted-foreground">{joiner}</span>
      <Select className="w-[152px] px-2">{field}</Select>
      <Select className="w-[114px] px-2">{operator}</Select>
      <Input className="h-7 w-[56px] font-mono text-[11px]">{value}</Input>
    </div>
  );
}

// Cell: a file upload that only appears when the budget is large and the applicant is new.
export function LogicRender() {
  return (
    <div className={cn("mx-auto w-[460px] p-4 text-[13px]", CARD)}>
      <div className="flex items-center gap-3">
        <IconBox type="File upload" size="sm" />
        <span className="font-semibold">8. Upload a budget breakdown</span>
        <span className="ml-auto">
          <Badge icon={GitBranch} outline>
            2
          </Badge>
        </span>
      </div>
      <Tabs tabs={["Question", "Validation", "Logic · 2", "Advanced"]} active={2} className="mt-3" />
      <div className="mt-3 rounded-lg border border-foreground/[0.08] p-3">
        <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
          <GitBranch className="size-3.5" /> Show this field only when
          <span className="ml-auto flex rounded-md border border-foreground/[0.1] p-0.5 text-[10px] font-medium uppercase">
            <span className="rounded px-2 py-0.5">Any</span>
            <span className="rounded bg-foreground/[0.08] px-2 py-0.5 text-foreground">All</span>
          </span>
        </div>
        <div className="mt-2.5 flex flex-col gap-2">
          <div className={styles.popIn} style={{ "--pop-delay": "0.3s" }}>
            <ConditionRow joiner="IF" field="Amount requested" operator="Greater than" value="5000" />
          </div>
          <div className={styles.popIn} style={{ "--pop-delay": "0.5s" }}>
            <ConditionRow joiner="AND" field="Had a grant before?" operator="Equals" value="No" />
          </div>
        </div>
        <span className="mt-2.5 flex h-7 items-center justify-center gap-1.5 rounded-md border border-foreground/[0.1] text-[12px] text-muted-foreground">
          <Plus className="size-3.5" /> Add condition
        </span>
      </div>
    </div>
  );
}

const FUNCTIONS = ["IF", "SUM", "MIN", "MAX", "AVG", "ROUND", "ABS", "DAYS", "LEN"];
const SAMPLES = [
  ["Materials", "$2,400"],
  ["Venue hire", "$1,800"],
  ["Artist fees", "$3,250"],
];

// Cell: the calculated total, with function help and a live preview on sample answers.
export function FormulaRender() {
  return (
    <div className={cn("mx-auto w-[460px] p-4 text-[13px]", CARD)}>
      <div className="flex items-center gap-3">
        <IconBox type="Calculated" size="sm" />
        <span className="font-semibold">4. Total requested</span>
        <span className="ml-auto">
          <Badge icon={FunctionSquare}>Calc</Badge>
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between text-[11px] font-medium text-foreground/80">
        Formula
        <span className="flex items-center gap-1 font-normal text-muted-foreground">
          <Plus className="size-3" /> Insert field
        </span>
      </div>
      <div className="mt-1.5 flex items-center gap-2 rounded-md border border-foreground/[0.12] bg-background/50 px-2.5 py-2 font-mono text-[12px] dark:bg-foreground/[0.03]">
        <Equal className="size-3.5 shrink-0 text-muted-foreground" />
        <Typed text="SUM({Materials}, {Venue hire}, {Artist fees})" delay={1.2} />
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {FUNCTIONS.map((name) => (
          <span key={name} className={cn("rounded border px-1.5 py-0.5 font-mono text-[10px]", name === "SUM" ? "border-foreground/30 text-foreground" : "border-foreground/[0.1] text-muted-foreground")}>
            {name}
          </span>
        ))}
      </div>
      <div className={cn("mt-2 flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400", styles.popIn)} style={{ "--pop-delay": "3.6s" }}>
        <CheckCircle2 className="size-3" /> Formula looks good.
      </div>
      <div className="mt-2.5 rounded-lg border border-foreground/[0.09] bg-foreground/[0.03] px-3 py-2.5">
        <div className="flex items-center gap-1.5 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
          <FlaskConical className="size-3" /> Live preview
          <span className="ml-auto font-mono text-[14px] tracking-normal text-foreground normal-case tabular-nums">= $7,450.00</span>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {SAMPLES.map(([label, value]) => (
            <div key={label} className="rounded-md border border-foreground/[0.08] px-2 py-1.5">
              <div className="truncate text-[10px] text-muted-foreground">{label}</div>
              <div className="text-[12px] text-foreground/90 tabular-nums">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Threshold({ label, children }) {
  return (
    <div className="flex items-center gap-2 text-[12px]">
      <span className="w-[70px]">
        <StatusDot status={label} />
      </span>
      <span className="text-muted-foreground">{children}</span>
    </div>
  );
}

// Cell: option points and a calculated field add up to a score, and the score sets the priority.
export function ScoringRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[460px] text-[13px]">
      <div className={cn("absolute top-0 left-0 w-[300px] p-4", CARD)}>
        <div className="flex items-center gap-2 font-semibold">
          <Target className="size-4 text-muted-foreground" /> Auto-triage &amp; quiz
          <span className="size-1.5 rounded-full bg-emerald-500" />
        </div>
        <div className="mt-3 flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-[12px] text-foreground/90">Score responses</div>
            <div className="text-[11px] leading-4 text-muted-foreground">Total points set the response priority on submit.</div>
          </div>
          <Toggle />
        </div>
        <div className="mt-3 flex flex-col gap-2 rounded-lg border border-foreground/[0.08] p-3">
          <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">Priority thresholds</span>
          <Threshold label="High">≥ 40 points</Threshold>
          <Threshold label="Medium">≥ 20 points</Threshold>
          <Threshold label="Low">below 20 points</Threshold>
        </div>
        <div className="mt-3 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">Option points</div>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {["Had a grant before?", "Expected audience"].map((field) => (
            <span key={field} className="rounded border border-foreground/[0.1] px-1.5 py-0.5 text-[11px] text-muted-foreground">
              {field}
            </span>
          ))}
        </div>
      </div>
      <div className={cn("absolute top-[150px] left-[248px] z-[2] w-[210px] p-3.5", POPOVER, styles.popIn)} style={{ "--pop-delay": "0.7s" }}>
        <div className="flex items-center gap-2">
          <Avatar name="Zara Patel" size={22} />
          <div className="min-w-0">
            <div className="truncate font-medium">Zara Patel</div>
            <div className="text-[11px] text-muted-foreground">Just submitted</div>
          </div>
        </div>
        <div className={cn("mt-3 flex items-center justify-between border-t pt-2.5 text-[12px]", LINE)}>
          <span className="text-muted-foreground">Score</span>
          <span className="font-medium tabular-nums">44</span>
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[12px]">
          <span className="text-muted-foreground">Priority</span>
          <StatusDot status="High" />
        </div>
      </div>
    </div>
  );
}

// Cell: the builder's presence avatars and the notice when a teammate saves over your view.
export function PresenceRender() {
  return (
    <div className={cn("relative mx-auto h-[300px] w-[460px] overflow-hidden text-[13px]", CARD, styles.fadeBottom)}>
      <BuilderBar title="Spring Grants 2026" compact />
      <div className="flex flex-col gap-2.5 bg-foreground/[0.015] px-5 pt-4">
        <div className={cn("flex items-center gap-2.5 rounded-lg border border-foreground/[0.12] bg-foreground/[0.05] px-3 py-2 text-[12px]", styles.popIn)} style={{ "--pop-delay": "0.9s" }}>
          <RefreshCw className="size-3.5 shrink-0 text-muted-foreground" />
          <span>
            Updated by <span className="font-medium">Elena Rossi</span>.
          </span>
          <span className="rounded-md border border-foreground/[0.12] px-2 py-0.5 text-[11px]">Reload</span>
          <X className="ml-auto size-3.5 text-muted-foreground" />
        </div>
        <CanvasCard number={1} type="Short text" title="Project title" summary="Short text" />
        <CanvasCard number={2} type="Currency" title="Amount requested" summary="Currency · USD" />
        <CanvasCard number={3} type="Matrix / Likert" title="Rate the impact you expect" summary="Matrix / Likert" />
      </div>
      <div className={cn("absolute top-[50px] left-[278px] z-[2] w-[168px] px-3 py-2.5 text-[12px]", POPOVER, styles.popIn)} style={{ "--pop-delay": "0.4s" }}>
        <div className="font-medium">Also editing</div>
        {["Elena Rossi", "Noah Fischer"].map((name) => (
          <div key={name} className="mt-1.5 flex items-center gap-2 text-foreground/85">
            <Avatar name={name} size={16} /> {name}
          </div>
        ))}
      </div>
    </div>
  );
}

const THEMES = [
  { name: "Geiger", dark: true, radius: "rounded-md" },
  { name: "Daylight", radius: "rounded-md" },
  { name: "Midnight", dark: true, radius: "rounded-lg" },
  { name: "Ocean", dark: true, radius: "rounded-lg" },
  { name: "Forest", dark: true, radius: "rounded-md", font: "font-serif" },
  { name: "Editorial", radius: "rounded-none", font: "font-serif italic", active: true },
  { name: "Studio", radius: "rounded-lg" },
  { name: "Blossom", radius: "rounded-full", font: "font-serif" },
  { name: "Poster", dark: true, radius: "rounded-sm", font: "font-black tracking-tight uppercase" },
  { name: "Terminal", dark: true, radius: "rounded-none", font: "font-mono" },
];

function ThemeSwatch({ theme }) {
  return (
    <div className={cn("overflow-hidden rounded-lg border", theme.active ? "border-foreground/50 ring-2 ring-foreground/20" : "border-foreground/[0.1]")}>
      <div className={cn("flex h-[42px] items-center justify-center gap-1.5", theme.dark ? "bg-neutral-900 text-neutral-100" : "bg-neutral-100 text-neutral-900")}>
        <span className={cn("text-[15px] leading-none font-semibold", theme.font)}>Aa</span>
        <span className={cn("h-2.5 w-3", theme.radius, theme.dark ? "bg-neutral-100/60" : "bg-neutral-900/45")} />
      </div>
      <div className={cn("truncate border-t px-1.5 py-1 text-[10px]", LINE, theme.active ? "font-medium text-foreground" : "text-muted-foreground")}>{theme.name}</div>
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[12px] text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

// SplitShowcase render: the Design panel with the Editorial theme applied, and the respondent page it produces.
export function ThemeRender() {
  return (
    <Window title="Design" icon={Paintbrush} meta="Spring Grants 2026 — Application" className="h-[440px] w-[680px]">
      <div className="flex min-h-0 flex-1">
        <div className={cn("flex w-[360px] shrink-0 flex-col gap-3.5 border-r p-4", LINE)}>
          <MonoLabel>Themes</MonoLabel>
          <div className="-mt-1 grid grid-cols-5 gap-1.5">
            {THEMES.map((theme) => (
              <ThemeSwatch key={theme.name} theme={theme} />
            ))}
          </div>
          <Row label="Colour mode">
            <Segmented options={["Dark", "Light", "Device"]} active={1} />
          </Row>
          <Row label="Corners">
            <Segmented options={["Square", "S", "M", "L", "Round"]} active={0} />
          </Row>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="mb-1 text-[11px] text-muted-foreground">Body font</div>
              <Select className="w-full">Lora</Select>
            </div>
            <div>
              <div className="mb-1 text-[11px] text-muted-foreground">Heading font</div>
              <Select className="w-full">Playfair Display</Select>
            </div>
          </div>
          <Row label="Progress bar">
            <Toggle />
          </Row>
        </div>
        <div className="flex flex-1 items-start justify-center bg-foreground/[0.03] px-6 pt-8">
          <div className="w-full border border-neutral-300 bg-neutral-50 p-5 text-neutral-900 shadow-lg shadow-black/15">
            <BrightloopMark size={22} className="rounded-none bg-neutral-900 text-neutral-50" />
            <div className="mt-3 font-serif text-[20px] leading-tight font-semibold tracking-[-0.01em]">Spring Grants 2026</div>
            <div className="mt-1 font-serif text-[12px] text-neutral-500">Step 2 of 4</div>
            <div className="mt-2 h-1 bg-neutral-200">
              <div className={cn("h-full w-1/2 origin-left bg-neutral-800", styles.fill)} />
            </div>
            <div className="mt-4 font-serif text-[12px] text-neutral-700">Email address</div>
            <div className="mt-1 h-8 border border-neutral-300 bg-white" />
            <div className="mt-3 font-serif text-[12px] text-neutral-700">Had a grant from Brightloop before?</div>
            <div className="mt-1.5 flex gap-2 font-serif text-[12px]">
              <span className="border border-neutral-800 bg-neutral-900/[0.06] px-3 py-1">No</span>
              <span className="border border-neutral-300 px-3 py-1 text-neutral-500">Yes</span>
            </div>
            <div className="mt-4 flex h-8 items-center justify-center bg-neutral-900 font-serif text-[12px] font-medium text-neutral-50">Next</div>
          </div>
        </div>
      </div>
    </Window>
  );
}

const CHOICES = ["Under 100 people", "100 to 500 people", "More than 500 people"];

// Cell: the same application as a classic page and one question at a time.
export function LayoutRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[460px] text-[13px]">
      <div className="flex justify-center">
        <Segmented options={["Classic", "One at a time"]} active={1} />
      </div>
      <div className={cn("absolute top-[48px] left-0 w-[200px] p-4 opacity-70", CARD)}>
        <div className="text-[13px] font-semibold">Spring Grants 2026</div>
        <div className="mt-0.5 text-[11px] text-muted-foreground">Step 1 of 4</div>
        <div className="mt-1.5 h-1 rounded-full bg-foreground/[0.08]">
          <div className="h-full w-1/4 rounded-full bg-foreground/60" />
        </div>
        {[72, 54, 64].map((width) => (
          <div key={width} className="mt-3.5">
            <Bar className="h-1.5" />
            <div className="mt-1.5 h-6 rounded-md border border-foreground/[0.1]" style={{ width: `${width + 28}%` }} />
          </div>
        ))}
        <div className="mt-4 flex h-7 items-center justify-center rounded-md bg-foreground/80 text-[11px] text-background">Next</div>
      </div>
      <div className={cn("absolute top-[52px] left-[150px] z-[2] w-[310px] overflow-hidden", POPOVER, styles.float)}>
        <div className="h-1 bg-foreground/[0.06]">
          <div className={cn("h-full w-[42%] origin-left bg-foreground/70", styles.fill)} />
        </div>
        <div className="px-5 pt-4 pb-4">
          <div className="text-[11px] text-muted-foreground">
            <span className="font-mono">5</span> of 12
          </div>
          <div className="mt-1.5 text-[15px] leading-snug font-medium tracking-[-0.01em]">How many people will your project reach?</div>
          <div className="mt-3 flex flex-col gap-1.5">
            {CHOICES.map((choice, index) => (
              <span key={choice} className={cn("flex items-center gap-2.5 rounded-lg border px-2.5 py-1.5 text-[12px]", index === 1 ? "border-foreground/40 bg-foreground/[0.06]" : "border-foreground/[0.1]")}>
                <span className="flex size-[18px] items-center justify-center rounded border border-foreground/15 font-mono text-[10px] text-muted-foreground">{"ABC"[index]}</span>
                {choice}
                {index === 1 ? <CheckCircle2 className="ml-auto size-3.5" /> : null}
              </span>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2.5">
            <span className="flex h-7 items-center rounded-md bg-foreground px-3 text-[12px] font-medium text-background">OK</span>
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              press <Kbd>Enter</Kbd> <CornerDownLeft className="size-3" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const PAGES = [
  { title: "Your project", fields: 4 },
  { title: "Your plan", fields: 5, branch: true },
  { title: "Budget", fields: 3 },
  { title: "Sign & submit", fields: 2 },
];

// Cell: four pages, a welcome screen before them and an ending after.
export function StepsRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[460px] text-[13px]">
      <div className="absolute top-0 left-0 flex w-[200px] flex-col gap-1.5">
        <div className="mb-0.5 flex items-center gap-2 text-[12px] font-semibold">
          <SplitSquareVertical className="size-3.5 text-muted-foreground" /> Pages
          <span className="rounded-full bg-foreground/[0.08] px-1.5 text-[10px] font-medium">4</span>
        </div>
        {PAGES.map((page, index) => (
          <div key={page.title} className={cn("flex items-center gap-2 rounded-md border px-2.5 py-1.5", index === 1 ? "border-foreground/25 bg-foreground/[0.04]" : "border-foreground/[0.09]")}>
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-foreground/[0.07] text-[10px] font-semibold text-muted-foreground">{index + 1}</span>
            <span className="min-w-0 flex-1 truncate text-[12px] text-foreground/85">{page.title}</span>
            {page.branch ? <GitBranch className="size-3 text-muted-foreground" /> : null}
            <span className="text-[10px] text-muted-foreground">{page.fields} fields</span>
          </div>
        ))}
        <span className="flex h-7 items-center justify-center gap-1.5 rounded-md border border-foreground/[0.1] text-[12px] text-muted-foreground">
          <Plus className="size-3.5" /> Add page
        </span>
      </div>
      <div className={cn("absolute top-0 left-[222px] w-[238px] p-4", CARD)}>
        <MonoLabel className="text-[10px]">Welcome screen</MonoLabel>
        <div className="mt-3 flex items-center gap-2">
          <BrightloopMark size={20} />
          <span className="text-[14px] font-semibold tracking-[-0.01em]">Spring Grants 2026</span>
        </div>
        <p className="mt-2 text-[12px] leading-[1.45] text-muted-foreground">Up to $10,000 for community arts projects. It takes about 12 minutes.</p>
        <span className="mt-3 inline-flex h-7 items-center rounded-md bg-foreground px-3 text-[12px] font-medium text-background">Start</span>
      </div>
      <div className={cn("absolute top-[150px] left-[196px] z-[2] w-[264px] p-3.5", POPOVER, styles.popIn)} style={{ "--pop-delay": "0.6s" }}>
        <MonoLabel className="text-[10px]">Ending</MonoLabel>
        <div className="mt-2 flex items-center gap-2 text-[14px] font-semibold">
          <CheckCircle2 className="size-4 text-emerald-500" /> Response submitted
        </div>
        <p className="mt-1 text-[12px] leading-[1.45] text-muted-foreground">Thanks, Zara. We’ll reply by 30 May.</p>
        <div className="mt-2.5 text-[11px] text-muted-foreground">Edit your response later with this link</div>
      </div>
    </div>
  );
}

const TEMPLATE_CARDS = [
  { icon: UserPlus, title: "Membership application", description: "Multi-step membership application with an approval step.", meta: "Registration · 7 fields", badges: ["Approvals"] },
  { icon: FIELD_ICON["Product"], title: "Membership subscription", description: "Recurring monthly membership billed through Stripe subscriptions.", meta: "Payments · 3 fields", badges: ["Subscription"] },
  { icon: FIELD_ICON["Currency"], title: "Donation", description: "Fixed gift levels with an optional dedication and a receipt email.", meta: "Payments · 5 fields", badges: ["Payments"] },
  { icon: FIELD_ICON["NPS (0–10)"], title: "NPS survey", description: "Net Promoter Score with a follow-up question for detractors.", meta: "Surveys · 4 fields", badges: [] },
  { icon: FIELD_ICON["File upload"], title: "Contest entry", description: "One entry per person with a file upload and rules acceptance.", meta: "Community · 4 fields", badges: [] },
  { icon: FIELD_ICON["Star rating"], title: "Post-event feedback", description: "Session ratings and suggestions after an event.", meta: "Operations · 4 fields", badges: [] },
  { icon: FIELD_ICON["Signature"], title: "E-sign agreement", description: "Agreement text, signature capture and a signed PDF document template.", meta: "Healthcare & legal · 3 fields", badges: ["E-signature"] },
  { icon: FIELD_ICON["Long text"], title: "Admissions application", description: "Multi-page application with transcripts and a statement.", meta: "Education · 5 fields", badges: ["Approvals"] },
  { icon: FIELD_ICON["Calculated"], title: "Quote calculator", description: "Instant estimate from quantities and options using formulas.", meta: "Finance · 3 fields", badges: [] },
];

const CATEGORIES = ["Lead generation", "Payments", "Registration", "Surveys", "Assessment", "HR", "Support", "Healthcare & legal", "Education", "Finance", "Operations", "Community"];

const PREVIEW_FIELDS = [
  { title: "Full name", type: "Full name", required: true },
  { title: "Email address", type: "Email", required: true },
  { title: "Phone number", type: "Phone" },
  { title: "Address", type: "Address" },
  { title: "Page: About you", type: "Page break", page: true },
  { title: "Membership type", type: "Dropdown", required: true },
  { title: "Why do you want to join?", type: "Long text" },
  { title: "I agree to follow the code of conduct.", type: "Checkbox (yes/no)", required: true },
];

function TemplateCard({ template }) {
  const Icon = template.icon;
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-foreground/[0.09] bg-foreground/[0.015]">
      <div className="flex flex-1 items-start gap-2.5 p-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-foreground/[0.09] bg-foreground/[0.03] text-muted-foreground">
          <Icon className="size-3.5" strokeWidth={1.75} />
        </span>
        <div className="min-w-0">
          <div className="truncate text-[12px] font-medium">{template.title}</div>
          <p className="mt-0.5 line-clamp-2 text-[11px] leading-4 text-muted-foreground">{template.description}</p>
        </div>
      </div>
      <div className={cn("flex items-center gap-1.5 border-t px-3 py-1.5", LINE)}>
        <span className="truncate text-[10px] text-muted-foreground">{template.meta}</span>
        <span className="ml-auto rounded border border-foreground/[0.1] px-1.5 text-[10px] leading-4 text-foreground/80">Use</span>
      </div>
    </div>
  );
}

// Section stage: the Template Gallery with its twelve categories open and a template previewed field by field.
export function TemplatesStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <Window className="absolute top-0 left-0 h-[640px] w-[720px]">
        <div className={cn("flex items-center gap-3 border-b px-5 py-4", LINE)}>
          <div>
            <div className="flex items-center gap-2 text-[15px] font-semibold tracking-[-0.01em]">
              <LayoutTemplate className="size-4 text-muted-foreground" /> Templates
            </div>
            <div className="mt-0.5 text-[12px] text-muted-foreground">Start from a proven form for any use case, or save your own as reusable starting points.</div>
          </div>
          <span className="ml-auto flex h-8 shrink-0 items-center gap-1.5 rounded-md bg-foreground px-3 text-[12px] font-medium text-background">
            <FilePlus2 className="size-3.5" /> Create template
          </span>
        </div>
        <div className="flex items-center gap-2 px-5 py-3">
          <Segmented options={["Gallery (42)", "Your templates (3)"]} />
          <Select className="h-8 w-[150px] border-foreground/25">All categories</Select>
          <span className="ml-auto flex h-8 w-[170px] items-center gap-2 rounded-md border border-foreground/[0.1] px-2.5 text-[12px] text-muted-foreground">
            <Search className="size-3.5" /> Search templates…
          </span>
        </div>
        <div className="relative grid grid-cols-3 gap-2.5 px-5">
          {TEMPLATE_CARDS.map((template) => (
            <TemplateCard key={template.title} template={template} />
          ))}
          <div className={cn("absolute top-[-6px] left-[234px] z-[2] w-[190px] p-1 text-[12px]", POPOVER)}>
            <div className="flex items-center rounded-md bg-foreground/[0.07] px-2.5 py-1.5">
              All categories <CheckCircle2 className="ml-auto size-3.5" />
            </div>
            {CATEGORIES.map((category, index) => (
              <div key={category} className={cn("rounded-md px-2.5 py-[5px] text-foreground/80", styles.popIn)} style={{ "--pop-delay": `${0.2 + index * 0.04}s` }}>
                {category}
              </div>
            ))}
          </div>
        </div>
      </Window>
      <div className={cn("absolute top-[70px] left-[620px] z-[3] w-[380px] p-5 text-[13px]", POPOVER, styles.float)}>
        <div className="flex items-start">
          <div>
            <div className="text-[15px] font-semibold tracking-[-0.01em]">Membership application</div>
            <div className="mt-0.5 text-[12px] text-muted-foreground">Multi-step membership application with an approval step.</div>
          </div>
          <X className="ml-auto size-4 shrink-0 text-muted-foreground" />
        </div>
        <div className="mt-3 flex gap-1">
          <Badge>Registration</Badge>
          <Badge outline>Approvals</Badge>
        </div>
        <div className="mt-2 text-[11px] text-muted-foreground">7 fields</div>
        <div className="mt-2 overflow-hidden rounded-lg border border-foreground/[0.09]">
          {PREVIEW_FIELDS.map((field) => {
            const Icon = FIELD_ICON[field.type];
            return (
              <div key={field.title} className={cn("flex items-center gap-2.5 border-b px-3 py-[7px] last:border-b-0", LINE, field.page && "bg-foreground/[0.03]")}>
                <Icon className="size-3.5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
                <span className="min-w-0 flex-1 truncate text-[12px]">{field.title}</span>
                {field.required ? <span className="text-[10px] text-red-600 dark:text-red-400">Required</span> : null}
                <span className="shrink-0 text-[10px] text-muted-foreground">{field.type}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex justify-end gap-2 text-[12px]">
          <span className="flex h-8 items-center rounded-md px-3 text-muted-foreground">Close</span>
          <span className="flex h-8 items-center gap-1.5 rounded-md bg-foreground px-3 font-medium text-background">
            <FilePlus2 className="size-3.5" /> Use template
          </span>
        </div>
      </div>
    </div>
  );
}

const VERSIONS = [
  { label: "v4.0", when: "Today, 10:42", author: "Ravi Menon", notes: "Added the budget formula and the impact matrix.", latest: true },
  { label: "v3.0", when: "Yesterday", author: "Elena Rossi", notes: "Split the form into four pages." },
  { label: "v2.0", when: "12 Mar", author: "Ravi Menon", notes: "Opened the round to individual artists." },
];

const DIFF = [
  { count: 2, label: "fields come back", tone: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300", items: "Previous grant amount, Referee email" },
  { count: 1, label: "fields are removed", tone: "bg-red-500/15 text-red-600 dark:text-red-400", items: "Rate the impact you expect" },
  { count: 3, label: "fields change", tone: "bg-amber-500/15 text-amber-700 dark:text-amber-300", items: "Project title, Total requested, Sign your application" },
];

// Cell: saved versions with notes, and the restore preview that lists what will change.
export function VersionsRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[460px] text-[13px]">
      <div className="absolute top-0 left-0 flex w-[220px] flex-col gap-2">
        <div className="flex items-center gap-2 text-[12px] font-semibold">
          <History className="size-3.5 text-muted-foreground" /> History
        </div>
        {VERSIONS.map((version) => (
          <div key={version.label} className={cn("rounded-md border p-2.5", version.latest ? "border-foreground/25 bg-foreground/[0.04]" : "border-foreground/[0.09]")}>
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold">{version.label}</span>
              {version.latest ? <span className="rounded-full bg-foreground/[0.08] px-1.5 text-[10px]">Latest</span> : null}
            </div>
            <div className="mt-0.5 text-[10px] text-muted-foreground">
              {version.when} · {version.author}
            </div>
            <div className="mt-1 line-clamp-1 text-[11px] text-foreground/75">{version.notes}</div>
          </div>
        ))}
      </div>
      <div className={cn("absolute top-[16px] left-[170px] z-[2] w-[290px] p-4", POPOVER, styles.float)}>
        <div className="text-[14px] font-semibold">Restore v2.0?</div>
        <p className="mt-1 text-[11px] leading-4 text-muted-foreground">Your current form is saved as a “Before restore” version first, so you can always come back to it.</p>
        <div className="mt-3 flex flex-col gap-2 rounded-lg border border-foreground/[0.09] p-2.5">
          {DIFF.map((row, index) => (
            <div key={row.label} className={styles.popIn} style={{ "--pop-delay": `${0.4 + index * 0.15}s` }}>
              <div className="flex items-center gap-1.5 text-[12px] font-medium">
                <span className={cn("rounded px-1.5 text-[10px] leading-4", row.tone)}>{row.count}</span>
                {row.label}
              </div>
              <div className="mt-0.5 truncate text-[11px] text-muted-foreground">{row.items}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex justify-end gap-2 text-[12px]">
          <span className="flex h-7 items-center px-2 text-muted-foreground">Cancel</span>
          <span className="flex h-7 items-center gap-1.5 rounded-md bg-foreground px-2.5 font-medium text-background">
            <RotateCcw className="size-3" /> Restore version
          </span>
        </div>
      </div>
    </div>
  );
}

const YOURS = [
  { title: "Grant application — community arts", meta: "Updated today" },
  { title: "Studio membership", meta: "Updated 3 days ago" },
  { title: "Workshop feedback", meta: "Updated last week" },
];

// Cell: a finished form saved as the team's own template.
export function SaveTemplateRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[460px] text-[13px]">
      <div className="absolute top-0 left-0 flex w-[250px] flex-col gap-2 opacity-80">
        <Segmented options={["Gallery (42)", "Your templates (3)"]} active={1} className="self-start" />
        {YOURS.map((template, index) => (
          <div key={template.title} className={cn("flex items-center gap-2.5 rounded-lg border border-foreground/[0.09] px-3 py-2.5", styles.popIn)} style={{ "--pop-delay": `${0.2 + index * 0.12}s` }}>
            <span className="flex size-7 shrink-0 items-center justify-center rounded-md border border-foreground/[0.09] text-muted-foreground">
              <LayoutTemplate className="size-3.5" />
            </span>
            <div className="min-w-0">
              <div className="truncate text-[12px] font-medium">{template.title}</div>
              <div className="text-[10px] text-muted-foreground">{template.meta}</div>
            </div>
          </div>
        ))}
      </div>
      <div className={cn("absolute top-[54px] left-[150px] z-[2] w-[310px] p-4", POPOVER, styles.float)}>
        <div className="text-[14px] font-semibold">Create template</div>
        <div className="mt-0.5 text-[11px] text-muted-foreground">Save a reusable starting point for your team.</div>
        <div className="mt-3 text-[11px] font-medium text-foreground/80">Template name</div>
        <Input className="mt-1.5">
          <Typed text="Grant application — youth music" delay={1.3} />
        </Input>
        <div className="mt-3 text-[11px] font-medium text-foreground/80">Start from</div>
        <Select className="mt-1.5 h-8 w-full">Copy of “Spring Grants 2026 — Application”</Select>
        <div className="mt-4 flex justify-end gap-2 text-[12px]">
          <span className="flex h-7 items-center px-2 text-muted-foreground">Cancel</span>
          <span className="flex h-7 items-center gap-1.5 rounded-md bg-foreground px-2.5 font-medium text-background">
            <FilePlus2 className="size-3" /> Create
          </span>
        </div>
      </div>
    </div>
  );
}
