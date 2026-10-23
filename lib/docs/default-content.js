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
    "Guides for the Geiger suite: setting up your organization, running projects, and getting the most out of each product.",
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
        { icon: "CircleDollarSign", title: "Plans & pricing", body: "Compare plans, seats and add-ons", href: "/pricing" },
        { icon: "Sparkles", title: "Changelog", body: "See what shipped across the suite", href: "/changelog" },
      ],
      features: [],
      links: [],
    },
  ],
  toc: [{ label: "Start here", href: "#start-here" }],
};
