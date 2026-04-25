import * as React from 'react'
import { cn } from '@/lib/utils'

export function BrutalCard({ className, children, accent = false, ...props }) {
  return (
    <div
      className={cn(
        'border-2 border-foreground bg-card text-card-foreground brutal-shadow',
        accent && 'border-primary brutal-shadow-green',
        className,
      )}
      style={{ borderRadius: 0 }}
      {...props}
    >
      {children}
    </div>
  )
}

export function BrutalTag({ className, children, tone = 'foreground' }) {
  const tones = {
    foreground: 'bg-foreground text-background',
    primary: 'bg-primary text-primary-foreground',
    outline: 'bg-background text-foreground border-2 border-foreground',
    warning: 'bg-[hsl(var(--warning))] text-foreground',
    destructive: 'bg-destructive text-destructive-foreground',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em]',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
