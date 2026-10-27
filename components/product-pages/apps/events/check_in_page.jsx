import { AreaHero, AreaPage, AreaSection, FeatureCell, FeatureGrid, Fit, HeroArt, Stage } from "@/components/product-pages/area_kit";
import { findTour, findTourPage } from "@/components/product-pages/tours";
import {
  AgendaRender,
  BoardStage,
  GateCrewStage,
  GatesZonesRender,
  GaugesRender,
  IssueDeskRender,
  KioskRender,
  LiveKpisRender,
  OperationsStage,
  ScannerWindow,
  ThemesRender,
  WalkInRender,
} from "@/components/product-pages/apps/events/check_in_renders";

const PAGE = findTourPage("events", "check-in");
const LINK = { label: "Geiger Events", href: "/events" };

// /apps/events/check-in: the staff routes at the door, display boards for the venue's screens, and the day's operations.
export function EventsCheckInPage() {
  return (
    <AreaPage area={PAGE.id} links={findTour("events").pages} linksLabel="More from Geiger Events">
      <AreaHero
        eyebrow={PAGE.eyebrow}
        title={PAGE.headline}
        art={
          <HeroArt focus={["66%", "42%"]} plane={{ "--plane-top": "4%", "--plane-left": "14%" }}>
            <ScannerWindow />
          </HeroArt>
        }
      />

      <AreaSection
        id="door"
        title="Every way in, counted once"
        lead="Staff open the check-in routes with an access code: a scanner at the gate, a till for walk-ins, a self check-in kiosk and a desk for handing out lanyards and merch."
        link={LINK}
      >
        <Stage
          title="A code for every crew"
          body="Give each crew a role with its own abilities, gates and zones, and an access code that opens the scanner on their phone. The scanner reads QR tickets, searches by name, email or ticket number, and flags anyone already checked in."
        >
          <Fit width={1000} height={620}>
            <GateCrewStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Walk-ins at the door" body="The door till sells a ticket and checks the buyer in in one step, recording the sale as cash, card or a comp. It records the payment rather than taking it.">
            <Fit width={460} height={300}>
              <WalkInRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="A kiosk for the queue" body="Kiosk mode opens on Tap anywhere to begin, then lets guests check themselves in by name or ticket number, or register on the spot.">
            <Fit width={460} height={300}>
              <KioskRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Gates, zones and sessions" body="Set up each event's entrances and restricted areas and break it into sessions. Staff pick their gate, zone and session on the scanner.">
            <Fit width={460} height={300}>
              <GatesZonesRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="A desk for lanyards and merch" body="The issuing desk looks a guest up, shows what they're entitled to collect, and records each item as it's handed over.">
            <Fit width={460} height={300}>
              <IssueDeskRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="screens"
        title="The running order on every screen"
        lead="Display boards turn the event's agenda into slides for the venue's screens, played from a public link that picks up changes every 30 seconds."
        link={LINK}
      >
        <Stage
          title="Now & Next, in the lobby and at the door"
          body="Build a board from Title card, Now & Next, Full day grid, Up next by room, Message and Image slides, set how long each stays on screen, and publish it to its live link."
        >
          <Fit width={1000} height={620}>
            <BoardStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="An agenda laid out by room" body="Build the running order in a grid or a list. Each session has a title, status, start and end time, track, room and speaker.">
            <Fit width={460} height={300}>
              <AgendaRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Four themes for any room" body="Show a board in Midnight, Slate, Paper or Ink to suit the screen and the light around it.">
            <Fit width={460} height={300}>
              <ThemesRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="day"
        title="Keep the day's work moving"
        lead="Track the jobs behind the event in its operations workspace, and watch registrations, revenue and check-ins come in on the Overview."
        link={LINK}
      >
        <Stage
          title="Every job, from new to complete"
          body="Operations modules such as speaker preparation and equipment checks hold their records in a table or on a board, each moving from New to In progress to Complete."
        >
          <Fit width={1000} height={620}>
            <OperationsStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="The day's numbers, live" body="The Overview reads your real registrations, orders and check-ins, with registrations over time beneath them.">
            <Fit width={460} height={300}>
              <LiveKpisRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Sold, and showed up" body="Two gauges compare seats sold with capacity and check-ins with registrations, so you can watch the room fill.">
            <Fit width={460} height={300}>
              <GaugesRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>
    </AreaPage>
  );
}
