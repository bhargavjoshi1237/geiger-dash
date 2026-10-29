import { AreaHero, AreaPage, AreaSection, FeatureCell, FeatureGrid, Fit, HeroArt, Stage } from "@/components/product-pages/area_kit";
import { findTour, findTourPage } from "@/components/product-pages/tours";
import {
  AccessRender,
  ApiStage,
  DeliveryRender,
  DriveRender,
  EditorStage,
  FiltersRender,
  LibraryStage,
  LibraryWindow,
  ScopesRender,
  UploadFlowRender,
  UploadRender,
  VersionsRender,
} from "@/components/product-pages/apps/assets/library_renders";

const PAGE = findTourPage("assets", "library");
const LINK = { label: "Geiger Assets", href: "/assets" };

// /apps/assets/library: the Asset Library, the image editor, delivery URLs and the REST API, around Cobalt Retail's Autumn lookbook.
export function AssetsLibraryPage() {
  return (
    <AreaPage area={PAGE.id} links={findTour("assets").pages} linksLabel="More from Geiger Assets">
      <AreaHero
        title={PAGE.headline}
        art={
          <HeroArt focus={["70%", "42%"]} plane={{ "--plane-top": "-8%", "--plane-left": "18%" }}>
            <LibraryWindow />
          </HeroArt>
        }
      />

      <AreaSection
        id="library"
        title="One library for the whole shoot"
        lead="Cobalt Retail's Autumn lookbook lives in one place: photos, raw files, PDFs and 3D models, each with a status and the files it came from or led to."
        link={LINK}
      >
        <Stage
          title="Every file knows where it came from"
          body="Open an asset to see its details, versions and relationships. Link it to its source, its variants and derivatives, or to the campaign and product it belongs to."
        >
          <Fit width={1000} height={620}>
            <LibraryStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell
            title="Drop in the whole shoot"
            body="Drop in a batch of files and choose the folder they land in. Each one uploads straight to storage with its progress in the Upload Center, and images get a light AVIF thumbnail."
          >
            <Fit width={460} height={300}>
              <UploadRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Pull files across from Google Drive" body="Connect Google Drive, pick the files you want and import them into a folder. Geiger only sees the files you pick.">
            <Fit width={460} height={300}>
              <DriveRender />
            </Fit>
          </FeatureCell>
          <FeatureCell
            title="Find it by type and status"
            body="Filter by image, video, audio, document, PDF, 3D model, raw or archive, and by Approved, Draft, In Review, Processing or Archived."
          >
            <Fit width={460} height={300}>
              <FiltersRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Every version kept" body="Replace a file and the old one stays in its version history, with its size and date, ready to restore.">
            <Fit width={460} height={300}>
              <VersionsRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="edit-and-deliver"
        title="Edit it, then serve any size"
        lead="Crop and adjust an image in the editor and save it back to the library. Then serve it at the width, height, format and quality each page needs, straight from its URL."
        link={LINK}
      >
        <Stage
          title="An image editor that saves to the library"
          body="Crop to a ratio, adjust light, colour and detail, add text or shapes, then save the result as a new asset, a new version of the original, or a download."
        >
          <Fit width={1000} height={620}>
            <EditorStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell
            title="Resize and convert on the fly"
            body="Put the width, height, crop, format and quality in the delivery URL and get that version back, with no export step and no extra file to store."
          >
            <Fit width={460} height={300}>
              <DeliveryRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Only your sites can load it" body="Require signed delivery URLs and keep a referrer allowlist, so other sites can't embed your images.">
            <Fit width={460} height={300}>
              <AccessRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="api"
        title="Build on the library"
        lead="A public REST API reads and writes the library with keys you scope yourself, so a storefront, a CMS or a script can work with the same files your team does."
        link={LINK}
      >
        <Stage
          title="Keys scoped to the job"
          body="Each key carries only the scopes it needs, from assets:read to upload:write, and shows when it was last used. Search, filter and page through assets with a cursor."
        >
          <Fit width={1000} height={620}>
            <ApiStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Read or write, resource by resource" body="Grant read or write on assets, collections, folders, uploads and delivery, and set an expiry date if the key shouldn't last.">
            <Fit width={440} height={310}>
              <ScopesRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Upload straight to storage" body="Ask the API for an upload URL, send the file straight to storage, then commit it to an asset record.">
            <Fit width={460} height={300}>
              <UploadFlowRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>
    </AreaPage>
  );
}
