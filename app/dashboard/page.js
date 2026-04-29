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
  Calendar,
  AlertTriangle,
  GitCompareArrows,
  Loader2,
  Share2,
  Award,
  ShoppingBag,
  Recycle,
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
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
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

import {
  KpiTile,
  FrameHeader,
  Sparkline,
  TooltipBox,
  TogglePill,
  MODULE_COLOR,
  fmtNum,
  SolarBanner,
} from '@/components/dashboard/DashboardComponents'
import { BlockDrill } from '@/components/dashboard/BlockDrill'
import { Marketplace } from '@/components/dashboard/Marketplace'
import { EvCanopy } from '@/components/dashboard/EvCanopy'
import { AuditLogs } from '@/components/dashboard/AuditLogs'
import { EcoProfile } from '@/components/dashboard/EcoProfile'
import { MaintenanceModal } from '@/components/dashboard/MaintenanceModal'
import { downloadCsv, downloadPdf } from '@/lib/export-utils'
import { motion, AnimatePresence } from 'framer-motion'

const STATUS_TONE = {
  optimal: 'primary',
  attention: 'warning',
  critical: 'destructive',
}

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

function DashboardPageContent() {
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
    decisionEngine: { routingMode: 'GRID_HYBRID', recommendation: 'No Action Required' }
  })
  const [alerts, setAlerts] = React.useState([])
  const [userRole, setUserRole] = React.useState(null)
  const [userCredits, setUserCredits] = React.useState(750)
  const [ads, setAds] = React.useState([])
  const [isMaintenanceOpen, setIsMaintenanceOpen] = React.useState(false)

  React.useEffect(() => {
    fetch('/api/ads').then(res => res.json()).then(setAds).catch(() => {})
  }, [])

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
          decisionEngine: res.decisionEngine || { routingMode: 'GRID_HYBRID', recommendation: 'No Action Required' }
        })
      })
      .catch((e) => !cancelled && toast.error('Failed to load metrics: ' + e.message))
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
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
    <AnimatePresence mode="wait">
      {!userRole ? (
        <motion.div 
          key="role-gate"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-foreground overflow-hidden"
        >
          <Navbar />
          {/* Background Ambient Glow */}
          <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="w-full max-w-4xl space-y-12 relative z-10">
            <div className="text-center space-y-4">
              <SectionEyebrow index="OS" label="Access Control" />
              <h1 className="font-display text-4xl sm:text-6xl font-semibold tracking-tighter leading-tight">
                Access Arasaka Energy OS <br/> <span className="text-muted-foreground">Select your identity</span>
              </h1>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {[
                { 
                  id: 'officer', 
                  label: 'Sustainability Officer', 
                  desc: 'Full campus oversight, autonomous audit logs, and export controls.',
                  icon: Building2
                },
                { 
                  id: 'manager', 
                  label: 'Facility Manager', 
                  desc: 'Maintenance workflows, ticket management, and hardware status.',
                  icon: Cpu
                },
                { 
                  id: 'student', 
                  label: 'Student Resident', 
                  desc: 'Recycling rewards, eco-marketplace, and personal impact tracking.',
                  icon: Leaf
                }
              ].map(role => (
                <motion.button 
                  key={role.id}
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setUserRole(role.id)}
                  className="group relative flex flex-col items-start p-6 bg-card/40 backdrop-blur-md border border-border hover:border-primary transition-all text-left"
                  style={{ borderRadius: 'var(--radius)' }}
                >
                  <div className="h-12 w-12 flex items-center justify-center bg-muted/20 border border-border mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <role.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2">{role.label}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{role.desc}</p>
                  <div className="mt-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Enter Console <ChevronRight className="h-3 w-3" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          key="dashboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen bg-background text-foreground"
        >
          <SolarBanner yield={data.totals.solar} />
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
              <Select value={userRole} onValueChange={setUserRole}>
                <SelectTrigger className="h-8 w-[140px] border-border bg-card text-[11px] font-bold uppercase tracking-widest">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="officer">Sustainability Officer</SelectItem>
                  <SelectItem value="manager">Facility Manager</SelectItem>
                  <SelectItem value="student">Student User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <h1 className="font-display mt-5 text-balance text-4xl font-semibold leading-[1.05] tracking-tighter sm:text-5xl">
              Campus Operating Layer
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Live KPIs, anomaly alerts and per-block drill-downs across every module of the
              blueprint. Filter state stays in the URL — share this view with anyone.
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
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setUserRole(null)}
              className="h-9 px-3 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground"
            >
              Switch Role
            </Button>
          </div>
        </div>

        {/* Global Decision Engine Banner */}
        {data.decisionEngine.recommendation !== 'No Action Required' && (
          <div className="flex items-center gap-3 border border-primary/30 bg-primary/5 p-4 text-sm font-medium">
             <Cpu className="h-4 w-4 text-primary" />
             <span className="text-primary/70">Decision Engine:</span>
             <span className="font-bold">{data.decisionEngine.recommendation}</span>
             <Tag tone="primary" className="ml-auto">Active Optimization</Tag>
          </div>
        )}

        {/* Filter bar - Optimized for Staff Roles */}
        {userRole !== 'student' && (
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
        )}

        {/* KPI row */}
        {/* KPI row - Role Specific */}
        <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {userRole === 'officer' && (
            <>
              <KpiTile index={1} label="Total consumption" value={fmtNum(totals.total)} suffix="kWh" delta={-12.4} icon={Zap} sub={`Window · ${timeRange}`} />
              <KpiTile index={2} label="Savings vs baseline" value={fmtNum(totals.savings)} suffix="kWh" delta={totals.savingsPct} icon={Cpu} sub={`${totals.savingsPct}% reduction`} />
              <KpiTile index={3} label="Solar generated" value={fmtNum(totals.solar)} suffix="kWh" delta={8.6} icon={Sun} sub="rooftops + canopies" />
              <KpiTile index={4} label="CO₂ avoided" value={fmtNum(totals.co2)} suffix="kg" delta={9.1} icon={Leaf} sub="grid-equivalent" />
            </>
          )}

          {userRole === 'manager' && (
            <>
              <KpiTile index={1} label="Total consumption" value={fmtNum(totals.total)} suffix="kWh" delta={-12.4} icon={Zap} sub={`Window · ${timeRange}`} />
              <KpiTile index={2} label="System Efficiency" value="94.2" suffix="%" delta={2.1} icon={Activity} sub="Active HVAC load" />
              <KpiTile index={3} label="Active Faults" value={blocks.filter(b => b.status !== 'optimal').length} suffix="Units" delta={0} icon={AlertTriangle} sub="Requires attention" />
              <KpiTile index={4} label="Solar Uptime" value="99.9" suffix="%" delta={0.1} icon={Sun} sub="Main array active" />
            </>
          )}

          {userRole === 'student' && (
            <>
              <KpiTile index={1} label="My Credits" value={userCredits} suffix="CR" delta={+15} icon={ShoppingBag} sub="Available to spend" />
              <KpiTile index={2} label="Bottles Recycled" value={Math.floor(userCredits / 10)} suffix="Units" delta={+4} icon={Award} sub="Personal semester total" />
              <KpiTile index={3} label="CO₂ Offset" value={(userCredits * 0.05).toFixed(1)} suffix="kg" delta={+1.2} icon={Leaf} sub="Individual impact" />
              <KpiTile index={4} label="Campus Savings" value={fmtNum(totals.savings)} suffix="kWh" delta={totals.savingsPct} icon={Cpu} sub="Collective effort" />
            </>
          )}
        </div>

        {/* Main charts - Role Filtered */}
        {userRole !== 'student' && (
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
        )}

        {/* Block ranking - Hide for students */}
        {userRole !== 'student' && (
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
        )}

        {/* Block grid - Hide for students */}
        {userRole !== 'student' && (
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
        )}

        {/* Alerts - Role Filtered */}
        {userRole !== 'student' && (
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
        )}

        {/* Phase 2: Integrated Systems */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Always show EV Canopy for context, but limit interaction for students */}
          <div className="lg:col-span-12">
            <EvCanopy ads={ads} />
          </div>
          
          {/* Marketplace is for Students */}
          {userRole === 'student' && (
            <div className="lg:col-span-12 mt-6 grid gap-6 md:grid-cols-12">
              <div className="md:col-span-8">
                <Marketplace 
                  credits={userCredits} 
                  onPurchase={(cost) => setUserCredits(prev => prev - cost)} 
                />
              </div>
              <div className="md:col-span-4">
                <EcoProfile credits={userCredits} />
              </div>
            </div>
          )}

          {/* Maintenance Actions for Managers */}
          {userRole === 'manager' && (
            <Card className="lg:col-span-12 mt-6 p-6">
               <div className="flex items-center justify-between">
                  <div>
                    <Kicker>Maintenance Console</Kicker>
                    <h3 className="font-display mt-1 text-2xl font-semibold tracking-tight">Active Workflows</h3>
                  </div>
                  <Button onClick={() => setIsMaintenanceOpen(true)} className="rounded-none font-bold uppercase tracking-widest">New Ticket</Button>
               </div>
               <div className="mt-8 overflow-x-auto">
                 <table className="w-full text-left">
                   <thead className="border-b border-border text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                     <tr>
                       <th className="pb-3 pr-4">Block</th>
                       <th className="pb-3 pr-4">Module</th>
                       <th className="pb-3 pr-4">Status</th>
                       <th className="pb-3 pr-4">Priority</th>
                       <th className="pb-3">Action</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-border">
                     {blocks.filter(b => b.status !== 'optimal').map(b => (
                       <tr key={b.id} className="text-sm">
                         <td className="py-4 pr-4 font-bold">{b.name}</td>
                         <td className="py-4 pr-4 text-muted-foreground">HVAC / Sensors</td>
                         <td className="py-4 pr-4"><Tag tone="warning">Pending</Tag></td>
                         <td className="py-4 pr-4 font-mono">HIGH</td>
                         <td className="py-4">
                           <Button variant="outline" size="sm" className="h-7 text-[10px] font-bold uppercase tracking-widest">Dispatch</Button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </Card>
          )}

          {/* Audit Logs for Sustainability Officers */}
          {userRole === 'officer' && (
            <div className="lg:col-span-12 mt-6">
              <AuditLogs />
            </div>
          )}
        </div>
      </main>

      <MaintenanceModal 
        isOpen={isMaintenanceOpen} 
        onClose={() => setIsMaintenanceOpen(false)} 
        blocks={blocks}
      />

      <BlockDrill
        block={drillBlock}
        rangeId={timeRange}
        summary={drillSummary}
        alerts={alerts}
        onClose={() => setDrillBlock(null)}
      />
      {/* Floating Quick Action Button for Students */}
      {userRole === 'student' && (
        <motion.div 
          className="fixed bottom-8 right-8 z-40"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button 
            className="h-16 w-16 rounded-full shadow-2xl bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center p-0 border-4 border-background"
            onClick={() => {
              toast.success("RVM Interface Linked. Scanning Bottle...");
              setTimeout(() => {
                setUserCredits(prev => prev + 10)
                toast.success("+10 Arasaka Credits Earned!")
              }, 1000)
            }}
          >
            <Recycle className="h-8 w-8" />
          </Button>
        </motion.div>
      )}
    </motion.div>
    )}
    </AnimatePresence>
  )
}

export default function DashboardPage() {
  return (
    <React.Suspense fallback={null}>
      <DashboardPageContent />
    </React.Suspense>
  )
}
