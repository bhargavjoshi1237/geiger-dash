import { AreaHero, AreaPage, AreaSection, CalloutStage, FeatureCell, FeatureGrid, Fit, HeroArt, SplitShowcase, Stage } from "@/components/product-pages/area_kit";
import {
  ApiRender,
  EvaluationsRender,
  FormatsRender,
  FreshnessRender,
  GraphStage,
  GroundedStage,
  McpRender,
  PlaygroundWindow,
  PresetsRender,
  ProvidersRender,
  VersionsRender,
  WidgetRender,
} from "@/components/product-pages/ai/grey_renders";
import {
  ArticleAiRender,
  FormsRuleRender,
  GapsStage,
  NotesAiRender,
  RunHistoryRender,
  SteerRender,
  SummaryRender,
  WorkflowCanvasRender,
} from "@/components/product-pages/ai/assist_renders";

const AUTOMATIONS = [
  { title: "Workflows", body: "Ten triggers, eight conditions and the actions that follow" },
  { title: "Routing rules", body: "Round robin, balanced workload or direct assignment" },
  { title: "SLA policies", body: "First response, next response and resolution targets" },
  { title: "Form automations", body: "Set, tag, assign, email or call a webhook on a match" },
];

// /ai: Grey's knowledge bases and the ways out of them, AI inside Comms, Notes and Content, and rule-based automation.
export function AiPage() {
  return (
    <AreaPage area="ai">
      <AreaHero
        eyebrow="AI and automation"
        title="Put your team's knowledge to work"
        art={
          <HeroArt focus={["62%", "30%"]} plane={{ "--plane-top": "-2%" }}>
            <PlaygroundWindow typed="Which plans include priority support?" />
          </HeroArt>
        }
      />

      <AreaSection
        id="knowledge"
        title="Answers grounded in your own sources"
        lead="Grey turns your documents, recordings, web pages and notes into a knowledge base, then answers questions from it with a citation for every claim."
        link={{ label: "Geiger Grey", href: "/grey" }}
      >
        <Stage
          title="Every answer shows its working"
          body="Hybrid search finds the passages, the knowledge graph adds related facts, and each sentence carries a numbered citation back to the page or the timestamp it came from."
        >
          <Fit width={1000} height={620}>
            <GroundedStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Bring in almost any file" body="PDFs, Office documents, EPUB, HTML, Markdown, CSV and JSON, plus audio, video and images. Upload them, pull them from Assets or Notes, or give Grey a URL.">
            <Fit width={460} height={300}>
              <FormatsRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Choose how carefully it reads" body="Ingestion presets trade speed for accuracy, from plain-text parsing to vision models that understand page layouts, with chunking to match.">
            <Fit width={460} height={300}>
              <PresetsRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Know which sources need a look" body="Every source is marked verified, review due or stale, so answers don't quietly rest on last year's policy.">
            <Fit width={440} height={290}>
              <FreshnessRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Score the answers before customers see them" body="Evaluations grade a pipeline for faithfulness, answer relevance, context precision and context recall, using an LLM as the judge.">
            <Fit width={440} height={270}>
              <EvaluationsRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="graph"
        title="See how your knowledge connects"
        lead="As Grey reads, it picks out the people, products and policies in your sources and the relations between them, then lets you explore them as a graph."
      >
        <Stage
          title="A knowledge graph you can walk through"
          body="Open the Graph Explorer in 2D or 3D, inspect any entity with its relations and confidence scores, and merge duplicates when two names mean the same thing."
        >
          <Fit width={1000} height={640}>
            <GraphStage />
          </Fit>
        </Stage>
      </AreaSection>

      <AreaSection
        id="delivery"
        title="Take it wherever your team works"
        lead="Every pipeline is an OpenAI-compatible endpoint, an MCP server for your AI tools and a chat widget for your site, running on models from providers you already pay for."
      >
        <CalloutStage
          left={[
            { title: "OpenAI-compatible API", body: "Chat completions, retrieval and model endpoints for every pipeline" },
            { title: "Scoped API keys", body: "Grant retrieve, chat or MCP access, key by key" },
          ]}
          right={[
            { title: "MCP server", body: "Search, ask, get_entity and list_sources for Claude Desktop, Cursor and other clients" },
            { title: "Embeddable widget", body: "One script tag puts a cited chat on any page" },
          ]}
          title="One knowledge base, many ways in"
          body="Your AI tools call Grey's MCP tools to search and ask with citations, the same answers your API and widget return."
        >
          <div className="w-full lg:w-[440px]">
            <Fit width={440} height={312}>
              <McpRender />
            </Fit>
          </div>
        </CalloutStage>
        <FeatureGrid>
          <FeatureCell title="Change one base URL" body="Point any OpenAI client at a pipeline and keep the code you have. Retrieval-only calls return the matching chunks without writing an answer.">
            <Fit width={470} height={260}>
              <ApiRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="A cited chat on your own site" body="Add one script tag and visitors can ask questions in a widget that cites its sources. The Powered by Grey footer can be hidden.">
            <Fit width={470} height={300}>
              <WidgetRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Your keys, your models" body="Use models from OpenAI, Anthropic, Google, Cohere, Voyage and others. Keys are stored in Vault, and only their last four characters are ever shown.">
            <Fit width={460} height={290}>
              <ProvidersRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Change a pipeline without breaking it" body="Pipelines are versioned. Try a change as a draft in the Playground, then promote it to live when the answers hold up.">
            <Fit width={440} height={200}>
              <VersionsRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="in-the-apps"
        title="AI where the work already happens"
        lead="Comms, Notes and Content use your own model keys to summarise, draft and spot what's missing, inside the screen you're already working in."
        link={{ label: "Geiger Comms", href: "/comms" }}
      >
        <Stage
          title="Find the questions your help center can't answer"
          body="Knowledge Gaps groups unanswered customer questions into topics, ranks them by impact and trend, and lines up the articles that almost answer them so you can write or fix one."
        >
          <Fit width={1000} height={620}>
            <GapsStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Catch up on a thread in seconds" body="Copilot in Comms sums up a conversation in a few bullets you can insert as an internal note, and says which model wrote them.">
            <Fit width={440} height={250}>
              <SummaryRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Write help articles faster" body="Improve, shorten or expand a draft, change its tone, suggest titles or translate it into the languages your help center serves.">
            <Fit width={460} height={350}>
              <ArticleAiRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Turn a wall of stickies into next steps" body="The AI assistant card on a Notes board can summarise, cluster or brainstorm, or pull out action items and spawn them as new notes.">
            <Fit width={470} height={310}>
              <NotesAiRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="A feed your readers can steer" body="Content ranks a personalised feed from likes, saves, skips and dwell time. Tune exploration and variety, or ask for more of something for the next three days.">
            <Fit width={440} height={260}>
              <SteerRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="automation"
        title="Automations that run on their own"
        lead="Not everything needs a model. Rules in Comms and Forms route, tag, nudge and close the routine work the same way every time."
      >
        <SplitShowcase
          items={AUTOMATIONS}
          active={0}
          title="Build it on a canvas"
          body="Comms workflows chain a trigger, conditions and actions, waits included, so a quiet conversation gets one friendly nudge and then closes itself."
        >
          <Fit width={560} height={440}>
            <WorkflowCanvasRender />
          </Fit>
        </SplitShowcase>
        <FeatureGrid>
          <FeatureCell title="A rule for every response" body="Forms automations check each new response and set its status and priority, assign it, email someone or call a webhook when it matches.">
            <Fit width={460} height={290}>
              <FormsRuleRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="See every run" body="Run history lists each workflow execution with its status and duration, so the one step that failed is easy to find.">
            <Fit width={460} height={260}>
              <RunHistoryRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>
    </AreaPage>
  );
}
