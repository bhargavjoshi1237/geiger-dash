import { AreaHero, AreaPage, AreaSection, FeatureCell, FeatureGrid, Fit, HeroArt, Stage } from "@/components/product-pages/area_kit";
import { findTour, findTourPage } from "@/components/product-pages/tours";
import {
  AbTestRender,
  AnalyticsStage,
  ApprovalStage,
  AttributionRender,
  AutomationRender,
  BulkRender,
  CommentsRender,
  CountersignRender,
  ExportRender,
  InboxStage,
  InboxWindow,
  KanbanRender,
} from "@/components/product-pages/apps/forms/responses_renders";

const PAGE = findTourPage("forms", "responses");

// /apps/forms/responses: the response inbox, approvals and automations, and the analytics behind them.
export function FormsResponsesPage() {
  return (
    <AreaPage area={PAGE.id} links={findTour("forms").pages} linksLabel="More from Geiger Forms">
      <AreaHero
        eyebrow={PAGE.eyebrow}
        title={PAGE.headline}
        art={
          <HeroArt focus={["70%", "40%"]} plane={{ "--plane-top": "-2%", "--plane-left": "20%" }}>
            <InboxWindow />
          </HeroArt>
        }
      />

      <AreaSection
        id="inbox"
        title="One inbox for every submission"
        lead="Every response lands with a status, a priority and a score. Work through them in a table or on a board, save the views you come back to, and act on many at once."
        link={{ label: "Geiger Forms", href: "/forms" }}
      >
        <Stage
          title="Every answer, and where it came from"
          body="Open a response to change its status, priority and assignee. Its details show the score, completion time and A/B variant, plus the device and UTM tags it arrived with."
        >
          <Fit width={1000} height={620}>
            <InboxStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="A table or a board" body="Switch the same responses to a Kanban board with a column for each status, from Needs review and Pending to Approved.">
            <Fit width={460} height={300}>
              <KanbanRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Change many at once" body="Select responses to set their status or priority, add tags, assign them to a teammate or export them together.">
            <Fit width={480} height={300}>
              <BulkRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Talk it over on the response" body="Comments sit beside the answers, visible only to your team. Type @ to bring a teammate into the conversation.">
            <Fit width={460} height={300}>
              <CommentsRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Export or print what you need" body="Download responses as CSV or JSON, or print them as PDFs laid out by the form's document template.">
            <Fit width={460} height={300}>
              <ExportRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="approvals"
        title="Sign-off in steps, done for you"
        lead="Route each response through the approval steps you set, in order, and countersign the ones you accept. Automations act on new responses the moment they arrive."
        link={{ label: "Geiger Forms", href: "/forms" }}
      >
        <Stage
          title="Approvals that move one step at a time"
          body="Each step names the people who can decide it. A response waits as Pending until every step approves, any rejection closes it, and every decision is kept with its note."
        >
          <Fit width={1000} height={620}>
            <ApprovalStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Rules that run on every new response" body="When a response matches your conditions, an automation can set its status or priority, add a tag, assign it, send an email or call a webhook.">
            <Fit width={460} height={330}>
              <AutomationRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Countersign what you approve" body="Draw your signature and type your name, and both are stamped onto the response and its PDF with the time.">
            <Fit width={440} height={310}>
              <CountersignRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="analytics"
        title="From first view to submitted"
        lead="Forms record real views, starts and submissions. Follow the funnel over the last 7, 30 or 90 days, see which links bring people in, and test one title against another."
        link={{ label: "Geiger Forms", href: "/forms" }}
      >
        <Stage
          title="The numbers that matter, at a glance"
          body="The overview tracks new responses, form views, completion rate and average completion time against the previous period, with the funnel from form views to started filling to submitted."
        >
          <Fit width={1000} height={620}>
            <AnalyticsStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Know which links bring people in" body="Group views and submissions by UTM source, medium, campaign or referrer to see which channels convert.">
            <Fit width={460} height={300}>
              <AttributionRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Test one title against another" body="Split traffic between versions of a form's title and description, and a significance test tells you when one is winning.">
            <Fit width={460} height={300}>
              <AbTestRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>
    </AreaPage>
  );
}
