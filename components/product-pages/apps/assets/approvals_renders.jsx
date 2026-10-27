import {
  ArrowLeft,
  BadgeCheck,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  FolderInput,
  GitBranch,
  ListChecks,
  Lock,
  MessageSquare,
  Play,
  Plus,
  RotateCcw,
  Search,
  Settings2,
  Tag,
  UploadCloud,
  Users,
  Webhook,
  Workflow,
  X,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarStack, Chip, Dot, LINE, MonoLabel, PriorityIcon, Typed, Window } from "@/components/product-pages/mock_kit";
import { CANVAS_DOTS } from "@/components/product-pages/plan/plan_kit";
import {
  AssetsSidebar,
  EditorNav,
  FieldBox,
  Photo,
  ReviewStatus,
  Segmented,
  StatCell,
  StatsRow,
  Toggle,
} from "@/components/product-pages/apps/assets/assets_kit";
import styles from "@/components/product-pages/product_pages.module.css";

// Geiger Assets approvals tour: Cobalt Retail's lookbook reviews, the pipelines they run through and the workflows that act on the result.

const PRIORITY = { Low: "low", Normal: "medium", High: "high", Urgent: "urgent" };

const REVIEWS = [
  { name: "Autumn lookbook — hero selects", subject: "Asset", items: 6, pipeline: "Brand review", stage: "Brand approval", step: "2 of 2", priority: "High", status: "In Review", due: "In 3 days" },
  { name: "Outerwear product shots", subject: "Asset", items: 12, pipeline: "Brand review", stage: "Creative review", step: "1 of 2", priority: "Normal", status: "Changes Requested", due: "Nov 3" },
  { name: "Stockist press kit", subject: "Collection", items: 24, pipeline: "Client delivery", stage: "Client sign-off", step: "3 of 3", priority: "Urgent", status: "In Review", due: "1 day overdue", overdue: true },
  { name: "Lookbook PDF — print proof", subject: "Asset", items: 1, pipeline: "Brand review", stage: "Brand approval", step: "2 of 2", priority: "High", status: "Approved", due: "Oct 24" },
  { name: "Harbour light campaign images", subject: "Asset", items: 4, pipeline: "Brand review", stage: "Brand approval", step: "2 of 2", priority: "Normal", status: "Approved", due: "Oct 22" },
  { name: "Knitwear swatches", subject: "Asset", items: 8, pipeline: "Brand review", stage: "Creative review", step: "1 of 2", priority: "Low", status: "In Review", due: "In two weeks" },
  { name: "Look 03 portrait retouch", subject: "Asset", items: 1, pipeline: "Brand review", stage: "Creative review", step: "1 of 2", priority: "Normal", status: "Rejected", due: "Oct 20" },
  { name: "Homepage banner — dusk", subject: "Asset", items: 2, pipeline: "Brand review", stage: "Creative review", step: "1 of 2", priority: "Low", status: "Cancelled", due: "—" },
];

const REVIEW_COLUMNS = "grid-cols-[1.6fr_1fr_1.1fr_84px_150px_96px]";

// Hero: the Approvals board with its KPI tiles, every review in flight, and a note going back on one of them.
export function ApprovalsWindow() {
  return (
    <Window className="relative h-[700px] w-[1180px]">
      <div className="flex h-full">
        <AssetsSidebar open="Collaboration" active="Approvals" />
        <div className="flex min-w-0 flex-1 flex-col">
          <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-5", LINE)}>
            <ListChecks className="size-4 text-muted-foreground" strokeWidth={1.75} />
            <span className="font-medium">Approvals</span>
            <span className="truncate text-muted-foreground">Every review in flight, the stage it&apos;s waiting on, and the decision trail behind it.</span>
            <span className="ml-auto flex h-7 shrink-0 items-center gap-1.5 rounded-md bg-foreground px-2.5 text-[12px] font-medium text-background">
              <Plus className="size-3.5" /> Request review
            </span>
          </div>
          <div className="flex flex-col gap-4 p-5">
            <StatsRow>
              <StatCell label="In flight" value="6" footer="24 total" />
              <StatCell label="Need changes" value="2" footer="Sent back to the requester" />
              <StatCell label="Approved" value="14" footer="Closed successfully" />
              <StatCell label="Overdue" value="1" footer="Past their due date">
                <Dot tone="red" className="size-2" />
              </StatCell>
            </StatsRow>
            <div className="flex items-center gap-2">
              {["All Statuses", "All Subjects"].map((filter) => (
                <span key={filter} className="flex h-7 items-center gap-1.5 rounded-md border border-foreground/[0.1] px-2.5 text-[12px] text-foreground/80">
                  {filter} <ChevronDown className="size-3 text-muted-foreground" />
                </span>
              ))}
              <span className="ml-auto flex h-7 w-[220px] items-center gap-2 rounded-md border border-foreground/[0.1] px-2.5 text-[12px] text-muted-foreground">
                <Search className="size-3.5" /> Search reviews…
              </span>
            </div>
            <div className={cn("overflow-hidden rounded-xl border", LINE)}>
              <div className={cn("grid h-9 items-center gap-3 border-b bg-foreground/[0.02] px-4 text-[11px] text-muted-foreground", REVIEW_COLUMNS, LINE)}>
                <span>Review</span>
                <span>Pipeline</span>
                <span>Stage</span>
                <span>Priority</span>
                <span>Status</span>
                <span>Due</span>
              </div>
              {REVIEWS.map((review, index) => (
                <div key={review.name} className={cn("grid h-[54px] items-center gap-3 border-b px-4 last:border-b-0", REVIEW_COLUMNS, LINE, index === 0 && "bg-foreground/[0.035]")}>
                  <span className="min-w-0">
                    <span className="block truncate text-foreground/90">{review.name}</span>
                    <span className="block truncate text-[11px] text-muted-foreground">
                      {review.subject} · {review.items} {review.items === 1 ? "item" : "items"}
                    </span>
                  </span>
                  <span className="truncate text-[12px] text-foreground/80">{review.pipeline}</span>
                  <span className="min-w-0">
                    <span className="block truncate text-[12px] text-foreground/80">{review.stage}</span>
                    <span className="block text-[11px] text-muted-foreground">Stage {review.step}</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-[12px] text-foreground/80">
                    <PriorityIcon level={PRIORITY[review.priority]} /> {review.priority}
                  </span>
                  <ReviewStatus status={review.status} />
                  <span className={cn("text-[12px]", review.overdue ? "text-red-600 dark:text-red-400" : "text-muted-foreground")}>{review.due}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div
        className={cn("absolute top-[300px] left-[640px] z-[2] w-[400px] rounded-xl border border-foreground/[0.12] bg-surface-card p-4 shadow-2xl shadow-black/30 dark:bg-surface-dialog", styles.popIn)}
        style={{ "--pop-delay": "0.8s" }}
      >
        <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
          <MessageSquare className="size-3.5" /> Autumn lookbook — hero selects
        </div>
        <div className="mt-3 flex items-start gap-2.5">
          <Avatar name="Danielle Reyes" size={22} />
          <div className="min-w-0 flex-1 rounded-lg border border-foreground/[0.14] px-3 py-2.5 text-[13px]">
            <Typed text="Warmer grade on look 07, then it's good to go" delay={1.4} />
          </div>
        </div>
        <div className="mt-3 flex items-center justify-end gap-2 text-[12px]">
          <span className="flex h-7 items-center gap-1.5 rounded-md border border-foreground/[0.1] px-2.5 text-foreground/80">
            <RotateCcw className="size-3.5" /> Request changes
          </span>
          <span className="flex h-7 items-center gap-1.5 rounded-md bg-foreground px-2.5 font-medium text-background">
            <Check className="size-3.5" /> Approve
          </span>
        </div>
      </div>
    </Window>
  );
}

const ITEMS = [
  { name: "look-07-overcoat.jpg", scene: "coat", decision: "Changes" },
  { name: "aw26-hero-skyline.jpg", scene: "skyline", decision: "Approved" },
  { name: "tote-tan-plinth.jpg", scene: "plinth", decision: "Approved" },
  { name: "look-03-portrait.jpg", scene: "portrait", decision: "Approved" },
  { name: "fabric-wool-detail.jpg", scene: "fabric", decision: "Pending" },
  { name: "aw26-hero-dusk.jpg", scene: "dusk", decision: "Pending" },
];

const DECISION_TONE = {
  Approved: "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  Changes: "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  Pending: "border-foreground/[0.12] bg-foreground/[0.04] text-muted-foreground",
};

function ReviewDetail({ className }) {
  return (
    <Window className={className}>
      <div className={cn("flex h-12 shrink-0 items-center gap-2.5 border-b px-5", LINE)}>
        <ArrowLeft className="size-4 text-muted-foreground" />
        <span className="text-muted-foreground">All approvals</span>
        <span className="text-muted-foreground/60">/</span>
        <span className="truncate font-medium">Autumn lookbook — hero selects</span>
        <span className="ml-auto flex items-center gap-2">
          <Chip className="h-5 px-2 text-[11px]">Asset</Chip>
          <ReviewStatus status="In Review" />
        </span>
      </div>
      <div className={cn("flex gap-5 border-b px-5 text-[12px]", LINE)}>
        {["Items (6)", "Stages", "History (4)", "Comments (3)"].map((tab, index) => (
          <span key={tab} className={cn("border-b-2 py-2.5", index === 0 ? "border-foreground font-medium text-foreground" : "border-transparent text-muted-foreground")}>
            {tab}
          </span>
        ))}
      </div>
      <div className="flex flex-col gap-4 p-5">
        <div className="rounded-lg bg-foreground/[0.03] px-3.5 py-2.5">
          <div className="text-[13px] font-medium">Under review</div>
          <div className="text-[12px] text-muted-foreground">3 approved · 1 need changes · 0 rejected · 2 undecided</div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {ITEMS.map((item, index) => (
            <div key={item.name} className={cn("overflow-hidden rounded-lg border border-foreground/[0.08]", styles.popIn)} style={{ "--pop-delay": `${0.15 + index * 0.08}s` }}>
              <Photo scene={item.scene} className="block h-[118px] w-full" />
              <div className="px-2.5 py-2">
                <div className="truncate text-[12px] text-foreground/90">{item.name}</div>
                <div className="mt-1.5 flex items-center gap-1">
                  <span className={cn("rounded-full border px-1.5 text-[10px] leading-[18px]", DECISION_TONE[item.decision])}>{item.decision}</span>
                  <span className="ml-auto flex gap-0.5 text-muted-foreground">
                    {[Check, RotateCcw, X].map((Icon, iconIndex) => (
                      <span key={iconIndex} className="flex size-5 items-center justify-center rounded border border-foreground/[0.08]">
                        <Icon className="size-3" />
                      </span>
                    ))}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Window>
  );
}

const THREAD = [
  { name: "Danielle Reyes", time: "Oct 25", text: "Look 07 reads too cool next to the tote. Can we warm the grade before it goes to brand?" },
  { name: "Tyler Brennan", time: "Oct 26", text: "Warmer grade is up as v3 of look-07-overcoat.jpg." },
];

// Section stage: a review open on its items, with the discussion and a decision on the current stage alongside.
export function ReviewStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <ReviewDetail className="absolute top-0 left-0 h-[600px] w-[680px]" />
      <div className={cn("absolute top-[70px] left-[600px] z-[2] w-[400px] rounded-xl border border-foreground/[0.12] bg-surface-card text-[13px] shadow-2xl shadow-black/30 dark:bg-surface-dialog", styles.float)}>
        <div className={cn("border-b px-4 py-3", LINE)}>
          <div className="font-medium">Discussion</div>
          <div className="text-[12px] text-muted-foreground">Feedback attached to this review.</div>
        </div>
        <div className="flex flex-col gap-3.5 px-4 py-3.5">
          {THREAD.map((comment) => (
            <div key={comment.name} className="flex gap-2.5">
              <Avatar name={comment.name} size={22} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-[12px]">
                  <span className="font-medium">{comment.name}</span>
                  <span className="text-muted-foreground">{comment.time}</span>
                </div>
                <p className="mt-0.5 text-[12px] leading-5 text-foreground/85">{comment.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className={cn("border-t px-4 py-3.5", LINE)}>
          <div className="text-[12px] font-medium">Your decision on “Brand approval”</div>
          <div className="mt-0.5 text-[11px] leading-4 text-muted-foreground">Approving counts toward this stage&apos;s required sign-offs. Rejecting closes the review.</div>
          <div className="mt-2.5 rounded-lg border border-foreground/[0.1] px-3 py-2 text-[12px] text-muted-foreground">Add a note for the record (optional)…</div>
          <div className="mt-3 flex gap-2 text-[12px]">
            <span className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md bg-foreground font-medium text-background">
              <Check className="size-3.5" /> Approve
            </span>
            <span className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md border border-foreground/[0.1] text-foreground/80">
              <RotateCcw className="size-3.5" /> Request changes
            </span>
            <span className="flex h-8 items-center justify-center gap-1.5 rounded-md border border-foreground/[0.1] px-3 text-red-600 dark:text-red-400">
              <X className="size-3.5" /> Reject
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const DUE_OPTIONS = ["No due date", "In 3 days", "In a week", "In two weeks"];

// Cell: the request-review dialog with its due date options open.
export function NewReviewRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[460px]">
      <div className="absolute top-0 left-0 w-[300px] rounded-xl border border-foreground/[0.1] bg-surface-card p-4 text-[13px] shadow-xl shadow-black/15 dark:bg-surface-dialog">
        <div className="font-medium">Request review</div>
        <div className="mt-3 flex flex-col gap-2.5">
          <FieldBox label="Review name">
            <span className="truncate">Autumn lookbook — hero selects</span>
          </FieldBox>
          <div className="grid grid-cols-2 gap-2.5">
            <FieldBox label="Reviewing">Asset</FieldBox>
            <FieldBox label="Pipeline">Brand review</FieldBox>
            <FieldBox label="Priority">
              <PriorityIcon level="high" /> High
            </FieldBox>
            <FieldBox label="Due" valueClassName="border-foreground/30">
              In 3 days <ChevronDown className="ml-auto size-3 text-muted-foreground" />
            </FieldBox>
          </div>
          <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
            Assets
            <span className="flex -space-x-1.5">
              {["coat", "skyline", "plinth", "portrait"].map((scene) => (
                <span key={scene} className="size-6 overflow-hidden rounded-md ring-2 ring-surface-card dark:ring-surface-dialog">
                  <Photo scene={scene} className="block size-full" />
                </span>
              ))}
            </span>
            <span className="ml-auto text-foreground/85">6 selected</span>
          </div>
        </div>
      </div>
      <div className={cn("absolute top-[150px] left-[296px] w-[164px] rounded-xl border border-foreground/[0.1] bg-surface-card p-1.5 text-[12px] shadow-2xl shadow-black/25 dark:bg-surface-dialog", styles.popIn)} style={{ "--pop-delay": "0.5s" }}>
        {DUE_OPTIONS.map((option) => (
          <div key={option} className={cn("flex items-center rounded-md px-2.5 py-1.5", option === "In 3 days" ? "bg-foreground/[0.07] text-foreground" : "text-foreground/75")}>
            {option}
            {option === "In 3 days" ? <Check className="ml-auto size-3.5" /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

const HISTORY = [
  { name: "Tyler Brennan", stage: "Creative review", decision: "Approved", time: "Oct 24, 10:12" },
  { name: "Danielle Reyes", stage: "Brand approval", decision: "Changes", note: "Warm the grade on look 07", time: "Oct 25, 16:40" },
  { name: "Ines Duarte", stage: "Brand approval", decision: "Approved", time: "Oct 26, 09:05" },
];

// Cell: a review's decision history, stage by stage.
export function HistoryRender() {
  return (
    <div className="mx-auto w-[460px] rounded-xl border border-foreground/[0.09] bg-surface-card text-[13px] dark:bg-surface-subtle">
      <div className={cn("border-b px-4 py-3", LINE)}>
        <div className="font-medium">Decision history</div>
        <div className="text-[12px] text-muted-foreground">Every sign-off, rejection, and change request on this review.</div>
      </div>
      <div className="relative flex flex-col gap-3 px-4 py-3.5">
        <span className="absolute top-6 bottom-6 left-[26px] border-l border-dashed border-foreground/20" />
        {HISTORY.map((entry, index) => (
          <div key={entry.time} className={cn("relative flex items-start gap-3", styles.popIn)} style={{ "--pop-delay": `${0.2 + index * 0.15}s` }}>
            <Avatar name={entry.name} size={22} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-[12px]">
                <span className="font-medium text-foreground/90">{entry.name}</span>
                <span className="truncate text-muted-foreground">{entry.stage}</span>
                <span className={cn("ml-auto shrink-0 rounded-full border px-1.5 text-[10px] leading-[18px]", DECISION_TONE[entry.decision])}>{entry.decision}</span>
              </div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">
                {entry.time}
                {entry.note ? <span className="text-foreground/75"> · “{entry.note}”</span> : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StageCard({ index, name, children }) {
  return (
    <div className="rounded-xl border border-foreground/[0.1] bg-foreground/[0.02] p-3.5">
      <div className="flex items-center gap-2">
        <span className="flex size-5 items-center justify-center rounded-md bg-foreground/[0.08] font-mono text-[11px] text-foreground/80">{index}</span>
        <span className="font-medium">{name}</span>
        <span className="ml-auto flex gap-2 text-muted-foreground">
          <ChevronDown className="size-3.5 rotate-180" />
          <ChevronDown className="size-3.5" />
          <X className="size-3.5" />
        </span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2.5">{children}</div>
      <div className="mt-3 flex items-center gap-2 text-[12px] text-foreground/80">
        <Toggle on className="scale-90" /> Allow change requests
      </div>
    </div>
  );
}

function Connector() {
  return <span className="mx-auto block h-5 w-px bg-foreground/20" />;
}

const PIPELINE_NAV = [
  {
    items: [
      { label: "Stages", icon: Users },
      { label: "General", icon: Settings2 },
      { label: "On final approval", icon: BadgeCheck },
    ],
  },
];

// Section stage: the Brand review pipeline in the builder, two sequential stages, and what happens on final approval.
export function PipelineStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <Window className="absolute top-0 left-0 h-[620px] w-[720px]">
        <div className={cn("flex h-12 shrink-0 items-center gap-2.5 border-b px-5", LINE)}>
          <ArrowLeft className="size-4 text-muted-foreground" />
          <span className="text-muted-foreground">All pipelines</span>
          <span className="text-muted-foreground/60">/</span>
          <span className="font-medium">Brand review</span>
          <Chip className="ml-1 h-5 px-2 text-[11px]">Asset</Chip>
          <Chip className="h-5 px-2 text-[11px]">Sequential</Chip>
          <span className="ml-auto flex items-center gap-1.5 text-[12px] text-foreground/80">
            <Dot tone="emerald" /> Active
          </span>
        </div>
        <div className="flex flex-1">
          <EditorNav groups={PIPELINE_NAV} active="Stages" className="w-[170px]" />
          <div className="min-w-0 flex-1 p-5">
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <div className="text-[15px] font-medium">Approval route</div>
                <div className="mt-0.5 text-[12px] leading-[1.45] text-muted-foreground">Work moves down this list. A stage opens only once the one above it has the sign-offs it needs.</div>
              </div>
              <span className="flex h-7 shrink-0 items-center gap-1.5 rounded-md border border-foreground/[0.1] px-2.5 text-[12px] text-foreground/80">
                <Plus className="size-3.5" /> Add stage
              </span>
            </div>
            <div className="mt-4">
              <StageCard index={1} name="Creative review">
                <FieldBox label="Who approves">Anyone with a role</FieldBox>
                <FieldBox label="Role">Creative</FieldBox>
                <FieldBox label="Minimum approvals">1</FieldBox>
              </StageCard>
              <Connector />
              <StageCard index={2} name="Brand approval">
                <FieldBox label="Who approves">Specific people</FieldBox>
                <FieldBox label="People">
                  <AvatarStack names={["Danielle Reyes", "Ines Duarte"]} size={18} />
                  <span className="truncate">2 people</span>
                </FieldBox>
                <FieldBox label="Minimum approvals">2</FieldBox>
              </StageCard>
              <Connector />
              <div className={cn("flex items-center gap-2.5 rounded-xl border border-dashed border-foreground/20 px-3.5 py-3 text-[12px] text-foreground/80", styles.popIn)} style={{ "--pop-delay": "0.5s" }}>
                <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                Review completes — asset is marked approved and its current version is locked.
              </div>
            </div>
          </div>
        </div>
      </Window>
      <div className={cn("absolute top-[300px] left-[590px] z-[2] w-[400px] rounded-xl border border-foreground/[0.12] bg-surface-card text-[13px] shadow-2xl shadow-black/30 dark:bg-surface-dialog", styles.float)}>
        <div className={cn("border-b px-4 py-3", LINE)}>
          <div className="font-medium">On final approval</div>
          <div className="text-[12px] text-muted-foreground">What happens the moment the last stage signs off.</div>
        </div>
        {[
          ["Mark the subject approved", "Stamps the approved status so the library can filter and badge by it.", BadgeCheck],
          ["Lock the approved version", "The current version can't be replaced without a new review.", Lock],
        ].map(([title, body, Icon]) => (
          <div key={title} className={cn("flex items-start gap-3 border-b px-4 py-3 last:border-b-0", LINE)}>
            <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
            <div className="min-w-0 flex-1">
              <div>{title}</div>
              <div className="text-[11px] leading-4 text-muted-foreground">{body}</div>
            </div>
            <Toggle on />
          </div>
        ))}
      </div>
    </div>
  );
}

function ModeNode({ label, locked }) {
  return (
    <span className={cn("flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-[12px]", locked ? "border-dashed border-foreground/20 text-muted-foreground" : "border-foreground/[0.14] bg-foreground/[0.04] text-foreground/90")}>
      {locked ? <Lock className="size-3" /> : <span className={cn("size-1.5 rounded-full bg-emerald-500 text-emerald-500", styles.pulse)} />}
      {label}
    </span>
  );
}

// Cell: a sequential pipeline beside an anytime one.
export function ModeRender() {
  return (
    <div className="mx-auto grid w-[460px] grid-cols-2 gap-3">
      {[
        { mode: "Sequential", body: "Stages run in order — a stage only opens once the one before it clears.", sequential: true },
        { mode: "Anytime", body: "Every stage is open at once — approvers can act in any order.", sequential: false },
      ].map((card) => (
        <div key={card.mode} className={cn("rounded-xl border bg-surface-card p-4 dark:bg-surface-subtle", card.sequential ? "border-foreground/25" : "border-foreground/[0.09]")}>
          <div className="flex items-center gap-2 text-[13px] font-medium">
            {card.mode}
            {card.sequential ? <Check className="ml-auto size-3.5 text-muted-foreground" /> : null}
          </div>
          <div className="mt-1 h-[48px] text-[11px] leading-4 text-muted-foreground">{card.body}</div>
          <div className={cn("mt-3 flex flex-col gap-2", card.sequential ? "items-start" : "items-stretch")}>
            {["Creative review", "Brand approval", "Client sign-off"].map((stage, index) => (
              <div key={stage} className={cn(card.sequential && "flex flex-col items-start")} style={card.sequential ? { marginLeft: index * 12 } : undefined}>
                <ModeNode label={stage} locked={card.sequential && index > 0} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const PIPELINES = [
  { name: "Brand review", subject: "Asset", mode: "Sequential", stages: 2, status: "Active", tone: "emerald" },
  { name: "Client delivery", subject: "Collection", mode: "Sequential", stages: 3, status: "Active", tone: "emerald" },
  { name: "Gallery go-live", subject: "Gallery", mode: "Anytime", stages: 2, status: "Paused", tone: "amber" },
  { name: "External access", subject: "Shared link", mode: "Sequential", stages: 1, status: "Draft", tone: "neutral" },
];

// Cell: the Approval Pipelines list with each pipeline's subject, mode and status.
export function PipelinesRender() {
  return (
    <div className="mx-auto w-[460px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card text-[13px] dark:bg-surface-subtle">
      <div className={cn("flex items-center gap-2 border-b px-4 py-3", LINE)}>
        <GitBranch className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <span className="font-medium">Approval Pipelines</span>
        <span className="ml-auto flex h-6 items-center gap-1 rounded-md bg-foreground px-2 text-[11px] font-medium text-background">
          <Plus className="size-3" /> Create pipeline
        </span>
      </div>
      {PIPELINES.map((pipeline, index) => (
        <div key={pipeline.name} className={cn("flex items-center gap-3 border-b px-4 py-3 last:border-b-0", LINE, styles.popIn)} style={{ "--pop-delay": `${0.15 + index * 0.1}s` }}>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-foreground/90">{pipeline.name}</span>
            <span className="block truncate text-[11px] text-muted-foreground">
              {pipeline.subject} · {pipeline.mode} · {pipeline.stages} {pipeline.stages === 1 ? "stage" : "stages"}
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-[12px] text-foreground/80">
            <Dot tone={pipeline.tone} /> {pipeline.status}
          </span>
        </div>
      ))}
    </div>
  );
}

const PEOPLE = [
  { name: "Danielle Reyes", role: "Creative director", picked: true },
  { name: "Ines Duarte", role: "Brand", picked: true },
  { name: "Kofi Asante", role: "E-commerce", picked: false },
  { name: "Tyler Brennan", role: "Retouching", picked: false },
];

// Cell: a stage approved by named people, two of two required.
export function ApproversRender() {
  return (
    <div className="mx-auto w-[440px] rounded-xl border border-foreground/[0.09] bg-surface-card p-4 text-[13px] dark:bg-surface-subtle">
      <div className="flex items-center gap-2">
        <span className="flex size-5 items-center justify-center rounded-md bg-foreground/[0.08] font-mono text-[11px]">2</span>
        <span className="font-medium">Brand approval</span>
      </div>
      <div className="mt-3 text-[11px] text-muted-foreground">Who approves</div>
      <Segmented items={["Anyone with a role", "Specific people"]} active="Specific people" className="mt-1.5 flex w-full [&>span]:flex-1 [&>span]:text-center" />
      <div className="mt-3 flex flex-col gap-1">
        {PEOPLE.map((person) => (
          <div key={person.name} className={cn("flex items-center gap-2.5 rounded-md px-2 py-1.5", person.picked && "bg-foreground/[0.04]")}>
            <span className={cn("flex size-4 items-center justify-center rounded border", person.picked ? "border-foreground bg-foreground text-background" : "border-foreground/25")}>
              {person.picked ? <Check className="size-3" strokeWidth={3} /> : null}
            </span>
            <Avatar name={person.name} size={18} />
            <span className="text-[12px] text-foreground/90">{person.name}</span>
            <span className="ml-auto text-[11px] text-muted-foreground">{person.role}</span>
          </div>
        ))}
      </div>
      <div className={cn("mt-3 flex items-center justify-between border-t pt-3 text-[12px]", LINE)}>
        <span className="text-muted-foreground">Minimum approvals</span>
        <span className="flex items-center gap-1.5 tabular-nums">
          <span className="font-medium">2</span>
          <span className="text-muted-foreground">of 2 people</span>
        </span>
      </div>
    </div>
  );
}

const TEMPLATES = [
  { name: "Blank pipeline", body: "Start with one empty stage and build it yourself.", stages: 0 },
  { name: "Brand review", body: "Creative lead signs off, then brand approves.", stages: 2 },
  { name: "Client delivery", body: "Internal QA, then account management, then the client.", stages: 3 },
  { name: "External access", body: "Two approvers must agree before a link is exposed publicly.", stages: 1 },
];

// Cell: the pipeline templates offered when a pipeline is created.
export function TemplatesRender() {
  return (
    <div className="mx-auto grid w-[460px] grid-cols-2 gap-2.5">
      {TEMPLATES.map((template, index) => (
        <div key={template.name} className={cn("rounded-xl border bg-surface-card p-3.5 dark:bg-surface-subtle", index === 1 ? "border-foreground/30" : "border-foreground/[0.09]")}>
          <div className="flex items-center gap-2 text-[13px] font-medium">
            {template.name}
            {index === 1 ? <Check className="ml-auto size-3.5 text-muted-foreground" /> : null}
          </div>
          <div className="mt-1 h-[32px] text-[11px] leading-4 text-muted-foreground">{template.body}</div>
          <div className="mt-3 flex items-center gap-1">
            {template.stages ? (
              Array.from({ length: template.stages }, (_, stage) => (
                <span key={stage} className="flex items-center gap-1">
                  {stage ? <span className="h-px w-2.5 bg-foreground/25" /> : null}
                  <span className="h-5 w-9 rounded-md border border-foreground/[0.14] bg-foreground/[0.05]" />
                </span>
              ))
            ) : (
              <span className="h-5 w-9 rounded-md border border-dashed border-foreground/25" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

const FLOW = [
  { kind: "Trigger", title: "When Asset approved", detail: "An asset passes review and is approved.", icon: BadgeCheck },
  { kind: "Condition", title: "If asset type", detail: "Asset type · Image", icon: GitBranch },
  { kind: "Action", title: "Move asset", detail: "Folder · aw26/approved", icon: FolderInput },
  { kind: "Action", title: "Add tag", detail: "Tag · ready-for-web", icon: Tag },
  { kind: "Action", title: "Webhook", detail: "POST · hooks.cobaltretail.com/assets", icon: Webhook },
];

function FlowNode({ step, className }) {
  const Icon = step.icon;
  return (
    <div className={cn("flex h-[62px] w-[320px] items-center gap-3 rounded-xl border bg-surface-card px-3.5 shadow-sm shadow-black/10 dark:bg-surface-subtle", step.kind === "Trigger" ? "border-foreground/30" : "border-foreground/[0.1]", className)}>
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-foreground/[0.1] bg-foreground/[0.04]">
        <Icon className="size-4 text-muted-foreground" strokeWidth={1.75} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="font-medium">{step.title}</span>
          <MonoLabel className="ml-auto text-[10px]">{step.kind}</MonoLabel>
        </span>
        <span className="mt-0.5 block truncate text-[12px] text-muted-foreground">{step.detail}</span>
      </span>
    </div>
  );
}

const RUN_STEPS = [
  { title: "If asset type", note: "Image", status: "Success" },
  { title: "Move asset", note: "Moved to aw26/approved", status: "Success" },
  { title: "Add tag", note: "Tagged “ready-for-web”", status: "Success" },
  { title: "Webhook", note: "POST hooks.cobaltretail.com → 200", status: "Success" },
];

// Section stage: a workflow on its canvas, from the approval trigger to a webhook, with the last run's log beside it.
export function WorkflowStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <Window className="absolute top-0 left-0 h-[620px] w-[700px]">
        <div className={cn("flex h-12 shrink-0 items-center gap-2.5 border-b px-5", LINE)}>
          <Workflow className="size-4 text-muted-foreground" strokeWidth={1.75} />
          <span className="font-medium">Approved lookbook to web</span>
          <Chip className="h-5 px-2 text-[11px]">Workspace</Chip>
          <span className="ml-auto flex items-center gap-3 text-[12px]">
            <span className="flex items-center gap-1.5 text-foreground/80">
              <span className={cn("size-1.5 rounded-full bg-emerald-500 text-emerald-500", styles.pulse)} /> Active
            </span>
            <span className="flex h-7 items-center rounded-md bg-foreground px-2.5 font-medium text-background">Save</span>
          </span>
        </div>
        <div className="relative flex-1" style={CANVAS_DOTS}>
          <svg className="absolute inset-0 size-full text-foreground" aria-hidden="true">
            {FLOW.slice(1).map((_, index) => (
              <path key={index} d={`M350 ${90 + index * 88} V${116 + index * 88}`} fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" className={styles.flow} />
            ))}
          </svg>
          {FLOW.map((step, index) => (
            <div key={step.title} className={cn("absolute left-[190px]", styles.popIn)} style={{ top: 28 + index * 88, "--pop-delay": `${0.15 + index * 0.12}s` }}>
              <FlowNode step={step} />
            </div>
          ))}
        </div>
      </Window>
      <div className={cn("absolute top-[90px] left-[560px] z-[2] w-[440px] rounded-xl border border-foreground/[0.12] bg-surface-card text-[13px] shadow-2xl shadow-black/30 dark:bg-surface-dialog", styles.float)}>
        <div className={cn("flex items-start gap-3 border-b px-4 py-3", LINE)}>
          <div className="min-w-0 flex-1">
            <div className="font-medium">Approved lookbook to web</div>
            <div className="text-[12px] text-muted-foreground">When Asset approved · Oct 22, 15:47</div>
          </div>
          <span className="flex items-center gap-1.5 text-[12px] text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="size-3.5" /> Success
          </span>
        </div>
        <div className="flex flex-col px-4 py-2">
          {RUN_STEPS.map((step, index) => (
            <div key={step.title} className={cn("flex items-center gap-3 border-b py-2.5 last:border-b-0", LINE, styles.popIn)} style={{ "--pop-delay": `${0.5 + index * 0.15}s` }}>
              <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span className="w-[100px] shrink-0 text-foreground/90">{step.title}</span>
              <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-muted-foreground">{step.note}</span>
            </div>
          ))}
        </div>
        <div className={cn("flex items-center justify-between border-t px-4 py-2.5 text-[12px] text-muted-foreground", LINE)}>
          <span>4 of 4 steps</span>
          <span className="tabular-nums">412 ms</span>
        </div>
      </div>
    </div>
  );
}

const RUNS = [
  { name: "Approved lookbook to web", trigger: "When Asset approved", status: "Success", started: "11:31", duration: "412 ms", steps: "4/4" },
  { name: "Tag new uploads", trigger: "When Asset uploaded", status: "Success", started: "11:02", duration: "96 ms", steps: "2/2" },
  { name: "Approved lookbook to web", trigger: "When Asset approved", status: "Skipped", started: "10:15", duration: "38 ms", steps: "0/4" },
  { name: "Notify the shop on approval", trigger: "When Asset approved", status: "Failed", started: "Yesterday", duration: "10.0 s", steps: "1/2" },
];

const RUN_ICON = { Success: CheckCircle2, Skipped: Clock, Failed: XCircle };
const RUN_TONE = { Success: "text-emerald-600 dark:text-emerald-400", Skipped: "text-muted-foreground", Failed: "text-red-600 dark:text-red-400" };

// Cell: Run History with its totals and the latest runs.
export function RunHistoryRender() {
  return (
    <div className="mx-auto w-[460px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card text-[12px] dark:bg-surface-subtle">
      <StatsRow className="rounded-none border-0 border-b">
        <StatCell label="Total runs" value="248" className="px-3 py-2 [&>span:nth-child(2)]:text-[16px]" />
        <StatCell label="Success rate" value="97%" className="px-3 py-2 [&>span:nth-child(2)]:text-[16px]" />
        <StatCell label="Failed" value="3" className="px-3 py-2 [&>span:nth-child(2)]:text-[16px]" />
        <StatCell label="Avg duration" value="0.3s" className="px-3 py-2 [&>span:nth-child(2)]:text-[16px]" />
      </StatsRow>
      {RUNS.map((run, index) => {
        const Icon = RUN_ICON[run.status];
        return (
          <div key={`${run.name}-${run.started}`} className={cn("flex items-center gap-3 border-b px-4 py-2.5 last:border-b-0", LINE, styles.popIn)} style={{ "--pop-delay": `${0.2 + index * 0.1}s` }}>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[12px] text-foreground/90">{run.name}</span>
              <span className="block truncate text-[11px] text-muted-foreground">{run.trigger}</span>
            </span>
            <span className={cn("inline-flex w-[72px] items-center gap-1.5", RUN_TONE[run.status])}>
              <Icon className="size-3.5" /> {run.status}
            </span>
            <span className="w-[56px] text-right text-muted-foreground tabular-nums">{run.duration}</span>
            <span className="w-[30px] text-right text-muted-foreground tabular-nums">{run.steps}</span>
          </div>
        );
      })}
    </div>
  );
}

const TRIGGERS = [
  { label: "Asset uploaded", body: "A file lands in the library via upload or import.", icon: UploadCloud },
  { label: "Review requested", body: "An asset is submitted for review.", icon: ListChecks },
  { label: "Asset approved", body: "An asset passes review and is approved.", icon: BadgeCheck },
  { label: "Asset rejected", body: "An asset is sent back with change requests.", icon: XCircle },
];

const ACTIONS = ["Move asset", "Set status", "Add tag", "Remove tag", "Webhook"];

// Cell: the review triggers a workflow can start from, and the actions that follow.
export function TriggersRender() {
  return (
    <div className="mx-auto w-[460px]">
      <div className="rounded-xl border border-foreground/[0.1] bg-surface-card p-1.5 text-[13px] shadow-xl shadow-black/15 dark:bg-surface-dialog">
        <div className="px-2.5 pt-1.5 pb-1 text-[11px] text-muted-foreground">Ingest &amp; review</div>
        {TRIGGERS.map(({ label, body, icon: Icon }) => (
          <div key={label} className={cn("flex items-center gap-2.5 rounded-lg px-2.5 py-2", label === "Asset approved" ? "bg-foreground/[0.07]" : "")}>
            <Icon className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
            <span className="min-w-0 flex-1">
              <span className="block text-foreground/90">{label}</span>
              <span className="block truncate text-[11px] text-muted-foreground">{body}</span>
            </span>
            {label === "Asset approved" ? <Check className="size-3.5" /> : null}
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className="flex h-6 items-center gap-1 px-1 text-[11px] text-muted-foreground">
          <Play className="size-3" /> Then
        </span>
        {ACTIONS.map((action, index) => (
          <span key={action} className={styles.popIn} style={{ "--pop-delay": `${0.3 + index * 0.08}s` }}>
            <Chip className="h-6 text-[11px]">{action}</Chip>
          </span>
        ))}
      </div>
    </div>
  );
}
