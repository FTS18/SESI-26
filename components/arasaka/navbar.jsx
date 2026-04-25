'use client'

import * as React from 'react'
import Link from 'next/link'
import { Menu, X, Leaf } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { ThemeToggle } from '@/components/arasaka/theme-toggle'
import { VoiceButton } from '@/components/arasaka/voice-button'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { id: 'problem', label: 'Problem' },
  { id: 'solutions', label: 'Solutions' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'roi', label: 'ROI' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'team', label: 'Team' },
]

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const goTo = (id) => {
    setOpen(false)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-border/70 bg-background/80 backdrop-blur-xl'
          : 'border-b border-transparent bg-background/50 backdrop-blur',
      )}
      role="banner"
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Skip to main content
      </a>
      <nav
        className="container flex h-16 items-center justify-between gap-4"
        aria-label="Primary"
      >
        <button
          onClick={() => goTo('hero')}
          className="flex items-center gap-2 rounded-md outline-none"
          aria-label="Arasaka home"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg gradient-green text-white shadow-sm">
            <Leaf className="h-4 w-4" aria-hidden />
          </span>
          <span className="text-base font-semibold tracking-tight">
            ARASAKA
          </span>
        </button>

        <ul className="hidden items-center gap-1 lg:flex" role="menubar">
          {NAV_LINKS.map((l) => (
            <li key={l.id} role="none">
              <button
                role="menuitem"
                onClick={() => goTo(l.id)}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <VoiceButton compact />
          </div>
          <ThemeToggle />
          <Button
            onClick={() => goTo('dashboard')}
            className="hidden sm:inline-flex"
            size="sm"
          >
            View Dashboard
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="h-9 w-9 lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-4 w-4" aria-hidden />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex h-full flex-col gap-2 pt-6">
                <div className="mb-4 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg gradient-green text-white">
                    <Leaf className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="text-base font-semibold tracking-tight">
                    ARASAKA
                  </span>
                </div>
                {NAV_LINKS.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => goTo(l.id)}
                    className="rounded-md px-3 py-3 text-left text-sm font-medium text-foreground/80 hover:bg-accent"
                  >
                    {l.label}
                  </button>
                ))}
                <div className="mt-2 flex flex-col gap-2 border-t border-border pt-4">
                  <VoiceButton />
                  <Button onClick={() => goTo('dashboard')} className="w-full">
                    View Dashboard
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
