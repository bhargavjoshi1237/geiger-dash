import {
  Archive,
  CalendarClock,
  Check,
  ChevronDown,
  ChevronLeft,
  ClipboardCheck,
  ExternalLink,
  Eye,
  Factory,
  FileJson,
  FilePenLine,
  FileText,
  GitCompareArrows,
  Hourglass,
  Image as ImageIcon,
  LayoutDashboard,
  Link2,
  Lock,
  MessageSquareText,
  Mountain,
  MoreHorizontal,
  Plus,
  Save,
  Search,
  Sparkles,
  SquarePen,
  Store,
  TextQuote,
  Trash2,
  UserCheck,
  Users,
  X,
  CookingPot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, Bar, Chip, Dot, LINE, MonoLabel, PriorityIcon, Typed, Window } from "@/components/product-pages/mock_kit";
import {
  CodeBlock,
  ContentSidebar,
  FIELD_TYPES,
  GhostButton,
  Input,
  Method,
  PrimaryButton,
  ScreenHead,
  Select,
  StatsRow,
  StatusPill,
  TypeTag,
} from "@/components/product-pages/apps/content/content_kit";
import styles from "@/components/product-pages/product_pages.module.css";

// Geiger Content modelling renders: Atlas Coffee's content types and field schemas, the editors, assignments, the assistant and review.

const ORIGIN_FIELDS = [
  { label: "Name", key: "name", type: "Text", flags: ["required"], rules: '{"required":true,"maxLength":80}' },
  { label: "Country", key: "country", type: "Enum", flags: ["required"], rules: '{"required":true,"options":["Ethiopia","Colombia","Kenya"]}' },
  { label: "Region", key: "region", type: "Text", rules: "—" },
  { label: "Altitude (m)", key: "altitude", type: "Number", flags: ["required"], rules: '{"required":true,"min":800,"max":2600}' },
  { label: "Process", key: "process", type: "Enum", flags: ["required"], rules: '{"options":["Washed","Natural","Honey","Anaerobic"]}' },
  { label: "Tasting notes", key: "tasting_notes", type: "Text", flags: ["localized"], rules: '{"maxLength":140}' },
  { label: "Harvest", key: "harvest", type: "Date", rules: "—" },
  { label: "Roastery", key: "roastery", type: "Reference", flags: ["required"], rules: '{"required":true}' },
  { label: "Story", key: "story", type: "Rich text", flags: ["localized"], rules: "—" },
  { label: "Cover", key: "cover", type: "Media", rules: "—" },
  { label: "Cupping scores", key: "cupping", type: "JSON", rules: "—" },
  { label: "Decaf", key: "decaf", type: "Boolean", rules: "—" },
  { label: "Buyer price (USD/kg)", key: "buyer_price", type: "Number", flags: ["private"], rules: '{"min":0}' },
];

function FieldRow({ field, index, active }) {
  return (
    <div className={cn("grid grid-cols-[minmax(0,1fr)_120px_250px_28px] items-center gap-4 border-b px-4 py-2.5", LINE, active && "bg-foreground/[0.04]")}>
      <div className="min-w-0">
        <div className="truncate font-medium text-foreground/90">{field.label}</div>
        <div className="truncate text-[11px] text-muted-foreground">
          {field.key} · position {index + 1}
          {(field.flags || []).map((flag) => ` · ${flag}`).join("")}
        </div>
      </div>
      <TypeTag type={field.type} className="justify-self-start" />
      <span className="truncate font-mono text-[11px] text-muted-foreground">{field.rules}</span>
      <MoreHorizontal className="size-4 justify-self-end text-muted-foreground" />
    </div>
  );
}

function NewFieldDialog({ className }) {
  return (
    <div className={cn("rounded-xl border border-foreground/[0.12] bg-surface-card p-5 text-[13px] shadow-2xl shadow-black/30 dark:bg-surface-dialog", className)}>
      <div className="flex items-start">
        <div>
          <div className="text-[15px] font-medium tracking-[-0.01em]">New field</div>
          <div className="mt-0.5 text-[12px] text-muted-foreground">Adds a typed field to Origin.</div>
        </div>
        <X className="ml-auto size-4 text-muted-foreground" />
      </div>
      <div className="mt-4 grid gap-3">
        <Input label="Label">
          <Typed text="Drying method" delay={1.4} />
        </Input>
        <div className={styles.popIn} style={{ "--pop-delay": "2.4s" }}>
          <Input label="Key" hint="Auto-filled from the label." mono>
            drying_method
          </Input>
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          <Select label="Data type">Enum</Select>
          <Input label="Position">14</Input>
          <Select label="Localized">No</Select>
        </div>
        <Input label="Options" hint="Comma-separated, e.g. free, pro.">
          <span className="truncate">Raised beds, Patio, Mechanical</span>
        </Input>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <span className="inline-flex h-8 items-center rounded-lg px-3 text-[12px] text-muted-foreground">Cancel</span>
        <PrimaryButton>Create field</PrimaryButton>
      </div>
    </div>
  );
}

// The hero's tilted plane: the Origin type's field schema, with a new field being named.
export function SchemaWindow() {
  return (
    <Window className="relative h-[700px] w-[1180px]">
      <div className="flex h-full">
        <ContentSidebar open="Architecture" active="Field Schemas" />
        <div className="min-w-0 flex-1">
          <ScreenHead
            title="Field Schemas"
            description="Fields belong to a content type and validate entries.data on save."
            actions={
              <>
                <GhostButton icon={FileJson}>
                  Origin <ChevronDown className="size-3 text-muted-foreground" />
                </GhostButton>
                <PrimaryButton icon={Plus}>New field</PrimaryButton>
              </>
            }
          />
          <div className="flex flex-col gap-4 px-6 py-4">
            <StatsRow
              stats={[
                { label: "Fields", value: "13", footer: "On Origin" },
                { label: "Required", value: "5", footer: "Must have a value" },
                { label: "Localized", value: "2", footer: "Vary per locale" },
                { label: "With rules", value: "7", footer: "Have validation" },
              ]}
            />
            <div className="flex items-center gap-2">
              <Chip>
                All Data Types <ChevronDown className="size-3 text-muted-foreground" />
              </Chip>
              <span className="ml-auto flex h-8 w-[240px] items-center gap-2 rounded-lg border border-foreground/[0.1] px-3 text-[12px] text-muted-foreground">
                <Search className="size-3.5" /> Search fields…
              </span>
            </div>
            <div className="overflow-hidden rounded-xl border border-foreground/[0.08]">
              <div className={cn("grid grid-cols-[minmax(0,1fr)_120px_250px_28px] gap-4 border-b bg-foreground/[0.02] px-4 py-2 text-[11px] text-muted-foreground", LINE)}>
                <span>Field</span>
                <span>Type</span>
                <span>Rules</span>
              </div>
              {ORIGIN_FIELDS.map((field, index) => (
                <FieldRow key={field.key} field={field} index={index} active={field.key === "roastery"} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <NewFieldDialog className="absolute top-[290px] left-[730px] z-[2] w-[350px]" />
    </Window>
  );
}

const TYPES = [
  { name: "Article", key: "article", fields: 9, plural: "/articles", icon: FileText, iconName: "FileText" },
  { name: "Recipe", key: "recipe", fields: 11, plural: "/recipes", icon: CookingPot, iconName: "CookingPot" },
  { name: "Origin", key: "origin", fields: 13, plural: "/origins", icon: Mountain, iconName: "Mountain", active: true },
  { name: "Store page", key: "store_page", fields: 8, plural: "/store-pages", icon: Store, iconName: "Store" },
  { name: "Roastery", key: "roastery", fields: 6, plural: "/roasteries", icon: Factory, iconName: "Factory" },
];

function ContentTypesWindow({ className }) {
  return (
    <Window className={className}>
      <ScreenHead title="Content Types" description="Structured models entries are authored against." actions={<PrimaryButton icon={Plus}>New type</PrimaryButton>} />
      <div className="flex flex-col gap-4 px-5 py-4">
        <StatsRow
          stats={[
            { label: "Types", value: "5", footer: "In Atlas Coffee" },
            { label: "Fields", value: "47", footer: "Across all types" },
            { label: "Avg.", value: "9.4", footer: "Per type" },
          ]}
        />
        <div className="overflow-hidden rounded-xl border border-foreground/[0.08]">
          <div className={cn("grid grid-cols-[minmax(0,1fr)_120px] gap-3 border-b bg-foreground/[0.02] px-4 py-2 text-[11px] text-muted-foreground", LINE)}>
            <span>Content type</span>
            <span>Icon</span>
          </div>
          {TYPES.map((type) => {
            const Icon = type.icon;
            return (
              <div key={type.key} className={cn("grid grid-cols-[minmax(0,1fr)_120px] items-center gap-3 border-b px-4 py-3 last:border-b-0", LINE, type.active && "bg-foreground/[0.05]")}>
                <div className="min-w-0">
                  <div className="truncate font-medium text-foreground/90">{type.name}</div>
                  <div className="truncate text-[11px] text-muted-foreground">
                    {type.key} · {type.fields} fields · {type.plural}
                  </div>
                </div>
                <span className="flex items-center gap-2 text-[12px] text-muted-foreground">
                  <Icon className="size-3.5" strokeWidth={1.75} />
                  {type.iconName}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Window>
  );
}

function ProcessOptions({ className }) {
  return (
    <div className={cn("w-[200px] rounded-xl border border-foreground/[0.12] bg-surface-card p-1.5 text-[12px] shadow-2xl shadow-black/30 dark:bg-surface-dialog", className)}>
      {["Washed", "Natural", "Honey", "Anaerobic"].map((option) => (
        <div key={option} className={cn("flex items-center rounded-md px-2.5 py-1.5", option === "Natural" ? "bg-foreground/[0.07] text-foreground" : "text-foreground/75")}>
          {option}
          {option === "Natural" ? <Check className="ml-auto size-3.5" /> : null}
        </div>
      ))}
    </div>
  );
}

function StructuredEditorWindow({ className }) {
  return (
    <Window className={className}>
      <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-5", LINE)}>
        <FilePenLine className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <span className="font-medium">Structured Editor</span>
        <span className="ml-auto flex items-center gap-2">
          <GhostButton>
            Ethiopia Guji — Natural <ChevronDown className="size-3 text-muted-foreground" />
          </GhostButton>
          <PrimaryButton icon={Save}>Save</PrimaryButton>
        </span>
      </div>
      <div className="px-5 py-4">
        <div className="rounded-xl border border-foreground/[0.08]">
          <div className={cn("flex items-center gap-3 border-b px-4 py-3", LINE)}>
            <div className="min-w-0">
              <div className="font-medium">Ethiopia Guji — Natural · Origin</div>
              <div className="text-[12px] text-muted-foreground">Every change validates before it saves.</div>
            </div>
            <span className="ml-auto text-[12px] whitespace-nowrap text-muted-foreground tabular-nums">13 fields · 12 filled</span>
            <span
              className={cn("inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400", styles.popIn)}
              style={{ "--pop-delay": "0.8s" }}
            >
              <Check className="size-3" strokeWidth={2.5} /> Valid
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 px-4 py-4">
            <Input label="Name">Ethiopia Guji — Natural</Input>
            <div className="relative">
              <Select label="Process">Natural</Select>
              <ProcessOptions className={cn("absolute top-[62px] left-3 z-[3]", styles.float)} />
            </div>
            <Select label="Country">Ethiopia</Select>
            <Input label="Altitude (m)">2100</Input>
            <Input label="Region">Guji, Oromia</Input>
            <Input label="Harvest">2026-01-12</Input>
            <Input label="Tasting notes">Blueberry, jasmine, cocoa nib</Input>
            <Input label="Roastery" mono>
              <Link2 className="size-3.5 text-muted-foreground" /> harbour-roastery
            </Input>
            <Select label="Cover">guji-drying-beds.jpg</Select>
            <Select label="Decaf">False</Select>
          </div>
        </div>
      </div>
    </Window>
  );
}

// Section stage: Atlas Coffee's five content types behind, an Origin entry being filled in against its schema in front.
export function TypesStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <ContentTypesWindow className="absolute top-0 left-0 w-[470px] opacity-85" />
      <StructuredEditorWindow className="absolute top-[44px] left-[320px] z-[2] w-[680px]" />
    </div>
  );
}

const TYPE_SAMPLES = [
  ["Text", "Guji, Oromia"],
  ["Number", "2100"],
  ["Boolean", "false"],
  ["Date", "2026-01-12"],
  ["Reference", "harbour-roastery"],
  ["Rich text", "3 blocks"],
  ["Enum", "Natural"],
  ["JSON", '{"aroma":8.5}'],
  ["Media", "guji-beds.jpg"],
];

// Cell: the nine data types, each with a value from an Origin entry.
export function FieldTypesRender() {
  return (
    <div className="mx-auto grid h-[300px] w-[460px] grid-cols-3 gap-2.5">
      {TYPE_SAMPLES.map(([type, sample], index) => {
        const Icon = FIELD_TYPES[type];
        return (
          <div
            key={type}
            className={cn(
              "flex flex-col justify-between rounded-xl border p-3",
              type === "Reference" ? "border-foreground/25 bg-foreground/[0.06]" : "border-foreground/[0.08] bg-surface-card dark:bg-surface-subtle",
              styles.popIn,
            )}
            style={{ "--pop-delay": `${0.15 + index * 0.08}s` }}
          >
            <span className="flex size-7 items-center justify-center rounded-lg border border-foreground/[0.1] bg-foreground/[0.04]">
              <Icon className="size-3.5 text-foreground/80" strokeWidth={2} />
            </span>
            <div>
              <div className="text-[13px] font-medium">{type}</div>
              <div className="truncate font-mono text-[11px] text-muted-foreground">{sample}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function EntryNode({ title, type, strong, className }) {
  return (
    <div
      className={cn(
        "absolute flex h-[54px] flex-col justify-center rounded-xl border bg-surface-card px-3.5 dark:bg-surface-subtle",
        strong ? "border-foreground/30 shadow-lg shadow-black/10" : "border-foreground/[0.1]",
        className,
      )}
    >
      <span className="truncate text-[13px] font-medium">{title}</span>
      <span className="text-[11px] text-muted-foreground">{type}</span>
    </div>
  );
}

function KeyChip({ children, className }) {
  return <span className={cn("absolute z-[2] rounded-md border border-foreground/[0.12] bg-background px-1.5 py-0.5 font-mono text-[10px] text-foreground/80", className)}>{children}</span>;
}

// Cell: an origin's references, two entries pointing in and one roastery it points out to.
export function ReferencesRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[460px] text-foreground">
      <svg viewBox="0 0 460 300" className="absolute inset-0 size-full" fill="none" aria-hidden="true">
        <path d="M110 64 C110 100 190 92 190 124" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.5" className={styles.flow} />
        <path d="M350 64 C350 100 270 92 270 124" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.5" className={styles.flow} />
        <path d="M230 180 V240" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.5" className={styles.flow} />
        <path d="M185 118 l5 6 l5 -6 M265 118 l5 6 l5 -6 M225 234 l5 6 l5 -6" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.5" />
      </svg>
      <EntryNode title="Brewing a better pour-over" type="Article · links here" className="top-[10px] left-0 w-[215px]" />
      <EntryNode title="Autumn menu launch" type="Store page · links here" className="top-[10px] left-[245px] w-[215px]" />
      <EntryNode title="Ethiopia Guji — Natural" type="Origin" strong className="top-[124px] left-[115px] w-[230px]" />
      <EntryNode title="Harbour Roastery" type="Roastery" className="top-[240px] left-[115px] w-[230px]" />
      <KeyChip className="top-[84px] left-[112px]">origin</KeyChip>
      <KeyChip className="top-[84px] left-[262px]">featured_origins</KeyChip>
      <KeyChip className="top-[200px] left-[242px]">roastery</KeyChip>
      <span className="absolute top-[146px] left-[364px]">
        <MonoLabel className="text-[10px]">2 in · 1 out</MonoLabel>
      </span>
    </div>
  );
}

// Cell: a field's validation rules, and the editor refusing a value that breaks them.
export function ValidationRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[460px]">
      <div className="absolute top-0 left-0 w-[300px] rounded-xl border border-foreground/[0.1] bg-surface-card p-4 text-[13px] dark:bg-surface-subtle">
        <div className="font-medium">Edit field</div>
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <Input label="Label">Altitude (m)</Input>
          <Select label="Data type">Number</Select>
        </div>
        <div className="mt-3 mb-1.5 text-[11px] font-medium text-muted-foreground">Validation rules (JSON)</div>
        <div className="rounded-lg border border-foreground/[0.1] bg-foreground/[0.02] px-3 py-2">
          <CodeBlock
            lines={[
              ["{", 0],
              ['"required": true,', 1],
              ['"min": 800,', 1],
              ['"max": 2600', 1],
              ["}", 0],
            ]}
          />
        </div>
      </div>
      <div
        className={cn("absolute top-[118px] left-[190px] w-[270px] rounded-xl border border-foreground/[0.12] bg-surface-card p-4 text-[13px] shadow-xl shadow-black/20 dark:bg-surface-dialog", styles.popIn)}
        style={{ "--pop-delay": "0.7s" }}
      >
        <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
          <FilePenLine className="size-3.5" /> Ethiopia Guji — Natural
        </div>
        <Input label="Altitude (m)" hint="Altitude (m) must be at most 2600." invalid className="mt-3">
          3100
        </Input>
        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-red-600 dark:text-red-400">
          <Dot tone="red" /> 1 issue · Fix before saving
        </div>
      </div>
    </div>
  );
}

const PRIVATE_FIELDS = [
  ["Name", "Text"],
  ["Buyer price (USD/kg)", "Number", true],
  ["Process", "Enum"],
  ["Tasting notes", "Text"],
];

// Cell: a private field in the schema, and the delivered entry that leaves it out.
export function PrivateFieldRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[460px]">
      <div className="absolute top-0 left-0 w-[310px] overflow-hidden rounded-xl border border-foreground/[0.1] bg-surface-card text-[13px] dark:bg-surface-subtle">
        <div className={cn("border-b px-4 py-2.5 text-[11px] text-muted-foreground", LINE)}>Fields on Origin</div>
        {PRIVATE_FIELDS.map(([label, type, isPrivate]) => (
          <div key={label} className={cn("flex items-center gap-2 border-b px-4 py-2.5 last:border-b-0", LINE, isPrivate && "bg-foreground/[0.04]")}>
            <span className="min-w-0 flex-1 truncate text-foreground/90">{label}</span>
            {isPrivate ? (
              <span className="inline-flex h-5 items-center gap-1 rounded-md border border-foreground/[0.14] px-1.5 text-[11px] text-foreground/85">
                <Lock className="size-3" /> Private
              </span>
            ) : (
              <TypeTag type={type} className="h-5 text-[11px]" />
            )}
          </div>
        ))}
      </div>
      <div className={cn("absolute top-[132px] left-[150px] w-[310px] rounded-xl border border-foreground/[0.12] bg-surface-card shadow-xl shadow-black/20 dark:bg-surface-dialog", styles.float)}>
        <div className={cn("flex items-center gap-2 border-b px-3.5 py-2.5", LINE)}>
          <Method verb="GET" />
          <span className="truncate font-mono text-[11px] text-foreground/80">/origins/ethiopia-guji-natural</span>
        </div>
        <CodeBlock
          className="px-3.5 py-2.5 text-[11px]"
          lines={[
            ['"name": "Ethiopia Guji — Natural",', 0],
            ['"process": "Natural",', 0],
            ['"tasting_notes": "Blueberry, jasmine"', 0],
          ]}
        />
        <div className={cn("flex items-center gap-1.5 border-t px-3.5 py-2 text-[11px] text-muted-foreground", LINE)}>
          <Lock className="size-3" /> buyer_price is never delivered
        </div>
      </div>
    </div>
  );
}

const EDITOR_NAV = [
  [null, "Overview", LayoutDashboard],
  ["General", "Basics", SquarePen],
  ["Content", "Body", FileText],
  [null, "Media", ImageIcon],
  ["Publishing", "Visibility", Eye],
  ["Team", "Team", Users],
];

function Block({ kind, children }) {
  return (
    <div className="grid grid-cols-[104px_minmax(0,1fr)_20px] items-start gap-2.5">
      <span className="flex h-9 items-center justify-between rounded-lg border border-foreground/[0.1] px-2.5 text-[12px] text-foreground/80">
        {kind} <ChevronDown className="size-3 text-muted-foreground" />
      </span>
      <div className={cn("min-w-0 rounded-lg border border-foreground/[0.1] bg-foreground/[0.02] px-3", kind === "Heading" ? "flex h-9 items-center font-medium" : "py-2 leading-5 text-foreground/85")}>{children}</div>
      <Trash2 className="mt-2.5 size-3.5 text-muted-foreground/70" />
    </div>
  );
}

function EntryEditorWindow({ className }) {
  return (
    <Window className={className}>
      <div className={cn("flex shrink-0 items-center gap-2 border-b px-5 py-3", LINE)}>
        <span className="flex items-center gap-1 text-[12px] text-muted-foreground">
          <ChevronLeft className="size-3.5" /> All Content
        </span>
        <span className="mx-1 h-4 w-px bg-foreground/[0.1]" />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate font-medium">Brewing a better pour-over</span>
            <StatusPill status="Draft" className="h-5 text-[11px]" />
          </div>
          <div className="truncate text-[11px] text-muted-foreground">Oct 27, 2026 · Article · brewing-a-better-pour-over</div>
        </div>
        <span className="ml-auto flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg border border-foreground/[0.1] text-muted-foreground">
            <ExternalLink className="size-3.5" />
          </span>
          <PrimaryButton>Save Changes</PrimaryButton>
        </span>
      </div>
      <div className="flex flex-1">
        <div className={cn("w-[160px] shrink-0 border-r px-2.5 py-4", LINE)}>
          {EDITOR_NAV.map(([group, label, Icon]) => (
            <div key={label}>
              {group ? <MonoLabel className="mt-3 mb-1 block px-2 text-[10px]">{group}</MonoLabel> : null}
              <div className={cn("flex items-center gap-2 rounded-md px-2 py-1.5 text-[12px]", label === "Body" ? "bg-foreground/[0.07] text-foreground" : "text-foreground/70")}>
                <Icon className="size-3.5 text-muted-foreground" strokeWidth={1.75} />
                {label}
              </div>
            </div>
          ))}
        </div>
        <div className="min-w-0 flex-1 px-5 py-5">
          <div className="rounded-xl border border-foreground/[0.08]">
            <div className={cn("border-b px-4 py-3", LINE)}>
              <div className="font-medium">Body</div>
              <div className="text-[12px] text-muted-foreground">Compose the entry with headings and paragraphs.</div>
            </div>
            <div className="flex flex-col gap-2.5 px-4 py-4">
              <Block kind="Heading">Start with the water</Block>
              <Block kind="Paragraph">Heat fresh water to 94°C. Rinse the paper filter and tip the rinse water away so it doesn&apos;t cool the brew.</Block>
              <Block kind="Heading">The bloom</Block>
              <Block kind="Paragraph">
                <span className="block">Add 15 g of medium-fine coffee and pour 30 g of water over the bed.</span>
                <Typed text="Wait 40 seconds before the next pour." delay={1.5} className="block" />
              </Block>
              <Block kind="Paragraph">
                <span className="flex flex-col gap-2 py-1">
                  <Bar className="w-11/12" />
                  <Bar className="w-3/5" />
                </span>
              </Block>
              <div className="flex gap-2 pt-1">
                <GhostButton icon={Plus}>Paragraph</GhostButton>
                <GhostButton icon={Plus}>Heading</GhostButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Window>
  );
}

function PropertyLine({ label, children }) {
  return (
    <div className="flex items-center gap-3 py-[7px]">
      <span className="w-[72px] shrink-0 text-muted-foreground">{label}</span>
      <span className="flex min-w-0 items-center gap-2 text-foreground/90">{children}</span>
    </div>
  );
}

function AssignmentCard({ className }) {
  return (
    <div className={cn("rounded-xl border border-foreground/[0.12] bg-surface-card text-[12px] shadow-2xl shadow-black/25 dark:bg-surface-dialog", className)}>
      <div className={cn("flex items-center gap-2 border-b px-4 py-3 text-[13px]", LINE)}>
        <UserCheck className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <span className="font-medium">Assignment</span>
        <span className="ml-auto text-[12px] text-muted-foreground">Edit</span>
      </div>
      <div className="px-4 py-2">
        <PropertyLine label="Entry">
          <span className="truncate">Brewing a better pour-over</span>
        </PropertyLine>
        <PropertyLine label="Assignee">
          <Avatar name="Theo Lindqvist" size={18} /> Theo Lindqvist
        </PropertyLine>
        <PropertyLine label="Due date">Oct 30, 2026</PropertyLine>
        <PropertyLine label="Status">
          <Dot tone="amber" /> In progress
        </PropertyLine>
        <PropertyLine label="Priority">
          <PriorityIcon level="high" /> High
        </PropertyLine>
      </div>
      <div className={cn("flex border-t px-4 py-3", LINE)}>
        <GhostButton icon={Check} className="h-7">
          Mark done
        </GhostButton>
      </div>
    </div>
  );
}

function Mention({ children }) {
  return <span className="rounded bg-foreground/[0.08] px-1 font-medium text-foreground">{children}</span>;
}

function ThreadCard({ className }) {
  return (
    <div className={cn("rounded-xl border border-foreground/[0.12] bg-surface-card text-[13px] shadow-2xl shadow-black/30 dark:bg-surface-dialog", className)}>
      <div className={cn("flex items-center gap-2 border-b px-4 py-3", LINE)}>
        <MessageSquareText className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <span className="font-medium">Thread</span>
        <span className="rounded-md border border-foreground/[0.12] px-1.5 py-0.5 font-mono text-[10px] text-foreground/80">body</span>
        <span className="ml-auto inline-flex items-center gap-1.5 text-[12px] text-muted-foreground">
          <Dot tone="amber" /> Open
        </span>
      </div>
      <div className="flex flex-col gap-3.5 px-4 py-3.5">
        <div>
          <div className="flex items-center gap-2 text-[12px]">
            <Avatar name="Clara Vidal" size={18} />
            <span className="font-medium">Clara Vidal</span>
            <span className="text-muted-foreground">2h</span>
          </div>
          <p className="mt-1.5 leading-5 text-foreground/85">
            Can we give a temperature instead of &ldquo;just off the boil&rdquo;? <Mention>@Theo Lindqvist</Mention>
          </p>
        </div>
        <div className={styles.popIn} style={{ "--pop-delay": "1.1s" }}>
          <div className="flex items-center gap-2 text-[12px]">
            <Avatar name="Theo Lindqvist" size={18} />
            <span className="font-medium">Theo Lindqvist</span>
            <span className="text-muted-foreground">now</span>
          </div>
          <p className="mt-1.5 leading-5 text-foreground/85">Changed it to 94°C in the first paragraph.</p>
        </div>
      </div>
      <div className={cn("flex items-center gap-2 border-t px-4 py-3", LINE)}>
        <span className="flex h-8 flex-1 items-center rounded-lg border border-foreground/[0.1] px-3 text-[12px] text-muted-foreground">Write a reply…</span>
        <GhostButton icon={Check}>Resolve</GhostButton>
      </div>
    </div>
  );
}

// Section stage: an article's body being written, its assignment and a comment thread on the body beside it.
export function WritingStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <EntryEditorWindow className="absolute top-0 left-0 h-[640px] w-[660px]" />
      <AssignmentCard className="absolute top-[36px] left-[630px] z-[2] w-[340px]" />
      <ThreadCard className={cn("absolute top-[318px] left-[650px] z-[3] w-[350px]", styles.float)} />
    </div>
  );
}

const ASSIGNMENTS = [
  { entry: "Ethiopia Guji — Natural", who: "Mia Johansson", due: "Due Oct 28", priority: "Urgent", level: "urgent", status: "In progress", tone: "amber" },
  { entry: "Autumn menu launch", who: "Clara Vidal", due: "Due Oct 31", priority: "High", level: "high", status: "Open", tone: "neutral" },
  { entry: "Flat white at home", who: "Samuel Okoro", due: "Overdue · Oct 24", overdue: true, priority: "Normal", level: "medium", status: "In progress", tone: "amber" },
  { entry: "Kenya Nyeri — Washed", who: "Theo Lindqvist", due: "Due Oct 20", priority: "Low", level: "low", status: "Done", tone: "emerald" },
];

// Cell: the Assignments list, each with an owner, a priority and a due date.
export function AssignmentsRender() {
  return (
    <div className="mx-auto w-[460px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card text-[13px] dark:bg-surface-subtle">
      <div className={cn("flex items-center gap-3 border-b px-4 py-3", LINE)}>
        <span className="font-medium">Assignments</span>
        <span className="ml-auto flex items-center gap-3 text-[12px] text-muted-foreground">
          <span>
            Open <span className="text-foreground tabular-nums">3</span>
          </span>
          <span>
            Overdue <span className="text-red-600 tabular-nums dark:text-red-400">1</span>
          </span>
          <span>
            High priority <span className="text-foreground tabular-nums">2</span>
          </span>
        </span>
      </div>
      {ASSIGNMENTS.map((row, index) => (
        <div key={row.entry} className={cn("grid grid-cols-[minmax(0,1fr)_20px_84px_92px] items-center gap-3 border-b px-4 py-2.5 last:border-b-0", LINE, styles.popIn)} style={{ "--pop-delay": `${0.2 + index * 0.1}s` }}>
          <div className="min-w-0">
            <div className={cn("truncate", row.status === "Done" ? "text-muted-foreground line-through decoration-foreground/30" : "text-foreground/90")}>{row.entry}</div>
            <div className={cn("text-[11px]", row.overdue ? "text-red-600 dark:text-red-400" : "text-muted-foreground")}>{row.due}</div>
          </div>
          <Avatar name={row.who} size={20} />
          <span className="flex items-center gap-1.5 text-[12px] text-foreground/85">
            <PriorityIcon level={row.level} /> {row.priority}
          </span>
          <span className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
            <Dot tone={row.tone} /> {row.status}
          </span>
        </div>
      ))}
    </div>
  );
}

// Cell: the AI Assistant with an entry as context, a request being typed and a saved suggestion.
export function AssistantRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[460px]">
      <div className="absolute top-0 left-0 w-[420px] rounded-xl border border-foreground/[0.1] bg-surface-card p-4 text-[13px] dark:bg-surface-subtle">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-muted-foreground" />
          <span className="font-medium">Ask the assistant</span>
        </div>
        <div className="mt-0.5 text-[12px] text-muted-foreground">Suggestions do not change or publish content.</div>
        <Select label="Entry context" className="mt-3">
          Ethiopia Guji — Natural
        </Select>
        <div className="mt-3 mb-1.5 text-[11px] font-medium text-muted-foreground">Request</div>
        <div className="h-[44px] rounded-lg border border-foreground/[0.14] px-3 py-2.5">
          <Typed text="Suggest a two-line description for the shop" delay={1.2} />
        </div>
      </div>
      <div
        className={cn("absolute top-[186px] left-[60px] w-[400px] rounded-xl border border-foreground/[0.12] bg-surface-card p-4 text-[13px] shadow-xl shadow-black/20 dark:bg-surface-dialog", styles.popIn)}
        style={{ "--pop-delay": "3.6s" }}
      >
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <Sparkles className="size-3" /> Response · saved to your history
        </div>
        <p className="mt-1.5 leading-5 text-foreground/90">Bright and sweet: blueberry and jasmine over a cocoa-nib finish. Dried whole on raised beds in Guji, 2,100 metres up.</p>
      </div>
    </div>
  );
}

const QUEUE = [
  { title: "Flat white at home", type: "Recipe", who: "Samuel Okoro", wait: "3d" },
  { title: "Ethiopia Guji — Natural", type: "Origin", who: "Mia Johansson", wait: "1d", active: true },
  { title: "Decaf, done properly", type: "Article", who: "Theo Lindqvist", wait: "6h" },
  { title: "Autumn menu launch", type: "Store page", who: "Clara Vidal", wait: "40m" },
];

function ReviewQueueWindow({ className }) {
  return (
    <Window className={className}>
      <ScreenHead title="Review Queue" description="Entries in review, oldest first. Approve to publish, reject to draft." />
      <div className="flex flex-col gap-4 px-5 py-4">
        <StatsRow
          stats={[
            { label: "Awaiting", value: "4", footer: "In review now" },
            { label: "Oldest wait", value: "3d", footer: "Flat white at home" },
            { label: "Types", value: "4", footer: "Distinct content types" },
          ]}
        />
        <div className="overflow-hidden rounded-xl border border-foreground/[0.08]">
          {QUEUE.map((row) => (
            <div key={row.title} className={cn("flex items-center gap-3 border-b px-4 py-3 last:border-b-0", LINE, row.active && "bg-foreground/[0.05]")}>
              <Avatar name={row.who} size={22} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-foreground/90">{row.title}</div>
                <div className="text-[11px] text-muted-foreground">
                  {row.type} · waiting {row.wait}
                </div>
              </div>
              <GhostButton icon={X} className="h-7 px-2.5">
                Reject
              </GhostButton>
              <PrimaryButton icon={Check} className="h-7 px-2.5">
                Approve
              </PrimaryButton>
            </div>
          ))}
        </div>
      </div>
    </Window>
  );
}

const DIFF = [
  { path: "data.altitude", change: "Changed", before: "1900", after: "2100" },
  { path: "data.tasting_notes", change: "Changed", before: '"Blueberry, cocoa"', after: '"Blueberry, jasmine, cocoa nib"' },
  { path: "data.harvest", change: "Changed", before: '"2025-12-20"', after: '"2026-01-12"' },
  { path: "excerpt", change: "Added", before: "—", after: '"Heavy, fruit-led and sweet…"' },
];

const CHANGE_TONES = {
  Added: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  Removed: "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400",
  Changed: "border-foreground/[0.12] bg-foreground/[0.05] text-foreground/80",
};

// A diff row's change kind: added in emerald, removed in red, changed in grey.
export function ChangeBadge({ change }) {
  return <span className={cn("inline-flex h-5 items-center rounded-md border px-1.5 text-[11px]", CHANGE_TONES[change])}>{change}</span>;
}

function ComparePanel({ className }) {
  return (
    <Window className={className}>
      <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-5", LINE)}>
        <GitCompareArrows className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <span className="font-medium">Compare &amp; Rollback</span>
        <span className="truncate text-muted-foreground">Ethiopia Guji — Natural</span>
      </div>
      <div className={cn("flex items-center gap-2 border-b px-5 py-3", LINE)}>
        <GhostButton className="h-7">
          v4 <ChevronDown className="size-3 text-muted-foreground" />
        </GhostButton>
        <span className="text-muted-foreground">→</span>
        <GhostButton className="h-7">
          v5 <ChevronDown className="size-3 text-muted-foreground" />
        </GhostButton>
        <span className="ml-auto text-[12px] text-muted-foreground">
          <span className="text-foreground tabular-nums">4</span> differences
        </span>
      </div>
      <div className={cn("grid grid-cols-[136px_74px_minmax(0,1fr)_minmax(0,1fr)] gap-3 border-b bg-foreground/[0.02] px-5 py-2 text-[11px] text-muted-foreground", LINE)}>
        <span>Path</span>
        <span>Change</span>
        <span>v4</span>
        <span>v5</span>
      </div>
      {DIFF.map((row, index) => (
        <div
          key={row.path}
          className={cn("grid grid-cols-[136px_74px_minmax(0,1fr)_minmax(0,1fr)] items-center gap-3 border-b px-5 py-2.5 last:border-b-0", LINE, styles.popIn)}
          style={{ "--pop-delay": `${0.3 + index * 0.12}s` }}
        >
          <span className="truncate font-mono text-[12px] text-foreground/85">{row.path}</span>
          <ChangeBadge change={row.change} />
          <span className="truncate font-mono text-[11px] text-muted-foreground">{row.before}</span>
          <span className="truncate font-mono text-[11px] text-foreground/85">{row.after}</span>
        </div>
      ))}
    </Window>
  );
}

// Section stage: the Review Queue behind, the change under review diffed field by field in front, and an approval landing.
export function ReviewStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <ReviewQueueWindow className="absolute top-[40px] left-0 w-[560px] opacity-90" />
      <ComparePanel className={cn("absolute top-0 left-[450px] z-[2] w-[550px]", styles.float)} />
      <div
        className={cn("absolute top-[330px] left-[580px] z-[3] flex w-[360px] items-center gap-3 rounded-xl border border-emerald-500/30 bg-surface-card px-4 py-3 text-[13px] shadow-xl shadow-black/20 dark:bg-surface-dialog", styles.popIn)}
        style={{ "--pop-delay": "1.2s" }}
      >
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
          <Check className="size-3.5" strokeWidth={3} />
        </span>
        <div className="min-w-0">
          <div className="font-medium">Approved by Clara Vidal</div>
          <div className="truncate text-[12px] text-muted-foreground">Ethiopia Guji — Natural is now Published</div>
        </div>
      </div>
    </div>
  );
}

function Transition({ title, type, verb, to, tone, who, delay }) {
  return (
    <div className="rounded-xl border border-foreground/[0.09] bg-surface-card px-4 py-3.5 text-[13px] dark:bg-surface-subtle">
      <div className="flex items-center gap-2">
        <span className="truncate font-medium">{title}</span>
        <span className="text-[12px] text-muted-foreground">{type}</span>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <StatusPill status="In review" />
        <span className="relative h-px flex-1 bg-foreground/15">
          <span className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border bg-background px-2 py-0.5 text-[11px]", tone === "emerald" ? "border-emerald-500/30 text-emerald-700 dark:text-emerald-400" : "border-foreground/[0.15] text-foreground/80")}>
            {verb}
          </span>
        </span>
        <span className={styles.popIn} style={{ "--pop-delay": delay }}>
          <StatusPill status={to} />
        </span>
      </div>
      <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
        <Avatar name={who} size={16} /> {who} · just now
      </div>
    </div>
  );
}

// Cell: approve publishes the entry, reject sends it back to Draft.
export function OutcomeRender() {
  return (
    <div className="mx-auto flex w-[460px] flex-col gap-3">
      <Transition title="Ethiopia Guji — Natural" type="Origin" verb="Approve" to="Published" tone="emerald" who="Clara Vidal" delay="0.6s" />
      <Transition title="Flat white at home" type="Recipe" verb="Reject" to="Draft" who="Clara Vidal" delay="1s" />
    </div>
  );
}

const ATTENTION = [
  { label: "In review", hint: "Awaiting approval", value: 4, icon: ClipboardCheck },
  { label: "Scheduled", hint: "Has a date", value: 3, icon: CalendarClock },
  { label: "Drafts", hint: "Not yet submitted", value: 9, icon: FilePenLine },
  { label: "Stale drafts", hint: "Untouched for 30+ days", value: 2, icon: Hourglass, warn: true },
  { label: "Missing excerpt", hint: "No summary for cards and previews", value: 5, icon: TextQuote },
  { label: "Archived", hint: "Out of delivery", value: 12, icon: Archive },
];

// Cell: the overview's attention list, each count a click from its screen.
export function AttentionRender() {
  return (
    <div className="mx-auto w-[460px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card text-[13px] dark:bg-surface-subtle">
      <div className={cn("flex items-center border-b px-4 py-3", LINE)}>
        <span className="font-medium">Needs attention</span>
        <span className="ml-auto text-[12px] text-muted-foreground">Atlas Coffee</span>
      </div>
      {ATTENTION.map((row) => {
        const Icon = row.icon;
        return (
          <div key={row.label} className={cn("flex items-center gap-3 border-b px-4 py-[9px] last:border-b-0", LINE)}>
            <Icon className="size-4 text-muted-foreground" strokeWidth={1.75} />
            <span className="text-foreground/90">{row.label}</span>
            <span className="truncate text-[12px] text-muted-foreground">{row.hint}</span>
            <span className={cn("ml-auto flex items-center gap-1.5 tabular-nums", row.warn ? "text-amber-700 dark:text-amber-300" : "text-foreground/85")}>
              {row.warn ? <Dot tone="amber" /> : null}
              {row.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}

