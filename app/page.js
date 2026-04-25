'use client'

import * as React from 'react'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
  Mic,
  ArrowDown,
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

import { Navbar } from '@/components/arasaka/navbar'
import { VoiceButton } from '@/components/arasaka/voice-button'
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
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function SectionHeader({ eyebrow, title, description, align = 'center' }) {
  return (
    <div
      className={`mx-auto max-w-3xl ${
        align === 'center' ? 'text-center' : 'text-left'
      }`}
    >
      {eyebrow && (
        <Badge
          variant="secondary"
          className="mb-4 border border-primary/15 bg-primary/8 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary"
        >
          {eyebrow}
        </Badge>
      )}
      <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-[2.6rem] md:leading-[1.1]">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-balance text-base text-muted-foreground sm:text-lg">
          {description}
        </p>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Hero                                                                      */
/* -------------------------------------------------------------------------- */

function Hero() {
  const goTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  // Tiny inline area chart for the hero card
  const data = [
    { x: 1, y: 14 }, { x: 2, y: 18 }, { x: 3, y: 16 },
    { x: 4, y: 22 }, { x: 5, y: 26 }, { x: 6, y: 25 },
    { x: 7, y: 30 }, { x: 8, y: 33 }, { x: 9, y: 39 },
    { x: 10, y: 42 }, { x: 11, y: 47 }, { x: 12, y: 52 },
  ]

  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden pb-20 pt-32 sm:pb-28 sm:pt-36"
      aria-label="Hero"
    >
      {/* Background pattern */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 grid-pattern radial-fade opacity-60 dark:opacity-30"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[60vh] bg-gradient-to-b from-primary/8 via-transparent to-transparent"
        aria-hidden
      />

      <div className="container">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <Reveal>
              <Badge
                variant="secondary"
                className="mb-5 inline-flex items-center gap-2 border border-primary/15 bg-primary/8 px-3 py-1 text-xs font-medium text-primary"
              >
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                Climate-tech · Hackathon Blueprint
              </Badge>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl lg:text-[4.25rem] lg:leading-[1.04]">
                <span className="text-gradient-green">ARASAKA</span>
                <span className="block text-foreground/90">
                  Integrated Campus Energy &
                </span>
                <span className="block">Circular Utility Blueprint</span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-xl text-balance text-base text-muted-foreground sm:text-lg">
                One campus operating layer that{' '}
                <span className="font-medium text-foreground">cuts waste</span>,{' '}
                <span className="font-medium text-foreground">prioritizes solar</span>{' '}
                and{' '}
                <span className="font-medium text-foreground">rewards recycling</span>{' '}
                — unifying classrooms, rooftops and EVs into a single
                accessible dashboard.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-8 flex flex-col flex-wrap items-stretch gap-3 sm:flex-row sm:items-center">
                <Button size="lg" onClick={() => goTo('dashboard')} className="gap-2">
                  View Dashboard
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => goTo('roi')}
                  className="gap-2"
                >
                  <TrendingUp className="h-4 w-4" aria-hidden />
                  Explore ROI
                </Button>
                <div className="sm:ml-1">
                  <VoiceButton />
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.22}>
              <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6">
                {[
                  { k: '25%', v: 'Energy cut' },
                  { k: '\u20B92.4 Cr', v: 'Annual savings' },
                  { k: '3.8 yrs', v: 'Payback' },
                ].map((s) => (
                  <div key={s.v}>
                    <dt className="text-2xl font-semibold tracking-tight text-foreground">
                      {s.k}
                    </dt>
                    <dd className="mt-1 text-xs text-muted-foreground">{s.v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          {/* Hero visual card */}
          <Reveal delay={0.1} className="lg:col-span-5">
            <div className="relative">
              <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-primary/20 via-primary/5 to-transparent blur-2xl" aria-hidden />
              <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xl glow-green">
                <div className="relative h-56 sm:h-64">
                  <Image
                    src="https://images.pexels.com/photos/29206500/pexels-photo-29206500.jpeg"
                    alt="Rooftop solar panels powering a smart campus"
                    fill
                    sizes="(max-width: 1024px) 100vw, 480px"
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" aria-hidden />
                  <div className="absolute left-4 top-4">
                    <Badge className="gap-1 bg-background/90 text-foreground hover:bg-background">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-primary" aria-hidden />
                      Live: Block A · 4.2 MW
                    </Badge>
                  </div>
                </div>
                <div className="space-y-4 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">
                        Today’s solar yield
                      </p>
                      <p className="text-2xl font-semibold tracking-tight">
                        612 kWh{' '}
                        <span className="text-sm font-medium text-primary">
                          ↑ 12.4%
                        </span>
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary hover:bg-primary/15"
                    >
                      <Leaf className="mr-1 h-3 w-3" aria-hidden />
                      On-track
                    </Badge>
                  </div>
                  <div className="h-24">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
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
                  <div className="grid grid-cols-3 gap-3 border-t border-border/70 pt-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">CO₂ saved</p>
                      <p className="text-sm font-semibold">3.1 t</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">EVs charged</p>
                      <p className="text-sm font-semibold">142</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Bottles</p>
                      <p className="text-sm font-semibold">2,841</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <button
            onClick={() => goTo('problem')}
            className="mx-auto mt-16 flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent"
            aria-label="Scroll to problem section"
          >
            <ArrowDown className="h-3.5 w-3.5" aria-hidden />
            Scroll to explore
          </button>
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
    <section id="problem" className="py-20 sm:py-24" aria-labelledby="problem-title">
      <div className="container">
        <Reveal>
          <SectionHeader
            eyebrow="The problem"
            title="Campuses leak energy, money and materials — every single day."
            description="Disconnected systems, no visibility, and zero accountability. Campuses pay for waste they can’t even see."
          />
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PROBLEMS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06}>
              <Card className="group h-full transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
                <CardHeader className="space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <p.icon className="h-5 w-5" aria-hidden />
                  </div>
                  <CardTitle className="text-lg leading-snug">{p.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{p.desc}</p>
                  <div className="text-xs font-medium text-primary">{p.stat}</div>
                </CardContent>
              </Card>
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
      className="relative border-y border-border/60 bg-secondary/40 py-20 sm:py-24"
      aria-labelledby="solutions-title"
    >
      <div className="container">
        <Reveal>
          <SectionHeader
            eyebrow="Solution modules"
            title="Eight modules. One operating layer."
            description="Plug-and-play building blocks that turn legacy infrastructure into a smart, accountable, circular campus."
          />
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SOLUTIONS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.04}>
              <Card className="group h-full overflow-hidden border-border/70 bg-card transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl">
                <CardHeader className="space-y-4 pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary transition-all group-hover:gradient-green group-hover:text-white">
                      <s.icon className="h-5 w-5" aria-hidden />
                    </div>
                    <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                      {s.tag}
                    </Badge>
                  </div>
                  <CardTitle className="text-base leading-snug">{s.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  Dashboard / KPIs                                                          */
/* -------------------------------------------------------------------------- */

const PIE_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
]

function ChartCard({ title, subtitle, children, className = '' }) {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription className="text-xs">{subtitle}</CardDescription>
        </div>
        <Badge variant="outline" className="gap-1 text-[10px]">
          <Activity className="h-3 w-3" aria-hidden />
          live
        </Badge>
      </CardHeader>
      <CardContent className="h-[280px] pt-2">{children}</CardContent>
    </Card>
  )
}

function DashboardSection() {
  return (
    <section id="dashboard" className="py-20 sm:py-24" aria-labelledby="dashboard-title">
      <div className="container">
        <Reveal>
          <SectionHeader
            eyebrow="KPI dashboard"
            title="What good looks like — measured continuously."
            description="Verified utility billing, sub-metering and AI baselines feed every metric. No vanity numbers."
          />
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {KPIS.map((k, i) => (
            <Reveal key={k.label} delay={i * 0.05}>
              <Card className="relative overflow-hidden border-primary/15 bg-gradient-to-br from-primary/8 via-card to-card">
                <div
                  className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl"
                  aria-hidden
                />
                <CardContent className="relative space-y-1 pt-6">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    {k.label}
                  </p>
                  <p className="text-3xl font-semibold tracking-tight text-foreground">
                    {k.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{k.sub}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <Reveal className="lg:col-span-2">
            <ChartCard
              title="Monthly Savings vs Baseline"
              subtitle="₹ lakhs · 12-month rolling"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MONTHLY_SAVINGS} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line
                    type="monotone"
                    dataKey="baseline"
                    name="Baseline"
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="savings"
                    name="With ARASAKA"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ r: 3, strokeWidth: 0, fill: 'hsl(var(--primary))' }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </Reveal>

          <Reveal delay={0.1}>
            <ChartCard
              title="Revenue & Savings Mix"
              subtitle="Share of value generated"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Pie
                    data={REVENUE_MIX}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={48}
                    outerRadius={90}
                    paddingAngle={3}
                    stroke="hsl(var(--background))"
                    strokeWidth={2}
                  >
                    {REVENUE_MIX.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign="bottom"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 11 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </Reveal>

          <Reveal className="lg:col-span-3">
            <ChartCard
              title="Solar Generation"
              subtitle="MWh per month · all blocks"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SOLAR_GENERATION} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barGreen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--chart-2))" />
                      <stop offset="100%" stopColor="hsl(var(--chart-1))" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: 'hsl(var(--accent))' }}
                    contentStyle={{
                      background: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="kwh" fill="url(#barGreen)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
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
      className="relative border-y border-border/60 bg-secondary/40 py-20 sm:py-24"
      aria-labelledby="roi-title"
    >
      <div className="container">
        <Reveal>
          <SectionHeader
            eyebrow="Return on investment"
            title="Capex · Savings · Payback in three phases."
            description="A staged rollout that pays for itself — each phase de-risks the next."
          />
        </Reveal>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {ROI_PHASES.map((p, i) => (
            <Reveal key={p.phase} delay={i * 0.07}>
              <Card className="flex h-full flex-col border-border/70 transition-all hover:border-primary/40 hover:shadow-xl">
                <CardHeader className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary hover:bg-primary/15"
                    >
                      {p.phase}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{p.horizon}</span>
                  </div>
                  <CardTitle className="text-lg leading-snug">{p.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-5">
                  <div className="grid grid-cols-3 gap-2 rounded-lg border border-border/70 bg-background p-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Capex</p>
                      <p className="text-sm font-semibold">{p.capex}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Savings</p>
                      <p className="text-sm font-semibold text-primary">{p.saving}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Payback</p>
                      <p className="text-sm font-semibold">{p.payback}</p>
                    </div>
                  </div>
                  <ul className="space-y-2.5">
                    {p.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" aria-hidden />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
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
  {
    icon: Wifi,
    title: 'Sensors',
    desc: 'Occupancy, energy, CO\u2082, weather and EV telemetry stream from every block.',
    tag: 'Edge',
  },
  {
    icon: Cpu,
    title: 'AI Logic',
    desc: 'Forecasting + policy engine decides the optimal action for the next 15 minutes.',
    tag: 'Brain',
  },
  {
    icon: Settings2,
    title: 'Controls',
    desc: 'HVAC setpoints, lighting, charging slots and water-cooler load are actuated automatically.',
    tag: 'Actuators',
  },
  {
    icon: TrendingUp,
    title: 'Savings',
    desc: 'Verified savings, CO\u2082 reduction and circular rewards close the loop on the dashboard.',
    tag: 'Outcome',
  },
]

function FlowSection() {
  return (
    <section id="flow" className="py-20 sm:py-24" aria-labelledby="flow-title">
      <div className="container">
        <Reveal>
          <SectionHeader
            eyebrow="System flow"
            title="From sensor pulse to verified saving — in under a minute."
            description="A clean four-stage pipeline that turns raw telemetry into measurable outcomes."
          />
        </Reveal>

        <div className="relative mt-14">
          <div
            className="absolute left-[5%] right-[5%] top-1/2 hidden h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-primary/40 to-transparent lg:block"
            aria-hidden
          />
          <ol className="grid gap-5 lg:grid-cols-4">
            {FLOW_STAGES.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08}>
                <li className="relative">
                  <Card className="h-full border-border/70 bg-card transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl">
                    <CardHeader className="space-y-3 pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl gradient-green text-white shadow-md">
                          <s.icon className="h-5 w-5" aria-hidden />
                        </div>
                        <span
                          className="text-xs font-mono text-muted-foreground"
                          aria-label={`Stage ${i + 1}`}
                        >
                          0{i + 1}
                        </span>
                      </div>
                      <CardTitle className="text-lg">{s.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">{s.desc}</p>
                      <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                        {s.tag}
                      </Badge>
                    </CardContent>
                  </Card>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>

        <Reveal delay={0.2}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" aria-hidden /> Privacy-first telemetry
            </span>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1.5">
              <Cloud className="h-3.5 w-3.5 text-primary" aria-hidden /> Cloud + on-prem hybrid
            </span>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-primary" aria-hidden /> 99.9% uptime SLA
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
      className="relative border-y border-border/60 bg-secondary/40 py-20 sm:py-24"
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
          <div
            className="absolute left-4 top-0 hidden h-full w-px bg-border md:left-1/2 md:block"
            aria-hidden
          />
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
                        className={`absolute top-4 hidden h-3 w-3 rounded-full border-2 border-primary bg-background md:block ${
                          left ? 'right-[-7px]' : 'left-[-7px]'
                        }`}
                        aria-hidden
                      />
                      <span
                        className="absolute left-2 top-4 h-3 w-3 rounded-full border-2 border-primary bg-background md:hidden"
                        aria-hidden
                      />
                      <Card className="border-border/70 transition-all hover:border-primary/40 hover:shadow-lg">
                        <CardHeader className="space-y-2">
                          <div
                            className={`flex items-center gap-2 ${
                              left ? 'md:justify-end' : ''
                            }`}
                          >
                            <Badge
                              variant="secondary"
                              className="bg-primary/10 text-primary hover:bg-primary/15"
                            >
                              {t.quarter}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg">{t.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul
                            className={`space-y-2 text-sm text-muted-foreground ${
                              left ? 'md:flex md:flex-col md:items-end' : ''
                            }`}
                          >
                            {t.items.map((it) => (
                              <li key={it} className="flex items-start gap-2">
                                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" aria-hidden />
                                <span>{it}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
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
    <section id="team" className="py-20 sm:py-24" aria-labelledby="team-title">
      <div className="container">
        <Reveal>
          <SectionHeader
            eyebrow="The team"
            title="Builders behind ARASAKA."
            description="A pragmatic duo bridging energy systems engineering and sustainability operations."
          />
        </Reveal>
        <div className="mx-auto mt-12 grid max-w-3xl gap-5 sm:grid-cols-2">
          {TEAM.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.08}>
              <Card className="group h-full overflow-hidden border-border/70 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                  <Avatar className="h-14 w-14 border-2 border-primary/20">
                    <AvatarFallback className="gradient-green text-base font-semibold text-white">
                      {m.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <CardTitle className="truncate text-lg">{m.name}</CardTitle>
                    <CardDescription>{m.role}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{m.bio}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <Button size="icon" variant="outline" className="h-8 w-8" aria-label={`${m.name} on LinkedIn`}>
                      <Linkedin className="h-3.5 w-3.5" aria-hidden />
                    </Button>
                    <Button size="icon" variant="outline" className="h-8 w-8" aria-label={`${m.name} on GitHub`}>
                      <Github className="h-3.5 w-3.5" aria-hidden />
                    </Button>
                    <Button size="icon" variant="outline" className="h-8 w-8" aria-label={`Email ${m.name}`}>
                      <Mail className="h-3.5 w-3.5" aria-hidden />
                    </Button>
                  </div>
                </CardContent>
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
  const goTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  return (
    <section className="py-20 sm:py-24" aria-label="Call to action">
      <div className="container">
        <Reveal>
          <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card">
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/15 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
              aria-hidden
            />
            <CardContent className="relative flex flex-col items-start gap-6 px-6 py-10 sm:px-10 sm:py-14 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <Badge
                  variant="secondary"
                  className="mb-3 border border-primary/20 bg-primary/10 text-primary"
                >
                  Ready to build
                </Badge>
                <h3 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                  Turn your campus into a living, breathing climate-tech platform.
                </h3>
                <p className="mt-3 text-base text-muted-foreground">
                  Try the voice navigation — say “go to dashboard”, “open ROI” or “dark mode on”.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="lg" onClick={() => goTo('dashboard')} className="gap-2">
                  View Dashboard
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
                <VoiceButton />
              </div>
            </CardContent>
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
    <footer
      id="footer"
      className="border-t border-border bg-background"
      role="contentinfo"
    >
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg gradient-green text-white">
                <Leaf className="h-4 w-4" aria-hidden />
              </span>
              <span className="text-base font-semibold tracking-tight">ARASAKA</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Integrated Campus Energy & Circular Utility Blueprint.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Sections</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {[
                ['hero', 'Home'],
                ['solutions', 'Modules'],
                ['dashboard', 'Dashboard'],
                ['roi', 'ROI'],
                ['team', 'Team'],
              ].map(([id, label]) => (
                <li key={id}>
                  <button
                    onClick={() =>
                      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
                    }
                    className="transition-colors hover:text-foreground"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Voice navigation</h4>
            <p className="mt-3 text-sm text-muted-foreground">
              Try saying:
            </p>
            <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
              <li>“Go to dashboard”</li>
              <li>“Open ROI”</li>
              <li>“Scroll down”</li>
              <li>“Dark mode on”</li>
              <li>“Show team”</li>
            </ul>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ARASAKA · Built for campuses that mean it.
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
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
