import { AreaHero, AreaPage, AreaSection, FeatureCell, FeatureGrid, Fit, HeroArt, SplitShowcase, Stage } from "@/components/product-pages/area_kit";
import { findTour, findTourPage } from "@/components/product-pages/tours";
import {
  BuilderWindow,
  FieldsStage,
  FormulaRender,
  LayoutRender,
  LogicRender,
  PresenceRender,
  SaveTemplateRender,
  ScoringRender,
  StepsRender,
  TemplatesStage,
  ThemeRender,
  VersionsRender,
} from "@/components/product-pages/apps/forms/builder_renders";

const PAGE = findTourPage("forms", "builder");

const DESIGN_STEPS = [
  { title: "Themes & Colors", body: "Ten preset themes, or your own colour mode, corners and fonts" },
  { title: "Multi-step pages", body: "Page breaks turn a long form into steps with a progress bar" },
  { title: "Welcome & ending", body: "An intro before the first question and a thank-you after the last" },
  { title: "Save & resume", body: "Respondents save their progress and get a resume link by email" },
];

// /apps/forms/builder: the Forms builder, from field types and logic to themes, pages, templates and versions.
export function FormsBuilderPage() {
  return (
    <AreaPage area={PAGE.id} links={findTour("forms").pages} linksLabel="More from Geiger Forms">
      <AreaHero
        title={PAGE.headline}
        art={
          <HeroArt focus={["68%", "48%"]} plane={{ "--plane-top": "-14%", "--plane-left": "30%" }}>
            <BuilderWindow />
          </HeroArt>
        }
      />

      <AreaSection
        id="builder"
        title="Every kind of question, one canvas"
        lead="Drop any of 36 field types onto the canvas, from short text and rankings to signatures, booking slots and order totals. Logic, formulas and scoring live on the fields themselves."
        link={{ label: "Geiger Forms", href: "/forms" }}
      >
        <Stage
          title="Add a field from the palette or drag it into place"
          body="The palette groups every field type under Basic, Choice, Date & time, Survey, Contact, Advanced, Payments and Layout. Click to insert after the selected field, or drag one onto the canvas."
        >
          <Fit width={1000} height={620}>
            <FieldsStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Show a question only when it applies" body="Give any field conditions to test earlier answers, with equals, contains, greater than, is empty and more, matched on any or all of them.">
            <Fit width={460} height={300}>
              <LogicRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Formulas that check themselves" body="Calculated fields reference other answers by name and use IF, SUM, ROUND, DAYS and more. The editor flags mistakes and previews the result on sample answers.">
            <Fit width={460} height={300}>
              <FormulaRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Score every application as it lands" body="Give choices points and let calculated fields count towards the score. Thresholds you set turn the total into a High, Medium or Low priority.">
            <Fit width={460} height={300}>
              <ScoringRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="See who else is in the form" body="Avatars in the builder show everyone else editing the form. When a teammate saves a change, you see who made it and can reload to pick it up.">
            <Fit width={460} height={300}>
              <PresenceRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="design"
        title="Make it look and read like yours"
        lead="Start from a preset theme or set your own colours, corners and fonts. Split a long form into steps, open with a welcome and close with an ending of your own."
        link={{ label: "Geiger Forms", href: "/forms" }}
      >
        <SplitShowcase
          items={DESIGN_STEPS}
          active={0}
          title="A theme in a click, every detail if you want it"
          body="Apply one of ten presets or save your own as a workspace theme, then fine-tune the colour mode, corners and body and heading fonts while the preview updates beside you."
        >
          <Fit width={680} height={440}>
            <ThemeRender />
          </Fit>
        </SplitShowcase>
        <FeatureGrid>
          <FeatureCell title="A full page or one question at a time" body="Show every question on the page, or switch to one question per screen that respondents answer from the keyboard.">
            <Fit width={460} height={300}>
              <LayoutRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Steps, a welcome and an ending" body="Page breaks split the form into steps, and each page can be skipped with conditions. Add a welcome screen up front and a thank-you that greets people by name.">
            <Fit width={460} height={300}>
              <StepsRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="templates"
        title="Start fast, keep every version"
        lead="Begin from 42 templates across 12 categories or from a form you've already built. Save versions as you go and restore any of them after seeing what will change."
        link={{ label: "Geiger Forms", href: "/forms" }}
      >
        <Stage
          title="A gallery of forms that already work"
          body="Templates cover lead generation, payments, registration, surveys, HR, support, education, finance and more. Preview each one field by field before you use it."
        >
          <Fit width={1000} height={620}>
            <TemplatesStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Restore any version, with a preview" body="Save a version with notes whenever the form reaches a good place. Before you restore one, you see which fields come back, go or change.">
            <Fit width={460} height={300}>
              <VersionsRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Turn your own forms into templates" body="Save a finished form as a template, so the next funding round or membership drive starts from the version your team trusts.">
            <Fit width={460} height={300}>
              <SaveTemplateRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>
    </AreaPage>
  );
}
