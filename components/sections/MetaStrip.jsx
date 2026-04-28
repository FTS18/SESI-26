'use client'

import * as React from 'react'

export function MetaStrip() {
  const items = [
    'Edition 01 — 2026',
    'Climate-tech blueprint',
    '8 modules · one operating layer',
    '25% energy reduction',
    '₹2.4 Cr annual · 4,200 t CO₂',
    'Voice-navigable · WCAG-friendly',
  ]
  const row = items.concat(items)
  return (
    <div className="overflow-hidden border-y border-border bg-card">
      <div className="flex">
        <div className="marquee-track flex shrink-0 animate-marquee items-center gap-12 py-2.5 pr-12">
          {row.map((t, i) => (
            <span
              key={i}
              className="inline-flex shrink-0 items-center gap-3 text-[12px] font-medium tracking-tight text-muted-foreground"
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
