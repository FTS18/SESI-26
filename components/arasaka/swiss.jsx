import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Swiss‐style hairline card. 1px border, no shadow, subtle muted bg on hover.
 */
export function Card({ className, children, accent = false, ...props }) {
  return (
    <div
      className={cn(
        'border border-border bg-card text-card-foreground transition-colors',
        accent && 'border-primary/40',
        className,
      )}
      style={{ borderRadius: 'var(--radius)' }}
      {...props}
    >
      {children}
    </div>
  )
}

/** Swiss-style label tag — hairline outline, mono uppercase */
export function Tag({ className, children, tone = 'outline' }) {
  const tones = {
    outline: 'border border-border bg-transparent text-foreground',
    primary: 'border border-primary/30 bg-primary/8 text-primary',
    fill: 'border border-foreground bg-foreground text-background',
    warning: 'border border-[hsl(var(--warning))]/40 bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))]',
    destructive: 'border border-destructive/40 bg-destructive/10 text-destructive',
    muted: 'border border-border bg-muted text-muted-foreground',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.2em]',
        tones[tone],
        className,
      )}
      style={{ borderRadius: 'var(--radius)' }}
    >
      {children}
    </span>
  )
}

/** Swiss section header with numerical index and rule */
export function SectionEyebrow({ index, label, className }) {
  return (
    <div className={cn('flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground', className)}>
      <span className="text-foreground">{String(index).padStart(2, '0')}</span>
      <span className="h-px w-8 bg-border" aria-hidden />
      <span>{label}</span>
    </div>
  )
}
