-- Changelog more products
--
-- Adds geiger-comms, geiger-pods and geiger-property to public.dash_changelog_product_check so the
-- changelog service (/api/changelog/ingest) can publish entries for them. Mirrors CHANGELOG_PRODUCTS.

-- @up
alter table public.dash_changelog
  drop constraint if exists dash_changelog_product_check;

alter table public.dash_changelog
  add constraint dash_changelog_product_check
  check (product in (
    'geiger-assets',
    'geiger-campaign',
    'geiger-canvas',
    'geiger-chat',
    'geiger-comms',
    'geiger-content',
    'geiger-dash',
    'geiger-docs',
    'geiger-events',
    'geiger-flow',
    'geiger-forms',
    'geiger-grey',
    'geiger-notes',
    'geiger-office',
    'geiger-pods',
    'geiger-property'
  ));

-- @down
-- Fails while any comms/pods/property entries exist; remove those first if you really need to roll back.
alter table public.dash_changelog
  drop constraint if exists dash_changelog_product_check;

alter table public.dash_changelog
  add constraint dash_changelog_product_check
  check (product in (
    'geiger-assets',
    'geiger-campaign',
    'geiger-canvas',
    'geiger-chat',
    'geiger-content',
    'geiger-dash',
    'geiger-docs',
    'geiger-events',
    'geiger-flow',
    'geiger-forms',
    'geiger-grey',
    'geiger-notes',
    'geiger-office'
  ));
