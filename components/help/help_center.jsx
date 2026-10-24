import { createElement } from "react";
import Link from "next/link";
import { Bot, Box, ChevronRight, Eye, Radio, Rocket, icons } from "lucide-react";
import PlaygroundFrame from "@/components/playground-frame";
import { GridBackdrop } from "@/components/grid-backdrop";
import { SANDBOX_APP_IDS } from "@/components/why-geiger/why_geiger_content";
import { HELP_APP_VIEWPORT, getHelpShowcase } from "@/lib/docs/showcases";
import { HelpHeader } from "@/components/help/help_header";
import { HelpNavTree } from "@/components/help/help_nav_tree";
import { HelpToc } from "@/components/help/help_toc";
import { ExplainMoreButton, HelpAskAi } from "@/components/help/help_ask_ai";
import { CopyPageButton } from "@/components/help/help_copy_page";

// Fixed panels sit under the header, which itself sits under the global notice banner when one is shown.
const belowHeader = "top-[calc(var(--geiger-banner-h,0px)_+_3.5rem)]";
// The sticky TOC pins level with the article's top padding (header 3.5rem + py-9).
const tocSticky = "top-[calc(var(--geiger-banner-h,0px)_+_5.75rem)] max-h-[calc(100vh_-_var(--geiger-banner-h,0px)_-_8rem)]";

// Section HTML comes from the Studio editor (Tiptap), styled like the blog article body.
const contentClassName =
  "text-[15px] leading-7 text-muted-foreground [&>*:first-child]:mt-0 [&_a]:font-medium [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:border-border-strong [&_blockquote]:pl-4 [&_code]:rounded [&_code]:bg-surface-card [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] [&_code]:text-foreground [&_h1]:mt-10 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:text-foreground [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:mt-8 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground [&_hr]:my-8 [&_hr]:border-border [&_img]:my-6 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-lg [&_img]:border [&_img]:border-border [&_li]:mt-1.5 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mt-4 [&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-border [&_pre]:bg-surface-subtle [&_pre]:p-4 [&_pre]:text-[13px] [&_pre]:leading-6 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6";

// Icon names are stored as lucide PascalCase ("UserPlus"); kebab-case is accepted too.
function HelpIcon({ name, fallback, ...props }) {
  const key = String(name || "").replace(/(^|[-_\s]+)([a-z0-9])/gi, (_, __, char) => char.toUpperCase());
  return createElement(icons[key] || fallback, props);
}

function RightSidebar({ page }) {
  return (
    <aside className={`docs-scrollbar-hidden sticky ${tocSticky} hidden w-56 shrink-0 self-start overflow-y-auto xl:block`}>
      {page.toc.length ? (
        <>
          <HelpToc links={page.toc} />
          <div className="my-4 border-t border-border" />
        </>
      ) : null}

      <div className="space-y-3">
        <CopyPageButton />
        <ExplainMoreButton pageTitle={page.title} />
      </div>
    </aside>
  );
}

// Painted backdrop for a live app, marked with a live badge; the app sits in a window, or straight on the painting when `floating`.
function PaintedStage({ floating = false, className = "", children }) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg border border-border bg-cover bg-center bg-no-repeat p-3 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:px-5 sm:py-8 ${className}`}
      style={{
        backgroundImage:
          "url('https://200rfrtp5x71tlmk.public.blob.vercel-storage.com/geiger-dash/cursor-assets/asset-00a586c62c8782e65c0a.jpg')",
      }}
    >
      <span
        title="Live, try it out. Changes reset on reload."
        className="absolute right-1.5 top-1.5 z-10 flex size-5 items-center justify-center rounded-full bg-black/50 text-emerald-400 backdrop-blur-sm"
      >
        <Radio className="size-3" aria-hidden />
        <span className="sr-only">Live demo, changes reset on reload</span>
      </span>
      {floating ? (
        children
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-background shadow-2xl dark:border-[#313131]">
          {children}
        </div>
      )}
    </div>
  );
}

// A page's `preview` names the suite app whose whole live sandbox (/<app>/playground) fills the hero; keep it to a home or overview page.
function ProductPreview({ app }) {
  return (
    <PaintedStage className="mt-5">
      <PlaygroundFrame src={`/${app}/playground`} title={`Geiger ${app} playground`} viewport={HELP_APP_VIEWPORT} />
    </PaintedStage>
  );
}

// One live component from an app, scoped to just that component; edits stay in the visitor's session.
function SectionShowcase({ id }) {
  const showcase = getHelpShowcase(id);
  if (!showcase) return null;

  return (
    <PaintedStage floating={showcase.floating}>
      <PlaygroundFrame
        src={showcase.src}
        title={`Geiger ${showcase.app}: ${showcase.label}`}
        viewport={showcase.viewport}
        loaderSize={48}
        transparent={showcase.floating}
      />
    </PaintedStage>
  );
}

function StartCard({ item }) {
  return (
    <Link
      href={item.href || "#"}
      className="group min-h-[160px] rounded-md border border-border bg-surface-card transition-colors hover:border-border-strong hover:bg-surface-active"
    >
      <div className="flex h-12 items-center gap-3 border-b border-border px-4">
        <HelpIcon name={item.icon} fallback={Rocket} className="size-4 text-muted-foreground" />
        <span className="text-sm font-semibold text-foreground">{item.title}</span>
      </div>
      <p className="px-4 pt-4 text-[15px] font-medium leading-6 text-foreground">{item.body}</p>
    </Link>
  );
}

function FeatureGrid({ features }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {features.map((item, index) => (
        <div
          key={`${item.text}-${index}`}
          className="flex items-center gap-3 rounded-md border border-border bg-surface-card p-3 transition-colors hover:border-border-strong hover:bg-surface-active"
        >
          <HelpIcon name={item.icon} fallback={Bot} className="size-4 shrink-0 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">{item.text}</span>
        </div>
      ))}
    </div>
  );
}

function SectionLinks({ links }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {links.map((item, index) => (
        <Link
          href={item.href || "#"}
          key={`${item.label}-${index}`}
          className="flex items-center justify-between rounded-md border border-border bg-surface-card p-4 text-sm font-semibold text-foreground transition-colors hover:border-border-strong hover:bg-surface-active"
        >
          <span className="flex items-center gap-2">
            <HelpIcon name={item.icon} fallback={Box} className="size-4 text-muted-foreground" />
            {item.label}
          </span>
          <ChevronRight className="size-4 text-text-secondary" />
        </Link>
      ))}
    </div>
  );
}

function HelpSection({ section }) {
  return (
    <section id={section.id} className="scroll-mt-20 pt-16">
      {section.eyebrow ? <p className="mb-2 text-sm text-muted-foreground">{section.eyebrow}</p> : null}
      {section.title ? <h2 className="text-[22px] font-medium tracking-tight text-foreground">{section.title}</h2> : null}
      <div className="mt-6 space-y-6">
        {section.content ? (
          <div className={contentClassName} dangerouslySetInnerHTML={{ __html: section.content }} />
        ) : null}
        {section.cards.length ? (
          <div className="grid gap-4 md:grid-cols-3">
            {section.cards.map((item, index) => (
              <StartCard key={`${item.title}-${index}`} item={item} />
            ))}
          </div>
        ) : null}
        {section.features.length ? <FeatureGrid features={section.features} /> : null}
        {section.links.length ? <SectionLinks links={section.links} /> : null}
        {section.showcase ? <SectionShowcase id={section.showcase} /> : null}
      </div>
    </section>
  );
}

export default function HelpCenter({ navigation, page }) {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-surface-strong selection:text-foreground">
      {/* Softened grid lines so they don't cut through the TOC links. */}
      <GridBackdrop className="blur-[1px]" />
      <HelpHeader navigation={navigation} activeSlug={page.slug} />

      {/* z-20 keeps the nav above <main>, which spans the full width under it at z-10. */}
      <aside className={`docs-scrollbar-hidden fixed bottom-0 left-0 z-20 ${belowHeader} hidden w-[280px] overflow-y-auto border-r border-border bg-surface-subtle px-5 py-6 lg:block`}>
        <HelpNavTree navigation={navigation} activeSlug={page.slug} />
      </aside>

      <main className="relative z-10 min-h-screen pt-14 text-foreground lg:pl-[280px]">
        {/* Article + TOC travel together; gap-14 + w-56 equals the left sidebar, so the article stays viewport-centred under the header search. */}
        <div className="mx-auto flex w-full max-w-[984px] justify-center gap-14 px-5 py-9 sm:px-0">
          <div className="w-full min-w-0 max-w-[704px]">
            {page.status !== "published" ? (
              <div className="mb-6 flex items-center gap-2 rounded-md border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-400">
                <Eye className="size-4 shrink-0" />
                {page.status === "archived" ? "Archived" : "Draft"} preview. Only Help Center editors can see this page.
              </div>
            ) : null}

            <article id="help-article">
              <p className="mb-2 text-sm text-muted-foreground">{page.groupTitle}</p>
              <h1 className="text-[30px] font-medium leading-tight tracking-tight text-foreground sm:text-[34px]">{page.title}</h1>
              {page.description ? (
                <p className="mt-8 max-w-[690px] text-[15px] font-medium leading-6 text-foreground">{page.description}</p>
              ) : null}

              {SANDBOX_APP_IDS.includes(page.preview) ? <ProductPreview app={page.preview} /> : null}

              {page.sections.map((section, index) => (
                <HelpSection key={section.id || index} section={section} />
              ))}
            </article>

            <div className="mt-12 flex gap-6 border-t border-border pt-6 xl:hidden">
              <CopyPageButton />
              <ExplainMoreButton pageTitle={page.title} />
            </div>
          </div>

          <RightSidebar page={page} />
        </div>
      </main>

      <HelpAskAi pageSlug={page.slug} />
    </div>
  );
}
