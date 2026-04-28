'use client'

import * as React from 'react'
import { Card, Tag } from '@/components/arasaka/swiss'
import { Reveal, SectionHeader } from '@/components/arasaka/layout-utils'
import { TIMELINE } from '@/lib/arasaka-data'

export function TimelineSection() {
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
