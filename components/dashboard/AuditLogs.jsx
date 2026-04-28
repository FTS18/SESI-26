'use client'

import * as React from 'react'
import { Terminal, Clock, ShieldCheck, Zap } from 'lucide-react'
import { Card, Tag, Kicker } from '@/components/arasaka/swiss'

export function AuditLogs() {
  const [logs, setLogs] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetch('/api/logs')
      .then(res => res.json())
      .then(data => {
        setLogs(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return null

  return (
    <Card className="h-full bg-muted/5 overflow-hidden flex flex-col">
      <div className="flex items-center gap-2 border-b border-border bg-muted/10 px-4 py-3">
        <Terminal className="h-4 w-4 text-primary" />
        <h4 className="text-xs font-bold uppercase tracking-widest">Autonomous Audit Log</h4>
      </div>
      
      <div className="flex-1 overflow-y-auto font-mono text-[11px] p-4 space-y-3">
        {logs.map((log, i) => (
          <div key={i} className="flex gap-3 text-muted-foreground">
            <span className="text-primary/50 shrink-0">[{new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}]</span>
            <div>
              <span className="text-foreground font-bold mr-1">OS_{log.module}:</span>
              {log.message}
            </div>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-2 opacity-30">
            <ShieldCheck className="h-8 w-8" />
            <p>System Operating Normally</p>
          </div>
        )}
      </div>
    </Card>
  )
}
