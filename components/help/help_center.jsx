import { createElement } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bot, Box, ChevronRight, Eye, Rocket, icons } from "lucide-react";
import PlaygroundFrame from "@/components/playground-frame";
import { HelpNavTree } from "@/components/help/help_nav_tree";
import { HelpMobileNav } from "@/components/help/help_mobile_nav";
import { HelpSearch } from "@/components/help/help_search";
import { AskAiButton, ExplainMoreButton, HelpAskAi } from "@/components/help/help_ask_ai";
import { CopyPageButton } from "@/components/help/help_copy_page";
import { HELP_BASE_PATH } from "@/lib/docs/paths";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const siteLinks = [
  { label: "Help Center", href: HELP_BASE_PATH },
  { label: "Changelog", href: "/changelog" },
  { label: "Blog", href: "/blog" },
];

// Section HTML comes from the Studio editor (Tiptap), styled like the blog article body.
const contentClassName =
  "text-[15px] leading-7 text-muted-foreground [&>*:first-child]:mt-0 [&_a]:font-medium [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:border-border-strong [&_blockquote]:pl-4 [&_code]:rounded [&_code]:bg-surface-card [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] [&_code]:text-foreground [&_h1]:mt-10 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:text-foreground [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:mt-8 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground [&_hr]:my-8 [&_hr]:border-border [&_img]:my-6 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-lg [&_img]:border [&_img]:border-border [&_li]:mt-1.5 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mt-4 [&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-border [&_pre]:bg-surface-subtle [&_pre]:p-4 [&_pre]:text-[13px] [&_pre]:leading-6 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6";

// Icon names are stored as lucide PascalCase ("UserPlus"); kebab-case is accepted too.
function HelpIcon({ name, fallback, ...props }) {
  const key = String(name || "").replace(/(^|[-_\s]+)([a-z0-9])/gi, (_, __, char) => char.toUpperCase());
  return createElement(icons[key] || fallback, props);
}

function HelpTopBar({ navigation, activeSlug }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-14 border-b border-border bg-background/95 text-foreground backdrop-blur">
      <div className="flex h-full items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex h-full min-w-0 items-center gap-3 lg:gap-6">
          <HelpMobileNav navigation={navigation} activeSlug={activeSlug} />
          <Link href={HELP_BASE_PATH} className="flex min-w-0 items-center gap-2">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-md">
              <Image src={`${basePath}/logo1.svg`} alt="Geiger logo" width={20} height={20} className="geiger-logo size-5" />
            </span>
            <span className="hidden border-l border-border pl-3 text-sm font-semibold text-foreground sm:block">
              Help Center
            </span>
          </Link>

          <nav className="hidden h-full items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
            {siteLinks.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex h-full items-center border-b-2 transition-colors ${
                  index === 0 ? "border-foreground text-foreground" : "border-transparent hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end lg:justify-center">
          <HelpSearch navigation={navigation} />
        </div>

        <div className="flex items-center gap-2">
          <AskAiButton />
          <Link
            href="/login"
            className="hidden h-8 items-center rounded-md border border-transparent px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground sm:flex"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="h-8 shrink-0 rounded-md bg-primary px-4 text-sm font-medium leading-8 text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}

function RightSidebar({ page }) {
  return (
    <aside className="docs-scrollbar-hidden fixed bottom-0 right-0 top-14 hidden w-[280px] overflow-y-auto bg-background px-6 py-8 xl:block">
      <div className="border-l border-border pl-5">
        {page.toc.length ? (
          <>
            <p className="mb-4 text-xs font-medium uppercase text-text-secondary">On this page</p>
            <div className="space-y-4 text-sm">
              {page.toc.map((link) => (
                <Link key={link.href} href={link.href} className="block text-text-secondary transition-colors hover:text-foreground">
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="my-5 h-px w-full bg-surface-hover" />
          </>
        ) : null}

        <div className="space-y-4">
          <CopyPageButton />
          <ExplainMoreButton pageTitle={page.title} />
        </div>
      </div>
    </aside>
  );
}

function ProductPreview() {
  return (
    <div
      className="relative mt-10 aspect-[704/411] overflow-hidden rounded-lg border border-border bg-cover bg-center bg-no-repeat p-2 shadow-[0_24px_80px_rgba(0,0,0,0.35)] [&_*]:[-ms-overflow-style:none] [&_*]:[scrollbar-width:none] [&_*::-webkit-scrollbar]:hidden sm:p-3"
      style={{
        backgroundImage:
          "url('https://200rfrtp5x71tlmk.public.blob.vercel-storage.com/geiger-dash/cursor-assets/asset-00a586c62c8782e65c0a.jpg')",
      }}
    >
      <div className="h-full w-full overflow-hidden rounded-lg border border-border bg-background shadow-2xl dark:border-[#313131]">
        <div className="h-[142.857%] w-[142.857%] origin-top-left scale-[0.7]">
          <PlaygroundFrame src="/assets/playground" title="Geiger Assets playground" />
        </div>
      </div>
    </div>
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
    <section id={section.id} className="scroll-mt-20 pt-12">
      {section.eyebrow ? <p className="mb-3 text-sm text-muted-foreground">{section.eyebrow}</p> : null}
      {section.title ? <h2 className="text-2xl font-semibold text-foreground">{section.title}</h2> : null}
      <div className="mt-4 space-y-6">
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
      </div>
    </section>
  );
}

export default function HelpCenter({ navigation, page }) {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-surface-strong selection:text-foreground">
      <HelpTopBar navigation={navigation} activeSlug={page.slug} />

      <aside className="docs-scrollbar-hidden fixed bottom-0 left-0 top-14 hidden w-[280px] overflow-y-auto border-r border-border bg-background px-6 py-6 lg:block">
        <HelpNavTree navigation={navigation} activeSlug={page.slug} />
      </aside>

      <RightSidebar page={page} />

      <main className="min-h-screen bg-background pt-14 text-foreground lg:pl-[280px] xl:pr-[280px]">
        <div className="mx-auto w-full max-w-[704px] px-5 py-9 sm:px-0">
          {page.status !== "published" ? (
            <div className="mb-6 flex items-center gap-2 rounded-md border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-400">
              <Eye className="size-4 shrink-0" />
              {page.status === "archived" ? "Archived" : "Draft"} preview. Only Help Center editors can see this page.
            </div>
          ) : null}

          <article id="help-article">
            <p className="mb-3 text-sm font-medium text-muted-foreground">{page.groupTitle}</p>
            <h1 className="text-[34px] font-semibold leading-tight text-foreground sm:text-[36px]">{page.title}</h1>
            {page.description ? (
              <p className="mt-9 max-w-[690px] text-[15px] font-medium leading-6 text-foreground">{page.description}</p>
            ) : null}

            {page.preview === "assets" ? <ProductPreview /> : null}

            {page.sections.map((section, index) => (
              <HelpSection key={section.id || index} section={section} />
            ))}
          </article>

          <div className="mt-12 flex gap-6 border-t border-border pt-6 xl:hidden">
            <CopyPageButton />
            <ExplainMoreButton pageTitle={page.title} />
          </div>
        </div>
      </main>

      <HelpAskAi pageSlug={page.slug} />
    </div>
  );
}
