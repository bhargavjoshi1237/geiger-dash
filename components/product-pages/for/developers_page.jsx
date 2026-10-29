import { AreaHero, AreaPage, AreaSection, FeatureCell, FeatureGrid, Fit, HeroArt, SplitShowcase, Stage } from "@/components/product-pages/area_kit";
import { findAudiencePage, AUDIENCE_PAGES } from "@/components/product-pages/tours";
import {
  ApiConsoleWindow,
  AssetKeysRender,
  AssetsApiStage,
  AssetWorkflowRender,
  ContentApiStage,
  DecideRender,
  DeliveryTokensRender,
  EmbedRender,
  EvalsRender,
  FormsRestRender,
  FormsWebhooksRender,
  GreyKeysRender,
  GreyStreamStage,
  McpConfigRender,
  ModelKeysRender,
  SchemaRender,
  VersionsCacheRender,
} from "@/components/product-pages/for/developers_renders";

const PAGE = findAudiencePage("developers");

const FORMS_API = [
  { title: "REST API", body: "Read forms and their responses with a bearer key" },
  { title: "Webhooks", body: "Response created, updated and approved, sent as they happen" },
  { title: "Delivery log", body: "Delivered, retrying or failed, with a replay for each" },
  { title: "embed.js", body: "One script tag puts a form inline on any page" },
];

// /for/developers: Orbital Freight's platform team serves content, images and grounded answers from Geiger's APIs and wires its forms in with webhooks.
export function DevelopersPage() {
  return (
    <AreaPage area={PAGE.id} links={AUDIENCE_PAGES} linksLabel="Who Geiger is for">
      <AreaHero
        title={PAGE.headline}
        art={
          <HeroArt focus={["65%", "34%"]} plane={{ "--plane-top": "0%", "--plane-left": "24%" }}>
            <ApiConsoleWindow />
          </HeroArt>
        }
      />

      <AreaSection
        id="content"
        title="Serve content to every front end"
        lead="Model your content once in Geiger Content and read it from a public REST API, with scoped tokens and the filters, sorting and pagination your front end expects."
        link={{ label: "Geiger Content: the delivery API", href: "/apps/content/delivery" }}
      >
        <Stage
          title="Typed fields in, clean JSON out"
          body="Content types hold Text, Number, Boolean, Date, Reference, Rich text, Enum, JSON and Media fields. The v2 API takes Strapi v5-style filters, sort, populate and pagination, and v1 serves entries by project or slug."
        >
          <Fit width={1000} height={620}>
            <ContentApiStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Tokens scoped to the job" body="Delivery tokens carry delivery:read, schema:read or both, and show whether they're Active, Expired or Revoked. A token that asks for more than it holds is refused.">
            <Fit width={460} height={330}>
              <DeliveryTokensRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Read the schema, not just the entries" body="The _schema endpoint describes every content type and its fields, so a client can check what it's about to receive.">
            <Fit width={480} height={345}>
              <SchemaRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Roll back a bad publish" body="Every entry keeps version snapshots you can compare and roll back to, and you can invalidate the cache on demand so the fix goes out straight away.">
            <Fit width={460} height={315}>
              <VersionsCacheRender />
            </Fit>
          </FeatureCell>
          <FeatureCell
            title="Personalise without ignoring consent"
            body="POST /api/decide picks the right variant for a slot, and visitors who declined personalisation only see untargeted content. The collect endpoint drops events from visitors who declined analytics."
          >
            <Fit width={460} height={300}>
              <DecideRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="assets"
        title="Images at the size each screen needs"
        lead="Keep every photo in Geiger Assets and let the URL choose its size, crop and format. Your services read and write the library over a REST API with scoped keys."
        link={{ label: "Geiger Assets: the library", href: "/apps/assets/library" }}
      >
        <Stage
          title="One original, any size on request"
          body="Ask for a width, height, fit, format and quality in the URL and Assets serves that variant. Turn on signed URLs and a referrer allow list, and anything else gets a 403."
        >
          <Fit width={1000} height={620}>
            <AssetsApiStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Keys that can only do their job" body="Each gk_live_ key gets only the scopes it needs, from assets:read and upload:write to collections and delivery.">
            <Fit width={460} height={310}>
              <AssetKeysRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Tell your systems when a file changes" body="Workflows run when an asset is approved, check its tags, and call your webhook so the app picks up the new photo.">
            <Fit width={460} height={290}>
              <AssetWorkflowRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="grounding"
        title="Ground your models in your own data"
        lead="Geiger Grey turns your playbooks and contracts into a pipeline your code can call: an OpenAI-compatible endpoint that streams cited answers, and an MCP server for the AI tools your team already uses."
        link={{ label: "Geiger Grey: API, MCP and widget", href: "/apps/grey/delivery" }}
      >
        <Stage
          title="Change the base URL, keep your client"
          body="Chat completions stream like any OpenAI response, with the citations announced up front and the ones used at the end. Models and retrieve endpoints sit beside it, and every call lands in the request log with the Playground, Widget and MCP traffic."
        >
          <Fit width={1000} height={620}>
            <GreyStreamStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Plug it into Claude Desktop or Cursor" body="Each pipeline can run an MCP server with search, ask, get_entity and list_sources tools, and Grey gives you the config to paste.">
            <Fit width={460} height={300}>
              <McpConfigRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Keys scoped to retrieve, chat or MCP" body="Give the customer app a chat key, the indexer a retrieve-only key and the team's editors an MCP key, and revoke one without touching the others.">
            <Fit width={460} height={220}>
              <GreyKeysRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Your model keys, your models" body="Bring keys for OpenAI, Anthropic, Google, OpenRouter, Mistral or Groq, or point Grey at your own Ollama or vLLM server.">
            <Fit width={460} height={230}>
              <ModelKeysRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Measure before you ship" body="Evaluations score a pipeline on faithfulness, answer relevance, context precision and context recall, so a change has numbers behind it.">
            <Fit width={440} height={250}>
              <EvalsRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="forms"
        title="Forms that talk to your stack"
        lead="Put a Geiger Form on any page with one script, read its responses over REST, and have every new, updated or approved response posted to your own endpoint."
        link={{ label: "Geiger Forms: sharing, payments and the API", href: "/apps/forms/share-and-sell" }}
      >
        <SplitShowcase
          items={FORMS_API}
          active={2}
          title="Every delivery on the record"
          body="Webhooks fire on Response created, updated and approved. The delivery log shows each one as Delivered, Retrying or Failed with its status code, and a failed delivery can be replayed."
        >
          <Fit width={680} height={440}>
            <FormsWebhooksRender />
          </Fit>
        </SplitShowcase>
        <FeatureGrid>
          <FeatureCell title="Responses over REST" body="List a form's responses with a bearer key, with their status, priority, tags and answers, and page through them with a cursor.">
            <Fit width={460} height={315}>
              <FormsRestRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="One script tag on your site" body="Drop embed.js and a data-geiger-form element onto any page, and the form renders inline, with every submission landing in the response inbox.">
            <Fit width={470} height={290}>
              <EmbedRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>
    </AreaPage>
  );
}
