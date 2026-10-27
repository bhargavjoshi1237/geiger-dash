import { AiPage } from "@/components/product-pages/ai/ai_page";

// Statically generated and served from the CDN; the build fails if anything here starts reading request-time data.
export const dynamic = "error";

export const metadata = {
  title: "AI and automation",
  description:
    "Knowledge bases that answer with citations, a knowledge graph, an MCP server and an OpenAI-compatible API in Grey, plus Copilot in Comms and automations that run on their own, all on your own model keys.",
  alternates: { canonical: "/ai" },
};

export default function Page() {
  return <AiPage />;
}
