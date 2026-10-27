import { AreaHero, AreaPage, AreaSection, CalloutStage, FeatureCell, FeatureGrid, Fit, HeroArt, SplitShowcase, Stage } from "@/components/product-pages/area_kit";
import { TEAM_PAGES, findTeamPage } from "@/components/product-pages/tours";
import {
  BudgetRender,
  CapacityStage,
  CycleRender,
  DueTodayRender,
  GoalRender,
  MorningViewsRender,
  PlanUsageRender,
  PortfolioHeroWindow,
  PortfolioStage,
  ResourceRequestRender,
  RoadmapRender,
  SpendTrendRender,
  TeamProjectsRender,
} from "@/components/product-pages/teams/management_renders";

const PAGE = findTeamPage("management");

const GOAL_LEFT = [
  { title: "An owner and a date", body: "Every goal has someone answerable for it and a day it's due" },
  { title: "Milestones on the way", body: "Break the goal into the steps that prove it's moving" },
];

const GOAL_RIGHT = [
  { title: "Progress from the work", body: "The ring fills as the issues underneath close" },
  { title: "Health you can see", body: "On track, at risk or off track, at a glance" },
];

const BUDGET_POINTS = [
  { title: "Monthly budget", body: "Set what each line of spend is allowed this month" },
  { title: "Committed spend", body: "What's already been agreed against each line" },
  { title: "Forecast", body: "Where the month will land at the current rate" },
  { title: "Variance", body: "How far over or under budget each line will finish" },
];

// /teams/management: Brightwater Labs' head of delivery reads every project's health, sets goals and milestones, balances people across teams and watches the budget.
export function ManagementPage() {
  return (
    <AreaPage area={PAGE.id} links={TEAM_PAGES} linksLabel="Teams on Geiger">
      <AreaHero
        eyebrow={PAGE.eyebrow}
        title={PAGE.headline}
        art={
          <HeroArt focus={["68%", "40%"]} plane={{ "--plane-top": "6%", "--plane-left": "26%" }}>
            <PortfolioHeroWindow />
          </HeroArt>
        }
      />

      <AreaSection
        id="portfolio"
        title="Every project's health on one screen"
        lead="Each team's projects live in Geiger Flow, so the whole portfolio sits in one list: how far along it is, when it's due, how much is open and whether it's on track."
        link={{ label: "Geiger Flow: projects and planning", href: "/apps/flow/projects" }}
      >
        <Stage
          title="See what's slipping before the meeting"
          body="Sort the portfolio by health and the projects that need a decision rise to the top. Open one to read the lead's latest note, right where you spotted the problem."
        >
          <Fit width={1000} height={620}>
            <PortfolioStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="The questions you ask every morning" body="Saved views for Active, Urgent & high, Unassigned and Overdue cut across every team, so the day's priorities are one click away.">
            <Fit width={470} height={215}>
              <MorningViewsRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Every team in one organisation" body="Each team is a project in the same organisation, with the apps it works in and the people on it, so nothing sits in a tool you can't see.">
            <Fit width={460} height={265}>
              <TeamProjectsRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="goals"
        title="Goals and milestones that track themselves"
        lead="Set the quarter's goals, break them into milestones and let progress come from the work the teams close, not from a status meeting."
        link={{ label: "Geiger Flow: the issue tracker", href: "/apps/flow/issues" }}
      >
        <CalloutStage
          left={GOAL_LEFT}
          right={GOAL_RIGHT}
          title="A goal you can read in five seconds"
          body="Each goal shows its owner, due date, health and progress, with the milestones underneath ticking off as the teams finish them."
        >
          <Fit width={520} height={315}>
            <GoalRender />
          </Fit>
        </CalloutStage>
        <FeatureGrid>
          <FeatureCell title="Two quarters on one roadmap" body="Lay every project across the months ahead, coloured by health and filled by progress, with today marked so you can see what has to land next.">
            <Fit width={470} height={255}>
              <RoadmapRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Cycles that show the gap" body="Each team works in cycles. Watch completed work close on the scope line, and see in the last three days whether the cycle will make it.">
            <Fit width={460} height={240}>
              <CycleRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="capacity"
        title="Know who has room, and who doesn't"
        lead="The work queue shows what everyone is holding across every team, so you move people to the work before a deadline moves instead."
        link={{ label: "For operations teams", href: "/for/operations" }}
      >
        <Stage
          title="Load and requests side by side"
          body="Group the work queue by person to see who is full and who has room. Resource requests from project leads wait alongside, so you can approve one and assign the person in the same view."
        >
          <Fit width={1000} height={620}>
            <CapacityStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Ask for people before you need them" body="A project lead raises a resource request with the role, the dates and the reason. You approve or deny it, with a note, from the same list.">
            <Fit width={460} height={290}>
              <ResourceRequestRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="What's due, and what's late" body="The work queue counts what's queued, due today and overdue across every team, and lists the issues behind each number.">
            <Fit width={460} height={215}>
              <DueTodayRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="budget"
        title="See the spend coming"
        lead="Set the month's budget line by line, and Flow's budget tracker sets committed spend against it, forecasts where the month will land and shows the variance."
        link={{ label: "Geiger Flow: projects and planning", href: "/apps/flow/projects" }}
      >
        <SplitShowcase items={BUDGET_POINTS} active={3} title="The month's numbers before month end" body="Each line shows what's committed against its budget, the forecast for the month and how far over or under it will finish.">
          <Fit width={680} height={460}>
            <BudgetRender />
          </Fit>
        </SplitShowcase>
        <FeatureGrid>
          <FeatureCell title="The trend, not just the month" body="Six months of committed spend against the budget line show whether this month is a blip or a pattern.">
            <Fit width={460} height={260}>
              <SpendTrendRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Your own plan in view" body="The organisation's usage page shows seats, projects, storage and AI credits against the plan, so the suite's own cost never catches you out.">
            <Fit width={460} height={250}>
              <PlanUsageRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>
    </AreaPage>
  );
}
