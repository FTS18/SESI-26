'use client'

import * as React from 'react'
import { Mic, MicOff, Volume2 } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useVoiceCommands } from '@/hooks/use-voice-commands'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const SECTION_MAP = {
  hero: 'hero',
  home: 'hero',
  problem: 'problem',
  problems: 'problem',
  solution: 'solutions',
  solutions: 'solutions',
  modules: 'solutions',
  kpi: 'dashboard',
  kpis: 'dashboard',
  metrics: 'dashboard',
  roi: 'roi',
  flow: 'flow',
  system: 'flow',
  timeline: 'timeline',
  phases: 'timeline',
  team: 'team',
  contact: 'footer',
  footer: 'footer',
}

function scrollToId(id) {
  if (typeof document === 'undefined') return
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function VoiceButton({ compact = false }) {
  const { setTheme } = useTheme()
  const router = useRouter()
  const pathname = usePathname()
  const [feedback, setFeedback] = React.useState(null)

  const showFeedback = (text) => {
    setFeedback(text)
    window.clearTimeout(showFeedback._t)
    showFeedback._t = window.setTimeout(() => setFeedback(null), 2600)
  }

  const handleCommand = React.useCallback(
    (raw) => {
      const cmd = raw.toLowerCase().trim()

      // Theme commands
      if (/(dark mode (on|enable)|enable dark|switch to dark|night mode)/.test(cmd)) {
        setTheme('dark')
        showFeedback('Dark mode on')
        return
      }
      if (/(light mode|dark mode off|disable dark|day mode)/.test(cmd)) {
        setTheme('light')
        showFeedback('Light mode on')
        return
      }
      // Scroll commands
      if (/(scroll down|page down|go down)/.test(cmd)) {
        window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' })
        showFeedback('Scrolling down')
        return
      }
      if (/(scroll up|page up|go up|back to top|top of page)/.test(cmd)) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        showFeedback('Scrolling to top')
        return
      }
      // Dashboard / console navigation
      if (/(open|show|go to)\s+(the\s+)?(dashboard|console)/.test(cmd) || /^dashboard$/.test(cmd) || /^console$/.test(cmd)) {
        router.push('/dashboard')
        showFeedback('Opening dashboard')
        return
      }
      if (/(go|back)\s+home|go to home|home page/.test(cmd) || cmd === 'home') {
        router.push('/')
        showFeedback('Back to home')
        return
      }

      // Section navigation
      const m = cmd.match(/(?:go to|open|show|navigate to|jump to)\s+(?:the\s+)?(\w+)/)
      if (m) {
        const target = SECTION_MAP[m[1]]
        if (target) {
          if (pathname !== '/') {
            router.push('/#' + target)
          } else {
            scrollToId(target)
          }
          showFeedback(`Opening ${m[1]}`)
          return
        }
      }
      const word = cmd.split(/\s+/).pop()
      if (word && SECTION_MAP[word]) {
        if (pathname !== '/') {
          router.push('/#' + SECTION_MAP[word])
        } else {
          scrollToId(SECTION_MAP[word])
        }
        showFeedback(`Opening ${word}`)
        return
      }
      showFeedback(`Sorry, didn't catch that`)
    },
    [setTheme, router, pathname],
  )

  const { supported, listening, start, stop, transcript } = useVoiceCommands(handleCommand)

  const toggle = () => {
    if (!supported) {
      showFeedback('Voice not supported in this browser')
      return
    }
    if (listening) stop()
    else start()
  }

  return (
    <>
      <Button
        type="button"
        size={compact ? 'icon' : 'default'}
        onClick={toggle}
        aria-label={listening ? 'Stop voice navigation' : 'Start voice navigation'}
        aria-pressed={listening}
        style={{ borderRadius: 0 }}
        className={cn(
          'border-2 border-foreground font-mono text-xs font-bold uppercase tracking-widest brutal-shadow-sm transition-transform hover:translate-x-[-1px] hover:translate-y-[-1px] hover:brutal-shadow',
          listening
            ? 'bg-primary text-primary-foreground hover:bg-primary'
            : 'bg-background text-foreground hover:bg-background',
          compact && 'h-9 w-9',
        )}
      >
        {listening ? (
          <Mic className="h-4 w-4" aria-hidden />
        ) : (
          <MicOff className="h-4 w-4" aria-hidden />
        )}
        {!compact && (
          <span className="ml-2">{listening ? 'Listening' : 'Voice'}</span>
        )}
        {listening && (
          <span className="absolute -right-1 -top-1 inline-flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping bg-primary opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 bg-primary" />
          </span>
        )}
      </Button>

      <AnimatePresence>
        {(feedback || (listening && transcript)) && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.18 }}
            className="fixed bottom-8 left-1/2 z-[60] -translate-x-1/2"
            role="status"
            aria-live="polite"
          >
            <div
              className="flex items-center gap-2 border-2 border-foreground bg-background px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest brutal-shadow"
              style={{ borderRadius: 0 }}
            >
              <Volume2 className="h-3.5 w-3.5 text-primary" aria-hidden />
              <span>{feedback || `"${transcript}"`}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
