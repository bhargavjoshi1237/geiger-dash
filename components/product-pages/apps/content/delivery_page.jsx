import { AreaHero, AreaPage, AreaSection, FeatureCell, FeatureGrid, Fit, HeroArt, Stage } from "@/components/product-pages/area_kit";
import { findTourPage, findTour } from "@/components/product-pages/tours";
import {
  ConsentRender,
  DuplicatesRender,
  FiltersRender,
  MetricsRender,
  QueryStage,
  RestWindow,
  SchemaRender,
  ScopeRender,
  SearchStage,
  SlotStage,
  TagsRender,
  TokensRender,
} from "@/components/product-pages/apps/content/delivery_renders";

const PAGE = findTourPage("content", "delivery");
const LINK = { label: "Geiger Content", href: "/content" };

// /apps/content/delivery: the public read API and its tokens, runtime personalisation, metrics and search by meaning.
export function ContentDeliveryPage() {
  return (
    <AreaPage area={PAGE.id} links={findTour("content").pages} linksLabel="More from Geiger Content">
      <AreaHero
        eyebrow={PAGE.eyebrow}
        title={PAGE.headline}
        art={
          <HeroArt focus={["62%", "38%"]} plane={{ "--plane-top": "-8%", "--plane-left": "16%" }}>
            <RestWindow />
          </HeroArt>
        }
      />

      <AreaSection
        id="api"
        title="Ask for exactly the entries you need"
        lead="Published entries are readable from a REST API. Filter, sort, populate references and page through results in the URL, with tokens that carry only the access each app needs."
        link={LINK}
      >
        <Stage
          title="The same entry, in the API and on the site"
          body="Atlas Coffee's shop page reads an origin by its slug, with the linked roastery populated in the same request. Only published entries and their delivered fields come back."
        >
          <Fit width={1000} height={620}>
            <QueryStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="A schema your code can read" body="The _schema endpoint describes every content type and its fields, so the front end knows what it's going to get. A token with schema:read can fetch it.">
            <Fit width={460} height={300}>
              <SchemaRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Tokens with only the access they need" body="Mint a bearer token for each app with just the scopes it needs, such as delivery:read or schema:read. Give it an expiry and revoke it when you're done. Its value is shown only once.">
            <Fit width={460} height={300}>
              <TokensRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Filter, sort and populate in the URL" body="Use operators like $eq, $in, $gte and $containsi, sort on any field, ask for just the fields you need and page through the results.">
            <Fit width={460} height={300}>
              <FiltersRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Published only, checked every time" body="Drafts and scheduled entries aren't served, and a token without the right scope is turned away with a clear error.">
            <Fit width={460} height={300}>
              <ScopeRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="personalise"
        title="Show each visitor the right version"
        lead="Give a slot on your page a set of variants with targeting rules, and let one decide call pick the variant at runtime."
        link={LINK}
      >
        <Stage
          title="Variants, rules and a decision with its reason"
          body="Atlas Coffee's homepage hero has three variants: the autumn menu for subscribers, the morning menu for in-store screens and a default for everyone else. Each decision comes back with the reason it was made."
        >
          <Fit width={1000} height={620}>
            <SlotStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Consent comes first" body="When a visitor has declined personalisation, targeted variants are skipped, the default is served and nothing about the decision is recorded.">
            <Fit width={460} height={300}>
              <ConsentRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Count views and conversions" body="Send page views and conversions to the collect endpoint and they roll up into daily figures for each entry. Visitors who declined analytics aren't counted.">
            <Fit width={460} height={300}>
              <MetricsRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="search"
        title="Find anything by what it means"
        lead="Once your library is indexed, search entries and images by meaning, see how content connects, and catch missing tags and near-duplicates."
        link={LINK}
      >
        <Stage
          title="Search by meaning, not just by words"
          body="Describe what you're after and semantic search returns entries and images close in meaning, each with a score. The knowledge graph shows how they connect through references, tags and similarity."
        >
          <Fit width={1000} height={620}>
            <SearchStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Tags suggested by similar content" body="When similar entries carry a tag that one of them lacks, AI tag suggestions point it out with the evidence, using stored vectors only.">
            <Fit width={460} height={300}>
              <TagsRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Near-duplicates, caught early" body="Duplicate detection pairs published entries that read almost the same, so an editor can decide which one to keep.">
            <Fit width={460} height={300}>
              <DuplicatesRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>
    </AreaPage>
  );
}
