'use client'

// Three-pane Studio kit: list pane, editor top bar, document canvas and tabbed inspector. Every pane header is 52px so the panes line up.

import { Fragment, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Check, ChevronRight, Ellipsis, Link2, PanelLeft, PanelRight, X } from 'lucide-react'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  SegmentedTabs,
  Switch,
  cn,
} from '@geiger/ui'
import { formatRelative } from '@/components/content-studio/constants'

export const PANE_HEADER = 'flex h-[52px] shrink-0 items-center border-b border-sidebar-border'

export function StudioFrame({ children }) {
  return <div className="flex h-full min-h-0 min-w-0 flex-1">{children}</div>
}

// Tap-outside layer for the list/inspector panes when they float over narrow screens.
function PaneBackdrop({ onClose, className }) {
  return (
    <button
      type="button"
      aria-label="Close panel"
      onClick={onClose}
      className={cn('fixed inset-0 z-20 bg-black/50', className)}
    />
  )
}

export function ListPane({ title, count, subtitle, actions, search, filters, footer, open, onClose, children }) {
  return (
    <>
      {open ? <PaneBackdrop onClose={onClose} className="lg:hidden" /> : null}
      <aside
        className={cn(
          'w-[280px] shrink-0 flex-col border-r border-sidebar-border bg-surface-subtle',
          open ? 'fixed bottom-0 left-14 top-[var(--geiger-banner-h,0px)] z-30 flex shadow-2xl lg:static lg:z-auto lg:shadow-none' : 'hidden lg:flex',
        )}
      >
        <div className={cn(PANE_HEADER, 'gap-2 pl-4 pr-2.5')}>
          <div className="flex min-w-0 flex-col leading-tight">
            <div className="flex items-baseline gap-2">
              <span className="truncate text-sm font-semibold text-foreground">{title}</span>
              {count !== undefined ? <span className="text-xs tabular-nums text-text-secondary">{count}</span> : null}
            </div>
            {subtitle ? <span className="truncate text-[11px] text-muted-foreground">{subtitle}</span> : null}
          </div>
          <div className="ml-auto flex items-center gap-1">{actions}</div>
        </div>
        {search || filters ? (
          <div className="flex flex-col gap-2.5 border-b border-sidebar-border p-3">
            {search}
            {filters}
          </div>
        ) : null}
        <div className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto overscroll-contain p-1.5">{children}</div>
        {footer}
      </aside>
    </>
  )
}

export function ListItem({ selected, onClick, className, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={selected ? 'true' : undefined}
      className={cn(
        'flex w-full min-w-0 shrink-0 flex-col gap-1.5 rounded-lg border py-2.5 pl-3 pr-2.5 text-left transition-colors',
        selected ? 'border-border bg-surface-active' : 'border-transparent hover:bg-surface-hover',
        className,
      )}
    >
      {children}
    </button>
  )
}

export function ListEmpty({ children }) {
  return <p className="px-3 py-10 text-center text-sm text-muted-foreground">{children}</p>
}

export function ListGroupLabel({ label, count, action }) {
  return (
    <div className="flex items-center gap-1.5 px-2.5 pb-1.5 pt-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {count !== undefined ? <span className="font-normal tracking-normal text-text-secondary">{count}</span> : null}
      {action}
    </div>
  )
}

export function TopBarDivider() {
  return <span aria-hidden className="mx-1 h-5 w-px shrink-0 bg-border" />
}

export function EditorTopBar({ crumbs = [], current, currentClassName, meta, actions, onOpenList, onOpenInspector }) {
  return (
    <div className={cn(PANE_HEADER, 'gap-2.5 px-3 sm:pl-6 sm:pr-4')}>
      {onOpenList ? (
        <Button type="button" variant="ghost" size="icon-sm" onClick={onOpenList} aria-label="Show list" className="text-muted-foreground lg:hidden">
          <PanelLeft className="size-4" />
        </Button>
      ) : null}
      <div className="hidden min-w-0 items-center gap-2.5 sm:flex">
        {crumbs.map((crumb) => (
          <Fragment key={crumb}>
            <span className="shrink-0 text-[13px] text-muted-foreground">{crumb}</span>
            <ChevronRight className="size-3.5 shrink-0 text-text-secondary" />
          </Fragment>
        ))}
      </div>
      <span className={cn('min-w-0 max-w-[280px] truncate text-[13px] font-medium text-foreground', currentClassName)}>{current}</span>
      <div className="hidden min-w-0 items-center gap-2.5 md:flex">{meta}</div>
      <div className="ml-auto flex shrink-0 items-center gap-1.5">
        {actions}
        {onOpenInspector ? (
          <Button type="button" variant="ghost" size="icon-sm" onClick={onOpenInspector} aria-label="Show settings" className="text-muted-foreground xl:hidden">
            <PanelRight className="size-4" />
          </Button>
        ) : null}
      </div>
    </div>
  )
}

// Save state next to the title; replaces the old floating save bars.
export function SaveState({ dirty, savedAt, isNew }) {
  if (dirty) {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-xs text-muted-foreground">
        <span className="size-1.5 rounded-full bg-amber-400" />
        Unsaved changes
      </span>
    )
  }
  if (isNew) return <span className="shrink-0 whitespace-nowrap text-xs text-muted-foreground">Not saved yet</span>
  const ago = savedAt ? formatRelative(savedAt) : ''
  return (
    <span suppressHydrationWarning className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-xs text-muted-foreground">
      <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
      {ago && ago !== 'just now' ? `Saved ${ago}` : 'Saved'}
    </span>
  )
}

export function ViewLiveLink({ href, children = 'View live' }) {
  return (
    <Button asChild variant="ghost" size="sm" className="hidden text-muted-foreground sm:inline-flex">
      <Link href={href} target="_blank">
        {children}
        <ArrowUpRight className="size-3.5" />
      </Link>
    </Button>
  )
}

export function MoreMenu({ label = 'More actions', children }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="ghost" size="icon-sm" aria-label={label} className="text-muted-foreground">
          <Ellipsis className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 border-border bg-surface-subtle">
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function DangerMenuItem({ className, ...props }) {
  return <DropdownMenuItem variant="destructive" className={cn('cursor-pointer text-red-600 focus:bg-red-500/10 dark:text-red-400', className)} {...props} />
}

export function DocumentCanvas({ children }) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
      <div className="mx-auto flex w-full max-w-[720px] flex-col px-5 pb-20 pt-9 sm:px-8">{children}</div>
    </div>
  )
}

export function DocumentEyebrow({ children }) {
  return <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">{children}</p>
}

// Auto-growing title field styled as the document heading; Enter never inserts a newline.
export function DocumentTitle({ value, onChange, className, ...props }) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return
    element.style.height = '0px'
    element.style.height = `${element.scrollHeight}px`
  }, [value])

  return (
    <textarea
      ref={ref}
      rows={1}
      value={value}
      onChange={(event) => onChange(event.target.value.replace(/\n/g, ' '))}
      onKeyDown={(event) => event.key === 'Enter' && event.preventDefault()}
      className={cn(
        'mt-2.5 w-full resize-none overflow-hidden bg-transparent text-[30px] font-semibold leading-[1.2] tracking-[-0.02em] text-foreground outline-none placeholder:text-text-tertiary',
        className,
      )}
      {...props}
    />
  )
}

// Public URL line under the title; Edit swaps the slug into a field. The hidden input always submits the slug.
export function SlugLine({ prefix, slug, onChange, name, placeholder = 'auto-from-title', locked = false }) {
  const [editing, setEditing] = useState(false)

  return (
    <div className="mt-3 flex min-h-6 min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
      <Link2 className="size-3.5 shrink-0" />
      {name ? <input type="hidden" name={name} value={slug} /> : null}
      {editing ? (
        <span className="flex min-w-0 flex-1 items-center font-mono">
          <span className="shrink-0">{prefix}</span>
          <input
            autoFocus
            value={slug}
            onChange={(event) => onChange(event.target.value)}
            onBlur={() => setEditing(false)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === 'Escape') {
                event.preventDefault()
                setEditing(false)
              }
            }}
            placeholder={placeholder}
            aria-label="Slug"
            className="min-w-0 flex-1 rounded border border-border bg-surface-card px-1.5 py-0.5 text-foreground outline-none focus:border-border-strong"
          />
        </span>
      ) : (
        <span className="min-w-0 truncate font-mono">
          {prefix}
          <span className={slug ? 'text-foreground' : 'text-text-tertiary'}>{slug || placeholder}</span>
        </span>
      )}
      {!editing && !locked ? (
        <Button type="button" variant="ghost" size="xs" onClick={() => setEditing(true)} className="text-muted-foreground">
          Edit
        </Button>
      ) : null}
    </div>
  )
}

export function Req() {
  return <span className="text-red-600 dark:text-red-400"> *</span>
}

// Label row with a right-aligned counter, for fields that show their length.
export function CountedLabel({ label, required, count, limit }) {
  const over = limit && count > limit
  return (
    <div className="flex items-baseline justify-between gap-3 text-xs">
      <span className="text-sm font-medium text-muted-foreground">
        {label}
        {required ? <Req /> : null}
      </span>
      <span
        className={cn(
          'tabular-nums',
          !limit ? 'text-text-secondary' : over ? 'text-amber-600 dark:text-amber-400' : count ? 'text-emerald-600 dark:text-emerald-400' : 'text-text-secondary',
        )}
      >
        {limit ? `${count} / ${limit}` : `${count} characters`}
      </span>
    </div>
  )
}

export function InspectorPane({ tabs, value, onChange, open, onClose, children }) {
  return (
    <>
      {open ? <PaneBackdrop onClose={onClose} className="xl:hidden" /> : null}
      <aside
        className={cn(
          'w-[320px] max-w-[calc(100vw-3.5rem)] shrink-0 flex-col border-l border-sidebar-border bg-surface-subtle',
          open ? 'fixed bottom-0 right-0 top-[var(--geiger-banner-h,0px)] z-30 flex shadow-2xl xl:static xl:z-auto xl:shadow-none' : 'hidden xl:flex',
        )}
      >
        <div className={cn(PANE_HEADER, 'gap-2 px-3')}>
          <SegmentedTabs fullWidth tabs={tabs} value={value} onChange={onChange} buttonClassName="h-7 text-xs" />
          {open ? (
            <Button type="button" variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close settings" className="shrink-0 text-muted-foreground xl:hidden">
              <X className="size-4" />
            </Button>
          ) : null}
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
      </aside>
    </>
  )
}

// Inactive inspector tabs stay mounted (just hidden) so their form fields still submit; the Media tab mounts on demand.
export function InspectorPanel({ active, className, children }) {
  return <div className={cn(active ? 'flex flex-col' : 'hidden', className)}>{children}</div>
}

export function InspectorSection({ title, aside, className, children }) {
  return (
    <section className={cn('flex flex-col gap-3.5 border-b border-sidebar-border p-4 last:border-b-0', className)}>
      {title ? (
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{title}</h3>
          {aside ? <span className="text-xs text-text-secondary">{aside}</span> : null}
        </div>
      ) : null}
      {children}
    </section>
  )
}

export function SwitchRow({ title, description, checked, onCheckedChange, disabled }) {
  const id = useId()
  return (
    <div className="flex items-center gap-3">
      <label htmlFor={id} className="min-w-0 flex-1 cursor-pointer">
        <span className="block text-[13px] font-medium text-foreground">{title}</span>
        {description ? <span className="block text-xs text-muted-foreground">{description}</span> : null}
      </label>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
    </div>
  )
}

// Editor form keys: ⌘/Ctrl+S saves; Enter in a single-line field doesn't submit, since saving is an explicit top-bar action.
export function handleEditorKeys(event) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
    event.preventDefault()
    event.currentTarget.requestSubmit()
    return
  }
  if (event.key !== 'Enter') return
  const target = event.target
  if (target instanceof HTMLInputElement && !['submit', 'button', 'checkbox', 'radio'].includes(target.type)) {
    event.preventDefault()
  }
}

// Warn before leaving the page with unsaved edits.
export function useUnsavedGuard(dirty) {
  useEffect(() => {
    if (!dirty) return undefined
    const warn = (event) => event.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])
}
