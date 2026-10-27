import { AreaHero, AreaPage, AreaSection, CalloutStage, FeatureCell, FeatureGrid, Fit, HeroArt, SplitShowcase, Stage } from "@/components/product-pages/area_kit";
import { TEAM_PAGES, findTeamPage } from "@/components/product-pages/tours";
import {
  BrandLibraryStage,
  BrandVersionsRender,
  CampaignApiRender,
  CampaignCompareRender,
  CampaignHeroWindow,
  CampaignTypeRender,
  CardKindsRender,
  DeliverySizesRender,
  FollowRender,
  HeroSelectsRender,
  LaunchQueueRender,
  LaunchWorkflowRender,
  MergeSessionRender,
  NestedBoardsRender,
  ShootDaysStage,
  SignOffPipelineRender,
  SocialCropRender,
} from "@/components/product-pages/teams/creative_renders";

const PAGE = findTeamPage("creative");

const SIGNOFF_LEFT = [
  { title: "Stages in any order", body: "Brand, legal and product marketing each sign off when they're ready" },
  { title: "People or roles", body: "Name the approvers, or let anyone with a role approve" },
];

const SIGNOFF_RIGHT = [
  { title: "Locked when approved", body: "The final approval locks the version that was signed off" },
  { title: "Every decision kept", body: "Who approved, who asked for changes, and when" },
];

const LAUNCH_POINTS = [
  { title: "One queue for launch day", body: "Every entry waiting to go live, scheduled, in review or published" },
  { title: "A date on each entry", body: "Set when the campaign page and its stories go live" },
  { title: "Review before it ships", body: "Entries wait in review until someone approves them" },
  { title: "Versions you can restore", body: "Compare two snapshots and roll back in a click" },
];

// /teams/creative: Northcove's in-house brand team takes the Tidelines campaign from a live board in Notes, through the brand library and sign-off in Assets, to the site in Content.
export function CreativePage() {
  return (
    <AreaPage area={PAGE.id} links={TEAM_PAGES} linksLabel="Teams on Geiger">
      <AreaHero
        eyebrow={PAGE.eyebrow}
        title={PAGE.headline}
        art={
          <HeroArt focus={["64%", "38%"]} plane={{ "--plane-top": "6%", "--plane-left": "28%" }}>
            <CampaignHeroWindow />
          </HeroArt>
        }
      />

      <AreaSection
        id="canvas"
        title="Work the idea out on one board"
        lead="The campaign starts on a Geiger Notes board: the moodboard, the headlines, the shot list and a column for each shoot day, with the whole team on it at once."
        link={{ label: "Geiger Notes: the board", href: "/apps/notes/canvas" }}
      >
        <Stage
          title="Turn the wall into a to-do list"
          body="Lay out each shoot day as a column, then ask the AI assistant card to pull out the action items. It lists them on the board, ready to add as notes, while the team keeps working around it."
        >
          <Fit width={1000} height={620}>
            <ShootDaysStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Every kind of card on one board" body="Notes, to-dos, tables, sketches, images, embeds, mind maps, palettes and polls: 31 kinds of card share the same board.">
            <Fit width={460} height={310}>
              <CardKindsRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Boards inside boards" body="Give the shoot days, the lookbook and the shop windows a board each inside the campaign, and open any of them with a double click.">
            <Fit width={460} height={250}>
              <NestedBoardsRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Follow whoever's presenting" body="Start a live session and everyone's cursor shows on the board. Follow the presenter as they move, and watch their laser pointer circle the shot they mean.">
            <Fit width={460} height={300}>
              <FollowRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Merge the session back in" body="When the workshop ends, merge what the session made back into the board it started from, so nothing from the room gets lost.">
            <Fit width={460} height={300}>
              <MergeSessionRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="library"
        title="One library for every brand file"
        lead="Photographs, raw files, films, logos and the brand guidelines live in Geiger Assets, each with its versions, its tags and the files it belongs with."
        link={{ label: "Geiger Assets: the library", href: "/apps/assets/library" }}
      >
        <Stage
          title="Each file knows what it belongs to"
          body="Open the hero shot and see what it's tied to: the raw file it came from, the colourways and crops made from it, the campaign it's for and the product it shows."
        >
          <Fit width={1000} height={640}>
            <BrandLibraryStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Every retouch, kept" body="Replace a file and the old one stays in its version history, ready to compare or restore if the new grade doesn't land.">
            <Fit width={460} height={290}>
              <BrandVersionsRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Crop for social without leaving" body="Open the key image in the editor, crop it to 4:5 and save it back to the library as a new asset, tied to the original.">
            <Fit width={470} height={310}>
              <SocialCropRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="sign-off"
        title="Sign-off in stages, not in a thread"
        lead="Brand, legal and product marketing approve the campaign's files in Geiger Assets, each in their own stage, and nothing goes out until everyone has said yes."
        link={{ label: "Geiger Assets: approvals and workflows", href: "/apps/assets/approvals" }}
      >
        <CalloutStage
          left={SIGNOFF_LEFT}
          right={SIGNOFF_RIGHT}
          title="A pipeline for the campaign's files"
          body="Set the stages once and every file sent for review follows them. When the last stage approves, the assets are marked approved and the signed-off version is locked."
        >
          <Fit width={540} height={430}>
            <SignOffPipelineRender />
          </Fit>
        </CalloutStage>
        <FeatureGrid>
          <FeatureCell title="Decide file by file" body="Go through the selects one at a time: approve the ones that work, and ask for changes on the rest with a note on what to fix.">
            <Fit width={470} height={320}>
              <HeroSelectsRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Approved files file themselves" body="A workflow moves each approved shot into the final folder, tags it for the launch and tells the rest of the business through a webhook.">
            <Fit width={470} height={320}>
              <LaunchWorkflowRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="publish"
        title="Publish it everywhere it needs to go"
        lead="The campaign page, the product stories and the journal live in Geiger Content as structured entries, and the site reads them from an API on launch day."
        link={{ label: "Geiger Content: publishing and versions", href: "/apps/content/publishing" }}
      >
        <SplitShowcase items={LAUNCH_POINTS} active={1} title="Line up launch day" body="The publishing queue shows every entry in the launch, from the campaign page to the care guide, with its status and the date it goes live.">
          <Fit width={680} height={460}>
            <LaunchQueueRender />
          </Fit>
        </SplitShowcase>
        <FeatureGrid>
          <FeatureCell title="Every campaign built the same way" body="A content type sets the fields a campaign page needs, from the headline and hero image to the products it features, so each one is complete.">
            <Fit width={460} height={370}>
              <CampaignTypeRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Change your mind safely" body="Compare two snapshots of the page field by field, then restore the older one if the new headline doesn't hold up.">
            <Fit width={470} height={265}>
              <CampaignCompareRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="The site reads it from the API" body="Your site asks the delivery API for the campaign page by its slug and builds the hero from the answer.">
            <Fit width={470} height={320}>
              <CampaignApiRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="One master, every size" body="Keep one master of each photograph. Ask for the width, crop and format in the URL, and every placement gets the file it needs.">
            <Fit width={470} height={280}>
              <DeliverySizesRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>
    </AreaPage>
  );
}
