'use client'

import * as React from 'react'
import { Mic, MicOff, Volume2 } from 'lucide-react'
import { useTheme } from 'next-themes'
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
  dashboard: 'dashboard',
  kpi: 'dashboard',
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
        showFeedback('Dark mode enabled')
        return
      }
      if (/(light mode|dark mode off|disable dark|day mode)/.test(cmd)) {
        setTheme('light')
        showFeedback('Light mode enabled')
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
      // Section navigation: "go to <section>", "open <section>", "show <section>"
      const m = cmd.match(/(?:go to|open|show|navigate to|jump to)\s+(?:the\s+)?(\w+)/)
      if (m) {
        const target = SECTION_MAP[m[1]]
        if (target) {
          scrollToId(target)
          showFeedback(`Opening ${m[1]}`)
          return
        }
      }
      // Single-word fallback ("dashboard", "team", ...)
      const word = cmd.split(/\s+/).pop()
      if (word && SECTION_MAP[word]) {
        scrollToId(SECTION_MAP[word])
        showFeedback(`Opening ${word}`)
        return
      }
      showFeedback(`Sorry, didn't catch that`)
    },
    [setTheme],
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
        variant={listening ? 'default' : 'outline'}
        onClick={toggle}
        aria-label={listening ? 'Stop voice navigation' : 'Start voice navigation'}
        aria-pressed={listening}
        className={cn(
          'relative gap-2 transition-all',
          listening && 'bg-primary text-primary-foreground hover:bg-primary/90',
          compact && 'h-9 w-9',
        )}
      >
        {listening ? (
          <Mic className="h-4 w-4" aria-hidden />
        ) : (
          <MicOff className="h-4 w-4" aria-hidden />
        )}
        {!compact && (
          <span className="text-sm font-medium">
            {listening ? 'Listening…' : 'Voice'}
          </span>
        )}
        {listening && (
          <span className="absolute -right-1 -top-1 inline-flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary"></span>
          </span>
        )}
      </Button>

      <AnimatePresence>
        {(feedback || (listening && transcript)) && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 left-1/2 z-[60] -translate-x-1/2"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center gap-2 rounded-full border border-border/70 bg-card/95 px-4 py-2 text-sm shadow-lg backdrop-blur">
              <Volume2 className="h-4 w-4 text-primary" aria-hidden />
              <span className="font-medium">
                {feedback || `"${transcript}"`}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
