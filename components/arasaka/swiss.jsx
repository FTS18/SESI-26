import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Hairline Swiss card.
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

/**
 * Refined Swiss tag (no monospace by default).
 */
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
        'inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]',
        tones[tone],
        className,
      )}
      style={{ borderRadius: 'var(--radius)' }}
    >
      {children}
    </span>
  )
}

/**
 * Numbered eyebrow with hairline rule. Index uses Chivo (display) tabular numbers,
 * label uses Sora with refined letter-spacing.
 */
export function SectionEyebrow({ index, label, className }) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground',
        className,
      )}
    >
      {index != null && (
        <span className="font-display num-tabular text-foreground">{String(index).padStart(2, '0')}</span>
      )}
      <span className="h-px w-8 bg-border" aria-hidden />
      <span>{label}</span>
    </div>
  )
}

/** Inline mini eyebrow without index */
export function Kicker({ children, className }) {
  return (
    <span
      className={cn(
        'text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground',
        className,
      )}
    >
      {children}
    </span>
  )
}
