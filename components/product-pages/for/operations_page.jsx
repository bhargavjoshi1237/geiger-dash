import { AreaHero, AreaPage, AreaSection, FeatureCell, FeatureGrid, Fit, HeroArt, SplitShowcase, Stage } from "@/components/product-pages/area_kit";
import { findAudiencePage, AUDIENCE_PAGES } from "@/components/product-pages/tours";
import {
  ApprovalRouteRender,
  BudgetRender,
  FacilitiesFormRender,
  HandbookSourcesRender,
  HandbookStage,
  IntranetWidgetRender,
  OpsDeskWindow,
  OpsTriageStage,
  OpsViewsRender,
  RequestRuleRender,
  RequestsStage,
  ResourceRequestsRender,
  SealedFieldRender,
  VaultAccessRender,
  VaultHistoryRender,
  VaultRender,
  WorkQueueRender,
} from "@/components/product-pages/for/operations_renders";

const PAGE = findAudiencePage("operations");

const VAULT_POINTS = [
  { title: "Eight kinds of secret", body: "Passwords, API keys, databases, SSH keys, certificates and more" },
  { title: "Three ways in", body: "A shared PIN or password, or each person's own passkey" },
  { title: "Who can open it", body: "Everyone in the project, managers only or the people you name" },
  { title: "Lockouts and history", body: "Five wrong tries lock it for 15 minutes, and every open is logged" },
];

// /for/operations: Kestrel Aero's ops team takes requests in Forms, tracks the work in Flow, answers from Grey and keeps keys in the vault.
export function OperationsPage() {
  return (
    <AreaPage area={PAGE.id} links={AUDIENCE_PAGES} linksLabel="Who Geiger is for">
      <AreaHero
        title={PAGE.headline}
        art={
          <HeroArt focus={["70%", "34%"]} plane={{ "--plane-top": "4%", "--plane-left": "22%" }}>
            <OpsDeskWindow />
          </HeroArt>
        }
      />

      <AreaSection
        id="requests"
        title="Requests that don't get lost"
        lead="Staff ask through a form instead of a chat message or a hallway. Every IT access and facilities request lands in one inbox with a status, a priority and an owner."
        link={{ label: "Geiger Forms: responses and approvals", href: "/apps/forms/responses" }}
      >
        <Stage
          title="One inbox for every request"
          body="See what's waiting at a glance, from total requests to those that need review or sit in an approval chain. Switch between table and kanban, keep saved views for the queues you check daily, and @mention a colleague in the comments."
        >
          <Fit width={1000} height={620}>
            <RequestsStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell
            title="A form for every kind of request"
            body="Build an IT access request or a facilities request from 36 field types, with logic for follow-up questions, file uploads for a photo of the problem and a signature to finish."
          >
            <Fit width={460} height={330}>
              <FacilitiesFormRender />
            </Fit>
          </FeatureCell>
          <FeatureCell
            title="Approvals that go in order"
            body="Route a request through each approver in turn, from the line manager to IT security, then add a countersignature once everyone has signed off."
          >
            <Fit width={440} height={245}>
              <ApprovalRouteRender />
            </Fit>
          </FeatureCell>
          <FeatureCell
            title="Rules that sort each request"
            body="Automations check every new response, then set its status and priority, add a tag, assign it, email someone or call a webhook URL."
          >
            <Fit width={460} height={330}>
              <RequestRuleRender />
            </Fit>
          </FeatureCell>
          <FeatureCell
            title="Sensitive answers stay sealed"
            body="Mark a field as sensitive and its answers are encrypted, masked in the inbox and revealed only on request. Every view, reveal, export and print goes in the access log."
          >
            <Fit width={440} height={290}>
              <SealedFieldRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="work"
        title="Track every job until it's done"
        lead="Forms holds the request; Geiger Flow is where the team does the work. Both run on the same account, with one sign-in and one bill, so nobody juggles a second tool."
        link={{ label: "Geiger Flow: the issue tracker", href: "/apps/flow/issues" }}
      >
        <Stage
          title="Triage first, then hand it to someone"
          body="New issues wait in triage until someone accepts or declines them. Give each one a priority, labels and a due date as you accept it, and assigning it sends the owner an email."
        >
          <Fit width={1000} height={620}>
            <OpsTriageStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="The questions you ask every morning" body="Ready-made views for Active, Urgent & high, Unassigned and Overdue keep the day's priorities one click away.">
            <Fit width={460} height={240}>
              <OpsViewsRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="A queue for today" body="Project tasks move through To Do, In Progress, Blocked and Done, and the Work Queue counts what's queued, due today and overdue.">
            <Fit width={460} height={270}>
              <WorkQueueRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Ask for people before you need them" body="Raise a resource request for extra hands on a project, and a manager approves or denies it from the same list.">
            <Fit width={460} height={270}>
              <ResourceRequestsRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="See the spend coming" body="The budget tracker sets committed spend against the monthly budget, forecasts the month and shows the variance, line by line.">
            <Fit width={460} height={275}>
              <BudgetRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="answers"
        title="Answers straight from your own manuals"
        lead="Point Geiger Grey at the policies, procedures and handbooks you already keep. Staff ask in plain words and get an answer that cites the page it came from."
        link={{ label: "Geiger Grey: knowledge bases", href: "/apps/grey/knowledge-bases" }}
      >
        <Stage
          title="Every answer shows where it came from"
          body="Each claim carries a numbered citation back to the page, web page or video timestamp it rests on. Sources are marked Verified, Review due or Stale, so an answer never quietly leans on last year's policy."
        >
          <Fit width={1000} height={620}>
            <HandbookStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell
            title="Built from the files you already keep"
            body="Add PDFs with a text layer, Word documents, spreadsheets, slides and web pages. Audio and video are transcribed, so a recorded briefing answers questions too."
          >
            <Fit width={460} height={320}>
              <HandbookSourcesRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Answers on the intranet" body="Put Grey's chat widget on your staff intranet and the team gets cited answers streamed in, without opening another app.">
            <Fit width={470} height={300}>
              <IntranetWidgetRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="keys"
        title="Keep the shared keys under lock"
        lead="Door codes, admin passwords and API keys belong in Flow's vault, not a spreadsheet. Each secret has its own lock and its own list of people who may open it."
        link={{ label: "Geiger Flow: chat, calls and the vault", href: "/apps/flow/team" }}
      >
        <SplitShowcase
          items={VAULT_POINTS}
          active={1}
          title="A lock on every secret"
          body="Open a secret with its PIN or password, or with your own passkey. Five wrong tries lock it for 15 minutes."
        >
          <Fit width={680} height={440}>
            <VaultRender />
          </Fit>
        </SplitShowcase>
        <FeatureGrid>
          <FeatureCell title="Decide who can open it" body="Share a secret with everyone in the project, keep it to managers, or name the people who may open it by email.">
            <Fit width={440} height={290}>
              <VaultAccessRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Every open on the record" body="Each secret keeps its own history of opens, failed attempts and lockouts, so you know who used the hangar codes and when.">
            <Fit width={460} height={250}>
              <VaultHistoryRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>
    </AreaPage>
  );
}
