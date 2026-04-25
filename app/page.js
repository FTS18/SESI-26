'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
  ArrowDown,
  ArrowUpRight,
  CheckCircle2,
  Cpu,
  Cloud,
  Settings2,
  TrendingUp,
  Github,
  Linkedin,
  Mail,
  Activity,
  Wifi,
  ShieldCheck,
  Mic,
  Plus,
} from 'lucide-react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from 'recharts'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

import { Navbar } from '@/components/arasaka/navbar'
import { VoiceButton } from '@/components/arasaka/voice-button'
import { Card, Tag, SectionEyebrow } from '@/components/arasaka/swiss'
import {
  PROBLEMS,
  SOLUTIONS,
  KPIS,
  MONTHLY_SAVINGS,
  SOLAR_GENERATION,
  REVENUE_MIX,
  ROI_PHASES,
  TIMELINE,
  TEAM,
} from '@/lib/arasaka-data'

/* -------------------------------------------------------------------------- */
/*  Reveal                                                                    */
/* -------------------------------------------------------------------------- */

function Reveal({ children, delay = 0, y = 14, className = '' }) {
  const reduced = useReducedMotion()
  if (reduced) return <div className={className}>{children}</div>
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function SectionHeader({ index, label, title, description, action }) {
  return (
    <div className="grid items-end gap-8 md:grid-cols-12 md:gap-12">
      <div className="md:col-span-8">
        <Reveal>
          <SectionEyebrow index={index} label={label} />
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-display mt-5 text-balance text-4xl font-semibold leading-[1.05] tracking-tighter sm:text-5xl md:text-[3.5rem]">
            {title}
          </h2>
        </Reveal>
        {description && (
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
              {description}
            </p>
          </Reveal>
        )}
      </div>
      {action && (
        <Reveal delay={0.15} className="md:col-span-4 md:flex md:justify-end">
          {action}
        </Reveal>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Top meta strip                                                            */
/* -------------------------------------------------------------------------- */

function MetaStrip() {
  const items = [
    'EDITION 01 · 2026',
    'CLIMATE-TECH BLUEPRINT',
    '8 MODULES · ONE OPERATING LAYER',
    '25% ENERGY CUT',
    '₹2.4 CR ANNUAL · 4,200 t CO₂',
    'VOICE-NAVIGABLE · WCAG-FRIENDLY',
  ]
  const row = items.concat(items)
  return (
    <div className="overflow-hidden border-y border-border bg-card">
      <div className="flex">
        <div className="marquee-track flex shrink-0 animate-marquee items-center gap-12 py-2.5 pr-12">
          {row.map((t, i) => (
            <span
              key={i}
              className="inline-flex shrink-0 items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground"
            >
              <span className="h-1 w-1 bg-primary" aria-hidden />
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Hero                                                                      */
/* -------------------------------------------------------------------------- */

function Hero() {
  const data = [
    { x: 1, y: 14 }, { x: 2, y: 18 }, { x: 3, y: 16 },
    { x: 4, y: 22 }, { x: 5, y: 26 }, { x: 6, y: 25 },
    { x: 7, y: 30 }, { x: 8, y: 33 }, { x: 9, y: 39 },
    { x: 10, y: 42 }, { x: 11, y: 47 }, { x: 12, y: 52 },
  ]

  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden pb-20 pt-28 sm:pb-28 sm:pt-32"
      aria-label="Hero"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 grid-pattern radial-fade"
        aria-hidden
      />
      <div className="container">
        {/* Top meta row */}
        <Reveal>
          <div className="mb-12 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
            <div className="flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              <span className="text-foreground">A —</span>
              <span>Integrated Campus Energy &amp; Circular Utility Blueprint</span>
            </div>
            <div className="flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 animate-pulse bg-primary" aria-hidden />
                LIVE PILOT — BLOCK A
              </span>
              <span className="hidden sm:inline">·</span>
              <span className="hidden sm:inline">v0.1 · 2026</span>
            </div>
          </div>
        </Reveal>

        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left column */}
          <div className="lg:col-span-7">
            <Reveal delay={0.05}>
              <SectionEyebrow index="00" label="Overview" />
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="font-display mt-6 text-balance text-[2.75rem] font-semibold leading-[0.96] tracking-tightest sm:text-[4.25rem] lg:text-[5.5rem]">
                Smart campus
                <br />
                operating <span className="text-primary">layer.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-7 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
                A unified system that cuts waste, prioritizes solar, and rewards
                recycling — across classrooms, rooftops and EVs. Every kilowatt
                accounted for, every kilogram diverted.
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="mt-9 flex flex-col flex-wrap items-stretch gap-3 sm:flex-row sm:items-center">
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="h-11 w-full gap-2 bg-foreground px-5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-background hover:bg-foreground/90 sm:w-auto"
                    style={{ borderRadius: 'var(--radius)' }}
                  >
                    Open Dashboard
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </Button>
                </Link>
                <a href="#roi">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-11 w-full gap-2 border border-border bg-card px-5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] hover:bg-muted sm:w-auto"
                    style={{ borderRadius: 'var(--radius)' }}
                  >
                    <TrendingUp className="h-4 w-4" aria-hidden />
                    Explore ROI
                  </Button>
                </a>
                <VoiceButton />
              </div>
            </Reveal>

            {/* Stats grid */}
            <Reveal delay={0.22}>
              <dl className="mt-14 grid max-w-2xl grid-cols-3 border-t border-border pt-6">
                {[
                  { k: '25%', v: 'Energy reduced', m: '/ blocks' },
                  { k: '₹2.4 Cr', v: 'Annual savings', m: '/ verified' },
                  { k: '3.8 yr', v: 'Payback period', m: '/ blended' },
                ].map((s, i) => (
                  <div
                    key={s.v}
                    className={`pr-4 ${i !== 0 ? 'border-l border-border pl-4' : ''}`}
                  >
                    <dt className="font-display num-tabular text-3xl font-semibold tracking-tighter sm:text-4xl">
                      {s.k}
                    </dt>
                    <dd className="mt-2 text-sm font-medium text-foreground">{s.v}</dd>
                    <dd className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      {s.m}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          {/* Right column — visual card */}
          <Reveal delay={0.1} className="lg:col-span-5">
            <Card className="overflow-hidden">
              <div className="relative h-56 border-b border-border sm:h-64">
                <Image
                  src="https://images.pexels.com/photos/29206500/pexels-photo-29206500.jpeg"
                  alt="Rooftop solar panels powering a smart campus"
                  fill
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" aria-hidden />
                <div className="absolute left-3 top-3">
                  <Tag tone="primary">
                    <span className="h-1.5 w-1.5 animate-pulse bg-primary" aria-hidden />
                    Live · Block A · 4.2 MW
                  </Tag>
                </div>
                <div className="absolute right-3 top-3">
                  <Tag tone="muted">REC #ARS-0421</Tag>
                </div>
              </div>
              <div className="space-y-5 p-5">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                      Today's solar yield
                    </p>
                    <p className="mt-1 font-display num-tabular text-3xl font-semibold tracking-tighter">
                      612 <span className="text-base font-medium text-muted-foreground">kWh</span>
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1 font-mono text-xs font-medium text-primary">
                      ↑ 12.4% vs yesterday
                    </p>
                  </div>
                  <Tag tone="primary">On-track</Tag>
                </div>
                <div className="h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 6, right: 0, bottom: 0, left: 0 }}>
                      <defs>
                        <linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.45} />
                          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="y"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        fill="url(#heroGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 border-t border-border pt-4">
                  {[
                    ['CO₂ saved', '3.1 t'],
                    ['EVs charged', '142'],
                    ['Bottles', '2,841'],
                  ].map(([k, v], i) => (
                    <div key={k} className={i !== 0 ? 'border-l border-border pl-3' : ''}>
                      <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                        {k}
                      </p>
                      <p className="mt-1 font-mono num-tabular text-base font-semibold">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </Reveal>
        </div>

        {/* Scroll affordance */}
        <Reveal delay={0.25}>
          <a
            href="#problem"
            className="mt-16 flex w-fit items-center gap-2 border border-border bg-card px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
            style={{ borderRadius: 'var(--radius)' }}
          >
            <ArrowDown className="h-3.5 w-3.5" aria-hidden />
            Scroll
          </a>
        </Reveal>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  Problem                                                                   */
/* -------------------------------------------------------------------------- */

function ProblemSection() {
  return (
    <section id="problem" className="border-t border-border py-24 sm:py-32" aria-labelledby="problem-title">
      <div className="container">
        <SectionHeader
          index="01"
          label="Problem"
          title="Campuses leak energy, money and materials — every single day."
          description="Disconnected systems, no visibility, zero accountability. Campuses pay for waste they can't even see."
        />
        <div className="mt-14 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {PROBLEMS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.04}>
              <div className="group h-full bg-card p-6 transition-colors hover:bg-muted/60">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center border border-border bg-background text-foreground transition-colors group-hover:border-primary/40 group-hover:text-primary">
                    <p.icon className="h-5 w-5" aria-hidden />
                  </div>
                  <span className="font-mono text-[11px] font-medium tracking-[0.18em] text-muted-foreground">
                    P/{String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="font-display mt-6 text-lg font-semibold leading-snug tracking-tight">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                  <span className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-primary">
                    {p.stat}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  Solutions                                                                 */
/* -------------------------------------------------------------------------- */

function SolutionsSection() {
  return (
    <section id="solutions" className="border-t border-border bg-secondary/40 py-24 sm:py-32" aria-labelledby="solutions-title">
      <div className="container">
        <SectionHeader
          index="02"
          label="Solution Modules"
          title="Eight modules. One operating layer."
          description="Plug-and-play building blocks that turn legacy infrastructure into a smart, accountable, circular campus."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SOLUTIONS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.04}>
              <Card className="group h-full transition-colors hover:border-primary/40">
                <div className="flex items-start justify-between border-b border-border p-5">
                  <div className="flex h-10 w-10 items-center justify-center border border-border bg-background text-foreground transition-colors group-hover:border-primary/40 group-hover:text-primary">
                    <s.icon className="h-5 w-5" aria-hidden />
                  </div>
                  <Tag tone="outline">{s.tag}</Tag>
                </div>
                <div className="space-y-3 p-5">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-[11px] font-medium tracking-[0.2em] text-muted-foreground">
                      M/{String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-display text-base font-semibold leading-snug tracking-tight">
                      {s.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                  <div className="flex items-center justify-end pt-2">
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" aria-hidden />
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  KPI Snapshot                                                              */
/* -------------------------------------------------------------------------- */

const PIE_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
]

function ChartFrame({ title, subtitle, children, className = '' }) {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="flex items-start justify-between border-b border-border p-5">
        <div>
          <h3 className="font-display text-base font-semibold leading-tight tracking-tight">{title}</h3>
          <p className="mt-1 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {subtitle}
          </p>
        </div>
        <Tag tone="primary">
          <Activity className="h-3 w-3" aria-hidden />
          Live
        </Tag>
      </div>
      <div className="h-[300px] p-3">{children}</div>
    </Card>
  )
}

function KpiSnapshot() {
  return (
    <section id="kpis" className="border-t border-border py-24 sm:py-32" aria-labelledby="kpis-title">
      <div className="container">
        <SectionHeader
          index="03"
          label="KPI Snapshot"
          title="What good looks like — measured continuously."
          description="A glimpse of the live console. Verified utility billing, sub-metering and AI baselines feed every metric."
          action={
            <Link href="/dashboard">
              <Button
                size="lg"
                className="h-11 gap-2 bg-foreground px-5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-background hover:bg-foreground/90"
                style={{ borderRadius: 'var(--radius)' }}
              >
                Open Full Console
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Button>
            </Link>
          }
        />

        {/* KPI tiles */}
        <div className="mt-14 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {KPIS.map((k, i) => (
            <Reveal key={k.label} delay={i * 0.05}>
              <div className="relative h-full bg-card p-5">
                <div className="flex items-start justify-between">
                  <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    {k.label}
                  </p>
                  <span className="font-mono text-[10px] font-medium tracking-[0.18em] text-muted-foreground">
                    K/{String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <p className="font-display num-tabular mt-4 text-4xl font-semibold tracking-tighter">
                  {k.value}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">{k.sub}</p>
                <div className="absolute bottom-0 left-0 h-0.5 w-12 bg-primary" aria-hidden />
              </div>
            </Reveal>
          ))}
        </div>

        {/* Charts */}
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          <Reveal className="lg:col-span-2">
            <ChartFrame title="Monthly Savings vs Baseline" subtitle="₹ Lakhs · 12-month rolling">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MONTHLY_SAVINGS} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }} />
                  <Tooltip
                    cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
                    contentStyle={{
                      background: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 2,
                      fontSize: 11,
                      fontFamily: 'var(--font-mono)',
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: 11, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.16em' }}
                    iconType="square"
                    iconSize={9}
                  />
                  <Line type="monotone" dataKey="baseline" name="Baseline" stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
                  <Line type="monotone" dataKey="savings" name="With ARASAKA" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 2.5, strokeWidth: 0, fill: 'hsl(var(--primary))' }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartFrame>
          </Reveal>

          <Reveal delay={0.1}>
            <ChartFrame title="Revenue & Savings Mix" subtitle="Share of value">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 2,
                      fontSize: 11,
                      fontFamily: 'var(--font-mono)',
                    }}
                  />
                  <Pie data={REVENUE_MIX} dataKey="value" nameKey="name" innerRadius={50} outerRadius={94} paddingAngle={2} stroke="hsl(var(--background))" strokeWidth={2}>
                    {REVENUE_MIX.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign="bottom"
                    iconType="square"
                    iconSize={9}
                    wrapperStyle={{ fontSize: 10, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.14em' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartFrame>
          </Reveal>

          <Reveal className="lg:col-span-3">
            <ChartFrame title="Solar Generation" subtitle="MWh per month · all blocks">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SOLAR_GENERATION} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }} />
                  <Tooltip
                    cursor={{ fill: 'hsl(var(--accent))' }}
                    contentStyle={{
                      background: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 2,
                      fontSize: 11,
                      fontFamily: 'var(--font-mono)',
                    }}
                  />
                  <Bar dataKey="kwh" fill="hsl(var(--primary))" radius={[1, 1, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartFrame>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  ROI                                                                       */
/* -------------------------------------------------------------------------- */

function ROISection() {
  return (
    <section id="roi" className="border-t border-border bg-secondary/40 py-24 sm:py-32" aria-labelledby="roi-title">
      <div className="container">
        <SectionHeader
          index="04"
          label="Return on Investment"
          title="Capex · Savings · Payback in three phases."
          description="A staged rollout that pays for itself — each phase de-risks the next."
        />
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {ROI_PHASES.map((p, i) => (
            <Reveal key={p.phase} delay={i * 0.07}>
              <Card className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-border p-5">
                  <div className="flex items-center gap-3">
                    <span className="font-display num-tabular text-3xl font-semibold tracking-tighter">
                      0{i + 1}
                    </span>
                    <Tag tone="primary">{p.phase}</Tag>
                  </div>
                  <span className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    {p.horizon}
                  </span>
                </div>
                <div className="space-y-6 p-5">
                  <h3 className="font-display text-xl font-semibold leading-snug tracking-tight">
                    {p.title}
                  </h3>
                  <div className="grid grid-cols-3 border border-border">
                    {[
                      ['Capex', p.capex, ''],
                      ['Savings', p.saving, 'text-primary'],
                      ['Payback', p.payback, ''],
                    ].map(([k, v, c], j) => (
                      <div key={k} className={j !== 0 ? 'border-l border-border p-3' : 'p-3'}>
                        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">{k}</p>
                        <p className={`mt-1 font-mono num-tabular text-base font-semibold ${c}`}>{v}</p>
                      </div>
                    ))}
                  </div>
                  <ul className="space-y-2.5">
                    {p.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2.5 text-sm">
                        <Plus className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary" strokeWidth={2.4} aria-hidden />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  Flow                                                                      */
/* -------------------------------------------------------------------------- */

const FLOW_STAGES = [
  { icon: Wifi, title: 'Sensors', desc: 'Occupancy, energy, CO₂, weather and EV telemetry stream from every block.', tag: 'Edge' },
  { icon: Cpu, title: 'AI Logic', desc: 'Forecasting + policy engine decides the optimal action for the next 15 minutes.', tag: 'Brain' },
  { icon: Settings2, title: 'Controls', desc: 'HVAC setpoints, lighting, charging slots and water-cooler load are actuated automatically.', tag: 'Actuators' },
  { icon: TrendingUp, title: 'Savings', desc: 'Verified savings, CO₂ reduction and circular rewards close the loop on the dashboard.', tag: 'Outcome' },
]

function FlowSection() {
  return (
    <section id="flow" className="border-t border-border py-24 sm:py-32" aria-labelledby="flow-title">
      <div className="container">
        <SectionHeader
          index="05"
          label="System Flow"
          title="From sensor pulse to verified saving — under a minute."
          description="A clean four-stage pipeline that turns raw telemetry into measurable outcomes."
        />
        <ol className="mt-14 grid gap-5 lg:grid-cols-4">
          {FLOW_STAGES.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.07}>
              <li>
                <Card className="relative h-full transition-colors hover:border-primary/40">
                  <div className="flex items-center justify-between border-b border-border p-5">
                    <div className="flex h-10 w-10 items-center justify-center border border-border bg-background text-foreground">
                      <s.icon className="h-5 w-5" aria-hidden />
                    </div>
                    <span className="font-display num-tabular text-2xl font-semibold tracking-tighter text-muted-foreground">
                      0{i + 1}
                    </span>
                  </div>
                  <div className="space-y-3 p-5">
                    <h3 className="font-display text-lg font-semibold leading-snug tracking-tight">{s.title}</h3>
                    <p className="text-sm text-muted-foreground">{s.desc}</p>
                    <Tag tone="outline">{s.tag}</Tag>
                  </div>
                  {i < FLOW_STAGES.length - 1 && (
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -right-3 top-1/2 hidden -translate-y-1/2 lg:block"
                    >
                      <div className="flex h-6 w-6 items-center justify-center border border-border bg-background">
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  )}
                </Card>
              </li>
            </Reveal>
          ))}
        </ol>
        <Reveal delay={0.2}>
          <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-border pt-6">
            {[
              [ShieldCheck, 'Privacy-first telemetry'],
              [Cloud, 'Cloud + on-prem hybrid'],
              [Activity, '99.9% uptime SLA'],
            ].map(([Icon, label]) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 border border-border bg-card px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground"
                style={{ borderRadius: 'var(--radius)' }}
              >
                <Icon className="h-3.5 w-3.5 text-primary" aria-hidden />
                {label}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  Timeline                                                                  */
/* -------------------------------------------------------------------------- */

function TimelineSection() {
  return (
    <section id="timeline" className="border-t border-border bg-secondary/40 py-24 sm:py-32" aria-labelledby="timeline-title">
      <div className="container">
        <SectionHeader
          index="06"
          label="Timeline"
          title="A one-year arc from pilot to net-zero path."
          description="Quarterly milestones that align facilities, finance and sustainability teams."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TIMELINE.map((t, i) => (
            <Reveal key={t.quarter} delay={i * 0.05}>
              <Card className="h-full">
                <div className="flex items-baseline justify-between border-b border-border p-5">
                  <div className="flex items-baseline gap-2">
                    <span className="font-display num-tabular text-3xl font-semibold tracking-tighter">
                      Q{i + 1}
                    </span>
                    <Tag tone="primary">{t.quarter}</Tag>
                  </div>
                </div>
                <div className="space-y-3 p-5">
                  <h3 className="font-display text-base font-semibold leading-snug tracking-tight">{t.title}</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {t.items.map((it) => (
                      <li key={it} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1 w-1 flex-shrink-0 bg-primary" aria-hidden />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  Team                                                                      */
/* -------------------------------------------------------------------------- */

function TeamSection() {
  return (
    <section id="team" className="border-t border-border py-24 sm:py-32" aria-labelledby="team-title">
      <div className="container">
        <SectionHeader
          index="07"
          label="Team"
          title="Builders behind ARASAKA."
          description="A pragmatic duo bridging energy systems engineering and sustainability operations."
        />
        <div className="mt-14 grid max-w-3xl gap-5 sm:grid-cols-2">
          {TEAM.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.08}>
              <Card>
                <div className="flex items-center gap-4 border-b border-border p-5">
                  <Avatar
                    className="h-14 w-14 border border-border"
                    style={{ borderRadius: 'var(--radius)' }}
                  >
                    <AvatarFallback
                      className="bg-foreground font-display text-base font-semibold text-background"
                      style={{ borderRadius: 'calc(var(--radius) - 1px)' }}
                    >
                      {m.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <h3 className="font-display truncate text-lg font-semibold tracking-tight">{m.name}</h3>
                    <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                      {m.role}
                    </p>
                  </div>
                </div>
                <div className="space-y-4 p-5">
                  <p className="text-sm text-muted-foreground">{m.bio}</p>
                  <div className="flex items-center gap-2">
                    {[Linkedin, Github, Mail].map((Icon, j) => (
                      <Button
                        key={j}
                        size="icon"
                        variant="outline"
                        className="h-9 w-9 border border-border bg-card hover:bg-muted"
                        style={{ borderRadius: 'var(--radius)' }}
                        aria-label={`${m.name} link ${j}`}
                      >
                        <Icon className="h-4 w-4" aria-hidden />
                      </Button>
                    ))}
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  CTA                                                                       */
/* -------------------------------------------------------------------------- */

function CTASection() {
  return (
    <section className="border-t border-border py-24 sm:py-32" aria-label="Call to action">
      <div className="container">
        <Reveal>
          <Card className="relative overflow-hidden bg-foreground text-background">
            <div className="absolute inset-0 dot-pattern opacity-[0.04]" aria-hidden />
            <div className="relative grid gap-8 p-10 sm:p-14 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-8">
                <div className="flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-background/60">
                  <span>08 —</span>
                  <span>Ready to build</span>
                </div>
                <h3 className="font-display mt-5 text-balance text-3xl font-semibold leading-tight tracking-tighter sm:text-4xl lg:text-5xl">
                  Turn your campus into a living, breathing climate-tech platform.
                </h3>
                <p className="mt-4 max-w-2xl text-base text-background/75">
                  Try the voice console — say{' '}
                  <em className="font-mono not-italic text-primary">"open dashboard"</em>,{' '}
                  <em className="font-mono not-italic text-primary">"show team"</em> or{' '}
                  <em className="font-mono not-italic text-primary">"dark mode on"</em>.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:flex-col lg:items-end lg:justify-end">
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="h-11 w-full gap-2 bg-primary px-5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-primary-foreground hover:bg-primary/90 sm:w-auto"
                    style={{ borderRadius: 'var(--radius)' }}
                  >
                    Open Dashboard
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </Button>
                </Link>
                <VoiceButton />
              </div>
            </div>
          </Card>
        </Reveal>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  Footer                                                                    */
/* -------------------------------------------------------------------------- */

function Footer() {
  return (
    <footer id="footer" className="border-t border-border bg-background" role="contentinfo">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center bg-foreground text-background" style={{ borderRadius: 'var(--radius)' }}>
                <span className="font-display text-xs font-extrabold tracking-tightest">A</span>
              </span>
              <span className="font-display text-base font-semibold tracking-tight">ARASAKA</span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Integrated Campus Energy &amp; Circular Utility Blueprint. A unified
              operating layer for facilities, finance and sustainability teams.
            </p>
            <p className="mt-5 font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              v0.1 · Hackathon Build · 2026
            </p>
          </div>
          <div className="md:col-span-3">
            <h4 className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">Sections</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                ['hero', 'Home', '00'],
                ['problem', 'Problem', '01'],
                ['solutions', 'Modules', '02'],
                ['kpis', 'KPIs', '03'],
                ['roi', 'ROI', '04'],
                ['team', 'Team', '07'],
              ].map(([id, label, n]) => (
                <li key={id}>
                  <a href={'#' + id} className="group inline-flex items-center gap-3 transition-colors hover:text-primary">
                    <span className="font-mono text-[10px] tracking-[0.22em] text-muted-foreground group-hover:text-primary">{n}</span>
                    <span className="font-medium">{label}</span>
                  </a>
                </li>
              ))}
              <li>
                <Link href="/dashboard" className="group inline-flex items-center gap-3 text-primary">
                  <span className="font-mono text-[10px] tracking-[0.22em]">→</span>
                  <span className="font-medium">Open Dashboard</span>
                </Link>
              </li>
            </ul>
          </div>
          <div className="md:col-span-4">
            <h4 className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">Voice console</h4>
            <ul className="mt-4 space-y-1.5 font-mono text-xs">
              {[
                '> open dashboard',
                '> go to roi',
                '> scroll down',
                '> dark mode on',
                '> show team',
              ].map((cmd) => (
                <li key={cmd} className="text-foreground/80">{cmd}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            © {new Date().getFullYear()} ARASAKA · Built for campuses that mean it.
          </p>
          <div className="flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            <Mic className="h-3.5 w-3.5" aria-hidden /> Accessibility-first · WCAG-friendly
          </div>
        </div>
      </div>
    </footer>
  )
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main id="main" tabIndex={-1}>
        <Hero />
        <MetaStrip />
        <ProblemSection />
        <SolutionsSection />
        <KpiSnapshot />
        <ROISection />
        <FlowSection />
        <TimelineSection />
        <TeamSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}

export default App
