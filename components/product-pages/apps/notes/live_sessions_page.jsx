import { AreaHero, AreaPage, AreaSection, FeatureCell, FeatureGrid, Fit, HeroArt, Stage } from "@/components/product-pages/area_kit";
import { findTour, findTourPage } from "@/components/product-pages/tours";
import {
  AccessRender,
  FollowRender,
  HostStage,
  JoinRender,
  LaserRender,
  MembersRender,
  MergeStage,
  PauseRender,
  PollTimerRender,
  RollbackRender,
  SessionHeroWindow,
  SessionStage,
} from "@/components/product-pages/apps/notes/sessions_renders";

const PAGE = findTourPage("notes", "live-sessions");
const NOTES = { label: "Geiger Notes", href: "/notes" };

// /apps/notes/live-sessions: hosting a live session on a board, running the room, then merging the session back.
export function NotesLiveSessionsPage() {
  return (
    <AreaPage area={PAGE.id} links={findTour("notes").pages} linksLabel="More from Geiger Notes">
      <AreaHero
        eyebrow={PAGE.eyebrow}
        title={PAGE.headline}
        art={
          <HeroArt focus={["62%", "30%"]} plane={{ "--plane-top": "0%", "--plane-left": "16%" }}>
            <SessionHeroWindow />
          </HeroArt>
        }
      />

      <AreaSection
        id="session"
        title="One code brings everyone in"
        lead="Host a live session from any board and share its GEIGER code. Everyone who joins works on the same board at once, with live cursors, a laser pointer and follow mode."
        link={NOTES}
      >
        <Stage
          title="Start a session from the board you're on"
          body="Press Start Session in the Collaborate dialog and Notes opens a live copy of the board with its own code. Share the code, and the host can end the session for everyone when the work is done."
        >
          <Fit width={1000} height={620}>
            <SessionStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Join with a code" body="Anyone on your team enters the GEIGER code in the Join tab and lands on the same board, cursor and all.">
            <Fit width={440} height={290}>
              <JoinRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Let people in, give them a role" body="Accept or decline requests to join, then make anyone view-only, a co-host or the host, or remove them from the session.">
            <Fit width={460} height={396}>
              <MembersRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Follow anyone, or lead the room" body="Click a face in the top bar to follow their view around the board. Hosts can lock every view to theirs while they present.">
            <Fit width={460} height={300}>
              <FollowRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Point, raise a hand, react" body="Turn on the laser to draw a fading trail across the board, raise a hand to speak next, or send a quick reaction to everyone.">
            <Fit width={460} height={300}>
              <LaserRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="host"
        title="Run the room from one panel"
        lead="Host controls gather what a facilitator needs: bring everyone to your view, spotlight a card, make an announcement, take raised hands in order and decide what participants can do."
        link={NOTES}
      >
        <Stage
          title="Host controls, all in one place"
          body="Bring everyone to you, fly the room to a spotlit card, lock every view to yours and send an announcement everyone sees. Raised hands queue in order, and Lower all clears them."
        >
          <Fit width={1000} height={620}>
            <HostStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Pause the room in one click" body="Pause all stops editing, joining, cursors and the laser at once, and Resume all gives them back. Each permission also has its own switch.">
            <Fit width={460} height={300}>
              <PauseRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Polls and timers for the room" body="Vote with single choice, multiple choice or dot voting, and time-box a round with a timer. Hosts decide whether participants can run them too.">
            <Fit width={460} height={300}>
              <PollTimerRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="merge"
        title="Bring the session back home"
        lead="A session works on its own copy of the board. When it's over, merge what the room added into your board, roll it back if you need to, and keep each board behind its own access level."
        link={NOTES}
      >
        <Stage
          title="Merge back into your board"
          body="The Merge tab lists the sessions you've hosted. Pick one to see how many cards it added and changed, then merge them in. The cards only on your board stay as they are."
        >
          <Fit width={1000} height={620}>
            <MergeStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Changed your mind? Roll it back" body="The Merge tab shows which sessions you've already merged. Every merge keeps the board as it was just before, so Rollback puts it back exactly as it was.">
            <Fit width={460} height={310}>
              <RollbackRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Lock a board behind a key" body="Make a board keyless or keyed, set a default level for the project, and give each member No access, View only, Can edit or Manage.">
            <Fit width={440} height={396}>
              <AccessRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>
    </AreaPage>
  );
}
