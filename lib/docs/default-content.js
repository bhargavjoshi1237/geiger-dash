import { HELP_HOME_SLUG, helpHref } from "@/lib/docs/paths";

// Shown only when the docs tables can't be read, so /help still renders a useful landing page.
export const fallbackNavigation = [
  {
    title: "Get Started",
    links: [{ label: "Welcome", slug: HELP_HOME_SLUG, href: helpHref(HELP_HOME_SLUG), draft: false, children: [] }],
  },
];

export const fallbackHomePage = {
  slug: HELP_HOME_SLUG,
  groupTitle: "Get Started",
  title: "Geiger Help Center",
  description:
    "Guides for Geiger, the connected suite for running your team's work. Set up your organization and projects, then go deeper into each app.",
  preview: "assets",
  status: "published",
  sections: [
    {
      id: "start-here",
      eyebrow: "",
      title: "Start here",
      content: "",
      cards: [
        { icon: "UserPlus", title: "Create an account", body: "Sign up and set up your organization", href: "/signup" },
        { icon: "Workflow", title: "Geiger Flow", body: "Plan and track work across your projects", href: helpHref("flow") },
        { icon: "Sparkles", title: "Changelog", body: "See what shipped across the suite", href: "/changelog" },
      ],
      features: [],
      links: [],
    },
  ],
  toc: [{ label: "Start here", href: "#start-here" }],
};
