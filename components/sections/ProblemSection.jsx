'use client'

import * as React from 'react'
import { Card } from '@/components/arasaka/swiss'
import { Reveal, SectionHeader } from '@/components/arasaka/layout-utils'
import { PROBLEMS } from '@/lib/arasaka-data'

export function ProblemSection() {
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
                  <span className="font-display num-tabular text-sm text-muted-foreground">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="font-display mt-6 text-lg font-semibold leading-snug tracking-tight">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                <div className="mt-6 border-t border-border pt-4">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
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
