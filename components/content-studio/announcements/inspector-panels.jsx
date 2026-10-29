'use client'

// Setup, Design and Stats inspector tabs for the announcement editor.

import { useState } from 'react'
import { toast } from 'sonner'
import { RefreshCw } from 'lucide-react'
import { Button, Field, Input, Textarea, cn } from '@geiger/ui'
import { InspectorSection, SwitchRow } from '@/components/content-studio/editor-kit'
import { toDateTimeLocal } from '@/components/content-studio/shared'
import { getAnnouncementStatsAction } from '@/lib/announcements/actions'
import {
  ANNOUNCEMENT_APPS,
  ANNOUNCEMENT_DESIGN_OPTIONS,
  ANNOUNCEMENT_FREQUENCIES,
  ANNOUNCEMENT_STATUSES,
} from '@/lib/announcements/constants'
import { ChipGroup, GroupLabel, OptionSelect } from './fields'

// datetime-local is in the editor's timezone; store an absolute instant so the server doesn't reinterpret it.
const localToIso = (value) => (value ? new Date(value).toISOString() : null)

const linesToList = (value) => value.split('\n').map((line) => line.trim()).filter(Boolean)

// Keeps the raw text while typing (blank lines included) and reports the cleaned list upward.
function RouteList({ label, hint, value, onChange, placeholder }) {
  const [textValue, setTextValue] = useState(value.join('\n'))
  return (
    <Field label={label} hint={hint} className="gap-1.5">
      <Textarea
        rows={3}
        value={textValue}
        onChange={(event) => {
          setTextValue(event.target.value)
          onChange(linesToList(event.target.value))
        }}
        placeholder={placeholder}
        className="min-h-0 font-mono text-xs"
      />
    </Field>
  )
}

export function SetupPanel({ draft, set }) {
  const frequency = draft.frequency
  const setFrequency = (key) => (value) => set('frequency')({ ...frequency, [key]: value })
  const frequencyHint = ANNOUNCEMENT_FREQUENCIES.find((item) => item.value === frequency.mode)?.hint

  return (
    <>
      <InspectorSection title="Publishing">
        <OptionSelect label="Status" value={draft.status} onChange={set('status')} options={ANNOUNCEMENT_STATUSES} />
        <Field label="Priority" hint="When several match, the highest number shows first." className="gap-1.5">
          <Input type="number" min={-100} max={100} value={draft.priority} onChange={(event) => set('priority')(event.target.value)} className="w-24" />
        </Field>
        <Field label="Starts" hint="Empty starts as soon as it’s live." className="gap-1.5">
          <Input type="datetime-local" value={toDateTimeLocal(draft.startsAt)} onChange={(event) => set('startsAt')(localToIso(event.target.value))} />
        </Field>
        <Field label="Ends" hint="Empty runs until you end it." className="gap-1.5">
          <Input type="datetime-local" value={toDateTimeLocal(draft.endsAt)} onChange={(event) => set('endsAt')(localToIso(event.target.value))} />
        </Field>
      </InspectorSection>

      <InspectorSection title="Where" aside={draft.apps.length ? `${draft.apps.length} ${draft.apps.length === 1 ? 'app' : 'apps'}` : 'All apps'}>
        <GroupLabel title="Apps" hint="Leave empty for every app that shows announcements." />
        <ChipGroup ariaLabel="Apps" options={ANNOUNCEMENT_APPS} value={draft.apps} onChange={set('apps')} />
        <RouteList
          label="Only on these screens"
          hint="One path per line. * matches one segment, /** everything below. Empty means every screen."
          value={draft.routes}
          onChange={set('routes')}
          placeholder={'/org/*\n/billing'}
        />
        <RouteList label="Never on these screens" value={draft.excludeRoutes} onChange={set('excludeRoutes')} placeholder="/onboarding/**" />
      </InspectorSection>

      <InspectorSection title="How often">
        <OptionSelect label="Show" hint={frequencyHint} value={frequency.mode} onChange={setFrequency('mode')} options={ANNOUNCEMENT_FREQUENCIES} />
        {frequency.mode === 'times' ? (
          <Field label="Times per person" className="gap-1.5">
            <Input type="number" min={1} max={100} value={frequency.times} onChange={(event) => setFrequency('times')(event.target.value)} className="w-24" />
          </Field>
        ) : null}
        {frequency.mode === 'interval' ? (
          <Field label="Days before it returns" className="gap-1.5">
            <Input type="number" min={1} max={365} value={frequency.days} onChange={(event) => setFrequency('days')(event.target.value)} className="w-24" />
          </Field>
        ) : null}
        <SwitchRow
          title="Stop after the button is clicked"
          description="Once someone clicks the main button, they won’t see it again."
          checked={frequency.stopOnClick}
          onCheckedChange={setFrequency('stopOnClick')}
        />
        <Field label="Delay" hint="Seconds after the page loads before it appears." className="gap-1.5">
          <Input
            type="number"
            min={0}
            max={120}
            value={draft.design.delaySeconds}
            onChange={(event) => set('design')({ ...draft.design, delaySeconds: event.target.value })}
            className="w-24"
          />
        </Field>
      </InspectorSection>
    </>
  )
}

export function DesignPanel({ draft, set }) {
  const design = draft.design
  const setDesign = (key) => (value) => set('design')({ ...design, [key]: value })
  const o = ANNOUNCEMENT_DESIGN_OPTIONS
  const isCorner = draft.format === 'corner'
  const isCarousel = draft.format === 'carousel'

  return (
    <>
      <InspectorSection title="Layout">
        {draft.format !== 'takeover' ? <OptionSelect label="Size" value={design.size} onChange={setDesign('size')} options={o.size} /> : null}
        {isCorner ? <OptionSelect label="Position" value={design.position} onChange={setDesign('position')} options={o.position} /> : null}
        <OptionSelect label="Text alignment" value={design.align} onChange={setDesign('align')} options={o.align} />
      </InspectorSection>
      <InspectorSection title="Image">
        <OptionSelect label="Shape" value={design.imageAspect} onChange={setDesign('imageAspect')} options={o.imageAspect} />
        <OptionSelect label="Fit" hint="Fit keeps the whole image visible." value={design.imageFit} onChange={setDesign('imageFit')} options={o.imageFit} />
        <OptionSelect label="Background" value={design.imageBackground} onChange={setDesign('imageBackground')} options={o.imageBackground} />
      </InspectorSection>
      <InspectorSection title="Style">
        <OptionSelect label="Badge colour" value={design.badgeTone} onChange={setDesign('badgeTone')} options={o.badgeTone} />
        <OptionSelect label="Button style" value={design.primaryStyle} onChange={setDesign('primaryStyle')} options={o.primaryStyle} />
      </InspectorSection>
      <InspectorSection title="Behaviour">
        <SwitchRow title="Can be closed" description="Off hides the close button; the main button is the only way out." checked={design.dismissible} onCheckedChange={setDesign('dismissible')} />
        {!isCorner ? (
          <SwitchRow
            title="Close on outside click"
            description="Clicking the dimmed page closes it."
            checked={design.closeOnOutside}
            disabled={!design.dismissible}
            onCheckedChange={setDesign('closeOnOutside')}
          />
        ) : null}
        {isCarousel ? (
          <>
            <SwitchRow title="Progress dots" description="Shows which slide you’re on." checked={design.showProgress} onCheckedChange={setDesign('showProgress')} />
            <Field label="Auto-advance" hint="Seconds per slide; 0 waits for a click." className="gap-1.5">
              <Input type="number" min={0} max={60} value={design.autoAdvanceSeconds} onChange={(event) => setDesign('autoAdvanceSeconds')(event.target.value)} className="w-24" />
            </Field>
          </>
        ) : null}
      </InspectorSection>
    </>
  )
}

const percent = (part, whole) => (whole ? `${Math.round((part / whole) * 1000) / 10}%` : '—')
const APP_LABEL = Object.fromEntries(ANNOUNCEMENT_APPS.map((app) => [app.value, app.label]))

function Metric({ label, value, hint }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-lg border border-border bg-surface-card p-3">
      <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">{label}</span>
      <span className="text-lg font-semibold tabular-nums text-foreground">{value}</span>
      {hint ? <span className="text-[11px] text-muted-foreground">{hint}</span> : null}
    </div>
  )
}

export function StatsPanel({ announcementId, stats, onStats }) {
  const [refreshing, setRefreshing] = useState(false)

  if (!announcementId) {
    return (
      <InspectorSection title="Stats">
        <p className="text-sm text-muted-foreground">Save the announcement to start collecting views and clicks.</p>
      </InspectorSection>
    )
  }

  const refresh = async () => {
    setRefreshing(true)
    const result = await getAnnouncementStatsAction(announcementId)
    setRefreshing(false)
    if (!result.ok) {
      toast.error(result.error || 'Couldn’t load stats.')
      return
    }
    onStats(result.stats)
  }

  const s = stats || { views: 0, viewers: 0, clicks: 0, clickers: 0, dismissals: 0, byApp: {} }
  const apps = Object.entries(s.byApp || {}).sort((a, b) => b[1].views - a[1].views)

  return (
    <>
      <InspectorSection
        title="Performance"
        aside={
          <Button type="button" variant="ghost" size="icon-xs" onClick={refresh} disabled={refreshing} aria-label="Refresh stats" className="text-muted-foreground">
            <RefreshCw className={cn(refreshing && 'animate-spin')} />
          </Button>
        }
      >
        <div className="grid grid-cols-2 gap-2">
          <Metric label="Reached" value={s.viewers.toLocaleString()} hint={`${s.views.toLocaleString()} views`} />
          <Metric label="Clicked" value={s.clickers.toLocaleString()} hint={`${s.clicks.toLocaleString()} clicks`} />
          <Metric label="Click rate" value={percent(s.clickers, s.viewers)} hint="People who clicked / reached" />
          <Metric label="Dismissed" value={s.dismissals.toLocaleString()} hint={`${percent(s.dismissals, s.views)} of views`} />
        </div>
      </InspectorSection>
      <InspectorSection title="By app">
        {apps.length ? (
          <div className="flex flex-col divide-y divide-border rounded-lg border border-border">
            {apps.map(([app, row]) => (
              <div key={app} className="flex items-center gap-3 px-3 py-2 text-xs">
                <span className="min-w-0 flex-1 truncate font-medium text-foreground">{APP_LABEL[app] || app}</span>
                <span className="tabular-nums text-muted-foreground">{row.viewers} reached</span>
                <span className="w-12 text-right tabular-nums text-foreground">{percent(row.clickers, row.viewers)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No views yet.</p>
        )}
      </InspectorSection>
    </>
  )
}
