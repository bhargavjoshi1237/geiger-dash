import { CALCULATOR_HUB_HREF, FEE_PLATFORMS, calculatorHref } from "@/lib/resources/ticket-fees";
import { comparisonsFor } from "@/lib/resources/comparisons";
import { FORM_TEMPLATES } from "@/lib/resources/form-templates";

const template = (slug) => {
  const found = FORM_TEMPLATES.find((entry) => entry.slug === slug);
  return { href: `/templates/${found.slug}`, label: `${found.name} template`, description: found.useFor };
};

// Topic rules for blog posts: a pattern over the post's title, slug, tags and excerpt, and the resources it earns.
const TOPICS = [
  ...FEE_PLATFORMS.map((platform) => ({
    pattern: new RegExp(`\\b${platform.name.replace(" ", "[ -]?")}\\b`, "i"),
    resources: () => [
      { href: calculatorHref(platform), label: `${platform.name} fee calculator`, description: platform.tagline },
      platform.alternativeHref ? { href: platform.alternativeHref, label: `${platform.name} alternative`, description: `How Geiger Events compares with ${platform.name}.` } : null,
      ...comparisonsFor(platform.id).slice(0, 1).map((comparison) => ({ href: comparison.href, label: comparison.title, description: comparison.description })),
    ],
  })),
  { pattern: /\b(fees?|pricing|ticket price|ticketing|tickets?|no-shows?|overbook|scalp)/i, resources: () => [{ href: CALCULATOR_HUB_HREF, label: "Ticket fee calculator", description: "Every platform's fees for one ticket price." }, { href: "/compare", label: "Ticketing platforms compared", description: "Fees, payouts and features side by side." }] },
  { pattern: /\b(registration|forms?\b|questions?|conditional|dietary|accessib)/i, resources: () => [template("event-registration-form-template"), template("workshop-registration-form-template")] },
  { pattern: /\b(workshop|class|course|recurring|membership)/i, resources: () => [template("workshop-registration-form-template")] },
  { pattern: /\bvolunteer/i, resources: () => [template("volunteer-sign-up-form-template")] },
  { pattern: /\b(feedback|survey|nps)/i, resources: () => [template("event-feedback-survey-template")] },
  { pattern: /\b(speaker|call for (papers|speakers)|cfp)/i, resources: () => [template("speaker-application-form-template")] },
  { pattern: /\b(vendor|exhibitor|sponsor|expo|trade show)/i, resources: () => [template("vendor-application-form-template")] },
];

// Up to `limit` organiser resources that match what a post is about; empty for posts on unrelated topics.
export function resourcesForPost(post, limit = 4) {
  const text = [post.title, post.slug?.replaceAll("-", " "), post.excerpt, post.category, ...(post.tags || [])].filter(Boolean).join(" ");
  const seen = new Set();
  const picked = [];
  for (const topic of TOPICS) {
    if (!topic.pattern.test(text)) continue;
    for (const resource of topic.resources()) {
      if (!resource || seen.has(resource.href)) continue;
      seen.add(resource.href);
      picked.push(resource);
      if (picked.length >= limit) return picked;
    }
  }
  return picked;
}
