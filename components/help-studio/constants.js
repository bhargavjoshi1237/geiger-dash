export const PAGE_STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
]

export const PAGE_STATUS_BADGE = {
  draft: { label: 'Draft', variant: 'outline' },
  published: { label: 'Live', variant: 'success' },
  archived: { label: 'Archived', variant: 'warning' },
}

// Radix Select can't hold an empty value, so "no parent" and "no showcase" use a sentinel.
export const NO_PARENT = 'none'
export const NO_SHOWCASE = 'none'
