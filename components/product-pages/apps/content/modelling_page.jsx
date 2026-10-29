import { AreaHero, AreaPage, AreaSection, FeatureCell, FeatureGrid, Fit, HeroArt, Stage } from "@/components/product-pages/area_kit";
import { findTourPage, findTour } from "@/components/product-pages/tours";
import {
  AssignmentsRender,
  AssistantRender,
  AttentionRender,
  FieldTypesRender,
  OutcomeRender,
  PrivateFieldRender,
  ReferencesRender,
  ReviewStage,
  SchemaWindow,
  TypesStage,
  ValidationRender,
  WritingStage,
} from "@/components/product-pages/apps/content/modelling_renders";

const PAGE = findTourPage("content", "modelling");
const LINK = { label: "Geiger Content", href: "/content" };

// /apps/content/modelling: content types and typed fields, the editors, assignments and review, told through Atlas Coffee.
export function ContentModellingPage() {
  return (
    <AreaPage area={PAGE.id} links={findTour("content").pages} linksLabel="More from Geiger Content">
      <AreaHero
        title={PAGE.headline}
        art={
          <HeroArt focus={["62%", "38%"]} plane={{ "--plane-top": "-8%", "--plane-left": "16%" }}>
            <SchemaWindow />
          </HeroArt>
        }
      />

      <AreaSection
        id="types"
        title="Give every kind of content a shape"
        lead="Define a content type for each thing you publish and give it typed fields. The editor, its validation and the delivery API all work from that one schema."
        link={LINK}
      >
        <Stage
          title="A schema the editor follows"
          body="Atlas Coffee keeps articles, recipes, coffee origins, store pages and roasteries as separate types. Writers fill in an origin field by field, with the right control for each type."
        >
          <Fit width={1000} height={620}>
            <TypesStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Nine kinds of field" body="Text, number, boolean, date, reference, rich text, enum, JSON and media, each with its own control in the editor.">
            <Fit width={460} height={300}>
              <FieldTypesRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Entries that point at each other" body="A reference field links one entry to another, and every entry shows what it links to and what links back to it.">
            <Fit width={460} height={300}>
              <ReferencesRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Rules that run on every save" body="Make a field required, or give it a minimum, a maximum, a length or a pattern. An entry that breaks a rule won't save until it's fixed.">
            <Fit width={460} height={300}>
              <ValidationRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Internal fields stay internal" body="Mark a field private and it stays in the editor. The delivery API leaves it out of every response.">
            <Fit width={460} height={300}>
              <PrivateFieldRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="writing"
        title="Write together without crossed wires"
        lead="Give each entry an owner and a deadline, talk it through in a thread on the field in question, and ask the assistant when the words won't come."
        link={LINK}
      >
        <Stage
          title="Every entry has an owner and a thread"
          body="An entry's body is built from headings and paragraphs. Each entry can carry an assignment with an owner and a due date, and comment threads that name the field they're about."
        >
          <Fit width={1000} height={620}>
            <WritingStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Work handed out with a deadline" body="Assign an entry to a teammate with a due date and a priority of Low, Normal, High or Urgent, and see what's overdue at a glance.">
            <Fit width={460} height={300}>
              <AssignmentsRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="An assistant for the first draft" body="Ask the AI assistant for a tighter introduction or a clearer title, with an entry as context. It only suggests, and your requests stay in your own history.">
            <Fit width={460} height={300}>
              <AssistantRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="review"
        title="See exactly what changed, then approve it"
        lead="Entries sent for review wait in one queue, oldest first. Compare any two versions field by field before you decide."
        link={LINK}
      >
        <Stage
          title="A review queue, and the diff to go with it"
          body="Everything in review waits in one list with Approve and Reject beside it. Compare & Rollback diffs any two versions of an entry path by path, the old value next to the new."
        >
          <Fit width={1000} height={620}>
            <ReviewStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="One click either way" body="Approve an entry and it's published on the spot. Reject it and it goes back to Draft for another pass.">
            <Fit width={460} height={300}>
              <OutcomeRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="See what's waiting" body="The overview counts entries awaiting approval, drafts nobody has touched in 30 days and entries without an excerpt, each a click from its list.">
            <Fit width={460} height={300}>
              <AttentionRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>
    </AreaPage>
  );
}
