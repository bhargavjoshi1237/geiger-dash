export const PAGE_STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
]

// docs_pages.status → the shared Studio status keys (STUDIO_STATUS_MAP).
export const HELP_STATUS = {
  draft: 'draft',
  published: 'live',
  archived: 'archived',
}

// Tree dots: filled emerald live, hollow ring draft, filled amber archived.
export const HELP_STATUS_DOT = {
  live: 'bg-emerald-500 dark:bg-emerald-400',
  draft: 'ring-[1.5px] ring-inset ring-muted-foreground',
  archived: 'bg-amber-500 dark:bg-amber-400',
}

// Radix Select can't hold an empty value, so "no parent" and "no showcase" use a sentinel.
export const NO_PARENT = 'none'
export const NO_SHOWCASE = 'none'
