'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * useVoiceCommands
 * Browser Web Speech API based voice navigation.
 * Calls the provided onCommand callback with a normalized command string.
 */
export function useVoiceCommands(onCommand) {
  const [supported, setSupported] = useState(false)
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState(null)
  const recognitionRef = useRef(null)
  const onCommandRef = useRef(onCommand)

  useEffect(() => {
    onCommandRef.current = onCommand
  }, [onCommand])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setSupported(false)
      return
    }
    setSupported(true)
    const rec = new SpeechRecognition()
    rec.continuous = false
    rec.interimResults = false
    rec.lang = 'en-US'
    rec.maxAlternatives = 1

    rec.onresult = (event) => {
      const text = event.results[0][0].transcript.trim().toLowerCase()
      setTranscript(text)
      if (onCommandRef.current) onCommandRef.current(text)
    }
    rec.onerror = (e) => {
      setError(e.error || 'voice_error')
      setListening(false)
    }
    rec.onend = () => setListening(false)

    recognitionRef.current = rec
    return () => {
      try { rec.abort() } catch { /* ignore */ }
    }
  }, [])

  const start = useCallback(() => {
    if (!recognitionRef.current) return
    setError(null)
    try {
      recognitionRef.current.start()
      setListening(true)
    } catch {
      // already started
    }
  }, [])

  const stop = useCallback(() => {
    if (!recognitionRef.current) return
    try { recognitionRef.current.stop() } catch { /* ignore */ }
    setListening(false)
  }, [])

  return { supported, listening, transcript, error, start, stop }
}
