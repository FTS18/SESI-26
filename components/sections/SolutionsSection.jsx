'use client'

import * as React from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Card, Tag } from '@/components/arasaka/swiss'
import { Reveal, SectionHeader } from '@/components/arasaka/layout-utils'
import { SOLUTIONS } from '@/lib/arasaka-data'

export function SolutionsSection() {
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
                    <span className="font-display num-tabular text-sm text-muted-foreground">
                      {String(i + 1).padStart(2, '0')}
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
