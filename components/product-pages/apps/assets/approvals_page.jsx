import { AreaHero, AreaPage, AreaSection, FeatureCell, FeatureGrid, Fit, HeroArt, Stage } from "@/components/product-pages/area_kit";
import { findTour, findTourPage } from "@/components/product-pages/tours";
import {
  ApprovalsWindow,
  ApproversRender,
  HistoryRender,
  ModeRender,
  NewReviewRender,
  PipelineStage,
  PipelinesRender,
  ReviewStage,
  RunHistoryRender,
  TemplatesRender,
  TriggersRender,
  WorkflowStage,
} from "@/components/product-pages/apps/assets/approvals_renders";

const PAGE = findTourPage("assets", "approvals");
const LINK = { label: "Geiger Assets", href: "/assets" };

// /apps/assets/approvals: reviews, approval pipelines and event-triggered workflows, around Cobalt Retail's lookbook sign-off.
export function AssetsApprovalsPage() {
  return (
    <AreaPage area={PAGE.id} links={findTour("assets").pages} linksLabel="More from Geiger Assets">
      <AreaHero
        eyebrow={PAGE.eyebrow}
        title={PAGE.headline}
        art={
          <HeroArt focus={["68%", "46%"]} plane={{ "--plane-top": "-6%", "--plane-left": "20%" }}>
            <ApprovalsWindow />
          </HeroArt>
        }
      />

      <AreaSection
        id="reviews"
        title="Every review on one board"
        lead="Gather the files that need sign-off into a review, give it a priority and a due date, and see what is in flight, sent back or late at a glance."
        link={LINK}
      >
        <Stage
          title="Decide file by file, with the reasons on record"
          body="Approve, send back or reject each file in a review. Comments sit beside the files, and every decision on the current stage counts toward its sign-offs."
        >
          <Fit width={1000} height={620}>
            <ReviewStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Ask for sign-off in one dialog" body="Name it, choose the pipeline it runs through, set a priority and a due date of three days, a week or two weeks, then attach the files.">
            <Fit width={460} height={300}>
              <NewReviewRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Who decided what, and when" body="The decision history keeps every sign-off, rejection and change request, with the stage it was made on and the note that came with it.">
            <Fit width={460} height={300}>
              <HistoryRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="pipelines"
        title="Pipelines that route the sign-off"
        lead="Build the route once: who approves at each stage, how many sign-offs each stage needs, and what happens when the last one clears."
        link={LINK}
      >
        <Stage
          title="Lock the version that was approved"
          body="When the final stage signs off, the pipeline can mark the files approved and lock the approved version, so it can't be swapped without a new review."
        >
          <Fit width={1000} height={620}>
            <PipelineStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="In order, or all at once" body="A sequential pipeline opens each stage only when the one before it clears. Set it to Anytime and every stage can act in any order.">
            <Fit width={460} height={300}>
              <ModeRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="A pipeline for each kind of work" body="Route assets, collections, galleries or shared links through their own pipelines, and keep each one as a Draft, Active or Paused.">
            <Fit width={460} height={300}>
              <PipelinesRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Name the approvers" body="Let anyone with a role approve a stage, or pick specific people and say how many of them have to sign off.">
            <Fit width={440} height={300}>
              <ApproversRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Start from a template" body="Begin with a blank pipeline or a ready-made route such as Brand review, Client delivery or External access, then change it to fit.">
            <Fit width={460} height={300}>
              <TemplatesRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="workflows"
        title="Workflows that act on the result"
        lead="When a file is uploaded, sent for review, approved or rejected, a workflow can move it, set its status, tag it and call your own systems with a webhook."
        link={LINK}
      >
        <Stage
          title="From approval to the next step, on its own"
          body="Lay out a trigger, conditions and actions on the canvas. Each run logs what every step did, from the folder a file moved to the response the webhook got back."
        >
          <Fit width={1000} height={620}>
            <WorkflowStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Triggered by what happens to a file" body="Start a workflow when an asset is uploaded, sent for review, approved or rejected, then move, set status, tag, untag or send a webhook.">
            <Fit width={460} height={300}>
              <TriggersRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Every run on the record" body="Run History shows each run with its trigger, outcome, duration and steps, so a skipped or failed run is easy to find and read.">
            <Fit width={460} height={300}>
              <RunHistoryRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>
    </AreaPage>
  );
}
