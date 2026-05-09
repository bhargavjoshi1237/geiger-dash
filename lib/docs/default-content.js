export const defaultDocsNavigation = [
  {
    title: "Get Started",
    links: [
      { label: "Welcome", slug: "welcome", href: "/docs/welcome" },
      { label: "Quickstart", slug: "quickstart", href: "/docs/quickstart" },
      { label: "Plans & Pricing", slug: "plans-pricing", href: "/docs/plans-pricing", chevron: true },
      { label: "Changelog", slug: "changelog", href: "/docs/changelog" },
    ],
  },
  {
    title: "Agent",
    links: [
      { label: "Overview", slug: "agent/overview", href: "/docs/agent/overview" },
      { label: "Agents Window", slug: "agent/window", href: "/docs/agent/window" },
      { label: "Agent Review", slug: "agent/review", href: "/docs/agent/review" },
      { label: "Planning", slug: "agent/planning", href: "/docs/agent/planning" },
      { label: "Prompting", slug: "agent/prompting", href: "/docs/agent/prompting" },
      { label: "Debugging", slug: "agent/debugging", href: "/docs/agent/debugging" },
      { label: "Tools", slug: "agent/tools", href: "/docs/agent/tools", chevron: true },
      { label: "Security", slug: "agent/security", href: "/docs/agent/security" },
    ],
  },
  {
    title: "Customizing",
    links: [
      { label: "Plugins", slug: "customizing/plugins", href: "/docs/customizing/plugins" },
      { label: "Rules", slug: "customizing/rules", href: "/docs/customizing/rules" },
      { label: "Skills", slug: "customizing/skills", href: "/docs/customizing/skills" },
      { label: "Subagents", slug: "customizing/subagents", href: "/docs/customizing/subagents" },
      { label: "Hooks", slug: "customizing/hooks", href: "/docs/customizing/hooks" },
      { label: "MCP", slug: "customizing/mcp", href: "/docs/customizing/mcp" },
    ],
  },
  {
    title: "Cloud Agents",
    links: [
      { label: "Overview", slug: "cloud-agents/overview", href: "/docs/cloud-agents/overview" },
      { label: "Setup", slug: "cloud-agents/setup", href: "/docs/cloud-agents/setup" },
      { label: "Capabilities", slug: "cloud-agents/capabilities", href: "/docs/cloud-agents/capabilities" },
      { label: "My Machines", slug: "cloud-agents/my-machines", href: "/docs/cloud-agents/my-machines" },
      { label: "Self-Hosted Pool", slug: "cloud-agents/self-hosted-pool", href: "/docs/cloud-agents/self-hosted-pool" },
      { label: "Bugbot", slug: "cloud-agents/bugbot", href: "/docs/cloud-agents/bugbot" },
    ],
  },
];

const overviewBlocks = [
  {
    type: "section",
    id: "start-here",
    title: "Start here",
    cards: [
      {
        icon: "Rocket",
        title: "Get started",
        body: "Go from install to your first useful change in Geiger",
        href: "#get-started",
      },
      {
        icon: "CircleDollarSign",
        title: "Plans & Pricing",
        body: "Compare plans, usage pools, and team pricing",
        href: "/pricing",
      },
      {
        icon: "Sparkles",
        title: "Changelog",
        body: "Stay up to date with the latest features and improvements",
        href: "/changelog",
      },
    ],
  },
  {
    type: "section",
    id: "get-started",
    eyebrow: "Start here",
    title: "What you can do with Geiger",
    body: [
      "Start with a workspace, connect your project sources, and let the agent collect enough context to plan a useful change. From there, Geiger can draft implementation steps, update project assets, and prepare a reviewable change set.",
    ],
    features: [
      { icon: "Bot", text: "Ask questions across your workspace" },
      { icon: "GitPullRequestArrow", text: "Review and apply proposed changes" },
      { icon: "Code2", text: "Generate implementation plans" },
      { icon: "ShieldCheck", text: "Keep permissions and approvals visible" },
    ],
  },
  {
    type: "section",
    id: "products",
    eyebrow: "Products",
    title: "Core surfaces",
    body: [
      "Geiger Docs covers the dashboard, project planning, notes canvas, asset workflows, AI agents, and cloud execution. Each guide focuses on the shortest path from setup to a working team workflow.",
    ],
    links: [
      { icon: "Box", label: "Dash", href: "/docs/quickstart" },
      { icon: "WandSparkles", label: "Grey", href: "/docs/agent/overview" },
      { icon: "Rocket", label: "Flow", href: "/docs/cloud-agents/overview" },
    ],
  },
];

export const defaultDocsPages = [
  {
    slug: "welcome",
    groupTitle: "Get Started",
    title: "Geiger Documentation",
    description:
      "Geiger is an AI workspace and delivery system. Use it to understand your projects, plan and build features, review changes, and work with the tools your team already uses.",
    preview: "assets",
    toc: [
      { label: "Start here", href: "#start-here" },
      { label: "What you can do with Geiger", href: "#get-started" },
      { label: "Products", href: "#products" },
    ],
    blocks: overviewBlocks,
  },
];

function titleFromSlug(slug) {
  return slug
    .split("/")
    .at(-1)
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getFallbackDocsPage(slug = "welcome") {
  const page = defaultDocsPages.find((item) => item.slug === slug);
  if (page) return page;

  const navItem = defaultDocsNavigation.flatMap((section) => section.links).find((item) => item.slug === slug);
  return {
    slug,
    groupTitle: defaultDocsNavigation.find((section) => section.links.some((item) => item.slug === slug))?.title || "Docs",
    title: navItem?.label || titleFromSlug(slug),
    description:
      "This docs page is ready for Supabase-backed content. Add rows for this slug in the docs tables to publish the full guide.",
    toc: [{ label: "Overview", href: "#overview" }],
    blocks: [
      {
        type: "section",
        id: "overview",
        eyebrow: "Docs",
        title: navItem?.label || titleFromSlug(slug),
        body: [
          "Use the docs_content_blocks table to add paragraphs, cards, feature grids, and product links for this page.",
        ],
      },
    ],
  };
}
