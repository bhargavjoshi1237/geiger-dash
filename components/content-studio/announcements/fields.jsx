'use client'

// Small inspector controls for the announcement editor: multi-select chips and a labelled select.

import { Field, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, cn } from '@geiger/ui'

export function ChipGroup({ options, value = [], onChange, ariaLabel }) {
  const toggle = (option) =>
    onChange(value.includes(option) ? value.filter((item) => item !== option) : [...value, option])

  return (
    <div role="group" aria-label={ariaLabel} className="flex flex-wrap gap-1.5">
      {options.map((option) => {
        const active = value.includes(option.value)
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => toggle(option.value)}
            className={cn(
              'h-7 rounded-md border px-2.5 text-xs font-medium transition-colors',
              active
                ? 'border-border-strong bg-surface-active text-foreground'
                : 'border-border bg-surface-card text-muted-foreground hover:bg-surface-hover hover:text-foreground',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

export function OptionSelect({ label, hint, value, onChange, options, className }) {
  return (
    <Field label={label} hint={hint} className={cn('gap-1.5', className)}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  )
}

// Label + muted helper line used above chip groups, where Field's single-control layout doesn't fit.
export function GroupLabel({ title, hint }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[13px] font-medium text-foreground">{title}</span>
      {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
    </div>
  )
}
