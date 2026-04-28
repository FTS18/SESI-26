'use client'

import * as React from 'react'
import { Navbar } from '@/components/arasaka/navbar'
import { Hero } from '@/components/sections/Hero'
import { MetaStrip } from '@/components/sections/MetaStrip'
import { ProblemSection } from '@/components/sections/ProblemSection'
import { SolutionsSection } from '@/components/sections/SolutionsSection'
import { KpiSnapshot } from '@/components/sections/KpiSnapshot'
import { ROISection } from '@/components/sections/ROISection'
import { FlowSection } from '@/components/sections/FlowSection'
import { TimelineSection } from '@/components/sections/TimelineSection'
import { TeamSection } from '@/components/sections/TeamSection'
import { CTASection } from '@/components/sections/CTASection'
import { Footer } from '@/components/sections/Footer'

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main id="main" tabIndex={-1}>
        <Hero />
        <MetaStrip />
        <ProblemSection />
        <SolutionsSection />
        <KpiSnapshot />
        <ROISection />
        <FlowSection />
        <TimelineSection />
        <TeamSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}

export default App
