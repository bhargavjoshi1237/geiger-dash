"use client";

// Pool overview. Answers, in order: how full are we, where is it going, what is
// in it, who put it there, and is anything broken.

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  Button,
  SectionCard,
  StatsBar,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@geiger/ui";
import {
  RefreshCw,
  HardDrive,
  CircleCheck,
  CircleAlert,
  Infinity as InfinityIcon,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatBytes, usagePercent, formatRelative, PROVIDER_STATUS_MAP } from "@/lib/filestore/utils";
import { reconcileAction } from "@/lib/filestore/actions";

// Fixed assignment order — a provider keeps its colour as others come and go.
const SERIES = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

const growthConfig = {
  total: { label: "Stored", color: "var(--color-chart-1)" },
};

function seriesColor(index) {
  return SERIES[index % SERIES.length];
}

// A ranked horizontal bar list. Values are always labelled, so identity never
// rests on colour alone.
function BarList({ rows, total, emptyLabel }) {
  if (!rows.length) {
    return <p className="py-6 text-center text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row.key}>
          <div className="mb-1.5 flex items-baseline justify-between gap-3">
            <span className="truncate text-sm text-foreground">{row.label}</span>
            <span className="shrink-0 text-xs tabular-nums text-text-secondary">
              {formatBytes(row.bytes)}
              <span className="ml-1.5 text-text-tertiary">{row.count}</span>
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-surface-active">
            <div
              className="h-full rounded-full"
              style={{
                width: `${total > 0 ? Math.max(2, (row.bytes / total) * 100) : 0}%`,
                backgroundColor: "var(--color-chart-1)",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function OverviewPanel({ snapshot, onJump }) {
  const [reconciling, setReconciling] = useState(false);
  const { totals, providers, byMime, byNamespace, growth, largest } = snapshot;

  const stats = useMemo(
    () => [
      {
        label: "Pool used",
        value: formatBytes(totals.usedBytes),
        footer: totals.capacityBytes
          ? `${totals.usedPercent}% of ${formatBytes(totals.capacityBytes)}`
          : "no ceiling declared",
      },
      {
        label: "Free",
        value: totals.capacityBytes ? formatBytes(totals.freeBytes) : "Unlimited",
        footer: totals.hasUnlimited
          ? "plus an uncapped provider"
          : `${providers.length} provider${providers.length === 1 ? "" : "s"}`,
      },
      {
        label: "Objects",
        value: String(totals.fileCount),
        footer: `${totals.namespaceCount} namespace${totals.namespaceCount === 1 ? "" : "s"}`,
      },
      {
        label: "Healthy providers",
        value: `${totals.healthy}/${totals.providerCount}`,
        footer: totals.degraded ? `${totals.degraded} need attention` : "all qualified",
      },
    ],
    [totals, providers.length]
  );

  // Segment widths are shares of the declared ceiling, so the bar reads as
  // "how full is the pool", with the unfilled remainder as the tail.
  const capacityBasis = totals.capacityBytes || totals.usedBytes || 1;
  const segments = providers
    .filter((provider) => provider.usedBytes > 0)
    .map((provider, index) => ({
      ...provider,
      color: seriesColor(index),
      share: (provider.usedBytes / capacityBasis) * 100,
    }));

  const mimeRows = byMime.map((row) => ({
    key: row.group,
    label: row.group,
    bytes: row.bytes,
    count: row.count,
  }));

  const namespaceRows = byNamespace.map((row) => ({
    key: row.id,
    label: row.name || row.key,
    bytes: row.bytes,
    count: row.count,
  }));

  async function handleReconcile() {
    setReconciling(true);
    const result = await reconcileAction();
    setReconciling(false);

    if (!result.ok) {
      toast.error(result.error || "Could not reconcile the pool.");
      return;
    }

    const drifted = (result.results || []).filter(
      (entry) => entry.drift && entry.drift.driftBytes !== 0
    );
    toast.success(
      drifted.length
        ? `Corrected ${drifted.length} provider ledger(s); released ${result.expired} stale upload(s).`
        : `Ledgers already accurate; released ${result.expired} stale upload(s).`
    );
  }

  return (
    <div className="space-y-4">
      <StatsBar stats={stats} columns={4} />

      <SectionCard
        title="Capacity"
        description={
          totals.capacityBytes
            ? `${formatBytes(totals.usedBytes)} of ${formatBytes(totals.capacityBytes)} declared across the pool.`
            : "No provider has declared a ceiling yet, so the pool has no capacity to plot."
        }
        action={
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReconcile}
            disabled={reconciling}
            className="gap-1.5 text-xs"
          >
            {reconciling ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" />
            )}
            Reconcile
          </Button>
        }
      >
        {segments.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Nothing stored yet. Add a provider, then upload through{" "}
            <code className="rounded bg-surface-active px-1 py-0.5 text-[12px]">
              /api/storage/upload
            </code>
            .
          </p>
        ) : (
          <>
            {/* 2px surface gaps keep adjacent segments legible without borders. */}
            <div className="flex h-3 w-full gap-0.5 overflow-hidden rounded-full bg-surface-active">
              {segments.map((segment) => (
                <div
                  key={segment.id}
                  className="h-full first:rounded-l-full last:rounded-r-full"
                  style={{
                    width: `${Math.max(0.5, segment.share)}%`,
                    backgroundColor: segment.color,
                  }}
                  title={`${segment.name}: ${formatBytes(segment.usedBytes)}`}
                />
              ))}
            </div>

            <div className="mt-4 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
              {segments.map((segment) => (
                <div key={segment.id} className="flex items-center gap-2 text-sm">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: segment.color }}
                  />
                  <span className="truncate text-foreground">{segment.name}</span>
                  <span className="ml-auto shrink-0 text-xs tabular-nums text-text-secondary">
                    {formatBytes(segment.usedBytes)}
                    {segment.capacityBytes ? (
                      <span className="text-text-tertiary">
                        {" "}
                        / {formatBytes(segment.capacityBytes)}
                      </span>
                    ) : (
                      <span className="text-text-tertiary"> / ∞</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </SectionCard>

      <SectionCard
        title="Growth"
        description="Total bytes stored over the last 30 days."
      >
        <ChartContainer config={growthConfig} className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={growth} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="storage-growth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                stroke="var(--color-border)"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                minTickGap={28}
                tick={{ fontSize: 11, fill: "var(--color-text-tertiary)" }}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={56}
                tick={{ fontSize: 11, fill: "var(--color-text-tertiary)" }}
                tickFormatter={(value) => formatBytes(value, 0)}
              />
              <ChartTooltip
                cursor={{ stroke: "var(--color-border-strong)" }}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    }
                    formatter={(value) => formatBytes(value)}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="var(--color-chart-1)"
                strokeWidth={2}
                fill="url(#storage-growth)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="By type" description="What the pool is actually holding.">
          <BarList
            rows={mimeRows}
            total={mimeRows[0]?.bytes || 0}
            emptyLabel="No files yet."
          />
        </SectionCard>

        <SectionCard title="By consumer" description="Which app put it there.">
          <BarList
            rows={namespaceRows}
            total={namespaceRows[0]?.bytes || 0}
            emptyLabel="No namespaces are storing anything yet."
          />
        </SectionCard>
      </div>

      <SectionCard
        title="Provider health"
        description="Qualification state of every member of the pool."
        action={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onJump("providers")}
            className="text-xs"
          >
            Manage
          </Button>
        }
      >
        {providers.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No providers yet — add one to give the pool somewhere to put files.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {providers.map((provider) => {
              const status = PROVIDER_STATUS_MAP[provider.status] || {};
              const percent = usagePercent(provider.usedBytes, provider.capacityBytes);
              return (
                <div
                  key={provider.id}
                  className="rounded-lg border border-border bg-surface-card p-3"
                >
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-3.5 w-3.5 text-text-tertiary" />
                    <span className="truncate text-sm font-medium text-foreground">
                      {provider.name}
                    </span>
                    <span
                      className={cn("ml-auto h-1.5 w-1.5 rounded-full", status.dotClass)}
                      aria-hidden
                    />
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-text-secondary">
                    {provider.lastProbeOk === false ? (
                      <CircleAlert className="h-3 w-3 text-red-400" />
                    ) : (
                      <CircleCheck className="h-3 w-3 text-emerald-400" />
                    )}
                    {status.label || provider.status}
                    <span className="text-text-tertiary">
                      · probed {formatRelative(provider.lastProbeAt)}
                    </span>
                  </div>
                  <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-surface-active">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${provider.capacityBytes ? percent : 4}%` }}
                    />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[11px] text-text-tertiary">
                    <span className="tabular-nums">
                      {formatBytes(provider.usedBytes)}
                      {provider.capacityBytes
                        ? ` / ${formatBytes(provider.capacityBytes)}`
                        : null}
                    </span>
                    {provider.capacityBytes ? (
                      <span className="tabular-nums">{percent}%</span>
                    ) : (
                      <InfinityIcon className="h-3 w-3" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      <SectionCard title="Largest files" description="The first thing to look at when the pool fills up.">
        {largest.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">No files yet.</p>
        ) : (
          <div className="divide-y divide-border">
            {largest.map((file) => (
              <div key={file.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                <span className="truncate text-sm text-foreground">{file.path}</span>
                {file.placement?.providerName && (
                  <span className="shrink-0 rounded-full border border-border bg-surface-active px-2 py-0.5 text-[11px] text-text-secondary">
                    {file.placement.providerName}
                  </span>
                )}
                <span className="ml-auto shrink-0 text-xs tabular-nums text-text-secondary">
                  {formatBytes(file.sizeBytes)}
                </span>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
