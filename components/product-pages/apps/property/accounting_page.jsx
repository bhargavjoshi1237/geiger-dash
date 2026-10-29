import { AreaHero, AreaPage, AreaSection, FeatureCell, FeatureGrid, Fit, HeroArt, Stage } from "@/components/product-pages/area_kit";
import { findTourPage, findTour } from "@/components/product-pages/tours";
import {
  BillsRender,
  BudgetRender,
  DelinquencyRender,
  LedgerStage,
  LedgerWindow,
  OwnerStatementRender,
  ReconcileRender,
  RentStage,
  ReportsStage,
  TrialBalanceRender,
  VoidRender,
  WebhookRender,
} from "@/components/product-pages/apps/property/accounting_renders";

const PAGE = findTourPage("property", "accounting");
const LINK = { label: "Geiger Property", href: "/property" };

// /apps/property/accounting: the double-entry ledger, rent through Stripe and the reports that read them.
export function PropertyAccountingPage() {
  return (
    <AreaPage area={PAGE.id} links={findTour("property").pages} linksLabel="More from Geiger Property">
      <AreaHero
        title={PAGE.headline}
        art={
          <HeroArt focus={["72%", "46%"]} plane={{ "--plane-top": "-12%", "--plane-left": "26%" }}>
            <LedgerWindow />
          </HeroArt>
        }
      />

      <AreaSection
        id="ledger"
        title="Double-entry books, balanced on every post"
        lead="Every charge, payment, bill and owner draw posts as a balanced journal entry against your chart of accounts. Mistakes are voided, never edited."
        link={LINK}
      >
        <Stage
          title="Every entry, down to its lines"
          body="The chart of accounts keeps operating, trust and deposit cash apart, with a live balance on every account. Open any entry to see its debit and credit lines, tagged with the property, unit, lease and tenant they belong to."
        >
          <Fit width={1000} height={620}>
            <LedgerStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="A trial balance that proves it" body="Switch the ledger to its trial balance to see every account's debits and credits for the period, and whether they agree.">
            <Fit width={460} height={330}>
              <TrialBalanceRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Fix it with a void, not an edit" body="Voiding an entry posts its reversal beside it, so the original, the reversal and the correction all stay in the journal.">
            <Fit width={460} height={220}>
              <VoidRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Bills, aged and approved" body="Enter vendor bills against your accounts, see what's current or past due, and hold anything above the approval limit until someone approves it.">
            <Fit width={460} height={280}>
              <BillsRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Budgets against what actually happened" body="Plan each property's budget account by account, month by month, then compare it with the ledger's actuals, the variance and net operating income.">
            <Fit width={460} height={260}>
              <BudgetRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="rent"
        title="Collect rent and match the bank"
        lead="Send a Stripe payment link or take a payment on the spot. Each payment posts to the lease's ledger when it succeeds, ready to clear against the bank statement."
        link={LINK}
      >
        <Stage
          title="Rent through Stripe, on the books"
          body="Online Payments lists every card and ACH payment with its status and payout date. Send a payment link and the payer finishes on a secure Stripe checkout; residents can also pay from their portal."
        >
          <Fit width={1000} height={620}>
            <RentStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Reconcile to a difference of zero" body="Enter the statement's ending balance, tick off the deposits and withdrawals that cleared, and finalize once the difference is zero.">
            <Fit width={460} height={290}>
              <ReconcileRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Every Stripe event, logged" body="Verified Stripe events are logged as they arrive, so a refund, a failed charge or a payout updates the payment it belongs to.">
            <Fit width={460} height={240}>
              <WebhookRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="reports"
        title="Reports that read the same ledger"
        lead="Rent roll, delinquency, owner statements and the trial balance all come from the same posted entries, so the numbers agree with each other."
        link={LINK}
      >
        <Stage
          title="A rent roll you can hand over"
          body="Every unit with its status, tenant, lease end, rent, charges, collections and ledger balance for the period. Print it to PDF or export it as CSV, like Delinquency, Owner Statements, the 1099 Summary and the rest."
        >
          <Fit width={1000} height={620}>
            <ReportsStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Know who owes what, and for how long" body="Open charges per lease are aged from their charge date into 30-day buckets, with each tenant's oldest charge alongside.">
            <Fit width={460} height={270}>
              <DelinquencyRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Owner statements from the ledger" body="Each owner's statement shows income, expenses, management fees, distributions and the ending balance for their share of each property.">
            <Fit width={440} height={300}>
              <OwnerStatementRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>
    </AreaPage>
  );
}
