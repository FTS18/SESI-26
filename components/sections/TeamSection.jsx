'use client'

import * as React from 'react'
import { Linkedin, Github, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, Kicker } from '@/components/arasaka/swiss'
import { Reveal, SectionHeader } from '@/components/arasaka/layout-utils'
import { TEAM } from '@/lib/arasaka-data'

export function TeamSection() {
  return (
    <section id="team" className="border-t border-border py-24 sm:py-32" aria-labelledby="team-title">
      <div className="container">
        <SectionHeader
          index="07"
          label="Team"
          title="Builders behind Arasaka."
          description="A pragmatic duo bridging energy systems engineering and sustainability operations."
        />
        <div className="mt-14 grid max-w-3xl gap-5 sm:grid-cols-2">
          {TEAM.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.08}>
              <Card>
                <div className="flex items-center gap-4 border-b border-border p-5">
                  <Avatar
                    className="h-14 w-14 border border-border"
                    style={{ borderRadius: 'var(--radius)' }}
                  >
                    <AvatarFallback
                      className="bg-foreground font-display text-base font-semibold text-background"
                      style={{ borderRadius: 'calc(var(--radius) - 1px)' }}
                    >
                      {m.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <h3 className="font-display truncate text-lg font-semibold tracking-tight">{m.name}</h3>
                    <Kicker className="block">{m.role}</Kicker>
                  </div>
                </div>
                <div className="space-y-4 p-5">
                  <p className="text-sm text-muted-foreground">{m.bio}</p>
                  <div className="flex items-center gap-2">
                    {[Linkedin, Github, Mail].map((Icon, j) => (
                      <Button
                        key={j}
                        size="icon"
                        variant="outline"
                        className="h-9 w-9 border border-border bg-card hover:bg-muted"
                        style={{ borderRadius: 'var(--radius)' }}
                        aria-label={`${m.name} link ${j}`}
                      >
                        <Icon className="h-4 w-4" aria-hidden />
                      </Button>
                    ))}
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
