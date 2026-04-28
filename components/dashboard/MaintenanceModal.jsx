'use client'

import * as React from 'react'
import { Plus, X, AlertTriangle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, Tag } from '@/components/arasaka/swiss'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

export function MaintenanceModal({ isOpen, onClose, blocks = [] }) {
  const [loading, setLoading] = React.useState(false)
  const [formData, setFormData] = React.useState({
    blockId: '',
    module: 'HVAC',
    priority: 'medium',
    description: ''
  })

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        toast.success('Maintenance ticket raised successfully')
        onClose()
      }
    } catch (e) {
      toast.error('Failed to raise ticket')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold tracking-tight font-display">Raise Maintenance Ticket</h3>
          <button onClick={onClose} className="p-1 hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Location</label>
            <Select onValueChange={(v) => setFormData({...formData, blockId: v})}>
              <SelectTrigger><SelectValue placeholder="Select Block" /></SelectTrigger>
              <SelectContent>
                {blocks.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Module</label>
            <Select onValueChange={(v) => setFormData({...formData, module: v})} defaultValue="HVAC">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="HVAC">HVAC / Cooling</SelectItem>
                <SelectItem value="SOLAR">Solar Panels</SelectItem>
                <SelectItem value="EV">EV Charging</SelectItem>
                <SelectItem value="RVM">Recycling Machine</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Issue Description</label>
            <textarea 
              className="w-full min-h-[100px] bg-muted/20 border border-border p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" 
              placeholder="E.g. Sensor reading abnormal, physical damage detected..."
              required
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full h-12 rounded-none font-bold uppercase tracking-widest">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Raise Ticket'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
