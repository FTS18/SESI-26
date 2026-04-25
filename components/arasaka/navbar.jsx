'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, Leaf, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { ThemeToggle } from '@/components/arasaka/theme-toggle'
import { VoiceButton } from '@/components/arasaka/voice-button'
import { cn } from '@/lib/utils'

const SECTION_LINKS = [
  { id: 'problem', label: 'Problem' },
  { id: 'solutions', label: 'Solutions' },
  { id: 'dashboard', label: 'KPIs' },
  { id: 'roi', label: 'ROI' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'team', label: 'Team' },
]

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const onHome = pathname === '/'

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const goToSection = (id) => {
    setOpen(false)
    if (!onHome) {
      router.push('/#' + id)
      return
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-200',
        scrolled
          ? 'border-b-2 border-foreground bg-background'
          : 'border-b-2 border-transparent bg-background/85 backdrop-blur',
      )}
      role="banner"
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:bg-primary focus:px-3 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <nav
        className="container flex h-16 items-center justify-between gap-4"
        aria-label="Primary"
      >
        <Link
          href="/"
          className="flex items-center gap-2 outline-none"
          aria-label="Arasaka home"
        >
          <span className="flex h-9 w-9 items-center justify-center border-2 border-foreground bg-primary text-primary-foreground brutal-shadow-sm">
            <Leaf className="h-4 w-4" aria-hidden />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            ARASAKA
          </span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex" role="menubar">
          {SECTION_LINKS.map((l) => (
            <li key={l.id} role="none">
              <button
                role="menuitem"
                onClick={() => goToSection(l.id)}
                className="px-3 py-2 font-mono text-xs font-bold uppercase tracking-widest text-foreground/70 transition-colors hover:text-foreground"
              >
                {l.label}
              </button>
            </li>
          ))}
          <li role="none">
            <Link
              href="/dashboard"
              className={cn(
                'inline-flex items-center gap-1 px-3 py-2 font-mono text-xs font-bold uppercase tracking-widest transition-colors',
                pathname === '/dashboard'
                  ? 'text-primary'
                  : 'text-foreground/70 hover:text-foreground',
              )}
            >
              Console
              <ArrowUpRight className="h-3 w-3" aria-hidden />
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <VoiceButton compact />
          </div>
          <ThemeToggle />
          <Link href="/dashboard" className="hidden sm:inline-flex">
            <Button
              size="sm"
              className="h-9 border-2 border-foreground bg-primary font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground brutal-shadow-sm hover:bg-primary hover:brightness-95"
              style={{ borderRadius: 0 }}
            >
              Open Dashboard
            </Button>
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="h-9 w-9 border-2 border-foreground brutal-shadow-sm lg:hidden"
                style={{ borderRadius: 0 }}
                aria-label="Open menu"
              >
                <Menu className="h-4 w-4" aria-hidden />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-72 border-l-2 border-foreground"
              style={{ borderRadius: 0 }}
            >
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex h-full flex-col gap-2 pt-6">
                <div className="mb-4 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center border-2 border-foreground bg-primary text-primary-foreground">
                    <Leaf className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="font-display text-base font-bold tracking-tight">
                    ARASAKA
                  </span>
                </div>
                {SECTION_LINKS.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => goToSection(l.id)}
                    className="px-3 py-3 text-left font-mono text-xs font-bold uppercase tracking-widest text-foreground/80 hover:bg-accent"
                  >
                    {l.label}
                  </button>
                ))}
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="px-3 py-3 text-left font-mono text-xs font-bold uppercase tracking-widest text-primary"
                >
                  Open Dashboard →
                </Link>
                <div className="mt-2 flex flex-col gap-2 border-t-2 border-foreground pt-4">
                  <VoiceButton />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
