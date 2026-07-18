'use client'

import Link from 'next/link'
import {
  ArrowRight,
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
import { Card } from '@/components/ui/card'
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

const nf = new Intl.NumberFormat('en-US')

const zeroSeries = [
  { label: 'W1', value: 0 },
  { label: 'W2', value: 0 },
  { label: 'W3', value: 0 },
  { label: 'W4', value: 0 },
]

// Each summary card: label, icon, the purchased allowance, current usage, and a
// suffix/format. Only projects has a real "used" today; the rest await metering.
function buildMetrics(usage) {
  const a = usage.allowances
  const used = usage.used || {}
  return [
    { key: 'projects', label: 'Active projects', icon: FolderKanban, allowance: a.projects, used: used.projects || 0, suffix: '' },
    { key: 'seats', label: 'Collaborators', icon: Users, allowance: a.seats, used: used.seats || 0, suffix: '' },
    { key: 'storage', label: 'Storage', icon: HardDrive, allowance: a.storage, used: used.storage || 0, suffix: 'GB' },
    { key: 'bandwidth', label: 'Bandwidth', icon: Radio, allowance: a.bandwidth, used: used.bandwidth || 0, suffix: 'GB' },
    { key: 'edgeData', label: 'Edge / CDN', icon: RadioTower, allowance: a.edgeData, used: used.edgeData || 0, suffix: 'GB' },
    { key: 'aiCredits', label: 'AI credits', icon: Sparkles, allowance: a.aiCredits, used: used.aiCredits || 0, suffix: '' },
    { key: 'emails', label: 'Email purse', icon: Mail, allowance: a.emails, used: used.emails || 0, suffix: 'emails' },
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
    price: `$${p.price ?? catRate.get(p.category) ?? 0}/mo`,
    owned: ownedIds.includes(p.id),
  }))
  const scaleItems = [
    { id: 'projects', name: 'Extra active projects', detail: 'Run more projects in parallel', price: `$${PROJECT_RATE} each` },
    { id: 'seats', name: 'Extra collaborators', detail: 'Add more teammates', price: `$${COLLABORATOR_RATE} each` },
    { id: 'storage', name: 'Extra storage', detail: 'More room for your files', price: `$${STORAGE_RATE}/GB` },
    { id: 'bandwidth', name: 'Extra bandwidth', detail: 'Serve more traffic', price: `$${BANDWIDTH_RATE}/GB` },
    { id: 'edgeData', name: 'Edge / CDN serving', detail: 'Global delivery across 119 PoPs', price: `$${EDGE_DATA_RATE}/GB` },
    { id: 'aiCredits', name: 'AI credits', detail: 'Power AI features', price: `$${AI_RATE_PER_1000}/1,000` },
    { id: 'emails', name: 'Monthly emails', detail: 'Global email purse for your org', price: `$${EMAIL_RATE_PER_1000}/1,000` },
  ]
  return { productItems, scaleItems }
}

export function UsageScreen({ usage }) {
  const metrics = buildMetrics(usage)
  const ownedIds = (usage.ownedProducts || []).map((p) => p.id)
  const { productItems, scaleItems } = purchasableItems(ownedIds)

  return (
    <div className="flex flex-col gap-8 text-foreground">
      {/* Header */}
      <div className="flex w-full flex-col gap-4 border-b border-border pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">Usage</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {usage.organizationName} · what you&apos;re using against the allowance you&apos;ve purchased
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground lg:justify-end">
          {usage.hasSubscription ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-subtle px-3 py-1 font-medium text-foreground">
              {usage.planName} plan
              {usage.isTrial ? <span className="text-emerald-400">· Trial</span> : null}
              {usage.billingInterval ? <span className="text-muted-foreground">· {usage.billingInterval}ly</span> : null}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-subtle px-3 py-1 font-medium text-muted-foreground">
              No active plan
            </span>
          )}
        </div>
      </div>

      {/* No plan → prompt to buy */}
      {!usage.hasSubscription ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-surface-subtle px-8 py-12 text-center">
          <div className="flex size-12 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground">
            <HardDrive className="size-6" />
          </div>
          <h2 className="text-lg font-semibold tracking-tight">No allowance purchased yet</h2>
          <p className="max-w-md text-sm text-muted-foreground">
            This organization doesn&apos;t have an active plan. Pick a plan and add the products and
            capacity you need — your usage will show up here.
          </p>
          <Link
            href="/pricing"
            className="mt-2 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            View pricing
            <ArrowRight className="size-4" />
          </Link>
        </div>
      ) : null}

      {/* Allowance summary */}
      {usage.hasSubscription ? (
        <div className="space-y-3">
          <div>
            <h3 className="text-xl font-medium text-foreground">Allowance summary</h3>
            <p className="mt-1 max-w-3xl text-[13px] text-muted-foreground">
              Total usage across this organization against the capacity you&apos;ve purchased.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {metrics.map((m) => {
              const Icon = m.icon
              const percentage = pct(m.used, m.allowance)
              return (
                <Card key={m.key} className="flex flex-col gap-3 rounded-lg border-border bg-surface-subtle p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground">
                      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                      {m.label}
                    </div>
                    <span className="text-xs text-muted-foreground">{percentage}%</span>
                  </div>

                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-semibold leading-none text-foreground">
                      {fmt(m.used, m.suffix)}
                    </span>
                    <span className="text-xs leading-none text-muted-foreground">
                      of {fmt(m.allowance, m.suffix)}
                    </span>
                  </div>

                  <div className="h-1.5 w-full overflow-hidden rounded-full border border-border bg-surface-hover">
                    <div className="h-full bg-primary" style={{ width: `${percentage}%` }} />
                  </div>
                </Card>
              )
            })}
          </div>

          <p className="flex items-start gap-2 rounded-lg border border-border bg-surface-subtle p-3 text-[11px] leading-5 text-muted-foreground">
            <Info className="mt-0.5 size-3.5 shrink-0" />
            The email purse is a single, global balance for your whole organization — any Geiger product
            that sends email draws from it. Usage metering rolls out soon; figures other than projects read 0 for now.
          </p>
        </div>
      ) : null}

      {/* Activity charts (mirrors the Geiger Flow usage screen) */}
      {usage.hasSubscription ? (
        <>
          <div className="w-full border-b border-border" />
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium text-foreground">Activity</h3>
              <p className="mt-1 text-[13px] text-muted-foreground">Consumption trend across this billing period.</p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <div className="mb-2 flex items-center justify-between border-b border-border pb-2">
                  <div className="text-[13px] font-medium text-foreground">Storage used</div>
                  <div className="text-[13px] font-medium text-foreground">
                    0 GB <span className="font-normal text-muted-foreground">/ {nf.format(usage.allowances.storage)} GB</span>
                  </div>
                </div>
                <div className="mb-3 text-[13px] font-medium text-primary">No usage data</div>
                <div className="h-[120px] w-full">
                  <ChartContainer config={{ value: { label: 'Storage', color: 'var(--chart-2)' } }} className="h-full w-full">
                    <BarChart data={zeroSeries}>
                      <Bar dataKey="value" fill="var(--color-value)" radius={[2, 2, 0, 0]} />
                      <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                    </BarChart>
                  </ChartContainer>
                </div>
              </div>

              <div className="space-y-4">
                <div className="mb-2 flex items-center justify-between border-b border-border pb-2">
                  <div className="text-[13px] font-medium text-foreground">Emails sent</div>
                  <div className="text-[13px] font-medium text-foreground">
                    0 <span className="font-normal text-muted-foreground">/ {nf.format(usage.allowances.emails)}</span>
                  </div>
                </div>
                <div className="mb-3 text-[13px] font-medium text-primary">No usage data</div>
                <div className="h-[120px] w-full">
                  <ChartContainer config={{ value: { label: 'Emails', color: 'var(--chart-2)' } }} className="h-full w-full">
                    <BarChart data={zeroSeries}>
                      <Bar dataKey="value" fill="var(--color-value)" fillOpacity={0.15} radius={[2, 2, 0, 0]} />
                      <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                    </BarChart>
                  </ChartContainer>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}

      {/* What you can add — showcase of everything purchasable on /pricing */}
      <div className="w-full border-b border-border" />
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-xl font-medium text-foreground">What you can add</h3>
            <p className="mt-1 max-w-3xl text-[13px] text-muted-foreground">
              Everything available on the pricing screen. Add products or capacity and it&apos;ll be reflected here.
            </p>
          </div>
          <Link
            href="/pricing"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-border bg-surface-subtle px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-surface-hover"
          >
            Go to pricing
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div>
          <p className="mb-3 text-[13px] font-medium text-muted-foreground">Products</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {productItems.map((p) => (
              <div
                key={p.id}
                className="flex items-start justify-between gap-3 rounded-lg border border-border bg-surface-subtle p-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-foreground">{p.name}</p>
                    {p.owned ? (
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                        Owned
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{p.detail}</p>
                </div>
                <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                  {p.price}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 text-[13px] font-medium text-muted-foreground">Scale &amp; capacity</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {scaleItems.map((s) => (
              <div
                key={s.id}
                className="flex items-start justify-between gap-3 rounded-lg border border-border bg-surface-subtle p-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{s.name}</p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{s.detail}</p>
                </div>
                <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                  {s.price}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
