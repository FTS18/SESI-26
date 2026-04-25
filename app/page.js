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
  Sparkles,
  Cpu,
  Cloud,
  Settings2,
  TrendingUp,
  Leaf,
  Github,
  Linkedin,
  Mail,
  Activity,
  Wifi,
  ShieldCheck,
  AsteriskSquare,
  Mic,
  Square,
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
import { Separator } from '@/components/ui/separator'

import { Navbar } from '@/components/arasaka/navbar'
import { VoiceButton } from '@/components/arasaka/voice-button'
import { BrutalCard, BrutalTag } from '@/components/arasaka/brutal-card'
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

function Reveal({ children, delay = 0, y = 16, className = '' }) {
  const reduced = useReducedMotion()
  if (reduced) return <div className={className}>{children}</div>
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.45, ease: 'easeOut', delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function SectionHeader({ eyebrow, title, description, align = 'left' }) {
  return (
    <div
      className={`max-w-3xl ${align === 'center' ? 'mx-auto text-center' : ''}`}
    >
      {eyebrow && (
        <BrutalTag tone="primary" className="mb-5">
          {eyebrow}
        </BrutalTag>
      )}
      <h2 className="font-display text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-[3.25rem]">
        {title}
      </h2>
      {description && (
        <p className="mt-5 max-w-2xl text-balance text-base text-muted-foreground sm:text-lg">
          {description}
        </p>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Marquee strip                                                             */
/* -------------------------------------------------------------------------- */

function MarqueeStrip() {
  const items = [
    'RUN THE CAMPUS LIKE A STARTUP',
    '25% ENERGY CUT',
    '₹2.4 CR ANNUAL SAVINGS',
    '4,200 T CO₂ AVOIDED',
    '8 MODULES · 1 OPERATING LAYER',
    'VOICE-NAVIGABLE · WCAG-FRIENDLY',
  ]
  const row = items.concat(items)
  return (
    <div className="border-y-2 border-foreground bg-foreground text-background">
      <div className="flex overflow-hidden">
        <div className="marquee-track flex shrink-0 animate-marquee items-center gap-10 py-3 pr-10">
          {row.map((t, i) => (
            <span
              key={i}
              className="inline-flex shrink-0 items-center gap-3 font-mono text-xs font-bold uppercase tracking-[0.3em]"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden />
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
      className="relative isolate overflow-hidden border-b-2 border-foreground pb-20 pt-32 sm:pb-28 sm:pt-36"
      aria-label="Hero"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 grid-pattern radial-fade opacity-90"
        aria-hidden
      />
      <div className="container">
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <Reveal>
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <BrutalTag tone="foreground">
                  <Sparkles className="h-3 w-3" aria-hidden />
                  Climate-Tech · 2026 Build
                </BrutalTag>
                <BrutalTag tone="outline">
                  v0.1 · Hackathon Blueprint
                </BrutalTag>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="font-display text-balance text-[3rem] font-bold leading-[0.92] tracking-tight sm:text-[4.5rem] lg:text-[5.5rem]">
                <span className="block bg-foreground px-2 py-1 text-background">
                  ARASAKA
                </span>
                <span className="mt-3 block text-foreground/90">
                  CAMPUS ENERGY,
                </span>
                <span className="block">
                  <span className="bg-primary px-2 py-1 text-primary-foreground">
                    REWIRED.
                  </span>
                </span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-7 max-w-xl text-balance text-base text-muted-foreground sm:text-lg">
                One operating layer that{' '}
                <span className="bg-foreground px-1 text-background">cuts waste</span>,{' '}
                <span className="bg-primary px-1 text-primary-foreground">prioritizes solar</span>,{' '}
                and{' '}
                <span className="border-2 border-foreground px-1">rewards recycling</span>{' '}
                — unifying classrooms, rooftops and EVs into a single accessible
                console.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-9 flex flex-col flex-wrap items-stretch gap-3 sm:flex-row sm:items-center">
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    style={{ borderRadius: 0 }}
                    className="h-12 w-full border-2 border-foreground bg-primary px-6 font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground brutal-shadow transition-transform hover:translate-x-[-2px] hover:translate-y-[-2px] hover:bg-primary hover:brightness-95 hover:brutal-shadow-lg sm:w-auto"
                  >
                    Open Dashboard
                    <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden />
                  </Button>
                </Link>
                <a href="#roi">
                  <Button
                    size="lg"
                    variant="outline"
                    style={{ borderRadius: 0 }}
                    className="h-12 w-full border-2 border-foreground bg-background px-6 font-mono text-xs font-bold uppercase tracking-widest brutal-shadow-sm transition-transform hover:translate-x-[-2px] hover:translate-y-[-2px] hover:bg-background hover:brutal-shadow sm:w-auto"
                  >
                    <TrendingUp className="mr-2 h-4 w-4" aria-hidden />
                    Explore ROI
                  </Button>
                </a>
                <VoiceButton />
              </div>
            </Reveal>
            <Reveal delay={0.22}>
              <dl className="mt-12 grid max-w-xl grid-cols-3 gap-0 border-2 border-foreground brutal-shadow">
                {[
                  { k: '25%', v: 'Energy cut', m: 'across blocks' },
                  { k: '₹2.4 Cr', v: 'Annual savings', m: 'verified billing' },
                  { k: '3.8 yrs', v: 'Payback', m: 'blended capex' },
                ].map((s, i) => (
                  <div
                    key={s.v}
                    className={`bg-card p-4 ${
                      i !== 0 ? 'border-l-2 border-foreground' : ''
                    }`}
                  >
                    <dt className="font-mono text-2xl font-bold tracking-tight sm:text-3xl">
                      {s.k}
                    </dt>
                    <dd className="mt-1 text-xs font-bold uppercase tracking-widest">
                      {s.v}
                    </dd>
                    <dd className="mt-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
                      {s.m}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          {/* Hero visual card */}
          <Reveal delay={0.1} className="lg:col-span-5">
            <div className="relative">
              <BrutalCard className="overflow-hidden">
                <div className="relative h-56 border-b-2 border-foreground sm:h-64">
                  <Image
                    src="https://images.pexels.com/photos/29206500/pexels-photo-29206500.jpeg"
                    alt="Rooftop solar panels powering a smart campus"
                    fill
                    sizes="(max-width: 1024px) 100vw, 480px"
                    className="object-cover"
                    priority
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent"
                    aria-hidden
                  />
                  <div className="absolute left-3 top-3 flex items-center gap-2">
                    <BrutalTag tone="primary">
                      <span className="h-1.5 w-1.5 animate-pulse bg-primary-foreground" aria-hidden />
                      LIVE · BLOCK A · 4.2 MW
                    </BrutalTag>
                  </div>
                  <div className="absolute right-3 top-3">
                    <BrutalTag tone="foreground">REC #ARS-0421</BrutalTag>
                  </div>
                </div>
                <div className="space-y-5 p-5">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        TODAY'S SOLAR YIELD
                      </p>
                      <p className="mt-1 font-mono text-3xl font-bold tracking-tight">
                        612 kWh
                      </p>
                      <p className="mt-1 inline-flex items-center gap-1 font-mono text-xs font-bold text-primary">
                        ↑ 12.4% vs yesterday
                      </p>
                    </div>
                    <BrutalTag tone="primary">ON-TRACK</BrutalTag>
                  </div>
                  <div className="h-24 border-2 border-foreground bg-background">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data} margin={{ top: 6, right: 6, bottom: 0, left: 6 }}>
                        <defs>
                          <linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
                            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="y"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2.4}
                          fill="url(#heroGrad)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-3 divide-x-2 divide-foreground border-2 border-foreground">
                    {[
                      ['CO₂ saved', '3.1 t'],
                      ['EVs charged', '142'],
                      ['Bottles', '2,841'],
                    ].map(([k, v]) => (
                      <div key={k} className="p-2.5">
                        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          {k}
                        </p>
                        <p className="mt-1 font-mono text-base font-bold">{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </BrutalCard>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <a
            href="#problem"
            className="mx-auto mt-14 flex w-fit items-center gap-2 border-2 border-foreground bg-background px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-widest brutal-shadow-sm hover:translate-x-[-1px] hover:translate-y-[-1px] hover:brutal-shadow"
          >
            <ArrowDown className="h-3.5 w-3.5" aria-hidden />
            Scroll to Explore
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
    <section id="problem" className="border-b-2 border-foreground py-20 sm:py-24" aria-labelledby="problem-title">
      <div className="container">
        <Reveal>
          <SectionHeader
            eyebrow="The Problem"
            title="Campuses leak energy, money & materials — every single day."
            description="Disconnected systems, no visibility, zero accountability. Campuses pay for waste they can't even see."
          />
        </Reveal>
        <div className="mt-12 grid gap-0 border-2 border-foreground sm:grid-cols-2 lg:grid-cols-4">
          {PROBLEMS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.05}>
              <div
                className={`group h-full bg-card p-6 transition-colors hover:bg-primary hover:text-primary-foreground ${
                  i !== 0 ? 'lg:border-l-2 lg:border-foreground' : ''
                } ${
                  i % 2 === 1 ? 'sm:border-l-2 sm:border-foreground lg:border-l-2' : ''
                } ${
                  i >= 2 ? 'sm:border-t-2 sm:border-foreground lg:border-t-0' : ''
                } border-t-2 first:border-t-0`}
              >
                <div className="mb-5 flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center border-2 border-foreground bg-primary text-primary-foreground transition-colors group-hover:bg-primary-foreground group-hover:text-primary">
                    <p.icon className="h-5 w-5" aria-hidden />
                  </div>
                  <span className="font-mono text-[11px] font-bold uppercase tracking-widest opacity-70">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold leading-snug">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed opacity-80">
                  {p.desc}
                </p>
                <div className="mt-5 inline-flex items-center gap-1 border-2 border-current px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest">
                  {p.stat}
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
    <section
      id="solutions"
      className="relative border-b-2 border-foreground bg-secondary py-20 sm:py-24"
      aria-labelledby="solutions-title"
    >
      <div className="container">
        <Reveal>
          <SectionHeader
            eyebrow="Solution Modules"
            title="Eight modules. One operating layer."
            description="Plug-and-play building blocks that turn legacy infrastructure into a smart, accountable, circular campus."
          />
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SOLUTIONS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.04}>
              <BrutalCard className="group h-full brutal-lift">
                <div className="flex items-start justify-between border-b-2 border-foreground p-4">
                  <div className="flex h-11 w-11 items-center justify-center border-2 border-foreground bg-background transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <s.icon className="h-5 w-5" aria-hidden />
                  </div>
                  <BrutalTag tone="outline">{s.tag}</BrutalTag>
                </div>
                <div className="space-y-3 p-4">
                  <h3 className="font-display text-base font-bold leading-snug">
                    {s.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {s.desc}
                  </p>
                  <div className="flex items-center justify-between border-t-2 border-foreground pt-3">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      MODULE {String(i + 1).padStart(2, '0')}
                    </span>
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                  </div>
                </div>
              </BrutalCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  Dashboard preview                                                         */
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
    <BrutalCard className={`overflow-hidden ${className}`}>
      <div className="flex items-start justify-between border-b-2 border-foreground p-4">
        <div>
          <h3 className="font-display text-base font-bold leading-tight">{title}</h3>
          <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {subtitle}
          </p>
        </div>
        <BrutalTag tone="primary">
          <Activity className="h-3 w-3" aria-hidden />
          LIVE
        </BrutalTag>
      </div>
      <div className="h-[280px] p-3">{children}</div>
    </BrutalCard>
  )
}

function DashboardSection() {
  return (
    <section id="dashboard" className="border-b-2 border-foreground py-20 sm:py-24" aria-labelledby="dashboard-title">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <SectionHeader
              eyebrow="KPI Snapshot"
              title="What good looks like — measured continuously."
              description="A glimpse of the live console. Verified utility billing, sub-metering and AI baselines feed every metric."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <Link href="/dashboard">
              <Button
                size="lg"
                style={{ borderRadius: 0 }}
                className="h-11 border-2 border-foreground bg-foreground px-5 font-mono text-xs font-bold uppercase tracking-widest text-background brutal-shadow-sm transition-transform hover:translate-x-[-1px] hover:translate-y-[-1px] hover:brutal-shadow"
              >
                Open Full Console
                <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden />
              </Button>
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-0 border-2 border-foreground sm:grid-cols-2 lg:grid-cols-4">
          {KPIS.map((k, i) => (
            <Reveal key={k.label} delay={i * 0.05}>
              <div
                className={`relative overflow-hidden bg-card p-5 ${
                  i !== 0 ? 'lg:border-l-2 lg:border-foreground' : ''
                } ${
                  i % 2 === 1 ? 'sm:border-l-2 sm:border-foreground' : ''
                } ${i >= 2 ? 'sm:border-t-2 sm:border-foreground lg:border-t-0' : ''} border-t-2 first:border-t-0`}
              >
                <div className="absolute inset-y-0 right-0 w-1.5 bg-primary" aria-hidden />
                <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {k.label}
                </p>
                <p className="mt-2 font-mono text-3xl font-bold tracking-tight sm:text-4xl">
                  {k.value}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">{k.sub}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          <Reveal className="lg:col-span-2">
            <ChartFrame
              title="Monthly Savings vs Baseline"
              subtitle="₹ LAKHS · 12-MONTH ROLLING"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MONTHLY_SAVINGS} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                  <CartesianGrid stroke="hsl(var(--foreground) / 0.18)" strokeDasharray="0" vertical={false} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={{ stroke: 'hsl(var(--foreground))', strokeWidth: 2 }} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={{ stroke: 'hsl(var(--foreground))', strokeWidth: 2 }} />
                  <Tooltip
                    cursor={{ stroke: 'hsl(var(--foreground))', strokeWidth: 1 }}
                    contentStyle={{
                      background: 'hsl(var(--popover))',
                      border: '2px solid hsl(var(--foreground))',
                      borderRadius: 0,
                      fontSize: 12,
                      fontFamily: 'var(--font-mono)',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                  <Line type="monotone" dataKey="baseline" name="BASELINE" stroke="hsl(var(--muted-foreground))" strokeWidth={2} strokeDasharray="6 4" dot={false} />
                  <Line type="monotone" dataKey="savings" name="WITH ARASAKA" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 3, strokeWidth: 0, fill: 'hsl(var(--primary))' }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartFrame>
          </Reveal>

          <Reveal delay={0.1}>
            <ChartFrame title="Revenue & Savings Mix" subtitle="SHARE OF VALUE">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--popover))',
                      border: '2px solid hsl(var(--foreground))',
                      borderRadius: 0,
                      fontSize: 12,
                      fontFamily: 'var(--font-mono)',
                    }}
                  />
                  <Pie data={REVENUE_MIX} dataKey="value" nameKey="name" innerRadius={48} outerRadius={92} paddingAngle={2} stroke="hsl(var(--foreground))" strokeWidth={2}>
                    {REVENUE_MIX.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign="bottom"
                    iconSize={10}
                    iconType="square"
                    wrapperStyle={{ fontSize: 10, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartFrame>
          </Reveal>

          <Reveal className="lg:col-span-3">
            <ChartFrame title="Solar Generation" subtitle="MWh PER MONTH · ALL BLOCKS">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SOLAR_GENERATION} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                  <CartesianGrid stroke="hsl(var(--foreground) / 0.18)" strokeDasharray="0" vertical={false} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={{ stroke: 'hsl(var(--foreground))', strokeWidth: 2 }} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={{ stroke: 'hsl(var(--foreground))', strokeWidth: 2 }} />
                  <Tooltip
                    cursor={{ fill: 'hsl(var(--accent))' }}
                    contentStyle={{
                      background: 'hsl(var(--popover))',
                      border: '2px solid hsl(var(--foreground))',
                      borderRadius: 0,
                      fontSize: 12,
                      fontFamily: 'var(--font-mono)',
                    }}
                  />
                  <Bar dataKey="kwh" fill="hsl(var(--primary))" stroke="hsl(var(--foreground))" strokeWidth={2} />
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
    <section
      id="roi"
      className="relative border-b-2 border-foreground bg-secondary py-20 sm:py-24"
      aria-labelledby="roi-title"
    >
      <div className="container">
        <Reveal>
          <SectionHeader
            eyebrow="Return on Investment"
            title="Capex · Savings · Payback in three phases."
            description="A staged rollout that pays for itself — each phase de-risks the next."
          />
        </Reveal>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {ROI_PHASES.map((p, i) => (
            <Reveal key={p.phase} delay={i * 0.07}>
              <BrutalCard className="flex h-full flex-col brutal-lift">
                <div className="flex items-center justify-between border-b-2 border-foreground bg-foreground p-4 text-background">
                  <BrutalTag tone="primary">{p.phase}</BrutalTag>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest opacity-80">
                    {p.horizon}
                  </span>
                </div>
                <div className="space-y-5 p-5">
                  <h3 className="font-display text-xl font-bold leading-snug">
                    {p.title}
                  </h3>
                  <div className="grid grid-cols-3 divide-x-2 divide-foreground border-2 border-foreground">
                    <div className="p-3">
                      <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">CAPEX</p>
                      <p className="mt-1 font-mono text-base font-bold">{p.capex}</p>
                    </div>
                    <div className="bg-primary/8 p-3">
                      <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">SAVINGS</p>
                      <p className="mt-1 font-mono text-base font-bold text-primary">{p.saving}</p>
                    </div>
                    <div className="p-3">
                      <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">PAYBACK</p>
                      <p className="mt-1 font-mono text-base font-bold">{p.payback}</p>
                    </div>
                  </div>
                  <ul className="space-y-2.5">
                    {p.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm">
                        <Square className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 fill-primary stroke-foreground" strokeWidth={2} aria-hidden />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </BrutalCard>
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
  { icon: Wifi, title: 'Sensors', desc: 'Occupancy, energy, CO₂, weather and EV telemetry stream from every block.', tag: 'EDGE' },
  { icon: Cpu, title: 'AI Logic', desc: 'Forecasting + policy engine decides the optimal action for the next 15 minutes.', tag: 'BRAIN' },
  { icon: Settings2, title: 'Controls', desc: 'HVAC setpoints, lighting, charging slots and water-cooler load are actuated automatically.', tag: 'ACTUATORS' },
  { icon: TrendingUp, title: 'Savings', desc: 'Verified savings, CO₂ reduction and circular rewards close the loop on the dashboard.', tag: 'OUTCOME' },
]

function FlowSection() {
  return (
    <section id="flow" className="border-b-2 border-foreground py-20 sm:py-24" aria-labelledby="flow-title">
      <div className="container">
        <Reveal>
          <SectionHeader
            eyebrow="System Flow"
            title="From sensor pulse to verified saving — in under a minute."
            description="A clean four-stage pipeline that turns raw telemetry into measurable outcomes."
          />
        </Reveal>
        <ol className="mt-14 grid gap-5 lg:grid-cols-4">
          {FLOW_STAGES.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              <li>
                <BrutalCard className="relative h-full brutal-lift">
                  <div className="flex items-center justify-between border-b-2 border-foreground p-4">
                    <div className="flex h-11 w-11 items-center justify-center border-2 border-foreground bg-primary text-primary-foreground">
                      <s.icon className="h-5 w-5" aria-hidden />
                    </div>
                    <span className="font-mono text-xs font-bold tracking-widest text-muted-foreground">
                      0{i + 1}
                    </span>
                  </div>
                  <div className="space-y-3 p-4">
                    <h3 className="font-display text-lg font-bold leading-snug">{s.title}</h3>
                    <p className="text-sm text-muted-foreground">{s.desc}</p>
                    <BrutalTag tone="outline">{s.tag}</BrutalTag>
                  </div>
                  {i < FLOW_STAGES.length - 1 && (
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -right-3 top-1/2 hidden -translate-y-1/2 lg:block"
                    >
                      <div className="flex h-6 w-6 items-center justify-center border-2 border-foreground bg-background">
                        <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  )}
                </BrutalCard>
              </li>
            </Reveal>
          ))}
        </ol>
        <Reveal delay={0.2}>
          <div className="mt-12 flex flex-wrap items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 border-2 border-foreground bg-card px-2 py-1">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" aria-hidden /> Privacy-first
            </span>
            <span className="inline-flex items-center gap-1.5 border-2 border-foreground bg-card px-2 py-1">
              <Cloud className="h-3.5 w-3.5 text-primary" aria-hidden /> Cloud + on-prem
            </span>
            <span className="inline-flex items-center gap-1.5 border-2 border-foreground bg-card px-2 py-1">
              <Activity className="h-3.5 w-3.5 text-primary" aria-hidden /> 99.9% Uptime
            </span>
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
    <section
      id="timeline"
      className="relative border-b-2 border-foreground bg-secondary py-20 sm:py-24"
      aria-labelledby="timeline-title"
    >
      <div className="container">
        <Reveal>
          <SectionHeader
            eyebrow="Timeline"
            title="A one-year arc from pilot to net-zero path."
            description="Quarterly milestones that align facilities, finance and sustainability teams."
          />
        </Reveal>
        <div className="relative mt-14">
          <div className="absolute left-4 top-0 hidden h-full w-0.5 bg-foreground md:left-1/2 md:block" aria-hidden />
          <ol className="space-y-6 md:space-y-10">
            {TIMELINE.map((t, i) => {
              const left = i % 2 === 0
              return (
                <Reveal key={t.quarter} delay={i * 0.05}>
                  <li className="relative md:grid md:grid-cols-2 md:gap-10">
                    <div
                      className={`relative pl-10 md:pl-0 ${
                        left ? 'md:pr-10 md:text-right' : 'md:col-start-2 md:pl-10'
                      }`}
                    >
                      <span
                        className={`absolute top-4 hidden h-3 w-3 border-2 border-foreground bg-primary md:block ${
                          left ? 'right-[-7px]' : 'left-[-7px]'
                        }`}
                        aria-hidden
                      />
                      <span className="absolute left-2 top-4 h-3 w-3 border-2 border-foreground bg-primary md:hidden" aria-hidden />
                      <BrutalCard className="brutal-lift">
                        <div className="flex items-center justify-between border-b-2 border-foreground p-4">
                          <BrutalTag tone="primary">{t.quarter}</BrutalTag>
                          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            milestone {String(i + 1).padStart(2, '0')}
                          </span>
                        </div>
                        <div className="p-4">
                          <h3 className="font-display text-lg font-bold leading-snug">{t.title}</h3>
                          <ul
                            className={`mt-3 space-y-2 text-sm text-muted-foreground ${
                              left ? 'md:flex md:flex-col md:items-end' : ''
                            }`}
                          >
                            {t.items.map((it) => (
                              <li key={it} className="flex items-start gap-2">
                                <Square className="mt-0.5 h-3 w-3 flex-shrink-0 fill-primary stroke-foreground" strokeWidth={2} aria-hidden />
                                <span>{it}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </BrutalCard>
                    </div>
                  </li>
                </Reveal>
              )
            })}
          </ol>
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
    <section id="team" className="border-b-2 border-foreground py-20 sm:py-24" aria-labelledby="team-title">
      <div className="container">
        <Reveal>
          <SectionHeader
            eyebrow="The Team"
            title="Builders behind ARASAKA."
            description="A pragmatic duo bridging energy systems engineering and sustainability operations."
          />
        </Reveal>
        <div className="mt-12 grid max-w-3xl gap-5 sm:grid-cols-2">
          {TEAM.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.08}>
              <BrutalCard className="brutal-lift">
                <div className="flex items-center gap-4 border-b-2 border-foreground p-5">
                  <Avatar className="h-14 w-14 border-2 border-foreground" style={{ borderRadius: 0 }}>
                    <AvatarFallback
                      className="bg-primary text-base font-bold text-primary-foreground"
                      style={{ borderRadius: 0 }}
                    >
                      {m.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <h3 className="font-display truncate text-lg font-bold">{m.name}</h3>
                    <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
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
                        style={{ borderRadius: 0 }}
                        className="h-9 w-9 border-2 border-foreground bg-background brutal-shadow-sm hover:translate-x-[-1px] hover:translate-y-[-1px] hover:bg-background hover:brutal-shadow"
                        aria-label={`${m.name} link ${j}`}
                      >
                        <Icon className="h-4 w-4" aria-hidden />
                      </Button>
                    ))}
                  </div>
                </div>
              </BrutalCard>
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
    <section className="border-b-2 border-foreground py-20 sm:py-24" aria-label="Call to action">
      <div className="container">
        <Reveal>
          <BrutalCard className="relative overflow-hidden bg-foreground text-background">
            <div className="absolute inset-0 stripe-pattern opacity-[0.07]" aria-hidden />
            <div className="relative flex flex-col items-start gap-6 p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <BrutalTag tone="primary" className="mb-4">
                  Ready to Build
                </BrutalTag>
                <h3 className="font-display text-balance text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                  Turn your campus into a living, breathing climate-tech platform.
                </h3>
                <p className="mt-4 text-base opacity-80">
                  Try the voice console — say <em className="font-mono not-italic text-primary">"open dashboard"</em>,{' '}
                  <em className="font-mono not-italic text-primary">"show team"</em> or{' '}
                  <em className="font-mono not-italic text-primary">"dark mode on"</em>.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    style={{ borderRadius: 0 }}
                    className="h-12 w-full border-2 border-background bg-primary px-6 font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground sm:w-auto"
                  >
                    Open Dashboard
                    <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden />
                  </Button>
                </Link>
                <VoiceButton />
              </div>
            </div>
          </BrutalCard>
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
    <footer
      id="footer"
      className="bg-background"
      role="contentinfo"
    >
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center border-2 border-foreground bg-primary text-primary-foreground brutal-shadow-sm">
                <Leaf className="h-4 w-4" aria-hidden />
              </span>
              <span className="font-display text-lg font-bold tracking-tight">ARASAKA</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Integrated Campus Energy & Circular Utility Blueprint.
            </p>
            <p className="mt-4 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              v0.1 · Hackathon Build · 2026
            </p>
          </div>
          <div>
            <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Sections</h4>
            <ul className="mt-3 space-y-2 text-sm">
              {[
                ['hero', 'Home'],
                ['solutions', 'Modules'],
                ['dashboard', 'KPIs'],
                ['roi', 'ROI'],
                ['team', 'Team'],
              ].map(([id, label]) => (
                <li key={id}>
                  <a href={'#' + id} className="font-medium transition-colors hover:text-primary">
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <Link href="/dashboard" className="inline-flex items-center gap-1 font-bold text-primary">
                  Open Dashboard <ArrowUpRight className="h-3 w-3" aria-hidden />
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Voice Console</h4>
            <p className="mt-3 text-sm text-muted-foreground">Try saying:</p>
            <ul className="mt-2 space-y-1.5 font-mono text-xs">
              {[
                '> open dashboard',
                '> go to roi',
                '> scroll down',
                '> dark mode on',
                '> show team',
              ].map((cmd) => (
                <li key={cmd} className="text-foreground/80">
                  {cmd}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Separator className="my-8 h-0.5 bg-foreground" />
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            © {new Date().getFullYear()} ARASAKA · Built for campuses that mean it.
          </p>
          <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
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
        <MarqueeStrip />
        <ProblemSection />
        <SolutionsSection />
        <DashboardSection />
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
