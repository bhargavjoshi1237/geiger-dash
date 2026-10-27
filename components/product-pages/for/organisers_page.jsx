import { AreaHero, AreaPage, AreaSection, FeatureCell, FeatureGrid, Fit, HeroArt, SplitShowcase, Stage } from "@/components/product-pages/area_kit";
import { findAudiencePage, AUDIENCE_PAGES } from "@/components/product-pages/tours";
import { ToolsRender } from "@/components/product-pages/plan/canvas_renders";
import {
  ApplicationBuilderRender,
  ApplicationsStage,
  DoorNightStage,
  FestivalBoardsRender,
  HarbourlightBoardStage,
  HarbourlightHeroWindow,
  KioskRender,
  NightBoardRender,
  NightDiscountsRender,
  NightSalesStage,
  RegularsRender,
  VolunteerSignupRender,
  WavesRender,
} from "@/components/product-pages/for/organisers_renders";

const PAGE = findAudiencePage("event-organisers");

const REGULARS = [
  { title: "Contact Book", body: "Lead, Active, VIP and Archived, with tags and segments" },
  { title: "Approval gates", body: "Approve a registration before the place is theirs" },
  { title: "Waitlist", body: "Promote the next guest by hand when a place opens" },
  { title: "Members portal", body: "Members buy a plan through Stripe and message you" },
];

// /for/event-organisers: a comedy club's month, from the planning board and act applications to tickets, the door and its regulars.
export function OrganisersPage() {
  return (
    <AreaPage area={PAGE.id} links={AUDIENCE_PAGES} linksLabel="Who Geiger is for">
      <AreaHero
        eyebrow={PAGE.eyebrow}
        title={PAGE.headline}
        art={
          <HeroArt focus={["64%", "33%"]} plane={{ "--plane-top": "-4%", "--plane-left": "8%" }}>
            <HarbourlightHeroWindow />
          </HeroArt>
        }
      />

      <AreaSection
        id="plan"
        title="Plan the night on one board"
        lead="Lay out the run of show, the line-up and every act's slot on a Geiger Notes board, with a board of its own for each part of the festival."
        link={{ label: "Geiger Notes: the board", href: "/apps/notes/canvas" }}
      >
        <Stage
          title="The whole night in one place"
          body="Put the run of show in a document card, the line-up in columns, the interval on a timer and each act's slot, set length and fee in a table, side by side on one canvas."
        >
          <Fit width={1000} height={620}>
            <HarbourlightBoardStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="A board of boards for the festival" body="Nest a board for the line-up, the volunteer rota and the bar inside the festival's own board, and keep the monthly nights in one place.">
            <Fit width={460} height={300}>
              <FestivalBoardsRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Thirty-one kinds of card" body="Timers, tables, polls, calendars, mind maps and sketches, plus embeds, Mermaid diagrams and formulas, for whatever the night needs.">
            <Fit width={470} height={290}>
              <ToolsRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="acts"
        title="Book the acts and the volunteers"
        lead="Take comedian applications and volunteer signups with Geiger Forms, then work through every response in one inbox."
        link={{ label: "Geiger Forms: the form builder", href: "/apps/forms/builder" }}
      >
        <Stage
          title="Every application, with a status"
          body="Applications land in an inbox where each one is Needs review, Pending, Approved, Rejected or Complete. Turn on approval routing and an act waits as Pending until the booker, then the host, has approved it."
        >
          <Fit width={1000} height={620}>
            <ApplicationsStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Ask for a clip with the application" body="Build the form from 36 field types, including file upload, so every act can send a recording of their set along with their details.">
            <Fit width={460} height={300}>
              <ApplicationBuilderRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="A signup that reads like a conversation" body="Switch the volunteer form to the conversational layout and it asks one question at a time, answered from the keyboard.">
            <Fit width={440} height={300}>
              <VolunteerSignupRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="tickets"
        title="Sell out the night"
        lead="Publish the night's page with Geiger Events and sell every seat through Stripe, from early birds to reserved front tables."
        link={{ label: "Geiger Events: tickets and checkout", href: "/apps/events/ticketing" }}
      >
        <Stage
          title="A page and a checkout for every night"
          body="Guests go from their details to seats, add-ons and a review, then pay by card through Stripe. Reserved seats are held for each guest while they check out, returning guests can use Express Lane, and free nights skip Stripe altogether."
        >
          <Fit width={1000} height={620}>
            <NightSalesStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Release tickets in waves" body="Open a wave now, on a date or once the one before it sells out. Between waves, buyers are told when the next one opens.">
            <Fit width={460} height={320}>
              <WavesRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Codes for regulars, groups and early birds" body="Run coupons, group rules, early-bird rules and affiliate codes from Discounts & Codes, and let checkout work out the price.">
            <Fit width={460} height={300}>
              <NightDiscountsRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="door"
        title="Run the door, then keep your regulars"
        lead="Scan tickets at the gate, record walk-ins, put the line-up on the venue's screens and watch the Overview count everyone in. Afterwards, every guest is in one contact book."
        link={{ label: "Geiger Events: check-in and the day", href: "/apps/events/check-in" }}
      >
        <Stage
          title="Scan at the gate, record walk-ins at the door"
          body="Volunteers open the check-in screen on a phone, scan QR tickets or search by name, email or ticket number, and a second scan of the same ticket is caught. Walk-ins are recorded as cash, card or comp at the door screen, which admits them but doesn't take the payment."
        >
          <Fit width={1000} height={620}>
            <DoorNightStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="A kiosk for the queue" body="Put a tablet at the entrance in kiosk mode, and guests can check themselves in or register on the spot.">
            <Fit width={440} height={270}>
              <KioskRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="The line-up on the venue's screens" body="Display boards put a title card, Now & Next or the full day grid on any screen in the room.">
            <Fit width={460} height={290}>
              <NightBoardRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
        <SplitShowcase
          items={REGULARS}
          active={0}
          title="Keep your regulars coming back"
          body="The Contact Book holds every guest as a Lead, Active, VIP or Archived contact, with tags, segments and data requests. Approve registrations, promote guests off the waitlist, and sell memberships through Stripe in a members portal where members can message you."
        >
          <Fit width={680} height={440}>
            <RegularsRender />
          </Fit>
        </SplitShowcase>
      </AreaSection>
    </AreaPage>
  );
}
