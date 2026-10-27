import { AreaHero, AreaPage, AreaSection, CalloutStage, FeatureCell, FeatureGrid, Fit, HeroArt, Stage } from "@/components/product-pages/area_kit";
import { findTourPage, findTour } from "@/components/product-pages/tours";
import {
  ApiKeysRender,
  EndpointsWindow,
  McpAskRender,
  McpServerDialogRender,
  McpServerSheet,
  ProvidersRender,
  RetrieveRender,
  StreamStage,
  UsageRender,
  WidgetSettingsRender,
  WidgetsListRender,
  WidgetStage,
} from "@/components/product-pages/apps/grey/delivery_renders";

const PAGE = findTourPage("grey", "delivery");

const GREY = { label: "Geiger Grey", href: "/grey" };

const MCP_LEFT = [
  { title: "search", body: "Semantic search over the server's knowledge bases" },
  { title: "ask", body: "A question answered by the published pipeline, with numbered sources" },
];

const MCP_RIGHT = [
  { title: "get_entity", body: "A knowledge graph entity by name or id, with its relations" },
  { title: "list_sources", body: "The ready documents, pages and recordings the server can see" },
];

// /apps/grey/delivery: the OpenAI-compatible API, MCP servers and the chat widget, on the customer's own model keys.
export function GreyDeliveryPage() {
  return (
    <AreaPage area={PAGE.id} links={findTour("grey").pages} linksLabel="More from Geiger Grey">
      <AreaHero
        eyebrow={PAGE.eyebrow}
        title={PAGE.headline}
        art={
          <HeroArt focus={["54%", "32%"]} plane={{ "--plane-top": "-20%", "--plane-left": "8%" }}>
            <EndpointsWindow />
          </HeroArt>
        }
      />

      <AreaSection
        id="api"
        title="Any OpenAI client, grounded answers"
        lead="Every published pipeline serves an OpenAI-compatible chat completions endpoint. Answers stream back with the citations behind them, and a retrieve endpoint returns the passages on their own."
        link={GREY}
      >
        <Stage
          title="Citations arrive before the answer does"
          body="The first streamed chunk lists every passage the answer can cite, so a client can resolve each [n] as the text arrives, and the last chunk lists the ones it used. A models endpoint names the published version that answered."
        >
          <Fit width={1000} height={620}>
            <StreamStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Keys scoped to what they're for" body="Give each key the Retrieve, Chat or MCP scope, limit it to certain pipelines, and set a rate limit and an expiry. The full key is shown once, then only its prefix.">
            <Fit width={460} height={290}>
              <ApiKeysRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Just the passages, if you'd rather" body="The retrieve endpoint returns the top chunks for a query with their source, page or timestamp, score and how each was found, and writes no answer.">
            <Fit width={460} height={260}>
              <RetrieveRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="mcp"
        title="Grounded answers inside your AI tools"
        lead="An MCP server puts a pipeline and its knowledge bases in front of MCP clients such as Claude Desktop and Cursor, and only clients holding its API key can connect."
        link={GREY}
      >
        <CalloutStage
          left={MCP_LEFT}
          right={MCP_RIGHT}
          title="Four tools, with search and ask on from the start"
          body="New servers expose search and ask; switch on get_entity and list_sources when a client needs them. Copy the config for Claude Desktop or Cursor from the server's page, or take the server offline with one switch."
        >
          <div className="w-full lg:w-[460px]">
            <Fit width={460} height={560}>
              <McpServerSheet />
            </Fit>
          </div>
        </CalloutStage>
        <FeatureGrid>
          <FeatureCell title="Answers arrive with their sources" body="The ask tool runs the server's published pipeline and returns the answer followed by its numbered sources, pages and timestamps included.">
            <Fit width={460} height={250}>
              <McpAskRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Scope each server" body="Each server answers from one pipeline and the knowledge bases you pick, signs clients in with one of your API keys, and exposes only the tools you switch on.">
            <Fit width={460} height={352}>
              <McpServerDialogRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="widget"
        title="A chat bubble for your own site"
        lead="Paste one script tag and visitors can ask questions in a chat bubble that answers from your knowledge bases and names every source, on model keys you bring yourself."
        link={GREY}
      >
        <Stage
          title="Cited answers where your visitors already are"
          body="The widget streams each answer from one pipeline's published version, then lists its sources by title and page or timestamp. It loads only on the domains you allow."
        >
          <Fit width={1000} height={620}>
            <WidgetStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Make it sound like you" body="Set the title, greeting and placeholder, put the bubble on the left or the right, and hide the Powered by Grey footer.">
            <Fit width={460} height={300}>
              <WidgetSettingsRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="One script tag, your domains only" body="Each widget answers from one pipeline, loads only on the hostnames you allow, and can be disabled without touching your site.">
            <Fit width={460} height={250}>
              <WidgetsListRender />
            </Fit>
          </FeatureCell>
          <FeatureCell
            title="Your own model keys"
            body="Connect OpenAI, Anthropic, Google, Cohere, Voyage, AssemblyAI, OpenRouter or any OpenAI-compatible server, Ollama and vLLM included. Keys are kept in Vault and only their last four characters are shown."
          >
            <Fit width={460} height={326}>
              <ProvidersRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Usage in units, with a cap you set" body="Usage counts pages ingested, media minutes, retrievals, tokens and storage. When the monthly soft cap is reached, Grey can alert you only, pause ingestion but keep retrieval, or pause ingestion.">
            <Fit width={460} height={318}>
              <UsageRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>
    </AreaPage>
  );
}
