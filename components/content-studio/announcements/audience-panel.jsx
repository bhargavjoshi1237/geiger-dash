'use client'

// Audience tab: plan, plan status, products, org roles, account age, and picked organizations/people.

import { useEffect, useState } from 'react'
import { Building2, Loader2, Search, User, X } from 'lucide-react'
import { Input } from '@geiger/ui'
import { InspectorSection } from '@/components/content-studio/editor-kit'
import { searchAnnouncementAudienceAction } from '@/lib/announcements/actions'
import {
  ANNOUNCEMENT_ACCOUNT_MODES,
  ANNOUNCEMENT_PLANS,
  ANNOUNCEMENT_PLAN_STATES,
  ANNOUNCEMENT_PRODUCTS,
  ANNOUNCEMENT_ROLES,
} from '@/lib/announcements/constants'
import { ChipGroup, GroupLabel, OptionSelect } from './fields'

function EntityPicker({ kind, ids, labels, onChange, placeholder }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  // Debounced lookup; a stale response is dropped when the query moves on.
  useEffect(() => {
    const q = query.trim()
    if (q.length < 2) return undefined
    let alive = true
    const timer = window.setTimeout(async () => {
      setLoading(true)
      const result = await searchAnnouncementAudienceAction(q)
      if (!alive) return
      setResults((result.results || []).filter((row) => row.kind === kind && !ids.includes(row.id)))
      setLoading(false)
    }, 250)
    return () => {
      alive = false
      window.clearTimeout(timer)
    }
  }, [query, kind, ids])

  const Icon = kind === 'org' ? Building2 : User
  const add = (row) => {
    onChange([...ids, row.id], { ...labels, [row.id]: row.detail ? `${row.label} · ${row.detail}` : row.label })
    setQuery('')
    setResults([])
  }
  const remove = (id) => {
    const nextLabels = { ...labels }
    delete nextLabels[id]
    onChange(ids.filter((item) => item !== id), nextLabels)
  }
  const showResults = query.trim().length >= 2

  return (
    <div className="flex flex-col gap-2">
      {ids.length ? (
        <div className="flex flex-col gap-1">
          {ids.map((id) => (
            <span key={id} className="flex min-w-0 items-center gap-2 rounded-md border border-border bg-surface-card py-1 pl-2 pr-1 text-xs">
              <Icon className="size-3.5 shrink-0 text-muted-foreground" />
              <span className="min-w-0 flex-1 truncate text-foreground">{labels[id] || id}</span>
              <button type="button" onClick={() => remove(id)} aria-label="Remove" className="rounded p-0.5 text-text-secondary hover:bg-surface-active hover:text-foreground">
                <X className="size-3.5" />
              </button>
            </span>
          ))}
        </div>
      ) : null}
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={placeholder} className="h-8 pl-8 text-xs" />
        {loading && showResults ? <Loader2 className="absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 animate-spin text-muted-foreground" /> : null}
      </div>
      {showResults && !loading ? (
        <div className="flex flex-col gap-0.5 rounded-md border border-border bg-surface-card p-1">
          {results.length ? (
            results.map((row) => (
              <button
                key={row.id}
                type="button"
                onClick={() => add(row)}
                className="flex min-w-0 flex-col rounded px-2 py-1.5 text-left hover:bg-surface-hover"
              >
                <span className="truncate text-xs font-medium text-foreground">{row.label}</span>
                {row.detail ? <span className="truncate text-[11px] text-muted-foreground">{row.detail}</span> : null}
              </button>
            ))
          ) : (
            <span className="px-2 py-1.5 text-xs text-muted-foreground">No matches.</span>
          )}
        </div>
      ) : null}
    </div>
  )
}

export function audienceSummary(audience) {
  const rules = [
    audience.plans.length,
    audience.planStates.length,
    audience.products.length,
    audience.roles.length,
    audience.orgIds.length,
    audience.userIds.length,
    audience.account.mode !== 'any',
  ].filter(Boolean).length
  if (!rules && !audience.excludeUserIds.length) return 'Everyone who is signed in'
  return `${rules} ${rules === 1 ? 'rule' : 'rules'}${audience.excludeUserIds.length ? ` · ${audience.excludeUserIds.length} excluded` : ''}`
}

export function AudiencePanel({ audience, onChange }) {
  const set = (key) => (value) => onChange({ ...audience, [key]: value })
  const setPicked = (key) => (ids, labels) => onChange({ ...audience, [key]: ids, labels })

  return (
    <>
      <InspectorSection title="Who sees it" aside={audienceSummary(audience)}>
        <p className="text-xs text-muted-foreground">Signed-in people only. Every rule you fill in must match; leave a rule empty to skip it.</p>
      </InspectorSection>
      <InspectorSection title="Plan">
        <GroupLabel title="Plan" hint="Any of their organizations’ plans, or their own." />
        <ChipGroup ariaLabel="Plans" options={ANNOUNCEMENT_PLANS} value={audience.plans} onChange={set('plans')} />
        <GroupLabel title="Plan status" />
        <ChipGroup ariaLabel="Plan status" options={ANNOUNCEMENT_PLAN_STATES} value={audience.planStates} onChange={set('planStates')} />
      </InspectorSection>
      <InspectorSection title="Products">
        <GroupLabel title="Has unlocked any of" hint="Alpha testers have every product." />
        <ChipGroup ariaLabel="Products" options={ANNOUNCEMENT_PRODUCTS} value={audience.products} onChange={set('products')} />
      </InspectorSection>
      <InspectorSection title="Organization">
        <GroupLabel title="Role in any organization" hint="Owners and organization creators count as Owner." />
        <ChipGroup ariaLabel="Roles" options={ANNOUNCEMENT_ROLES} value={audience.roles} onChange={set('roles')} />
        <GroupLabel title="Members of" />
        <EntityPicker kind="org" ids={audience.orgIds} labels={audience.labels} onChange={setPicked('orgIds')} placeholder="Search organizations…" />
      </InspectorSection>
      <InspectorSection title="Account">
        <OptionSelect
          label="Account age"
          value={audience.account.mode}
          onChange={(mode) => set('account')({ ...audience.account, mode })}
          options={ANNOUNCEMENT_ACCOUNT_MODES}
        />
        {audience.account.mode !== 'any' ? (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={1}
              max={3650}
              value={audience.account.days}
              onChange={(event) => set('account')({ ...audience.account, days: event.target.value })}
              className="w-24"
              aria-label="Days"
            />
            <span className="text-sm text-muted-foreground">days</span>
          </div>
        ) : null}
      </InspectorSection>
      <InspectorSection title="People">
        <GroupLabel title="Only these people" />
        <EntityPicker kind="user" ids={audience.userIds} labels={audience.labels} onChange={setPicked('userIds')} placeholder="Search by name or email…" />
        <GroupLabel title="Never show to" />
        <EntityPicker kind="user" ids={audience.excludeUserIds} labels={audience.labels} onChange={setPicked('excludeUserIds')} placeholder="Search by name or email…" />
      </InspectorSection>
    </>
  )
}
