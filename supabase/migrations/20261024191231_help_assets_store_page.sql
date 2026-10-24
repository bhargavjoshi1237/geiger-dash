-- Help assets store page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the assets/galleries/store draft outline
-- (20261024191200_help_assets_structure) with the full Store & orders guide and publishes it. No section showcases
-- exist for Assets yet.
-- Written from a survey of C:\Pro\geiger-assets (components/internal/screens/projects/store/** (storefront,
-- products_pricing, product_dialog, price_sheet_dialog, discount_dialog, cart_checkout, orders_invoices,
-- order_detail, invoice_view, digital_downloads, grant_downloads_dialog, customers, customer_detail, store_kit,
-- constants), components/internal/screens/projects/galleries/gallery_selling.jsx, galleries/public/gallery_store.jsx,
-- galleries/public/order_receipt.jsx, lib/commerce/* (server, stripe, pricing, fulfillment, shape, receipt_pdf),
-- lib/supabase/store.js, app/g/[slug]/checkout|order|download routes, app/api/store/**).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Store & orders',
    description = 'Sell downloads, licenses, prints and whole galleries from your gallery pages: set prices, take payment, deliver files and handle orders.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'assets/galleries/store' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'assets/galleries/store' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'selling-from-a-gallery',
      'Basics',
      'Selling from a gallery',
      $html$<p>Any published gallery can work as a shop: visitors add items to a cart on the gallery page and pay there. To set one up, open a project in Assets and work through the screens under <strong>Galleries</strong> in the sidebar.</p><ol><li>On <strong>Storefront</strong>, set the store's <strong>Currency</strong>, name and policies.</li><li>On <strong>Products & Pricing</strong>, create the products you sell and a price sheet, or choose <strong>Starter catalogue</strong> for a set you can edit.</li><li>On <strong>Cart & Checkout</strong>, choose the <strong>Payment method</strong>.</li><li>Open the gallery in <strong>Gallery Builder</strong>, go to its <strong>Selling</strong> section, turn on <strong>Sell from this gallery</strong> and set its prices.</li><li>Publish the gallery; see <a href="/help/assets/galleries#publishing-a-gallery">Galleries</a>.</li></ol><p>Visitors then see prices on the gallery and check out from its cart. Paid orders, download links and customers collect on Orders & Invoices, Digital Downloads and Customers.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'product-kinds',
      'Concepts',
      'What you can sell',
      $html$<p>Every product has a kind, which decides what the buyer gets:</p><ul><li><strong>Digital download</strong>: a file the buyer downloads, at the rendition, download limit and link lifetime you choose.</li><li><strong>Licence</strong>: issues a license to the buyer, from a license template or your own terms, with the file included if you choose.</li><li><strong>Print</strong>: a print you produce and ship. The order stays open until you mark it shipped.</li><li><strong>Physical product</strong>: a shipped item not tied to an asset, such as a photo book, sold once per gallery.</li><li><strong>Bundle</strong>: any number of assets from the gallery, which the buyer picks, for one price. A bundle needs at least 2 assets.</li><li><strong>Gallery unlock</strong>: everything in a gallery for one price.</li></ul><p>A product's price is its default. A price sheet can set its own price for the product, and a gallery can override single assets.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'products-and-price-sheets',
      'Products & Pricing',
      'Products and price sheets',
      $html$<p><strong>Galleries → Products & Pricing</strong> holds the catalogue. Choose <strong>New product</strong>, pick its kind, and fill in its <strong>Name</strong> (required), <strong>Price</strong>, an optional <strong>Compare-at price</strong> shown struck through, <strong>Status</strong> (Active, Draft or Archived) and what it delivers, such as the <strong>Rendition</strong>, <strong>Download limit</strong> and <strong>Link expires after (days)</strong> for a download, where 0 means unlimited or never.</p><p>A <strong>price sheet</strong> is a reusable menu of products for galleries. Give it a <strong>Name</strong>, add products in the order buyers see them, and set a price for each, or leave it blank to use the product's own. <strong>Make default</strong> picks the sheet new stores start with. A sheet that galleries still sell from can't be deleted.</p><p>Each product's <strong>⋯</strong> menu has <strong>Duplicate</strong> (the copy starts as a Draft), <strong>Archive</strong> or <strong>Restore</strong>, and <strong>Delete</strong>.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'pricing-a-gallery',
      'Gallery Builder',
      'Pricing a gallery',
      $html$<p>A gallery's prices are set in its editor, in the <strong>Selling</strong> section. Turn on <strong>Sell from this gallery</strong>, then use any mix of these:</p><ul><li><strong>Price sheet</strong>: offers the sheet's products on every asset, plus its bundles and physical products for the whole gallery.</li><li><strong>Sell each asset at its own price</strong>: a <strong>Default per-asset price</strong> for every asset, with <strong>Delivered as</strong> borrowing a product's delivery settings.</li><li><strong>Price overrides</strong>: a different price for single assets or products, or take an asset off sale.</li><li><strong>Sell the whole gallery</strong>: one <strong>Unlock price</strong> for everything in it.</li></ul><p>Under <strong>On the page</strong>, choose <strong>Show prices on tiles</strong> for a "from" price on each asset, <strong>Show compare-at prices</strong>, <strong>Accept discount codes</strong>, the <strong>Buy button label</strong> and a <strong>Thank-you message</strong> for the order page. Save with <strong>Save Changes</strong>, like the rest of the gallery editor.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'storefront',
      'Storefront',
      'The storefront',
      $html$<p><strong>Galleries → Storefront</strong> sums up the store: <strong>Selling galleries</strong>, <strong>Paid orders</strong>, <strong>Gallery revenue</strong> and <strong>Discount codes</strong>.</p><ul><li><strong>Selling</strong>: each gallery with its orders and revenue. Its <strong>⋯</strong> menu has <strong>Start selling</strong> or <strong>Stop selling</strong>, and <strong>Open public page</strong>; a gallery that doesn't sell shows View only.</li><li><strong>Discount codes</strong>: the codes buyers can enter; see <a href="#discount-codes">Discount codes</a>.</li><li><strong>Store & policies</strong>: the <strong>Store name</strong> shown on the cart, checkout, order pages and invoices, a <strong>Support email</strong> buyers can write to, the <strong>Currency</strong> every price uses, and the <strong>Terms of sale</strong>, <strong>Refund policy</strong> and <strong>Privacy note</strong> linked from checkout.</li></ul><p>Set the currency before you start selling: every price, sheet and order uses it. Currencies are USD, EUR, GBP, CAD, AUD, INR and JPY.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'discount-codes',
      'Storefront',
      'Discount codes',
      $html$<p>To create a discount code, open <strong>Discount codes</strong> on Storefront and add one.</p><ul><li><strong>Code</strong>: 3 to 32 letters, numbers, <code>-</code> or <code>_</code>, and unique in the store. <strong>Generate a random code</strong> makes one for you.</li><li><strong>Type</strong>: <strong>Percentage off</strong> (up to 100) or <strong>Fixed amount off</strong>.</li><li><strong>Gallery</strong>: <strong>Every gallery</strong>, or one.</li><li><strong>Limits</strong>: <strong>Starts</strong> and <strong>Ends</strong> dates, a <strong>Minimum subtotal</strong> and the <strong>Total redemptions</strong> allowed.</li></ul><p>Buyers type the code in the cart. Assets checks it again at checkout, so an expired or used-up code never applies. <strong>Pause</strong> and <strong>Resume</strong> in a code's menu stop and restart it. A gallery only takes codes when both the store and the gallery accept them.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'payments-and-checkout',
      'Cart & Checkout',
      'Payments and checkout',
      $html$<p><strong>Galleries → Cart & Checkout</strong> sets how every gallery takes payment. Changes save as you make them and apply to the next checkout.</p><ul><li><strong>Payment method</strong>: <strong>Automatic</strong> (Stripe once it's set up for Assets, the test checkout until then), <strong>Stripe only</strong>, <strong>Test checkout (no real payments)</strong> or <strong>Invoice / pay later</strong>, where you mark orders paid yourself. With the test checkout, buyers see that nothing is charged.</li><li><strong>Statement descriptor</strong>: up to 22 characters on the buyer's card statement, for Stripe.</li><li><strong>Checkout details</strong>: whether to ask for the buyer's name, a company, a phone number and a billing address, allow a note, and offer a marketing opt-in. Email is always required, and carts with prints or physical products always ask for a shipping address.</li><li><strong>Require accepting the terms</strong>: buyers tick a box linking to your terms of sale.</li><li><strong>Cart rules</strong>: a <strong>Minimum order</strong>, the <strong>Most items per order</strong> (0 for no limit) and whether to <strong>Accept discount codes</strong>.</li></ul>$html$,
      '[]',
      null,
      70
    ),
    (
      'taxes-delivery-invoices',
      'Cart & Checkout',
      'Taxes, delivery and invoices',
      $html$<p>The rest of <strong>Cart & Checkout</strong> covers what happens around a sale.</p><ul><li><strong>Taxes</strong>: turn on <strong>Charge tax</strong> for a single <strong>Rate</strong> with its <strong>Label</strong>, such as VAT. <strong>Prices include tax</strong> takes tax out of the price instead of adding it on top. Add your <strong>Tax / VAT number</strong> for invoices.</li><li><strong>Fulfilment</strong>: <strong>Deliver automatically</strong> creates download links as soon as payment clears; with it off, orders wait for you. <strong>Issue licences automatically</strong> issues license products to the buyer. <strong>Default download limit</strong> and <strong>Default link lifetime</strong> (in days, 0 for unlimited or never) apply to gallery prices without a product's settings.</li><li><strong>Invoices & numbering</strong>: the <strong>Order prefix</strong> and <strong>Invoice prefix</strong>, the <strong>Seller name</strong> and <strong>Seller address</strong>, an <strong>Invoice footer</strong> and a <strong>Thank-you message</strong> for every order page.</li></ul><p>Anything past delivery, such as tagging customers or granting a membership, can run as a workflow on the order triggers. See <a href="/help/assets/workflows">Workflows</a>.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'how-buyers-check-out',
      'Concepts',
      'How buyers check out',
      $html$<p>On a selling gallery, a visitor clicks a price to add it to the cart, picks options such as a print size, and can enter a discount code. At checkout they give their email and the details you ask for, accept the terms if required, and pay with the store's payment method.</p><p>After paying, the buyer lands on their order page, with the receipt, their download links and any licenses. Prints and physical products wait there until you mark them shipped. With <strong>Invoice / pay later</strong>, the order waits for payment and the page says how to pay.</p><p>Assets doesn't email the buyer. The order page's address is their way back, so to send it again, copy it with <strong>Copy buyer link</strong> on the order.</p>$html$,
      '[]',
      null,
      90
    ),
    (
      'orders-and-invoices',
      'Orders & Invoices',
      'Orders and invoices',
      $html$<p><strong>Galleries → Orders & Invoices</strong> lists every gallery sale. The figures across the top show <strong>Paid orders</strong>, <strong>Net revenue</strong>, the <strong>Average order</strong> and orders <strong>Awaiting payment</strong>. Pick a period (Last 7 days, Last 30 days, Last 90 days or All time) and a gallery, filter by status, and choose <strong>Export CSV</strong> for a spreadsheet of the orders shown.</p><p>An order's status is Awaiting payment, Paid, Fulfilled, Part refunded, Refunded, Cancelled or Failed. Each row's <strong>⋯</strong> menu has <strong>Copy buyer link</strong> and, for an order that's awaiting payment or failed, <strong>Cancel order</strong>.</p><p>Click an order to open it. Its sections are <strong>Items & payment</strong>, <strong>Customer & billing</strong>, <strong>Downloads & licences</strong>, <strong>Invoice</strong>, which shows the invoice with the order's number, and <strong>Timeline</strong>. Notes you add there are private to your team.</p>$html$,
      '[]',
      null,
      100
    ),
    (
      'handling-an-order',
      'Orders & Invoices',
      'Handling an order',
      $html$<p>The actions at the top of an order depend on where it is.</p><ul><li><strong>Mark paid</strong>: for an invoice or offline payment. Add an optional <strong>Payment reference</strong>, such as a bank transfer ID. Delivery runs straight away and the Order paid workflows start.</li><li><strong>Deliver now</strong>: creates the download links for a paid order that's waiting to be delivered.</li><li><strong>Mark items shipped</strong>: marks the order's prints and physical products as shipped. The button counts them, like <strong>Mark 2 items shipped</strong>.</li><li><strong>Refund</strong>: pick the <strong>Amount</strong> and a <strong>Reason</strong>. A full refund can also <strong>Revoke download links</strong> (on to start) and <strong>Terminate licences</strong>; a partial refund keeps them. Stripe orders are refunded to the buyer's card; for other orders, Assets records the refund and you return the money yourself.</li><li><strong>Cancel order</strong>: for an order that's awaiting payment or failed.</li></ul><p>Under <strong>Downloads & licences</strong>, copy, revoke or restore each download link.</p>$html$,
      '[]',
      null,
      110
    ),
    (
      'digital-downloads',
      'Digital Downloads',
      'Download links',
      $html$<p><strong>Galleries → Digital Downloads</strong> lists every download link handed out, by a sale, a workflow or your team, with its customer, file, how often it's been used, when it was last downloaded and when it expires. The figures across the top count <strong>Active links</strong>, <strong>Downloads served</strong>, links <strong>Expiring this week</strong> and those <strong>Never downloaded</strong>.</p><p>A link is Active, Expired, at its limit (Limit reached) or Revoked. Each row's <strong>⋯</strong> menu has <strong>Copy link</strong>, <strong>Extend 30 days</strong>, <strong>Reset download count</strong>, <strong>Revoke link</strong> or <strong>Restore link</strong>, and <strong>Delete link</strong>.</p><p>To give someone files by hand, choose <strong>Grant downloads</strong>, pick the <strong>Customer</strong> and the <strong>Assets</strong>, and set the <strong>Rendition</strong>, <strong>Download limit</strong> (0 for unlimited) and <strong>Expires after (days)</strong> (0 for never).</p>$html$,
      '[]',
      null,
      120
    ),
    (
      'customers',
      'Customers',
      'Customers',
      $html$<p><strong>Galleries → Customers</strong> lists everyone who has bought from a gallery, with their orders, total spent, first and last order, tags and marketing opt-in. The figures across the top show <strong>Customers</strong>, the <strong>Repeat rate</strong>, <strong>Average lifetime value</strong> and <strong>Marketing opt-ins</strong>. Filter by <strong>Repeat buyers</strong>, <strong>Licence holders</strong> and other groups, or by tag.</p><p>To record a buyer who paid outside the store, choose <strong>Add customer</strong> and enter at least a valid, unused <strong>Email</strong>; you can then grant them downloads.</p><p>Click a customer to see their profile, orders, download links and licenses. There you can edit their contact details, add <strong>Tags</strong> and private <strong>Notes</strong>, and grant downloads. <strong>Block this customer</strong> makes checkout refuse new orders from their email; their existing downloads keep working until you revoke them. A customer with orders can't be deleted, only blocked.</p>$html$,
      '[]',
      null,
      130
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"GalleryHorizontalEnd","label":"Galleries","href":"/help/assets/galleries"},{"icon":"BadgeCheck","label":"Licensing","href":"/help/assets/licensing"},{"icon":"ChartColumn","label":"Analytics","href":"/help/assets/analytics"}]',
      null,
      140
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'assets/galleries/store' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Store & orders',
    description = 'Sell from your galleries: products and prices, checkout, digital downloads, orders and customers.',
    status = 'draft',
    published_at = null
where slug = 'assets/galleries/store' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'assets/galleries/store' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Storefront</li><li>Products and pricing</li><li>Digital downloads</li><li>Cart and checkout</li><li>Orders and invoices</li><li>Customers</li></ul>',
  10
from public.docs_pages p
where p.slug = 'assets/galleries/store' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
