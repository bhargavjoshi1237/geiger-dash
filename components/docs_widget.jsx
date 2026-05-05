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

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const navigation = [
  {
    title: "Get Started",
    links: [
      { label: "Welcome", active: true },
      { label: "Quickstart" },
      { label: "Plans & Pricing", chevron: true },
      { label: "Changelog" },
    ],
  },
  {
    title: "Agent",
    links: [
      { label: "Overview" },
      { label: "Agents Window" },
      { label: "Agent Review" },
      { label: "Planning" },
      { label: "Prompting" },
      { label: "Debugging" },
      { label: "Tools", chevron: true },
      { label: "Security" },
    ],
  },
  {
    title: "Customizing",
    links: [
      { label: "Plugins" },
      { label: "Rules" },
      { label: "Skills" },
      { label: "Subagents" },
      { label: "Hooks" },
      { label: "MCP" },
    ],
  },
  {
    title: "Cloud Agents",
    links: [
      { label: "Overview" },
      { label: "Setup" },
      { label: "Capabilities" },
      { label: "My Machines" },
      { label: "Self-Hosted Pool" },
      { label: "Bugbot" },
    ],
  },
];

const startCards = [
  {
    icon: Rocket,
    title: "Get started",
    body: "Go from install to your first useful change in Geiger",
    href: "#get-started",
  },
  {
    icon: CircleDollarSign,
    title: "Plans & Pricing",
    body: "Compare plans, usage pools, and team pricing",
    href: "/pricing",
  },
  {
    icon: Sparkles,
    title: "Changelog",
    body: "Stay up to date with the latest features and improvements",
    href: "/changelog",
  },
];

const rightLinks = ["Start here", "What you can do with Geiger", "Products", "More resources"];
const actionLinks = [
  { icon: Clipboard, label: "Copy page" },
  { icon: Mail, label: "Share feedback" },
  { icon: MessageSquareText, label: "Explain more" },
];

function DocsTopBar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-14 border-b border-[#2a2a2a] bg-[#161616] text-white">
      <div className="flex h-full items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex h-full min-w-0 items-center gap-6">
          <Link href="/" className="flex min-w-0 items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded">
              <Image src={`${basePath}/logo1.svg`} alt="Geiger logo" width={20} height={20} className="h-5 w-5" />
            </span>
            <span className="hidden border-l border-[#333333] pl-3 text-sm font-semibold text-white sm:block">
              Geiger Docs
            </span>
          </Link>

          <nav className="hidden h-full items-center gap-6 text-sm text-[#a3a3a3] md:flex">
            {["Docs", "API", "Learn", "Help"].map((item) => (
              <Link
                key={item}
                href={item === "Docs" ? "/docs" : "#"}
                className={`flex h-full items-center border-b-2 transition-colors ${
                  item === "Docs"
                    ? "border-white text-white"
                    : "border-transparent hover:text-white"
                }`}
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden flex-1 justify-center lg:flex">
          <div className="group flex h-8 w-full max-w-[430px] items-center gap-2 rounded-md border border-[#2a2a2a] bg-[#242424] px-3 text-sm text-[#a3a3a3] shadow-sm transition-colors hover:border-[#474747]">
            <Search className="h-4 w-4" />
            <span className="flex-1">Search docs...</span>
            <kbd className="rounded border border-[#333333] bg-[#1a1a1a] px-1.5 py-0.5 text-[11px] text-[#a3a3a3] transition-colors group-hover:bg-[#2a2a2a] group-hover:text-white">
              <Command className="mr-0.5 inline h-3 w-3" />K
            </kbd>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="hidden h-8 items-center gap-3 rounded-md border border-[#2a2a2a] bg-[#242424] px-3 text-sm text-[#a3a3a3] transition-colors hover:border-[#474747] hover:text-white md:flex">
            <span>Ask AI</span>
            <kbd className="rounded border border-[#333333] bg-[#1a1a1a] px-1.5 py-0.5 text-[11px] text-[#a3a3a3]">
              Cmd I
            </kbd>
          </button>
          <Link
            href="/login"
            className="hidden h-8 items-center rounded-full border border-transparent px-3 text-sm font-medium text-[#a3a3a3] transition-colors hover:bg-[#2a2a2a] hover:text-white sm:flex"
          >
            Sign in
          </Link>
          <Link
            href="#download"
            className="h-8 rounded-full bg-white px-4 text-sm font-medium leading-8 text-black transition-colors hover:bg-[#e5e5e5]"
          >
            Download
          </Link>
        </div>
      </div>
    </header>
  );
}

function LeftSidebar() {
  return (
    <aside className="docs-scrollbar-hidden fixed bottom-0 left-0 top-14 hidden w-[280px] overflow-y-auto border-r border-[#2a2a2a] bg-[#161616] px-6 py-6 lg:block">
      <nav className="space-y-8">
        {navigation.map((section) => (
          <div key={section.title}>
            <p className="mb-2 text-sm text-[#a3a3a3]">{section.title}</p>
            <div className="space-y-2">
              {section.links.map((link) => (
                <Link
                  href="#"
                  key={`${section.title}-${link.label}`}
                  className={`flex items-center justify-between text-[15px] font-semibold leading-5 transition-colors ${
                    link.active ? "text-white" : "text-white hover:text-[#a3a3a3]"
                  }`}
                >
                  <span>{link.label}</span>
                  {link.chevron ? <ChevronRight className="h-3.5 w-3.5 text-[#a3a3a3]" /> : null}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}

function RightSidebar() {
  return (
    <aside className="docs-scrollbar-hidden fixed bottom-0 right-0 top-14 hidden w-[280px] overflow-y-auto bg-[#161616] px-6 py-8 xl:block">
      <div className="pl-3">
        <div className="space-y-4 text-sm">
          {rightLinks.map((link, index) => (
            <Link
              key={link}
              href={index === 0 ? "#start-here" : "#"}
              className={`block transition-colors hover:text-zinc-100 ${
                index === 0 ? "text-[#a3a3a3]" : "text-[#737373]"
              }`}
            >
              {link}
            </Link>
          ))}
        </div>

        <div className="my-5 h-px w-full bg-[#2a2a2a]" />

        <div className="space-y-4">
          {actionLinks.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                className="flex items-center gap-2 text-sm text-[#737373] transition-colors hover:text-white"
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
  const fileRows = [
    ["Cargo.toml", "+6", "-3"],
    ["flags.rs", "+6", "-3"],
    ["args.rs", "+7", "-2"],
  ];

  return (
    <div className="relative mt-10 aspect-[704/411] overflow-hidden rounded-lg border border-[#2a2a2a] bg-[#202020] shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
      <div className="absolute inset-0 bg-[linear-gradient(145deg,#2e2e2e_0%,#242424_42%,#1a1a1a_68%,#161616_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.12),transparent_38%)]" />
      <div className="absolute inset-x-[5.5%] top-[9.2%] h-[82%] rounded-md border border-[#e5e5e5] bg-white shadow-2xl">
        <div className="flex h-7 items-center justify-between border-b border-[#e5e5e5] bg-white px-2.5 text-[8px] text-[#a3a3a3]">
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-[#f3f4f6] px-1.5 py-0.5">Agent</span>
            <span>IDE</span>
          </div>
          <div className="flex gap-1">
            <span className="h-1.5 w-5 rounded-sm border border-zinc-300" />
            <span className="h-1.5 w-5 rounded-sm border border-zinc-300" />
          </div>
        </div>

        <div className="grid h-[calc(100%-1.75rem)] grid-cols-[43%_57%] bg-[#f9fafb] text-[#525252]">
          <div className="border-r border-[#e5e5e5] p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="truncate text-[10px] font-semibold text-[#171717]">Add validation for release flags</p>
              <button className="rounded bg-[#f3f4f6] px-2 py-1 text-[7px] font-semibold text-[#525252]">Create PR</button>
            </div>
            <div className="mb-3 grid grid-cols-3 gap-2">
              {["Composer", "Planning next", "Sonnet 4.5"].map((item) => (
                <div key={item} className="rounded border border-[#e5e5e5] bg-white p-1.5">
                  <p className="text-[6px] text-[#a3a3a3]">{item}</p>
                  <p className="mt-1 text-[8px] text-emerald-600">+17 -9</p>
                </div>
              ))}
            </div>
            <div className="rounded border border-[#e5e5e5] bg-white p-2">
              <p className="text-[8px] font-medium text-[#171717]">All tests pass and binary builds successfully.</p>
              <p className="mt-1 text-[7px] leading-3 text-[#737373]">
                The agent reviewed usage patterns and updated the command parser with focused changes.
              </p>
            </div>
            <div className="mt-3 rounded border border-[#e5e5e5] bg-white">
              <div className="border-b border-[#e5e5e5] px-2 py-1 text-[7px] font-semibold text-[#737373]">3 files edited</div>
              {fileRows.map(([file, add, remove]) => (
                <div key={file} className="flex justify-between px-2 py-1 text-[7px] text-[#525252]">
                  <span>{file}</span>
                  <span>
                    <span className="text-emerald-600">{add}</span> <span className="text-rose-500">{remove}</span>
                  </span>
                </div>
              ))}
            </div>
            <div className="absolute bottom-4 left-5 right-[59%] rounded-md border border-[#e5e5e5] bg-white px-2 py-1.5 text-[7px] text-[#737373]">
              Plan, @ for contexts, / for commands
            </div>
          </div>

          <div className="p-3 font-mono">
            <div className="mb-2 flex items-center justify-between text-[7px] text-[#737373]">
              <span>Review: Add release flag support</span>
              <button className="rounded bg-[#171717] px-2 py-1 text-[7px] font-semibold text-white">Apply All</button>
            </div>
            <div className="space-y-1 text-[7px] leading-3">
              {[
                ["-", "pub enum Flag {", "bg-rose-100 text-rose-800"],
                ["+", "    Help,", "bg-emerald-100 text-emerald-800"],
                ["+", "    Version,", "bg-emerald-100 text-emerald-800"],
                ["+", "    Release,", "bg-emerald-100 text-emerald-800"],
                ["", "}", "text-zinc-500"],
                ["", "", "text-zinc-500"],
                ["-", "arg!(\"--version\")", "bg-rose-100 text-rose-800"],
                ["+", "arg!(\"--release\")", "bg-emerald-100 text-emerald-800"],
                ["+", ".help(\"Generate release notes\")", "bg-emerald-100 text-emerald-800"],
                ["", "", "text-zinc-500"],
                ["-", "pub struct SearchConfig {", "bg-rose-100 text-rose-800"],
                ["+", "pub struct ReleaseConfig {", "bg-emerald-100 text-emerald-800"],
                ["+", "    pub verbose: bool,", "bg-emerald-100 text-emerald-800"],
              ].map(([marker, code, color], index) => (
                <div key={`${code}-${index}`} className={`grid grid-cols-[18px_1fr] rounded-sm px-1 ${color}`}>
                  <span>{marker}</span>
                  <span>{code || "\u00a0"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StartCard({ item }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className="group min-h-[160px] rounded border border-[#2a2a2a] bg-[#202020] transition-colors hover:border-[#474747]"
    >
      <div className="flex h-12 items-center gap-3 border-b border-[#2a2a2a] px-4">
        <Icon className="h-4 w-4 text-[#a3a3a3]" />
        <span className="text-sm font-semibold text-white">{item.title}</span>
      </div>
      <p className="px-4 pt-4 text-[15px] font-semibold leading-6 text-white">{item.body}</p>
    </Link>
  );
}

function ContentSection({ id, eyebrow, title, children }) {
  return (
    <section id={id} className="pt-12">
      <p className="mb-3 text-sm text-[#a3a3a3]">{eyebrow}</p>
      <h2 className="text-2xl font-semibold tracking-tight text-white">{title}</h2>
      <div className="mt-4 space-y-4 text-[15px] leading-7 text-[#a3a3a3]">{children}</div>
    </section>
  );
}

export default function DocsWidget() {
  return (
    <>
      <DocsTopBar />
      <LeftSidebar />
      <RightSidebar />

      <main className="min-h-screen bg-[#161616] pt-14 lg:pl-[280px] xl:pr-[280px]">
        <div className="mx-auto w-full max-w-[704px] px-5 py-9 sm:px-0">
          <div className="docs-scrollbar-hidden mb-6 flex gap-2 overflow-x-auto pb-2 lg:hidden">
            {navigation.flatMap((section) => section.links.slice(0, 3)).map((link) => (
              <Link
                href="#"
                key={`mobile-${link.label}`}
                className={`shrink-0 rounded-full border border-[#2a2a2a] px-3 py-1.5 text-sm ${
                  link.active ? "bg-white text-black" : "bg-[#202020] text-[#a3a3a3]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <article>
            <p className="mb-3 text-sm text-[#a3a3a3]">Get Started</p>
            <h1 className="text-[34px] font-semibold leading-tight tracking-tight text-white sm:text-[36px]">
              Geiger Documentation
            </h1>
            <p className="mt-9 max-w-[690px] text-[15px] font-semibold leading-6 text-white">
              Geiger is an AI workspace and delivery system. Use it to understand your projects, plan and build
              features, review changes, and work with the tools your team already uses.
            </p>

            <ProductPreview />

            <section id="start-here" className="pt-[68px]">
              <h2 className="text-2xl font-semibold tracking-tight text-white">Start here</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {startCards.map((item) => (
                  <StartCard key={item.title} item={item} />
                ))}
              </div>
            </section>

            <ContentSection id="get-started" eyebrow="Start here" title="What you can do with Geiger">
              <p>
                Start with a workspace, connect your project sources, and let the agent collect enough context to plan
                a useful change. From there, Geiger can draft implementation steps, update project assets, and prepare a
                reviewable change set.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  [Bot, "Ask questions across your workspace"],
                  [GitPullRequestArrow, "Review and apply proposed changes"],
                  [Code2, "Generate implementation plans"],
                  [ShieldCheck, "Keep permissions and approvals visible"],
                ].map(([Icon, text]) => (
                  <div key={text} className="flex items-center gap-3 rounded border border-[#2a2a2a] bg-[#202020] p-3">
                    <Icon className="h-4 w-4 text-[#a3a3a3]" />
                    <span className="text-sm font-medium text-white">{text}</span>
                  </div>
                ))}
              </div>
            </ContentSection>

            <ContentSection id="products" eyebrow="Products" title="Core surfaces">
              <p>
                Geiger Docs covers the dashboard, project planning, notes canvas, asset workflows, AI agents, and cloud
                execution. Each guide focuses on the shortest path from setup to a working team workflow.
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  [Box, "Dash"],
                  [WandSparkles, "Grey"],
                  [Rocket, "Flow"],
                ].map(([Icon, label]) => (
                  <Link
                    href="#"
                    key={label}
                    className="flex items-center justify-between rounded border border-[#2a2a2a] bg-[#202020] p-4 text-sm font-semibold text-white transition-colors hover:border-[#474747]"
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-[#a3a3a3]" />
                      {label}
                    </span>
                    <ChevronRight className="h-4 w-4 text-[#737373]" />
                  </Link>
                ))}
              </div>
            </ContentSection>
          </article>
        </div>
      </main>
    </>
  );
}
