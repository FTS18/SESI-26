'use client'

import * as React from 'react'
import { Card, Tag, Kicker } from '@/components/arasaka/swiss'
import { FrameHeader } from './DashboardComponents'

export function ClassroomHeatmap({ data, blockLabel }) {
  if (!data || !data.cells?.length) {
    return (
      <Card className="p-6 text-sm text-muted-foreground">
        Heatmap unavailable for this block.
      </Card>
    )
  }
  const flat = data.cells.flat()
  const peak = Math.max(...flat.map((c) => c.kwh))
  const avg = (flat.reduce((s, c) => s + c.kwh, 0) / flat.length).toFixed(1)

  return (
    <Card>
      <FrameHeader
        title="Classroom heatmap"
        subtitle={`${data.floors} floors · ${data.rooms} rooms per floor`}
        right={<Tag tone="muted">{flat.length} rooms</Tag>}
      />
      <div className="space-y-3 p-5">
        <div className="grid grid-cols-3 border border-border">
          {[
            ['Average', avg + ' kWh'],
            ['Peak', peak.toFixed(1) + ' kWh'],
            ['Hottest', flat.reduce((a, b) => (b.kwh > a.kwh ? b : a)).label],
          ].map(([k, v], i) => (
            <div key={k} className={i !== 0 ? 'border-l border-border p-3' : 'p-3'}>
              <Kicker>{k}</Kicker>
              <p className="font-display num-tabular mt-0.5 text-sm font-semibold tracking-tight">{v}</p>
            </div>
          ))}
        </div>

        <div className="space-y-1.5 pt-2">
          {data.cells.map((row, f) => (
            <div key={f} className="flex items-center gap-3">
              <span className="font-display num-tabular w-8 text-xs text-muted-foreground">
                F{data.floors - f}
              </span>
              <div
                className="grid flex-1 gap-1"
                style={{ gridTemplateColumns: `repeat(${data.rooms}, minmax(0, 1fr))` }}
              >
                {row.map((c) => (
                  <div
                    key={c.label}
                    role="img"
                    aria-label={`${c.label} ${c.kwh} kWh, ${c.occupancy} occupants`}
                    title={`${c.label} · ${c.kwh} kWh · ${c.occupancy} occ.`}
                    className="aspect-square border border-border transition-transform hover:scale-110 hover:border-foreground"
                    style={{
                      background: `hsl(var(--primary) / ${(0.12 + c.intensity * 0.78).toFixed(3)})`,
                      borderRadius: 'var(--radius)',
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-border pt-3">
          <Kicker>{blockLabel} · intensity scale</Kicker>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground">Low</span>
            <div className="flex h-2 w-32 overflow-hidden border border-border" style={{ borderRadius: 'var(--radius)' }}>
              {[0.15, 0.3, 0.45, 0.6, 0.75, 0.9].map((v) => (
                <span
                  key={v}
                  className="flex-1"
                  style={{ background: `hsl(var(--primary) / ${v})` }}
                  aria-hidden
                />
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground">High</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
