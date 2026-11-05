export const productRouteRewrites = [
  {
    source: "/notes",
    destination: "https://geigernotes.vercel.app/notes",
  },
  {
    source: "/notes/:path*",
    destination: "https://geigernotes.vercel.app/notes/:path*",
  },
  {
    source: "/assets",
    destination: "https://geigerassets.vercel.app/assets",
  },
  {
    source: "/assets/:path*",
    destination: "https://geigerassets.vercel.app/assets/:path*",
  },
  {
    source: "/flow",
    destination: "https://geigerflow.vercel.app/flow",
  },
  {
    source: "/flow/:path*",
    destination: "https://geigerflow.vercel.app/flow/:path*",
  },
  {
    source: "/forms",
    destination: "https://geigerforms.vercel.app",
  },
  {
    source: "/forms/:path*",
    destination: "https://geigerforms.vercel.app/:path*",
  },
  {
    source: "/form/:path*",
    destination: "https://geigerforms.vercel.app/form/:path*",
  },
  {
    source: "/events",
    destination: "https://geigerevents.vercel.app/events",
  },
  {
    source: "/events/:path*",
    destination: "https://geigerevents.vercel.app/events/:path*",
  },
  {
    source: "/campaign",
    destination: "https://geigercampaign.vercel.app/campaign",
  },
  {
    source: "/campaign/:path*",
    destination: "https://geigercampaign.vercel.app/campaign/:path*",
  },
  {
    source: "/pods",
    destination: "https://geigerpods.vercel.app/pods",
  },
  {
    source: "/pods/:path*",
    destination: "https://geigerpods.vercel.app/pods/:path*",
  },
  {
    source: "/comms",
    destination: "https://geigercomms.vercel.app/comms",
  },
  {
    source: "/comms/:path*",
    destination: "https://geigercomms.vercel.app/comms/:path*",
  },
  {
    source: "/docs",
    destination: "https://geigerdocs.vercel.app/docs",
  },
  {
    source: "/docs/:path*",
    destination: "https://geigerdocs.vercel.app/docs/:path*",
  },
  {
    source: "/grey",
    destination: "https://geigergrey.vercel.app/grey",
  },
  {
    source: "/grey/:path*",
    destination: "https://geigergrey.vercel.app/grey/:path*",
  },
  {
    source: "/content",
    destination: "https://geigercontent.vercel.app/content",
  },
  {
    source: "/content/:path*",
    destination: "https://geigercontent.vercel.app/content/:path*",
  },
  {
    source: "/property",
    destination: "https://geigerproperty.vercel.app/property",
  },
  {
    source: "/property/:path*",
    destination: "https://geigerproperty.vercel.app/property/:path*",
  },
  {
    source: "/audio",
    destination: "https://geigeraudio.vercel.app/audio",
  },
  {
    source: "/audio/:path*",
    destination: "https://geigeraudio.vercel.app/audio/:path*",
  },
];

const singleWordRoutePattern = /^\/([A-Za-z0-9_-]+)$/;

export const loginNextRouteNames = productRouteRewrites.reduce((routes, rewrite) => {
  const match = rewrite.source.match(singleWordRoutePattern);

  if (match) {
    routes.add(match[1]);
  }

  return routes;
}, new Set());

loginNextRouteNames.add("org");

const OAUTH_CONSENT_NEXT = /^\/oauth\/consent\?authorization_id=[A-Za-z0-9_-]+$/;
// Geiger Events desktop: the browser sign-in returns here to hand the session to the app.
const DESKTOP_HANDOFF_NEXT = /^\/events\/desktop\/handoff\?state=[A-Za-z0-9_-]{32,128}$/;

export function resolveLoginRedirectPath(next) {
  // The MCP consent page and the desktop handoff are the only deep links login may return to.
  if (typeof next === "string" && (OAUTH_CONSENT_NEXT.test(next) || DESKTOP_HANDOFF_NEXT.test(next))) {
    return next;
  }

  if (typeof next !== "string" || !loginNextRouteNames.has(next)) {
    return "/";
  }

  return `/${next}`;
}
