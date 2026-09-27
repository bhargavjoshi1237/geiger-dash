-- Fix doubled apostrophes left by the original page seeds, and point venue-management at what sourcing and seat maps actually do.
-- Re-runnable: each update only touches rows that still contain the old text.

update public.dash_seo_pages
set content = replace(content, '''''', '''')
where product = 'geiger-events' and content like '%''''%';

update public.dash_seo_pages
set content = replace(
  content,
  'For laying out the room itself — tables, stages, and seating to scale — see <a href="/features/events/event-floor-plans-seating">floor plans and seating charts</a>, and for finding a new space when your usual ones won''t do, <a href="/features/events/venue-sourcing">venue sourcing</a> covers proposals and instant booking.',
  'For the room itself, build its <a href="/features/events/event-floor-plans-seating">seat maps and exhibitor halls</a> once and attach them to every event held there, and when your usual spaces won''t do, <a href="/features/events/venue-sourcing">venue sourcing</a> searches real venues on a map and tracks your shortlist through quotes to booked.'
)
where product = 'geiger-events' and page_type = 'feature' and slug = 'venue-management'
  and content like '%covers proposals and instant booking%';
