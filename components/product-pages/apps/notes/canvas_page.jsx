import { AreaHero, AreaPage, AreaSection, FeatureCell, FeatureGrid, Fit, HeroArt, Stage } from "@/components/product-pages/area_kit";
import { findTour, findTourPage } from "@/components/product-pages/tours";
import {
  BoardStage,
  CanvasHeroWindow,
  CanvasSettingsRender,
  CardStylesRender,
  EmbedsRender,
  ExportRender,
  MermaidSplitRender,
  NestedStage,
  RollupRender,
  ShapesRender,
  SketchStage,
  TextStylesRender,
} from "@/components/product-pages/apps/notes/canvas_renders";

const PAGE = findTourPage("notes", "canvas");
const NOTES = { label: "Geiger Notes", href: "/notes" };

// /apps/notes/canvas: the Notes board, its 31 kinds of card, nested boards, sketches, embeds and export.
export function NotesCanvasPage() {
  return (
    <AreaPage area={PAGE.id} links={findTour("notes").pages} linksLabel="More from Geiger Notes">
      <AreaHero
        title={PAGE.headline}
        art={
          <HeroArt focus={["68%", "40%"]} plane={{ "--plane-top": "-8%", "--plane-left": "26%" }}>
            <CanvasHeroWindow />
          </HeroArt>
        }
      />

      <AreaSection
        id="cards"
        title="One board, every kind of card"
        lead="Notes is an infinite board with 31 kinds of card, from notes, to-dos and tables to charts, Mermaid diagrams and mind maps. Boards save themselves as you work."
        link={NOTES}
      >
        <Stage
          title="Sixteen tools in the toolbar, fifteen more a click away"
          body="Notes, links, to-dos, documents, columns, tables and drawings sit in the toolbar. Embeds, timers, polls, charts, formulas, the AI assistant and the rest wait under More, ready to drag onto the board."
        >
          <Fit width={1000} height={620}>
            <BoardStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Thirteen styles for every card" body="Pick how the cards on your boards look, from Classic and Soft to Sticky, Brutalist, Glass, Blueprint and Terminal. The change applies to the cards already there.">
            <Fit width={460} height={300}>
              <CardStylesRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Ten shapes for quick diagrams" body="Shape cards come as rectangles, pills, ellipses, diamonds, triangles, hexagons, parallelograms, cylinders and stars, with text inside and connectors between them.">
            <Fit width={460} height={300}>
              <ShapesRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Headings and captions on the board" body="Text cards come in Heading 1, 2 and 3, Body and Caption, aligned left, centre or right, so a board can carry its own titles.">
            <Fit width={460} height={300}>
              <TextStylesRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Dots, lines, cross or nothing" body="Settings set the canvas pattern and grid size, the minimap, how far you can zoom, and which tools sit in your toolbar.">
            <Fit width={460} height={300}>
              <CanvasSettingsRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="structure"
        title="Give the thinking some structure"
        lead="Put boards inside boards and find your way back with the breadcrumbs. Draw diagrams in Mermaid, and let formula and progress cards do the counting."
        link={NOTES}
      >
        <Stage
          title="Boards inside boards"
          body="A board card opens into a board of its own. Fieldnote keeps the research wall, the workshop and the press kit inside the launch plan, and the breadcrumbs lead back up."
        >
          <Fit width={1000} height={620}>
            <NestedStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Diagrams you write as text" body="Write Mermaid in a card and see it drawn beside the code, with templates for flowcharts, sequences, Gantt charts, timelines and more. Switch between Preview, Split and Code.">
            <Fit width={460} height={300}>
              <MermaidSplitRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Numbers that add themselves up" body="Connect a table to a formula card to sum, average or count it, and link to-dos to a progress card to roll them up as a bar or a ring.">
            <Fit width={460} height={300}>
              <RollupRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="in-and-out"
        title="Bring it in, take it with you"
        lead="Embed the files your team already works in, sketch in Excalidraw and push the shapes onto the board, then export any board when you need it somewhere else."
        link={NOTES}
      >
        <Stage
          title="Sketch it, then push it to the board"
          body="Project sketches open in Excalidraw, with collaborators' pointers on the page. Select shapes and press Push to board to turn them into cards and connectors on the board the sketch belongs to."
        >
          <Fit width={1000} height={620}>
            <SketchStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Embeds that work on the board" body="Paste a link from YouTube, Vimeo, Loom, Figma, Google Docs, Sheets, Slides or Maps, Spotify, CodePen, CodeSandbox or Miro, and it plays or opens right on the card.">
            <Fit width={460} height={300}>
              <EmbedsRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Take any board with you" body="Download a board as JSON with all its data, a printable PDF, a PNG of the layout or a plain-text summary.">
            <Fit width={420} height={250}>
              <ExportRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>
    </AreaPage>
  );
}
