import { BarChart3, Check, Copy, CreditCard, Download, FileSpreadsheet, FileText, Landmark, Link2, Plus, Printer, Receipt, Scale, Send, Undo2, Webhook } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, LINE, MonoLabel, Typed, Window } from "@/components/product-pages/mock_kit";
import {
  AppShell,
  Cell2,
  Field,
  FilterChip,
  GhostButton,
  HeadRow,
  Pill,
  PrimaryButton,
  Row,
  ScreenHead,
  SearchBox,
  StatStrip,
  StatusPill,
  Tick,
  ViewTabs,
  usd,
} from "@/components/product-pages/apps/property/property_kit";
import styles from "@/components/product-pages/product_pages.module.css";

// Geiger Property accounting renders for Elmwood Residences: the journal, the chart of accounts, rent through Stripe and the reports.

const JOURNAL = [
  { date: "Oct 27", memo: "Payment · Leah Mensah — FL-3B", source: "Payment", accounts: "1010 Trust Cash · 1200 Accounts Receivable", status: "Posted", amount: 2150 },
  { date: "Oct 27", memo: "Northwind HVAC — No heat, HV-12", source: "Bill", accounts: "5000 Repairs & Maintenance · 2000 Accounts Payable", status: "Posted", amount: 380 },
  { date: "Oct 26", memo: "Payment · Zara Patel — HV-12", source: "Payment", accounts: "1010 Trust Cash · 1200 Accounts Receivable", status: "Posted", amount: 2240 },
  { date: "Oct 25", memo: "Harbour View Partners LLC", source: "Owner distribution", accounts: "3200 Owner Distributions · 1010 Trust Cash", status: "Posted", amount: 58000 },
  { date: "Oct 25", memo: "October fee · Harbour View", source: "Management fee", accounts: "5400 Management Fees · 4500 Management Fee Income", status: "Posted", amount: 6273.6 },
  { date: "Oct 24", memo: "Ines Duarte — FL-5C", source: "Deposit received", accounts: "1020 Security Deposit Trust Cash · 2100 Security Deposits Held", status: "Posted", amount: 2390 },
  { date: "Oct 22", memo: "Reclass water bill", source: "Journal entry", accounts: "5100 Utilities · 5100 Utilities", status: "Void", amount: 612 },
  { date: "Oct 22", memo: "Reversal · Reclass water bill", source: "Journal entry", accounts: "5100 Utilities · 5100 Utilities", status: "Reversal", amount: 612 },
  { date: "Oct 21", memo: "Riverbend Water Co. — Elmwood Court", source: "Bill", accounts: "5100 Utilities · 2000 Accounts Payable", status: "Posted", amount: 1180 },
];

const JOURNAL_COLS = "62px minmax(0,1.5fr) minmax(0,1.6fr) 86px 96px";

// The hero plane: the General Ledger's journal, a new balanced entry being written over it.
export function LedgerWindow() {
  return (
    <AppShell open="Accounting" active="General Ledger" className="relative h-[700px] w-[1180px]">
      <ScreenHead
        title="General Ledger"
        description="Every balanced entry behind your books — charges, payments, bills and owner funds. Fix mistakes by voiding; nothing is ever edited in place."
        actions={<PrimaryButton icon={Plus}>New Journal Entry</PrimaryButton>}
      />
      <div className="flex flex-col gap-4 px-6 pt-4">
        <StatStrip
          stats={[
            { label: "Entries", value: "1,284", footer: "In this range" },
            { label: "Total posted", value: "$418,906", footer: "1,282 live entries" },
            { label: "Voided", value: "1", footer: "1 reversal" },
            { label: "Trial check", value: "Balanced", footer: "Debits $769,285 · Credits $769,285", className: "text-emerald-600 dark:text-emerald-400" },
          ]}
        />
        <div className="flex items-center gap-2">
          <FilterChip>Journal</FilterChip>
          <FilterChip>All types</FilterChip>
          <span className="inline-flex h-8 items-center rounded-md border border-foreground/[0.1] px-2.5 text-[12px] text-foreground/80 tabular-nums">Oct 1, 2026 – Oct 31, 2026</span>
          <SearchBox className="ml-auto w-[180px]">Search entries…</SearchBox>
        </div>
      </div>
      <div className={cn("mx-6 mt-3 overflow-hidden rounded-xl border", LINE)}>
        <HeadRow cols={JOURNAL_COLS} labels={["Date", "Entry", "Accounts", "Status", "Amount"]} right={[4]} />
        {JOURNAL.map((entry) => (
          <Row key={entry.memo} cols={JOURNAL_COLS} className={entry.status === "Void" ? "opacity-60" : undefined}>
            <span className="text-[12px] text-muted-foreground tabular-nums">{entry.date}</span>
            <Cell2 top={<span className={entry.status === "Void" ? "line-through decoration-foreground/30" : undefined}>{entry.memo}</span>} bottom={entry.source} />
            <span className="truncate text-[12px] text-muted-foreground">{entry.accounts}</span>
            <span>
              <StatusPill area="entry" status={entry.status} />
            </span>
            <span className="text-right font-semibold tabular-nums">{usd(entry.amount, true)}</span>
          </Row>
        ))}
      </div>
      <div className="absolute top-[250px] left-[560px] z-[2] w-[440px] rounded-xl border border-foreground/[0.12] bg-surface-card p-5 text-[12px] shadow-2xl shadow-black/30 dark:bg-surface-dialog">
        <div className="text-[15px] font-semibold tracking-[-0.01em]">New Journal Entry</div>
        <div className="mt-3 grid grid-cols-[120px_1fr] gap-2.5">
          <Field label="Date">Oct 27, 2026</Field>
          <div>
            <div className="mb-1 text-[11px] text-muted-foreground">Memo</div>
            <div className="flex h-8 items-center rounded-md border border-foreground/30 px-2.5 text-[13px]">
              <Typed text="Reclass October water bill" delay={1.4} />
            </div>
          </div>
        </div>
        <div className={cn("mt-3 overflow-hidden rounded-lg border", LINE)}>
          <HeadRow cols="minmax(0,1fr) 76px 76px" labels={["Account", "Debit", "Credit"]} right={[1, 2]} className="px-3" />
          {[
            ["5100 · Utilities", "Harbour View share", "612.00", ""],
            ["5100 · Utilities", "Out of Elmwood Court", "", "612.00"],
          ].map(([account, memo, debit, credit]) => (
            <Row key={memo} cols="minmax(0,1fr) 76px 76px" className="px-3 py-2 last:border-b-0">
              <Cell2 top={<span className="font-normal">{account}</span>} bottom={memo} />
              <span className="text-right tabular-nums">{debit || "—"}</span>
              <span className="text-right tabular-nums">{credit || "—"}</span>
            </Row>
          ))}
        </div>
        <div className="mt-2.5 flex items-center justify-between">
          <GhostButton icon={Plus} className="h-7">
            Add Line
          </GhostButton>
          <span className={cn("text-emerald-600 tabular-nums dark:text-emerald-400", styles.popIn)} style={{ "--pop-delay": "2.4s" }}>
            Debits $612.00 · Credits $612.00
          </span>
        </div>
        <div className="mt-4 flex items-center justify-end gap-2">
          <span className="px-3 text-muted-foreground">Cancel</span>
          <PrimaryButton>Post Entry</PrimaryButton>
        </div>
      </div>
    </AppShell>
  );
}

const ACCOUNTS = [
  { number: "1000", name: "Operating Cash", sub: "Cash / bank", type: "Asset", balance: 86420.18 },
  { number: "1010", name: "Trust Cash", sub: "Cash / bank", trust: true, type: "Asset", balance: 412906.4 },
  { number: "1020", name: "Security Deposit Trust Cash", sub: "Cash / bank", trust: true, type: "Asset", balance: 248310 },
  { number: "1200", name: "Accounts Receivable", sub: "Accounts receivable", type: "Asset", balance: 14826 },
  { number: "2000", name: "Accounts Payable", sub: "Accounts payable", type: "Liability", balance: 9412.75 },
  { number: "2100", name: "Security Deposits Held", sub: "Deposits held", trust: true, type: "Liability", balance: 248310 },
  { number: "3200", name: "Owner Distributions", sub: "Owner distributions", type: "Equity", balance: 151200 },
  { number: "4000", name: "Rental Income", sub: "Income", type: "Income", balance: 2624800 },
  { number: "5000", name: "Repairs & Maintenance", sub: "Expense", type: "Expense", balance: 86940 },
  { number: "5100", name: "Utilities", sub: "Expense", type: "Expense", balance: 41275.5 },
];

const COA_COLS = "56px minmax(0,1fr) 72px 70px 118px";

// Section stage: the chart of accounts behind, one payment's balanced lines open in front.
export function LedgerStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <Window className="absolute top-0 left-0 h-[660px] w-[700px]">
        <ScreenHead title="Chart of Accounts" description="Assets, liabilities, equity, income and expenses, each with its live balance." actions={<PrimaryButton icon={Plus}>New Account</PrimaryButton>} />
        <div className="px-5 pt-4">
          <StatStrip
            stats={[
              { label: "Accounts", value: "29", footer: "29 active" },
              { label: "Trust cash", value: "$661,216", footer: "Held for owners & residents" },
              { label: "Net income", value: "$1.94M", footer: "All periods" },
            ]}
          />
        </div>
        <div className={cn("mx-5 mt-4 overflow-hidden rounded-xl border", LINE)}>
          <HeadRow cols={COA_COLS} labels={["Number", "Account", "Type", "Status", "Balance"]} right={[4]} />
          {ACCOUNTS.map((account) => (
            <Row key={account.number} cols={COA_COLS} className="py-2">
              <span className="font-mono text-[12px] text-muted-foreground">{account.number}</span>
              <span className="flex min-w-0 items-center gap-2">
                <Cell2 top={account.name} bottom={account.sub} />
                {account.trust ? (
                  <Pill tone="neutral" dot={false}>
                    Trust
                  </Pill>
                ) : null}
              </span>
              <span className="text-[12px] text-muted-foreground">{account.type}</span>
              <span>
                <Pill tone="emerald">Active</Pill>
              </span>
              <span className="text-right font-semibold tabular-nums">{usd(account.balance, true)}</span>
            </Row>
          ))}
        </div>
      </Window>
      <div className={cn("absolute top-[110px] left-[560px] z-[2] w-[430px]", styles.float)}>
        <Window className="shadow-2xl shadow-black/30">
          <div className={cn("border-b px-4 py-3.5", LINE)}>
            <div className="flex items-center gap-2">
              <span className="truncate text-[14px] font-semibold">Payment · Leah Mensah — FL-3B</span>
              <StatusPill area="entry" status="Posted" className="ml-auto" />
            </div>
            <div className="mt-0.5 text-[12px] text-muted-foreground">Oct 27, 2026 · Payment · The Foundry Lofts</div>
          </div>
          <HeadRow cols="minmax(0,1fr) 84px 84px" labels={["Account", "Debit", "Credit"]} right={[1, 2]} className="px-4" />
          {[
            { account: "1010 · Trust Cash", dims: "FL-3B · Leah Mensah · Cleared", debit: "$2,150.00", credit: "—" },
            { account: "1200 · Accounts Receivable", dims: "FL-3B · Lease · Leah Mensah", debit: "—", credit: "$2,150.00" },
          ].map((line, index) => (
            <Row key={line.account} cols="minmax(0,1fr) 84px 84px" className={cn("px-4", styles.popIn)} style={{ "--pop-delay": `${0.4 + index * 0.2}s` }}>
              <Cell2 top={line.account} bottom={line.dims} />
              <span className="text-right tabular-nums">{line.debit}</span>
              <span className="text-right tabular-nums">{line.credit}</span>
            </Row>
          ))}
          <Row cols="minmax(0,1fr) 84px 84px" className="border-b-0 bg-foreground/[0.02] px-4">
            <span className="text-[12px] font-medium">Total</span>
            <span className="text-right font-semibold tabular-nums">$2,150.00</span>
            <span className="text-right font-semibold tabular-nums">$2,150.00</span>
          </Row>
          <div className={cn("flex items-center gap-2 border-t px-4 py-3 text-[12px] text-muted-foreground", LINE)}>
            <Check className="size-3.5 text-emerald-500" strokeWidth={2.5} /> Debits equal credits
            <GhostButton icon={Undo2} className="ml-auto">
              Void Entry
            </GhostButton>
          </div>
        </Window>
      </div>
    </div>
  );
}

const TRIAL = [
  ["1010", "Trust Cash", 268400, 214860],
  ["1200", "Accounts Receivable", 262480, 258330],
  ["2000", "Accounts Payable", 31240, 33615],
  ["3200", "Owner Distributions", 173550, 0],
  ["4000", "Rental Income", 0, 262480],
  ["5000", "Repairs & Maintenance", 33615, 0],
];

const TRIAL_COLS = "40px minmax(0,1fr) 86px 86px";

// Cell: the trial balance tab, debits and credits totalling the same.
export function TrialBalanceRender() {
  return (
    <div className="mx-auto w-[460px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card text-[12px] dark:bg-surface-subtle">
      <div className={cn("flex items-center gap-2 border-b px-4 py-2", LINE)}>
        <ViewTabs tabs={["Journal", "Trial balance"]} active={1} />
        <span className="ml-auto text-[11px] text-muted-foreground">October 2026</span>
      </div>
      <HeadRow cols={TRIAL_COLS} labels={["No.", "Account", "Debits", "Credits"]} right={[2, 3]} className="px-4" />
      {TRIAL.map(([number, name, debit, credit]) => (
        <Row key={number} cols={TRIAL_COLS} className="px-4 py-2">
          <span className="font-mono text-[11px] text-muted-foreground">{number}</span>
          <span className="truncate text-foreground/90">{name}</span>
          <span className="text-right tabular-nums">{debit ? usd(debit, true) : "—"}</span>
          <span className="text-right tabular-nums">{credit ? usd(credit, true) : "—"}</span>
        </Row>
      ))}
      <Row cols={TRIAL_COLS} className="border-b-0 bg-foreground/[0.03] px-4 py-2.5">
        <span />
        <span className={cn("inline-flex", styles.popIn)} style={{ "--pop-delay": "0.8s" }}>
          <Pill tone="emerald">In balance</Pill>
        </span>
        <span className="text-right font-semibold tabular-nums">$769,285.00</span>
        <span className="text-right font-semibold tabular-nums">$769,285.00</span>
      </Row>
    </div>
  );
}

// Cell: a mistaken entry voided, its reversal and the corrected entry side by side.
export function VoidRender() {
  const rows = [
    { memo: "Reclass water bill", note: "Oct 22 · Journal entry · voided by Ethan Caldwell", status: "Void", amount: "$612.00", dim: true },
    { memo: "Reversal · Reclass water bill", note: "Oct 22 · posted with the void", status: "Reversal", amount: "$612.00" },
    { memo: "Reclass October water bill", note: "Oct 27 · Journal entry", status: "Posted", amount: "$612.00", late: true },
  ];
  return (
    <div className="mx-auto w-[460px] text-[12px]">
      <div className="overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card dark:bg-surface-subtle">
        {rows.map((row) => (
          <div key={row.memo} className={cn("flex items-center gap-3 border-b px-4 py-3 last:border-b-0", LINE, row.late && styles.popIn)} style={row.late ? { "--pop-delay": "0.8s" } : undefined}>
            <div className={cn("min-w-0 flex-1", row.dim && "opacity-60")}>
              <div className={cn("truncate text-[13px] text-foreground/90", row.dim && "line-through decoration-foreground/30")}>{row.memo}</div>
              <div className="truncate text-[11px] text-muted-foreground">{row.note}</div>
            </div>
            <StatusPill area="entry" status={row.status} />
            <span className="w-[64px] text-right tabular-nums">{row.amount}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 px-1 text-muted-foreground">
        <Undo2 className="size-3.5" /> Nothing is ever edited in place
      </div>
    </div>
  );
}

const BILLS = [
  { vendor: "Northwind HVAC", what: "Boiler circulator pump · Harbour View", due: "Nov 20", aging: "Current", status: "Pending approval", balance: 1240 },
  { vendor: "Riverbend Water Co.", what: "September water · Elmwood Court", due: "Oct 15", aging: "1–30", status: "Partially paid", balance: 590 },
  { vendor: "Northwind HVAC", what: "No heat, HV-12", due: "Nov 10", aging: "Current", status: "Open", balance: 380 },
  { vendor: "Greenway Grounds", what: "Gutter clearing · Elmwood Court", due: "Oct 30", aging: "Current", status: "Paid", balance: 0 },
];

// Cell: bills and payables with their aging, one waiting on approval.
export function BillsRender() {
  return (
    <div className="mx-auto w-[460px] text-[12px]">
      <div className="mb-2.5 grid grid-cols-3 gap-2">
        {[
          ["Open payables", "$9,413"],
          ["1–30 days", "$590"],
          ["Paid this month", "$14,880"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-foreground/[0.08] bg-surface-card px-3 py-2 dark:bg-surface-subtle">
            <div className="text-[11px] text-muted-foreground">{label}</div>
            <div className="mt-0.5 text-[15px] font-semibold tabular-nums">{value}</div>
          </div>
        ))}
      </div>
      <div className="overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card dark:bg-surface-subtle">
        {BILLS.map((bill) => (
          <div key={bill.what} className={cn("flex items-center gap-3 border-b px-4 py-2.5 last:border-b-0", LINE)}>
            <Receipt className="size-3.5 shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-foreground/90">{bill.vendor}</div>
              <div className="truncate text-[11px] text-muted-foreground">
                {bill.what} · Due {bill.due}
              </div>
            </div>
            {bill.aging !== "Current" ? <span className="text-[11px] text-amber-700 tabular-nums dark:text-amber-300">{bill.aging}</span> : null}
            <StatusPill area="bill" status={bill.status} />
            <span className="w-[52px] text-right tabular-nums">{usd(bill.balance)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const BUDGET = [
  { account: "Rental Income", budget: 760000, actual: 768240 },
  { account: "Repairs & Maintenance", budget: 36000, actual: 41370, expense: true },
  { account: "Utilities", budget: 24000, actual: 22180, expense: true },
  { account: "Management Fees", budget: 60800, actual: 61459, expense: true },
];

// Cell: Harbour View's 2025 budget against the ledger's actuals, with the variance.
export function BudgetRender() {
  return (
    <div className="mx-auto w-[460px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card text-[12px] dark:bg-surface-subtle">
      <div className={cn("flex items-center gap-2 border-b px-4 py-2.5", LINE)}>
        <span className="text-[13px] font-medium">Harbour View · 2025</span>
        <Pill tone="emerald">Approved</Pill>
        <span className="ml-auto text-muted-foreground">Budget vs actual</span>
      </div>
      <HeadRow cols="minmax(0,1fr) 64px 64px 74px 58px" labels={["Account", "Budget", "Actual", "% of budget", "Variance"]} right={[1, 2, 4]} className="px-4" />
      {BUDGET.map((row, index) => {
        const share = Math.round((row.actual / row.budget) * 100);
        const variance = row.expense ? row.budget - row.actual : row.actual - row.budget;
        return (
          <Row key={row.account} cols="minmax(0,1fr) 64px 64px 74px 58px" className="px-4 py-2">
            <span className="truncate text-foreground/90">{row.account}</span>
            <span className="text-right text-muted-foreground tabular-nums">{usd(row.budget)}</span>
            <span className="text-right tabular-nums">{usd(row.actual)}</span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/[0.08]">
                <span
                  className={cn("block h-full origin-left rounded-full", share > 100 && row.expense ? "bg-red-500" : "bg-foreground/45", styles.fill)}
                  style={{ width: `${Math.min(100, share)}%`, "--fill-delay": `${0.3 + index * 0.12}s` }}
                />
              </span>
              <span className="w-7 text-right text-[11px] text-muted-foreground tabular-nums">{share}%</span>
            </span>
            <span className={cn("text-right tabular-nums", variance < 0 ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400")}>
              {variance < 0 ? "−" : "+"}
              {usd(Math.abs(variance))}
            </span>
          </Row>
        );
      })}
      <div className="grid grid-cols-3 divide-x divide-foreground/[0.07]">
        {[
          ["Income vs budget", "+$8,240", "text-emerald-600 dark:text-emerald-400"],
          ["Expense vs budget", "−$4,209", "text-red-600 dark:text-red-400"],
          ["Actual NOI", "$643,231", ""],
        ].map(([label, value, tone]) => (
          <div key={label} className="px-4 py-2.5">
            <div className="text-[11px] text-muted-foreground">{label}</div>
            <div className={cn("mt-0.5 text-[15px] font-semibold tabular-nums", tone)}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const PAYMENTS = [
  { who: "Samuel Okoro", what: "Holding deposit · Payment link", date: "Oct 27", method: "—", amount: 500, status: "Link sent", payout: "—" },
  { who: "Leah Mensah", what: "October rent · Resident portal", date: "Oct 27", method: "Card ••41", amount: 2150, status: "Paid", payout: "Oct 29" },
  { who: "Zara Patel", what: "October rent · Payment link", date: "Oct 26", method: "ACH ••09", amount: 2240, status: "Processing", payout: "—" },
  { who: "Kofi Asante", what: "October rent · Resident portal", date: "Oct 25", method: "ACH ••77", amount: 2050, status: "Paid", payout: "Oct 28" },
  { who: "Grace Donnelly", what: "Move-in costs · Payment link", date: "Oct 20", method: "Card ••18", amount: 2310, status: "Partly refunded", payout: "Oct 22" },
  { who: "Noah Fischer", what: "September rent · Payment link", date: "Oct 18", method: "ACH ••63", amount: 1925, status: "Returned", payout: "—" },
  { who: "Ravi Menon", what: "Application fee · Taken by staff", date: "Oct 16", method: "Card ••90", amount: 45, status: "Paid", payout: "Oct 18" },
];

const PAYMENT_COLS = "minmax(0,1.5fr) 50px 70px 74px 104px 50px";

// Section stage: Online Payments behind, a Stripe payment link being sent for a returned rent payment in front.
export function RentStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <Window className="absolute top-0 left-0 h-[660px] w-[720px]">
        <ScreenHead title="Online Payments" description="Card and ACH payments through Stripe, refunds, returns and payouts." actions={<PrimaryButton icon={CreditCard}>Collect payment</PrimaryButton>} />
        <div className="flex flex-col gap-3.5 px-5 pt-4">
          <StatStrip
            stats={[
              { label: "Collected · 30 days", value: "$148,220", footer: "$2,914 in Stripe fees" },
              { label: "Processing", value: "$4,540", footer: "2 ACH payments settling" },
              { label: "Failed & returned · 30 days", value: "1", footer: "$1,925", className: "text-red-600 dark:text-red-400" },
            ]}
          />
          <ViewTabs tabs={["Payments", "Payouts", "Webhook log"]} />
        </div>
        <div className={cn("mx-5 mt-3 overflow-hidden rounded-xl border", LINE)}>
          <HeadRow cols={PAYMENT_COLS} labels={["Payment", "Date", "Method", "Amount", "Status", "Payout"]} right={[3]} />
          {PAYMENTS.map((payment) => (
            <Row key={payment.who} cols={PAYMENT_COLS}>
              <Cell2 top={payment.who} bottom={payment.what} />
              <span className="text-[12px] text-muted-foreground tabular-nums">{payment.date}</span>
              <span className="truncate text-[12px] text-muted-foreground">{payment.method}</span>
              <span className="text-right font-semibold tabular-nums">{usd(payment.amount, true)}</span>
              <span>
                <StatusPill area="payment" status={payment.status} />
              </span>
              <span className="text-[12px] text-muted-foreground tabular-nums">{payment.payout}</span>
            </Row>
          ))}
        </div>
      </Window>
      <div className={cn("absolute top-[90px] left-[600px] z-[2] w-[390px] rounded-xl border border-foreground/[0.12] bg-surface-card p-4 text-[12px] shadow-2xl shadow-black/30 dark:bg-surface-dialog", styles.float)}>
        <div className="text-[15px] font-semibold tracking-[-0.01em]">Collect payment</div>
        <div className="mt-0.5 text-muted-foreground">Harbour View · HV-03 — Noah Fischer · balance $1,925.00</div>
        <div className="mt-3 grid grid-cols-2 gap-1 rounded-lg bg-foreground/[0.05] p-1 text-center">
          <span className="flex items-center justify-center gap-1.5 rounded-md bg-surface-card py-1.5 font-medium shadow-sm dark:bg-foreground/[0.1]">
            <Send className="size-3.5" /> Send payment link
          </span>
          <span className="flex items-center justify-center gap-1.5 rounded-md py-1.5 text-muted-foreground">
            <CreditCard className="size-3.5" /> Take payment now
          </span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <Field label="Amount">$1,925.00</Field>
          <Field label="Method">
            <Landmark className="size-3.5 text-muted-foreground" /> Bank account (ACH)
          </Field>
          <Field label="Payer email">noah.f@example.com</Field>
          <Field label="Description">September rent</Field>
        </div>
        <div className={cn("mt-3.5 rounded-lg border border-emerald-500/25 bg-emerald-500/[0.06] p-3", styles.popIn)} style={{ "--pop-delay": "0.9s" }}>
          <div className="flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-400">
            <Check className="size-3.5" strokeWidth={2.5} /> Payment link ready
          </div>
          <div className="mt-1 text-muted-foreground">Share it with the payer — it opens a secure Stripe checkout.</div>
          <div className="mt-2 flex items-center gap-2 rounded-md border border-foreground/[0.1] bg-background/50 px-2.5 py-1.5">
            <Link2 className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate font-mono text-[11px] text-foreground/85">checkout.stripe.com/c/pay/cs_live_b1Q9…</span>
            <Copy className="ml-auto size-3.5 shrink-0 text-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
}

const CLEARED = [
  { memo: "Payment · Leah Mensah — FL-3B", date: "Sep 29", amount: "$2,150.00", done: true },
  { memo: "Payment · Kofi Asante — FL-2A", date: "Sep 28", amount: "$2,050.00", done: true },
  { memo: "Bill payment · Northwind HVAC", date: "Sep 26", amount: "−$1,560.00", done: true },
  { memo: "Owner distribution · Harbour View", date: "Sep 25", amount: "−$52,400.00", done: true },
];

// Cell: a statement matched against the ledger, difference zero and ready to finalize.
export function ReconcileRender() {
  return (
    <div className="mx-auto w-[460px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card text-[12px] dark:bg-surface-subtle">
      <div className={cn("flex items-center gap-2 border-b px-4 py-2.5", LINE)}>
        <Scale className="size-4 text-muted-foreground" />
        <span className="text-[13px] font-medium">Trust · ••4417</span>
        <span className="text-muted-foreground">Statement Sep 30, 2026</span>
        <Pill tone="neutral" className="ml-auto">
          Draft
        </Pill>
      </div>
      <div className={cn("grid grid-cols-3 divide-x divide-foreground/[0.07] border-b", LINE)}>
        {[
          ["Statement balance", "$412,906.40", ""],
          ["Cleared balance", "$412,906.40", ""],
          ["Difference", "$0.00", "text-emerald-600 dark:text-emerald-400"],
        ].map(([label, value, tone]) => (
          <div key={label} className="px-3.5 py-2.5">
            <div className="truncate text-[11px] text-muted-foreground">{label}</div>
            <div className={cn("mt-0.5 text-[14px] font-semibold tabular-nums", tone)}>{value}</div>
          </div>
        ))}
      </div>
      {CLEARED.map((line, index) => (
        <div key={line.memo} className={cn("flex items-center gap-3 border-b px-4 py-2", LINE, styles.popIn)} style={{ "--pop-delay": `${0.3 + index * 0.15}s` }}>
          <Tick done={line.done} />
          <span className="min-w-0 flex-1 truncate text-foreground/85">{line.memo}</span>
          <span className="text-muted-foreground tabular-nums">{line.date}</span>
          <span className="w-[82px] text-right tabular-nums">{line.amount}</span>
        </div>
      ))}
      <div className="flex items-center gap-2 px-4 py-2.5">
        <span className="text-emerald-700 dark:text-emerald-400">Ready to finalize</span>
        <PrimaryButton className="ml-auto h-7">Finalize</PrimaryButton>
      </div>
    </div>
  );
}

const EVENTS = [
  { at: "Oct 27, 09:14", type: "checkout.session.completed", status: "Processed" },
  { at: "Oct 27, 09:14", type: "payment_intent.succeeded", status: "Processed" },
  { at: "Oct 26, 16:02", type: "charge.refunded", status: "Processed" },
  { at: "Oct 25, 07:30", type: "payout.paid", status: "Processed" },
  { at: "Oct 21, 11:51", type: "charge.failed", status: "Processed" },
];

// Cell: the webhook log, every verified Stripe event and what came of it.
export function WebhookRender() {
  return (
    <div className="mx-auto w-[460px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card text-[12px] dark:bg-surface-subtle">
      <div className={cn("flex items-center gap-2 border-b px-4 py-2.5", LINE)}>
        <Webhook className="size-4 text-muted-foreground" />
        <span className="text-[13px] font-medium">Webhook log</span>
        <span className="ml-auto inline-flex items-center gap-1.5 text-muted-foreground">
          <span className={cn("size-1.5 rounded-full bg-emerald-500 text-emerald-500", styles.pulse)} /> Verified events
        </span>
      </div>
      {EVENTS.map((event, index) => (
        <div key={`${event.type}-${index}`} className={cn("flex items-center gap-3 border-b px-4 py-2 last:border-b-0", LINE, index === 0 && styles.popIn)} style={index === 0 ? { "--pop-delay": "0.6s" } : undefined}>
          <span className="w-[84px] shrink-0 text-[11px] text-muted-foreground tabular-nums">{event.at}</span>
          <code className="min-w-0 flex-1 truncate font-mono text-[11px] text-foreground">{event.type}</code>
          <StatusPill area="event" status={event.status} />
        </div>
      ))}
    </div>
  );
}

const RENT_ROLL = [
  { unit: "EC-101", building: "Elmwood Court", status: "Notice", tenant: "Theo Lindqvist", end: "Feb 28, 2027", rent: 1650, charged: 1650, collected: 1650 },
  { unit: "EC-118", building: "Elmwood Court", status: "Occupied", tenant: "Ravi Menon", end: "Apr 30, 2027", rent: 1690, charged: 2000, collected: 1690 },
  { unit: "EC-204", building: "Elmwood Court", status: "Vacant", tenant: "—", end: "—", rent: 0, charged: 0, collected: 0 },
  { unit: "EC-212", building: "Elmwood Court", status: "Occupied", tenant: "Elena Rossi", end: "Jun 30, 2027", rent: 1725, charged: 1725, collected: 1725 },
  { unit: "FL-2A", building: "The Foundry Lofts", status: "Occupied", tenant: "Kofi Asante", end: "Mar 31, 2027", rent: 2050, charged: 2050, collected: 2050 },
  { unit: "FL-3B", building: "The Foundry Lofts", status: "Occupied", tenant: "Leah Mensah", end: "Aug 31, 2027", rent: 2150, charged: 2150, collected: 2150 },
  { unit: "FL-5C", building: "The Foundry Lofts", status: "Make-ready", tenant: "—", end: "—", rent: 0, charged: 0, collected: 0 },
  { unit: "HV-03", building: "Harbour View", status: "Occupied", tenant: "Noah Fischer", end: "May 31, 2027", rent: 1925, charged: 1925, collected: 0 },
  { unit: "HV-12", building: "Harbour View", status: "Occupied", tenant: "Zara Patel", end: "Dec 20, 2026", rent: 2240, charged: 2240, collected: 2240 },
];

const ROLL_COLS = "minmax(0,1fr) 86px minmax(0,1fr) 84px 70px 70px 70px 66px";

const REPORTS = [
  { name: "Rent Roll", icon: FileSpreadsheet },
  { name: "Delinquency", icon: BarChart3 },
  { name: "Occupancy & Vacancy", icon: BarChart3 },
  { name: "Owner Statements", icon: FileText },
  { name: "Financial Statements", icon: FileText },
  { name: "Trial Balance", icon: Scale },
  { name: "General Ledger Detail", icon: FileText },
  { name: "A/P Aging", icon: Receipt },
  { name: "Deposit Detail", icon: Landmark },
  { name: "1099 Summary", icon: FileSpreadsheet },
];

// Section stage: the Rent Roll report, the list of reports floating beside it.
export function ReportsStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <Window className="absolute top-0 left-0 h-[660px] w-[790px]">
        <ScreenHead
          title="Rent Roll"
          description="Every unit with its lease as of the end date, rent, period charges and collections, and ledger balance."
          actions={
            <>
              <GhostButton icon={Printer}>Print / PDF</GhostButton>
              <PrimaryButton icon={Download}>Export CSV</PrimaryButton>
            </>
          }
        />
        <div className="flex items-center gap-2 px-5 py-3">
          <FilterChip>All properties</FilterChip>
          <FilterChip>All statuses</FilterChip>
          <span className="inline-flex h-8 items-center rounded-md border border-foreground/[0.1] px-2.5 text-[12px] text-foreground/80 tabular-nums">Oct 1 – Oct 31, 2026</span>
        </div>
        <HeadRow cols={ROLL_COLS} labels={["Unit", "Status", "Tenant", "Lease end", "Lease rent", "Charged", "Collected", "Balance"]} right={[4, 5, 6, 7]} className={cn("border-t", LINE)} />
        {RENT_ROLL.map((row) => {
          const balance = row.charged - row.collected;
          return (
            <Row key={row.unit} cols={ROLL_COLS} className="py-2">
              <Cell2 top={row.unit} bottom={row.building} />
              <span>
                <StatusPill area="unit" status={row.status} />
              </span>
              <span className="truncate text-[12px] text-foreground/85">{row.tenant}</span>
              <span className="text-[12px] text-muted-foreground tabular-nums">{row.end}</span>
              <span className="text-right text-[12px] tabular-nums">{row.rent ? usd(row.rent) : "—"}</span>
              <span className="text-right text-[12px] tabular-nums">{row.charged ? usd(row.charged) : "—"}</span>
              <span className="text-right text-[12px] tabular-nums">{row.collected ? usd(row.collected) : "—"}</span>
              <span className={cn("text-right text-[12px] font-semibold tabular-nums", balance > 0 && "text-red-600 dark:text-red-400")}>{usd(balance)}</span>
            </Row>
          );
        })}
      </Window>
      <div className={cn("absolute top-[300px] left-[736px] z-[2] w-[250px] rounded-xl border border-foreground/[0.12] bg-surface-card p-1.5 text-[12px] shadow-2xl shadow-black/30 dark:bg-surface-dialog", styles.float)}>
        <div className="px-2.5 pt-1.5 pb-1">
          <MonoLabel>Reports</MonoLabel>
        </div>
        {REPORTS.map(({ name, icon: Icon }) => (
          <div key={name} className={cn("flex items-center gap-2 rounded-md px-2.5 py-1.5", name === "Rent Roll" ? "bg-foreground/[0.07] font-medium text-foreground" : "text-foreground/75")}>
            <Icon className="size-3.5 text-muted-foreground" strokeWidth={1.75} />
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}

const AGING = [
  { tenant: "Noah Fischer", unit: "HV-03", b0: 0, b31: 1925, b61: 0, b91: 0, oldest: "56 days", last: "Aug 30" },
  { tenant: "Ravi Menon", unit: "EC-118", b0: 310, b31: 0, b61: 0, b91: 0, oldest: "26 days", last: "Oct 3" },
  { tenant: "Mia Johansson", unit: "EC-009", b0: 0, b31: 0, b61: 0, b91: 1140, oldest: "128 days", last: "Jun 2" },
];

const AGING_COLS = "minmax(0,1fr) 46px 50px 46px 50px 54px";

// Cell: the delinquency report, open charges aged from their charge date.
export function DelinquencyRender() {
  const money = (value) => (value ? usd(value) : "—");
  return (
    <div className="mx-auto w-[460px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card text-[12px] dark:bg-surface-subtle">
      <div className={cn("flex items-center gap-2 border-b px-4 py-2.5", LINE)}>
        <span className="text-[13px] font-medium">Delinquency</span>
        <span className="text-muted-foreground">Aging · as of Oct 27</span>
        <span className="ml-auto font-semibold text-red-600 tabular-nums dark:text-red-400">$3,375</span>
      </div>
      <HeadRow cols={AGING_COLS} labels={["Tenant", "0–30", "31–60", "61–90", "90+", "Balance"]} right={[1, 2, 3, 4, 5]} className="gap-2.5 px-4" />
      {AGING.map((row, index) => (
        <Row key={row.tenant} cols={AGING_COLS} className={cn("gap-2.5 px-4 py-2", styles.popIn)} style={{ "--pop-delay": `${0.2 + index * 0.12}s` }}>
          <Cell2 top={row.tenant} bottom={`${row.unit} · ${row.oldest}`} />
          <span className="text-right tabular-nums">{money(row.b0)}</span>
          <span className={cn("text-right tabular-nums", row.b31 && "text-amber-700 dark:text-amber-300")}>{money(row.b31)}</span>
          <span className="text-right tabular-nums">{money(row.b61)}</span>
          <span className={cn("text-right tabular-nums", row.b91 && "text-red-600 dark:text-red-400")}>{money(row.b91)}</span>
          <span className="text-right font-semibold tabular-nums">{usd(row.b0 + row.b31 + row.b61 + row.b91)}</span>
        </Row>
      ))}
      <div className="px-4 py-2.5 text-[11px] text-muted-foreground">Payments retire the charges they were applied to; unapplied credits are shown separately.</div>
    </div>
  );
}

const STATEMENT = [
  { label: "Beginning balance", amount: 24180 },
  { label: "Income", amount: 78420 },
  { label: "Operating expenses", amount: -9815 },
  { label: "Management fees", amount: -6273.6 },
  { label: "Net operating income", amount: 62331.4, strong: true },
  { label: "Owner distributions", amount: -58000 },
];

// Cell: an owner statement's summary for Harbour View Partners LLC.
export function OwnerStatementRender() {
  return (
    <div className="mx-auto w-[440px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card text-[12px] dark:bg-surface-subtle">
      <div className={cn("flex items-center gap-2.5 border-b px-4 py-3", LINE)}>
        <Avatar name="Harbour View Partners LLC" size={26} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13px] font-medium">Statement summary</div>
          <div className="truncate text-[11px] text-muted-foreground">Harbour View Partners LLC · Oct 1 – Oct 31, 2026</div>
        </div>
      </div>
      {STATEMENT.map((line) => (
        <div key={line.label} className={cn("flex items-center justify-between border-b px-4 py-2", LINE, line.strong && "bg-foreground/[0.03]")}>
          <span className={line.strong ? "font-medium text-foreground" : "text-muted-foreground"}>{line.label}</span>
          <span className={cn("tabular-nums", line.strong && "font-semibold")}>{usd(line.amount, true)}</span>
        </div>
      ))}
      <div className="flex items-center justify-between px-4 py-2.5">
        <span className="font-medium">Ending balance</span>
        <span className={cn("text-[14px] font-semibold tabular-nums", styles.popIn)} style={{ "--pop-delay": "0.7s" }}>
          {usd(28511.4, true)}
        </span>
      </div>
    </div>
  );
}

