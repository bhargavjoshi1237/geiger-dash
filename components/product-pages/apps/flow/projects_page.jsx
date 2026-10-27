import { AreaHero, AreaPage, AreaSection, FeatureCell, FeatureGrid, Fit, HeroArt, Stage } from "@/components/product-pages/area_kit";
import { findTourPage, findTour } from "@/components/product-pages/tours";
import {
  AllocationsRender,
  AssetsRender,
  BudgetStage,
  KeyResultsRender,
  LogsRender,
  MilestonesRender,
  ObjectivesStage,
  ProjectWindow,
  QueueActionsRender,
  RequestsRender,
  TasksStage,
  WorkQueueRender,
} from "@/components/product-pages/apps/flow/projects_renders";

const PAGE = findTourPage("flow", "projects");
const FLOW = { label: "Geiger Flow", href: "/flow" };

// /apps/flow/projects: Flow's project screens, from tasks and the work queue to goals, people, budget and logs.
export function FlowProjectsPage() {
  return (
    <AreaPage area={PAGE.id} links={findTour("flow").pages} linksLabel="More from Geiger Flow">
      <AreaHero
        eyebrow={PAGE.eyebrow}
        title={PAGE.headline}
        art={
          <HeroArt focus={["68%", "40%"]} plane={{ "--plane-top": "-2%", "--plane-left": "24%" }}>
            <ProjectWindow />
          </HeroArt>
        }
      />

      <AreaSection
        id="tasks"
        title="Tasks that move through every stage"
        lead="Every task has a status, a priority and a stage, from planning through testing, deploy and merge. The work queue lines up what is due today."
        link={FLOW}
      >
        <Stage
          title="From the backlog to merged, on one task"
          body="The Tasks screen counts what is in progress, overdue and done. Open a task to set its status, priority and type, move it through the stages, and talk it over in its comments."
        >
          <Fit width={1000} height={620}>
            <TasksStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="A queue for today" body="The Work Queue orders assigned work and follow-ups, and counts what is queued, due today, overdue and how far along it all is.">
            <Fit width={460} height={260}>
              <WorkQueueRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Move it on from the list" body="Mark an item in progress or done, or send it back to to do, straight from its row.">
            <Fit width={460} height={240}>
              <QueueActionsRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="goals"
        title="Goals with the work counted in"
        lead="Objectives gather goals on a board with columns you can add yourself. Goals list their key results, and milestones count the tasks in scope."
        link={FLOW}
      >
        <Stage
          title="An objective's goals on a board"
          body="Drag goals between Not Started, On Track, At Risk and Completed, or add columns of your own. Each card shows its key results, progress, target date and owner."
        >
          <Fit width={1000} height={620}>
            <ObjectivesStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Key results you can tick off" body="Give each goal a status, an owner, a target date and the key results that define it, then track it by the count of tasks behind it.">
            <Fit width={460} height={350}>
              <KeyResultsRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Milestones that count their tasks" body="A milestone is a collection of tasks with a target date. See the tasks in scope, how many are done, and which milestones are overdue.">
            <Fit width={460} height={240}>
              <MilestonesRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="resources"
        title="People, spend and every change on record"
        lead="Allocate people and decide on what they ask for, roll costed architecture into a monthly budget, and read back each change in the log."
        link={FLOW}
      >
        <Stage
          title="A budget that knows what the stack costs"
          body="Set a monthly budget and track what is used, the forecast, the variance and items to watch. Put a monthly cost on any System Architecture node and it rolls into infrastructure expense."
        >
          <Fit width={1000} height={620}>
            <BudgetStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Requests with a yes or no" body="Log a request for a person or a tool. It waits as pending until someone approves or denies it.">
            <Fit width={460} height={240}>
              <RequestsRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="See who is stretched" body="Allocations show each person's role, dates and load as active, planned or completed, and flag anyone over 80%.">
            <Fit width={460} height={270}>
              <AllocationsRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="A log that writes itself" body="Creating, changing or deleting a task, issue, goal or milestone adds a line to the project's log. Filter it by info, warning, error or debug.">
            <Fit width={460} height={260}>
              <LogsRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Files kept with the project" body="Upload images, video, documents, audio and archives, see storage split by type, and sort by newest, oldest, largest or name.">
            <Fit width={460} height={300}>
              <AssetsRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>
    </AreaPage>
  );
}
