import { AreaHero, AreaPage, AreaSection, CalloutStage, FeatureCell, FeatureGrid, Fit, HeroArt, SplitShowcase, Stage } from "@/components/product-pages/area_kit";
import { TEAM_PAGES, findTeamPage } from "@/components/product-pages/tours";
import {
  DepartmentsStage,
  EmailPurseRender,
  InviteRender,
  JoinRequestsRender,
  MembersRender,
  NewStarterFormRender,
  OneSignInRender,
  OrgHeroWindow,
  PlanProductsRender,
  ProjectAppsRender,
  PurchaseApprovalStage,
  RequestHistoryRender,
  UsageRender,
} from "@/components/product-pages/teams/corporate_renders";

const PAGE = findTeamPage("corporate");

const PEOPLE_POINTS = [
  { title: "Invite by email", body: "Add several people at once, each with the role they start on" },
  { title: "Six roles", body: "Owner, Manager, Leader, User, Technical and Financial Officer" },
  { title: "Join requests", body: "People ask to join with a note, and an admin approves or declines" },
  { title: "Clean exits", body: "Remove a member or revoke an invite before it's accepted" },
];

const USAGE_LEFT = [
  { title: "Projects and seats", body: "How many departments and collaborators the plan covers" },
  { title: "Storage and bandwidth", body: "Every file and download across the organisation" },
];

const USAGE_RIGHT = [
  { title: "AI credits", body: "Shared by every app that uses AI" },
  { title: "Email purse", body: "One balance for the emails every app sends" },
];

// /teams/corporate: Halden Group runs each department as a project in one organisation, brings people in with a role, signs off purchases in order in Forms and keeps usage on one bill.
export function CorporatePage() {
  return (
    <AreaPage area={PAGE.id} links={TEAM_PAGES} linksLabel="Teams on Geiger">
      <AreaHero
        eyebrow={PAGE.eyebrow}
        title={PAGE.headline}
        art={
          <HeroArt focus={["66%", "40%"]} plane={{ "--plane-top": "5%", "--plane-left": "26%" }}>
            <OrgHeroWindow />
          </HeroArt>
        }
      />

      <AreaSection
        id="departments"
        title="One organisation, a project for every department"
        lead="People & HR, Finance, IT, Legal, Facilities and Marketing each get a project in the same organisation, and each project switches on only the apps that team uses."
        link={{ label: "See every app in the suite", href: "/features" }}
      >
        <Stage
          title="Add a department in a minute"
          body="Name the project, pick its apps and it joins the list, with its own members and its own data. Every department sits on the same organisation, plan and bill."
        >
          <Fit width={1000} height={620}>
            <DepartmentsStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="One sign-in for every app" body="Finance moves between its requests in Forms, its close tracker in Flow and its policies in Grey on the same account, without signing in again.">
            <Fit width={460} height={300}>
              <OneSignInRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Each team sees its own tools" body="Projects list only the apps they use. An app the organisation hasn't added yet shows as locked until someone adds it to the plan.">
            <Fit width={470} height={250}>
              <ProjectAppsRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="people"
        title="Bring people in with the right role"
        lead="New starters arrive by invitation, contractors ask to join with a note, and everyone holds a role that says what they can do across the organisation."
        link={{ label: "How organisations work in the Help Center", href: "/help" }}
      >
        <SplitShowcase items={PEOPLE_POINTS} active={1} title="Everyone in one list" body="The Members dialog shows each person with their email and role. Change a role from the list, and see which invitations are still waiting.">
          <Fit width={680} height={500}>
            <MembersRender />
          </Fit>
        </SplitShowcase>
        <FeatureGrid>
          <FeatureCell title="Invite a whole intake at once" body="Paste the new starters' email addresses, choose the role they start on and send. Each gets an email with a link to join.">
            <Fit width={460} height={300}>
              <InviteRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Let people ask to join" body="Someone who isn't invited yet can ask to join with a short note. An admin reads it and approves or declines from the list.">
            <Fit width={460} height={350}>
              <JoinRequestsRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="sign-off"
        title="Requests that follow the chain of sign-off"
        lead="Purchases, new starters and policy exceptions arrive through Geiger Forms and go to each approver in turn, so nothing is bought or granted on a hallway yes."
        link={{ label: "Geiger Forms: responses and approvals", href: "/apps/forms/responses" }}
      >
        <Stage
          title="Every purchase signed in order"
          body="A purchase request goes to the line manager, then Finance, then Procurement, and closes with a countersignature. Each approver sees the cost, the quote and the comments in one place."
        >
          <Fit width={1000} height={620}>
            <PurchaseApprovalStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="One form for every new starter" body="People & HR sends hiring managers the same New starter form, across several pages, with the kit to order and a signature to finish.">
            <Fit width={460} height={380}>
              <NewStarterFormRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Every hand-off on the record" body="Each request keeps its history: who submitted it, who approved it and when, and who it's waiting on now.">
            <Fit width={460} height={270}>
              <RequestHistoryRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="usage"
        title="One bill, and one view of what you use"
        lead="Every department runs on the same plan, so the organisation sees its projects, seats, storage and sending in one place and pays for them once."
        link={{ label: "See pricing", href: "/pricing" }}
      >
        <CalloutStage
          left={USAGE_LEFT}
          right={USAGE_RIGHT}
          title="The whole company's usage on one page"
          body="The usage page sets what each department has used against the plan's allowance, so you can see a limit coming before anyone hits it."
        >
          <Fit width={560} height={360}>
            <UsageRender />
          </Fit>
        </CalloutStage>
        <FeatureGrid>
          <FeatureCell title="Apps added once, used everywhere" body="Add an app to the organisation's plan and every project can switch it on. Add-ons such as custom email templates sit on the same plan.">
            <Fit width={460} height={250}>
              <PlanProductsRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="One balance for every email" body="Receipts, invitations and notifications from every app draw on one email purse for the organisation, with the month's sending week by week.">
            <Fit width={460} height={240}>
              <EmailPurseRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>
    </AreaPage>
  );
}
