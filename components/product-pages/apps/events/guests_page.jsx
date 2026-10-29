import { AreaHero, AreaPage, AreaSection, FeatureCell, FeatureGrid, Fit, HeroArt, Stage } from "@/components/product-pages/area_kit";
import { findTour, findTourPage } from "@/components/product-pages/tours";
import {
  ApprovalEmailRender,
  ApprovalStage,
  ContactBookWindow,
  DataRequestsRender,
  DuplicatesStage,
  ImportRender,
  OrganiserInboxRender,
  PlanEditorRender,
  PortalStage,
  SegmentsRender,
  TagsRender,
  WaitlistRender,
} from "@/components/product-pages/apps/events/guests_renders";

const PAGE = findTourPage("events", "guests");
const LINK = { label: "Geiger Events", href: "/events" };

// /apps/events/guests: registrations and approvals, the Contact Book, and the members portal with its memberships and messages.
export function EventsGuestsPage() {
  return (
    <AreaPage area={PAGE.id} links={findTour("events").pages} linksLabel="More from Geiger Events">
      <AreaHero
        title={PAGE.headline}
        art={
          <HeroArt focus={["70%", "36%"]} plane={{ "--plane-top": "3%", "--plane-left": "12%" }}>
            <ContactBookWindow />
          </HeroArt>
        }
      />

      <AreaSection
        id="registrations"
        title="Decide who gets in"
        lead="Registrations from your event page, your team, imports and the API land in one list. Put an event behind approval and decide one by one or all at once."
        link={LINK}
      >
        <Stage
          title="An approval queue for every event"
          body="Approval Gates gathers the registrations waiting on you, event by event, with each guest's ticket, party size, dietary and access needs and answers. Approve or decline one, or the whole queue at once."
        >
          <Fit width={1000} height={620}>
            <ApprovalStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Promote from the waitlist" body="When places open, promote the next guest in line, or anyone further down, with one click.">
            <Fit width={460} height={300}>
              <WaitlistRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="An email when you say yes" body="Approving a registration emails the guest a link back to the event page to pick up where they left off.">
            <Fit width={460} height={300}>
              <ApprovalEmailRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="contacts"
        title="One book for every guest"
        lead="The Contact Book keeps one record per person, with their status, tags, notes, consent, activity and the events they've registered for."
        link={LINK}
      >
        <Stage
          title="Clean records, full histories"
          body="Find duplicate contacts and fold them into one record without losing tags, notes, consent or history. Each contact's Events tab lists the events they registered for, matched by email."
        >
          <Fit width={1000} height={620}>
            <DuplicatesStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Segments from rules" body="Group contacts by tag, status, company, location, consent or the events they're attending. A segment's members recompute as your contacts change.">
            <Fit width={460} height={300}>
              <SegmentsRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Bring in a spreadsheet" body="Import contacts from a CSV: upload it, map your columns to name, email, company, location and tags, preview, then import.">
            <Fit width={460} height={300}>
              <ImportRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Tags you can tidy" body="See how many contacts carry each tag, note what it means, and merge one tag into another.">
            <Fit width={460} height={300}>
              <TagsRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Data requests on a deadline" body="Log export, erasure and rectification requests and track each one to resolution against its 30-day due date.">
            <Fit width={460} height={300}>
              <DataRequestsRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="members"
        title="A portal for your members"
        lead="Guests sign in to a members portal for their tickets, orders, memberships and messages, and can buy a membership there through Stripe."
        link={LINK}
      >
        <Stage
          title="Memberships with something behind them"
          body="A plan's benefits can unlock recordings to watch and rooms to walk into, on site or online. Members join from the portal with a one-time payment through Stripe, and message you from the same place."
        >
          <Fit width={1000} height={620}>
            <PortalStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Plans in three tabs" body="Set a plan's price in Pricing, its perks and what it unlocks in Benefits, and how it describes itself in Details.">
            <Fit width={460} height={300}>
              <PlanEditorRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Answer members where they ask" body="Questions from the portal arrive in your Messages inbox. Reply there and the member sees your answer in their portal.">
            <Fit width={460} height={300}>
              <OrganiserInboxRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>
    </AreaPage>
  );
}
