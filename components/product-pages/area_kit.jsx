import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@geiger/ui/table";
import { cn } from "@/lib/utils";
import { SessionHeader } from "@/components/session-header";
import Footer from "@/components/footer";
import { SessionLink } from "@/components/session-link";
import { PRIMARY_CTA, SECONDARY_CTA } from "@/components/landing/hero";
import { AREAS } from "@/components/product-pages/areas";
import { AppMark } from "@/components/product-pages/mock_kit";
import styles from "@/components/product-pages/product_pages.module.css";

// Building blocks for the product-area pages (/intake, /plan, /ai, /launch), modelled on Linear's product pages.
// Renders carry data-nosnippet so their sample names and prices never become search snippets or AI answers.

const CONTAINER = "mx-auto w-full max-w-6xl px-4 sm:px-6";
const HAIRLINE = "border-foreground/[0.08] dark:border-foreground/[0.09]";
// A hairline grid: cells sit on a 1px gap over this tint, so borders stay right at every column count.
const HAIRLINE_GRID = "-mx-4 grid gap-px overflow-hidden border-y bg-foreground/[0.08] sm:mx-0 sm:rounded-xl sm:border dark:bg-foreground/[0.09]";

// Links into another suite app are rewrites to a different deployment, so they must be full page loads.
function SmartLink({ href, className, children }) {
  if (href.startsWith("/") && !/^\/(flow|notes|forms|form|events|campaign|content|grey|comms|assets|pods|property)(\/|$)/.test(href)) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

// `links` swaps the closing nav for another family of pages (audiences, an app's tour); it defaults to the four areas.
export function AreaPage({ area, links, linksLabel, children }) {
  return (
    <div className={cn(styles.page, "flex min-h-screen w-full flex-col overflow-x-clip bg-background font-sans text-foreground antialiased")}>
      <SessionHeader />
      <main className="flex flex-1 flex-col">{children}</main>
      <AreaLinks current={area} items={links} label={linksLabel} />
      <AreaClosing />
      <Footer />
    </div>
  );
}

// The opening shot: a tilted, half-focused render of the product behind the page's headline, pitch and next steps.
// `page` is an entry from tours.js or areas.js; an app tour's page also names its app for the eyebrow.
export function AreaHero({ page, art }) {
  return (
    <section className={cn("relative isolate flex min-h-[40rem] flex-col overflow-hidden border-b sm:min-h-[44rem] lg:min-h-[48rem]", HAIRLINE)}>
      <div className={cn("absolute inset-0 -z-10", styles.heroEnter)}>{art}</div>
      <div className={cn(CONTAINER, "flex flex-1 flex-col justify-end pt-48 pb-14 sm:pt-56 sm:pb-20 lg:pt-44 lg:pb-28")}>
        <div className="sm:px-8">
          <div className={styles.blurIn} style={{ "--delay": "0.2s" }}>
            <HeroEyebrow page={page} />
          </div>
          <h1
            className={cn("mt-5 max-w-[17ch] text-[2.75rem] leading-none font-medium tracking-[-0.032em] text-balance sm:text-6xl lg:text-[4.5rem]", styles.blurIn)}
            style={{ "--delay": "0.3s" }}
          >
            {page.headline}
          </h1>
          <div className={styles.blurIn} style={{ "--delay": "0.45s" }}>
            <p className="mt-6 max-w-[34rem] text-[17px] leading-relaxed text-pretty text-foreground/70 sm:text-lg">{page.description}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <SessionLink label="Get started" signedInLabel="Open your workspace" className={PRIMARY_CTA}>
                <ArrowRight className="h-4 w-4" />
              </SessionLink>
              <Link href="/pricing" className={SECONDARY_CTA}>
                See pricing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// An app tour links back to its app; every other page names its family, marked like the feature cards on /features.
function HeroEyebrow({ page }) {
  if (page.app) {
    return (
      <p className="flex flex-wrap items-center gap-2 text-[14px] text-muted-foreground">
        <SmartLink href={`/${page.app}`} className="inline-flex items-center gap-2 font-medium text-foreground/85 transition-colors hover:text-foreground">
          <AppMark id={page.app} size={22} />
          {page.appName}
        </SmartLink>
        <ChevronRight aria-hidden="true" className="size-3.5 text-foreground/30" />
        {page.label}
      </p>
    );
  }
  return (
    <p className="flex items-center gap-2 text-[14px] font-medium text-muted-foreground">
      <span aria-hidden="true" className="h-2 w-3.5 shrink-0 rounded-full border border-text-tertiary" />
      {page.label}
    </p>
  );
}

// A focus-pulled render of `children` on a tilted plane; `focus` is the sharp spot as [x, y] percentages of the hero.
export function HeroArt({ children, focus = ["60%", "34%"], plane }) {
  const vars = { "--focus-x": focus[0], "--focus-y": focus[1], ...plane };
  return (
    <div aria-hidden="true" data-nosnippet className={styles.heroArt} style={vars}>
      <div className={cn(styles.heroLayer, styles.heroBlur)}>
        <div className={styles.heroPlane}>{children}</div>
      </div>
      <div className={cn(styles.heroLayer, styles.heroSharp)}>
        <div className={styles.heroPlane}>{children}</div>
      </div>
      <div className={styles.heroShade} />
    </div>
  );
}

// A chapter of the page: headline left, a lead and a link right, then its stages and grids.
export function AreaSection({ id, title, lead, link, children }) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-title` : undefined} className={cn(CONTAINER, "py-24 sm:py-32")}>
      <header className="grid gap-6 pb-14 sm:pb-20 lg:grid-cols-2 lg:gap-0 lg:pb-24">
        <h2 id={id ? `${id}-title` : undefined} className="max-w-[17ch] text-[2.5rem] leading-[1.02] font-medium tracking-[-0.03em] text-balance sm:px-8 sm:text-5xl">
          {title}
        </h2>
        <div className="sm:px-8">
          <p className="max-w-[35rem] text-xl leading-[1.35] tracking-[-0.012em] text-pretty text-foreground/80 sm:text-2xl">{lead}</p>
          {link ? (
            <SmartLink
              href={link.href}
              className="group mt-6 inline-flex items-center gap-1.5 text-[15px] text-muted-foreground transition-colors hover:text-foreground sm:mt-8"
            >
              {link.label}
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </SmartLink>
          ) : null}
        </div>
      </header>
      <div className="flex flex-col gap-12">{children}</div>
    </section>
  );
}

function Caption({ title, body }) {
  return (
    <figcaption className="relative z-[2] bg-background px-4 py-8 sm:p-8">
      <h3 className="text-[15px] leading-6 font-medium text-foreground">{title}</h3>
      <p className="max-w-[38rem] text-[15px] leading-6 text-pretty text-muted-foreground">{body}</p>
    </figcaption>
  );
}

// The big spotlit panel: a composed render that runs off its bottom edge into a caption strip.
export function Stage({ title, body, plain = false, className, children }) {
  return (
    <figure className={cn("-mx-4 overflow-hidden border-y sm:mx-0 sm:rounded-xl sm:border-0", HAIRLINE, styles.edge)}>
      {/* On phones a stage keeps its renders at half size or more and crops the edges, rather than shrinking them to unreadable. */}
      <div
        aria-hidden="true"
        data-nosnippet
        className={cn("relative overflow-hidden px-4 pt-12 select-none sm:px-8 sm:pt-20 lg:pt-24", plain ? "bg-surface-subtle/40" : styles.spotlight, className)}
        style={{ "--fit-min": 0.5 }}
      >
        <div className={cn(styles.fadeBottom, styles.reveal)}>{children}</div>
      </div>
      <Caption title={title} body={body} />
    </figure>
  );
}

// Two-up hairline grid of smaller renders, each with its own caption.
export function FeatureGrid({ children }) {
  return <div className={cn("-mx-4 grid overflow-hidden border-y sm:mx-0 sm:rounded-xl sm:border lg:grid-cols-2", HAIRLINE)}>{children}</div>;
}

export function FeatureCell({ title, body, className, children }) {
  return (
    <figure className={cn("flex flex-col border-b last:border-b-0 lg:odd:border-r lg:[&:nth-last-child(-n+2)]:border-b-0", HAIRLINE)}>
      <div aria-hidden="true" data-nosnippet className={cn("relative flex flex-1 items-center overflow-hidden px-4 pt-10 pb-2 select-none sm:px-8 sm:pt-14", className)}>
        <div className={cn("w-full", styles.reveal)}>{children}</div>
      </div>
      <Caption title={title} body={body} />
    </figure>
  );
}

// Linear's tabbed panel, held still: a list of capabilities with one in focus, and the render for it alongside.
export function SplitShowcase({ items, active = 0, title, body, children }) {
  return (
    <figure className={cn("-mx-4 overflow-hidden border-y sm:mx-0 sm:rounded-xl sm:border-0", HAIRLINE, styles.edge)}>
      <div aria-hidden="true" data-nosnippet className="grid gap-8 bg-surface-subtle/40 px-4 py-10 select-none sm:px-8 sm:py-14 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-12 lg:py-16 dark:bg-foreground/[0.015]">
        <ul className="flex flex-col gap-1">
          {items.map((item, index) => (
            <li key={item.title} className={cn("rounded-lg px-5 py-4", index === active ? "bg-foreground/[0.05]" : "opacity-70")}>
              <span className="block font-mono text-[12px] tracking-[0.06em] text-foreground uppercase">{item.title}</span>
              <span className="mt-1.5 block font-mono text-[12px] leading-5 tracking-[0.04em] text-muted-foreground uppercase">{item.body}</span>
            </li>
          ))}
        </ul>
        <div className={cn("min-w-0", styles.reveal)}>{children}</div>
      </div>
      {title ? <Caption title={title} body={body} /> : null}
    </figure>
  );
}

// A centred diagram with mono callouts either side, like Linear's GitHub integration panel.
export function CalloutStage({ left = [], right = [], title, body, children }) {
  const callout = (item, align) => (
    <div key={item.title} className={cn("max-w-[16rem]", align === "right" ? "lg:ml-auto lg:text-right" : "")}>
      <span className="block font-mono text-[12px] tracking-[0.06em] text-foreground uppercase">{item.title}</span>
      <span className="mt-2 block font-mono text-[12px] leading-5 tracking-[0.04em] text-muted-foreground uppercase">{item.body}</span>
    </div>
  );
  return (
    <figure className={cn("-mx-4 overflow-hidden border-y sm:mx-0 sm:rounded-xl sm:border-0", HAIRLINE, styles.edge)}>
      <div className="grid items-center gap-10 bg-surface-subtle/40 px-4 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1fr_auto_1fr] lg:gap-12 lg:py-28 dark:bg-foreground/[0.015]">
        <div className="order-2 flex flex-col gap-10 lg:order-1">{left.map((item) => callout(item, "right"))}</div>
        <div aria-hidden="true" data-nosnippet className={cn("order-1 select-none lg:order-2", styles.reveal)}>
          {children}
        </div>
        <div className="order-3 flex flex-col gap-10">{right.map((item) => callout(item, "left"))}</div>
      </div>
      {title ? <Caption title={title} body={body} /> : null}
    </figure>
  );
}

// Scales a fixed-size composition down to the width it gets, without JavaScript; `max` caps upscaling.
export function Fit({ width, height, max = 1, className, children }) {
  return (
    <div className={styles.fit}>
      <div className={styles.fitSizer} style={{ "--w": `${width}px`, "--h": `${height}px`, "--max": max }}>
        <div className={cn(styles.fitInner, className)}>{children}</div>
      </div>
    </div>
  );
}

// Linear's closing nav: a family of pages side by side, each a headline over its label.
export function AreaLinks({ current, items = AREAS, label = "Product areas", external = false }) {
  return (
    <nav aria-label={label} className={cn("border-t", HAIRLINE)}>
      <ul className={cn(CONTAINER, "grid gap-y-12 py-24 sm:grid-cols-2 sm:py-32", items.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4")}>
        {items.map((area, index) => {
          const isCurrent = area.id === current;
          const className = "group flex h-full flex-col justify-between gap-10 sm:px-8 sm:gap-16";
          const body = (
            <>
              <span className="max-w-[14ch] text-2xl leading-[1.25] font-medium tracking-[-0.015em] text-balance text-foreground">{area.headline}</span>
              <span className="inline-flex items-center gap-1.5 text-[15px] text-muted-foreground transition-colors group-hover:text-foreground">
                {area.label}
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </>
          );
          return (
            <li key={area.id} className={cn("border-l-0 sm:border-l", HAIRLINE, index % 2 === 0 && "sm:border-l-0 lg:border-l", index === 0 && "lg:border-l-0")}>
              {external ? (
                <a href={area.href} aria-current={isCurrent ? "page" : undefined} className={className}>
                  {body}
                </a>
              ) : (
                <Link href={area.href} aria-current={isCurrent ? "page" : undefined} className={className}>
                  {body}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// Text blocks for the facts a page has to state plainly: real text a reader or a search engine can quote, unlike the renders.

// Key facts side by side, label over value, with an optional line underneath such as when they were checked.
export function FactList({ items, note, className }) {
  return (
    <div>
      <dl className={cn(HAIRLINE_GRID, "sm:grid-cols-2 lg:grid-cols-4", className)}>
        {items.map((item) => (
          <div key={item.label} className="flex flex-col gap-1.5 bg-background px-4 py-7 sm:px-8 sm:py-8">
            <dt className="text-[13px] text-muted-foreground">{item.label}</dt>
            <dd className="text-xl leading-7 font-medium tracking-[-0.012em] text-foreground">{item.value}</dd>
            {item.detail ? <dd className="text-[15px] leading-6 text-pretty text-muted-foreground">{item.detail}</dd> : null}
          </div>
        ))}
      </dl>
      {note ? <p className="mt-4 text-[13px] leading-5 text-muted-foreground sm:px-8">{note}</p> : null}
    </div>
  );
}

// A cell is plain text, or { label, href } for a link to the page that covers it.
function SpecCell({ value }) {
  if (value && typeof value === "object") {
    return (
      <SmartLink href={value.href} className="underline decoration-foreground/25 underline-offset-4 transition-colors hover:decoration-foreground">
        {value.label}
      </SmartLink>
    );
  }
  return value;
}

// A titled table of rows; `numeric` right-aligns the last column for amounts.
export function SpecTable({ title, head = ["Feature", "What it does"], rows, numeric = false, note }) {
  const last = head.length - 1;
  return (
    <div>
      <div className={cn("-mx-4 overflow-hidden border-y sm:mx-0 sm:rounded-xl sm:border", HAIRLINE)}>
        {title ? <h3 className="px-4 pt-7 pb-4 text-lg leading-7 font-medium tracking-[-0.012em] text-foreground sm:px-8">{title}</h3> : null}
        <Table className="text-[15px]">
          <TableHeader className="bg-transparent">
            <TableRow className={HAIRLINE}>
              {head.map((label, index) => (
                <TableHead
                  key={label || index}
                  className={cn("h-auto px-4 py-3 text-[13px] font-normal text-muted-foreground sm:px-8", index === 0 && !numeric && "w-[38%]", numeric && index === last && "text-right")}
                >
                  {label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={rowIndex} className={cn("hover:bg-transparent", HAIRLINE)}>
                {row.map((cell, index) => (
                  <TableCell
                    key={index}
                    className={cn(
                      "px-4 py-4 align-top leading-6 whitespace-normal sm:px-8",
                      index === 0 ? "font-medium text-foreground" : "text-pretty text-muted-foreground",
                      numeric && index === last && "text-right text-foreground tabular-nums",
                    )}
                  >
                    <SpecCell value={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {note ? <p className="mt-4 text-[13px] leading-5 text-muted-foreground sm:px-8">{note}</p> : null}
    </div>
  );
}

// Short titled paragraphs in a hairline grid, for the kinds of events or teams a page serves.
export function TextCards({ items }) {
  return (
    <div className={cn(HAIRLINE_GRID, "sm:grid-cols-2 lg:grid-cols-4")}>
      {items.map((item) => (
        <div key={item.title} className="flex flex-col gap-2 bg-background px-4 py-8 sm:px-8">
          <h3 className="text-[15px] leading-6 font-medium text-foreground">{item.title}</h3>
          <p className="text-[15px] leading-6 text-pretty text-muted-foreground">{item.body}</p>
        </div>
      ))}
    </div>
  );
}

// Questions and answers, all open: question left, answer right on wide screens.
export function FaqList({ items }) {
  return (
    <div className={cn("-mx-4 divide-y border-y sm:mx-0 sm:rounded-xl sm:border", HAIRLINE, "divide-foreground/[0.08] dark:divide-foreground/[0.09]")}>
      {items.map((item) => (
        <div key={item.question} className="grid gap-3 px-4 py-8 sm:px-8 lg:grid-cols-2 lg:gap-12">
          <h3 className="text-lg leading-7 font-medium tracking-[-0.012em] text-balance text-foreground">{item.question}</h3>
          <p className="max-w-[38rem] text-[15px] leading-6 text-pretty text-muted-foreground">{item.answer}</p>
        </div>
      ))}
    </div>
  );
}

export function AreaClosing() {
  return (
    <section className={cn("border-t", HAIRLINE)}>
      <div className={cn(CONTAINER, "flex flex-col items-center py-28 text-center sm:py-40")}>
        <h2 className="text-[2.75rem] leading-none font-medium tracking-[-0.032em] text-balance sm:text-6xl lg:text-7xl">
          One account.
          <br />
          Every app, ready today.
        </h2>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <SessionLink label="Get started" signedInLabel="Open your workspace" className={PRIMARY_CTA}>
            <ArrowRight className="h-4 w-4" />
          </SessionLink>
          <Link href="/pricing" className={SECONDARY_CTA}>
            See pricing
          </Link>
        </div>
      </div>
    </section>
  );
}
