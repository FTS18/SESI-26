'use client'

import * as React from 'react'
import { Sun, BatteryCharging, ShieldCheck, Info, ExternalLink } from 'lucide-react'
import { Card, Tag, Kicker } from '@/components/arasaka/swiss'
import { Button } from '@/components/ui/button'

export function EvCanopy({ ads = [] }) {
  return (
    <div className="space-y-6">
      <div>
        <Kicker>Integrated Infrastructure</Kicker>
        <h3 className="font-display mt-1 text-2xl font-semibold tracking-tight">EV Parking Canopy</h3>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* The Visual Concept Card */}
        <Card className="relative overflow-hidden lg:col-span-8">
          <div className="aspect-[21/9] w-full bg-muted/20">
            {/* 3D-ish CSS Visualization of the Canopy */}
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="relative h-full w-full max-w-2xl border-x-4 border-t-8 border-foreground/10 bg-muted/5">
                {/* Roof - Solar Panels */}
                <div className="absolute -top-12 left-0 right-0 h-16 skew-x-[-15deg] border-2 border-primary/20 bg-primary/5 p-1">
                  <div className="grid h-full grid-cols-12 gap-1">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <div key={i} className="bg-primary/20" />
                    ))}
                  </div>
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <Tag tone="primary" className="h-5 px-1.5 text-[9px]">Solar Deck: 142 kW Gen</Tag>
                  </div>
                </div>

                {/* Pillars with Ads */}
                <div className="absolute bottom-0 left-1/4 h-full w-12 bg-foreground/5 shadow-inner">
                  {ads[0] && (
                    <div className="mt-12 h-20 w-full overflow-hidden border-y border-border">
                      <img src={ads[0].image} alt="Ad" className="h-full w-full object-cover opacity-80 grayscale hover:grayscale-0 transition-all" />
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 right-1/4 h-full w-12 bg-foreground/5 shadow-inner">
                   <div className="mt-20 h-20 w-full border-y border-border bg-muted/40 flex items-center justify-center">
                     <span className="text-[8px] font-bold rotate-90 text-muted-foreground/40 whitespace-nowrap">AD SPACE #ARS-P2</span>
                   </div>
                </div>

                {/* Ground - EVs */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-8">
                   <div className="h-10 w-20 rounded-t-lg bg-primary/20 border-t-2 border-primary animate-pulse flex items-center justify-center">
                     <BatteryCharging className="h-4 w-4 text-primary" />
                   </div>
                   <div className="h-10 w-20 rounded-t-lg bg-foreground/10 border-t-2 border-foreground/20" />
                   <div className="h-10 w-20 rounded-t-lg bg-primary/20 border-t-2 border-primary flex items-center justify-center">
                     <BatteryCharging className="h-4 w-4 text-primary" />
                   </div>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-4 left-4">
              <Tag tone="primary" className="gap-1">
                <ShieldCheck className="h-3 w-3" />
                Active Load Balancing
              </Tag>
            </div>
          </div>
          
          <div className="border-t border-border p-4 bg-muted/5">
            <p className="text-xs text-muted-foreground">
              <Info className="mr-1 inline h-3 w-3" />
              This canopy prioritizes on-site solar for EVs. Excess energy is routed to <strong>Block A Labs</strong> during peak sun hours.
            </p>
          </div>
        </Card>

        {/* Ad Management / Revenue Card */}
        <Card className="lg:col-span-4 p-5 flex flex-col justify-between">
          <div>
            <Kicker>Ad Inventory</Kicker>
            <h4 className="font-display mt-2 text-lg font-semibold">Revenue Stream</h4>
            <div className="mt-6 space-y-4">
              {ads.map(ad => (
                <div key={ad.id} className="flex items-center gap-3 rounded-lg border border-border p-2">
                  <div className="h-10 w-10 overflow-hidden rounded bg-muted">
                    <img src={ad.image} alt={ad.company} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{ad.company}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{ad.location}</p>
                  </div>
                  <Tag tone="muted" className="text-[9px]">Active</Tag>
                </div>
              ))}
              
              <div className="rounded-lg border border-dashed border-border p-4 flex flex-col items-center justify-center gap-2 text-center">
                <p className="text-xs font-medium text-muted-foreground italic">2 slots available in Block C</p>
                <Button variant="link" className="h-auto p-0 text-[11px] font-bold uppercase tracking-wider">
                  List Space <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-border">
             <div className="flex justify-between items-end">
               <div>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Monthly Ad Revenue</p>
                 <p className="font-display num-tabular text-2xl font-bold mt-1">₹42,500</p>
               </div>
               <Tag tone="primary">+8%</Tag>
             </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
