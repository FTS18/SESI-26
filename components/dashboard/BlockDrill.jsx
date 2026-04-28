'use client'

import * as React from 'react'
import { X, Loader2 } from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from 'recharts'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Card, Tag, Kicker } from '@/components/arasaka/swiss'
import { FrameHeader, TooltipBox, MODULE_COLOR, fmtNum } from './DashboardComponents'
import { ClassroomHeatmap } from './ClassroomHeatmap'
import { STATUS_META, SEVERITY_META } from '@/lib/dashboard-data'

const STATUS_TONE = {
  optimal: 'primary',
  attention: 'warning',
  critical: 'destructive',
}

export function BlockDrill({ block, rangeId, summary, onClose, alerts }) {
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
