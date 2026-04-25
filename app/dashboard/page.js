'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Activity,
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  Building2,
  ChevronRight,
  Cpu,
  Download,
  Filter,
  Leaf,
  PlugZap,
  RefreshCcw,
  Sun,
  Zap,
  AirVent,
  Lightbulb,
  Droplets,
  Recycle,
  X,
  Calendar,
  AlertTriangle,
} from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
} from 'recharts'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'

import { Navbar } from '@/components/arasaka/navbar'
import { Card, Tag, SectionEyebrow } from '@/components/arasaka/swiss'
import { cn } from '@/lib/utils'
import {
  BLOCKS,
  MODULES,
  TIME_RANGES,
  STATUS_META,
  ALERTS,
  SEVERITY_META,
  buildSeries,
  buildKpiTotals,
  buildBlockSummary,
} from '@/lib/dashboard-data'

const MODULE_COLOR = {
  hvac: 'hsl(var(--chart-1))',
  lighting: 'hsl(var(--chart-2))',
  ev: 'hsl(var(--chart-3))',
  water: 'hsl(var(--chart-4))',
  rvm: 'hsl(var(--chart-5))',
}

const fmtNum = (n) => {
  if (n == null) return '—'
  if (Math.abs(n) >= 1000) return (n / 1000).toFixed(1) + 'k'
  return Math.round(n).toLocaleString('en-IN')
}

const STATUS_TONE = {
  optimal: 'primary',
  attention: 'warning',
  critical: 'destructive',
}

/* -------------------------------------------------------------------------- */
/*  Reused                                                                    */
/* -------------------------------------------------------------------------- */

function KpiTile({ index, label, value, suffix, delta, icon: Icon, sub }) {
  const positive = delta != null && delta >= 0
  return (
    <div className="relative h-full bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            {label}
          </p>
          <p className="font-display num-tabular mt-3 text-3xl font-semibold tracking-tighter">
            {value}
            {suffix && (
              <span className="ml-1 text-base font-medium text-muted-foreground">{suffix}</span>
            )}
          </p>
          {sub && <p className="mt-1.5 text-xs text-muted-foreground">{sub}</p>}
        </div>
        <div className="flex flex-col items-end gap-3">
          <span className="font-mono text-[10px] font-medium tracking-[0.18em] text-muted-foreground">
            K/{String(index).padStart(2, '0')}
          </span>
          {Icon && (
            <div className="flex h-9 w-9 items-center justify-center border border-border bg-background">
              <Icon className="h-4 w-4" aria-hidden />
            </div>
          )}
        </div>
      </div>
      {delta != null && (
        <div className="mt-4">
          <span
            className={cn(
              'inline-flex items-center gap-1 border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.2em]',
              positive
                ? 'border-primary/40 bg-primary/8 text-primary'
                : 'border-destructive/40 bg-destructive/10 text-destructive',
            )}
            style={{ borderRadius: 'var(--radius)' }}
          >
            {positive ? (
              <ArrowUpRight className="h-3 w-3" aria-hidden />
            ) : (
              <ArrowDownRight className="h-3 w-3" aria-hidden />
            )}
            {Math.abs(delta).toFixed(1)}% vs prior
          </span>
        </div>
      )}
      <div className="absolute bottom-0 left-0 h-0.5 w-12 bg-primary" aria-hidden />
    </div>
  )
}

function FrameHeader({ title, subtitle, right }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border p-5">
      <div className="min-w-0">
        <h3 className="font-display truncate text-base font-semibold leading-tight tracking-tight">
          {title}
        </h3>
        {subtitle && (
          <p className="mt-1 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
      {right}
    </div>
  )
}

function Sparkline({ data }) {
  return (
    <div className="h-12">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <Line type="monotone" dataKey="y" stroke="hsl(var(--primary))" strokeWidth={1.6} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function TooltipBox(props) {
  if (!props.active || !props.payload?.length) return null
  return (
    <div
      className="border border-border bg-popover p-2 font-mono text-[11px] shadow-sm"
      style={{ borderRadius: 'var(--radius)', fontFamily: 'var(--font-mono)' }}
    >
      <div className="mb-1 font-medium uppercase tracking-[0.2em] text-muted-foreground">
        {props.label}
      </div>
      {props.payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2" style={{ background: p.color }} />
            {p.name}
          </span>
          <span className="num-tabular font-semibold">{fmtNum(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

function TogglePill({ active, onClick, children, color }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex items-center gap-2 border px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.2em] transition-colors',
        active
          ? 'border-foreground bg-foreground text-background'
          : 'border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground',
      )}
      style={{ borderRadius: 'var(--radius)' }}
    >
      {color && (
        <span
          className="inline-block h-2 w-2 flex-shrink-0"
          style={{ background: color, opacity: active ? 1 : 0.55 }}
          aria-hidden
        />
      )}
      {children}
    </button>
  )
}

/* -------------------------------------------------------------------------- */
/*  Drill-down sheet                                                          */
/* -------------------------------------------------------------------------- */

function BlockDrill({ block, rangeId, onClose }) {
  const open = !!block
  const summaryAll = React.useMemo(() => buildBlockSummary(rangeId), [rangeId])
  const summary = React.useMemo(
    () => summaryAll.find((b) => b.id === block?.id),
    [summaryAll, block?.id],
  )
  const series = React.useMemo(() => {
    if (!block) return []
    return buildSeries({ rangeId, blockIds: [block.id], seed: 'drill-' + block.id })
  }, [block, rangeId])

  const moduleBars = React.useMemo(() => {
    if (!series.length) return []
    return [
      { module: 'HVAC', value: +series.reduce((s, p) => s + p.hvac, 0).toFixed(1), color: MODULE_COLOR.hvac },
      { module: 'LIGHTING', value: +series.reduce((s, p) => s + p.lighting, 0).toFixed(1), color: MODULE_COLOR.lighting },
      { module: 'EV', value: +series.reduce((s, p) => s + p.ev, 0).toFixed(1), color: MODULE_COLOR.ev },
      { module: 'WATER', value: +series.reduce((s, p) => s + p.water, 0).toFixed(1), color: MODULE_COLOR.water },
      { module: 'RVM', value: +series.reduce((s, p) => s + p.rvm, 0).toFixed(1), color: MODULE_COLOR.rvm },
    ]
  }, [series])

  const blockAlerts = React.useMemo(
    () => ALERTS.filter((a) => a.block === block?.name),
    [block?.name],
  )

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="w-full max-w-xl overflow-y-auto border-l border-border p-0 sm:max-w-xl"
        style={{ borderRadius: 0 }}
      >
        {block && summary && (
          <div className="flex h-full flex-col">
            <SheetHeader className="border-b border-border bg-card p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <Tag tone="primary">{block.kind}</Tag>
                    <Tag tone={STATUS_TONE[block.status]}>
                      <span className="h-1.5 w-1.5 animate-pulse bg-current" aria-hidden />
                      {STATUS_META[block.status].label}
                    </Tag>
                  </div>
                  <SheetTitle className="font-display mt-4 text-3xl font-semibold tracking-tighter">
                    {block.name}
                  </SheetTitle>
                  <SheetDescription className="mt-2 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    Block ID: {block.id} · {block.area.toLocaleString()} sqft · {block.capacity} occupancy
                  </SheetDescription>
                </div>
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center border border-border bg-background hover:bg-muted"
                  aria-label="Close drill-down"
                  style={{ borderRadius: 'var(--radius)' }}
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </div>
            </SheetHeader>

            <div className="space-y-5 p-6">
              <div className="grid grid-cols-2 gap-px border border-border bg-border">
                {[
                  { k: 'Total', v: fmtNum(summary.total), s: 'kWh' },
                  { k: 'Solar', v: fmtNum(summary.solar), s: 'kWh' },
                  { k: 'Savings', v: summary.savingsPct + '%', s: 'vs baseline' },
                  { k: 'CO₂ avoid', v: fmtNum(summary.co2), s: 'kg' },
                ].map((kpi) => (
                  <div key={kpi.k} className="bg-card p-4">
                    <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                      {kpi.k}
                    </p>
                    <p className="font-display num-tabular mt-1 text-xl font-semibold tracking-tighter">
                      {kpi.v}
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      {kpi.s}
                    </p>
                  </div>
                ))}
              </div>

              <Card>
                <FrameHeader title="Energy by Module" subtitle={`Range · ${rangeId.toUpperCase()}`} />
                <div className="h-[220px] p-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={moduleBars}
                      layout="vertical"
                      margin={{ top: 6, right: 14, left: 8, bottom: 6 }}
                    >
                      <CartesianGrid stroke="hsl(var(--border))" horizontal={false} strokeDasharray="3 3" />
                      <XAxis
                        type="number"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={11}
                        tickLine={false}
                        axisLine={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
                      />
                      <YAxis
                        type="category"
                        dataKey="module"
                        stroke="hsl(var(--foreground))"
                        fontSize={10}
                        tickLine={false}
                        axisLine={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
                        width={70}
                      />
                      <Tooltip cursor={{ fill: 'hsl(var(--accent))' }} content={<TooltipBox />} />
                      <Bar dataKey="value">
                        {moduleBars.map((b, i) => (
                          <Cell key={i} fill={b.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card>
                <FrameHeader title="Consumption Trend" subtitle={`${rangeId.toUpperCase()} · Total kWh`} />
                <div className="h-[200px] p-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={series} margin={{ top: 6, right: 8, left: -8, bottom: 0 }}>
                      <defs>
                        <linearGradient id="drillGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="t"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={10}
                        tickLine={false}
                        axisLine={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
                      />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={10}
                        tickLine={false}
                        axisLine={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
                      />
                      <Tooltip content={<TooltipBox />} />
                      <Area
                        type="monotone"
                        dataKey="total"
                        name="TOTAL"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        fill="url(#drillGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <div>
                <h4 className="mb-3 font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                  Recent alerts
                </h4>
                {blockAlerts.length === 0 ? (
                  <Card className="p-4">
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      No active alerts. System nominal.
                    </p>
                  </Card>
                ) : (
                  <div className="space-y-2">
                    {blockAlerts.map((a) => (
                      <Card key={a.id} className="flex items-start gap-3 p-3">
                        <Tag
                          tone={
                            a.severity === 'critical'
                              ? 'destructive'
                              : a.severity === 'attention'
                              ? 'warning'
                              : 'muted'
                          }
                        >
                          {SEVERITY_META[a.severity].label}
                        </Tag>
                        <div className="min-w-0 flex-1">
                          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                            {a.module} · {a.ts}
                          </p>
                          <p className="mt-1 text-sm">{a.message}</p>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function DashboardPage() {
  const [timeRange, setTimeRange] = React.useState('7d')
  const [focusBlock, setFocusBlock] = React.useState('ALL')
  const [enabledModules, setEnabledModules] = React.useState(
    () => new Set(MODULES.map((m) => m.id)),
  )
  const [drillBlock, setDrillBlock] = React.useState(null)
  const [tick, setTick] = React.useState(0)

  React.useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 12000)
    return () => clearInterval(id)
  }, [])

  const series = React.useMemo(
    () =>
      buildSeries({
        rangeId: timeRange,
        blockIds: focusBlock === 'ALL' ? ['ALL'] : [focusBlock],
        seed: 'main:' + tick,
      }),
    [timeRange, focusBlock, tick],
  )

  const totals = React.useMemo(() => buildKpiTotals(timeRange), [timeRange])
  const blocks = React.useMemo(() => buildBlockSummary(timeRange), [timeRange])

  const blockRanking = React.useMemo(
    () =>
      [...blocks]
        .sort((a, b) => b.savings - a.savings)
        .map((b) => ({
          name: b.name,
          savings: b.savings,
          baseline: b.baseline,
          total: b.total,
        })),
    [blocks],
  )

  const sourceMix = React.useMemo(() => {
    const sum = (k) => series.reduce((s, p) => s + p[k], 0)
    return [
      { name: 'HVAC', value: +sum('hvac').toFixed(1), color: MODULE_COLOR.hvac },
      { name: 'Lighting', value: +sum('lighting').toFixed(1), color: MODULE_COLOR.lighting },
      { name: 'EV', value: +sum('ev').toFixed(1), color: MODULE_COLOR.ev },
      { name: 'Water', value: +sum('water').toFixed(1), color: MODULE_COLOR.water },
      { name: 'RVM', value: +sum('rvm').toFixed(1), color: MODULE_COLOR.rvm },
    ].filter((d) => d.value > 0)
  }, [series])

  const toggleModule = (id) => {
    setEnabledModules((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      if (next.size === 0) next.add(id)
      return next
    })
  }

  const refresh = () => setTick((t) => t + 1)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="container space-y-6 pb-16 pt-24">
        {/* Page header */}
        <div className="grid items-end gap-6 border-b border-border pb-8 md:grid-cols-12">
          <div className="md:col-span-8">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 border border-border bg-card px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground"
                style={{ borderRadius: 'var(--radius)' }}
              >
                <ArrowLeft className="h-3 w-3" aria-hidden />
                Home
              </Link>
              <SectionEyebrow index="00" label="Console · Live" />
            </div>
            <h1 className="font-display mt-5 text-balance text-4xl font-semibold leading-[1.05] tracking-tighter sm:text-5xl">
              Campus Operating Layer
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Live KPIs, anomaly alerts and per-block drill-downs across every module of the
              ARASAKA blueprint.
            </p>
          </div>
          <div className="flex items-center gap-2 md:col-span-4 md:justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={refresh}
              className="h-9 border border-border bg-card font-mono text-[11px] font-medium uppercase tracking-[0.2em] hover:bg-muted"
              style={{ borderRadius: 'var(--radius)' }}
            >
              <RefreshCcw className="mr-2 h-3.5 w-3.5" aria-hidden />
              Refresh
            </Button>
            <Button
              size="sm"
              className="h-9 bg-foreground font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-background hover:bg-foreground/90"
              style={{ borderRadius: 'var(--radius)' }}
            >
              <Download className="mr-2 h-3.5 w-3.5" aria-hidden />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Filter bar */}
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden />
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                Time range
              </span>
              <div
                className="flex items-center border border-border"
                role="tablist"
                style={{ borderRadius: 'var(--radius)' }}
              >
                {TIME_RANGES.map((r) => (
                  <button
                    key={r.id}
                    role="tab"
                    aria-selected={timeRange === r.id}
                    onClick={() => setTimeRange(r.id)}
                    className={cn(
                      'border-r border-border px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] transition-colors last:border-r-0',
                      timeRange === r.id
                        ? 'bg-foreground text-background'
                        : 'bg-card hover:bg-muted',
                    )}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building2 className="h-4 w-4 text-muted-foreground" aria-hidden />
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                Focus
              </span>
              <Select value={focusBlock} onValueChange={setFocusBlock}>
                <SelectTrigger
                  className="h-9 w-[180px] border border-border bg-card font-mono text-[11px] font-medium uppercase tracking-[0.2em]"
                  style={{ borderRadius: 'var(--radius)' }}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  className="border border-border"
                  style={{ borderRadius: 'var(--radius)' }}
                >
                  <SelectItem value="ALL" className="font-mono text-[11px] uppercase tracking-[0.2em]">
                    All blocks
                  </SelectItem>
                  {BLOCKS.map((b) => (
                    <SelectItem
                      key={b.id}
                      value={b.id}
                      className="font-mono text-[11px] uppercase tracking-[0.2em]"
                    >
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 p-4">
            <Filter className="h-4 w-4 text-muted-foreground" aria-hidden />
            <span className="mr-1 font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Modules
            </span>
            {MODULES.map((m) => (
              <TogglePill
                key={m.id}
                active={enabledModules.has(m.id)}
                onClick={() => toggleModule(m.id)}
                color={MODULE_COLOR[m.id]}
              >
                {m.label}
              </TogglePill>
            ))}
          </div>
        </Card>

        {/* KPI row */}
        <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          <KpiTile
            index={1}
            label="Total Consumption"
            value={fmtNum(totals.total)}
            suffix="kWh"
            delta={-12.4}
            icon={Zap}
            sub={`Window · ${timeRange.toUpperCase()}`}
          />
          <KpiTile
            index={2}
            label="Savings vs Baseline"
            value={fmtNum(totals.savings)}
            suffix="kWh"
            delta={totals.savingsPct}
            icon={Cpu}
            sub={`${totals.savingsPct}% reduction`}
          />
          <KpiTile
            index={3}
            label="Solar Generated"
            value={fmtNum(totals.solar)}
            suffix="kWh"
            delta={8.6}
            icon={Sun}
            sub="rooftops + canopies"
          />
          <KpiTile
            index={4}
            label="CO₂ Avoided"
            value={fmtNum(totals.co2)}
            suffix="kg"
            delta={9.1}
            icon={Leaf}
            sub="grid-equivalent"
          />
        </div>

        {/* Main charts */}
        <div className="grid gap-5 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <FrameHeader
              title="Energy by Source"
              subtitle={`${timeRange.toUpperCase()} · Stacked · kWh`}
              right={
                <Tag tone="primary">
                  <Activity className="h-3 w-3" aria-hidden />
                  Live
                </Tag>
              }
            />
            <div className="h-[340px] p-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
                  <defs>
                    {Object.entries(MODULE_COLOR).map(([k, c]) => (
                      <linearGradient key={k} id={`g-${k}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={c} stopOpacity={0.7} />
                        <stop offset="100%" stopColor={c} stopOpacity={0.3} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="t"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
                  />
                  <Tooltip content={<TooltipBox />} />
                  <Legend
                    iconSize={9}
                    iconType="square"
                    wrapperStyle={{
                      fontSize: 11,
                      fontFamily: 'var(--font-mono)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.18em',
                    }}
                  />
                  {enabledModules.has('hvac') && (
                    <Area type="monotone" dataKey="hvac" name="HVAC" stackId="1" stroke={MODULE_COLOR.hvac} strokeWidth={1.5} fill="url(#g-hvac)" />
                  )}
                  {enabledModules.has('lighting') && (
                    <Area type="monotone" dataKey="lighting" name="LIGHTING" stackId="1" stroke={MODULE_COLOR.lighting} strokeWidth={1.5} fill="url(#g-lighting)" />
                  )}
                  {enabledModules.has('ev') && (
                    <Area type="monotone" dataKey="ev" name="EV" stackId="1" stroke={MODULE_COLOR.ev} strokeWidth={1.5} fill="url(#g-ev)" />
                  )}
                  {enabledModules.has('water') && (
                    <Area type="monotone" dataKey="water" name="WATER" stackId="1" stroke={MODULE_COLOR.water} strokeWidth={1.5} fill="url(#g-water)" />
                  )}
                  {enabledModules.has('rvm') && (
                    <Area type="monotone" dataKey="rvm" name="RVM" stackId="1" stroke={MODULE_COLOR.rvm} strokeWidth={1.5} fill="url(#g-rvm)" />
                  )}
                  {enabledModules.has('solar') && (
                    <Area
                      type="monotone"
                      dataKey="solar"
                      name="SOLAR"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fill="transparent"
                      strokeDasharray="5 3"
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <FrameHeader title="Source Mix" subtitle={`${timeRange.toUpperCase()} · % share`} />
            <div className="h-[340px] p-3">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<TooltipBox />} />
                  <Pie
                    data={sourceMix}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={56}
                    outerRadius={102}
                    paddingAngle={2}
                    stroke="hsl(var(--background))"
                    strokeWidth={2}
                  >
                    {sourceMix.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign="bottom"
                    iconType="square"
                    iconSize={9}
                    wrapperStyle={{
                      fontSize: 11,
                      fontFamily: 'var(--font-mono)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.16em',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Block ranking */}
        <Card>
          <FrameHeader
            title="Per-Block Performance"
            subtitle="Savings ranking · kWh avoided"
            right={<Tag tone="muted">{blocks.length} blocks</Tag>}
          />
          <div className="h-[280px] p-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={blockRanking} margin={{ top: 8, right: 12, left: 4, bottom: 0 }}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
                  interval={0}
                  angle={-12}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
                />
                <Tooltip cursor={{ fill: 'hsl(var(--accent))' }} content={<TooltipBox />} />
                <Bar dataKey="savings" name="SAVINGS" fill="hsl(var(--primary))" radius={[1, 1, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Block grid */}
        <div>
          <div className="mb-4 flex items-end justify-between">
            <SectionEyebrow index="08" label="Blocks" />
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Click any block to drill-down
            </span>
          </div>
          <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {blocks.map((b, i) => (
              <button
                key={b.id}
                onClick={() => setDrillBlock(b)}
                className="group bg-card p-5 text-left transition-colors hover:bg-muted/40"
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                      {b.kind}
                    </p>
                    <h3 className="font-display mt-0.5 truncate text-base font-semibold leading-tight tracking-tight">
                      {b.name}
                    </h3>
                  </div>
                  <Tag tone={STATUS_TONE[b.status]} className="text-[9px]">
                    {STATUS_META[b.status].label}
                  </Tag>
                </div>
                <div className="mt-4">
                  <p className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                    Total · {timeRange.toUpperCase()}
                  </p>
                  <p className="font-display num-tabular mt-1 text-3xl font-semibold tracking-tighter">
                    {fmtNum(b.total)}
                    <span className="ml-1 text-xs font-medium text-muted-foreground">kWh</span>
                  </p>
                </div>
                <div className="mt-3">
                  <Sparkline data={b.spark} />
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] font-medium uppercase tracking-[0.2em]">
                    <ArrowDownRight className="h-3 w-3 text-primary" aria-hidden />
                    <span className="text-primary">{b.savingsPct}%</span>
                    <span className="text-muted-foreground">saved</span>
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground transition-colors group-hover:text-foreground">
                    Drill <ChevronRight className="h-3 w-3" aria-hidden />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <Card>
          <FrameHeader
            title="Anomaly & Event Log"
            subtitle="System-wide · live stream"
            right={
              <Tag tone="warning">
                <Bell className="h-3 w-3" aria-hidden />
                {ALERTS.length} events
              </Tag>
            }
          />
          <ul className="divide-y divide-border">
            {ALERTS.map((a) => (
              <li
                key={a.id}
                className="flex flex-wrap items-center gap-3 p-4 transition-colors hover:bg-muted/40"
              >
                <Tag
                  tone={
                    a.severity === 'critical'
                      ? 'destructive'
                      : a.severity === 'attention'
                      ? 'warning'
                      : 'muted'
                  }
                >
                  {a.severity === 'critical' && (
                    <AlertTriangle className="h-3 w-3" aria-hidden />
                  )}
                  {SEVERITY_META[a.severity].label}
                </Tag>
                <span className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                  {a.ts}
                </span>
                <span className="font-mono text-[11px] font-medium uppercase tracking-[0.18em]">
                  {a.block} · {a.module}
                </span>
                <span className="flex-1 text-sm">{a.message}</span>
                <button
                  onClick={() => {
                    const found = blocks.find((bl) => bl.name === a.block)
                    if (found) setDrillBlock(found)
                  }}
                  className="inline-flex items-center gap-1 border border-border bg-card px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.22em] hover:bg-muted"
                  style={{ borderRadius: 'var(--radius)' }}
                >
                  Inspect
                  <ChevronRight className="h-3 w-3" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </Card>
      </main>

      <BlockDrill
        block={drillBlock}
        rangeId={timeRange}
        onClose={() => setDrillBlock(null)}
      />
    </div>
  )
}
