import { AreaHero, AreaPage, AreaSection, FeatureCell, FeatureGrid, Fit, HeroArt, Stage } from "@/components/product-pages/area_kit";
import { findTourPage, findTour } from "@/components/product-pages/tours";
import {
  AccessStage,
  ArchivedRender,
  AuditRender,
  CacheRender,
  PublishHistoryRender,
  QueueWindow,
  ScheduledRender,
  StatusStage,
  TeamRender,
  TesterRender,
  UnpublishRender,
  VersionsStage,
} from "@/components/product-pages/apps/content/publishing_renders";

const PAGE = findTourPage("content", "publishing");
const LINK = { label: "Geiger Content", href: "/content" };

// /apps/content/publishing: statuses and the publishing queue, version snapshots and rollback, and the controls around them.
export function ContentPublishingPage() {
  return (
    <AreaPage area={PAGE.id} links={findTour("content").pages} linksLabel="More from Geiger Content">
      <AreaHero
        eyebrow={PAGE.eyebrow}
        title={PAGE.headline}
        art={
          <HeroArt focus={["62%", "38%"]} plane={{ "--plane-top": "-8%", "--plane-left": "16%" }}>
            <QueueWindow />
          </HeroArt>
        }
      />

      <AreaSection
        id="queue"
        title="One queue from draft to live"
        lead="Every entry is a Draft, In review, Scheduled, Published or Archived. The publishing queue gathers what's waiting, and publishing is one click from it."
        link={LINK}
      >
        <Stage
          title="Five statuses, set from the entry itself"
          body="Atlas Coffee's editors move an entry along from its Visibility section: send it for review, give it a date, publish it or archive it. All Content shows where everything stands."
        >
          <Fit width={1000} height={620}>
            <StatusStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Everything with a date, in one list" body="Give an entry a date and it joins the Scheduled screen, so the next few weeks of releases sit side by side.">
            <Fit width={460} height={300}>
              <ScheduledRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Archive without losing anything" body="Archived entries leave editing and delivery but wait on the Archived screen, ready to restore as a draft.">
            <Fit width={460} height={300}>
              <ArchivedRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="versions"
        title="Snapshots you can roll back to"
        lead="Saving in the structured editor and publishing both take a numbered snapshot of the entry. Compare any two, and put an older one back when a change goes wrong."
        link={LINK}
      >
        <Stage
          title="Roll back with your eyes open"
          body="Pick a baseline and a later version to see every path that changed. Restore puts the baseline's title, slug, excerpt, body and data back on the live entry, and says so before it does."
        >
          <Fit width={1000} height={620}>
            <VersionsStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="A log of every publish" body="Publishing History lists each publish across every entry with the snapshot it took, and restores any of them as a draft.">
            <Fit width={460} height={300}>
              <PublishHistoryRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Take it down as fast as it went up" body="Unpublish a live entry from the queue and it goes back to Draft, out of the delivery API.">
            <Fit width={460} height={300}>
              <UnpublishRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="control"
        title="Decide who can publish, and see who did"
        lead="Roles and permissions are enforced in the database, every change lands in an append-only audit log, and the delivery cache clears on demand."
        link={LINK}
      >
        <Stage
          title="Roles built from permission keys"
          body="Start from the Owner, Admin, Editor, Writer and Viewer roles, or compose your own from the permission catalog. Atlas Coffee's shop editors can edit and publish, but not delete."
        >
          <Fit width={1000} height={620}>
            <AccessStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="An append-only audit log" body="Every create, update and delete across entries, collections, assets and slots is recorded, with who did it and when.">
            <Fit width={460} height={300}>
              <AuditRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Clear the cache when you need to" body="Invalidate a published entry and its delivery caches expire, so the next read fetches the fresh version. Each request is logged.">
            <Fit width={460} height={300}>
              <CacheRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Check a permission before it matters" body="The permission tester evaluates one person's grants against any permission key, straight from the database, without changing anything.">
            <Fit width={460} height={300}>
              <TesterRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Everyone in their place" body="Team & Members shows who holds which role. Invite people, change their role or revoke a grant from one list.">
            <Fit width={460} height={300}>
              <TeamRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>
    </AreaPage>
  );
}
