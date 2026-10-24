-- Help property reports page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the property/reports draft outline from
-- 20261024191900_help_property_structure with the full Reports guide (the sidebar's Reports group, including
-- Scheduled Reports) and publishes it.
-- Written from a survey of C:\Pro\geiger-property (components/internal/screens/reports/{report_kit,report_view,
-- report_print,schedule_dialog,scheduled_reports}.jsx, lib/reports/{catalog,defs_financial,defs_operations,periods,
-- schedule}.js, lib/jobs/scheduled_reports.js, lib/rbac.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Reports',
    description = 'Run financial, leasing, operations and compliance reports for any period and property, then print, export or email them on a schedule.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'property/reports' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'property/reports' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'running-a-report',
      'Basics',
      'Running a report',
      $html$<p>Each report has its own entry under <strong>Reports</strong> in the sidebar. Choose one and it runs straight away on your project's current data, using its default period and every property.</p><p>Change what it covers in the toolbar:</p><ul><li>The period: This month, Last month, This quarter, Last quarter, Year to date, Last year, Last 12 months or a custom range. Reports that show a position at a point in time (A/P Aging, Delinquency and Insurance Compliance) use an as-of date instead: Today, End of last month, End of last quarter, End of last year or a custom date.</li><li>The property: <strong>All properties</strong>, or one.</li><li>Report-specific filters, such as the owner, bank account, account or status.</li></ul><p>A report shows its key figures first, then its tables and charts. Tables show the first 100 rows; <strong>Show More</strong> loads more. Money reports read the general ledger, so they reflect every charge, payment, bill and journal entry posted in Accounting.</p>$html$,
      '[]',
      10
    ),
    (
      'exporting-and-printing',
      'Reports',
      'Exporting and printing',
      $html$<p>To take a report out of Property, use the buttons at the top of the report:</p><ul><li><strong>Export CSV</strong> downloads the report's tables as a CSV file.</li><li><strong>Print / PDF</strong> opens a print layout and your browser's print dialog, where you can save it as a PDF.</li></ul><p>Both buttons appear only if your role includes <strong>Export reports (CSV / PDF)</strong>.</p>$html$,
      '[]',
      20
    ),
    (
      'scheduling-a-report',
      'Scheduled reports',
      'Scheduling a report',
      $html$<p>To email a report on a schedule, open it, set the filters you want, and choose <strong>Schedule</strong>. In the dialog:</p><ol><li>Give the schedule a <strong>Name</strong>.</li><li>Pick a <strong>Frequency</strong>: Daily, Weekly (with a day of the week) or Monthly (with a day of the month from 1 to 28).</li><li>Enter the <strong>Recipients</strong>, separating email addresses with commas. At least one valid address is required.</li><li>Pick the period (or as-of date) each run covers.</li></ol><p>Each run emails a summary of the report with its current filters, and keeps the run's CSV and HTML under <strong>Reports → Scheduled Reports</strong>. Schedules are sent by the <strong>Scheduled reports</strong> job (see <a href="/help/property/automations#scheduled-jobs">Scheduled jobs</a>), and only once email delivery is set up. Each schedule sends once per period.</p><p>The <strong>Schedule</strong> button appears only if your role includes <strong>Schedule report emails</strong>.</p>$html$,
      '[]',
      30
    ),
    (
      'scheduled-reports',
      'Scheduled reports',
      'Managing scheduled reports',
      $html$<p><strong>Reports → Scheduled Reports</strong> lists every schedule with its report, frequency, recipients and last run. Each schedule's menu has <strong>Open report</strong>, <strong>Pause</strong> or <strong>Resume</strong>, and <strong>Delete</strong>.</p><p><strong>Recent runs</strong> lists what was sent, one run per schedule per period, with each run's status: Sent, Partly sent, Email not configured or Failed. Download a run's CSV or HTML from its row. The figures show how many schedules and recipients there are, the runs in the last 30 days, and runs that need attention because they failed or email isn't configured.</p>$html$,
      '[]',
      40
    ),
    (
      'financial-reports',
      'Reports',
      'Financial reports',
      $html$<ul><li><strong>Financial Statements</strong>: switch between <strong>Profit &amp; Loss</strong> (income, expenses and net income), <strong>Balance Sheet</strong> (assets, liabilities and equity) and <strong>Cash Flow</strong> (cash in and out by month, and by operating and financing activity).</li><li><strong>Trial Balance</strong>: each account's opening balance, the period's debits and credits, and its closing balance.</li><li><strong>General Ledger Detail</strong>: every posted line by account, with opening balances and a running balance. Filter by account.</li><li><strong>Check &amp; Payment Register</strong>: every deposit and payment through your cash accounts, with a running balance. Filter by bank account.</li><li><strong>A/P Aging</strong>: unpaid vendor bills by days past due, by vendor and bill.</li><li><strong>Management Fees</strong>: fees booked per property and owner against the income they were earned on, by property, by month and posting by posting.</li><li><strong>Deposit Detail</strong>: security deposits held per lease against the ledger, trust cash positions per account, owner and property, and deposit activity. A negative trust position means one owner's funds are covering another's.</li></ul>$html$,
      '[]',
      50
    ),
    (
      'operations-reports',
      'Reports',
      'Leasing, owner and operations reports',
      $html$<ul><li><strong>Rent Roll</strong>: every unit with its lease as of the end date, its rent, the period's charges and collections, and its ledger balance. Filter by unit status.</li><li><strong>Delinquency</strong>: open charges per lease, aged from their charge date. Payments retire the charges they were applied to, and unapplied credits are shown separately.</li><li><strong>Occupancy &amp; Vacancy</strong>: occupancy per property as of the end date, vacant units with days vacant (from the last lease end on record), move activity and vacancy loss.</li><li><strong>Leasing Report</strong>: the prospect to lease funnel for the period, with each step's conversion from the step before, upcoming expirations and renewal outcomes. It covers the last 12 months to start.</li><li><strong>Owner Statements</strong>: for one owner and period (last month to start), the beginning balance, income, operating expenses, management fees, distributions and ending trust balance, by property and transaction, plus the rent roll and work orders as an owner packet.</li><li><strong>Maintenance Report</strong>: work orders created or completed in the period, with volume, turnaround and spend by status, priority, category and top vendors. It covers the last 12 months to start.</li></ul>$html$,
      '[]',
      60
    ),
    (
      'compliance-reports',
      'Reports',
      'Compliance and tax reports',
      $html$<ul><li><strong>Insurance Compliance</strong>: renters insurance for residents, and certificates of insurance and licenses for vendors, as of the date you pick. Filter by party (tenants, vendors or both) and by status.</li><li><strong>1099 Summary</strong>: cash paid to each vendor in the period (bill payments and cash expenses tagged with the vendor, net of voids) against the 1099 reporting threshold, with each vendor's W-9 status. It covers last year to start. The threshold follows the tax year, or pick <strong>$2,000 (2026+)</strong> or <strong>$600 (2025 and earlier)</strong>.</li></ul>$html$,
      '[]',
      70
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Calculator","label":"Accounting","href":"/help/property/accounting"},{"icon":"CircleDollarSign","label":"Rent & payments","href":"/help/property/payments"},{"icon":"Workflow","label":"Automations","href":"/help/property/automations"}]',
      200
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'property/reports' and deleted_at is null) p;

-- @down
-- Restores the draft exactly as 20261024191900_help_property_structure left it.
update public.docs_pages
set title = 'Reports',
    description = 'Run, export and schedule financial, leasing and operations reports.',
    status = 'draft',
    published_at = null
where slug = 'property/reports' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'property/reports' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Running a report</li><li>Exporting and printing</li><li>Scheduled reports</li><li>The reports</li></ul>',
  10
from public.docs_pages p
where p.slug = 'property/reports' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
