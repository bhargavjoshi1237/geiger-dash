-- Expand the release product constraint for existing Geiger Dash databases.
ALTER TABLE public.dash_changelog
  DROP CONSTRAINT IF EXISTS dash_changelog_product_check;

UPDATE public.dash_changelog
SET product = 'geiger-assets'
WHERE product = 'geiger-dam';

ALTER TABLE public.dash_changelog
  ADD CONSTRAINT dash_changelog_product_check
  CHECK (product IN (
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
