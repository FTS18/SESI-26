'use client'

import * as React from 'react'
import { Wifi, Cpu, Settings2, TrendingUp, ArrowRight, ShieldCheck, Cloud, Activity } from 'lucide-react'
import { Card, Tag } from '@/components/arasaka/swiss'
import { Reveal, SectionHeader } from '@/components/arasaka/layout-utils'

const FLOW_STAGES = [
  { icon: Wifi, title: 'Sensors', desc: 'Occupancy, energy, CO₂, weather and EV telemetry stream from every block.', tag: 'Edge' },
  { icon: Cpu, title: 'AI Logic', desc: 'Forecasting + policy engine decides the optimal action for the next 15 minutes.', tag: 'Brain' },
  { icon: Settings2, title: 'Controls', desc: 'HVAC setpoints, lighting, charging slots and water-cooler load are actuated automatically.', tag: 'Actuators' },
  { icon: TrendingUp, title: 'Savings', desc: 'Verified savings, CO₂ reduction and circular rewards close the loop on the dashboard.', tag: 'Outcome' },
]

export function FlowSection() {
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
                className="inline-flex items-center gap-2 border border-border bg-card px-2.5 py-1 text-[11px] font-medium tracking-tight text-muted-foreground"
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
