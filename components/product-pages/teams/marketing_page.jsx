import { AreaHero, AreaPage, AreaSection, CalloutStage, FeatureCell, FeatureGrid, Fit, HeroArt, SplitShowcase, Stage } from "@/components/product-pages/area_kit";
import { TEAM_PAGES, findTeamPage } from "@/components/product-pages/tours";
import {
  ActionItemsStage,
  DoorScanRender,
  FollowPlanRender,
  LaunchApiRender,
  LaunchBoardsRender,
  LaunchHeroWindow,
  LaunchMetricsRender,
  LaunchQueueRender,
  ListeningNightStage,
  NightWaitlistRender,
  PressKitApprovalRender,
  PressKitWorkflowRender,
  SignupEmbedRender,
  SignupRuleRender,
  SignupSourcesRender,
  TitleTestRender,
  WaitlistInboxRender,
} from "@/components/product-pages/teams/marketing_renders";

const PAGE = findTeamPage("marketing");

const SIGNUP_POINTS = [
  { title: "Saved views", body: "One for each city, one for the reviewers" },
  { title: "Statuses and tags", body: "Mark who's in and why, a few at a time or all at once" },
  { title: "Where they came from", body: "Every sign-up keeps its UTM source and referrer" },
  { title: "Comments on the response", body: "Talk it over without leaving the inbox" },
];

const PUBLISH_LEFT = [
  { title: "A date on each entry", body: "The launch page goes live at 9:00 on the day" },
  { title: "Review before it ships", body: "Entries wait in review until someone approves them" },
];

const PUBLISH_RIGHT = [
  { title: "Versions you can restore", body: "Compare two snapshots and roll back in a click" },
  { title: "One API for the site", body: "Your site reads each published entry by its slug" },
];

// /teams/marketing: Hollis Audio's marketing team launches the Arc headphones, from the plan in Notes and the waitlist in Forms to the listening night in Events and the pages in Content.
export function MarketingPage() {
  return (
    <AreaPage area={PAGE.id} links={TEAM_PAGES} linksLabel="Teams on Geiger">
      <AreaHero
        title={PAGE.headline}
        art={
          <HeroArt focus={["60%", "38%"]} plane={{ "--plane-top": "6%", "--plane-left": "28%" }}>
            <LaunchHeroWindow />
          </HeroArt>
        }
      />

      <AreaSection
        id="plan"
        title="Plan the launch on one board"
        lead="The Arc launch lives on a Geiger Notes board: the key image, a column for each week, the dates that matter and a board for each workstream, with the whole team on it at once."
        link={{ label: "Geiger Notes: the board", href: "/apps/notes/canvas" }}
      >
        <Stage
          title="Turn the plan into a to-do list"
          body="Wire the launch-week column, the timeline and the open comments into the AI assistant card and run Action items. It lists what has to happen, ready to add to the board as notes."
        >
          <Fit width={1000} height={620}>
            <ActionItemsStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="A board for each workstream" body="Give the listening night, the early-access list and the press kit a board each inside the launch, and open any of them with a double click.">
            <Fit width={460} height={290}>
              <LaunchBoardsRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Walk the team through it live" body="Start a live session and everyone's cursor shows on the board. Follow whoever is presenting the plan as they move from card to card.">
            <Fit width={460} height={300}>
              <FollowPlanRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="sign-ups"
        title="Turn interest into a list"
        lead="An early-access form in Geiger Forms collects every sign-up, and its response inbox shows who they are, where they heard about Arc and whether they want a place at the listening night."
        link={{ label: "Geiger Forms: responses and approvals", href: "/apps/forms/responses" }}
      >
        <SplitShowcase items={SIGNUP_POINTS} active={0} title="Every sign-up in one inbox" body="Save a view for each city, then work through the sign-ups that need review, with each one's source, status and tags beside their name.">
          <Fit width={680} height={460}>
            <WaitlistInboxRender />
          </Fit>
        </SplitShowcase>
        <FeatureGrid>
          <FeatureCell title="See which links bring people in" body="Group views and sign-ups by UTM source, medium or campaign to see which channel actually fills the list.">
            <Fit width={460} height={250}>
              <SignupSourcesRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Rules that run on every sign-up" body="When someone asks for a listening-night place, an automation tags them, assigns them to the event lead and sends them an email.">
            <Fit width={460} height={300}>
              <SignupRuleRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Put the form on the teaser page" body="Embed the form on your own site with one snippet, inline or as a popup, so people sign up without leaving the page.">
            <Fit width={460} height={300}>
              <SignupEmbedRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Test one title against another" body="Split traffic between two versions of the form's title and description, and a significance test tells you when one is winning.">
            <Fit width={460} height={300}>
              <TitleTestRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="launch-night"
        title="Run the launch night"
        lead="The listening night sells and checks in through Geiger Events: a free place for the waitlist behind a code, paid tickets in waves for everyone else, and QR tickets scanned at the door."
        link={{ label: "Geiger Events: tickets and checkout", href: "/apps/events/ticketing" }}
      >
        <Stage
          title="The waitlist gets first pick"
          body="Hide the waitlist ticket behind an access code and send the code to the list. Free tickets complete without a card, and general admission opens in waves once the first one sells out."
        >
          <Fit width={1000} height={620}>
            <ListeningNightStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Scan them in at the door" body="Staff open the scanner on their phone and scan each guest's QR ticket. Each ticket is admitted once, and the count updates as the room fills.">
            <Fit width={460} height={320}>
              <DoorScanRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Promote from the waitlist" body="When places open up, promote the next guest in line, or anyone further down, with one click.">
            <Fit width={460} height={290}>
              <NightWaitlistRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="publish"
        title="Ship the pages and the press kit"
        lead="The launch page and its stories go live from Geiger Content on a date you set, and the press kit's files are signed off in Geiger Assets before anyone outside sees them."
        link={{ label: "Geiger Content: publishing and versions", href: "/apps/content/publishing" }}
      >
        <CalloutStage
          left={PUBLISH_LEFT}
          right={PUBLISH_RIGHT}
          title="Line up launch day"
          body="The publishing queue shows every entry in the launch, from the launch page to the reviews round-up, with its status and the date it goes live."
        >
          <Fit width={540} height={430}>
            <LaunchQueueRender />
          </Fit>
        </CalloutStage>
        <FeatureGrid>
          <FeatureCell title="Signed off before it goes out" body="Brand, legal and product marketing each approve the press kit's images in their own stage, and the approved version locks when the last one says yes.">
            <Fit width={470} height={240}>
              <PressKitApprovalRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Approved files file themselves" body="A workflow moves each approved image into the press kit folder, tags it for the launch and tells the press site through a webhook.">
            <Fit width={470} height={290}>
              <PressKitWorkflowRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="The site reads it from the API" body="Your site asks the delivery API for the launch page by its slug and builds the hero from the answer.">
            <Fit width={470} height={320}>
              <LaunchApiRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Count views and conversions" body="Send the launch page's views and conversions to the collect endpoint and they roll up into daily figures for each entry. Visitors who declined analytics aren't counted.">
            <Fit width={460} height={300}>
              <LaunchMetricsRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>
    </AreaPage>
  );
}
