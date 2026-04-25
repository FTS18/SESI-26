import {
  AirVent,
  Sun,
  ParkingSquare,
  Zap,
  Recycle,
  Droplets,
  GaugeCircle,
  Building2,
  PlugZap,
  ThermometerSun,
  Trash2,
  Lightbulb,
} from 'lucide-react'

export const PROBLEMS = [
  {
    icon: Building2,
    title: 'Empty classrooms wasting AC',
    desc: 'HVAC and lights run for hours in unoccupied rooms across thousands of teaching slots every month.',
    stat: '38% wasted',
  },
  {
    icon: Lightbulb,
    title: 'Rising electricity bills',
    desc: 'Grid tariffs keep climbing while peak-hour campus loads push monthly expenses to record highs.',
    stat: '+14% YoY',
  },
  {
    icon: Trash2,
    title: 'Plastic & cup waste',
    desc: 'Bottles, cans and disposable cups overflow campus bins—most never reach recycling streams.',
    stat: '11 t / year',
  },
  {
    icon: PlugZap,
    title: 'EV charging disorder',
    desc: 'Faculty and student EVs queue at a few outlets, with no scheduling, no metering and high demand spikes.',
    stat: '0 visibility',
  },
]

export const SOLUTIONS = [
  {
    icon: AirVent,
    title: 'Smart Classroom Automation',
    desc: 'Occupancy + timetable fusion auto-controls lights, fans and AC. Empty rooms drop to standby in under 90 seconds.',
    tag: 'Edge sensors',
  },
  {
    icon: ThermometerSun,
    title: 'HVAC Optimization',
    desc: 'AI setpoint tuning balances comfort and energy with weather, crowd density and CO₂ feedback.',
    tag: 'AI control',
  },
  {
    icon: Sun,
    title: 'Rooftop Solar',
    desc: 'Distributed PV on academic blocks feeds the campus microgrid with real-time generation telemetry.',
    tag: 'Generation',
  },
  {
    icon: ParkingSquare,
    title: 'Solar Parking Canopy',
    desc: 'Dual-use parking shades double as solar arrays, charging EVs and feeding back to the grid.',
    tag: 'Dual-use',
  },
  {
    icon: Zap,
    title: 'EV Smart Charging',
    desc: 'Slot-based scheduling, dynamic load balancing and UPI billing for every two-wheeler and car.',
    tag: 'Mobility',
  },
  {
    icon: Recycle,
    title: 'Reverse Vending Rewards',
    desc: 'Drop a bottle, earn points. Closed-loop recycling kiosks issue cafeteria credits and merch coupons.',
    tag: 'Circular',
  },
  {
    icon: Droplets,
    title: 'Solar Water Coolers',
    desc: 'PV-powered chillers replace grid-hungry units near hostels, cafeterias and sports complexes.',
    tag: 'Off-grid',
  },
  {
    icon: GaugeCircle,
    title: 'Dashboard Analytics',
    desc: 'A single operating layer for facilities: live KPIs, anomaly alerts and per-block drill-downs.',
    tag: 'Insights',
  },
]

export const KPIS = [
  { label: 'Energy Reduction', value: '25%', sub: 'across academic blocks' },
  { label: 'Annual Savings', value: '\u20B92.4 Cr', sub: 'verified utility billing' },
  { label: 'CO\u2082 Reduced', value: '4,200 t', sub: 'over 5-year horizon' },
  { label: 'Payback Period', value: '3.8 yrs', sub: 'blended capex recovery' },
]

export const MONTHLY_SAVINGS = [
  { month: 'Jan', savings: 12.4, baseline: 18.6 },
  { month: 'Feb', savings: 13.1, baseline: 19.2 },
  { month: 'Mar', savings: 15.8, baseline: 20.1 },
  { month: 'Apr', savings: 18.6, baseline: 21.4 },
  { month: 'May', savings: 21.9, baseline: 23.0 },
  { month: 'Jun', savings: 19.2, baseline: 22.4 },
  { month: 'Jul', savings: 17.5, baseline: 21.7 },
  { month: 'Aug', savings: 18.4, baseline: 21.9 },
  { month: 'Sep', savings: 20.3, baseline: 22.5 },
  { month: 'Oct', savings: 22.6, baseline: 23.4 },
  { month: 'Nov', savings: 24.1, baseline: 24.0 },
  { month: 'Dec', savings: 25.0, baseline: 24.6 },
]

export const SOLAR_GENERATION = [
  { month: 'Jan', kwh: 38 },
  { month: 'Feb', kwh: 42 },
  { month: 'Mar', kwh: 56 },
  { month: 'Apr', kwh: 64 },
  { month: 'May', kwh: 72 },
  { month: 'Jun', kwh: 58 },
  { month: 'Jul', kwh: 49 },
  { month: 'Aug', kwh: 53 },
  { month: 'Sep', kwh: 61 },
  { month: 'Oct', kwh: 68 },
  { month: 'Nov', kwh: 60 },
  { month: 'Dec', kwh: 50 },
]

export const REVENUE_MIX = [
  { name: 'Solar Energy Savings', value: 42 },
  { name: 'HVAC Optimization', value: 23 },
  { name: 'EV Charging Revenue', value: 18 },
  { name: 'Reverse Vending', value: 9 },
  { name: 'Lighting & Controls', value: 8 },
]

export const ROI_PHASES = [
  {
    phase: 'Phase 1',
    title: 'Pilot Block & Quick Wins',
    horizon: 'Months 0\u20136',
    capex: '\u20B91.2 Cr',
    saving: '\u20B935 L / yr',
    payback: '3.4 yrs',
    bullets: ['Smart classrooms in 1 academic block', '120 kW rooftop PV', 'Dashboard MVP & sensor mesh'],
  },
  {
    phase: 'Phase 2',
    title: 'Campus-Wide Rollout',
    horizon: 'Months 6\u201318',
    capex: '\u20B95.6 Cr',
    saving: '\u20B91.5 Cr / yr',
    payback: '3.7 yrs',
    bullets: ['HVAC AI on every block', 'Solar parking canopies', 'EV smart-charging hubs'],
  },
  {
    phase: 'Phase 3',
    title: 'Circular & Net-Zero',
    horizon: 'Months 18\u201336',
    capex: '\u20B93.1 Cr',
    saving: '\u20B985 L / yr',
    payback: '3.6 yrs',
    bullets: ['Reverse vending network', 'Solar water coolers', 'Carbon credit monetization'],
  },
]

export const TIMELINE = [
  {
    quarter: 'Q1',
    title: 'Discovery & Pilot',
    items: ['Energy audit & sensor map', 'Pilot block selection', 'Dashboard wireframe sign-off'],
  },
  {
    quarter: 'Q2',
    title: 'Build & Deploy',
    items: ['Smart classroom rollout', 'Rooftop solar commissioning', 'Live KPI dashboard launch'],
  },
  {
    quarter: 'Q3',
    title: 'Scale & Optimize',
    items: ['HVAC AI tuning', 'EV charging hubs online', 'Reverse vending kiosks'],
  },
  {
    quarter: 'Q4',
    title: 'Net-Zero Path',
    items: ['Solar canopies + water coolers', 'Carbon credit reporting', 'Annual ESG disclosure'],
  },
]

export const TEAM = [
  {
    name: 'Ananay Dubey',
    role: 'Co-Founder \u00B7 Energy Systems',
    bio: 'Designs the campus operating layer\u2014sensor architecture, edge controls and AI policy engine.',
    initials: 'AD',
  },
  {
    name: 'Ayushman Nayak',
    role: 'Co-Founder \u00B7 Sustainability & Ops',
    bio: 'Leads circular utility programs, reverse-vending economics and campus-wide rollouts.',
    initials: 'AN',
  },
]
