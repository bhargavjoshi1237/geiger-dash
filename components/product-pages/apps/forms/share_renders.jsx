import {
  ArrowLeft,
  Check,
  Code,
  Copy,
  Download,
  Eraser,
  ExternalLink,
  Eye,
  Globe,
  KeyRound,
  Link2,
  Lock,
  Mail,
  MessageCircle,
  Plus,
  RotateCcw,
  Send,
  ShieldBan,
  ShieldCheck,
  Wallet,
  Webhook,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { QrGlyph } from "@/components/features-hub/motifs/motif_kit";
import { Avatar, LINE, Typed, Window } from "@/components/product-pages/mock_kit";
import { ArtCover, BrightloopMark, CARD, Input, POPOVER, Segmented, Select, StatusDot, Toggle } from "@/components/product-pages/apps/forms/forms_kit";
import styles from "@/components/product-pages/product_pages.module.css";

// Geiger Forms sharing, payments and security renders: Brightloop's grants form, its paid Studio membership signup and its NPS survey.

const EDITOR_NAV = [
  { group: null, items: ["Overview", "Details"] },
  { group: "Build", items: ["Drag & Drop Canvas", "Layout & Columns", "Fields", "Logic & Scoring", "Preview & Test"] },
  { group: "Design", items: ["Themes & Colors", "Welcome & Ending", "Branding", "Localization"] },
  { group: "Flow", items: ["Multi-step Pages", "Save & Resume", "Submission Rules"] },
  { group: "Payments", items: ["Gateways", "Order Builder", "Coupons"] },
  { group: "Sharing", items: ["Publish", "Embed", "Share & Send"] },
  { group: "Workflow", items: ["Approvals", "Automations", "Document Template"] },
  { group: "Settings", items: ["Notifications", "Access & Sharing", "Security & Compliance", "Integrations"] },
];

function EditorNav({ active, className }) {
  return (
    <div className={cn("flex flex-col px-3 py-3 text-[12px]", className)}>
      <div className="mb-2 flex items-center gap-2 px-2">
        <ArrowLeft className="size-3.5 text-muted-foreground" />
        <span className="truncate text-[13px] font-semibold">Studio membership</span>
      </div>
      <div className="mb-2 px-2">
        <StatusDot status="Published" className="text-[11px]" />
      </div>
      {EDITOR_NAV.map(({ group, items }) => (
        <div key={items[0]} className="mb-1.5">
          {group ? <div className="px-2 pt-1 pb-0.5 text-[10px] font-medium tracking-[0.06em] text-muted-foreground/80 uppercase">{group}</div> : null}
          {items.map((item) => (
            <div key={item} className={cn("flex h-[25px] items-center rounded-md px-2", item === active ? "bg-foreground/[0.07] font-medium text-foreground" : "text-muted-foreground")}>
              {item}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function SectionCard({ title, description, action, children, className }) {
  return (
    <div className={cn(CARD, className)}>
      <div className={cn("flex items-start gap-3 border-b px-4 py-3", LINE)}>
        <div className="min-w-0">
          <div className="font-semibold">{title}</div>
          {description ? <div className="mt-0.5 text-[11px] leading-4 text-muted-foreground">{description}</div> : null}
        </div>
        {action ? <span className="ml-auto shrink-0">{action}</span> : null}
      </div>
      <div className="px-4 py-3.5">{children}</div>
    </div>
  );
}

function Label({ children, className }) {
  return <div className={cn("mb-1.5 text-[11px] font-medium text-foreground/80", className)}>{children}</div>;
}

function Button({ icon: Icon, primary = false, children, className }) {
  return (
    <span
      className={cn(
        "flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-md px-3 text-[12px] whitespace-nowrap",
        primary ? "bg-foreground font-medium text-background" : "border border-foreground/[0.12] text-foreground/85",
        className,
      )}
    >
      {Icon ? <Icon className="size-3.5" strokeWidth={1.75} /> : null}
      {children}
    </span>
  );
}

function EmailChip({ children }) {
  return <span className="rounded-md border border-foreground/[0.12] bg-foreground/[0.04] px-2 py-0.5 text-[11px] whitespace-nowrap">{children} ×</span>;
}

function SettingRow({ title, description, children }) {
  return (
    <div className={cn("flex items-center gap-4 border-b py-2.5 last:border-b-0", LINE)}>
      <div className="min-w-0 flex-1">
        <div className="text-[12px] text-foreground/90">{title}</div>
        {description ? <div className="mt-0.5 text-[11px] leading-4 text-muted-foreground">{description}</div> : null}
      </div>
      {children}
    </div>
  );
}

// The hero's tilted plane: the Studio membership form's Share & Send section, with a link, a QR code, a signed link and invites going out.
export function ShareWindow() {
  return (
    <Window className="h-[700px] w-[1180px]">
      <div className="flex h-full">
        <EditorNav active="Share & Send" className={cn("w-[230px] shrink-0 overflow-hidden border-r", LINE)} />
        <div className="min-w-0 flex-1 px-6 pt-5">
          <div className="text-[18px] font-semibold tracking-[-0.01em]">Share &amp; Send</div>
          <div className="mt-0.5 text-[12px] text-muted-foreground">Links, QR code, signed links and email invites.</div>
          <SectionCard title="Public link" className="mt-4">
            <div className="flex items-start gap-5">
              <div className="min-w-0 flex-1">
                <div className="flex gap-2">
                  <Input className="flex-1 font-mono text-[11px]">
                    <Globe className="size-3.5 text-muted-foreground" />
                    /form/studio-membership
                  </Input>
                  <Button icon={Copy}>Copy</Button>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button icon={Mail}>Email</Button>
                  <Button icon={ExternalLink}>Open public form</Button>
                </div>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className={cn("size-1.5 rounded-full bg-emerald-500 text-emerald-500", styles.pulse)} /> Published · 214 responses
                </div>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="size-[104px] rounded-lg bg-white p-2 text-black">
                  <QrGlyph seed="studio-membership" className="size-full" />
                </div>
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Download className="size-3" /> PNG
                </span>
              </div>
            </div>
          </SectionCard>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <SectionCard title="Signed link" description="A personal, expiring link — required when access is set to “Signed links only”, and it can lock the response to one email.">
              <div className="grid grid-cols-[1fr_96px] gap-2">
                <div>
                  <Label>Recipient email (optional)</Label>
                  <Input>hana@itoprint.jp</Input>
                </div>
                <div>
                  <Label>Expires in (hours)</Label>
                  <Input className="tabular-nums">72</Input>
                </div>
              </div>
              <Button icon={Link2} primary className="mt-3 w-fit">
                Generate
              </Button>
              <div className={cn("mt-3 flex items-center gap-2 rounded-md border border-foreground/[0.1] px-2.5 py-2 font-mono text-[11px]", styles.popIn)} style={{ "--pop-delay": "0.8s" }}>
                <span className="truncate text-foreground/85">/form/studio-membership?t=eyJmIjoic3R1ZGlv…</span>
                <Copy className="ml-auto size-3.5 shrink-0 text-muted-foreground" />
              </div>
            </SectionCard>
            <SectionCard title="Send to people" description="Email the form to recipients — use it to collect signatures or targeted responses.">
              <Label>Recipients</Label>
              <div className="flex min-h-8 flex-wrap items-center gap-1.5 rounded-md border border-foreground/20 px-2 py-1.5">
                <EmailChip>zara.patel@fieldnote.studio</EmailChip>
                <EmailChip>kofi@asante-sound.org</EmailChip>
                <span className="text-[12px]">
                  <Typed text="leah.mensah@northwind.io" delay={1.4} />
                </span>
              </div>
              <SettingRow title="Personal signed links" description="Each recipient gets their own link tied to their email.">
                <Toggle />
              </SettingRow>
              <Button icon={Send} primary className="mt-1 w-fit">
                Send
              </Button>
            </SectionCard>
          </div>
        </div>
      </div>
    </Window>
  );
}

const EMBED_MODES = ["Inline", "Popup", "Slider", "Side tab", "Popover", "Full screen", "Plain iframe"];

const SNIPPET = [
  ["<div", ""],
  ['  data-geiger-form=', '"studio-feedback"'],
  ["  data-mode=", '"popover"'],
  ["  data-position=", '"left"'],
  ["  data-trigger=", '"delay"'],
  ["  data-delay=", '"8"'],
  ["  data-frequency=", '"session"'],
  ["></div>", ""],
  ['<script src="…/embed.js" async></script>', ""],
];

// Section stage: Brightloop's studio page with the NPS survey in a popover bubble, and the Embed settings that put it there.
export function EmbedStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <Window className="absolute top-0 left-0 h-[560px] w-[680px]">
        <div className={cn("flex h-11 shrink-0 items-center gap-3 border-b px-4", LINE)}>
          <span className="flex gap-1.5">
            {[0, 1, 2].map((dot) => (
              <span key={dot} className="size-2.5 rounded-full bg-foreground/15" />
            ))}
          </span>
          <span className="mx-auto flex h-7 w-[280px] items-center justify-center gap-1.5 rounded-md bg-foreground/[0.05] text-[12px] text-muted-foreground">
            <Lock className="size-3" /> brightloop.org/studio
          </span>
        </div>
        <div className="relative flex-1">
          <div className="flex items-center gap-2 px-6 py-4">
            <BrightloopMark size={22} />
            <span className="font-semibold">Brightloop</span>
            <span className="ml-auto flex gap-5 text-[12px] text-muted-foreground">
              <span>Grants</span>
              <span className="text-foreground">Studio</span>
              <span>Events</span>
              <span>About</span>
            </span>
          </div>
          <ArtCover className="mx-6 h-[190px] rounded-xl">
            <div className="absolute bottom-5 left-[300px]">
              <div className="font-mono text-[11px] tracking-[0.12em] text-foreground/60 uppercase">Studio membership</div>
              <div className="mt-1 text-[24px] leading-tight font-semibold tracking-[-0.02em]">Open studio, all year</div>
            </div>
          </ArtCover>
          <div className="grid grid-cols-3 gap-4 px-6 pt-5">
            {[0, 1, 2].map((column) => (
              <div key={column} className="flex flex-col gap-2">
                <span className="block h-2.5 w-2/3 rounded-full bg-foreground/[0.12]" />
                <span className="block h-2 rounded-full bg-foreground/[0.07]" />
                <span className="block h-2 w-5/6 rounded-full bg-foreground/[0.07]" />
              </div>
            ))}
          </div>
          <div className={cn("absolute top-[96px] left-5 z-[2] w-[300px] p-4", POPOVER, styles.popIn)} style={{ "--pop-delay": "0.6s" }}>
            <div className="text-[14px] leading-snug font-medium">How likely are you to recommend the studio to a friend?</div>
            <div className="mt-3 grid grid-cols-11 gap-1">
              {Array.from({ length: 11 }, (_, score) => (
                <span key={score} className={cn("flex h-7 items-center justify-center rounded-md border text-[11px] tabular-nums", score === 9 ? "border-foreground bg-foreground text-background" : "border-foreground/[0.12] text-foreground/80")}>
                  {score}
                </span>
              ))}
            </div>
            <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
              <span>Not likely</span>
              <span>Very likely</span>
            </div>
            <Button primary className="mt-3 w-full">
              Submit
            </Button>
          </div>
          <span className="absolute top-[300px] left-5 flex size-11 items-center justify-center rounded-full bg-foreground text-background shadow-lg shadow-black/25">
            <MessageCircle className="size-5" />
          </span>
        </div>
      </Window>
      <div className={cn("absolute top-[72px] left-[600px] z-[3] w-[400px] text-[13px]", POPOVER, styles.float)}>
        <div className={cn("flex items-center gap-2 border-b px-4 py-3", LINE)}>
          <Code className="size-4 text-muted-foreground" />
          <span className="font-semibold">Embed</span>
          <span className="truncate text-muted-foreground">Studio feedback</span>
        </div>
        <div className="px-4 py-3.5">
          <div className="flex flex-wrap gap-1">
            {EMBED_MODES.map((mode) => (
              <span key={mode} className={cn("rounded-md px-2 py-1 text-[11px]", mode === "Popover" ? "bg-foreground/[0.08] font-medium text-foreground" : "text-muted-foreground")}>
                {mode}
              </span>
            ))}
          </div>
          <div className="mt-2 text-[11px] text-muted-foreground">A corner bubble that opens a compact panel.</div>
          <div className="mt-3 grid grid-cols-[118px_88px_1fr] gap-2">
            <div>
              <Label>Opens</Label>
              <Select className="w-full">After a delay</Select>
            </div>
            <div>
              <Label>Delay (seconds)</Label>
              <Input className="h-7 tabular-nums">8</Input>
            </div>
            <div>
              <Label>Show</Label>
              <Select className="w-full">Once per session</Select>
            </div>
          </div>
          <Label className="mt-3.5">Embed code</Label>
          <pre className="rounded-lg border border-foreground/[0.09] bg-foreground/[0.03] px-3 py-2.5 font-mono text-[10.5px] leading-[1.6] text-foreground/80">
            {SNIPPET.map(([key, value]) => (
              <div key={key}>
                {key}
                {value ? <span className="text-emerald-600 dark:text-emerald-400">{value}</span> : null}
              </div>
            ))}
          </pre>
        </div>
      </div>
    </div>
  );
}

const ACCESS_MODES = [
  ["Anyone with the link", "No sign-in required."],
  ["Password", "Respondents enter a shared password."],
  ["Signed-in users", "Respondents sign in with their suite account."],
  ["Organisation domain", "Only signed-in users with an email on your domain."],
  ["Signed links only", "Only personal links generated from Share work."],
];

// Cell: the panel's scoring form locked with a shared password, and the gate respondents see.
export function AccessRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[460px] text-[13px]">
      <div className={cn("absolute top-0 left-0 w-[270px] p-3.5", CARD)}>
        <div className="mb-2 font-semibold">Who can respond</div>
        <div className="flex flex-col gap-1">
          {ACCESS_MODES.map(([mode, hint]) => (
            <div key={mode} className={cn("flex items-start gap-2.5 rounded-md px-2 py-1.5", mode === "Password" && "bg-foreground/[0.05]")}>
              <span className={cn("mt-0.5 flex size-3.5 shrink-0 items-center justify-center rounded-full border", mode === "Password" ? "border-foreground" : "border-foreground/25")}>
                {mode === "Password" ? <span className="size-1.5 rounded-full bg-foreground" /> : null}
              </span>
              <div className="min-w-0">
                <div className="text-[12px]">{mode}</div>
                <div className="truncate text-[10.5px] text-muted-foreground">{hint}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={cn("absolute top-[66px] left-[236px] z-[2] w-[224px] p-4 text-center", POPOVER, styles.float)}>
        <span className="mx-auto flex size-9 items-center justify-center rounded-full bg-foreground/[0.07]">
          <Lock className="size-4 text-foreground/80" />
        </span>
        <div className="mt-2.5 font-semibold">Password required</div>
        <p className="mt-1 text-[11px] leading-4 text-muted-foreground">Enter the password you were given to open this form.</p>
        <Input className="mt-3 tracking-[0.3em]">••••••••</Input>
        <Button primary className="mt-2.5 w-full">
          Unlock
        </Button>
      </div>
    </div>
  );
}

// Cell: the grants form shared in a team chat, unfurling with its own title, description and cover.
export function SharePreviewRender() {
  return (
    <div className="mx-auto w-[440px] text-[13px]">
      <div className="flex gap-3">
        <Avatar name="Elena Rossi" size={30} />
        <div className="min-w-0 flex-1">
          <div className="text-[12px]">
            <span className="font-medium">Elena Rossi</span> <span className="text-muted-foreground">10:02</span>
          </div>
          <p className="mt-0.5 leading-5 text-foreground/85">
            The spring round is open, please share it with your networks: <span className="font-mono text-[12px] underline decoration-foreground/30 underline-offset-2">/form/spring-grants-2026</span>
          </p>
          <div className={cn("mt-2.5 overflow-hidden border-l-2 border-l-foreground/30", CARD, styles.popIn)} style={{ "--pop-delay": "0.5s" }}>
            <ArtCover className="h-[110px]">
              <BrightloopMark size={26} className="absolute top-4 left-4" />
            </ArtCover>
            <div className="px-3.5 py-3">
              <div className="text-[11px] text-muted-foreground">Geiger Forms</div>
              <div className="mt-0.5 font-semibold">Spring Grants 2026</div>
              <div className="mt-0.5 text-[12px] leading-[1.45] text-muted-foreground">Up to $10,000 for community arts projects. It takes about 12 minutes.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Section stage: the Studio membership form charging a yearly subscription, with a coupon applied before Stripe Checkout.
export function CheckoutStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <Window title="Gateways" icon={Wallet} meta="Studio membership" className="absolute top-0 left-0 h-[380px] w-[600px]">
        <div className="flex flex-col gap-4 p-5">
          <SectionCard title="Collect payments" description="Respondents are sent to Stripe Checkout after submitting; the response waits as “Awaiting payment” until paid.">
            <SettingRow title="Enable payments">
              <Toggle />
            </SettingRow>
            <div className="mt-3 grid grid-cols-2 gap-4">
              <div>
                <Label>Currency</Label>
                <Select className="w-full">USD</Select>
              </div>
              <div>
                <Label>Charge</Label>
                <Segmented options={["One-off", "Subscription"]} active={1} />
              </div>
            </div>
            <Label className="mt-4">Billing interval</Label>
            <Segmented options={["Monthly", "Yearly"]} active={1} />
          </SectionCard>
        </div>
      </Window>
      <div className={cn("absolute top-[338px] left-[28px] z-[2] flex w-[470px] items-center gap-3 px-4 py-3 text-[13px]", POPOVER, styles.popIn)} style={{ "--pop-delay": "3s" }}>
        <Avatar name="Leah Mensah" size={26} />
        <div className="min-w-0 flex-1">
          <div className="font-medium">Leah Mensah</div>
          <div className="text-[11px] text-muted-foreground">Studio membership · just now</div>
        </div>
        <StatusDot status="Awaiting payment" className="text-[12px]" />
      </div>
      <div className={cn("absolute top-[24px] left-[548px] z-[2] w-[452px] overflow-hidden text-[13px]", POPOVER, styles.float)}>
        <div className="px-6 pt-5 pb-5">
          <div className="flex items-center gap-2.5">
            <BrightloopMark size={24} />
            <span className="text-[17px] font-semibold tracking-[-0.01em]">Studio membership</span>
          </div>
          <p className="mt-1.5 text-[12px] leading-[1.5] text-muted-foreground">Unlimited open-studio hours, two guest passes a month and member prices on every workshop.</p>
          <Label className="mt-4">Email</Label>
          <Input>leah.mensah@northwind.io</Input>
          <div className="mt-3 flex items-center gap-3 rounded-lg border border-foreground/40 bg-foreground/[0.04] px-3.5 py-3">
            <span className="flex size-4 items-center justify-center rounded border border-foreground bg-foreground text-background">
              <Check className="size-3" strokeWidth={3} />
            </span>
            <div className="flex-1">
              <div className="font-medium">Studio membership</div>
              <div className="text-[11px] text-muted-foreground">Billed yearly</div>
            </div>
            <span className="tabular-nums">$240.00</span>
          </div>
          <Label className="mt-3">Coupon code</Label>
          <div className="flex gap-2">
            <Input className="flex-1 font-mono tracking-wider">
              <Typed text="SPRING20" delay={1.4} />
            </Input>
            <Button>Apply</Button>
          </div>
          <div className={cn("mt-1.5 flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400", styles.popIn)} style={{ "--pop-delay": "2.4s" }}>
            <Check className="size-3" /> Coupon applied
          </div>
          <div className={cn("mt-3 flex flex-col gap-1.5 border-t pt-3 text-[12px]", LINE)}>
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="tabular-nums">$240.00</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Discount</span>
              <span className="tabular-nums">−$48.00</span>
            </div>
            <div className="flex justify-between text-[14px] font-medium">
              <span>Total</span>
              <span className="tabular-nums">
                $192.00 <span className="text-[12px] font-normal text-muted-foreground">per year</span>
              </span>
            </div>
          </div>
          <Button primary className="mt-4 h-9 w-full">
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}

const COUPONS = [
  { code: "SPRING20", type: "% off", value: "20", active: true },
  { code: "MEMBER10", type: "% off", value: "10", active: true },
  { code: "OPENDAY50", type: "% off", value: "50", active: false },
];

// Cell: the coupon codes on the membership form, one of them paused.
export function CouponsRender() {
  return (
    <div className="mx-auto w-[460px] text-[13px]">
      <SectionCard title="Coupon codes" description="Respondents enter a code at checkout. Codes aren't case-sensitive." action={<Button icon={Plus}>Add coupon</Button>}>
        <div className="grid grid-cols-[1fr_84px_56px_96px] gap-2 pb-1.5 text-[11px] text-muted-foreground">
          <span>Code</span>
          <span>Type</span>
          <span>Value</span>
          <span />
        </div>
        <div className="flex flex-col gap-2">
          {COUPONS.map((coupon, index) => (
            <div key={coupon.code} className={cn("grid grid-cols-[1fr_84px_56px_96px] items-center gap-2", styles.popIn)} style={{ "--pop-delay": `${0.2 + index * 0.12}s` }}>
              <Input className="h-7 font-mono text-[11px] tracking-wider">{coupon.code}</Input>
              <Select>{coupon.type}</Select>
              <Input className="h-7 tabular-nums">{coupon.value}</Input>
              <span className="flex items-center gap-2">
                <Toggle on={coupon.active} />
                <span className={cn("rounded-md px-1.5 text-[11px] leading-5", coupon.active ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" : "bg-foreground/[0.07] text-muted-foreground")}>{coupon.active ? "Active" : "Paused"}</span>
              </span>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

const PAYMENTS = [
  { name: "Grace Donnelly", amount: "$192.00", state: "Pending" },
  { name: "Priya Nair", amount: "$240.00", state: "Unpaid" },
  { name: "Theo Lindqvist", amount: "$240.00", state: "Failed" },
  { name: "Clara Vidal", amount: "$192.00", state: "Refunded" },
  { name: "Samuel Okoro", amount: "$240.00", state: "Canceled" },
];

// Cell: a membership response's Payment tab beside other members' payments in every other state.
export function PaymentsRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[460px] text-[13px]">
      <div className={cn("absolute top-0 left-0 w-[290px] p-4", CARD)}>
        <div className="flex items-center gap-2.5">
          <Avatar name="Leah Mensah" size={28} />
          <div className="min-w-0">
            <div className="font-semibold">Leah Mensah</div>
            <div className="text-[11px] text-muted-foreground">Studio membership · 12m</div>
          </div>
        </div>
        <div className="mt-3 rounded-lg border border-foreground/[0.08] p-3">
          <div className="flex items-center justify-between text-[12px] font-medium">
            Payment
            <StatusDot status="Paid" className="font-normal" />
          </div>
          {[
            ["Amount", "$192.00"],
            ["Currency", "USD"],
            ["Reference", "cs_…a91f"],
          ].map(([label, value]) => (
            <div key={label} className="mt-1.5 flex justify-between text-[12px]">
              <span className="text-muted-foreground">{label}</span>
              <span className={cn("tabular-nums", label === "Reference" && "font-mono text-[11px]")}>{value}</span>
            </div>
          ))}
        </div>
        <div className="mt-2.5 rounded-lg border border-foreground/[0.08] p-3 text-[12px]">
          <div className="font-medium">Order</div>
          <div className="mt-1.5 flex justify-between text-muted-foreground">
            <span>1 × Studio membership</span>
            <span className="tabular-nums">$240.00</span>
          </div>
          <div className="mt-1 flex justify-between text-emerald-600 dark:text-emerald-400">
            <span>Coupon SPRING20</span>
            <span className="tabular-nums">−$48.00</span>
          </div>
        </div>
      </div>
      <div className="absolute top-[6px] left-[302px] flex w-[158px] flex-col gap-1.5">
        {PAYMENTS.map((payment, index) => (
          <div key={payment.name} className={cn("rounded-lg border border-foreground/[0.09] bg-surface-card px-2.5 py-2 dark:bg-surface-subtle", styles.popIn)} style={{ "--pop-delay": `${0.3 + index * 0.1}s` }}>
            <div className="flex items-center justify-between gap-2 text-[11px]">
              <span className="truncate font-medium">{payment.name}</span>
              <span className="text-muted-foreground tabular-nums">{payment.amount}</span>
            </div>
            <StatusDot status={payment.state} className="mt-0.5 text-[11px]" />
          </div>
        ))}
      </div>
    </div>
  );
}

const ACCESS_LOG = [
  { action: "Revealed sensitive", who: "Noah Fischer", field: "Bank account for the grant", when: "2m ago", warn: true },
  { action: "Viewed", who: "Ravi Menon", field: "", when: "14m ago" },
  { action: "Exported", who: "Mia Johansson", field: "", when: "1h ago" },
  { action: "Printed", who: "Elena Rossi", field: "", when: "3h ago" },
  { action: "Edited", who: "Ravi Menon", field: "", when: "Yesterday" },
];

const ANSWERS = [
  { question: "Project title", answer: "Free drumming circles for teens" },
  { question: "Amount requested", answer: "$4,200.00" },
  { question: "Bank account for the grant", sensitive: true },
  { question: "Date of birth", sensitive: true },
];

// Section stage: Spring Grants' sensitive fields and access log, and a response with its encrypted answers masked.
export function SecurityStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <Window title="Security & Compliance" icon={ShieldCheck} meta="Spring Grants 2026 — Application" className="absolute top-0 left-0 h-[600px] w-[620px]">
        <div className="flex flex-col gap-4 p-5">
          <SectionCard title="Sensitive fields" description="Answers are encrypted with AES-256-GCM before they're stored, masked in the inbox, and only revealed on request (which is logged).">
            <div className="flex flex-wrap gap-2">
              {["Bank account for the grant · Short text", "Date of birth · Date"].map((field) => (
                <span key={field} className="flex items-center gap-1.5 rounded-md border border-amber-500/25 bg-amber-500/10 px-2 py-1 text-[11px] text-amber-700 dark:text-amber-300">
                  <Lock className="size-3" /> {field}
                </span>
              ))}
            </div>
          </SectionCard>
          <SectionCard title="Access log">
            {ACCESS_LOG.map((entry, index) => (
              <div key={`${entry.action}-${entry.when}`} className={cn("flex items-center gap-3 border-b py-2 text-[12px] last:border-b-0", LINE, index === 0 && styles.popIn)} style={index === 0 ? { "--pop-delay": "1.2s" } : undefined}>
                <span className={cn("w-[124px] shrink-0 rounded-md px-1.5 text-center text-[11px] leading-5", entry.warn ? "bg-amber-500/15 text-amber-700 dark:text-amber-300" : "bg-foreground/[0.07] text-foreground/75")}>{entry.action}</span>
                <span className="min-w-0 flex-1 truncate text-muted-foreground">
                  {entry.who}
                  {entry.field ? ` · ${entry.field}` : ""}
                </span>
                <span className="shrink-0 text-[11px] text-muted-foreground">{entry.when}</span>
              </div>
            ))}
          </SectionCard>
        </div>
      </Window>
      <div className={cn("absolute top-[20px] left-[560px] z-[2] w-[440px] overflow-hidden text-[13px]", POPOVER, styles.float)}>
        <div className={cn("flex items-center gap-3 border-b px-5 py-4", LINE)}>
          <Avatar name="Kofi Asante" size={34} />
          <div className="min-w-0">
            <div className="font-semibold">Kofi Asante</div>
            <div className="text-[12px] text-muted-foreground">kofi@asante-sound.org</div>
          </div>
        </div>
        <div className={cn("flex gap-4 border-b px-5 text-[12px]", LINE)}>
          {["Answers", "Activity", "Approvals", "Payment", "Details"].map((tab) => (
            <span key={tab} className={cn("border-b-2 py-2.5", tab === "Answers" ? "border-foreground font-medium" : "border-transparent text-muted-foreground")}>
              {tab}
            </span>
          ))}
        </div>
        <div className="flex flex-col px-5 py-2">
          {ANSWERS.map((row) => (
            <div key={row.question} className={cn("border-b py-2.5 last:border-b-0", LINE)}>
              <div className="text-[11px] text-muted-foreground">{row.question}</div>
              {row.sensitive ? (
                <div className="mt-1 flex items-center gap-2">
                  <span className="flex items-center gap-1.5 tracking-[0.25em] text-muted-foreground">
                    <Lock className="size-3.5" />
                    ••••••
                  </span>
                  <span className="flex h-6 items-center gap-1.5 rounded-md px-2 text-[11px] text-foreground/80">
                    <Eye className="size-3.5" /> Reveal
                  </span>
                </div>
              ) : (
                <div className="mt-0.5 text-foreground/90">{row.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Cell: the spam layers on a form, from a honeypot to duplicate detection.
export function SpamRender() {
  return (
    <div className="mx-auto w-[460px] text-[13px]">
      <SectionCard title="Spam protection" action={<ShieldBan className="size-4 text-muted-foreground" />}>
        <SettingRow title="Honeypot field" description="An invisible field that bots fill in. Invisible to people.">
          <Toggle />
        </SettingRow>
        <SettingRow title="CAPTCHA challenge" description="Cloudflare Turnstile check before submit.">
          <Toggle />
        </SettingRow>
        <SettingRow title="Rate limit" description="Maximum submissions per hour from one device / IP.">
          <Input className="h-7 w-16 justify-center tabular-nums">10</Input>
        </SettingRow>
        <SettingRow title="Detect duplicates" description="Spot repeat submissions that match on Email.">
          <Toggle />
        </SettingRow>
      </SectionCard>
    </div>
  );
}

// Cell: a retention window on the form, and an erasure request for one applicant.
export function PrivacyRender() {
  return (
    <div className="mx-auto flex w-[460px] flex-col gap-3 text-[13px]">
      <SectionCard title="Privacy">
        <SettingRow title="Anonymous responses" description="Don't store IP hash, user agent or the signed-in user.">
          <Toggle on={false} />
        </SettingRow>
        <SettingRow title="Delete responses after" description="Older responses are erased by the daily retention job.">
          <Input className="h-7 w-[86px] tabular-nums">365 days</Input>
        </SettingRow>
      </SectionCard>
      <SectionCard title="Right to erasure" description="Permanently delete every response, partial and uploaded file submitted with an email address.">
        <div className="flex gap-2">
          <Input className="flex-1">
            <Typed text="ines@duarte.pt" delay={1.3} />
          </Input>
          <span className="flex h-8 items-center gap-1.5 rounded-md border border-red-500/20 bg-red-500/10 px-3 text-[12px] text-red-600 dark:text-red-400">
            <Eraser className="size-3.5" /> Erase data
          </span>
        </div>
      </SectionCard>
    </div>
  );
}

const KEYS = [
  { name: "Panel sync", prefix: "gf_3k9Q", scopes: ["Read"], used: "5m ago" },
  { name: "Website submit", prefix: "gf_p7Lm", scopes: ["Read", "Write"], used: "1h ago" },
];

// Cell: API keys with read or write scopes, and a call that pulls the latest applications.
export function ApiRender() {
  return (
    <div className="mx-auto w-[460px] text-[13px]">
      <div className={cn("overflow-hidden", CARD)}>
        <div className={cn("flex items-center gap-2 border-b px-4 py-2.5", LINE)}>
          <KeyRound className="size-4 text-muted-foreground" />
          <span className="font-semibold">API keys</span>
          <span className="ml-auto text-[11px] text-muted-foreground">Keys are stored hashed.</span>
        </div>
        {KEYS.map((key) => (
          <div key={key.name} className={cn("grid grid-cols-[1fr_74px_92px_56px] items-center gap-2 border-b px-4 py-2 text-[12px] last:border-b-0", LINE)}>
            <span className="truncate font-medium">{key.name}</span>
            <span className="font-mono text-[11px] text-muted-foreground">{key.prefix}…</span>
            <span className="flex gap-1">
              {key.scopes.map((scope) => (
                <span key={scope} className="rounded border border-foreground/[0.12] px-1.5 text-[10px] leading-4">
                  {scope}
                </span>
              ))}
            </span>
            <span className="text-right text-[11px] text-muted-foreground">{key.used}</span>
          </div>
        ))}
      </div>
      <pre className={cn("mt-3 overflow-hidden px-4 py-3 font-mono text-[11px] leading-[1.65] text-foreground/80", CARD, styles.popIn)} style={{ "--pop-delay": "0.5s" }}>
        <div>
          <span className="text-emerald-600 dark:text-emerald-400">GET</span> /api/v1/forms/:id/responses?since=2026-10-01
        </div>
        <div className="text-muted-foreground">Authorization: Bearer gf_3k9Q…</div>
        <div className="mt-2">{"{"}</div>
        <div>{'  "ok": true,'}</div>
        <div>{'  "responses": [{ "id": "8f2c1a90", "status": "Pending", … }],'}</div>
        <div>{'  "nextCursor": "MjAyNi0xMC0yNw"'}</div>
        <div>{"}"}</div>
      </pre>
    </div>
  );
}

const DELIVERIES = [
  { when: "09:14", event: "response.created", state: "Delivered", attempts: "1" },
  { when: "09:52", event: "response.approved", state: "Delivered", attempts: "1" },
  { when: "10:03", event: "response.updated", state: "Retrying", attempts: "2" },
  { when: "Yesterday", event: "response.created", state: "Failed", attempts: "8", error: "HTTP 503" },
];

// Cell: the webhook delivery log, with a failed delivery ready to replay.
export function WebhooksRender() {
  return (
    <div className={cn("mx-auto w-[460px] overflow-hidden text-[13px]", CARD)}>
      <div className={cn("flex items-center gap-2 border-b px-4 py-2.5", LINE)}>
        <Webhook className="size-4 text-muted-foreground" />
        <span className="font-semibold">Recent deliveries</span>
        <span className="ml-auto truncate font-mono text-[10.5px] text-muted-foreground">hooks.brightloop.org/grants</span>
      </div>
      <div className={cn("grid grid-cols-[62px_1fr_84px_34px_64px] gap-2 border-b px-4 py-2 text-[11px] text-muted-foreground", LINE)}>
        <span>When</span>
        <span>Event</span>
        <span>Status</span>
        <span>Tries</span>
        <span />
      </div>
      {DELIVERIES.map((delivery, index) => (
        <div key={`${delivery.event}-${delivery.when}`} className={cn("grid grid-cols-[62px_1fr_84px_34px_64px] items-center gap-2 border-b px-4 py-2.5 text-[12px] last:border-b-0", LINE, delivery.state === "Failed" && "bg-red-500/[0.04]")}>
          <span className="text-[11px] text-muted-foreground">{delivery.when}</span>
          <span className="min-w-0">
            <span className="block truncate font-mono text-[11px]">{delivery.event}</span>
            {delivery.error ? <span className="block text-[10.5px] text-red-600 dark:text-red-400">{delivery.error}</span> : null}
          </span>
          <StatusDot status={delivery.state} className="text-[12px]" />
          <span className="text-center text-[11px] text-muted-foreground tabular-nums">{delivery.attempts}</span>
          <span
            className={cn("flex h-6 items-center justify-center gap-1 rounded-md text-[11px]", delivery.state === "Failed" ? cn("border border-foreground/25 bg-foreground/[0.06] text-foreground", styles.popIn) : "text-muted-foreground/60")}
            style={delivery.state === "Failed" ? { "--pop-delay": `${0.4 + index * 0.1}s` } : undefined}
          >
            <RotateCcw className="size-3" /> Replay
          </span>
        </div>
      ))}
    </div>
  );
}
