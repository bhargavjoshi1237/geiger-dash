import Image from "next/image";
import Link from "next/link";
import {
  Bot,
  Box,
  ChevronRight,
  CircleDollarSign,
  Clipboard,
  Code2,
  Command,
  GitPullRequestArrow,
  Mail,
  MessageSquareText,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import ClientAssetsPlayground from "@/components/assets-playground/ClientAssetsPlayground";
import { defaultDocsNavigation, getFallbackDocsPage } from "@/lib/docs/default-content";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const actionLinks = [
  { icon: Clipboard, label: "Copy page" },
  { icon: Mail, label: "Share feedback" },
  { icon: MessageSquareText, label: "Explain more" },
];

const iconMap = {
  Bot,
  Box,
  CircleDollarSign,
  Code2,
  GitPullRequestArrow,
  Rocket,
  ShieldCheck,
  Sparkles,
  WandSparkles,
};

const topTabs = [
  { label: "Docs", href: "/docs", match: (slug) => !["api", "help"].includes(slug) },
  { label: "API", href: "/docs/api", match: (slug) => slug === "api" },
  { label: "Help", href: "/docs/help", match: (slug) => slug === "help" },
];

function DocsTopBar({ activeSlug }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-14 border-b border-border bg-background/95 text-white backdrop-blur">
      <div className="flex h-full items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex h-full min-w-0 items-center gap-6">
          <Link href="/" className="flex min-w-0 items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md  ">
            <Image src={`${basePath}/logo1.svg`} alt="Geiger logo" width={20} height={20} className="h-5 w-5" />
            </span>
            <span className="hidden border-l border-border pl-3 text-sm font-semibold text-white sm:block">
              Geiger Docs
            </span>
          </Link>

          <nav className="hidden h-full items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
            {topTabs.map((item) => {
              const isActive = item.match(activeSlug);
              return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex h-full items-center border-b-2 transition-colors ${
                  isActive
                    ? "border-white text-white"
                    : "border-transparent hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            )})}
          </nav>
        </div>

        <div className="hidden flex-1 justify-center lg:flex">
          <div className="group flex h-8 w-full max-w-[430px] items-center gap-2 rounded-md border border-border bg-surface-card px-3 text-sm text-muted-foreground shadow-sm transition-colors hover:border-border-strong hover:bg-surface-active">
            <Search className="h-4 w-4" />
            <span className="flex-1">Search docs...</span>
            <kbd className="rounded border border-border bg-surface-subtle px-1.5 py-0.5 text-[11px] text-muted-foreground transition-colors group-hover:bg-surface-hover group-hover:text-foreground">
              <Command className="mr-0.5 inline h-3 w-3" />K
            </kbd>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="hidden h-8 items-center gap-3 rounded-md border border-border bg-surface-card px-3 text-sm font-medium text-muted-foreground transition-colors hover:border-border-strong hover:bg-surface-active hover:text-foreground md:flex">
            <span>Ask AI</span>
            <kbd className="rounded border border-border bg-surface-subtle px-1.5 py-0.5 text-[11px] text-muted-foreground">
              Cmd I
            </kbd>
          </button>
          <Link
            href="/login"
            className="hidden h-8 items-center rounded-md border border-transparent px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground sm:flex"
          >
            Sign in
          </Link>
          <Link
            href="#download"
            className="h-8 rounded-md bg-white px-4 text-sm font-medium leading-8 text-black transition-colors hover:bg-[#e5e5e5]"
          >
            Download
          </Link>
        </div>
      </div>
    </header>
  );
}

function LeftSidebar({ navigation, activeSlug }) {
  return (
    <aside className="docs-scrollbar-hidden fixed bottom-0 left-0 top-14 hidden w-[280px] overflow-y-auto border-r border-border bg-background px-6 py-6 lg:block">
      <nav className="space-y-8">
        {navigation.map((section) => (
          <div key={section.title}>
            <p className="mb-3 text-xs font-medium uppercase text-text-secondary">{section.title}</p>
            <div className="space-y-1">
              {section.links.map((link) => {
                const isActive = link.slug === activeSlug;
                return (
                <Link
                  href={link.href}
                  key={`${section.title}-${link.label}`}
                  className={`flex items-center justify-between rounded-md px-2 py-1.5 text-sm font-medium leading-5 transition-colors ${
                    isActive ? "bg-surface-card text-white" : "text-muted-foreground hover:bg-surface-card hover:text-foreground"
                  }`}
                >
                  <span>{link.label}</span>
                  {link.chevron ? <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" /> : null}
                </Link>
              )})}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}

function RightSidebar({ toc }) {
  return (
    <aside className="docs-scrollbar-hidden fixed bottom-0 right-0 top-14 hidden w-[280px] overflow-y-auto bg-background px-6 py-8 xl:block">
      <div className="border-l border-border pl-5">
        <p className="mb-4 text-xs font-medium uppercase text-text-secondary">On this page</p>
        <div className="space-y-4 text-sm">
          {toc.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block transition-colors hover:text-foreground ${
                index === 0 ? "text-muted-foreground" : "text-text-secondary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="my-5 h-px w-full bg-surface-hover" />

        <div className="space-y-4">
          {actionLinks.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                className="flex items-center gap-2 text-sm font-medium text-text-secondary transition-colors hover:text-foreground"
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{action.label}</span>
              </button>
            );
          })}
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
      <div className="h-full w-full overflow-hidden rounded-lg border border-[#313131] bg-background shadow-2xl">
        <div className="h-[142.857%] w-[142.857%] origin-top-left scale-[0.7]">
          <ClientAssetsPlayground />
        </div>
      </div>
    </div>
  );
}

function StartCard({ item }) {
  const Icon = iconMap[item.icon] || Rocket;

  return (
    <Link
      href={item.href}
      className="group min-h-[160px] rounded-md border border-border bg-surface-card transition-colors hover:border-border-strong hover:bg-surface-active"
    >
      <div className="flex h-12 items-center gap-3 border-b border-border px-4">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-semibold text-white">{item.title}</span>
      </div>
      <p className="px-4 pt-4 text-[15px] font-medium leading-6 text-[#e5e5e5]">{item.body}</p>
    </Link>
  );
}

function ContentSection({ id, eyebrow, title, children }) {
  return (
    <section id={id} className="pt-12">
      <p className="mb-3 text-sm text-muted-foreground">{eyebrow}</p>
      <h2 className="text-2xl font-semibold text-white">{title}</h2>
      <div className="mt-4 space-y-4 text-[15px] leading-7 text-muted-foreground">{children}</div>
    </section>
  );
}

function FeatureGrid({ features }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {features.map((item) => {
        const Icon = iconMap[item.icon] || Bot;
        return (
          <div
            key={item.text}
            className="flex items-center gap-3 rounded-md border border-border bg-surface-card p-3 transition-colors hover:border-border-strong hover:bg-surface-active"
          >
            <Icon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-[#e5e5e5]">{item.text}</span>
          </div>
        );
      })}
    </div>
  );
}

function ProductLinks({ links }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {links.map((item) => {
        const Icon = iconMap[item.icon] || Box;
        return (
          <Link
            href={item.href || "#"}
            key={item.label}
            className="flex items-center justify-between rounded-md border border-border bg-surface-card p-4 text-sm font-semibold text-[#e5e5e5] transition-colors hover:border-border-strong hover:bg-surface-active hover:text-foreground"
          >
            <span className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-muted-foreground" />
              {item.label}
            </span>
            <ChevronRight className="h-4 w-4 text-text-secondary" />
          </Link>
        );
      })}
    </div>
  );
}

function DocsBlock({ block }) {
  return (
    <ContentSection id={block.id} eyebrow={block.eyebrow} title={block.title}>
      {block.body?.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      {block.cards?.length ? (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {block.cards.map((item) => (
            <StartCard key={item.title} item={item} />
          ))}
        </div>
      ) : null}
      {block.features?.length ? <FeatureGrid features={block.features} /> : null}
      {block.links?.length ? <ProductLinks links={block.links} /> : null}
    </ContentSection>
  );
}

export default function DocsWidget({
  navigation = defaultDocsNavigation,
  page = getFallbackDocsPage("welcome"),
}) {
  const toc = page.toc?.length ? page.toc : [{ label: "Overview", href: "#overview" }];

  return (
    <>
      <DocsTopBar activeSlug={page.slug} />
      <LeftSidebar navigation={navigation} activeSlug={page.slug} />
      <RightSidebar toc={toc} />

      <main className="min-h-screen bg-background pt-14 text-white lg:pl-[280px] xl:pr-[280px]">
        <div className="mx-auto w-full max-w-[704px] px-5 py-9 sm:px-0">
          <div className="docs-scrollbar-hidden mb-6 flex gap-2 overflow-x-auto pb-2 lg:hidden">
            {navigation.flatMap((section) =>
              section.links.slice(0, 3).map((link) => ({ ...link, section: section.title })),
            ).map((link) => (
              <Link
                href={link.href}
                key={`mobile-${link.section}-${link.label}`}
                className={`shrink-0 rounded-md border border-border px-3 py-1.5 text-sm font-medium ${
                  link.slug === page.slug ? "bg-white text-black" : "bg-surface-card text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <article>
            <p className="mb-3 text-sm font-medium text-muted-foreground">{page.groupTitle}</p>
            <h1 className="text-[34px] font-semibold leading-tight text-white sm:text-[36px]">
              {page.title}
            </h1>
            <p className="mt-9 max-w-[690px] text-[15px] font-medium leading-6 text-[#e5e5e5]">
              {page.description}
            </p>

            {page.preview === "assets" ? <ProductPreview /> : null}

            {page.blocks.map((block) => (
              <DocsBlock key={block.id || block.title} block={block} />
            ))}
          </article>
        </div>
      </main>
    </>
  );
}
