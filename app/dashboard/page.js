'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
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
  FileText,
  Filter,
  Leaf,
  RefreshCcw,
  Sun,
  Zap,
  X,
  Calendar,
  AlertTriangle,
  GitCompareArrows,
  Loader2,
  Share2,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Navbar } from '@/components/arasaka/navbar'
import { Card, Tag, SectionEyebrow, Kicker } from '@/components/arasaka/swiss'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import {
  BLOCKS,
  MODULES,
  TIME_RANGES,
  STATUS_META,
  SEVERITY_META,
} from '@/lib/dashboard-data'

const MODULE_COLOR = {
  hvac: 'hsl(var(--chart-1))',
  lighting: 'hsl(var(--chart-2))',
  ev: 'hsl(var(--chart-3))',
  water: 'hsl(var(--chart-4))',
  rvm: 'hsl(var(--chart-5))',
}

const fmtNum = (n) => {
  if (n == null || Number.isNaN(n)) return '—'
  if (Math.abs(n) >= 1000) return (n / 1000).toFixed(1) + 'k'
  return Math.round(n).toLocaleString('en-IN')
}

const STATUS_TONE = {
  optimal: 'primary',
  attention: 'warning',
  critical: 'destructive',
}

/* -------------------------------------------------------------------------- */
/*  Initial state from URL                                                    */
/* -------------------------------------------------------------------------- */

function getInitial(searchParams) {
  const moduleParam = searchParams?.get('modules')
  const validModules = new Set(MODULES.map((m) => m.id))
  const rangeParam = searchParams?.get('range')
  const validRange = TIME_RANGES.find((r) => r.id === rangeParam)
  const blockParam = searchParams?.get('block')
  const validBlock = blockParam === 'ALL' || BLOCKS.some((b) => b.id === blockParam)
  return {
    range: validRange ? rangeParam : '7d',
    block: validBlock ? blockParam : 'ALL',
    modules: moduleParam
      ? new Set(moduleParam.split(',').filter((m) => validModules.has(m)))
      : new Set(MODULES.map((m) => m.id)),
    compare: searchParams?.get('compare') === '1',
  }
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
          <Kicker>{label}</Kicker>
          <p className="font-display num-tabular mt-3 text-3xl font-semibold tracking-tighter">
            {value}
            {suffix && (
              <span className="ml-1 text-base font-medium text-muted-foreground">{suffix}</span>
            )}
          </p>
          {sub && <p className="mt-1.5 text-xs text-muted-foreground">{sub}</p>}
        </div>
        <div className="flex flex-col items-end gap-3">
          <span className="font-display num-tabular text-sm text-muted-foreground">
            {String(index).padStart(2, '0')}
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
              'inline-flex items-center gap-1 border px-2 py-0.5 text-[11px] font-semibold tracking-tight',
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
        {subtitle && <Kicker className="mt-1 block">{subtitle}</Kicker>}
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
      className="border border-border bg-popover p-2.5 text-[12px] shadow-sm"
      style={{ borderRadius: 'var(--radius)', fontFamily: 'var(--font-sora)' }}
    >
      <div className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {props.label}
      </div>
      {props.payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2" style={{ background: p.color }} />
            <span className="text-foreground">{p.name}</span>
          </span>
          <span className="font-display num-tabular font-semibold">{fmtNum(p.value)}</span>
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
        'inline-flex items-center gap-2 border px-3 py-1.5 text-[12px] font-medium tracking-tight transition-colors',
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
/*  Classroom heatmap                                                         */
/* -------------------------------------------------------------------------- */

function ClassroomHeatmap({ data, blockLabel }) {
  if (!data || !data.cells?.length) {
    return (
      <Card className="p-6 text-sm text-muted-foreground">
        Heatmap unavailable for this block.
      </Card>
    )
  }
  const flat = data.cells.flat()
  const peak = Math.max(...flat.map((c) => c.kwh))
  const avg = (flat.reduce((s, c) => s + c.kwh, 0) / flat.length).toFixed(1)

  return (
    <Card>
      <FrameHeader
        title="Classroom heatmap"
        subtitle={`${data.floors} floors · ${data.rooms} rooms per floor`}
        right={<Tag tone="muted">{flat.length} rooms</Tag>}
      />
      <div className="space-y-3 p-5">
        <div className="grid grid-cols-3 border border-border">
          {[
            ['Average', avg + ' kWh'],
            ['Peak', peak.toFixed(1) + ' kWh'],
            ['Hottest', flat.reduce((a, b) => (b.kwh > a.kwh ? b : a)).label],
          ].map(([k, v], i) => (
            <div key={k} className={i !== 0 ? 'border-l border-border p-3' : 'p-3'}>
              <Kicker>{k}</Kicker>
              <p className="font-display num-tabular mt-0.5 text-sm font-semibold tracking-tight">{v}</p>
            </div>
          ))}
        </div>

        <div className="space-y-1.5 pt-2">
          {data.cells.map((row, f) => (
            <div key={f} className="flex items-center gap-3">
              <span className="font-display num-tabular w-8 text-xs text-muted-foreground">
                F{data.floors - f}
              </span>
              <div
                className="grid flex-1 gap-1"
                style={{ gridTemplateColumns: `repeat(${data.rooms}, minmax(0, 1fr))` }}
              >
                {row.map((c) => (
                  <div
                    key={c.label}
                    role="img"
                    aria-label={`${c.label} ${c.kwh} kWh, ${c.occupancy} occupants`}
                    title={`${c.label} · ${c.kwh} kWh · ${c.occupancy} occ.`}
                    className="aspect-square border border-border transition-transform hover:scale-110 hover:border-foreground"
                    style={{
                      background: `hsl(var(--primary) / ${(0.12 + c.intensity * 0.78).toFixed(3)})`,
                      borderRadius: 'var(--radius)',
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-border pt-3">
          <Kicker>{blockLabel} · intensity scale</Kicker>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground">Low</span>
            <div className="flex h-2 w-32 overflow-hidden border border-border" style={{ borderRadius: 'var(--radius)' }}>
              {[0.15, 0.3, 0.45, 0.6, 0.75, 0.9].map((v) => (
                <span
                  key={v}
                  className="flex-1"
                  style={{ background: `hsl(var(--primary) / ${v})` }}
                  aria-hidden
                />
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground">High</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

/* -------------------------------------------------------------------------- */
/*  Drill-down sheet                                                          */
/* -------------------------------------------------------------------------- */

function BlockDrill({ block, rangeId, summary, onClose, alerts }) {
  const open = !!block
  const [series, setSeries] = React.useState([])
  const [heatmap, setHeatmap] = React.useState(null)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (!block) return
    let cancelled = false
    setLoading(true)
    Promise.all([
      fetch(`/api/metrics?range=${rangeId}&block=${block.id}`).then((r) => r.json()),
      fetch(`/api/blocks/${block.id}/classrooms?range=${rangeId}`).then((r) => r.json()),
    ])
      .then(([metrics, hm]) => {
        if (cancelled) return
        setSeries(metrics?.series || [])
        setHeatmap(hm)
      })
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [block, rangeId])

  const moduleBars = React.useMemo(() => {
    if (!series.length) return []
    return [
      { module: 'HVAC', value: +series.reduce((s, p) => s + p.hvac, 0).toFixed(1), color: MODULE_COLOR.hvac },
      { module: 'Lighting', value: +series.reduce((s, p) => s + p.lighting, 0).toFixed(1), color: MODULE_COLOR.lighting },
      { module: 'EV', value: +series.reduce((s, p) => s + p.ev, 0).toFixed(1), color: MODULE_COLOR.ev },
      { module: 'Water', value: +series.reduce((s, p) => s + p.water, 0).toFixed(1), color: MODULE_COLOR.water },
      { module: 'RVM', value: +series.reduce((s, p) => s + p.rvm, 0).toFixed(1), color: MODULE_COLOR.rvm },
    ]
  }, [series])

  const blockAlerts = React.useMemo(
    () => alerts.filter((a) => a.block === block?.name),
    [alerts, block?.name],
  )

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="w-full max-w-2xl overflow-y-auto border-l border-border p-0 sm:max-w-2xl"
        style={{ borderRadius: 0 }}
      >
        {block && summary && (
          <div className="flex h-full flex-col">
            <SheetHeader className="border-b border-border bg-card p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Tag tone="primary">{block.kind}</Tag>
                    <Tag tone={STATUS_TONE[block.status]}>
                      <span className="h-1.5 w-1.5 animate-pulse bg-current" aria-hidden />
                      {STATUS_META[block.status].label}
                    </Tag>
                    {loading && (
                      <Tag tone="muted">
                        <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
                        Loading
                      </Tag>
                    )}
                  </div>
                  <SheetTitle className="font-display mt-4 text-3xl font-semibold tracking-tighter">
                    {block.name}
                  </SheetTitle>
                  <SheetDescription className="mt-2 text-[12px] font-medium tracking-tight text-muted-foreground">
                    Block ID: <span className="font-display num-tabular text-foreground">{block.id}</span>
                    {' '}· {block.area.toLocaleString()} sqft · {block.capacity} occupancy
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
              <div className="grid grid-cols-2 gap-px border border-border bg-border md:grid-cols-4">
                {[
                  { k: 'Total', v: fmtNum(summary.total), s: 'kWh' },
                  { k: 'Solar', v: fmtNum(summary.solar), s: 'kWh' },
                  { k: 'Savings', v: summary.savingsPct + '%', s: 'vs baseline' },
                  { k: 'CO₂ avoided', v: fmtNum(summary.co2), s: 'kg' },
                ].map((kpi) => (
                  <div key={kpi.k} className="bg-card p-4">
                    <Kicker>{kpi.k}</Kicker>
                    <p className="font-display num-tabular mt-1 text-xl font-semibold tracking-tighter">
                      {kpi.v}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{kpi.s}</p>
                  </div>
                ))}
              </div>

              <Card>
                <FrameHeader title="Energy by module" subtitle={`Range · ${rangeId}`} />
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
                        fontSize={11}
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

              <ClassroomHeatmap data={heatmap} blockLabel={block.name} />

              <Card>
                <FrameHeader title="Consumption trend" subtitle={`${rangeId} · total kWh`} />
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
                      <XAxis dataKey="t" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }} />
                      <Tooltip content={<TooltipBox />} />
                      <Area
                        type="monotone"
                        dataKey="total"
                        name="Total"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        fill="url(#drillGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <div>
                <Kicker>Recent alerts</Kicker>
                <div className="mt-3">
                  {blockAlerts.length === 0 ? (
                    <Card className="p-4">
                      <p className="text-sm text-muted-foreground">
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
                            <p className="text-[12px] font-medium tracking-tight text-muted-foreground">
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
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

/* -------------------------------------------------------------------------- */
/*  Export helpers                                                            */
/* -------------------------------------------------------------------------- */

function downloadCsv({ series, totals, blocks, meta }) {
  const lines = []
  lines.push(`# ARASAKA — Campus Operating Layer`)
  lines.push(`# Range: ${meta.range} · Block: ${meta.block} · Generated: ${new Date().toISOString()}`)
  lines.push('')
  lines.push('# KPI totals')
  lines.push('metric,value')
  Object.entries(totals).forEach(([k, v]) => lines.push(`${k},${v}`))
  lines.push('')
  lines.push('# Time series')
  lines.push('time,hvac,lighting,ev,water,rvm,solar,total,baseline,net')
  series.forEach((p) => {
    lines.push(
      [p.t, p.hvac, p.lighting, p.ev, p.water, p.rvm, p.solar, p.total, p.baseline, p.net].join(','),
    )
  })
  lines.push('')
  lines.push('# Per-block summary')
  lines.push('id,name,kind,total,solar,baseline,savings,savings_pct,co2,status')
  blocks.forEach((b) => {
    lines.push(
      [b.id, b.name, b.kind, b.total, b.solar, b.baseline, b.savings, b.savingsPct, b.co2, b.status].join(','),
    )
  })
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `arasaka-${meta.range}-${meta.block}-${Date.now()}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

async function downloadPdf({ series, totals, blocks, meta }) {
  // Lazy-load to keep first paint fast
  const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ])

  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const margin = 40
  const w = doc.internal.pageSize.getWidth()

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.text('ARASAKA', margin, margin + 10)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.setTextColor(80)
  doc.text('Campus Operating Layer — Console Export', margin, margin + 28)

  doc.setFontSize(9)
  doc.setTextColor(120)
  doc.text(
    `Range: ${meta.range.toUpperCase()}  ·  Block: ${meta.block}  ·  Generated: ${new Date().toLocaleString('en-IN')}`,
    margin,
    margin + 44,
  )

  doc.setDrawColor(40, 122, 76)
  doc.setLineWidth(2)
  doc.line(margin, margin + 56, w - margin, margin + 56)

  doc.setTextColor(20)
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.text('KPI summary', margin, margin + 80)

  autoTable(doc, {
    startY: margin + 90,
    head: [['Metric', 'Value']],
    body: [
      ['Total consumption', `${totals.total.toLocaleString()} kWh`],
      ['Baseline', `${totals.baseline.toLocaleString()} kWh`],
      ['Savings vs baseline', `${totals.savings.toLocaleString()} kWh (${totals.savingsPct}%)`],
      ['Solar generated', `${totals.solar.toLocaleString()} kWh`],
      ['CO₂ avoided', `${totals.co2.toLocaleString()} kg`],
    ],
    styles: { font: 'helvetica', fontSize: 10, cellPadding: 6 },
    headStyles: { fillColor: [20, 20, 20], textColor: 255, halign: 'left' },
    alternateRowStyles: { fillColor: [248, 248, 244] },
    margin: { left: margin, right: margin },
  })

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.text('Per-block performance', margin, doc.lastAutoTable.finalY + 28)

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 38,
    head: [['Block', 'Kind', 'Total kWh', 'Solar kWh', 'Savings %', 'CO₂ kg', 'Status']],
    body: blocks.map((b) => [
      b.name,
      b.kind,
      b.total.toLocaleString(),
      b.solar.toLocaleString(),
      `${b.savingsPct}%`,
      b.co2.toLocaleString(),
      b.status.toUpperCase(),
    ]),
    styles: { font: 'helvetica', fontSize: 9, cellPadding: 5 },
    headStyles: { fillColor: [20, 20, 20], textColor: 255 },
    margin: { left: margin, right: margin },
  })

  doc.addPage()
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.text(`Time-series · ${meta.range.toUpperCase()}`, margin, margin + 10)
  autoTable(doc, {
    startY: margin + 22,
    head: [['Time', 'HVAC', 'Lighting', 'EV', 'Water', 'RVM', 'Solar', 'Total', 'Baseline']],
    body: series.map((p) => [
      p.t,
      p.hvac,
      p.lighting,
      p.ev,
      p.water,
      p.rvm,
      p.solar,
      p.total,
      p.baseline,
    ]),
    styles: { font: 'helvetica', fontSize: 8, cellPadding: 4 },
    headStyles: { fillColor: [20, 20, 20], textColor: 255 },
    margin: { left: margin, right: margin },
  })

  doc.setFontSize(8)
  doc.setTextColor(140)
  const pages = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i)
    doc.text(
      `ARASAKA · v0.1 · Page ${i} of ${pages}`,
      margin,
      doc.internal.pageSize.getHeight() - 16,
    )
  }

  doc.save(`arasaka-${meta.range}-${meta.block}-${Date.now()}.pdf`)
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function DashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [timeRange, setTimeRange] = React.useState(() => getInitial(searchParams).range)
  const [focusBlock, setFocusBlock] = React.useState(() => getInitial(searchParams).block)
  const [enabledModules, setEnabledModules] = React.useState(
    () => getInitial(searchParams).modules,
  )
  const [compare, setCompare] = React.useState(() => getInitial(searchParams).compare)

  const [drillBlock, setDrillBlock] = React.useState(null)
  const [tick, setTick] = React.useState(0)
  const [loading, setLoading] = React.useState(true)
  const [data, setData] = React.useState({
    series: [],
    totals: { total: 0, baseline: 0, solar: 0, savings: 0, savingsPct: 0, co2: 0 },
    blocks: [],
    prior: null,
  })
  const [alerts, setAlerts] = React.useState([])

  // Live tick
  React.useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 18000)
    return () => clearInterval(id)
  }, [])

  // Sync state -> URL
  React.useEffect(() => {
    const sp = new URLSearchParams()
    sp.set('range', timeRange)
    if (focusBlock !== 'ALL') sp.set('block', focusBlock)
    if (enabledModules.size !== MODULES.length) {
      sp.set('modules', [...enabledModules].join(','))
    }
    if (compare) sp.set('compare', '1')
    const qs = sp.toString()
    router.replace('/dashboard' + (qs ? '?' + qs : ''), { scroll: false })
  }, [timeRange, focusBlock, enabledModules, compare, router])

  // Fetch metrics from API
  React.useEffect(() => {
    let cancelled = false
    const sp = new URLSearchParams({
      range: timeRange,
      block: focusBlock,
      modules: [...enabledModules].join(','),
      compare: compare ? '1' : '0',
      tick: String(tick),
    })
    setLoading(true)
    fetch('/api/metrics?' + sp.toString())
      .then((r) => r.json())
      .then((res) => {
        if (cancelled) return
        if (res?.error) throw new Error(res.error)
        setData({
          series: res.series || [],
          totals: res.totals || data.totals,
          blocks: res.blocks || [],
          prior: res.prior || null,
        })
      })
      .catch((e) => !cancelled && toast.error('Failed to load metrics: ' + e.message))
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange, focusBlock, enabledModules, compare, tick])

  // Fetch alerts once
  React.useEffect(() => {
    fetch('/api/alerts')
      .then((r) => r.json())
      .then((res) => setAlerts(res?.alerts || []))
      .catch(() => {})
  }, [])

  const series = data.series
  const totals = data.totals
  const blocks = data.blocks

  const chartData = React.useMemo(() => {
    if (!series.length) return []
    return series.map((s, i) => ({
      ...s,
      prior_total: data.prior?.[i]?.prior_total,
    }))
  }, [series, data.prior])

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
    if (!series.length) return []
    const sum = (k) => series.reduce((s, p) => s + p[k], 0)
    return [
      { name: 'HVAC', value: +sum('hvac').toFixed(1), color: MODULE_COLOR.hvac },
      { name: 'Lighting', value: +sum('lighting').toFixed(1), color: MODULE_COLOR.lighting },
      { name: 'EV', value: +sum('ev').toFixed(1), color: MODULE_COLOR.ev },
      { name: 'Water', value: +sum('water').toFixed(1), color: MODULE_COLOR.water },
      { name: 'RVM', value: +sum('rvm').toFixed(1), color: MODULE_COLOR.rvm },
    ].filter((d) => d.value > 0)
  }, [series])

  const drillSummary = React.useMemo(
    () => blocks.find((b) => b.id === drillBlock?.id),
    [blocks, drillBlock?.id],
  )

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

  const meta = { range: timeRange, block: focusBlock, modules: [...enabledModules] }

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Shareable link copied to clipboard')
    } catch {
      toast.error('Could not copy link')
    }
  }

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
                className="inline-flex items-center gap-1.5 border border-border bg-card px-2.5 py-1 text-[12px] font-medium tracking-tight text-muted-foreground hover:text-foreground"
                style={{ borderRadius: 'var(--radius)' }}
              >
                <ArrowLeft className="h-3 w-3" aria-hidden />
                Home
              </Link>
              <SectionEyebrow index="00" label="Console · Live" />
              {loading && (
                <span className="inline-flex items-center gap-1.5 text-[12px] font-medium tracking-tight text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
                  Syncing
                </span>
              )}
            </div>
            <h1 className="font-display mt-5 text-balance text-4xl font-semibold leading-[1.05] tracking-tighter sm:text-5xl">
              Campus Operating Layer
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Live KPIs, anomaly alerts and per-block drill-downs across every module of the
              ARASAKA blueprint. Filter state stays in the URL — share this view with anyone.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:col-span-4 md:justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={copyShareLink}
              className="h-9 border border-border bg-card text-[12px] font-medium tracking-tight hover:bg-muted"
              style={{ borderRadius: 'var(--radius)' }}
            >
              <Share2 className="mr-2 h-3.5 w-3.5" aria-hidden />
              Share
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={refresh}
              className="h-9 border border-border bg-card text-[12px] font-medium tracking-tight hover:bg-muted"
              style={{ borderRadius: 'var(--radius)' }}
            >
              <RefreshCcw className="mr-2 h-3.5 w-3.5" aria-hidden />
              Refresh
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  className="h-9 bg-foreground text-[12px] font-semibold tracking-tight text-background hover:bg-foreground/90"
                  style={{ borderRadius: 'var(--radius)' }}
                >
                  <Download className="mr-2 h-3.5 w-3.5" aria-hidden />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="border border-border" style={{ borderRadius: 'var(--radius)' }}>
                <DropdownMenuItem
                  onClick={() => downloadCsv({ series, totals, blocks, meta })}
                  className="text-sm"
                >
                  <FileText className="mr-2 h-4 w-4" aria-hidden />
                  Download CSV
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    toast.promise(downloadPdf({ series, totals, blocks, meta }), {
                      loading: 'Generating PDF…',
                      success: 'PDF downloaded',
                      error: 'PDF generation failed',
                    })
                  }}
                  className="text-sm"
                >
                  <FileText className="mr-2 h-4 w-4" aria-hidden />
                  Download PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Filter bar */}
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden />
              <Kicker>Time range</Kicker>
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
                      'border-r border-border px-3 py-1.5 text-[12px] font-semibold tracking-tight transition-colors last:border-r-0',
                      timeRange === r.id
                        ? 'bg-foreground text-background'
                        : 'bg-card text-muted-foreground hover:bg-muted hover:text-foreground',
                    )}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setCompare((v) => !v)}
                aria-pressed={compare}
                className={cn(
                  'inline-flex items-center gap-1.5 border px-3 py-1.5 text-[12px] font-medium tracking-tight transition-colors',
                  compare
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
                style={{ borderRadius: 'var(--radius)' }}
              >
                <GitCompareArrows className="h-3.5 w-3.5" aria-hidden />
                Compare prior
              </button>
            </div>
            <div className="flex items-center gap-3">
              <Building2 className="h-4 w-4 text-muted-foreground" aria-hidden />
              <Kicker>Focus</Kicker>
              <Select value={focusBlock} onValueChange={setFocusBlock}>
                <SelectTrigger
                  className="h-9 w-[180px] border border-border bg-card text-[12px] font-medium tracking-tight"
                  style={{ borderRadius: 'var(--radius)' }}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  className="border border-border"
                  style={{ borderRadius: 'var(--radius)' }}
                >
                  <SelectItem value="ALL" className="text-[12px] font-medium">
                    All blocks
                  </SelectItem>
                  {BLOCKS.map((b) => (
                    <SelectItem
                      key={b.id}
                      value={b.id}
                      className="text-[12px] font-medium"
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
            <Kicker className="mr-1">Modules</Kicker>
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
            label="Total consumption"
            value={fmtNum(totals.total)}
            suffix="kWh"
            delta={-12.4}
            icon={Zap}
            sub={`Window · ${timeRange}`}
          />
          <KpiTile
            index={2}
            label="Savings vs baseline"
            value={fmtNum(totals.savings)}
            suffix="kWh"
            delta={totals.savingsPct}
            icon={Cpu}
            sub={`${totals.savingsPct}% reduction`}
          />
          <KpiTile
            index={3}
            label="Solar generated"
            value={fmtNum(totals.solar)}
            suffix="kWh"
            delta={8.6}
            icon={Sun}
            sub="rooftops + canopies"
          />
          <KpiTile
            index={4}
            label="CO₂ avoided"
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
              title="Energy by source"
              subtitle={`${timeRange} · stacked · kWh`}
              right={
                <div className="flex items-center gap-2">
                  {compare && <Tag tone="primary">Comparing prior</Tag>}
                  <Tag tone="primary">
                    <Activity className="h-3 w-3" aria-hidden />
                    Live
                  </Tag>
                </div>
              }
            />
            <div className="h-[340px] p-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
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
                      fontFamily: 'var(--font-sora)',
                    }}
                  />
                  {enabledModules.has('hvac') && (
                    <Area type="monotone" dataKey="hvac" name="HVAC" stackId="1" stroke={MODULE_COLOR.hvac} strokeWidth={1.5} fill="url(#g-hvac)" />
                  )}
                  {enabledModules.has('lighting') && (
                    <Area type="monotone" dataKey="lighting" name="Lighting" stackId="1" stroke={MODULE_COLOR.lighting} strokeWidth={1.5} fill="url(#g-lighting)" />
                  )}
                  {enabledModules.has('ev') && (
                    <Area type="monotone" dataKey="ev" name="EV" stackId="1" stroke={MODULE_COLOR.ev} strokeWidth={1.5} fill="url(#g-ev)" />
                  )}
                  {enabledModules.has('water') && (
                    <Area type="monotone" dataKey="water" name="Water" stackId="1" stroke={MODULE_COLOR.water} strokeWidth={1.5} fill="url(#g-water)" />
                  )}
                  {enabledModules.has('rvm') && (
                    <Area type="monotone" dataKey="rvm" name="RVM" stackId="1" stroke={MODULE_COLOR.rvm} strokeWidth={1.5} fill="url(#g-rvm)" />
                  )}
                  {enabledModules.has('solar') && (
                    <Area
                      type="monotone"
                      dataKey="solar"
                      name="Solar"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fill="transparent"
                      strokeDasharray="5 3"
                    />
                  )}
                  {compare && data.prior && (
                    <Line
                      type="monotone"
                      dataKey="prior_total"
                      name="Prior period"
                      stroke="hsl(var(--muted-foreground))"
                      strokeWidth={2}
                      strokeDasharray="6 4"
                      dot={false}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <FrameHeader title="Source mix" subtitle={`${timeRange} · % share`} />
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
                      fontFamily: 'var(--font-sora)',
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
            title="Per-block performance"
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
                <Bar dataKey="savings" name="Savings" fill="hsl(var(--primary))" radius={[1, 1, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Block grid */}
        <div>
          <div className="mb-4 flex items-end justify-between">
            <SectionEyebrow index="08" label="Blocks" />
            <Kicker>Click any block to drill-down</Kicker>
          </div>
          <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {blocks.map((b) => (
              <button
                key={b.id}
                onClick={() => setDrillBlock(b)}
                className="group bg-card p-5 text-left transition-colors hover:bg-muted/40"
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <Kicker>{b.kind}</Kicker>
                    <h3 className="font-display mt-0.5 truncate text-base font-semibold leading-tight tracking-tight">
                      {b.name}
                    </h3>
                  </div>
                  <Tag tone={STATUS_TONE[b.status]} className="text-[9px]">
                    {STATUS_META[b.status].label}
                  </Tag>
                </div>
                <div className="mt-4">
                  <Kicker>Total · {timeRange}</Kicker>
                  <p className="font-display num-tabular mt-1 text-3xl font-semibold tracking-tighter">
                    {fmtNum(b.total)}
                    <span className="ml-1 text-xs font-medium text-muted-foreground">kWh</span>
                  </p>
                </div>
                <div className="mt-3">
                  <Sparkline data={b.spark} />
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                  <span className="inline-flex items-center gap-1 text-[12px] font-medium tracking-tight">
                    <ArrowDownRight className="h-3 w-3 text-primary" aria-hidden />
                    <span className="text-primary">{b.savingsPct}%</span>
                    <span className="text-muted-foreground">saved</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-[12px] font-medium tracking-tight text-muted-foreground transition-colors group-hover:text-foreground">
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
            title="Anomaly & event log"
            subtitle="System-wide · live stream"
            right={
              <Tag tone="warning">
                <Bell className="h-3 w-3" aria-hidden />
                {alerts.length} events
              </Tag>
            }
          />
          <ul className="divide-y divide-border">
            {alerts.map((a) => (
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
                <span className="text-[12px] font-medium tracking-tight text-muted-foreground">
                  {a.ts}
                </span>
                <span className="text-[13px] font-semibold tracking-tight">
                  {a.block} · {a.module}
                </span>
                <span className="flex-1 text-sm">{a.message}</span>
                <button
                  onClick={() => {
                    const found = blocks.find((bl) => bl.name === a.block)
                    if (found) setDrillBlock(found)
                  }}
                  className="inline-flex items-center gap-1 border border-border bg-card px-2.5 py-1 text-[12px] font-medium tracking-tight hover:bg-muted"
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
        summary={drillSummary}
        alerts={alerts}
        onClose={() => setDrillBlock(null)}
      />
    </div>
  )
}
