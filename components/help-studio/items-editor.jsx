'use client'

import { Plus, Trash2 } from 'lucide-react'
import { Button, IconPicker, Input, Label } from '@geiger/ui'
import { inputClassName } from '@/components/content-studio/shared'

// Card / feature / link rows a section renders under its content. `fields` drives the columns.
export const ITEM_KINDS = {
  cards: {
    label: 'Cards',
    hint: 'Large linked tiles, three per row',
    fields: [
      { key: 'title', placeholder: 'Title' },
      { key: 'body', placeholder: 'One-line description' },
      { key: 'href', placeholder: '/pricing or https://...' },
    ],
  },
  features: {
    label: 'Features',
    hint: 'Icon + short line, two per row',
    fields: [{ key: 'text', placeholder: 'Feature text' }],
  },
  links: {
    label: 'Links',
    hint: 'Compact link buttons, three per row',
    fields: [
      { key: 'label', placeholder: 'Label' },
      { key: 'href', placeholder: '/help/... or https://...' },
    ],
  },
}

export function ItemsEditor({ kind, items, onChange }) {
  const config = ITEM_KINDS[kind]
  const update = (index, patch) => onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  const add = () => onChange([...items, Object.fromEntries([['icon', ''], ...config.fields.map((field) => [field.key, ''])])])
  const remove = (index) => onChange(items.filter((_, i) => i !== index))

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <div>
          <Label className="text-sm font-medium text-foreground">{config.label}</Label>
          <p className="text-xs text-muted-foreground">{config.hint}</p>
        </div>
        <Button type="button" size="sm" variant="outline" onClick={add}>
          <Plus className="size-3.5" />
          Add
        </Button>
      </div>
      {items.map((item, index) => (
        <div key={index} className="flex min-w-0 flex-wrap items-center gap-2 rounded-md border border-border bg-background/60 p-2">
          <IconPicker
            value={item.icon}
            onValueChange={(icon) => update(index, { icon })}
            placeholder="Icon"
            className="w-36 shrink-0"
          />
          {config.fields.map((field) => (
            <Input
              key={field.key}
              value={item[field.key] || ''}
              onChange={(event) => update(index, { [field.key]: event.target.value })}
              placeholder={field.placeholder}
              aria-label={field.placeholder}
              className={`${inputClassName} h-9 min-w-[140px] flex-1`}
            />
          ))}
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            onClick={() => remove(index)}
            aria-label={`Remove ${config.label.toLowerCase()} row`}
            className="text-muted-foreground hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      ))}
    </div>
  )
}
