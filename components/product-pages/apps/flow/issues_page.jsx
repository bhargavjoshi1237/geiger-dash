import { AreaHero, AreaPage, AreaSection, FeatureCell, FeatureGrid, Fit, HeroArt, Stage } from "@/components/product-pages/area_kit";
import { findTourPage, findTour } from "@/components/product-pages/tours";
import {
  AssignEmailRender,
  CycleRender,
  DivisionsRender,
  GotoRender,
  IssueStage,
  LayoutRender,
  PresetViewsRender,
  ProjectBoardRender,
  RoadmapStage,
  SelectRender,
  TrackerWindow,
  TriageQueueStage,
} from "@/components/product-pages/apps/flow/issues_renders";

const PAGE = findTourPage("flow", "issues");
const FLOW = { label: "Geiger Flow", href: "/flow" };

// /apps/flow/issues: Flow's keyboard-first tracker, from triage and cycles to the Initiatives roadmap.
export function FlowIssuesPage() {
  return (
    <AreaPage area={PAGE.id} links={findTour("flow").pages} linksLabel="More from Geiger Flow">
      <AreaHero
        title={PAGE.headline}
        art={
          <HeroArt focus={["68%", "32%"]} plane={{ "--plane-top": "4%", "--plane-left": "24%" }}>
            <TrackerWindow />
          </HeroArt>
        }
      />

      <AreaSection
        id="tracker"
        title="Every issue a keystroke away"
        lead="Search everything with ⌘K, jump to any screen with G and a letter, and walk the list with J and K. Assign someone and they hear about it by email."
        link={FLOW}
      >
        <Stage
          title="An issue with everything on one screen"
          body="Each issue keeps its status, priority, assignees, labels, division, cycle, estimate and due date in a rail beside the description and comments. Status, priority, people, labels, division and cycle each open a picker you can type into."
        >
          <Fit width={1000} height={620}>
            <IssueStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="G, then a letter" body="Press G and then I, M, A, T, C, D, V, R or S to jump to the inbox, your issues, all issues, triage, cycles, divisions, views, initiatives or settings. C starts a new issue.">
            <Fit width={460} height={300}>
              <GotoRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Select with the keyboard, act on the lot" body="J and K move through the list, X selects, Enter opens. Select a few and set their status, priority, assignee or labels at once.">
            <Fit width={460} height={300}>
              <SelectRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Views for the usual questions" body="Ready-made views gather what is active, urgent and high, unassigned, overdue or still waiting for an estimate.">
            <Fit width={460} height={310}>
              <PresetViewsRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Assigned means told" body="Add someone to an issue and Flow emails them its title, project, priority and due date, with a link straight to it.">
            <Fit width={460} height={350}>
              <AssignEmailRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="triage"
        title="Sort the new work before it piles up"
        lead="Unassigned issues in the backlog wait in Triage until someone moves them on. Accepted work goes into cycles, laid out as a list or a board, grouped the way you read it."
        link={FLOW}
      >
        <Stage
          title="A triage queue you can clear in one pass"
          body="Triage groups new issues by priority. Accept them all into Todo, decline the lot, or select a few and set each one's state, including Canceled or Duplicate."
        >
          <Fit width={1000} height={620}>
            <TriageQueueStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Cycles with a burn-up" body="Each cycle charts its scope against completed work, beside the issue count, what has started, what is done and the points estimated.">
            <Fit width={460} height={290}>
              <CycleRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Lay it out your way" body="Switch between a list and a board, group by status, assignee, priority, division, cycle or label, order it, and choose which properties each row shows.">
            <Fit width={460} height={320}>
              <LayoutRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="roadmap"
        title="See every division on one timeline"
        lead="Initiatives lays each division and cycle across three, six or twelve months by its target date. Each project also keeps its own Issues board, with types and point estimates."
        link={FLOW}
      >
        <Stage
          title="A roadmap that flags what slipped"
          body="Initiatives draws every division and cycle as a bar with its progress and today marked. Anything past its target and unfinished turns red, and a click opens the division with its issues."
        >
          <Fit width={1000} height={620}>
            <RoadmapStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Divisions with a health and a target" body="Group the work behind a bigger outcome, give it a lead, a target date and a health of on track, at risk, completed or backlog, and watch its progress fill.">
            <Fit width={460} height={250}>
              <DivisionsRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="A board for the project's own issues" body="The project's Issues tab runs as a list or a board from Open to Resolved. Each issue is a task, bug, feature, improvement or chore, estimated from 1 to 13 points.">
            <Fit width={480} height={300}>
              <ProjectBoardRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>
    </AreaPage>
  );
}
