'use client'

import * as React from 'react'
import { ShoppingBag, Zap, Coffee, Gift, Tag as TagIcon, CheckCircle2, Loader2 } from 'lucide-react'
import { Card, Tag, Kicker } from '@/components/arasaka/swiss'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const ICON_MAP = {
  Food: Coffee,
  Utility: Zap,
  Merch: Gift,
}

export function Marketplace({ credits = 0, onPurchase }) {
  const [items, setItems] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [buying, setBuying] = React.useState(null)

  React.useEffect(() => {
    fetch('/api/marketplace')
      .then(res => res.json())
      .then(data => {
        setItems(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleBuy = async (item) => {
    if (credits < item.cost) {
      toast.error('Insufficient Arasaka Credits')
      return
    }

    setBuying(item.id)
    try {
      const res = await fetch('/api/marketplace/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item.id, cost: item.cost, userId: 'guest_user' })
      })
      const result = await res.json()
      
      if (result.success) {
        toast.success(`Purchased ${item.name}! Code: ${result.code}`)
        if (onPurchase) onPurchase(item.cost)
      } else {
        toast.error(result.error || 'Purchase failed')
      }
    } catch (e) {
      toast.error('Network error during purchase')
    } finally {
      setBuying(null)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center border border-dashed border-border">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Kicker>Student Perks</Kicker>
          <h3 className="font-display mt-1 text-2xl font-semibold tracking-tight">Marketplace</h3>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-primary">
          <TagIcon className="h-4 w-4" />
          <span className="font-display num-tabular font-bold">{credits}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest">Credits</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => {
          const Icon = ICON_MAP[item.category] || ShoppingBag
          const canAfford = credits >= item.cost

          return (
            <Card key={item.id} className="group relative flex flex-col overflow-hidden">
              <div className="relative h-32 overflow-hidden border-b border-border">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute left-2 top-2">
                  <Tag tone="muted" className="bg-background/80 backdrop-blur-sm">
                    {item.category}
                  </Tag>
                </div>
              </div>
              
              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-display text-sm font-semibold leading-tight">{item.name}</h4>
                  <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                </div>
                
                <div className="mt-auto pt-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-baseline gap-1">
                      <span className="font-display num-tabular text-lg font-bold">{item.cost}</span>
                      <span className="text-[9px] font-bold uppercase tracking-tighter text-muted-foreground">CR</span>
                    </div>
                    <Button
                      size="sm"
                      disabled={!canAfford || buying === item.id}
                      onClick={() => handleBuy(item)}
                      className="h-8 rounded-none bg-foreground text-[11px] font-bold uppercase tracking-widest text-background"
                    >
                      {buying === item.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        'Redeem'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              
              {!canAfford && (
                <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px]" aria-hidden />
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
