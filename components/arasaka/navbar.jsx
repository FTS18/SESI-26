'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { ThemeToggle } from '@/components/arasaka/theme-toggle'
import { VoiceButton } from '@/components/arasaka/voice-button'
import { cn } from '@/lib/utils'

const SECTION_LINKS = [
  { id: 'problem', label: 'Problem', n: '01' },
  { id: 'solutions', label: 'Solutions', n: '02' },
  { id: 'kpis', label: 'KPIs', n: '03' },
  { id: 'roi', label: 'ROI', n: '04' },
  { id: 'timeline', label: 'Timeline', n: '05' },
  { id: 'team', label: 'Team', n: '06' },
]

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 outline-none" aria-label="Arasaka home">
      <span
        aria-hidden
        className="relative flex h-7 w-7 items-center justify-center bg-foreground text-background"
        style={{ borderRadius: 'var(--radius)' }}
      >
        <span className="font-display text-[12px] font-bold leading-none tracking-tight">A</span>
        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 bg-primary" style={{ borderRadius: '1px' }} />
      </span>
      <span className="font-display text-[15px] font-semibold tracking-tight">Arasaka</span>
    </Link>
  )
}

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const onHome = pathname === '/'

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
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
          ? 'border-b border-border bg-background/85 backdrop-blur-md'
          : 'border-b border-transparent bg-background/70 backdrop-blur',
      )}
      role="banner"
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:bg-primary focus:px-3 focus:py-2 focus:text-[11px] focus:font-medium focus:uppercase focus:tracking-[0.16em] focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <nav className="container flex h-14 items-center justify-between gap-4" aria-label="Primary">
        <Logo />

        <ul className="hidden items-center gap-1 lg:flex" role="menubar">
          {SECTION_LINKS.map((l) => (
            <li key={l.id} role="none">
              <button
                role="menuitem"
                onClick={() => goToSection(l.id)}
                className="px-3 py-2 text-[12px] font-medium tracking-tight text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </button>
            </li>
          ))}
          <li role="none" aria-hidden className="mx-1 h-4 w-px bg-border" />
          <li role="none">
            <Link
              href="/dashboard"
              className={cn(
                'inline-flex items-center gap-1 px-3 py-2 text-[12px] font-medium tracking-tight transition-colors',
                pathname === '/dashboard'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground',
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
              className="h-9 bg-primary px-4 text-[12px] font-semibold tracking-tight text-primary-foreground hover:bg-primary/90"
              style={{ borderRadius: 'var(--radius)' }}
            >
              Open Dashboard
            </Button>
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="h-9 w-9 border border-border bg-card lg:hidden"
                style={{ borderRadius: 'var(--radius)' }}
                aria-label="Open menu"
              >
                <Menu className="h-4 w-4" aria-hidden />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-72 border-l border-border"
              style={{ borderRadius: 0 }}
            >
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex h-full flex-col gap-2 pt-6">
                <Logo />
                <div className="my-4 h-px bg-border" />
                {SECTION_LINKS.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => goToSection(l.id)}
                    className="flex items-center gap-3 px-1 py-2 text-left text-[13px] font-medium tracking-tight text-foreground/80 hover:text-foreground"
                  >
                    <span className="font-display num-tabular text-[11px] text-muted-foreground">{l.n}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
                <div className="my-2 h-px bg-border" />
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-1 py-2 text-[13px] font-semibold tracking-tight text-primary"
                >
                  <span className="font-display num-tabular text-[11px]">07</span>
                  <span>Open Dashboard</span>
                  <ArrowUpRight className="ml-auto h-3 w-3" aria-hidden />
                </Link>
                <div className="mt-2">
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
