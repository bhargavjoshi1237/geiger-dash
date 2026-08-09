'use client'

import {
  FolderKanban,
  HardDrive,
  Info,
  Mail,
  Radio,
  RadioTower,
  Sparkles,
  Users,
} from 'lucide-react'
import { BarChart, Bar } from 'recharts'
import { Card, Section } from '@/components/account/panel'
import { FAMILY_TINT } from '@/components/billing/product-access'
import { Badge } from '@/components/ui/badge'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  products as PRODUCT_CATALOG,
  productCategories,
  PROJECT_RATE,
  COLLABORATOR_RATE,
  STORAGE_RATE,
  BANDWIDTH_RATE,
  EDGE_DATA_RATE,
  AI_RATE_PER_1000,
  EMAIL_RATE_PER_1000,
} from '@/lib/pricing/plans'
import { FallbackProductIcon, PRODUCT_ICONS } from '@/lib/pricing/product-icons'
import { cn } from '@/lib/utils'

const nf = new Intl.NumberFormat('en-US')

const zeroSeries = [
  { label: 'W1', value: 0 },
  { label: 'W2', value: 0 },
  { label: 'W3', value: 0 },
  { label: 'W4', value: 0 },
]

// One icon per metric, reused by the matching "scale & capacity" row so a
// number and the thing you buy to raise it always look the same.
const METRIC_ICONS = {
  projects: FolderKanban,
  seats: Users,
  storage: HardDrive,
  bandwidth: Radio,
  edgeData: RadioTower,
  aiCredits: Sparkles,
  emails: Mail,
}

// Each summary card: label, the purchased allowance, current usage, and a
// suffix/format. Only projects has a real "used" today; the rest await metering.
function buildMetrics(usage) {
  const a = usage.allowances
  const used = usage.used || {}
  return [
    { key: 'projects', label: 'Active Projects', allowance: a.projects, used: used.projects || 0, suffix: '' },
    { key: 'seats', label: 'Collaborators', allowance: a.seats, used: used.seats || 0, suffix: '' },
    { key: 'storage', label: 'Storage', allowance: a.storage, used: used.storage || 0, suffix: 'GB' },
    { key: 'bandwidth', label: 'Bandwidth', allowance: a.bandwidth, used: used.bandwidth || 0, suffix: 'GB' },
    { key: 'edgeData', label: 'Edge / CDN', allowance: a.edgeData, used: used.edgeData || 0, suffix: 'GB' },
    { key: 'aiCredits', label: 'AI Credits', allowance: a.aiCredits, used: used.aiCredits || 0, suffix: '' },
    { key: 'emails', label: 'Email Purse', allowance: a.emails, used: used.emails || 0, suffix: 'emails' },
  ]
}

function fmt(value, suffix) {
  return `${nf.format(value)}${suffix ? ` ${suffix}` : ''}`
}

function pct(used, allowance) {
  if (!allowance || allowance <= 0) return 0
  return Math.min(100, Math.round((used / allowance) * 100))
}

// Everything purchasable on the pricing screen, so the usage page doubles as a
// catalog. Products carry their price (override or category rate); scale metrics
// carry their per-unit rate.
function purchasableItems(ownedIds) {
  const catRate = new Map(productCategories.map((c) => [c.id, c.rate]))
  const productItems = PRODUCT_CATALOG.filter((p) => !p.comingSoon).map((p) => ({
    id: p.id,
    name: p.name,
    detail: p.detail,
    category: p.category,
    price: `$${p.price ?? catRate.get(p.category) ?? 0}/mo`,
    owned: ownedIds.includes(p.id),
  }))
  const scaleItems = [
    { id: 'projects', name: 'Extra Active Projects', detail: 'Run more projects in parallel', price: `$${PROJECT_RATE} each` },
    { id: 'seats', name: 'Extra Collaborators', detail: 'Add more teammates', price: `$${COLLABORATOR_RATE} each` },
    { id: 'storage', name: 'Extra Storage', detail: 'More room for your files', price: `$${STORAGE_RATE}/GB` },
    { id: 'bandwidth', name: 'Extra Bandwidth', detail: 'Serve more traffic', price: `$${BANDWIDTH_RATE}/GB` },
    { id: 'edgeData', name: 'Edge / CDN Serving', detail: 'Global delivery across 119 PoPs', price: `$${EDGE_DATA_RATE}/GB` },
    { id: 'aiCredits', name: 'AI Credits', detail: 'Power AI features', price: `$${AI_RATE_PER_1000}/1,000` },
    { id: 'emails', name: 'Monthly Emails', detail: 'Global email purse for your org', price: `$${EMAIL_RATE_PER_1000}/1,000` },
  ]
  return { productItems, scaleItems }
}

function MetricTile({ metric }) {
  const Icon = METRIC_ICONS[metric.key] || FallbackProductIcon
  const percentage = pct(metric.used, metric.allowance)

  return (
    <div className="rounded-xl border border-border bg-surface-card p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="flex min-w-0 items-center gap-2 text-xs font-medium text-text-secondary">
          <Icon className="size-3.5 shrink-0 text-muted-foreground" />
          <span className="truncate">{metric.label}</span>
        </span>
        <span className="shrink-0 text-xs tabular-nums text-text-tertiary">{percentage}%</span>
      </div>

      <p className="mt-3 flex flex-wrap items-baseline gap-1.5">
        <span className="text-2xl font-semibold tabular-nums leading-none tracking-tight text-foreground">
          {fmt(metric.used, metric.suffix)}
        </span>
        <span className="text-xs text-muted-foreground">of {fmt(metric.allowance, metric.suffix)}</span>
      </p>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-strong">
        <div className="h-full rounded-full bg-primary" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}

// One row shape for both catalogs: tinted icon, name, detail, price.
function CatalogTile({ icon: Icon, tint, name, detail, price, owned }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-subtle p-3">
      <span
        className={cn(
          'flex size-9 shrink-0 items-center justify-center rounded-lg border',
          tint || 'border-border bg-surface-card text-muted-foreground',
        )}
      >
        <Icon className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="truncate text-sm font-medium text-foreground">{name}</span>
          {owned ? (
            <Badge variant="success" className="shrink-0 px-1.5 py-0 text-[10px]">
              Owned
            </Badge>
          ) : null}
        </span>
        <span className="mt-0.5 block truncate text-xs text-muted-foreground">{detail}</span>
      </span>
      <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-[11px] font-medium tabular-nums text-muted-foreground">
        {price}
      </span>
    </div>
  )
}

function ActivityChart({ title, used, allowance, suffix, faded }) {
  return (
    <div className="p-5">
      <div className="flex items-center justify-between gap-3 border-b border-border pb-2">
        <span className="text-sm font-medium text-foreground">{title}</span>
        <span className="text-sm font-medium tabular-nums text-foreground">
          {fmt(used, suffix)}{' '}
          <span className="font-normal text-muted-foreground">/ {fmt(allowance, suffix)}</span>
        </span>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">No usage data yet</p>
      <div className="mt-2 h-[120px] w-full">
        <ChartContainer
          config={{ value: { label: title, color: 'var(--chart-2)' } }}
          className="h-full w-full"
        >
          <BarChart data={zeroSeries}>
            <Bar
              dataKey="value"
              fill="var(--color-value)"
              fillOpacity={faded ? 0.15 : 1}
              radius={[2, 2, 0, 0]}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  )
}

export function UsageScreen({ usage }) {
  const metrics = buildMetrics(usage)
  const ownedIds = (usage.ownedProducts || []).map((p) => p.id)
  const { productItems, scaleItems } = purchasableItems(ownedIds)

  return (
    <div className="mt-8 flex flex-col gap-8">
      {usage.hasSubscription ? (
        <>
          <Section title="Allowance">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {metrics.map((metric) => (
                <MetricTile key={metric.key} metric={metric} />
              ))}
            </div>
            <p className="mt-3 flex items-start gap-2 rounded-xl border border-border bg-surface-subtle px-4 py-3 text-xs leading-5 text-muted-foreground">
              <Info className="mt-0.5 size-3.5 shrink-0" />
              The email purse is a single, global balance for your whole organization — any Geiger
              product that sends email draws from it. Usage metering rolls out soon; figures other
              than projects read 0 for now.
            </p>
          </Section>
        </>
      ) : (
        <Card className="flex flex-col items-center px-5 py-12 text-center">
          <h2 className="text-base font-semibold">No Allowance Purchased Yet</h2>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            This organization doesn&apos;t have an active plan. Pick one, add the products and
            capacity you need, and your usage shows up here.
          </p>
        </Card>
      )}

      <Section title="Products">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {productItems.map((product) => (
            <CatalogTile
              key={product.id}
              icon={PRODUCT_ICONS[product.id] || FallbackProductIcon}
              tint={product.owned ? FAMILY_TINT[product.category] : null}
              name={product.name}
              detail={product.detail}
              price={product.price}
              owned={product.owned}
            />
          ))}
        </div>
      </Section>

      <Section title="Scale & Capacity">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {scaleItems.map((item) => (
            <CatalogTile
              key={item.id}
              icon={METRIC_ICONS[item.id] || FallbackProductIcon}
              name={item.name}
              detail={item.detail}
              price={item.price}
            />
          ))}
        </div>
      </Section>
    </div>
  )
}
