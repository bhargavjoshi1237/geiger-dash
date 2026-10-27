import { AreaHero, AreaPage, AreaSection, FeatureCell, FeatureGrid, Fit, HeroArt, Stage } from "@/components/product-pages/area_kit";
import { findTourPage, findTour } from "@/components/product-pages/tours";
import {
  ApplicationRender,
  ConditionRender,
  DecisionRender,
  DepositRender,
  LeaseStage,
  LeasesWindow,
  ListingStage,
  MoveInStage,
  NoticesRender,
  PipelineRender,
  RenewalRender,
  ShowingsRender,
} from "@/components/product-pages/apps/property/leasing_renders";

const PAGE = findTourPage("property", "leasing");
const LINK = { label: "Geiger Property", href: "/property" };

// /apps/property/leasing: listings, prospects and applications, the lease itself and move-in day.
export function PropertyLeasingPage() {
  return (
    <AreaPage area={PAGE.id} links={findTour("property").pages} linksLabel="More from Geiger Property">
      <AreaHero
        eyebrow={PAGE.eyebrow}
        title={PAGE.headline}
        art={
          <HeroArt focus={["66%", "46%"]} plane={{ "--plane-top": "-12%", "--plane-left": "26%" }}>
            <LeasesWindow />
          </HeroArt>
        }
      />

      <AreaSection
        id="listings"
        title="Fill every vacancy from one pipeline"
        lead="Publish a listing for each vacant unit, follow every prospect from first contact to a tour, and review applications against your own income criteria."
        link={LINK}
      >
        <Stage
          title="A listing, and everyone it brought in"
          body="Each listing carries its photos, asking rent, deposit, lease terms and pet policy, and counts the leads, showings and applications it has produced. Prospects move from New and Contacted to a showing, a tour and an application."
        >
          <Fit width={1000} height={620}>
            <ListingStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Showings for every kind of tour" body="Book in-person, self-guided or virtual tours with an agent and a time, then log the outcome and the prospect's interest once it's done.">
            <Fit width={460} height={280}>
              <ShowingsRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Applications checked against your criteria" body="See income against rent next to your 3× rule, and record rental history, references and the application fee as you verify them.">
            <Fit width={440} height={290}>
              <ApplicationRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Every stage move on the record" body="Click a stage to move a prospect along. The stage history keeps who moved them, when, and the note that went with it.">
            <Fit width={460} height={230}>
              <PipelineRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Decide, with conditions if you need them" body="Approve, approve with conditions such as an extra deposit or a cosigner, or deny with the reasons on file. An approved application is ready to become a lease.">
            <Fit width={460} height={300}>
              <DecisionRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="leases"
        title="Every lease, from draft to renewal"
        lead="A lease keeps its term, rent, deposit, people and documents together, with a status that always says where it stands."
        link={LINK}
      >
        <Stage
          title="One page for everything on the lease"
          body="The overview shows the rent, the days remaining, the parties and the readiness steps, from linking the unit to generating the lease document. Status runs from Draft and Pending through Active, Expiring soon and Notice given to Renewed, Terminated or Ended."
        >
          <Fit width={1000} height={620}>
            <LeaseStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Renewals with the numbers side by side" body="Send a renewal offer with the proposed rent and the change from today's. Accepting it creates the renewed lease, chained to the one before.">
            <Fit width={460} height={250}>
              <RenewalRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Notices served and received" body="Record late-rent, entry, violation and vacate notices with how each was delivered, and see which have passed their cure-by date.">
            <Fit width={460} height={250}>
              <NoticesRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="move-in"
        title="Hand over the keys with a record"
        lead="Work through the move-in checklist, rate every room in the inspection, and keep the deposits you hold against the lease."
        link={LINK}
      >
        <Stage
          title="An inspection, room by room"
          body="Rate each item from New to Damaged with notes and photos, while the move-in checklist tracks the deposit, the first month's rent, insurance, keys and the portal invitation."
        >
          <Fit width={1000} height={620}>
            <MoveInStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Deposits you can account for" body="Each deposit records its amount, how it was paid and where it stands, from Held to Awaiting disposition, Returned or Forfeited.">
            <Fit width={460} height={280}>
              <DepositRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="The unit's condition at a glance" body="Every inspection totals its ratings, so the move-out inspection can be compared with the condition the unit was handed over in.">
            <Fit width={440} height={290}>
              <ConditionRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>
    </AreaPage>
  );
}
