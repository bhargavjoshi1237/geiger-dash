// Suite-native page families: who each page is for (/for/<id>) and deep tours of the most complete apps (/apps/<app>/<id>).
// Plain data, so the footer and sitemap can list the pages without pulling in their renders.
// Every claim here was checked against the app's code on 2026-10-27; re-check before widening the copy.

export const AUDIENCE_PAGES = [
  {
    id: "event-organisers",
    href: "/for/event-organisers",
    label: "For event organisers",
    short: "Event organisers",
    eyebrow: "For event organisers",
    headline: "Fill the room, then run the door",
    title: "Geiger for event organisers",
    description:
      "Plan the event, take speaker and vendor applications with forms, sell tickets through Stripe, check guests in with QR codes and keep every guest in one contact book, all on one Geiger account.",
  },
  {
    id: "creative-studios",
    href: "/for/creative-studios",
    label: "For creative studios",
    short: "Creative studios",
    eyebrow: "For creative studios",
    headline: "From the client's brief to the final file",
    title: "Geiger for creative studios",
    description:
      "Take the brief through a form, work it out live on a shared canvas, plan it in a fast tracker and deliver approved files with expiring share links, on one Geiger account.",
  },
  {
    id: "operations",
    href: "/for/operations",
    label: "For operations teams",
    short: "Operations teams",
    eyebrow: "For operations teams",
    headline: "Every request answered, every task tracked",
    title: "Geiger for operations teams",
    description:
      "Collect requests through forms with approvals, track the work in a fast tracker, and answer the team's questions from your own documents with cited sources, on one Geiger account.",
  },
  {
    id: "developers",
    href: "/for/developers",
    label: "For developers and data teams",
    short: "Developers",
    eyebrow: "For developers and data teams",
    headline: "APIs for your content, files and answers",
    title: "Geiger for developers and data teams",
    description:
      "Serve structured content and media from public APIs, and give your models grounded answers over MCP or an OpenAI-compatible endpoint, on one Geiger account.",
  },
];

// Team shapes from the landing's "Your whole team, one workspace" cards (/teams/<id>); copy re-checked against the apps on 2026-10-28.
export const TEAM_PAGES = [
  {
    id: "corporate",
    href: "/teams/corporate",
    label: "For corporate teams",
    short: "Corporate teams",
    eyebrow: "For corporate teams",
    headline: "Every department, one structure",
    title: "Geiger for corporate teams",
    description:
      "Run each department as a project in one organisation, bring people in by invitation or request with the right role, route requests through approvals and keep usage and billing in one place, on one Geiger account.",
  },
  {
    id: "creative",
    href: "/teams/creative",
    label: "For in-house creative teams",
    short: "In-house creative",
    eyebrow: "For in-house creative teams",
    headline: "A workspace that keeps up with your ideas",
    title: "Geiger for in-house creative teams",
    description:
      "Sketch ideas together on a live canvas, keep every brand file and version in one library, get sign-off in stages and publish through structured content, on one Geiger account.",
  },
  {
    id: "management",
    href: "/teams/management",
    label: "For managers and team leads",
    short: "Managers and leads",
    eyebrow: "For managers and team leads",
    headline: "Every project and every team, in one view",
    title: "Geiger for managers and team leads",
    description:
      "See every project in your organisation from one place, set goals and milestones, approve resource requests and follow the budget against forecast, on one Geiger account.",
  },
];

const tour = (app, name, pages) => ({
  app,
  name,
  pages: pages.map((page) => ({
    ...page,
    href: `/apps/${app}/${page.id}`,
    eyebrow: `${name} · ${page.label}`,
    title: `${page.label} · ${name}`,
  })),
});

export const APP_TOURS = [
  tour("events", "Geiger Events", [
    {
      id: "ticketing",
      label: "Tickets and checkout",
      headline: "A box office that runs itself",
      description:
        "Publish an event page, sell tiered tickets, reserved seats and expo booths through Stripe, and let releases, codes and bundles price every order at checkout.",
    },
    {
      id: "check-in",
      label: "Check-in and the day",
      headline: "Run the door, the screens and the day",
      description:
        "Scan QR tickets at the door, record walk-ins, run a self check-in kiosk, put the running order on the venue's screens and keep the day's tasks moving.",
    },
    {
      id: "guests",
      label: "Guests and members",
      headline: "Every guest, remembered",
      description:
        "Approve registrations, promote guests off the waitlist, keep everyone in one contact book and sell memberships through a members portal.",
    },
  ]),
  tour("notes", "Geiger Notes", [
    {
      id: "canvas",
      label: "The board",
      headline: "A canvas for every kind of thinking",
      description:
        "An infinite board with 31 kinds of card, from notes, tables and sketches to Mermaid diagrams, mind maps, formulas and embeds, with boards nested inside boards.",
    },
    {
      id: "live-sessions",
      label: "Live sessions",
      headline: "Work it out together, live",
      description:
        "Bring the team onto a board with a session code: live cursors, a laser pointer, follow mode and host controls, then merge the session back into your board.",
    },
    {
      id: "meetings",
      label: "Meetings and the AI card",
      headline: "Meet, decide and write it down",
      description:
        "Start a video meeting on the board with screen sharing and host tools, then let the AI card summarise, cluster and pull out action items as notes.",
    },
  ]),
  tour("flow", "Geiger Flow", [
    {
      id: "issues",
      label: "The issue tracker",
      headline: "Issues at the speed of the keyboard",
      description:
        "Triage, cycles, views and a roadmap in a tracker built for the keyboard, with seven states, five priorities and every screen a shortcut away.",
    },
    {
      id: "projects",
      label: "Projects and planning",
      headline: "Run the project, not the spreadsheet",
      description:
        "Tasks that move through stages, a work queue for today, goals and milestones, resource requests and a budget tracker that costs your architecture.",
    },
    {
      id: "team",
      label: "Chat, calls and the vault",
      headline: "Talk it over and keep the keys safe",
      description:
        "Channels, threads and direct messages beside the work, one-to-one calls from the browser, and a vault that locks secrets behind a PIN, password or passkey.",
    },
  ]),
  tour("forms", "Geiger Forms", [
    {
      id: "builder",
      label: "The form builder",
      headline: "Build the form you actually need",
      description:
        "36 field types, logic, formulas and scoring, multi-step pages, themes and 42 templates, with a classic or conversational layout for every form.",
    },
    {
      id: "responses",
      label: "Responses and approvals",
      headline: "Every response, handled",
      description:
        "A response inbox with saved views, statuses and scores, approvals that route in steps, automations that act on each submission, and a funnel from view to submit.",
    },
    {
      id: "share-and-sell",
      label: "Sharing, payments and the API",
      headline: "Share it anywhere and get paid",
      description:
        "Publish a link, embed a form or send invites, take payments through Stripe, keep spam out and sensitive answers encrypted, and connect it all with an API and webhooks.",
    },
  ]),
  tour("grey", "Geiger Grey", [
    {
      id: "knowledge-bases",
      label: "Knowledge bases",
      headline: "Turn your files into knowledge",
      description:
        "Upload documents, spreadsheets, slides, audio, video and web pages, import from Assets and Notes, and Grey indexes them into knowledge bases and a knowledge graph.",
    },
    {
      id: "answers",
      label: "Cited answers",
      headline: "Answers you can check",
      description:
        "Every answer cites its sources. Tune retrieval in pipelines, try it in the playground and measure it with evaluations for faithfulness and relevance.",
    },
    {
      id: "delivery",
      label: "API, MCP and widget",
      headline: "Put the answers where people ask",
      description:
        "Serve grounded answers through an OpenAI-compatible API, an MCP server for your AI tools or a chat widget on your site, on your own model keys.",
    },
  ]),
  tour("content", "Geiger Content", [
    {
      id: "modelling",
      label: "Modelling and editing",
      headline: "Model it once, write it together",
      description:
        "Define content types with typed fields, write entries in a structured editor, and move them through assignments, review and comments with an AI assistant at hand.",
    },
    {
      id: "publishing",
      label: "Publishing and versions",
      headline: "Publish with a safety net",
      description:
        "A publishing queue, version snapshots you can compare and roll back, cache invalidation on demand, and roles, permissions and an audit log around it all.",
    },
    {
      id: "delivery",
      label: "The delivery API",
      headline: "Serve it to any site or app",
      description:
        "Read published entries from a public REST API with scoped tokens, filter them and read their schema, and personalise what each visitor sees.",
    },
  ]),
  tour("assets", "Geiger Assets", [
    {
      id: "library",
      label: "The library",
      headline: "Every file, every version, one library",
      description:
        "Upload images, video, audio, documents and 3D, relate files to each other, edit images in place and serve any size or format on the fly.",
    },
    {
      id: "approvals",
      label: "Approvals and workflows",
      headline: "Sign-off in stages, on the record",
      description:
        "Route files through approval pipelines that run in order or any order, lock the approved version, and let workflows move, tag and announce assets as they change.",
    },
    {
      id: "galleries",
      label: "Galleries, sales and licensing",
      headline: "Show it, sell it, license it",
      description:
        "Publish galleries in six layouts, sell prints and downloads through Stripe, and track rights, licences, renewals and royalties for everything you license out.",
    },
  ]),
  tour("property", "Geiger Property", [
    {
      id: "leasing",
      label: "Leasing",
      headline: "From first showing to move-in",
      description:
        "Publish listings, track prospects and showings, review applications, and manage every lease from draft to renewal, with move-ins, inspections and deposits on the record.",
    },
    {
      id: "maintenance",
      label: "Maintenance and portals",
      headline: "Keep every building running",
      description:
        "Log work orders with priorities and vendors, keep tenants, owners and vendors in one place, and give each of them a portal they sign into with a one-time code.",
    },
    {
      id: "accounting",
      label: "Accounting and rent",
      headline: "Books that balance to the penny",
      description:
        "Double-entry books with a general ledger, bank reconciliation, bills and budgets, rent collected through Stripe, and reports from rent roll to owner statements.",
    },
  ]),
];

export function findAudiencePage(id) {
  return AUDIENCE_PAGES.find((page) => page.id === id) ?? null;
}

export function findTeamPage(id) {
  return TEAM_PAGES.find((page) => page.id === id) ?? null;
}

export function findTour(app) {
  return APP_TOURS.find((entry) => entry.app === app) ?? null;
}

export function findTourPage(app, id) {
  return findTour(app)?.pages.find((page) => page.id === id) ?? null;
}

export function pageMetadata(page) {
  return page ? { title: page.title, description: page.description, alternates: { canonical: page.href } } : {};
}

export const ALL_TOUR_PAGES = [...AUDIENCE_PAGES, ...TEAM_PAGES, ...APP_TOURS.flatMap((entry) => entry.pages)];
