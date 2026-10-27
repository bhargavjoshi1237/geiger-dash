import { AreaHero, AreaPage, AreaSection, FeatureCell, FeatureGrid, Fit, HeroArt, SplitShowcase, Stage } from "@/components/product-pages/area_kit";
import { findTourPage, findTour } from "@/components/product-pages/tours";
import {
  CostsRender,
  EntryRender,
  EstimatesRender,
  HoldRender,
  OwnerApprovalRender,
  OwnersRender,
  PeopleStage,
  ResidentPortalRender,
  SignInRender,
  VendorsRender,
  WorkOrderStage,
  WorkOrdersWindow,
} from "@/components/product-pages/apps/property/maintenance_renders";

const PAGE = findTourPage("property", "maintenance");
const LINK = { label: "Geiger Property", href: "/property" };

const PORTALS = [
  { title: "Resident portal", body: "Pay rent, report a problem and read the lease" },
  { title: "Owner portal", body: "Statements, approvals and documents" },
  { title: "Vendor portal", body: "Accept, schedule and invoice assigned jobs" },
  { title: "Sign-in", body: "An email link or a six-digit code, no password" },
];

// /apps/property/maintenance: work orders, the tenants, owners and vendors behind them, and their portals.
export function PropertyMaintenancePage() {
  return (
    <AreaPage area={PAGE.id} links={findTour("property").pages} linksLabel="More from Geiger Property">
      <AreaHero
        eyebrow={PAGE.eyebrow}
        title={PAGE.headline}
        art={
          <HeroArt focus={["70%", "42%"]} plane={{ "--plane-top": "-12%", "--plane-left": "26%" }}>
            <WorkOrdersWindow />
          </HeroArt>
        }
      />

      <AreaSection
        id="work-orders"
        title="Every job, from report to repair"
        lead="Tenant requests, staff reports and field visits land in one list, each with a priority, a due date and the vendor on it."
        link={LINK}
      >
        <Stage
          title="A work order that holds the whole job"
          body="Each work order carries its details, location and entry notes, the vendor and visit window, estimates and costs, the on-site checklist and photos, and a timeline of every status change from Open to Completed."
        >
          <Fit width={1000} height={620}>
            <WorkOrderStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Know before you knock" body="Record whether the technician can enter, call first or needs the resident there, the days and times that suit, and any pets in the home.">
            <Fit width={460} height={290}>
              <EntryRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Say why it's on hold" body="Put a job on hold with a reason, from waiting on parts to waiting on tenant access, and the Overdue view keeps anything past its due date in sight.">
            <Fit width={460} height={300}>
              <HoldRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Compare quotes, accept one" body="Record each vendor's estimate with its amount and validity, then mark the one you accept and decline the rest.">
            <Fit width={460} height={220}>
              <EstimatesRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Every cost, line by line" body="Add labour, materials with markup and trip charges as line items, and flag any of them as a chargeback to the tenant.">
            <Fit width={460} height={260}>
              <CostsRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="people"
        title="Tenants, owners and vendors in one place"
        lead="Keep every resident, owner and vendor on file, with their units, balances, payouts and insurance a click away."
        link={LINK}
      >
        <Stage
          title="Everyone you work with, on record"
          body="Tenants show their unit, lease end, renters insurance, portal access and balance. Vendors carry their trades, insurance certificate, rate, rating and the work orders they have open."
        >
          <Fit width={1000} height={620}>
            <PeopleStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Owners, their payouts and their fees" body="Link each owner to their properties and keep their payout method, W-9 and management fee with the record.">
            <Fit width={460} height={250}>
              <OwnersRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Vendors you can send on site" body="See at a glance whose certificate of insurance is current, expiring soon or expired before you dispatch a job.">
            <Fit width={460} height={260}>
              <VendorsRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="portals"
        title="A portal for everyone you work with"
        lead="Residents, owners and vendors sign in with a link or a one-time code from their email, and see only what is theirs."
        link={LINK}
      >
        <SplitShowcase
          items={PORTALS}
          active={0}
          title="Residents report it from home"
          body="The resident portal lists every request with its status. A new request takes a category, the room, entry permission, the best times and photos, and lands in Work Orders for the team to review."
        >
          <Fit width={680} height={460}>
            <ResidentPortalRender />
          </Fit>
        </SplitShowcase>
        <FeatureGrid>
          <FeatureCell title="No passwords to forget" body="Residents, owners and vendors get a sign-in link by email, or type the six-digit code from the same email on the device they're using.">
            <Fit width={460} height={290}>
              <SignInRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Owners sign off from their portal" body="Jobs above a property's approval limit wait in the owner's portal, where they approve or reject with a note. Their statements and documents sit alongside.">
            <Fit width={460} height={280}>
              <OwnerApprovalRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>
    </AreaPage>
  );
}
