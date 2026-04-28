'use client'

import * as React from 'react'
import { Plus } from 'lucide-react'
import { Card, Tag, Kicker } from '@/components/arasaka/swiss'
import { Reveal, SectionHeader } from '@/components/arasaka/layout-utils'
import { ROI_PHASES } from '@/lib/arasaka-data'

export function ROISection() {
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
                  <Kicker>{p.horizon}</Kicker>
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
                        <Kicker>{k}</Kicker>
                        <p className={`font-display num-tabular mt-1 text-base font-semibold tracking-tight ${c}`}>{v}</p>
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
