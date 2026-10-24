'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Button, IconPicker, Input, LucideIcon, cn } from '@geiger/ui'

// Feature / link / card rows a section renders under its content. `fields` drives the inputs.
export const ITEM_KINDS = {
  features: {
    label: 'Features',
    hint: 'Icon and a short line, two per row',
    empty: 'Feature text',
    fields: [{ key: 'text', placeholder: 'Feature text' }],
    summary: (item) => item.text,
  },
  links: {
    label: 'Links',
    hint: 'Compact link buttons, three per row',
    empty: 'Link label',
    fields: [
      { key: 'label', placeholder: 'Label' },
      { key: 'href', placeholder: '/help/… or https://…', mono: true },
    ],
    summary: (item) => item.label,
    detail: (item) => item.href,
  },
  cards: {
    label: 'Cards',
    hint: 'Large linked tiles, three per row',
    empty: 'Card title',
    fields: [
      { key: 'title', placeholder: 'Title' },
      { key: 'body', placeholder: 'One-line description' },
      { key: 'href', placeholder: '/pricing or https://…', mono: true },
    ],
    summary: (item) => item.title,
    detail: (item) => item.href,
  },
}

// Compact inspector list: each row shows its icon and text, and opens in place to edit.
export function ItemsEditor({ kind, items, onChange, className }) {
  const config = ITEM_KINDS[kind]
  const [openIndex, setOpenIndex] = useState(null)

  const update = (index, patch) => onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  const add = () => {
    onChange([...items, Object.fromEntries([['icon', ''], ...config.fields.map((field) => [field.key, ''])])])
    setOpenIndex(items.length)
  }
  const remove = (index) => {
    onChange(items.filter((_, i) => i !== index))
    setOpenIndex(null)
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-col">
          <span className="text-[13px] font-medium text-foreground">
            {config.label} <span className="font-normal tabular-nums text-text-secondary">{items.length}</span>
          </span>
          <span className="text-xs text-muted-foreground">{config.hint}</span>
        </div>
        <Button type="button" variant="outline" size="xs" onClick={add}>
          <Plus />
          Add
        </Button>
      </div>

      {items.map((item, index) => {
        const open = openIndex === index
        const showIcon = kind !== 'links' || item.icon
        const detail = config.detail?.(item)
        return (
          <div key={index} className={cn('rounded-lg border bg-background', open ? 'border-border-strong' : 'border-border')}>
            <div className="flex items-center gap-2 py-1.5 pl-2 pr-1.5">
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : index)}
                aria-expanded={open}
                className="flex min-w-0 flex-1 items-center gap-2 text-left"
              >
                {showIcon ? (
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-md border border-border bg-surface-card">
                    <LucideIcon name={item.icon} className="size-3.5 text-muted-foreground" />
                  </span>
                ) : null}
                <span className="flex min-w-0 flex-col">
                  <span className={cn('truncate text-[13px]', config.summary(item) ? 'text-foreground' : 'text-text-tertiary')}>
                    {config.summary(item) || config.empty}
                  </span>
                  {detail ? <span className="truncate font-mono text-[11px] text-muted-foreground">{detail}</span> : null}
                </span>
              </button>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => remove(index)}
                aria-label={`Remove ${config.label.toLowerCase()} row`}
                className="shrink-0 text-text-secondary hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400"
              >
                <X />
              </Button>
            </div>
            {open ? (
              <div className="flex flex-col gap-2 border-t border-border p-2">
                <IconPicker value={item.icon} onValueChange={(icon) => update(index, { icon })} placeholder="Icon" className="h-8" />
                {config.fields.map((field) => (
                  <Input
                    key={field.key}
                    value={item[field.key] || ''}
                    onChange={(event) => update(index, { [field.key]: event.target.value })}
                    placeholder={field.placeholder}
                    aria-label={field.placeholder}
                    className={cn('h-8', field.mono && 'font-mono text-xs')}
                  />
                ))}
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
