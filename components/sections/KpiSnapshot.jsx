'use client'

import * as React from 'react'
import Link from 'next/link'
import { Activity, ArrowUpRight } from 'lucide-react'
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
} from 'recharts'
import { Button } from '@/components/ui/button'
import { Card, Tag, Kicker } from '@/components/arasaka/swiss'
import { Reveal, SectionHeader } from '@/components/arasaka/layout-utils'
import { KPIS, MONTHLY_SAVINGS, SOLAR_GENERATION, REVENUE_MIX } from '@/lib/arasaka-data'

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
          {subtitle && <Kicker className="mt-1 block">{subtitle}</Kicker>}
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

const tooltipStyle = {
  background: 'hsl(var(--popover))',
  border: '1px solid hsl(var(--border))',
  borderRadius: 2,
  fontSize: 12,
  fontFamily: 'var(--font-sora)',
}

export function KpiSnapshot() {
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
                className="h-11 gap-2 bg-foreground px-5 text-[13px] font-semibold tracking-tight text-background hover:bg-foreground/90"
                style={{ borderRadius: 'var(--radius)' }}
              >
                Open Full Console
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Button>
            </Link>
          }
        />

        <div className="mt-14 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {KPIS.map((k, i) => (
            <Reveal key={k.label} delay={i * 0.05}>
              <div className="relative h-full bg-card p-5">
                <div className="flex items-start justify-between">
                  <Kicker>{k.label}</Kicker>
                  <span className="font-display num-tabular text-sm text-muted-foreground">
                    {String(i + 1).padStart(2, '0')}
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

        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          <Reveal className="lg:col-span-2">
            <ChartFrame title="Monthly Savings vs Baseline" subtitle="₹ Lakhs · 12-month rolling">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MONTHLY_SAVINGS} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }} />
                  <Tooltip cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }} contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 12, fontFamily: 'var(--font-sora)' }} iconType="square" iconSize={9} />
                  <Line type="monotone" dataKey="baseline" name="Baseline" stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
                  <Line type="monotone" dataKey="savings" name="With Arasaka" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 2.5, strokeWidth: 0, fill: 'hsl(var(--primary))' }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartFrame>
          </Reveal>

          <Reveal delay={0.1}>
            <ChartFrame title="Revenue & Savings Mix" subtitle="Share of value">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Pie data={REVENUE_MIX} dataKey="value" nameKey="name" innerRadius={50} outerRadius={94} paddingAngle={2} stroke="hsl(var(--background))" strokeWidth={2}>
                    {REVENUE_MIX.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" iconType="square" iconSize={9} wrapperStyle={{ fontSize: 11, fontFamily: 'var(--font-sora)' }} />
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
                  <Tooltip cursor={{ fill: 'hsl(var(--accent))' }} contentStyle={tooltipStyle} />
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
