-- Help events inventory page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the events/inventory draft outline from
-- 20261024191100_help_events_structure with the full Inventory guide and publishes it. Item Issuing, Issuing Staff and
-- the /issue staff desk are left out: the desk fails as soon as a code unlocks it, and both screens list no events.
-- Written from a survey of C:\Pro\geiger-events (components/internal/sidebar/sidebar_nav.jsx,
-- components/internal/screens/registry.jsx, components/internal/screens/inventory/*, lib/inventory/*,
-- lib/supabase/inventory.js, inventory_issuing.js, inventory_purchasing.js, issuing.js, storage.js,
-- components/checkin_routes/{issue_desk,access_gate,route_shell,qr_scanner}.jsx, app/issue/[eventId]/page.js,
-- components/internal/shared/audience/audience_builder.jsx, lib/audience/resolve.js, lib/events/purchasables.js,
-- components/portal/portal_tickets.jsx, components/internal/shared/pagination.jsx, geiger-ui.config.js,
-- geiger-rbac.config.js, supabase/migrations/20260726194115_inventory.sql, 20260726194139_inventory_issuing.sql).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set description = 'Keep a catalog of stock and merch, record every stock movement, commit items to events, sell them as add-ons, and buy stock with purchase orders.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'events/inventory' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'events/inventory' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'adding-an-item',
      'Basics',
      'Adding an item',
      $html$<p>Inventory keeps a catalog of the physical things you stock for events, such as merch, badges, print, food and supplies. To add an item, choose <strong>Inventory → Items</strong> in the sidebar, then <strong>New item</strong>. Only <strong>Name</strong> is required: <strong>Create item</strong> asks for one before it saves.</p><ul><li><strong>Photo</strong>: optional. Events compresses it to under 500 KB and uploads it once the item is saved.</li><li><strong>SKU</strong>: optional, your own stock code.</li><li><strong>Category</strong>: Merch (the default), Swag, Badges & Credentials, Print & Signage, Food & Beverage, Equipment, Supplies or Other.</li><li><strong>Unit cost</strong> (what you pay) and <strong>Unit price</strong> (what you charge). Both start at 0.</li><li><strong>Reorder at</strong>: the stock level at which the item shows as Low stock. 0, the default, turns the alert off.</li><li><strong>Opening stock</strong>: how many you hold now. Events records it as a Received movement with the reason Opening stock.</li><li><strong>Description</strong>: optional.</li></ul><p>Items belong to the project, so every event in the project can draw on the same catalog. Costs, prices and values show in US dollars. Sizes and colors are added as variants once the item exists.</p><p>By default, <strong>Inventory</strong> appears in the sidebar for the Owner, Admin and Manager roles. To change who sees it, see <a href="/help/events/settings#roles-and-permissions">Roles and permissions</a>.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'how-inventory-fits-together',
      'Concepts',
      'How inventory fits together',
      $html$<p>Inventory has three parts that build on each other.</p><ul><li><strong>Items</strong> are the catalog. An item with variants, like a T-shirt in four sizes, holds its stock on each variant and shows their total.</li><li><strong>Stock movements</strong> are the ledger. An item's on-hand count is the sum of its movements, and the only way to change it is to record one: opening stock, receiving, returning, issuing, writing off, transferring or adjusting. Movements can't be edited or deleted, so you correct a mistake with an opposite movement.</li><li><strong>Event allocations</strong> commit stock to an event. Allocated stock stays on hand until you issue it, and the item list subtracts it from what's available, so <strong>Available</strong> is what you can still promise.</li></ul><p><strong>Suppliers & Purchase Orders</strong> is where you buy stock: receiving a purchase order records a Received movement for each line.</p><p>Inventory counts physical stock only. How many of each ticket you sell is set on the tickets themselves; see <a href="/help/events/tickets">Tickets</a>.</p><p>In <strong>Settings → Navigation</strong>, an entry can't be hidden while an entry that depends on it is shown. Stock Movements, Event Allocations and Suppliers & Purchase Orders depend on Items, Item Issuing depends on Event Allocations, and Issuing Staff depends on Item Issuing, so hide the dependent entries first. See <a href="/help/events/settings#navigation">Sidebar navigation</a>.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'adding-variants',
      'Items',
      'Adding variants',
      $html$<p>Variants split an item into versions that each hold their own stock, such as sizes or colors. To add one, choose <strong>Add variant</strong> in the item's <strong>⋯</strong> menu on <strong>Items</strong>, or on the <strong>Variants</strong> tab of the item's details. Only <strong>Variant</strong> is required, for example <code>Large</code>.</p><p>The other fields work as they do for a new item: <strong>Photo</strong>, <strong>SKU</strong>, <strong>Unit cost</strong>, <strong>Unit price</strong>, <strong>Reorder at</strong> and <strong>Opening stock</strong>. A variant takes its item's category, and a variant without a photo of its own shows the item's photo. Variants can't have variants of their own.</p><p>Once an item has variants, only the variants hold stock. The item's on-hand count, value and status come from its variants, and stock recorded on the item itself no longer counts, so add variants before you record any stock. Movements, allocations and purchase orders are made against a variant, never the item that groups them.</p><p>A variant keeps the item name it was created with, and other screens show it as that name followed by the variant. If you rename an item, rename each variant too, in its own details.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'the-item-list',
      'Items',
      'The item list',
      $html$<p>The figures across the top of <strong>Items</strong> count the whole catalog: <strong>Items</strong> (with how many stocked SKUs, that is items and variants that hold stock), <strong>Stock value</strong> (on hand at unit cost), <strong>Needs attention</strong> (items low or out of stock) and <strong>Allocated</strong> (units committed to events and not yet issued). Search and filters don't change them.</p><p>Each row shows the item's photo, name, SKU and category, then:</p><ul><li><strong>On hand</strong>: what you hold now.</li><li><strong>Allocated</strong>: planned for events and not yet issued, from allocations that aren't Closed.</li><li><strong>Available</strong>: on hand minus allocated. It turns red when it's negative, that is when you've committed more than you hold.</li><li><strong>Status</strong>: Out of stock at 0 or less, Low stock at or under <strong>Reorder at</strong>, otherwise In stock. An item with variants shows its worst variant's status.</li><li><strong>Value</strong>: on hand times unit cost.</li></ul><p>An item with variants shows how many it has; click the arrow beside it to list them. Filter by category or stock level (<strong>All stock levels</strong>, <strong>In stock</strong>, <strong>Low stock</strong> or <strong>Out of stock</strong>), or search names, variants and SKUs. Items are listed newest first, 25 to a page, and a variant always stays on its item's page. Choose 10, 25, 50 or 100 at the bottom to change the page size.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'item-details',
      'Items',
      'Item details and deleting',
      $html$<p>Click an item on <strong>Items</strong>, or choose <strong>Open item</strong> in its <strong>⋯</strong> menu, to open its details. They show the photo, <strong>On hand</strong> and <strong>Stock value</strong>, and four tabs:</p><ul><li><strong>Overview</strong>: name, SKU, category, unit cost, unit price, <strong>Reorder at</strong> and description, plus <strong>Variant</strong> on a variant. Choose <strong>Save Changes</strong> to keep your edits.</li><li><strong>Stock</strong>: every movement for the item, newest first, with <strong>Receive</strong> and <strong>Issue / adjust</strong> to record one. An item with variants has no buttons here: open a variant instead.</li><li><strong>Events</strong>: each event the item is allocated to, with the planned and issued quantities, issuance and status.</li><li><strong>Variants</strong>: the item's variants with their stock, and <strong>Add variant</strong>.</li></ul><p>Photo changes save on their own. Choose <strong>Add a product photo</strong> when there's none, or hover over the photo for <strong>Replace</strong> and <strong>Remove</strong>. Only the teammate who created an item can add or replace its photo.</p><p>To delete an item, choose <strong>Delete</strong> in its <strong>⋯</strong> menu on <strong>Items</strong>. Events asks you to confirm first and deletes the item's variants with it, and a deleted item can't be restored from Events. Its movements stay on <strong>Stock Movements</strong> and its allocations stay on <strong>Event Allocations</strong>, both shown as Deleted item.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'recording-a-stock-movement',
      'Stock Movements',
      'Recording a stock movement',
      $html$<p>Every change to stock is a movement. To record one, choose <strong>Inventory → Stock Movements</strong> in the sidebar, then <strong>Record movement</strong>, and pick the <strong>Item</strong>. In an item's details, <strong>Receive</strong> and <strong>Issue / adjust</strong> on the <strong>Stock</strong> tab open the same dialog for that item. <strong>Record movement</strong> stays disabled until the catalog has an item or variant that holds stock.</p><ul><li><strong>Movement</strong>: Receive into stock (the default), Adjust count, Issue out, Return to stock, Write off / waste or Transfer out. Receiving and returning add stock; issuing, writing off and transferring take it out.</li><li><strong>Direction</strong>: for Adjust count only, <strong>Add to stock</strong> or <strong>Remove from stock</strong>.</li><li><strong>Quantity</strong>: required and more than zero. You can't take out more than is on hand.</li><li><strong>Reason</strong> and <strong>Note</strong>: optional.</li></ul><p>Choose <strong>Record movement</strong>, and the item's on-hand count changes straight away. Movements can't be edited or deleted. To fix a mistake, record the opposite movement, such as an Adjust count that adds back what was taken out by error.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'the-movement-ledger',
      'Stock Movements',
      'The movement ledger',
      $html$<p><strong>Stock Movements</strong> lists every movement in the project, newest first: the item with the movement's reason and reference, the movement type, the event it was for, the change in stock and when it was recorded.</p><p>Besides the movements you record, Events adds one when you:</p><ul><li>create an item or variant with opening stock (Received, reason Opening stock)</li><li>receive a purchase order (Received, with the order's reference)</li><li>issue or return stock on an event allocation (Issued or Returned, with the event)</li></ul><p>The figures across the top are <strong>Into stock</strong> (received and returned), <strong>Out of stock</strong> (issued and transferred), <strong>Written off</strong> and <strong>Net change</strong>, which also counts adjustments. Filter by movement type or item, or search item names, reasons, notes and references.</p><p>The screen loads the 500 most recent movements, and the figures count those. The list shows 25 a page; choose 10, 25, 50 or 100 at the bottom.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'allocating-stock-to-an-event',
      'Event Allocations',
      'Allocating stock to an event',
      $html$<p>An allocation commits an item to one event and says who it's for. To create one, choose <strong>Inventory → Event Allocations</strong> in the sidebar, then <strong>Allocate stock</strong>. The button stays disabled until the project has an event and an item or variant that holds stock. <strong>Event</strong> and <strong>Item</strong> are required.</p><ul><li><strong>Item</strong>: an item without variants, or one variant. The list shows each one's stock on hand.</li><li><strong>Planned quantity</strong>: how many you're committing. Left empty, it's 0.</li><li><strong>Status</strong>: Planned (the default), Reserved, Issued or Closed.</li><li><strong>Issuance</strong>: who the item is for. Internal, the default, is stock your team uses. The other choices entitle attendees and add <strong>Units per attendee</strong> and a <strong>Collection rule</strong>; see <a href="#issuance-and-collection-rules">Issuance and collection rules</a>.</li></ul><p>Choose <strong>Allocate</strong>. Allocating doesn't move stock: the item's <strong>Allocated</strong> figure goes up and <strong>Available</strong> goes down until the stock is issued.</p><p>An allocation can't be edited once it's created. Later you can change its status and sell it as an add-on, but to change its item, event, quantity or rules, remove it and allocate again.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'issuance-and-collection-rules',
      'Event Allocations',
      'Issuance and collection rules',
      $html$<p>An allocation's <strong>Issuance</strong> decides which attendees are entitled to the item:</p><ul><li><strong>Internal</strong>: nobody. The stock is for your team.</li><li><strong>Ticket-based</strong>: buyers of the tickets you select under <strong>Entitled tickets</strong>.</li><li><strong>Add-on</strong>: buyers of the event purchasable you pick under <strong>Add-on</strong>.</li><li><strong>Session-based</strong>: attendees signed up for the sessions you select under <strong>Entitled sessions</strong>, from <strong>Program → Agenda Builder</strong>.</li><li><strong>Every attendee</strong>: everyone with an order or registration for the event that isn't canceled or declined.</li><li><strong>Targeted audience</strong>: <strong>All attendees</strong>, or <strong>Filtered</strong>. Filtering by <strong>Add-on</strong> works, and so do the people you include or exclude. A <strong>Ticket</strong>, <strong>Tag</strong> or <strong>Segment</strong> filter entitles nobody and <strong>Offering</strong> and <strong>Status</strong> filters are ignored, so use Ticket-based to target ticket holders.</li></ul><p>Ticket-based and Session-based need at least one choice, and Add-on needs one. <strong>Units per attendee</strong> (1 by default) is multiplied by the tickets on each order, the places on each registration, or for Add-on, the add-ons bought. Ticket-based and Add-on only match orders, never registrations.</p><p><strong>Collection rule</strong> says how often each attendee can collect: <strong>One per attendee</strong> (the default, a single collection), <strong>Per event day</strong> (once on each day of the event, in the event's time zone), <strong>Named windows</strong> (once in each window you add, while it's open) or <strong>Rolling interval</strong>, which sets <strong>Wait between collections</strong> in hours. <strong>Total cap</strong> limits how many units one attendee can ever collect; leave it blank for no cap.</p><p>Buyers see what they're entitled to, and how much they've collected, under <strong>Collect at the event</strong> on their ticket in the <a href="/help/events/members-portal">Members portal</a>. Internal and Closed allocations never show there.</p>$html$,
      '[]',
      null,
      90
    ),
    (
      'the-allocation-list',
      'Event Allocations',
      'The allocation list',
      $html$<p>The figures across the top of <strong>Event Allocations</strong> are <strong>Allocations</strong> (with how many events), <strong>Planned</strong>, <strong>Issued</strong> and <strong>Short</strong>, the units by which demand runs ahead of what's planned. Search and filters don't change them.</p><p>Each row shows the item and event, the issuance with a summary of its collection rule, then:</p><ul><li><strong>Collected</strong>: units handed to attendees, as recorded in Item Issuing.</li><li><strong>Planned</strong> and <strong>Issued</strong>: what you committed, and what you've taken out with <strong>Issue stock</strong>.</li><li><strong>Demand</strong>: for Ticket-based, the entitled tickets sold times units per attendee; for Add-on, the add-ons sold times units per attendee. Canceled orders don't count. For any other issuance, demand is the planned quantity.</li><li><strong>Short</strong>: how far demand exceeds the planned quantity.</li><li><strong>Status</strong>: Planned, Reserved, Issued or Closed.</li></ul><p>Rows are sorted by event name, 25 to a page. Filter by event, issuance or status, or search item and event names.</p><p>To change a status, choose <strong>Mark planned</strong>, <strong>Mark reserved</strong>, <strong>Mark issued</strong> or <strong>Mark closed</strong> in the row's <strong>⋯</strong> menu; it saves straight away. Planned, Reserved and Issued work the same way. A Closed allocation stops counting toward <strong>Allocated</strong> on Items and stops entitling attendees.</p>$html$,
      '[]',
      null,
      100
    ),
    (
      'issuing-and-returning-stock',
      'Event Allocations',
      'Issuing and returning stock',
      $html$<p>Issuing takes an allocation's stock off the shelf for its event in one go, such as a box of lanyards for the front desk. On <strong>Event Allocations</strong>, choose <strong>Issue stock</strong> in the allocation's <strong>⋯</strong> menu, check the <strong>Quantity</strong> and choose <strong>Issue</strong>. The quantity starts at what's left to issue (planned minus issued) and can't be more than that or than what's on hand.</p><p>Events records an Issued movement for the event, lowers the item's on-hand count, adds the quantity to the allocation's <strong>Issued</strong> figure and sets its status to Issued.</p><p>To bring unused stock back, choose <strong>Return stock</strong>, which is available once something has been issued. Enter up to the issued quantity and choose <strong>Return</strong>. Events records a Returned movement, puts the stock back on hand and lowers <strong>Issued</strong>, and the status stays as it is.</p><p>To remove an allocation, choose <strong>Remove</strong> in its menu. Events asks you to confirm first, and a removed allocation can't be restored. Stock it issued stays issued, with its movements on <strong>Stock Movements</strong>. Removing an allocation leaves its add-on on sale, so choose <strong>Remove from checkout</strong> in <strong>Add-on settings</strong> first.</p>$html$,
      '[]',
      null,
      110
    ),
    (
      'selling-an-item-as-an-add-on',
      'Event Allocations',
      'Selling an item as an add-on',
      $html$<p>An allocation can put its item on sale at the event's checkout. On <strong>Event Allocations</strong>, choose <strong>Sell as add-on</strong> in the allocation's <strong>⋯</strong> menu:</p><ul><li><strong>Add-on name</strong>: required. It starts as the item's name.</li><li><strong>Description</strong>: optional, shown to buyers at checkout.</li><li><strong>Price</strong>: starts at the item's unit price.</li><li><strong>Checkout cap</strong>: starts at what you can promise, the item's stock on hand minus this allocation's demand that hasn't been collected. Events warns you when the cap is higher than that. The cap is saved with the add-on, but checkout doesn't stop selling when it's reached.</li><li><strong>Allow buying several</strong>: gives buyers a quantity stepper, up to <strong>Max per order</strong> (blank for no limit). With it off, buyers tick the add-on once.</li></ul><p>Choose <strong>Publish</strong>. The item joins the event's purchasables with its photo, and the allocation's issuance becomes Add-on, so its demand follows sales and buyers are entitled to collect what they bought. A sale doesn't change the item's stock on hand. While the event has a purchasable on sale, checkout shows purchasables instead of offerings; see <a href="/help/events/tickets">Tickets</a>.</p><p>Once the item is on sale, the menu entry reads <strong>Add-on settings</strong>. Change the fields and choose <strong>Save</strong>, or choose <strong>Remove from checkout</strong> to stop selling it.</p>$html$,
      '[]',
      null,
      120
    ),
    (
      'creating-a-purchase-order',
      'Suppliers & Purchase Orders',
      'Creating a purchase order',
      $html$<p>A purchase order records stock you're buying. To create one, choose <strong>Inventory → Suppliers & Purchase Orders</strong> in the sidebar, then <strong>New purchase order</strong> on the <strong>Purchase orders</strong> tab. The button stays disabled until the catalog has an item or variant that holds stock.</p><ul><li><strong>Supplier</strong>: optional, one of your suppliers.</li><li><strong>Reference</strong>: optional, like <code>PO-2026-014</code>. Without one, the order is listed as PO followed by six characters of its ID.</li><li><strong>Expected</strong>: an optional delivery date.</li><li><strong>Status</strong>: Draft (the default) or Ordered.</li><li><strong>Lines</strong>: an item or variant, a quantity and a unit cost on each. Picking an item fills in its unit cost when the cost is empty. <strong>Add line</strong> adds another, and the × beside a line removes it.</li><li><strong>Notes</strong>: optional.</li></ul><p>At least one line needs both an item and a quantity, and lines missing either are left off. <strong>Order total</strong> adds up quantity times cost. Choose <strong>Create purchase order</strong>.</p><p>Events doesn't send the order to the supplier, so send it to them yourself.</p>$html$,
      '[]',
      null,
      130
    ),
    (
      'receiving-a-purchase-order',
      'Suppliers & Purchase Orders',
      'Receiving a purchase order',
      $html$<p>Receiving puts a purchase order's stock into the catalog. On the <strong>Purchase orders</strong> tab, choose <strong>Receive stock</strong> in the order's <strong>⋯</strong> menu. Each line shows how much has been received and how much is outstanding, and its box starts at the outstanding quantity. Change it for a part delivery, then choose <strong>Receive into stock</strong>. A line never takes more than is outstanding.</p><p>Each line you receive records a Received movement with the reference you typed, and the item's on-hand count goes up. The order becomes Partially received, or Received once every line is complete. Receiving doesn't change an item's unit cost.</p><p>The order's <strong>⋯</strong> menu also has:</p><ul><li><strong>Mark ordered</strong>, on a draft: sets the status to Ordered. Nothing is sent to the supplier.</li><li><strong>Cancel Order</strong>, until the order is fully received: Events asks you to confirm, and outstanding quantities can't be received after that.</li><li><strong>Remove</strong>: deletes the order after you confirm. Stock already received stays in the catalog.</li></ul><p>The figures across the top are <strong>Suppliers</strong>, <strong>Open orders</strong> (Ordered or Partially received), <strong>Units on order</strong> (not yet received on open orders) and <strong>Committed spend</strong> (the totals of open orders). Each order shows its reference and supplier, lines, received of ordered, status, expected date and total. Filter by status, or search references, suppliers and notes.</p>$html$,
      '[]',
      null,
      140
    ),
    (
      'suppliers',
      'Suppliers & Purchase Orders',
      'Suppliers',
      $html$<p>Suppliers are the companies you buy stock from. To add one, open the <strong>Suppliers</strong> tab in <strong>Suppliers & Purchase Orders</strong> and choose <strong>New supplier</strong>. Only <strong>Name</strong> is required: <strong>Add supplier</strong> asks for one. The other fields are <strong>Contact</strong>, <strong>Email</strong>, <strong>Phone</strong>, <strong>Lead time</strong> (days from order to delivery), <strong>Website</strong> and <strong>Notes</strong>. They're for your own reference: Events doesn't contact the supplier or use the lead time.</p><p>The list shows each supplier's contact, email and phone, lead time and how many purchase orders name it. Search names, contacts and emails.</p><p>Suppliers can't be edited once they're added. <strong>Remove</strong> in a supplier's <strong>⋯</strong> menu deletes it after you confirm, and its purchase orders then show No supplier.</p>$html$,
      '[]',
      null,
      150
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Ticket","label":"Tickets","href":"/help/events/tickets"},{"icon":"CalendarDays","label":"Events","href":"/help/events/events"},{"icon":"CircleUserRound","label":"Members portal","href":"/help/events/members-portal"},{"icon":"Receipt","label":"Orders","href":"/help/events/orders"},{"icon":"ClipboardList","label":"Program","href":"/help/events/program"},{"icon":"Settings","label":"Settings","href":"/help/events/settings"}]',
      null,
      160
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'events/inventory' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Inventory',
    description = 'Track stock and merch, allocate items to events, and hand them out at the issuing desk.',
    status = 'draft',
    published_at = null
where slug = 'events/inventory' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'events/inventory' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Items</li><li>Stock movements</li><li>Event allocations</li><li>Item issuing</li><li>Issuing staff</li><li>Suppliers and purchase orders</li></ul>',
  10
from public.docs_pages p
where p.slug = 'events/inventory' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
