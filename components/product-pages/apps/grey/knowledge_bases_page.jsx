import { AreaHero, AreaPage, AreaSection, FeatureCell, FeatureGrid, Fit, HeroArt, Stage } from "@/components/product-pages/area_kit";
import { findTourPage, findTour } from "@/components/product-pages/tours";
import {
  CaptionRender,
  ChunkingRender,
  FreshnessReviewRender,
  GraphExplorerStage,
  ImportRender,
  IngestionStage,
  KnowledgeBaseWindow,
  MergeRender,
  OntologyRender,
  SourcesStage,
  TranscriptRender,
  UploadRender,
} from "@/components/product-pages/apps/grey/knowledge_renders";

const PAGE = findTourPage("grey", "knowledge-bases");

const GREY = { label: "Geiger Grey", href: "/grey" };

// /apps/grey/knowledge-bases: sources from every origin, ingestion you control and the knowledge graph Grey builds from them.
export function GreyKnowledgeBasesPage() {
  return (
    <AreaPage area={PAGE.id} links={findTour("grey").pages} linksLabel="More from Geiger Grey">
      <AreaHero
        eyebrow={PAGE.eyebrow}
        title={PAGE.headline}
        art={
          <HeroArt focus={["65%", "41%"]} plane={{ "--plane-top": "-8%", "--plane-left": "8%" }}>
            <KnowledgeBaseWindow />
          </HeroArt>
        }
      />

      <AreaSection
        id="sources"
        title="Bring in everything you already keep"
        lead="Upload documents, spreadsheets, slides, recordings and images, import files from Geiger Assets and boards from Geiger Notes, or give Grey a web address."
        link={GREY}
      >
        <Stage
          title="Every source, where it came from and how fresh it is"
          body="Sources lists every file, page and recording across your knowledge bases with its origin, status and freshness. Open one to play it back, see how many chunks it became and which entities it mentions."
        >
          <Fit width={1000} height={620}>
            <SourcesStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Import from Assets and Notes" body="Tick files from Geiger Assets and boards from Geiger Notes on the same account, and Grey queues them for ingestion like any upload.">
            <Fit width={440} height={330}>
              <ImportRender />
            </Fit>
          </FeatureCell>
          <FeatureCell
            title="Each file is sized up before it's read"
            body="Drop in PDFs with a text layer, Word, Excel, PowerPoint, OpenDocument, RTF, EPUB or HTML files, recordings and images. Grey works out the kind and the pages or running time first."
          >
            <Fit width={440} height={362}>
              <UploadRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Recordings become searchable text" body="Audio and video are transcribed into time-stamped passages, so a question can land on the minute something was said.">
            <Fit width={460} height={330}>
              <TranscriptRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Images get a caption" body="Grey writes a caption for every image, so a floor plan or a photo of a panel turns up in search like any document.">
            <Fit width={460} height={260}>
              <CaptionRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="ingestion"
        title="Decide how every file is read"
        lead="Pick a preset for each knowledge base, tune how documents are cut into chunks, and follow every job from parse to graph."
        link={GREY}
      >
        <Stage
          title="Settings per knowledge base, jobs you can follow"
          body="Start from the Fast, Balanced or Auto preset or one of your own, then set the chunking strategy, size and overlap. Ingestion Jobs shows each job's stage, progress and status, and a failed job can be run again."
        >
          <Fit width={1000} height={620}>
            <IngestionStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Chunks cut the way your documents are written" body="Split recursively, at a fixed size, by meaning or page by page, with the chunk size and overlap set in tokens and each chunk labelled with its heading trail.">
            <Fit width={460} height={270}>
              <ChunkingRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Know which sources need a second look" body="Every source is Verified, Review due, Stale or Not verified. Set a review date, and mark a source verified once someone has checked it.">
            <Fit width={460} height={300}>
              <FreshnessReviewRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="graph"
        title="Walk the graph behind your files"
        lead="As Grey reads, it picks out the people, places, products and procedures in your sources and how they relate, then lays them out as a graph you can explore."
        link={GREY}
      >
        <Stage
          title="Every entity, with its relations and where it's mentioned"
          body="Explore the graph in 2D or 3D and filter it by knowledge base. Open an entity to see its type, aliases, relations and the sources that mention it, then ask the Playground about it."
        >
          <Fit width={1000} height={620}>
            <GraphExplorerStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Merge the duplicates" body="When three names mean the same hangar, choose the one that stays. The others become its aliases, and their relations and mentions move across.">
            <Fit width={440} height={372}>
              <MergeRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Your own kinds of thing" body="The ontology holds the entity and relation types the graph uses, from Person and Location to works_at and part_of, and you can add your own.">
            <Fit width={460} height={300}>
              <OntologyRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>
    </AreaPage>
  );
}
