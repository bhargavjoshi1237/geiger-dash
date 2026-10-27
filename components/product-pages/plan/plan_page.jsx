import { AreaHero, AreaPage, AreaSection, FeatureCell, FeatureGrid, Fit, HeroArt, SplitShowcase, Stage } from "@/components/product-pages/area_kit";
import { BoardRender, CommandRender, DisplayRender, TrackerStage, ViewsRender } from "@/components/product-pages/plan/tracker_renders";
import { CycleStage, DivisionsRender, GoalRender, MilestoneRender, RoadmapRender, RoadmapWindow } from "@/components/product-pages/plan/roadmap_renders";
import { AiCardRender, CanvasStage, ToolsRender, VideoStageRender } from "@/components/product-pages/plan/canvas_renders";
import { CallRender, ChatStage, SlashRender } from "@/components/product-pages/plan/chat_renders";

const SESSION_TOOLS = [
  { title: "Live cursors", body: "See each other's cursors and follow anyone around the board" },
  { title: "Laser pointer", body: "Point at what matters, raise a hand or react without a word" },
  { title: "Host controls", body: "Lock everyone's view to yours and run polls and timers" },
  { title: "Video stage", body: "Meet with video and screen sharing, docked inside the board" },
];

// /plan: Flow's tracker and planning views, the Notes canvas and Flow's team chat.
export function PlanPage() {
  return (
    <AreaPage area="plan">
      <AreaHero
        eyebrow="Planning and collaboration"
        title="Plan the work from first sketch to launch"
        art={
          <HeroArt focus={["66%", "46%"]} plane={{ "--plane-top": "-12%", "--plane-left": "24%" }}>
            <RoadmapWindow />
          </HeroArt>
        }
      />

      <AreaSection
        id="tracker"
        title="A tracker that keeps up with you"
        lead="Issues, triage, cycles and views are a keystroke apart in Flow. Open anything with ⌘K, jump between views with G, and create an issue from anywhere with C."
        link={{ label: "Geiger Flow", href: "/flow" }}
      >
        <Stage title="Every issue, with everything it needs" body="Each issue carries its status, priority, assignees, labels, division, cycle, estimate and due date, with the comments and the full activity history alongside.">
          <Fit width={1000} height={620}>
            <TrackerStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Everything is a keystroke away" body="⌘K opens the command palette. Press G and a letter to jump to your inbox, triage, cycles, divisions, views or initiatives, or C to create an issue.">
            <Fit width={440} height={290}>
              <CommandRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="A list or a board, your call" body="Lay the same issues out as a list or a board, with the status, priority and estimate on every card.">
            <Fit width={480} height={300}>
              <BoardRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Group it the way you think" body="Group by status, assignee, priority, division, cycle or label, and order by priority, due date, title or when it last changed.">
            <Fit width={460} height={300}>
              <DisplayRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Views for the questions you ask every day" body="Ready-made views for Active, Urgent & high, Unassigned, Overdue, Needs estimate and Recently completed keep the usual questions one click away.">
            <Fit width={460} height={290}>
              <ViewsRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="roadmap"
        title="See the plan at every altitude"
        lead="Time-box the work in cycles, see divisions and cycles together on one roadmap, and track goals by their key results, with health a glance away."
        link={{ label: "Geiger Flow", href: "/flow" }}
      >
        <Stage title="Cycles that show where the fortnight went" body="Every cycle has a burn-up of scope against completed work, the scope, started, completed and estimated points beside it, and the cycle's issues underneath.">
          <Fit width={1000} height={620}>
            <CycleStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="A roadmap that draws itself" body="Initiatives lays every division and cycle with a target date on one timeline, three, six or twelve months wide, with today marked.">
            <Fit width={480} height={240}>
              <RoadmapRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Health you can read at a glance" body="Divisions gather the work behind a bigger outcome, each with a lead, a progress ring and a health of on track, at risk or completed.">
            <Fit width={470} height={240}>
              <DivisionsRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Goals measured by key results" body="Set objectives with key results and track progress by task count, tracked time, story points or a custom field.">
            <Fit width={420} height={330}>
              <GoalRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Milestones with their own checklist" body="Each milestone holds its own tasks, moving from to do and in progress to blocked or done.">
            <Fit width={420} height={270}>
              <MilestoneRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="canvas"
        title="Think it through on a canvas"
        lead="Notes is an infinite canvas for documents, sketches, tables and 28 other kinds of card. Bring the team onto the board and work it out together, live."
        link={{ label: "Geiger Notes", href: "/notes" }}
      >
        <Stage title="One board for the whole conversation" body="Columns, tables, timers and documents sit side by side on the same board, with everyone's cursor moving across it in real time.">
          <Fit width={1000} height={620}>
            <CanvasStage />
          </Fit>
        </Stage>
        <SplitShowcase
          items={SESSION_TOOLS}
          active={3}
          title="Meet without leaving the board"
          body="Start a meeting and it docks under the board's top bar, with video, screen sharing and a presenter layout. The host decides who can unmute, start their video or share their screen."
        >
          <Fit width={680} height={440}>
            <VideoStageRender />
          </Fit>
        </SplitShowcase>
        <FeatureGrid>
          <FeatureCell title="An AI assistant on the board" body="Ask the assistant card to summarise, cluster, brainstorm or pull out action items, then spawn the results as notes beside it.">
            <Fit width={470} height={300}>
              <AiCardRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Thirty-one kinds of card" body="Notes, to-dos, tables, calendars and Excalidraw sketches, plus embeds from Figma, Loom or YouTube, mind maps, Mermaid diagrams, polls and formulas.">
            <Fit width={470} height={290}>
              <ToolsRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="chat"
        title="Talk it through next to the work"
        lead="Grounding is Flow's team chat: channels, threads and direct messages beside the tracker, with a voice or video call to a teammate one command away."
        link={{ label: "Geiger Flow", href: "/flow" }}
      >
        <Stage title="Channels that stay on topic" body="Lock a channel to the people who need it, pin what matters, react, reply in threads and share files up to 25 MB, with a typing indicator so you know an answer is coming.">
          <Fit width={1000} height={580}>
            <ChatStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Slash commands" body="Type /call or /video to ring a teammate from the conversation, or /shrug when words fail you.">
            <Fit width={440} height={236}>
              <SlashRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Voice and video, one to one" body="Calls between two teammates run straight from the browser, with the camera and microphone a click away.">
            <Fit width={420} height={290}>
              <CallRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>
    </AreaPage>
  );
}
