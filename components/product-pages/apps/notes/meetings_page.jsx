import { AreaHero, AreaPage, AreaSection, FeatureCell, FeatureGrid, Fit, HeroArt, Stage } from "@/components/product-pages/area_kit";
import { findTour, findTourPage } from "@/components/product-pages/tours";
import {
  ActionItemsStage,
  AiBrainstormRender,
  AiCustomRender,
  AiStage,
  HuddleRender,
  MeetStage,
  MeetTabRender,
  MeetingHeroWindow,
  ParticipantMenuRender,
  PersonRender,
  StatusRender,
  TxtExportRender,
} from "@/components/product-pages/apps/notes/meetings_renders";

const PAGE = findTourPage("notes", "meetings");
const NOTES = { label: "Geiger Notes", href: "/notes" };

// /apps/notes/meetings: video meetings docked on the board, the AI assistant card, and leaving with the action items.
export function NotesMeetingsPage() {
  return (
    <AreaPage area={PAGE.id} links={findTour("notes").pages} linksLabel="More from Geiger Notes">
      <AreaHero
        title={PAGE.headline}
        art={
          <HeroArt focus={["66%", "44%"]} plane={{ "--plane-top": "-24%", "--plane-left": "24%" }}>
            <MeetingHeroWindow />
          </HeroArt>
        }
      />

      <AreaSection
        id="meet"
        title="Meet right where the work is"
        lead="Start a video meeting from the board and it docks under the top bar, with screen sharing, raised hands and host tools. Calls run peer to peer, with a code to let people in."
        link={NOTES}
      >
        <Stage
          title="A meeting docked under the board's top bar"
          body="Tiles for everyone in the call, or a presenter layout with a filmstrip while someone shares their screen. Host tools mute everyone, lower hands, set what participants can do and lock the meeting."
        >
          <Fit width={1000} height={620}>
            <MeetStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Huddle spots on the board" body="Drop a huddle card where the conversation belongs. The first person to press it starts a meeting, and everyone after joins the same room.">
            <Fit width={460} height={300}>
              <HuddleRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Start one, or join with a code" body="Start a meeting from the Collaborate dialog and share its MEET code. In a live session, everyone on the board can join without one.">
            <Fit width={440} height={360}>
              <MeetTabRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Every tile has host controls" body="Hosts can mute someone, stop their video or screen share, lower their hand, spotlight them for everyone, make them host or remove them.">
            <Fit width={460} height={300}>
              <ParticipantMenuRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="The call stays in view" body="While a meeting runs, the top bar shows it's live, how long it has run and how many people are in it, with the code one click from your clipboard.">
            <Fit width={460} height={300}>
              <StatusRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="ai-card"
        title="Let the AI card write it up"
        lead="Connect notes, to-dos, tables and comments to an AI assistant card and pick an action. It reads the cards connected to it and drops what it finds back onto the board."
        link={NOTES}
      >
        <Stage
          title="Themes from everything you connected"
          body="Fieldnote wired the workshop notes, the café visits and Clara's comment into one AI card and asked it to cluster them. Spawn as notes puts each theme on the board, linked back to the card."
        >
          <Fit width={1000} height={620}>
            <AiStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Ask it your own question" body="Pick Custom and write a prompt. The assistant answers from the cards connected to it, not from the rest of the board.">
            <Fit width={460} height={300}>
              <AiCustomRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Summaries, themes and fresh ideas" body="Summarize condenses what's connected, Cluster groups it into themes, Brainstorm suggests what to try next and Action items lists the follow-ups.">
            <Fit width={460} height={300}>
              <AiBrainstormRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="after"
        title="Leave with the decisions on the board"
        lead="Pull the action items out of the call notes, keep them on the board beside the people who own them, and export the board when the client wants a copy."
        link={NOTES}
      >
        <Stage
          title="Action items, straight onto the board"
          body="Run Action items over the call notes and spawn each one as a note. Person cards sit alongside with each owner's role, status and local time."
        >
          <Fit width={1000} height={620}>
            <ActionItemsStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="A copy for the client" body="Download the board as a plain-text summary, JSON, a printable PDF or a PNG of the layout.">
            <Fit width={460} height={312}>
              <TxtExportRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Know who's free" body="Person cards carry a name, role, team and local time, with a status of Available, Busy, Away or Out of office.">
            <Fit width={460} height={300}>
              <PersonRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>
    </AreaPage>
  );
}
