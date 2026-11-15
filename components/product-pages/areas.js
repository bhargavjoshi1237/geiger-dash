// The four product-area pages, in the order the "keep exploring" strip and the footer list them.
export const AREAS = [
  {
    id: "intake",
    href: "/intake",
    label: "Intake and inboxes",
    headline: "Every request has somewhere to land",
    description:
      "Conversations, form responses, registrations and new issues each land in a queue built for them: Comms, Forms, Events and Flow on one Geiger account.",
  },
  {
    id: "plan",
    href: "/plan",
    label: "Planning and collaboration",
    headline: "Plan the work from first sketch to launch",
    description:
      "Plan in Flow's issues, cycles, roadmap and goals, think it through on a live Notes canvas, and talk it over in team chat, all on one Geiger account.",
  },
  {
    id: "ai",
    href: "/ai",
    label: "AI and automation",
    headline: "Put your team's knowledge to work",
    description:
      "Knowledge bases that answer with citations, a knowledge graph, an MCP server and an OpenAI-compatible API in Grey, plus Copilot in Comms and automations that run on their own, all on your own model keys.",
  },
  {
    id: "launch",
    href: "/launch",
    label: "Publish, sell and deliver",
    headline: "Ship it to the people it's for",
    description:
      "Sell tickets and run the door with Events, publish content through an API with Content, hand over approved media with Assets, and put a gateway in front of your APIs with Pods, all on one Geiger account.",
  },
];

export function findArea(id) {
  return AREAS.find((area) => area.id === id) ?? null;
}

export function areaMetadata(area) {
  return { title: area.label, description: area.description, alternates: { canonical: area.href } };
}
