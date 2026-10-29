import { AreaHero, AreaPage, AreaSection, FeatureCell, FeatureGrid, Fit, HeroArt, Stage } from "@/components/product-pages/area_kit";
import { findTourPage, findTour } from "@/components/product-pages/tours";
import {
  CitedAnswerStage,
  ConversationsRender,
  EvaluationsStage,
  FeedbackRender,
  KnowledgeOnlyRender,
  PipelinesListRender,
  PipelineStage,
  PlaygroundChatWindow,
  PromptRender,
  RequestTraceRender,
  RunSettingsRender,
  TimestampRender,
} from "@/components/product-pages/apps/grey/answers_renders";

const PAGE = findTourPage("grey", "answers");

const GREY = { label: "Geiger Grey", href: "/grey" };

// /apps/grey/answers: cited answers in the Playground, pipelines that shape them and the screens that measure them.
export function GreyAnswersPage() {
  return (
    <AreaPage area={PAGE.id} links={findTour("grey").pages} linksLabel="More from Geiger Grey">
      <AreaHero
        title={PAGE.headline}
        art={
          <HeroArt focus={["60%", "36%"]} plane={{ "--plane-top": "6%", "--plane-left": "4%" }}>
            <PlaygroundChatWindow />
          </HeroArt>
        }
      />

      <AreaSection
        id="citations"
        title="Every claim points to its source"
        lead="Ask in the Playground and each sentence carries a numbered citation. Open one to read the passage, or see every passage the model was sent and how well it matched."
        link={GREY}
      >
        <Stage
          title="See exactly what the model was given"
          body="Each reply records the passages it was sent, with their retrieval scores, token counts and which ones it cited. Click a citation to read the passage and open the source."
        >
          <Fit width={1000} height={620}>
            <CitedAnswerStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Keep it to your own sources" body="Knowledge base only is on by default in the Playground. Turn it off and the model may add general knowledge, and it says when it does.">
            <Fit width={460} height={300}>
              <KnowledgeOnlyRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Try a setting without saving it" body="Run settings show the pipeline's model, search, threshold, rerank, graph and citation settings. Override the temperature or the number of passages for this tab only.">
            <Fit width={460} height={290}>
              <RunSettingsRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Citations land on the page or the second" body="A citation names the page of a document or the moment in a recording. Open a cited video and it starts where the passage begins.">
            <Fit width={460} height={250}>
              <TimestampRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Every conversation, from every channel" body="Conversations keeps the chats from the Playground, the widget and the API, each with its transcript, citations and feedback.">
            <Fit width={460} height={240}>
              <ConversationsRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="pipelines"
        title="Tune how it finds the answer"
        lead="A pipeline holds the model, the knowledge bases, the retrieval settings and the prompt. Change it, try it in the Playground, then publish it as a new live version."
        link={GREY}
      >
        <Stage
          title="Retrieval settings you can read at a glance"
          body="Set how many passages to fetch, the similarity threshold, hybrid search, reranking and citations, and when to consult the knowledge graph: off, auto or always. Publishing snapshots the configuration as a new version and makes it live."
        >
          <Fit width={1000} height={620}>
            <PipelineStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Drafts stay out of the way" body="A pipeline stays a draft until you publish it, and each one answers from the knowledge bases and model you chose for it.">
            <Fit width={460} height={280}>
              <PipelinesListRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="A system prompt in your own words" body="Write the instruction every answer is grounded with, and place the retrieved passages and the question where you want them.">
            <Fit width={460} height={270}>
              <PromptRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="quality"
        title="Measure it before people rely on it"
        lead="Score a pipeline against your own questions, triage the thumbs-downs and unanswered questions, and trace any request back to the passages it used."
        link={GREY}
      >
        <Stage
          title="Evaluations on four measures"
          body="Build eval sets of questions with expected answers and sources, then run them against a pipeline. Each run is scored for faithfulness, answer relevance, context precision and context recall."
        >
          <Fit width={1000} height={620}>
            <EvaluationsStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Turn a thumbs-down into a test" body="Feedback gathers negative and unanswered replies. Open the conversation, resolve it, or add it to an eval set so the next run checks it.">
            <Fit width={460} height={310}>
              <FeedbackRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Trace any request" body="Request Logs covers the Playground, the widget, the API and MCP. Open a request to see the chunks it retrieved, how each was found and its score.">
            <Fit width={460} height={350}>
              <RequestTraceRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>
    </AreaPage>
  );
}
