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
  Maximize2,
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
import { BrutalCard, BrutalTag } from '@/components/arasaka/brutal-card'
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

const MODULE_ICON = {
  hvac: AirVent,
  lighting: Lightbulb,
  ev: PlugZap,
  solar: Sun,
  water: Droplets,
  rvm: Recycle,
}

const fmtNum = (n) => {
  if (n == null) return '—'
  if (Math.abs(n) >= 1000) return (n / 1000).toFixed(1) + 'k'
  return Math.round(n).toLocaleString('en-IN')
}

/* -------------------------------------------------------------------------- */
/*  Small Reused Pieces                                                       */
/* -------------------------------------------------------------------------- */

function KpiTile({ label, value, suffix, delta, tone = 'foreground', icon: Icon, sub }) {
  const positive = delta != null && delta >= 0
  return (
    <BrutalCard className="relative overflow-hidden p-5 brutal-lift">
      <div className="absolute inset-y-0 right-0 w-1.5 bg-primary" aria-hidden />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 font-mono text-3xl font-bold tracking-tight">
            {value}
            {suffix && <span className="ml-1 text-base text-muted-foreground">{suffix}</span>}
          </p>
          {sub && (
            <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
          )}
        </div>
        {Icon && (
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center border-2 border-foreground bg-background">
            <Icon className="h-5 w-5" aria-hidden />
          </div>
        )}
      </div>
      {delta != null && (
        <div className="mt-3">
          <span
            className={cn(
              'inline-flex items-center gap-1 border-2 border-foreground px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest',
              positive ? 'bg-primary text-primary-foreground' : 'bg-destructive text-destructive-foreground',
            )}
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
    </BrutalCard>
  )
}

function FrameHeader({ title, subtitle, right }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b-2 border-foreground p-4">
      <div className="min-w-0">
        <h3 className="font-display truncate text-base font-bold leading-tight">{title}</h3>
        {subtitle && (
          <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
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
          <Line type="monotone" dataKey="y" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function TooltipBox(props) {
  if (!props.active || !props.payload?.length) return null
  return (
    <div
      className="border-2 border-foreground bg-popover p-2 font-mono text-[11px]"
      style={{ borderRadius: 0, fontFamily: 'var(--font-mono)' }}
    >
      <div className="mb-1 font-bold uppercase tracking-widest">{props.label}</div>
      {props.payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5" style={{ background: p.color }} />
            {p.name}
          </span>
          <span className="font-bold">{fmtNum(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Toggle pill                                                               */
/* -------------------------------------------------------------------------- */

function TogglePill({ active, onClick, children, color }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex items-center gap-1.5 border-2 border-foreground px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest transition-all',
        active
          ? 'bg-foreground text-background brutal-shadow-sm'
          : 'bg-background text-foreground hover:bg-muted',
      )}
      style={{ borderRadius: 0 }}
    >
      {color && (
        <span className="inline-block h-2.5 w-2.5" style={{ background: color }} aria-hidden />
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
        className="w-full max-w-xl overflow-y-auto border-l-2 border-foreground p-0 sm:max-w-xl"
        style={{ borderRadius: 0 }}
      >
        {block && summary && (
          <div className="flex h-full flex-col">
            <SheetHeader className="border-b-2 border-foreground bg-foreground p-6 text-background">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <BrutalTag tone="primary" className="mb-3">
                    {block.kind}
                  </BrutalTag>
                  <SheetTitle className="font-display text-2xl font-bold tracking-tight text-background">
                    {block.name}
                  </SheetTitle>
                  <SheetDescription className="mt-1 font-mono text-[10px] font-bold uppercase tracking-widest text-background/70">
                    Block ID: {block.id} · {block.area.toLocaleString()} sqft · {block.capacity} occupancy
                  </SheetDescription>
                </div>
                <button
                  onClick={onClose}
                  className="border-2 border-background bg-background p-1.5 text-foreground brutal-shadow-sm hover:translate-x-[-1px] hover:translate-y-[-1px]"
                  aria-label="Close drill-down"
                  style={{ borderRadius: 0 }}
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </div>
              <div className="mt-3">
                <span
                  className={cn(
                    'inline-flex items-center gap-1 border-2 border-background px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest',
                    STATUS_META[block.status].tone,
                  )}
                >
                  <span className="h-1.5 w-1.5 animate-pulse bg-current" aria-hidden />
                  {STATUS_META[block.status].label}
                </span>
              </div>
            </SheetHeader>

            <div className="space-y-5 p-6">
              <div className="grid grid-cols-2 gap-0 border-2 border-foreground">
                {[
                  { k: 'TOTAL', v: fmtNum(summary.total), s: 'kWh' },
                  { k: 'SOLAR', v: fmtNum(summary.solar), s: 'kWh' },
                  { k: 'SAVINGS', v: summary.savingsPct + '%', s: 'vs baseline' },
                  { k: 'CO₂ AVOID', v: fmtNum(summary.co2), s: 'kg' },
                ].map((kpi, i) => (
                  <div
                    key={kpi.k}
                    className={cn(
                      'p-4',
                      i % 2 === 1 && 'border-l-2 border-foreground',
                      i >= 2 && 'border-t-2 border-foreground',
                    )}
                  >
                    <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {kpi.k}
                    </p>
                    <p className="mt-1 font-mono text-xl font-bold">{kpi.v}</p>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{kpi.s}</p>
                  </div>
                ))}
              </div>

              <BrutalCard>
                <FrameHeader
                  title="Energy by Module"
                  subtitle={`Range: ${rangeId.toUpperCase()}`}
                />
                <div className="h-[220px] p-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={moduleBars}
                      layout="vertical"
                      margin={{ top: 6, right: 14, left: 8, bottom: 6 }}
                    >
                      <CartesianGrid stroke="hsl(var(--foreground) / 0.16)" horizontal={false} />
                      <XAxis
                        type="number"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={11}
                        tickLine={false}
                        axisLine={{ stroke: 'hsl(var(--foreground))', strokeWidth: 2 }}
                      />
                      <YAxis
                        type="category"
                        dataKey="module"
                        stroke="hsl(var(--foreground))"
                        fontSize={10}
                        tickLine={false}
                        axisLine={{ stroke: 'hsl(var(--foreground))', strokeWidth: 2 }}
                        width={70}
                      />
                      <Tooltip
                        cursor={{ fill: 'hsl(var(--accent))' }}
                        content={<TooltipBox />}
                      />
                      <Bar dataKey="value" stroke="hsl(var(--foreground))" strokeWidth={2}>
                        {moduleBars.map((b, i) => (
                          <Cell key={i} fill={b.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </BrutalCard>

              <BrutalCard>
                <FrameHeader
                  title="Consumption Trend"
                  subtitle={`${rangeId.toUpperCase()} · TOTAL kWh`}
                />
                <div className="h-[200px] p-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={series} margin={{ top: 6, right: 8, left: -8, bottom: 0 }}>
                      <defs>
                        <linearGradient id="drillGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.55} />
                          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="hsl(var(--foreground) / 0.18)" vertical={false} />
                      <XAxis
                        dataKey="t"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={10}
                        tickLine={false}
                        axisLine={{ stroke: 'hsl(var(--foreground))', strokeWidth: 2 }}
                      />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={10}
                        tickLine={false}
                        axisLine={{ stroke: 'hsl(var(--foreground))', strokeWidth: 2 }}
                      />
                      <Tooltip content={<TooltipBox />} />
                      <Area
                        type="monotone"
                        dataKey="total"
                        name="TOTAL"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2.4}
                        fill="url(#drillGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </BrutalCard>

              <div>
                <h4 className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Recent Alerts
                </h4>
                {blockAlerts.length === 0 ? (
                  <BrutalCard className="p-4">
                    <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                      No active alerts. System nominal.
                    </p>
                  </BrutalCard>
                ) : (
                  <div className="space-y-2">
                    {blockAlerts.map((a) => (
                      <BrutalCard key={a.id} className="flex items-start gap-3 p-3">
                        <BrutalTag className={SEVERITY_META[a.severity].tone}>
                          {SEVERITY_META[a.severity].label}
                        </BrutalTag>
                        <div className="min-w-0 flex-1">
                          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            {a.module} · {a.ts}
                          </p>
                          <p className="mt-1 text-sm">{a.message}</p>
                        </div>
                      </BrutalCard>
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
  const [tick, setTick] = React.useState(0) // used by refresh button to force recompute

  // "Live" feel: ticks every 12s
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
      // never empty
      if (next.size === 0) next.add(id)
      return next
    })
  }

  const refresh = () => setTick((t) => t + 1)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="container space-y-6 pb-12 pt-24">
        {/* Page header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 border-2 border-foreground bg-background px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-widest brutal-shadow-sm hover:translate-x-[-1px] hover:translate-y-[-1px]"
                style={{ borderRadius: 0 }}
              >
                <ArrowLeft className="h-3 w-3" aria-hidden />
                Home
              </Link>
              <BrutalTag tone="primary">
                <Activity className="h-3 w-3" aria-hidden />
                LIVE CONSOLE
              </BrutalTag>
            </div>
            <h1 className="font-display mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Campus Operating Layer
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Live KPIs, anomaly alerts and per-block drill-downs across every module of the
              ARASAKA blueprint.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={refresh}
              style={{ borderRadius: 0 }}
              className="h-9 border-2 border-foreground bg-background font-mono text-xs font-bold uppercase tracking-widest brutal-shadow-sm hover:translate-x-[-1px] hover:translate-y-[-1px] hover:bg-background"
            >
              <RefreshCcw className="mr-2 h-3.5 w-3.5" aria-hidden />
              Refresh
            </Button>
            <Button
              size="sm"
              style={{ borderRadius: 0 }}
              className="h-9 border-2 border-foreground bg-foreground font-mono text-xs font-bold uppercase tracking-widest text-background brutal-shadow-sm hover:translate-x-[-1px] hover:translate-y-[-1px]"
            >
              <Download className="mr-2 h-3.5 w-3.5" aria-hidden />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Filter bar */}
        <BrutalCard>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-foreground p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" aria-hidden />
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Time Range
              </span>
              <div className="flex items-center border-2 border-foreground" role="tablist">
                {TIME_RANGES.map((r) => (
                  <button
                    key={r.id}
                    role="tab"
                    aria-selected={timeRange === r.id}
                    onClick={() => setTimeRange(r.id)}
                    className={cn(
                      'border-r-2 border-foreground px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-widest transition-colors last:border-r-0',
                      timeRange === r.id
                        ? 'bg-foreground text-background'
                        : 'bg-background hover:bg-muted',
                    )}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" aria-hidden />
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Focus
              </span>
              <Select value={focusBlock} onValueChange={setFocusBlock}>
                <SelectTrigger
                  className="h-9 w-[180px] border-2 border-foreground font-mono text-xs font-bold uppercase tracking-widest brutal-shadow-sm"
                  style={{ borderRadius: 0 }}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  className="border-2 border-foreground"
                  style={{ borderRadius: 0 }}
                >
                  <SelectItem value="ALL" className="font-mono text-xs uppercase tracking-widest">
                    All blocks
                  </SelectItem>
                  {BLOCKS.map((b) => (
                    <SelectItem
                      key={b.id}
                      value={b.id}
                      className="font-mono text-xs uppercase tracking-widest"
                    >
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 p-4">
            <Filter className="h-4 w-4" aria-hidden />
            <span className="mr-1 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
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
        </BrutalCard>

        {/* KPI row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiTile
            label="Total Consumption"
            value={fmtNum(totals.total)}
            suffix="kWh"
            delta={-12.4}
            icon={Zap}
            sub={`window: ${timeRange.toUpperCase()}`}
          />
          <KpiTile
            label="Savings vs Baseline"
            value={fmtNum(totals.savings)}
            suffix="kWh"
            delta={totals.savingsPct}
            icon={Cpu}
            sub={`${totals.savingsPct}% reduction`}
          />
          <KpiTile
            label="Solar Generated"
            value={fmtNum(totals.solar)}
            suffix="kWh"
            delta={8.6}
            icon={Sun}
            sub="across rooftops + canopies"
          />
          <KpiTile
            label="CO₂ Avoided"
            value={fmtNum(totals.co2)}
            suffix="kg"
            delta={9.1}
            icon={Leaf}
            sub="grid-equiv emissions"
          />
        </div>

        {/* Main charts */}
        <div className="grid gap-4 lg:grid-cols-3">
          <BrutalCard className="lg:col-span-2">
            <FrameHeader
              title="Energy by Source"
              subtitle={`${timeRange.toUpperCase()} · STACKED · kWh`}
              right={
                <BrutalTag tone="primary">
                  <Activity className="h-3 w-3" aria-hidden />
                  LIVE
                </BrutalTag>
              }
            />
            <div className="h-[340px] p-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
                  <defs>
                    {Object.entries(MODULE_COLOR).map(([k, c]) => (
                      <linearGradient key={k} id={`g-${k}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={c} stopOpacity={0.85} />
                        <stop offset="100%" stopColor={c} stopOpacity={0.4} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid stroke="hsl(var(--foreground) / 0.16)" vertical={false} />
                  <XAxis
                    dataKey="t"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: 'hsl(var(--foreground))', strokeWidth: 2 }}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: 'hsl(var(--foreground))', strokeWidth: 2 }}
                  />
                  <Tooltip content={<TooltipBox />} />
                  <Legend
                    iconSize={10}
                    iconType="square"
                    wrapperStyle={{ fontSize: 11, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                  />
                  {enabledModules.has('hvac') && (
                    <Area type="monotone" dataKey="hvac" name="HVAC" stackId="1" stroke="hsl(var(--foreground))" strokeWidth={1.5} fill="url(#g-hvac)" />
                  )}
                  {enabledModules.has('lighting') && (
                    <Area type="monotone" dataKey="lighting" name="LIGHTING" stackId="1" stroke="hsl(var(--foreground))" strokeWidth={1.5} fill="url(#g-lighting)" />
                  )}
                  {enabledModules.has('ev') && (
                    <Area type="monotone" dataKey="ev" name="EV" stackId="1" stroke="hsl(var(--foreground))" strokeWidth={1.5} fill="url(#g-ev)" />
                  )}
                  {enabledModules.has('water') && (
                    <Area type="monotone" dataKey="water" name="WATER" stackId="1" stroke="hsl(var(--foreground))" strokeWidth={1.5} fill="url(#g-water)" />
                  )}
                  {enabledModules.has('rvm') && (
                    <Area type="monotone" dataKey="rvm" name="RVM" stackId="1" stroke="hsl(var(--foreground))" strokeWidth={1.5} fill="url(#g-rvm)" />
                  )}
                  {enabledModules.has('solar') && (
                    <Area type="monotone" dataKey="solar" name="SOLAR" stroke="hsl(var(--primary))" strokeWidth={2.4} fill="transparent" strokeDasharray="6 3" />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </BrutalCard>

          <BrutalCard>
            <FrameHeader title="Source Mix" subtitle={`${timeRange.toUpperCase()} · % SHARE`} />
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
                    stroke="hsl(var(--foreground))"
                    strokeWidth={2}
                  >
                    {sourceMix.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign="bottom"
                    iconType="square"
                    iconSize={10}
                    wrapperStyle={{ fontSize: 11, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </BrutalCard>
        </div>

        {/* Block ranking */}
        <BrutalCard>
          <FrameHeader
            title="Per-Block Performance"
            subtitle="SAVINGS RANKING · kWh AVOIDED"
            right={
              <BrutalTag tone="outline">
                {blocks.length} BLOCKS
              </BrutalTag>
            }
          />
          <div className="h-[280px] p-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={blockRanking} margin={{ top: 8, right: 12, left: 4, bottom: 0 }}>
                <CartesianGrid stroke="hsl(var(--foreground) / 0.16)" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: 'hsl(var(--foreground))', strokeWidth: 2 }}
                  interval={0}
                  angle={-12}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: 'hsl(var(--foreground))', strokeWidth: 2 }}
                />
                <Tooltip cursor={{ fill: 'hsl(var(--accent))' }} content={<TooltipBox />} />
                <Bar
                  dataKey="savings"
                  name="SAVINGS"
                  fill="hsl(var(--primary))"
                  stroke="hsl(var(--foreground))"
                  strokeWidth={2}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </BrutalCard>

        {/* Block grid */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold tracking-tight">
              Blocks
              <span className="ml-2 font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">
                CLICK ANY BLOCK TO DRILL-DOWN
              </span>
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {blocks.map((b) => (
              <button
                key={b.id}
                onClick={() => setDrillBlock(b)}
                className="text-left"
              >
                <BrutalCard className="brutal-lift cursor-pointer">
                  <div className="flex items-center justify-between border-b-2 border-foreground p-4">
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        {b.kind}
                      </p>
                      <h3 className="font-display mt-0.5 truncate text-base font-bold leading-tight">
                        {b.name}
                      </h3>
                    </div>
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 border-2 border-foreground px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest',
                        STATUS_META[b.status].tone,
                      )}
                    >
                      {STATUS_META[b.status].label}
                    </span>
                  </div>
                  <div className="space-y-3 p-4">
                    <div>
                      <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        Total · {timeRange.toUpperCase()}
                      </p>
                      <p className="mt-1 font-mono text-2xl font-bold tracking-tight">
                        {fmtNum(b.total)}
                        <span className="ml-1 text-xs text-muted-foreground">kWh</span>
                      </p>
                    </div>
                    <Sparkline data={b.spark} />
                    <div className="flex items-center justify-between border-t-2 border-foreground pt-3">
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-widest">
                        <ArrowDownRight className="h-3 w-3 text-primary" aria-hidden />
                        {b.savingsPct}% saved
                      </span>
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        Drill <ChevronRight className="h-3 w-3" aria-hidden />
                      </span>
                    </div>
                  </div>
                </BrutalCard>
              </button>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <BrutalCard>
          <FrameHeader
            title="Anomaly & Event Log"
            subtitle="SYSTEM-WIDE · LIVE STREAM"
            right={
              <BrutalTag tone="warning">
                <Bell className="h-3 w-3" aria-hidden />
                {ALERTS.length} EVENTS
              </BrutalTag>
            }
          />
          <ul className="divide-y-2 divide-foreground">
            {ALERTS.map((a) => (
              <li
                key={a.id}
                className="flex flex-wrap items-center gap-3 p-4 transition-colors hover:bg-muted/40"
              >
                <span
                  className={cn(
                    'inline-flex items-center gap-1 border-2 border-foreground px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest',
                    SEVERITY_META[a.severity].tone,
                  )}
                >
                  {a.severity === 'critical' && (
                    <AlertTriangle className="h-3 w-3" aria-hidden />
                  )}
                  {SEVERITY_META[a.severity].label}
                </span>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {a.ts}
                </span>
                <span className="font-mono text-[11px] font-bold uppercase tracking-widest">
                  {a.block} · {a.module}
                </span>
                <span className="flex-1 text-sm">{a.message}</span>
                <button
                  onClick={() => {
                    const found = blocks.find((b) => b.name === a.block)
                    if (found) setDrillBlock(found)
                  }}
                  className="inline-flex items-center gap-1 border-2 border-foreground bg-background px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest brutal-shadow-sm hover:translate-x-[-1px] hover:translate-y-[-1px]"
                  style={{ borderRadius: 0 }}
                >
                  Inspect
                  <ChevronRight className="h-3 w-3" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </BrutalCard>
      </main>

      <BlockDrill
        block={drillBlock}
        rangeId={timeRange}
        onClose={() => setDrillBlock(null)}
      />
    </div>
  )
}
