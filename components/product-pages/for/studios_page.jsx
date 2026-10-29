import { AreaHero, AreaPage, AreaSection, FeatureCell, FeatureGrid, Fit, HeroArt, Stage } from "@/components/product-pages/area_kit";
import { findAudiencePage, AUDIENCE_PAGES } from "@/components/product-pages/tours";
import {
  AtlasChatRender,
  AtlasLicencesRender,
  AtlasRoadmapRender,
  AtlasTrackerStage,
  EnquiryKanbanRender,
  EnquiryStage,
  FieldTypesRender,
  GuidelinesLinkRender,
  PrintShopRender,
  SessionMergeRender,
  ShootGalleryRender,
  SignOffStage,
  StudioHeroWindow,
  WorkshopAiRender,
  WorkshopStage,
} from "@/components/product-pages/for/studios_renders";

const PAGE = findAudiencePage("creative-studios");

// /for/creative-studios: a design studio's rebrand, from the client's enquiry and a live workshop to the plan and the client's sign-off.
export function StudiosPage() {
  return (
    <AreaPage area={PAGE.id} links={AUDIENCE_PAGES} linksLabel="Who Geiger is for">
      <AreaHero
        title={PAGE.headline}
        art={
          <HeroArt focus={["66%", "38%"]} plane={{ "--plane-top": "-4%", "--plane-left": "12%" }}>
            <StudioHeroWindow />
          </HeroArt>
        }
      />

      <AreaSection
        id="brief"
        title="Start with a proper brief"
        lead="Send new clients a Geiger Forms enquiry that asks for the budget, the launch date, their current files and a signature, and pick every reply up in one inbox."
        link={{ label: "Geiger Forms: the form builder", href: "/apps/forms/builder" }}
      >
        <Stage
          title="The client fills it in, you pick it up"
          body="The enquiry asks what they need, the budget and the launch date, takes their brand files and a signature, then lands in the Forms inbox, where you set its status and priority and talk it over in the comments."
        >
          <Fit width={1000} height={620}>
            <EnquiryStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Ask for exactly what you need" body="Build the form from 36 field types, from dropdowns and dates to file uploads and signatures.">
            <Fit width={460} height={240}>
              <FieldTypesRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Every enquiry has a status" body="See enquiries by status in the kanban view, from Needs review to Approved, with each one's priority on its card.">
            <Fit width={470} height={290}>
              <EnquiryKanbanRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="workshop"
        title="Work it out with the client, live"
        lead="Run the workshop on a Geiger Notes board in a live session. The client joins with a session code, every cursor is on the board, and the meeting docks right above it."
        link={{ label: "Geiger Notes: live sessions", href: "/apps/notes/live-sessions" }}
      >
        <Stage
          title="Host the session, keep the room together"
          body="Point with the laser, lock everyone's view to yours while you present, and see hands as they go up. The meeting docks under the board's top bar, with video and screen sharing."
        >
          <Fit width={1000} height={620}>
            <WorkshopStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Turn the stickies into actions" body="Ask the AI card to summarise, cluster, brainstorm or pull out action items, then spawn the results as notes on the board.">
            <Fit width={470} height={300}>
              <WorkshopAiRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Bring the session home" body="When the workshop ends, merge the session into the studio's own board. You see how many cards are new or changed first, and a merge can be rolled back.">
            <Fit width={440} height={310}>
              <SessionMergeRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="plan"
        title="Plan the work and talk it through"
        lead="Track the rebrand in Geiger Flow, on the same account as the workshop board: issues, cycles and a roadmap, with the team's chat and calls beside them."
        link={{ label: "Geiger Flow: the issue tracker", href: "/apps/flow/issues" }}
      >
        <Stage
          title="Every task on one board"
          body="Issues move from Backlog and Todo through In Progress and In Review to Done, each with a priority, an estimate and an assignee. Press C anywhere to write a new one, ⌘K to open anything, and G then a letter to jump between views."
        >
          <Fit width={1000} height={620}>
            <AtlasTrackerStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="The rebrand on a roadmap" body="Initiatives lays the rebrand's division and its cycles on one timeline, with today marked and each bar filling as issues close.">
            <Fit width={470} height={260}>
              <AtlasRoadmapRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Talk it through, then call" body="Grounding gives the project a channel for the day-to-day, and a one-to-one video call with a teammate is a /video away.">
            <Fit width={460} height={300}>
              <AtlasChatRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="sign-off"
        title="Get the client's sign-off"
        lead="Deliver through Geiger Assets: every version of every file, an approval pipeline the client signs at the end, and links and galleries that hand the work over."
        link={{ label: "Geiger Assets: approvals and workflows", href: "/apps/assets/approvals" }}
      >
        <Stage
          title="Sign-off in stages, on the record"
          body="Route the logo through internal review, a producer check and the client, in order. Every version keeps its status and the client's comments, and the approved version is locked once the last stage signs."
        >
          <Fit width={1000} height={620}>
            <SignOffStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Links that expire or can be revoked" body="Share a file or a collection publicly or with restricted access, set it to expire, and revoke it the moment it should stop working.">
            <Fit width={460} height={320}>
              <GuidelinesLinkRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="A client gallery behind a password" body="Publish the shoot as a grid, masonry, justified rows, a mosaic, a slideshow or a single column, and lock it with a password for the client.">
            <Fit width={460} height={300}>
              <ShootGalleryRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Licences on the record" body="Issue licences with a scope, a term and a fee, and keep an eye on Expirations & Renewals for the ones about to end.">
            <Fit width={460} height={240}>
              <AtlasLicencesRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Sell prints and downloads" body="Turn a gallery into a storefront and sell prints and downloads through Stripe checkout, with every order recorded.">
            <Fit width={460} height={300}>
              <PrintShopRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>
    </AreaPage>
  );
}
