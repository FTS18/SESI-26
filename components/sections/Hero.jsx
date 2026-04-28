'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown, ArrowUpRight, TrendingUp } from 'lucide-react'
import { ResponsiveContainer, AreaChart, Area } from 'recharts'
import { Button } from '@/components/ui/button'
import { VoiceButton } from '@/components/arasaka/voice-button'
import { Card, Tag, SectionEyebrow, Kicker } from '@/components/arasaka/swiss'
import { Reveal } from '@/components/arasaka/layout-utils'

export function Hero() {
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
            <div className="flex items-center gap-3 text-[12px] font-medium tracking-tight text-muted-foreground">
              <span className="font-display num-tabular text-foreground">A —</span>
              <span>Integrated Campus Energy &amp; Circular Utility Blueprint</span>
            </div>
            <div className="flex items-center gap-3 text-[12px] font-medium tracking-tight text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 animate-pulse bg-primary" aria-hidden />
                Live pilot — Block A
              </span>
              <span className="hidden sm:inline">·</span>
              <span className="hidden sm:inline">v0.1 · 2026</span>
            </div>
          </div>
        </Reveal>

        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
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
                    className="h-11 w-full gap-2 bg-foreground px-5 text-[13px] font-semibold tracking-tight text-background hover:bg-foreground/90 sm:w-auto"
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
                    className="h-11 w-full gap-2 border border-border bg-card px-5 text-[13px] font-semibold tracking-tight hover:bg-muted sm:w-auto"
                    style={{ borderRadius: 'var(--radius)' }}
                  >
                    <TrendingUp className="h-4 w-4" aria-hidden />
                    Explore ROI
                  </Button>
                </a>
                <VoiceButton />
              </div>
            </Reveal>

            <Reveal delay={0.22}>
              <dl className="mt-14 grid max-w-2xl grid-cols-3 border-t border-border pt-6">
                {[
                  { k: '25%', v: 'Energy reduced', m: 'across blocks' },
                  { k: '₹2.4 Cr', v: 'Annual savings', m: 'verified billing' },
                  { k: '3.8 yr', v: 'Payback period', m: 'blended capex' },
                ].map((s, i) => (
                  <div
                    key={s.v}
                    className={`pr-4 ${i !== 0 ? 'border-l border-border pl-4' : ''}`}
                  >
                    <dt className="font-display num-tabular text-3xl font-semibold tracking-tighter sm:text-4xl">
                      {s.k}
                    </dt>
                    <dd className="mt-2 text-sm font-medium text-foreground">{s.v}</dd>
                    <dd className="mt-0.5 text-[11px] text-muted-foreground">
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
                  <Tag tone="muted" className="font-mono normal-case tracking-[0.04em]">
                    REC&nbsp;#ARS-0421
                  </Tag>
                </div>
              </div>
              <div className="space-y-5 p-5">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <Kicker>Today's solar yield</Kicker>
                    <p className="font-display num-tabular mt-1 text-3xl font-semibold tracking-tighter">
                      612 <span className="text-base font-medium text-muted-foreground">kWh</span>
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1 text-[12px] font-semibold text-primary">
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
                      <Kicker>{k}</Kicker>
                      <p className="font-display num-tabular mt-1 text-base font-semibold tracking-tight">
                        {v}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </Reveal>
        </div>

        <Reveal delay={0.25}>
          <a
            href="#problem"
            className="mt-16 flex w-fit items-center gap-2 border border-border bg-card px-3 py-1.5 text-[12px] font-medium tracking-tight text-muted-foreground hover:text-foreground"
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
