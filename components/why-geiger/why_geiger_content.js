// Copy and dated price data for the /why-geiger resource page; app copy and hues come from the suite catalog.

export const PRICES_CHECKED = "17 Oct 2026";

// Apps that serve a sandbox at /<app>/playground.
export const SANDBOX_APP_IDS = ["flow", "notes", "events", "assets", "campaign", "content", "pods"];

export const REASONS = [
  { tag: "Cost", title: "One Bill Instead of Seven", body: "bill" },
  { tag: "Access", title: "One Account for Every App", body: "Sign in once. Your organisation, members and billing carry across every app in the suite." },
  { tag: "Range", title: "Creative and Operational Work in One Place", body: "Sketch on a canvas, track issues, sell tickets and scan guests at the door without leaving the suite." },
  { tag: "Try It", title: "Use It Before You Sign Up", body: "Seven apps have sandboxes you can open without an account." },
  { tag: "Momentum", title: "Improving Every Week", body: "Every change ships to a public changelog, so you can see what's new before you commit." },
  { tag: "Flexible", title: "Grows With Your Team", body: "Start with one app, then add apps, projects and collaborators as you need them. Your plan changes, your workspace doesn't." },
];

// Status and highlights per app, keyed by catalog id.
export const APP_DETAILS = {
  events: { does: "Event pages, ticketing, registration, agenda and door check-in", highlights: "QR kiosk, seat maps, venue displays" },
  campaign: { does: "Lifecycle marketing: audiences, sends, journeys and deliverability", highlights: "Email builder, A/B tests, journeys" },
  notes: { does: "An infinite canvas with docs, sketches, tables and live collaboration", highlights: "Live cursors, a video stage on the board" },
  docs: { does: "E-signatures, signing order and an audit trail", highlights: "On the way" },
  forms: { does: "Form builder, conversational forms and a response inbox", highlights: "Logic, formulas, funnel analytics" },
  office: { does: "HR records, invoices, time and leave", highlights: "On the way" },
  content: { does: "A headless CMS with personalisation and recommendations", highlights: "A feed you can steer" },
  grey: { does: "Managed AI search over your knowledge: knowledge bases, graph, API and MCP", highlights: "3D knowledge graph" },
  comms: { does: "Live chat, a shared inbox and a help center", highlights: "On the way" },
  flow: { does: "Issues, cycles, boards, goals, and team chat with calls", highlights: "Fast tracker, planning canvas" },
  assets: { does: "Media library, approvals, licensing and a storefront", highlights: "Approval workflows, galleries" },
  pods: { does: "An API gateway with keys, usage plans, a CLI and developer portals", highlights: "Portals with generated SDKs" },
  property: { does: "Rentals from listing to renewal, plus full accounting", highlights: "Tenant and owner portals" },
};

export const AUDIENCES = [
  { title: "Event Organisers", body: "Meetups, clubs and small conferences. Sell tickets and run the door, then collect speakers and email past guests.", apps: ["events", "forms", "campaign"] },
  { title: "Creative Studios", body: "Agencies and product teams of 2 to 15. Think on a shared canvas, plan the work, deliver the files.", apps: ["notes", "flow", "assets"] },
  { title: "Operations Teams", body: "Intake, approvals and tracking for the people who keep a company running.", apps: ["forms", "flow", "grey"] },
  { title: "Developers and Data Teams", body: "Teams that run APIs, ship content and want AI search over their own knowledge.", apps: ["pods", "grey", "content"] },
];

// A 10-person team's typical stack, US list prices, annual billing where offered.
export const STACK_SEATS = 10;
export const STACK_TOOLS = [
  { name: "Linear", plan: "Basic · 10 × $10", cost: 100, app: "flow" },
  { name: "Notion", plan: "Plus · 10 × $10", cost: 100, app: "notes" },
  { name: "Slack", plan: "Pro · 10 × $7.25", cost: 72.5, app: "flow" },
  { name: "Luma", plan: "Plus · flat", cost: 59, app: "events" },
  { name: "Typeform", plan: "Plus · 3 seats", cost: 56, app: "forms" },
  { name: "Milanote", plan: "Team · 10 members", cost: 49, app: "notes" },
  { name: "Mailchimp", plan: "Standard · 500 contacts", cost: 20, app: "campaign" },
];
export const STACK_AXIS_MAX = 120;

export const ALTERNATIVES = [
  { option: "Separate Tools", covers: "One job each: Linear, Notion, Typeform, Luma and the rest", priced: "Per tool, usually per seat", geiger: "One account and one bill for all of those jobs" },
  { option: "Zoho One", covers: "About 45 business apps built around a CRM", priced: "About $37 per employee per month, for every employee", geiger: "Pay for the plan and the apps you pick, then add collaborators as you grow" },
  { option: "Odoo", covers: "Business apps built around accounting and inventory", priced: "One app free, then about $25 to $31 per user for all apps", geiger: "Adds a shared canvas, event ticketing and door check-in" },
  { option: "Notion", covers: "Docs, wikis and lightweight projects", priced: "$10 to $20 per seat", geiger: "Adds ticketing, door check-in and media delivery alongside docs and projects" },
];

export const GAINS = [
  { strong: "One login", rest: "for every app your team uses." },
  { strong: "One bill", rest: "with every app and collaborator on it." },
  { strong: "One design", rest: "so the second app feels familiar on day one." },
  { strong: "Sandboxes", rest: "to try an app before you turn it on." },
];

export const LOSSES = [
  { strong: "A login per tool", rest: "and a password reset for each one." },
  { strong: "An invoice per vendor", rest: "on different renewal dates." },
  { strong: "Per-seat pricing", rest: "stacking up across every tool." },
  { strong: "A new interface", rest: "to learn for every job." },
];

export const STATS = [
  { value: "$4,830", body: "Average SaaS spend per employee in 2025.", source: "Zylo SaaS Management Index", url: "https://zylo.com/news/2025-saas-management-index" },
  { value: "275", body: "Average number of SaaS apps per company in 2025.", source: "Zylo SaaS Management Index", url: "https://zylo.com/news/2025-saas-management-index" },
  { value: "$3.44", body: "What Eventbrite keeps from a $25 ticket, about 13.8% of the price.", source: "Eventbrite organizer pricing", url: "https://www.eventbrite.com/organizer/pricing/" },
  { value: "5%", body: "Luma's platform fee on paid tickets on its free plan.", source: "Luma pricing", url: "https://luma.com/pricing" },
];

export const ANSWERS = [
  { pill: "Yes", tone: "good", question: "Can I Try It Without Signing Up?", answer: "Flow, Notes, Events, Assets, Campaign, Content and Pods each have a sandbox. Nothing you do there is saved." },
  { pill: "By Plan", tone: "good", question: "Do I Pay for Every App?", answer: "Each plan includes a set of apps. You choose which ones, and add more for a fixed monthly price per app." },
  { pill: "Weekly", tone: "good", question: "How Do I Know It's Still Moving?", answer: "Every change is published to the public changelog, written from the actual change." },
];

export const STEPS = [
  { title: "Create Your Account", body: "Sign up and create your organisation.", note: "Your members and billing live on the organisation." },
  { title: "Pick Your First App", body: "Start with the job that costs you the most time this week.", note: "Every other app is already on your account." },
  { title: "Invite Your Team", body: "Members join your organisation, not each app separately.", note: "One invite covers the whole suite." },
  { title: "Add the Next App", body: "Turn on another app from the same workspace when you need it.", note: "No new login, no new invoice." },
];
