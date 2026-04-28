'use client'

import * as React from 'react'
import { Leaf, Award, Recycle, CloudRain } from 'lucide-react'
import { Card, Tag, Kicker } from '@/components/arasaka/swiss'

export function EcoProfile({ credits = 0 }) {
  // Mock data for individual impact (scaled based on credits)
  const stats = {
    bottles: Math.floor(credits / 10),
    co2Offset: (credits * 0.05).toFixed(1),
    rank: credits > 500 ? 'Sustainability Lead' : 'Green Citizen'
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Kicker>Student Profile</Kicker>
        <Tag tone="primary" className="gap-1">
          <Award className="h-3 w-3" />
          {stats.rank}
        </Tag>
      </div>
      
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="p-4 bg-primary/5 border-primary/20">
          <Recycle className="h-4 w-4 text-primary mb-3" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Recycled</p>
          <p className="font-display num-tabular text-2xl font-bold mt-1">{stats.bottles}</p>
          <p className="text-[9px] text-muted-foreground mt-1">Units this semester</p>
        </Card>
        
        <Card className="p-4">
          <CloudRain className="h-4 w-4 text-muted-foreground mb-3" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">CO2 Offset</p>
          <p className="font-display num-tabular text-2xl font-bold mt-1">{stats.co2Offset} <span className="text-sm font-medium">kg</span></p>
          <p className="text-[9px] text-muted-foreground mt-1">Personal Impact</p>
        </Card>

        <Card className="p-4">
          <Leaf className="h-4 w-4 text-muted-foreground mb-3" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Arasaka Rank</p>
          <p className="font-display text-xl font-bold mt-1">Top 5%</p>
          <p className="text-[9px] text-muted-foreground mt-1">Block A Leaderboard</p>
        </Card>
      </div>
    </div>
  )
}
