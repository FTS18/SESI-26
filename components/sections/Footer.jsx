'use client'

import * as React from 'react'
import Link from 'next/link'
import { Mic } from 'lucide-react'
import { Kicker } from '@/components/arasaka/swiss'

export function Footer() {
  return (
    <footer id="footer" className="border-t border-border bg-background" role="contentinfo">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center bg-foreground text-background" style={{ borderRadius: 'var(--radius)' }}>
                <span className="font-display text-sm font-bold tracking-tight">A</span>
              </span>
              <span className="font-display text-base font-semibold tracking-tight">Arasaka</span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Integrated Campus Energy &amp; Circular Utility Blueprint. A unified
              operating layer for facilities, finance and sustainability teams.
            </p>
            <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              v0.1 · Hackathon Build · 2026
            </p>
          </div>
          <div className="md:col-span-3">
            <Kicker>Sections</Kicker>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                ['hero', 'Home', '00'],
                ['problem', 'Problem', '01'],
                ['solutions', 'Modules', '02'],
                ['kpis', 'KPIs', '03'],
                ['roi', 'ROI', '04'],
                ['team', 'Team', '07'],
              ].map(([id, label, n]) => (
                <li key={id}>
                  <a href={'#' + id} className="group inline-flex items-center gap-3 transition-colors hover:text-primary">
                    <span className="font-display num-tabular text-xs text-muted-foreground group-hover:text-primary">{n}</span>
                    <span className="font-medium">{label}</span>
                  </a>
                </li>
              ))}
              <li>
                <Link href="/dashboard" className="group inline-flex items-center gap-3 text-primary">
                  <span className="font-display num-tabular text-xs">→</span>
                  <span className="font-semibold">Open Dashboard</span>
                </Link>
              </li>
            </ul>
          </div>
          <div className="md:col-span-4">
            <Kicker>Voice console</Kicker>
            <ul className="mt-4 space-y-1.5 font-mono text-xs">
              {[
                '> open dashboard',
                '> go to roi',
                '> scroll down',
                '> dark mode on',
                '> show team',
              ].map((cmd) => (
                <li key={cmd} className="text-foreground/80">{cmd}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            © {new Date().getFullYear()} Arasaka · Built for campuses that mean it.
          </p>
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            <Mic className="h-3.5 w-3.5" aria-hidden /> Accessibility-first · WCAG-friendly
          </div>
        </div>
      </div>
    </footer>
  )
}
