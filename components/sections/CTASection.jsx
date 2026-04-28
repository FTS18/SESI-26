'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VoiceButton } from '@/components/arasaka/voice-button'
import { Card } from '@/components/arasaka/swiss'
import { Reveal } from '@/components/arasaka/layout-utils'

export function CTASection() {
  return (
    <section className="border-t border-border py-24 sm:py-32" aria-label="Call to action">
      <div className="container">
        <Reveal>
          <Card className="relative overflow-hidden bg-foreground text-background">
            <div className="absolute inset-0 dot-pattern opacity-[0.04]" aria-hidden />
            <div className="relative grid gap-8 p-10 sm:p-14 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-8">
                <div className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.16em] text-background/60">
                  <span className="font-display num-tabular text-background">08</span>
                  <span className="h-px w-8 bg-background/30" aria-hidden />
                  <span>Ready to build</span>
                </div>
                <h3 className="font-display mt-5 text-balance text-3xl font-semibold leading-tight tracking-tighter sm:text-4xl lg:text-5xl">
                  Turn your campus into a living, breathing climate-tech platform.
                </h3>
                <p className="mt-4 max-w-2xl text-base text-background/75">
                  Try the voice console — say{' '}
                  <span className="font-mono text-primary">"open dashboard"</span>,{' '}
                  <span className="font-mono text-primary">"show team"</span> or{' '}
                  <span className="font-mono text-primary">"dark mode on"</span>.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:flex-col lg:items-end lg:justify-end">
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="h-11 w-full gap-2 bg-primary px-5 text-[13px] font-semibold tracking-tight text-primary-foreground hover:bg-primary/90 sm:w-auto"
                    style={{ borderRadius: 'var(--radius)' }}
                  >
                    Open Dashboard
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </Button>
                </Link>
                <VoiceButton />
              </div>
            </div>
          </Card>
        </Reveal>
      </div>
    </section>
  )
}
