-- Help forms payments page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the forms/payments draft outline (from
-- 20261024191600_help_forms_structure) with the full Payments guide and publishes it.
-- Written from a survey of C:\Pro\geiger-forms (components/internal/screens/forms/forms/sections/payments.jsx,
-- form_detail.jsx (validate), constants.js (CURRENCIES), components/forms/fields/commerce-fields.jsx, lib/forms/logic.js
-- (computeOrder), lib/server/submit.js, lib/server/stripe.js, app/api/stripe/webhook/route.js,
-- components/forms/form-filler-content.jsx, lib/forms/i18n.js, components/forms/response/response-sections.jsx
-- (PaymentSection), components/forms/response/print-document.jsx, settings/service_status.jsx).
-- Left out on purpose: the Stripe connection card's environment variables and webhook endpoint, which only whoever
-- runs the deployment can act on.
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Payments',
    description = 'Take one-off or recurring payments with Stripe Checkout: sell products, offer coupon codes and track payment on each response.',
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'forms/payments' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'forms/payments' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'turning-on-payments',
      'Basics',
      'Turning on payments',
      $html$<p>Forms takes payments through Stripe Checkout. To charge for a form:</p><ol><li>In the builder, add a <strong>Product</strong> field for each thing respondents can buy, and an <strong>Order total</strong> field to show the total. The <a href="/help/forms/fields#payment-fields">Field types</a> guide covers both.</li><li>Open the form's settings and go to <strong>Payments → Gateways</strong>.</li><li>Turn on <strong>Enable payments</strong>.</li><li>Pick the <strong>Currency</strong>: USD (the default), EUR, GBP, INR, CAD, AUD, JPY, CHF, SGD or BRL.</li><li>Under <strong>Charge</strong>, choose <strong>One-off</strong> (the default) or <strong>Subscription</strong>. A subscription also takes a <strong>Billing interval</strong>: <strong>Monthly</strong> (the default) or <strong>Yearly</strong>.</li><li>Choose <strong>Save changes</strong>.</li></ol><p>Payments run through the Stripe account your deployment of Forms is connected to. If Stripe isn't set up, Gateways shows a warning that starts "Not configured on this deployment.", and respondents aren't sent to checkout.</p>$html$,
      '[]',
      10
    ),
    (
      'how-checkout-works',
      'Concepts',
      'How checkout works',
      $html$<p>When a respondent submits a form with payments on and an order total above zero, Forms saves their response with the status Awaiting payment, then sends them to Stripe Checkout. Each product they picked is a line on the checkout page, with any coupon taken off, and their email is filled in when the form collected one.</p><ul><li>After paying, they return to the form and see <strong>Payment received</strong>.</li><li>If they cancel, they see <strong>Payment not completed</strong>, their response stays Awaiting payment and <strong>Start over</strong> lets them fill in the form again.</li></ul><p>Once Stripe confirms the payment, the response's payment is marked Paid and its status becomes Complete. When the form has approval steps, it becomes Pending instead, and the first approvers are asked then. A subscription charges the same amount every month or year.</p><p>A response with nothing to pay, such as one where no product was picked, is saved without checkout.</p>$html$,
      '[]',
      20
    ),
    (
      'order-builder',
      'Payments',
      'Order builder',
      $html$<p><strong>Payments → Order Builder</strong> in a form's settings lists the form's Product fields, each with its price and whether respondents pick a quantity or add a single item. Change the quantities, and type a coupon code under <strong>Try a coupon code</strong>, to see a <strong>Sample order</strong> worked out the same way as at checkout, with the discount and total.</p><p>Prices, quantity limits and new products are set in the builder. Until the form has a Product field, Order Builder only links to the builder. While payments are off, it reminds you to turn them on under Gateways.</p>$html$,
      '[]',
      30
    ),
    (
      'coupons',
      'Payments',
      'Coupons',
      $html$<p>Coupons take money off an order. To add one, open the form's settings, go to <strong>Payments → Coupons</strong> and choose <strong>Add coupon</strong>.</p><ul><li><strong>Code</strong>: what respondents type, like <code>SPRING20</code>. Codes are saved in capitals without spaces, and respondents can type them in any case.</li><li><strong>Type</strong>: <strong>% off</strong> or a fixed amount off in the form's currency, such as <strong>USD off</strong>.</li><li><strong>Value</strong>: the percentage (up to 100) or the amount.</li><li>The switch sets the coupon <strong>Active</strong> or <strong>Paused</strong>. Paused codes don't work.</li></ul><p>Every coupon needs a code, and codes must be unique: Forms won't save until they are. Choose <strong>Save changes</strong> to keep your coupons, and the trash icon on a coupon to remove it.</p><p>Respondents enter a code in the form's <strong>Order total</strong> field and choose <strong>Apply</strong>, so the form needs one. An amount off never takes the total below zero. On a subscription, the discount applies to the first payment only. Coupons only work while payments are on.</p>$html$,
      '[]',
      40
    ),
    (
      'payment-status',
      'Payments',
      'Payment status on responses',
      $html$<p>A response's <strong>Payment</strong> tab, in its details in the Response Inbox, shows the payment's status, its amount and currency, and Stripe's reference for it. Under <strong>Order</strong>, it lists what was bought, any coupon and the total. A response without a payment shows "No payment was collected with this response."</p><p>The payment status starts as Pending while the respondent is at checkout, then becomes Paid, or Failed if the payment fails. Until a payment is confirmed, the response's own status stays Awaiting payment. Filter the Response Inbox by that status to follow up, or use the <strong>Awaiting payment</strong> count on the project overview. See <a href="/help/forms/responses">Responses</a>.</p>$html$,
      '[]',
      50
    ),
    (
      'receipts-and-invoices',
      'Payments',
      'Receipts and invoices',
      $html$<p>When you print a response that has a payment, the printed record includes a <strong>Receipt</strong> once it's paid, or an <strong>Invoice</strong> before then. It lists each item with its quantity and amount, the total, and the payment's status, reference and date. To keep a PDF, choose to save as PDF in your browser's print dialog.</p><p>Printing a response is covered in <a href="/help/forms/workflow#printing-responses">Approvals and automations</a>.</p>$html$,
      '[]',
      60
    ),
    (
      'paid-responses-awaiting-payment',
      'Troubleshooting',
      'Paid responses still say Awaiting payment',
      $html$<p>Forms marks a response Paid when Stripe tells it the payment went through. If respondents have paid but their responses stay Awaiting payment, those messages from Stripe aren't reaching Forms.</p><ol><li>Open <strong>Templates & Admin → Workspace Settings</strong> and find the <strong>Configuration</strong> card.</li><li>If <strong>Stripe webhooks</strong> shows Not configured, ask whoever runs your deployment of Forms to set them up.</li></ol><p>Payments made before then aren't marked Paid on their own, so check them in Stripe.</p>$html$,
      '[]',
      70
    ),
    (
      'related-guides',
      null::text,
      'Related guides',
      '',
      '[{"icon":"ListChecks","label":"Field types","href":"/help/forms/fields"},{"icon":"Settings2","label":"Form settings","href":"/help/forms/form-settings"},{"icon":"Inbox","label":"Responses","href":"/help/forms/responses"},{"icon":"ClipboardCheck","label":"Approvals & automations","href":"/help/forms/workflow"},{"icon":"Settings","label":"Workspace settings","href":"/help/forms/settings"},{"icon":"LayoutTemplate","label":"Templates","href":"/help/forms/templates"}]',
      80
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'forms/payments' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Payments',
    description = 'Take one-off or recurring payments with Stripe, build an order from products and quantities, and offer coupon codes.',
    status = 'draft',
    published_at = null
where slug = 'forms/payments' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'forms/payments' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Turning on payments</li><li>Order builder</li><li>Coupons</li><li>Payment status on responses</li><li>Receipts and invoices</li></ul>',
  10
from public.docs_pages p
where p.slug = 'forms/payments' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
