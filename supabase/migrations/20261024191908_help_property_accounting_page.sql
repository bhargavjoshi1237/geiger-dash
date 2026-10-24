-- Help property accounting page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the property/accounting draft outline from
-- 20261024191900_help_property_structure with the full Accounting guide (Accounting → Transactions, Bills & Payables,
-- Chart of Accounts, Budgets, Bank Accounts, General Ledger, Bank Reconciliation, CAM Reconciliation, Job Costing)
-- and publishes it. Rent Collection, Online Payments, Recurring Charges and Utility Billing are on property/payments.
-- Written from a survey of C:\Pro\geiger-property (components/internal/screens/accounting/{transactions,bills,
-- chart_of_accounts,budgets,bank_accounts,general_ledger,bank_reconciliation,cam_reconciliation,job_costing,
-- ledger_dialogs,ledger_section,shared}.*, lib/ledger/postings.js, lib/rbac.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Accounting',
    description = 'Keep the books: the chart of accounts, transactions, bills and payables, the general ledger, bank reconciliation, budgets, CAM and job costs.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'property/accounting' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'property/accounting' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'how-the-books-work',
      'Concepts',
      'How the books work',
      $html$<p>Property keeps a double-entry <strong>general ledger</strong> for the project. Every rent charge, payment, credit, bill, bill payment, transaction and journal entry posts a balanced entry: debits equal credits, each line against an account in your chart of accounts.</p><p>Posted entries are never edited or deleted. To fix a mistake, <strong>void</strong> the entry: Property posts an equal and opposite reversal and keeps both, so the books stay auditable. Fields that changed the ledger, such as a posted transaction's amount or account, are locked until you void it.</p><p>Two permissions control the books. <strong>Post charges, payments, bills &amp; journal entries</strong> lets a role post; without it, posting buttons are disabled with "Your role can't post to the ledger." <strong>Void ledger entries</strong> lets a role void.</p>$html$,
      '[]',
      10
    ),
    (
      'chart-of-accounts',
      'Chart of accounts',
      'Chart of accounts',
      $html$<p><strong>Accounting → Chart of Accounts</strong> lists the accounts entries post to. To start from the standard chart, choose <strong>Add Default Accounts</strong>; Property also adds them when you first post with an empty chart. Accounts Property relies on are marked <strong>System</strong>, and their type and subtype can't be changed.</p><p>To add one, choose <strong>New Account</strong>: only <strong>Account name</strong> is required, with an <strong>Account number</strong> and a <strong>Type</strong> (Asset, Liability, Equity, Income or Expense). In its editor, set the subtype (cash or bank, receivable, payable, deposits held and others), a parent account, and whether it's a <strong>Trust account</strong> that holds owner or resident funds. Each account's <strong>Ledger</strong> section shows every line posted to it with a running balance.</p><p>The view menu filters by type or shows trust accounts. The figures show the number of accounts, total assets and liabilities, trust cash, and net income for all periods.</p>$html$,
      '[]',
      20
    ),
    (
      'transactions',
      'Transactions',
      'Transactions',
      $html$<p><strong>Accounting → Transactions</strong> records income, expenses and transfers between bank accounts. Choose <strong>New Transaction</strong>: only <strong>Description</strong> is required. Pick the <strong>Type</strong> (Income, Expense or Transfer), the amount, date, GL account, bank account (default operating cash when empty) and property. Creating it posts a balanced entry to the ledger straight away; if posting fails, it's saved and marked not posted.</p><p>A transaction is Pending, Cleared, Reconciled, Void or Draft. Its <strong>Actions</strong> menu has <strong>Post to ledger</strong> for one that isn't posted yet, and <strong>Void transaction</strong>, which reverses its entry. Deleting a posted transaction also reverses its entry. Creating one needs the posting permission, and deleting one needs both <strong>Delete records</strong> and <strong>Void ledger entries</strong>.</p><p>The view menu offers <strong>All transactions</strong>, <strong>Income</strong>, <strong>Expenses</strong> and <strong>Transfers</strong>. The figures show income, expenses, net and transactions not yet in the ledger.</p>$html$,
      '[]',
      30
    ),
    (
      'bills-and-payables',
      'Bills & payables',
      'Bills and payables',
      $html$<p><strong>Accounting → Bills &amp; Payables</strong> tracks what you owe vendors. Choose <strong>New Bill</strong>: only <strong>Bill</strong> (its description) is required. Add the vendor, amount, due date, expense account and property, and in the editor an invoice number, unit, job or work order. New bills are Open. Creating a bill needs the posting permission.</p><p>To require sign-off on large bills, choose <strong>Approval Rules</strong> and set an <strong>Approval limit</strong> (blank or 0 turns approvals off). A new bill over the limit waits as Pending approval; any other bill posts to Accounts Payable right away. A bill's <strong>Actions</strong> menu has:</p><ul><li><strong>Approve bill</strong>: posts it to Accounts Payable. <strong>Reject bill</strong> marks it rejected.</li><li><strong>Require approval</strong>: sends an unposted bill for approval.</li><li><strong>Post to Accounts Payable</strong>: posts an approved bill that isn't posted yet.</li><li><strong>Void bill</strong>: reverses it out of Accounts Payable. Void its payments first.</li></ul><p>To pay a bill, open its <strong>Payments</strong> section, enter the date, amount, method (ACH, Check, Card, Wire or Cash) and the bank account to pay from, then choose <strong>Record Payment</strong>. Each payment posts to the ledger and also appears in Transactions. A bill is Open, Partially paid, Paid, Void or Draft.</p><p>The figures age your open payables (the total, then 1 to 30 days late, then 61 days or more) and show what was paid this month and how many bills await approval.</p>$html$,
      '[]',
      40
    ),
    (
      'bank-accounts',
      'Bank accounts',
      'Bank accounts',
      $html$<p><strong>Accounting → Bank Accounts</strong> lists your operating, trust, security deposit and reserve accounts. Choose <strong>New Bank Account</strong>: only <strong>Account name</strong> is required. Add the bank, the type (Operating to start), the last four digits of the account number (only those are stored) and the current balance.</p><p>Balances are entered by hand: bank feeds aren't connected. Keep the balance, the date it's as of, the last reconciled date and the last statement balance in the account's <strong>Balance</strong> section. Its <strong>Ledger</strong> section shows the deposits and withdrawals posted against the account and its book balance, and you can link it to its own cash account in the chart of accounts.</p>$html$,
      '[]',
      50
    ),
    (
      'general-ledger',
      'General ledger',
      'The general ledger',
      $html$<p><strong>Accounting → General Ledger</strong> shows every entry behind your books. Switch between <strong>Journal</strong>, the entries themselves, and <strong>Trial balance</strong>, each account's totals. Filter the journal by entry type and date range. The figures show how many entries are listed (the latest 500 at most), the total posted, how many are voided and reversed, and a trial check that reads Balanced when total debits equal total credits.</p><p>To post an adjustment by hand, choose <strong>New Journal Entry</strong>. Add a date and memo, then as many lines as you need, each against one account. Debits must equal credits before it posts. <strong>Void Entry</strong> on an entry reverses it. <strong>Seed Default Chart</strong> adds the standard accounts if they're missing.</p>$html$,
      '[]',
      60
    ),
    (
      'bank-reconciliation',
      'Bank reconciliation',
      'Reconciling a bank account',
      $html$<p>To reconcile a bank statement, choose <strong>Accounting → Bank Reconciliation</strong> and:</p><ol><li>Pick the <strong>Bank account</strong>, then enter the <strong>Statement date</strong> and <strong>Statement ending balance</strong>.</li><li>Tick each item on the statement in <strong>Deposits &amp; credits</strong> and <strong>Checks &amp; withdrawals</strong>. Only uncleared items up to the statement date are listed.</li><li>Watch the <strong>Difference</strong>: the opening balance plus cleared deposits, less cleared withdrawals, compared with the statement. Choose <strong>Save Draft</strong> to come back later.</li><li>When the difference is zero, choose <strong>Finalize</strong>. The ticked items are marked cleared.</li></ol><p>Finalizing needs the posting permission. The <strong>History</strong> list shows past reconciliations for the account; only the latest finalized one can be undone, which needs <strong>Void ledger entries</strong>. The screen also shows <strong>Ledger health</strong>, integrity checks across every posted entry.</p>$html$,
      '[]',
      70
    ),
    (
      'budgets',
      'Budgets',
      'Budgets',
      $html$<p><strong>Accounting → Budgets</strong> holds operating budgets by property and year. Choose <strong>New Budget</strong>: only <strong>Budget name</strong> is required. Pick the <strong>Property</strong> and the <strong>Year</strong> (this year to start).</p><p>In the budget's <strong>Monthly Budget</strong> section, choose <strong>Add Account</strong> for each income or expense account, then enter an amount for each month, or an annual amount Property spreads across 12 months (any remainder lands in December). <strong>Actuals &amp; Variance</strong> compares the budget with what's posted to the ledger for that property and year, for the year to date, a single month or the full year, and shows net operating income.</p><p>The figures show how many budgets there are, with budgeted income, expense and net for this year.</p>$html$,
      '[]',
      80
    ),
    (
      'cam-reconciliation',
      'CAM reconciliation',
      'CAM reconciliation',
      $html$<p><strong>Accounting → CAM Reconciliation</strong> settles a commercial property's year of common-area maintenance costs against the estimates its tenants paid. Choose <strong>New CAM Reconciliation</strong>: only the name is required. Pick the <strong>Property</strong>, the <strong>Year</strong> (last year to start) and the <strong>Budgeted CAM</strong>.</p><ol><li>In <strong>CAM Pools</strong>, pick the expense accounts that count as common-area costs. Property totals the year's actual CAM from the ledger.</li><li>In <strong>Tenant True-ups</strong>, each commercial lease gets a share by square footage (every in-force lease when none are marked commercial). Override a share or leave a lease out. Property shows what each lease owes, the estimates already billed and the difference.</li><li>Choose <strong>Save</strong>, then <strong>Post True-Ups</strong> to post each lease's difference to its ledger. <strong>Void True-Ups</strong> reverses them.</li></ol><p>A reconciliation is Draft, Reconciled or Billed. Posting needs the posting permission and voiding needs <strong>Void ledger entries</strong>.</p>$html$,
      '[]',
      90
    ),
    (
      'job-costing',
      'Job costing',
      'Job costing',
      $html$<p><strong>Accounting → Job Costing</strong> tracks what a unit turn, capital project or repair project costs against its budget. Choose <strong>New Job</strong>: only <strong>Job name</strong> is required. Pick the <strong>Kind</strong> (Unit turn, Capital project, Repair project or Other), the property and the budget. A job is Open, In progress or Closed.</p><p>A job's cost is every ledger line tagged to it. Tag a bill to a job from the bill's <strong>Job</strong> field, or post bills from the job's <strong>Cost Ledger</strong> section. <strong>Budget vs Actual</strong> breaks the cost to date down by account against the budget, and <strong>Bills</strong> lists the vendor bills tagged to it.</p><p>The figures show active jobs, their budget, cost to date as a share of budget and jobs over budget.</p>$html$,
      '[]',
      100
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"CircleDollarSign","label":"Rent & payments","href":"/help/property/payments"},{"icon":"ChartColumn","label":"Reports","href":"/help/property/reports"},{"icon":"Users","label":"Tenants, owners & vendors","href":"/help/property/people"}]',
      200
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'property/accounting' and deleted_at is null) p;

-- @down
-- Restores the draft exactly as 20261024191900_help_property_structure left it.
update public.docs_pages
set title = 'Accounting',
    description = 'Keep the books: transactions, bills, the general ledger, budgets and bank reconciliation.',
    status = 'draft',
    published_at = null
where slug = 'property/accounting' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'property/accounting' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Transactions</li><li>Bills and payables</li><li>Chart of accounts</li><li>Budgets</li><li>Bank accounts</li><li>General ledger</li><li>Bank reconciliation</li><li>CAM reconciliation</li><li>Job costing</li></ul>',
  10
from public.docs_pages p
where p.slug = 'property/accounting' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
