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
  hero: 'hero', home: 'hero',
  problem: 'problem', problems: 'problem',
  solution: 'solutions', solutions: 'solutions', modules: 'solutions',
  kpi: 'kpis', kpis: 'kpis', metrics: 'kpis',
  roi: 'roi',
  flow: 'flow', system: 'flow',
  timeline: 'timeline', phases: 'timeline',
  team: 'team',
  contact: 'footer', footer: 'footer',
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
    showFeedback._t = window.setTimeout(() => setFeedback(null), 2400)
  }

  const handleCommand = React.useCallback(
    (raw) => {
      const cmd = raw.toLowerCase().trim()
      if (/(dark mode (on|enable)|enable dark|switch to dark|night mode)/.test(cmd)) {
        setTheme('dark'); showFeedback('Dark mode on'); return
      }
      if (/(light mode|dark mode off|disable dark|day mode)/.test(cmd)) {
        setTheme('light'); showFeedback('Light mode on'); return
      }
      if (/(scroll down|page down|go down)/.test(cmd)) {
        window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' }); showFeedback('Scrolling down'); return
      }
      if (/(scroll up|page up|go up|back to top|top of page)/.test(cmd)) {
        window.scrollTo({ top: 0, behavior: 'smooth' }); showFeedback('Scrolling to top'); return
      }
      if (/(open|show|go to)\s+(the\s+)?(dashboard|console)/.test(cmd) || /^dashboard$/.test(cmd) || /^console$/.test(cmd)) {
        router.push('/dashboard'); showFeedback('Opening dashboard'); return
      }
      if (/(go|back)\s+home|go to home|home page/.test(cmd) || cmd === 'home') {
        router.push('/'); showFeedback('Back to home'); return
      }
      const m = cmd.match(/(?:go to|open|show|navigate to|jump to)\s+(?:the\s+)?(\w+)/)
      if (m) {
        const target = SECTION_MAP[m[1]]
        if (target) {
          if (pathname !== '/') router.push('/#' + target)
          else scrollToId(target)
          showFeedback(`Opening ${m[1]}`); return
        }
      }
      const word = cmd.split(/\s+/).pop()
      if (word && SECTION_MAP[word]) {
        if (pathname !== '/') router.push('/#' + SECTION_MAP[word])
        else scrollToId(SECTION_MAP[word])
        showFeedback(`Opening ${word}`); return
      }
      showFeedback(`Sorry, didn't catch that`)
    },
    [setTheme, router, pathname],
  )

  const { supported, listening, start, stop, transcript } = useVoiceCommands(handleCommand)

  const toggle = () => {
    if (!supported) { showFeedback('Voice not supported in this browser'); return }
    if (listening) stop(); else start()
  }

  return (
    <>
      <Button
        type="button"
        size={compact ? 'icon' : 'default'}
        onClick={toggle}
        aria-label={listening ? 'Stop voice navigation' : 'Start voice navigation'}
        aria-pressed={listening}
        className={cn(
          'relative gap-2 border border-border bg-card text-[12px] font-semibold tracking-tight text-foreground transition-colors hover:bg-muted',
          listening && 'border-primary bg-primary text-primary-foreground hover:bg-primary',
          compact && 'h-9 w-9',
        )}
        style={{ borderRadius: 'var(--radius)' }}
      >
        {listening ? <Mic className="h-4 w-4" aria-hidden /> : <MicOff className="h-4 w-4" aria-hidden />}
        {!compact && <span>{listening ? 'Listening' : 'Voice'}</span>}
        {listening && (
          <span className="absolute -right-1 -top-1 inline-flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
          </span>
        )}
      </Button>
      <AnimatePresence>
        {(feedback || (listening && transcript)) && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.18 }}
            className="fixed bottom-8 left-1/2 z-[60] -translate-x-1/2"
            role="status"
            aria-live="polite"
          >
            <div
              className="flex items-center gap-2 border border-border bg-card px-4 py-2 text-[12px] font-medium shadow-sm"
              style={{ borderRadius: 'var(--radius)' }}
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
