import {
  ArrowLeft,
  BadgeCheck,
  CalendarPlus,
  Check,
  CircleSlash,
  Download,
  ExternalLink,
  EyeOff,
  FileText,
  GripVertical,
  HandCoins,
  Heart,
  Image as ImageIcon,
  Images,
  LayoutTemplate,
  Lock,
  Megaphone,
  PanelTop,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Store,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, Chip, Dot, LINE, MonoLabel, Typed, Window } from "@/components/product-pages/mock_kit";
import { AssetsSidebar, EditorNav, FieldBox, Photo, Segmented, StatCell, StatsRow } from "@/components/product-pages/apps/assets/assets_kit";
import styles from "@/components/product-pages/product_pages.module.css";

// Geiger Assets galleries tour: Cobalt Retail's press gallery, Hana Ito's print store and creator page, and the licences behind the lookbook.

const GALLERY_NAV = [
  {
    items: [
      { label: "Content", icon: Images },
      { label: "Layout & theme", icon: LayoutTemplate },
      { label: "Poster", icon: ImageIcon },
      { label: "Header & footer", icon: PanelTop },
      { label: "Selling", icon: Store },
      { label: "Access", icon: Lock },
      { label: "SEO & social", icon: Search },
      { label: "Publish", icon: Megaphone },
    ],
  },
];

// A public page in a browser frame, addressed by its path.
function Browser({ path, className, children }) {
  return (
    <Window className={className}>
      <div className={cn("flex h-10 shrink-0 items-center gap-3 border-b px-4", LINE)}>
        <span className="flex gap-1.5">
          {[0, 1, 2].map((dot) => (
            <span key={dot} className="size-2.5 rounded-full bg-foreground/15" />
          ))}
        </span>
        <span className="mx-auto flex h-6 w-[60%] items-center justify-center gap-1.5 rounded-md bg-foreground/[0.05] font-mono text-[11px] text-muted-foreground">
          <Lock className="size-3" /> {path}
        </span>
      </div>
      {children}
    </Window>
  );
}

const HARBOUR = ["coast", "dusk", "skyline", "coast", "portrait", "dusk", "coast", "skyline", "coast", "dusk", "portrait", "coast"];

// Hero: Hana Ito's "Harbour light" gallery in the Gallery Builder, curated items on the left and the live page on the right.
export function GalleryEditorWindow() {
  return (
    <Window className="h-[700px] w-[1180px]">
      <div className="flex h-full">
        <AssetsSidebar workspace="Hana Ito" open="Galleries" active="Gallery Builder" />
        <div className="flex min-w-0 flex-1 flex-col">
          <div className={cn("flex h-12 shrink-0 items-center gap-2.5 border-b px-5", LINE)}>
            <ArrowLeft className="size-4 text-muted-foreground" />
            <span className="text-muted-foreground">Gallery Builder</span>
            <span className="text-muted-foreground/60">/</span>
            <span className="font-medium">Harbour light</span>
            <span className="ml-1 inline-flex items-center gap-1.5 text-[12px] text-foreground/80">
              <Dot tone="emerald" /> Published
            </span>
            <Chip className="h-5 px-2 text-[11px]">Public</Chip>
            <span className="ml-auto flex items-center gap-2 text-[12px]">
              <span className="flex size-7 items-center justify-center rounded-md border border-foreground/[0.1] text-foreground/80">
                <ExternalLink className="size-3.5" />
              </span>
              <span className="flex h-7 items-center gap-1.5 rounded-md border border-foreground/[0.1] px-2.5 text-foreground/80">
                <EyeOff className="size-3.5" /> Unpublish
              </span>
              <span className="flex h-7 items-center rounded-md bg-foreground px-2.5 font-medium text-background">Save</span>
            </span>
          </div>
          <div className="flex min-h-0 flex-1">
            <EditorNav groups={GALLERY_NAV} active="Content" className="w-[164px]" />
            <div className="flex min-w-0 flex-1 flex-col gap-4 p-5">
              <div>
                <div className="text-[15px] font-medium">Source</div>
                <div className="mt-0.5 text-[12px] text-muted-foreground">A collection-backed gallery follows the collection; a curated one keeps its own list.</div>
                <Segmented items={["Collection (live)", "Curated selection"]} active="Curated selection" className="mt-3" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-medium">Items</span>
                <span className="text-[12px] text-muted-foreground">14</span>
                <span className="ml-auto flex h-7 items-center rounded-md border border-foreground/[0.1] px-2.5 text-[12px] text-foreground/80">Add assets</span>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {HARBOUR.slice(0, 9).map((scene, index) => (
                  <div key={index} className={cn("relative overflow-hidden rounded-lg border", index === 4 ? "border-foreground/40 ring-2 ring-foreground/15" : "border-foreground/[0.08]")}>
                    <Photo scene={scene} className="block h-[108px] w-full" />
                    <span className="absolute top-1.5 left-1.5 flex size-5 items-center justify-center rounded bg-background/70 text-muted-foreground">
                      <GripVertical className="size-3" />
                    </span>
                    <span className="absolute right-1.5 bottom-1.5 rounded bg-background/75 px-1.5 font-mono text-[10px] text-foreground/80">harbour-{String(index + 1).padStart(2, "0")}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={cn("flex w-[330px] shrink-0 flex-col border-l bg-foreground/[0.02] p-4", LINE)}>
              <MonoLabel>Preview</MonoLabel>
              <div className="mt-3 overflow-hidden rounded-xl border border-foreground/[0.1] bg-background">
                <div className={cn("flex items-center gap-2 border-b px-3 py-2 text-[11px]", LINE)}>
                  <span className="font-medium">Hana Ito</span>
                  <span className="ml-auto text-muted-foreground">Prints</span>
                  <ShoppingBag className="size-3 text-muted-foreground" />
                </div>
                <div className="relative">
                  <Photo scene="coast" className="block h-[150px] w-full" />
                  <div className="absolute inset-x-3 bottom-3">
                    <div className="text-[17px] leading-tight font-semibold tracking-[-0.02em]">Harbour light</div>
                    <div className="mt-0.5 text-[11px] text-foreground/80">
                      <Typed text="Prints from the north harbour, 2026" delay={1.4} />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1 p-1.5">
                  {["dusk", "skyline", "portrait", "coast", "dusk", "skyline"].map((scene, index) => (
                    <Photo key={index} scene={scene} className={cn("block w-full rounded-[4px]", index % 2 ? "h-[70px]" : "h-[92px]")} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Window>
  );
}

const LAYOUTS = [
  { label: "Grid", hint: "Even tiles" },
  { label: "Masonry", hint: "Own heights" },
  { label: "Justified rows", hint: "Equal height rows" },
  { label: "Mosaic", hint: "Every sixth large" },
  { label: "Slideshow", hint: "One at a time" },
  { label: "Single column", hint: "Editorial" },
];

function LayoutGlyph({ label }) {
  const tile = "rounded-[2px] bg-foreground/25";
  if (label === "Masonry") {
    return (
      <span className="grid h-full grid-cols-3 gap-1">
        {[
          ["h-[60%]", "h-[36%]"],
          ["h-[34%]", "h-[62%]"],
          ["h-[52%]", "h-[44%]"],
        ].map((col, index) => (
          <span key={index} className="flex flex-col gap-1">
            {col.map((height) => (
              <span key={height} className={cn(tile, height)} />
            ))}
          </span>
        ))}
      </span>
    );
  }
  if (label === "Justified rows") {
    return (
      <span className="flex h-full flex-col gap-1">
        {[
          ["flex-[3]", "flex-[2]"],
          ["flex-[2]", "flex-[2]", "flex-[3]"],
        ].map((row, index) => (
          <span key={index} className="flex flex-1 gap-1">
            {row.map((width, cell) => (
              <span key={cell} className={cn(tile, width)} />
            ))}
          </span>
        ))}
      </span>
    );
  }
  if (label === "Mosaic") {
    return (
      <span className="grid h-full grid-cols-3 grid-rows-2 gap-1">
        <span className={cn(tile, "col-span-2 row-span-2")} />
        <span className={tile} />
        <span className={tile} />
      </span>
    );
  }
  if (label === "Slideshow") {
    return (
      <span className="flex h-full items-center gap-1">
        <span className="h-[50%] w-1 rounded-full bg-foreground/15" />
        <span className={cn(tile, "h-full flex-1")} />
        <span className="h-[50%] w-1 rounded-full bg-foreground/15" />
      </span>
    );
  }
  if (label === "Single column") {
    return (
      <span className="mx-auto flex h-full w-[60%] flex-col gap-1">
        <span className={cn(tile, "flex-1")} />
        <span className={cn(tile, "flex-1")} />
      </span>
    );
  }
  return (
    <span className="grid h-full grid-cols-3 grid-rows-2 gap-1">
      {Array.from({ length: 6 }, (_, index) => (
        <span key={index} className={tile} />
      ))}
    </span>
  );
}

const PRESS = ["coat", "skyline", "plinth", "portrait", "fabric", "coat", "dusk", "plinth", "portrait"];
const PRESS_HEIGHTS = ["h-[132px]", "h-[96px]", "h-[110px]", "h-[124px]", "h-[86px]", "h-[140px]"];

// Section stage: the layout picker behind, the published press gallery in front.
export function GalleryStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <Window className="absolute top-0 left-0 h-[600px] w-[640px] opacity-90">
        <div className={cn("flex h-12 shrink-0 items-center gap-2.5 border-b px-5", LINE)}>
          <ArrowLeft className="size-4 text-muted-foreground" />
          <span className="font-medium">Autumn lookbook — press</span>
          <span className="ml-auto inline-flex items-center gap-1.5 text-[12px] text-foreground/80">
            <Dot tone="emerald" /> Published
          </span>
        </div>
        <div className="flex flex-1">
          <EditorNav groups={GALLERY_NAV} active="Layout & theme" className="w-[160px]" />
          <div className="min-w-0 flex-1 p-5">
            <div className="text-[15px] font-medium">Layout</div>
            <div className="mt-0.5 text-[12px] text-muted-foreground">Columns that keep each image&apos;s own height.</div>
            <div className="mt-4 grid w-[290px] grid-cols-2 gap-2.5">
              {LAYOUTS.map((layout) => (
                <div key={layout.label} className={cn("rounded-lg border p-2.5", layout.label === "Masonry" ? "border-foreground/40 bg-foreground/[0.04]" : "border-foreground/[0.09]")}>
                  <div className="h-[50px] rounded-md bg-foreground/[0.04] p-1.5">
                    <LayoutGlyph label={layout.label} />
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-[12px]">
                    <span className="truncate">{layout.label}</span>
                    {layout.label === "Masonry" ? <Check className="ml-auto size-3.5 shrink-0" /> : null}
                  </div>
                  <div className="truncate text-[11px] text-muted-foreground">{layout.hint}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 text-[15px] font-medium">Theme</div>
            <div className="mt-3 flex w-[290px] flex-wrap gap-2">
              {[
                ["Suite", "bg-foreground/80"],
                ["Midnight", "bg-foreground/60"],
                ["Light", "bg-foreground/15"],
                ["Paper", "bg-foreground/[0.07]"],
              ].map(([label, swatch], index) => (
                <span key={label} className={cn("flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[12px]", index === 3 ? "border-foreground/40" : "border-foreground/[0.09] text-muted-foreground")}>
                  <span className={cn("size-3.5 rounded-full border border-foreground/20", swatch)} />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Window>
      <Browser path="/g/autumn-lookbook-press" className={cn("absolute top-[60px] left-[490px] z-[2] w-[510px]", styles.float)}>
        <div className="px-6 pt-6 pb-2">
          <div className="font-mono text-[11px] tracking-[0.12em] text-muted-foreground uppercase">Cobalt Retail</div>
          <div className="mt-1 text-[24px] leading-tight font-semibold tracking-[-0.02em]">Autumn lookbook</div>
          <div className="mt-1 flex items-center gap-3 text-[12px] text-muted-foreground">
            24 images · For press and stockists
            <span className="ml-auto flex items-center gap-1.5">
              <Heart className="size-3.5" /> Favorites
            </span>
          </div>
        </div>
        <div className="flex gap-1.5 px-6 pt-3 pb-6">
          {[0, 1, 2].map((col) => (
            <div key={col} className="flex flex-1 flex-col gap-1.5">
              {PRESS.filter((_, index) => index % 3 === col).map((scene, index) => (
                <div key={index} className={cn("overflow-hidden rounded-md", styles.popIn)} style={{ "--pop-delay": `${0.2 + (index * 3 + col) * 0.06}s` }}>
                  <Photo scene={scene} className={cn("block w-full", PRESS_HEIGHTS[(index * 3 + col) % PRESS_HEIGHTS.length])} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </Browser>
    </div>
  );
}

const REQUESTS = [
  { who: "Fieldnote", what: "3 images", state: "Pending" },
  { who: "Brightloop", what: "look-07-overcoat.jpg", state: "Approved" },
];

// Cell: a gallery's visibility, password, expiry and download requests.
export function GalleryAccessRender() {
  return (
    <div className="mx-auto w-[460px] rounded-xl border border-foreground/[0.09] bg-surface-card p-4 text-[13px] dark:bg-surface-subtle">
      <div className="flex items-baseline gap-2">
        <span className="font-medium">Who can see this</span>
        <span className="text-[12px] text-muted-foreground">Applied by the public page.</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2.5">
        <div className="col-span-2 flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">Visibility</span>
          <Segmented items={["Public", "Unlisted", "Private"]} active="Unlisted" />
        </div>
        <FieldBox label="Password">
          <span className="tracking-[0.2em]">••••••••</span>
          <Lock className="ml-auto size-3 text-muted-foreground" />
        </FieldBox>
        <FieldBox label="Access expires">Nov 30, 2026</FieldBox>
        <FieldBox label="Downloads" className="col-span-2">
          On request
          <span className="ml-auto text-[11px] text-muted-foreground">Visitors ask; you approve or deny.</span>
        </FieldBox>
      </div>
      <div className="mt-3 flex flex-col gap-1.5">
        {REQUESTS.map((request, index) => (
          <div key={request.who} className={cn("flex items-center gap-2.5 rounded-lg bg-foreground/[0.03] px-2.5 py-1.5 text-[12px]", styles.popIn)} style={{ "--pop-delay": `${0.4 + index * 0.2}s` }}>
            <Avatar name={request.who} size={18} />
            <span className="text-foreground/90">{request.who}</span>
            <span className="truncate text-muted-foreground">{request.what}</span>
            {request.state === "Pending" ? (
              <span className="ml-auto flex gap-1.5">
                <span className="rounded-md bg-foreground px-2 py-0.5 text-[11px] font-medium text-background">Approve</span>
                <span className="rounded-md border border-foreground/[0.1] px-2 py-0.5 text-[11px] text-muted-foreground">Deny</span>
              </span>
            ) : (
              <span className="ml-auto inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                <Dot tone="emerald" /> Approved
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Cell: the password gate in front of the press gallery.
export function PasswordRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[460px]">
      <div className="absolute inset-0 overflow-hidden rounded-xl opacity-40 blur-[3px]">
        <div className="flex h-full gap-1.5 p-1.5">
          {[0, 1, 2, 3].map((col) => (
            <div key={col} className="flex flex-1 flex-col gap-1.5">
              {PRESS.slice(col, col + 3).map((scene, index) => (
                <Photo key={index} scene={scene} className={cn("block w-full rounded-md", (index + col) % 2 ? "h-[120px]" : "h-[86px]")} />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="absolute top-[22px] left-1/2 w-[290px] -translate-x-1/2 rounded-xl border border-foreground/[0.12] bg-surface-card p-5 text-[13px] shadow-2xl shadow-black/30 dark:bg-surface-dialog">
        <span className="flex size-9 items-center justify-center rounded-lg border border-foreground/[0.1] bg-foreground/[0.04]">
          <Lock className="size-4 text-muted-foreground" />
        </span>
        <div className="mt-3 text-[15px] font-semibold">Autumn lookbook — press</div>
        <div className="mt-1 text-[12px] leading-5 text-muted-foreground">This gallery is password protected. Enter it to continue.</div>
        <div className="mt-3 flex h-8 items-center rounded-md border border-foreground/[0.14] px-2.5 tracking-[0.25em] text-foreground/85">••••••••</div>
        <div className="mt-3 flex h-8 items-center justify-center rounded-md bg-foreground text-[12px] font-medium text-background">Open gallery</div>
        <div className={cn("mt-3 flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground", styles.popIn)} style={{ "--pop-delay": "0.7s" }}>
          <ShieldCheck className="size-3 text-emerald-600 dark:text-emerald-400" /> Checked on the server · 200
        </div>
      </div>
    </div>
  );
}

const SHOP = [
  { scene: "coast", title: "Harbour light 04", price: "From $40" },
  { scene: "dusk", title: "North quay at dusk", price: "From $35" },
  { scene: "skyline", title: "Harbour towers", price: "From $35" },
  { scene: "portrait", title: "The net mender", price: "From $40" },
  { scene: "coast", title: "Harbour light 07", price: "From $35" },
  { scene: "dusk", title: "Last ferry", price: "From $35" },
];

const CART = [
  { scene: "coast", title: "Harbour light 04", option: "Print · 16 × 20 in", price: "$120.00" },
  { scene: "coast", title: "Harbour light 07", option: "Digital download · Large (2048px)", price: "$35.00" },
];

// Section stage: Hana Ito's gallery store behind, the cart sheet with a code applied in front.
export function StoreStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <Browser path="/g/harbour-light" className="absolute top-0 left-0 h-[600px] w-[660px] opacity-90">
        <div className={cn("flex items-center gap-3 border-b px-6 py-3", LINE)}>
          <span className="font-semibold">Hana Ito</span>
          <span className="ml-auto flex items-center gap-4 text-[12px] text-muted-foreground">
            <span>Offers</span>
            <span className="relative">
              <ShoppingCart className="size-4" />
              <span className="absolute -top-1.5 -right-2 flex size-4 items-center justify-center rounded-full bg-foreground text-[10px] font-medium text-background">2</span>
            </span>
          </span>
        </div>
        <div className="px-6 pt-5">
          <div className="text-[22px] font-semibold tracking-[-0.02em]">Harbour light</div>
          <div className="mt-0.5 text-[12px] text-muted-foreground">Prints and downloads from the north harbour, 2026</div>
        </div>
        <div className="grid grid-cols-3 gap-3 px-6 pt-4">
          {SHOP.map((item, index) => (
            <div key={index}>
              <div className="relative overflow-hidden rounded-lg">
                <Photo scene={item.scene} className="block h-[150px] w-full" />
                <span className="absolute right-2 bottom-2 rounded-md bg-background/85 px-2 py-0.5 text-[11px] font-medium">{item.price}</span>
              </div>
              <div className="mt-1.5 truncate text-[12px] text-foreground/85">{item.title}</div>
            </div>
          ))}
        </div>
      </Browser>
      <Window className={cn("absolute top-[30px] left-[600px] z-[2] w-[400px]", styles.float)}>
        <div className={cn("flex items-center gap-2 border-b px-5 py-3.5", LINE)}>
          <ShoppingBag className="size-4 text-muted-foreground" />
          <span className="font-medium">Your cart</span>
          <X className="ml-auto size-4 text-muted-foreground" />
        </div>
        <div className="flex flex-col gap-3 px-5 py-4">
          {CART.map((line) => (
            <div key={line.title} className="flex items-center gap-3">
              <span className="size-12 shrink-0 overflow-hidden rounded-md">
                <Photo scene={line.scene} className="block size-full" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-foreground/90">{line.title}</span>
                <span className="block truncate text-[11px] text-muted-foreground">{line.option}</span>
              </span>
              <span className="tabular-nums">{line.price}</span>
            </div>
          ))}
          <div className="flex items-center gap-2 rounded-lg border border-emerald-500/25 bg-emerald-500/[0.06] px-3 py-2 text-[12px]">
            <span className="font-mono tracking-wider">AUTUMN10</span>
            <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
              <Check className="size-3" /> Applied
            </span>
            <X className="ml-auto size-3 text-muted-foreground" />
          </div>
          <FieldBox label="Email">clara.vidal@fieldnote.example</FieldBox>
          <span className="-mt-1.5 text-[11px] text-muted-foreground">Your receipt and download links are tied to this address.</span>
        </div>
        <div className={cn("flex flex-col gap-1.5 border-t px-5 py-4 text-[12px]", LINE)}>
          {[
            ["Subtotal", "$155.00"],
            ["Discount (AUTUMN10)", "−$15.50"],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between text-muted-foreground">
              <span>{label}</span>
              <span className="tabular-nums">{value}</span>
            </div>
          ))}
          <div className="flex justify-between text-[13px] font-medium">
            <span>Total</span>
            <span className="tabular-nums">$139.50</span>
          </div>
          <span className="mt-2 flex h-10 items-center justify-center rounded-lg bg-foreground text-[13px] font-medium text-background">Pay $139.50</span>
          <span className="mt-1 text-center text-[11px] text-muted-foreground">Prices are worked out again on the server · Checkout by Stripe</span>
        </div>
      </Window>
    </div>
  );
}

const TIMELINE = [
  ["Order placed from Harbour light", "Oct 26, 19:02"],
  ["Paid with Stripe · $139.50", "Oct 26, 19:03"],
  ["Download link issued for Harbour light 07", "Oct 26, 19:03"],
];

// Cell: an order in Orders & Invoices, with its items, timeline and receipt.
export function OrderRender() {
  return (
    <div className="mx-auto w-[460px] rounded-xl border border-foreground/[0.09] bg-surface-card text-[13px] dark:bg-surface-subtle">
      <div className={cn("flex items-center gap-2.5 border-b px-4 py-3", LINE)}>
        <Avatar name="Clara Vidal" size={22} />
        <span className="min-w-0 flex-1">
          <span className="block font-medium">Order #1047</span>
          <span className="block truncate text-[11px] text-muted-foreground">Clara Vidal · Harbour light · Stripe</span>
        </span>
        <span className="inline-flex items-center gap-1.5 text-[12px]">
          <Dot tone="emerald" /> Paid
        </span>
      </div>
      <div className={cn("flex flex-col gap-2 border-b px-4 py-3 text-[12px]", LINE)}>
        {[
          ["Harbour light 04 · Print 16 × 20 in", "Unfulfilled", "amber"],
          ["Harbour light 07 · Download", "Delivered", "emerald"],
        ].map(([item, state, tone]) => (
          <div key={item} className="flex items-center gap-2">
            <span className="truncate text-foreground/85">{item}</span>
            <span className="ml-auto inline-flex shrink-0 items-center gap-1.5 text-muted-foreground">
              <Dot tone={tone} /> {state}
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2 px-4 py-3">
        {TIMELINE.map(([event, time], index) => (
          <div key={event} className={cn("flex items-center gap-2.5 text-[12px]", styles.popIn)} style={{ "--pop-delay": `${0.2 + index * 0.15}s` }}>
            <span className="size-1.5 shrink-0 rounded-full bg-foreground/40" />
            <span className="truncate text-foreground/85">{event}</span>
            <span className="ml-auto shrink-0 text-[11px] text-muted-foreground">{time}</span>
          </div>
        ))}
      </div>
      <div className={cn("flex gap-2 border-t px-4 py-3 text-[12px]", LINE)}>
        <span className="flex h-7 flex-1 items-center justify-center gap-1.5 rounded-md border border-foreground/[0.1] text-foreground/85">
          <FileText className="size-3.5" /> Download receipt (PDF)
        </span>
        <span className="flex h-7 items-center justify-center rounded-md border border-foreground/[0.1] px-3 text-foreground/85">Refund</span>
      </div>
    </div>
  );
}

// Cell: the buyer's order page with a download link and the receipt.
export function DownloadsRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[460px]">
      <Browser path="/g/harbour-light/order/1047" className="absolute inset-x-0 top-0">
        <div className="px-5 py-4">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
            <span className="flex size-5 items-center justify-center rounded-full bg-emerald-500 text-white">
              <Check className="size-3" strokeWidth={3} />
            </span>
            <span className="text-[13px] font-medium">Thanks, Clara. Order #1047 is paid.</span>
          </div>
          <div className="mt-4 flex items-center gap-3 rounded-lg border border-foreground/[0.1] p-2.5">
            <span className="size-11 shrink-0 overflow-hidden rounded-md">
              <Photo scene="coast" className="block size-full" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[13px]">Harbour light 07</span>
              <span className="block text-[11px] text-muted-foreground">Large (2048px) · JPEG · 1 of 5 downloads</span>
            </span>
            <span className={cn("flex h-7 items-center gap-1.5 rounded-md bg-foreground px-2.5 text-[12px] font-medium text-background", styles.popIn)} style={{ "--pop-delay": "0.5s" }}>
              <Download className="size-3.5" /> Download
            </span>
          </div>
          <div className="mt-2.5 flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
            /api/store/download/9f3c…e21a
            <span className="ml-auto font-sans text-[11px]">Link expires Nov 25</span>
          </div>
          <div className={cn("mt-3 flex items-center gap-2 border-t pt-3 text-[12px] text-foreground/85", LINE)}>
            <FileText className="size-3.5 text-muted-foreground" /> Download receipt (PDF)
            <span className="ml-auto text-muted-foreground">Print ships separately</span>
          </div>
        </div>
      </Browser>
    </div>
  );
}

const LICENCES = [
  { ref: "LIC-2026-031", title: "AW26 hero — stockist web", licensee: "Northwind", type: "Brand", scope: "Web, Social · United Kingdom", term: "6 mo · to Apr 30", fee: "$1,800", status: "Active", tone: "emerald" },
  { ref: "LIC-2026-029", title: "Look 07 — print catalogue", licensee: "Atlas Coffee", type: "Brand", scope: "Print · Domestic only", term: "3 mo · to Jan 15", fee: "$950", status: "Active", tone: "emerald" },
  { ref: "LIC-2026-027", title: "Tote on plinth — retail OOH", licensee: "Brightloop", type: "Agency", scope: "Out of home · Europe", term: "1 yr · to Nov 8", fee: "$2,500", status: "Expiring", tone: "amber" },
  { ref: "LIC-2026-024", title: "Skyline hero — editorial", licensee: "Fieldnote", type: "Publisher", scope: "Web · Worldwide", term: "1 yr · to Sep 2", fee: "$600", status: "Active", tone: "emerald" },
  { ref: "LIC-2026-033", title: "Dusk hero — launch film", licensee: "Kestrel Aero", type: "Brand", scope: "Streaming · Europe", term: "1 yr", fee: "$3,200", status: "Pending", tone: "neutral" },
];

const QUOTE = [
  ["Base fee", "$1,200.00"],
  ["Territory · Europe", "× 1.5"],
  ["Channels · Web, Social", "× 1.2"],
  ["Term and exclusivity", "× 1.0"],
];

// Section stage: issued licences behind, a new licence being issued with its fee worked out from the rate card.
export function LicensingStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <Window title="Issued Licenses" icon={BadgeCheck} className="absolute top-0 left-0 h-[580px] w-[680px] opacity-90">
        <div className="p-4">
          <StatsRow>
            <StatCell label="Licences" value="18" footer="11 active" />
            <StatCell label="Licence revenue" value="$42.6k" footer="total fees issued" />
            <StatCell label="Expiring soon" value="2" footer="within 30 days" />
            <StatCell label="Exclusive grants" value="1" footer="live exclusivity" />
          </StatsRow>
        </div>
        <div className={cn("grid h-9 grid-cols-[1.5fr_1fr_1.2fr_70px_84px] items-center gap-3 border-y px-5 text-[11px] text-muted-foreground", LINE)}>
          <span>Licence</span>
          <span>Licensee</span>
          <span>Scope</span>
          <span className="text-right">Fee</span>
          <span>Status</span>
        </div>
        {LICENCES.map((licence) => (
          <div key={licence.ref} className={cn("grid grid-cols-[1.5fr_1fr_1.2fr_70px_84px] items-center gap-3 border-b px-5 py-2.5", LINE)}>
            <span className="min-w-0">
              <span className="block truncate text-foreground/90">{licence.title}</span>
              <span className="block truncate font-mono text-[10px] text-muted-foreground">
                {licence.ref} · {licence.term}
              </span>
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[12px] text-foreground/85">{licence.licensee}</span>
              <span className="block text-[11px] text-muted-foreground">{licence.type}</span>
            </span>
            <span className="truncate text-[12px] text-muted-foreground">{licence.scope}</span>
            <span className="text-right text-[12px] tabular-nums">{licence.fee}</span>
            <span className="inline-flex items-center gap-1.5 text-[12px] text-foreground/80">
              <Dot tone={licence.tone} /> {licence.status}
            </span>
          </div>
        ))}
      </Window>
      <div className={cn("absolute top-[16px] left-[600px] z-[2] w-[400px] rounded-xl border border-foreground/[0.12] bg-surface-card p-5 text-[13px] shadow-2xl shadow-black/30 dark:bg-surface-dialog", styles.float)}>
        <div className="text-[15px] font-medium">Issue licence</div>
        <div className="mt-0.5 text-[12px] leading-[1.45] text-muted-foreground">Pick the licensee and scope; the fee is calculated from the rate card and can be overridden.</div>
        <div className="mt-3.5 grid grid-cols-2 gap-2.5">
          <FieldBox label="Licensee">Brightloop</FieldBox>
          <FieldBox label="Template">Stockist campaign</FieldBox>
        </div>
        <div className="mt-3 text-[11px] text-muted-foreground">Grant</div>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {["Advertising", "Europe", "Web", "Social", "1 year", "Non-exclusive"].map((item) => (
            <Chip key={item} className="h-6 px-2 text-[11px]">
              {item}
            </Chip>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-emerald-500/25 bg-emerald-500/[0.06] px-3 py-2 text-[12px] text-emerald-700 dark:text-emerald-400">
          <ShieldCheck className="size-3.5" /> Conflict check · no overlapping exclusive grants
        </div>
        <div className="mt-3 rounded-lg bg-foreground/[0.03] px-3 py-2.5 text-[12px]">
          {QUOTE.map(([label, value], index) => (
            <div key={label} className={cn("flex justify-between py-0.5", styles.popIn)} style={{ "--pop-delay": `${0.3 + index * 0.1}s` }}>
              <span className="text-muted-foreground">{label}</span>
              <span className="tabular-nums">{value}</span>
            </div>
          ))}
          <div className={cn("mt-1.5 flex justify-between border-t pt-2 text-[13px] font-medium", LINE)}>
            <span>Fee</span>
            <span className="tabular-nums">$2,160.00</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const RIGHTS = [
  { title: "AW26 lookbook — campaign images", holder: "Hana Ito", acquisition: "Commissioned", window: "Oct 2026 – Oct 2031", share: "10%", status: "Active", tone: "emerald" },
  { title: "Harbour light 04", holder: "Hana Ito", acquisition: "Licensed in", window: "to Mar 2027", share: "—", status: "Expiring", tone: "amber" },
  { title: "Look 03 — model release", holder: "Theo Lindqvist", acquisition: "Licensed in", window: "to Jan 2028", share: "—", status: "Active", tone: "emerald" },
  { title: "Tote product shots", holder: "Cobalt Retail", acquisition: "Owned", window: "No expiry", share: "—", status: "Active", tone: "emerald" },
];

// Cell: the Rights Inventory, with holders, acquisition and windows.
export function RightsRender() {
  return (
    <div className="mx-auto w-[460px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card text-[12px] dark:bg-surface-subtle">
      <div className={cn("flex items-center gap-2 border-b px-4 py-3 text-[13px]", LINE)}>
        <span className="font-medium">Rights Inventory</span>
        <span className="ml-auto text-[12px] text-muted-foreground">3 windows closing within 90 days</span>
      </div>
      {RIGHTS.map((right, index) => (
        <div key={right.title} className={cn("flex items-center gap-3 border-b px-4 py-2.5 last:border-b-0", LINE, styles.popIn)} style={{ "--pop-delay": `${0.15 + index * 0.1}s` }}>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[12px] text-foreground/90">{right.title}</span>
            <span className="block truncate text-[11px] text-muted-foreground">
              {right.holder} · {right.acquisition} · {right.window}
            </span>
          </span>
          <span className="w-[32px] text-right text-muted-foreground tabular-nums">{right.share}</span>
          <span className="inline-flex w-[72px] items-center gap-1.5 text-foreground/80">
            <Dot tone={right.tone} /> {right.status}
          </span>
        </div>
      ))}
    </div>
  );
}

const EXPIRING = [
  { title: "Tote on plinth — retail OOH", who: "Brightloop", ends: "Ends in 12 days", fee: "$2,500" },
  { title: "Skyline hero — window displays", who: "Northwind", ends: "Ends in 21 days", fee: "$1,400" },
  { title: "Look 11 — lookbook reprint", who: "Atlas Coffee", ends: "In grace · 4 days", fee: "$2,300", grace: true },
];

// Cell: licences closing or in grace, with the renewal actions open.
export function RenewalsRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[460px]">
      <div className="overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card text-[12px] dark:bg-surface-subtle">
        <div className={cn("flex items-center gap-3 border-b px-4 py-2", LINE)}>
          <Segmented items={["Expiring", "In grace", "Expired", "History"]} active="Expiring" />
          <span className="ml-auto text-right">
            <span className="block text-[11px] text-muted-foreground">Revenue at risk</span>
            <span className="block text-[15px] leading-5 font-medium tabular-nums">$6.2k</span>
          </span>
        </div>
        {EXPIRING.map((licence) => (
          <div key={licence.title} className={cn("flex items-center gap-3 border-b px-4 py-2 last:border-b-0", LINE, licence.grace && "bg-foreground/[0.04]")}>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-foreground/90">{licence.title}</span>
              <span className="block truncate text-[11px] text-muted-foreground">{licence.who}</span>
            </span>
            <span className={cn("text-[11px]", licence.grace ? "text-red-600 dark:text-red-400" : "text-amber-700 dark:text-amber-300")}>{licence.ends}</span>
            <span className="w-[48px] text-right tabular-nums">{licence.fee}</span>
          </div>
        ))}
      </div>
      <div className={cn("absolute top-[194px] right-[12px] w-[200px] rounded-xl border border-foreground/[0.1] bg-surface-card p-1.5 text-[12px] shadow-2xl shadow-black/25 dark:bg-surface-dialog", styles.popIn)} style={{ "--pop-delay": "0.5s" }}>
        {[
          [RefreshCw, "Renew…", true],
          [CalendarPlus, "Extend grace 30 days"],
          [CircleSlash, "Mark lapsed"],
        ].map(([Icon, label, active]) => (
          <div key={label} className={cn("flex items-center gap-2 rounded-md px-2.5 py-1.5", active ? "bg-foreground/[0.07] text-foreground" : "text-foreground/80")}>
            <Icon className="size-3.5 text-muted-foreground" /> {label}
          </div>
        ))}
      </div>
    </div>
  );
}

const ROYALTIES = [
  { holder: "Hana Ito", basis: "LIC-2026-031", rate: "10%", amount: "$180.00", status: "Accrued", tone: "neutral" },
  { holder: "Hana Ito", basis: "LIC-2026-027", rate: "10%", amount: "$250.00", status: "On statement", tone: "amber" },
  { holder: "Hana Ito", basis: "LIC-2026-024", rate: "10%", amount: "$60.00", status: "Paid", tone: "emerald" },
];

// Cell: royalty lines owed to the lookbook's photographer.
export function RoyaltiesRender() {
  return (
    <div className="mx-auto w-[460px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card text-[12px] dark:bg-surface-subtle">
      <StatsRow className="rounded-none border-0 border-b">
        <StatCell label="Licence revenue" value="$42.6k" className="px-3 py-2.5 [&>span:nth-child(2)]:text-[16px]" />
        <StatCell label="Royalties accrued" value="$4.3k" className="px-3 py-2.5 [&>span:nth-child(2)]:text-[16px]" />
        <StatCell label="Owed to holders" value="$1.9k" className="px-3 py-2.5 [&>span:nth-child(2)]:text-[16px]" />
      </StatsRow>
      {ROYALTIES.map((line, index) => (
        <div key={line.basis} className={cn("flex items-center gap-3 border-b px-4 py-2.5 last:border-b-0", LINE, styles.popIn)} style={{ "--pop-delay": `${0.2 + index * 0.12}s` }}>
          <Avatar name={line.holder} size={20} />
          <span className="min-w-0 flex-1">
            <span className="block text-foreground/90">{line.holder}</span>
            <span className="block font-mono text-[10px] text-muted-foreground">
              {line.basis} · {line.rate}
            </span>
          </span>
          <span className="tabular-nums">{line.amount}</span>
          <span className="inline-flex w-[92px] items-center gap-1.5 text-foreground/80">
            <Dot tone={line.tone} /> {line.status}
          </span>
        </div>
      ))}
    </div>
  );
}

// Cell: Hana Ito's creator page with tiers, a tip button and a locked post.
export function CreatorRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[460px]">
      <Browser path="/c/hana-ito" className="absolute inset-x-0 top-[10px] pb-4">
        <div className="relative h-[64px] overflow-hidden">
          <Photo scene="skyline" className="absolute inset-0 size-full opacity-70" />
        </div>
        <div className="flex items-end gap-3 px-4">
          <Avatar name="Hana Ito" size={44} className="-mt-6 ring-2" />
          <span className="min-w-0 flex-1 pb-0.5">
            <span className="block text-[14px] leading-4 font-semibold">Hana Ito</span>
            <span className="block text-[11px] text-muted-foreground">Photographer · Harbour light</span>
          </span>
          <span className="flex gap-1.5 pb-0.5 text-[11px]">
            <span className="flex h-6 items-center rounded-md border border-foreground/[0.1] px-2">Follow</span>
            <span className="flex h-6 items-center gap-1 rounded-md bg-foreground px-2 font-medium text-background">
              <HandCoins className="size-3" /> Tip
            </span>
          </span>
        </div>
        <div className="grid grid-cols-[1fr_1fr_1.2fr] gap-2 px-4 pt-3">
          {[
            ["Follower", "Free", "Join for free"],
            ["Print club", "$25 one-time", "Join"],
          ].map(([tier, price, cta]) => (
            <div key={tier} className="rounded-lg border border-foreground/[0.1] p-2.5">
              <div className="text-[12px] font-medium">{tier}</div>
              <div className="text-[11px] text-muted-foreground">{price}</div>
              <div className="mt-2 flex h-6 items-center justify-center rounded-md border border-foreground/[0.12] text-[11px]">{cta}</div>
            </div>
          ))}
          <div className="relative overflow-hidden rounded-lg border border-foreground/[0.1]">
            <Photo scene="dusk" className="absolute inset-0 size-full opacity-60 blur-[2px]" />
            <div className="relative flex h-full flex-col items-center justify-center gap-1 p-2 text-center">
              <Lock className="size-3.5 text-foreground/80" />
              <span className="text-[11px] leading-tight font-medium">Behind the shot: 5am at the quay</span>
              <span className={cn("rounded-md bg-foreground px-2 py-0.5 text-[10px] font-medium text-background", styles.popIn)} style={{ "--pop-delay": "0.6s" }}>
                Unlock for $4
              </span>
            </div>
          </div>
        </div>
      </Browser>
    </div>
  );
}

