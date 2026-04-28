'use client'

import * as React from 'react'
import { ArrowUpRight, ArrowDownRight, Sun } from 'lucide-react'
import { ResponsiveContainer, LineChart, Line } from 'recharts'
import { Tag, Kicker } from '@/components/arasaka/swiss'
import { cn } from '@/lib/utils'

export const MODULE_COLOR = {
  hvac: 'hsl(var(--chart-1))',
  lighting: 'hsl(var(--chart-2))',
  ev: 'hsl(var(--chart-3))',
  water: 'hsl(var(--chart-4))',
  rvm: 'hsl(var(--chart-5))',
}

export const fmtNum = (n) => {
  if (n == null || Number.isNaN(n)) return '—'
  if (Math.abs(n) >= 1000) return (n / 1000).toFixed(1) + 'k'
  return Math.round(n).toLocaleString('en-IN')
}

export function KpiTile({ index, label, value, suffix, delta, icon: Icon, sub }) {
  const positive = delta != null && delta >= 0
  return (
    <div className="relative h-full bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Kicker>{label}</Kicker>
          <p className="font-display num-tabular mt-3 text-3xl font-semibold tracking-tighter">
            {value}
            {suffix && (
              <span className="ml-1 text-base font-medium text-muted-foreground">{suffix}</span>
            )}
          </p>
          {sub && <p className="mt-1.5 text-xs text-muted-foreground">{sub}</p>}
        </div>
        <div className="flex flex-col items-end gap-3">
          <span className="font-display num-tabular text-sm text-muted-foreground">
            {String(index).padStart(2, '0')}
          </span>
          {Icon && (
            <div className="flex h-9 w-9 items-center justify-center border border-border bg-background">
              <Icon className="h-4 w-4" aria-hidden />
            </div>
          )}
        </div>
      </div>
      {delta != null && (
        <div className="mt-4">
          <span
            className={cn(
              'inline-flex items-center gap-1 border px-2 py-0.5 text-[11px] font-semibold tracking-tight',
              positive
                ? 'border-primary/40 bg-primary/8 text-primary'
                : 'border-destructive/40 bg-destructive/10 text-destructive',
            )}
            style={{ borderRadius: 'var(--radius)' }}
          >
            {positive ? (
              <ArrowUpRight className="h-3 w-3" aria-hidden />
            ) : (
              <ArrowDownRight className="h-3 w-3" aria-hidden />
            )}
            {Math.abs(delta).toFixed(1)}% vs prior
          </span>
        </div>
      )}
      <div className="absolute bottom-0 left-0 h-0.5 w-12 bg-primary" aria-hidden />
    </div>
  )
}

export function FrameHeader({ title, subtitle, right }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border p-5">
      <div className="min-w-0">
        <h3 className="font-display truncate text-base font-semibold leading-tight tracking-tight">
          {title}
        </h3>
        {subtitle && <Kicker className="mt-1 block">{subtitle}</Kicker>}
      </div>
      {right}
    </div>
  )
}

export function Sparkline({ data }) {
  return (
    <div className="h-12">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <Line type="monotone" dataKey="y" stroke="hsl(var(--primary))" strokeWidth={1.6} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function TooltipBox(props) {
  if (!props.active || !props.payload?.length) return null
  return (
    <div
      className="border border-border bg-popover p-2.5 text-[12px] shadow-sm"
      style={{ borderRadius: 'var(--radius)', fontFamily: 'var(--font-sora)' }}
    >
      <div className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {props.label}
      </div>
      {props.payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2" style={{ background: p.color }} />
            <span className="text-foreground">{p.name}</span>
          </span>
          <span className="font-display num-tabular font-semibold">{fmtNum(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

export function TogglePill({ active, onClick, children, color }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex items-center gap-2 border px-3 py-1.5 text-[12px] font-medium tracking-tight transition-colors',
        active
          ? 'border-foreground bg-foreground text-background'
          : 'border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground',
      )}
      style={{ borderRadius: 'var(--radius)' }}
    >
      {color && (
        <span
          className="inline-block h-2 w-2 flex-shrink-0"
          style={{ background: color, opacity: active ? 1 : 0.55 }}
          aria-hidden
        />
      )}
      {children}
    </button>
  )
}

export function SolarBanner({ yield: solarYield }) {
  const isHigh = solarYield > 100
  if (!isHigh) return null
  
  return (
    <div className="flex items-center justify-between gap-4 bg-primary px-4 py-2.5 text-primary-foreground">
      <div className="flex items-center gap-3">
        <Sun className="h-4 w-4 animate-pulse" />
        <p className="text-[12px] font-bold uppercase tracking-widest">
          High Solar Yield Detected · {solarYield} kW
        </p>
      </div>
      <p className="hidden text-[11px] font-medium sm:block">
        Arasaka OS has prioritized solar routing for EV Charging & Block A HVAC.
      </p>
      <Tag tone="muted" className="bg-primary-foreground/20 text-[10px] font-bold text-primary-foreground">
        Active Routing
      </Tag>
    </div>
  )
}
