// Deterministic mock data generators for the ARASAKA dashboard.

export const BLOCKS = [
  { id: 'A', name: 'Block A', kind: 'Academic', area: 12400, capacity: 320, status: 'optimal' },
  { id: 'B', name: 'Block B', kind: 'Academic', area: 9800, capacity: 280, status: 'optimal' },
  { id: 'C', name: 'Block C', kind: 'Lab', area: 6200, capacity: 180, status: 'attention' },
  { id: 'L', name: 'Library', kind: 'Common', area: 4800, capacity: 140, status: 'optimal' },
  { id: 'CAF', name: 'Cafeteria', kind: 'Common', area: 2400, capacity: 90, status: 'critical' },
  { id: 'HN', name: 'Hostel North', kind: 'Residence', area: 14600, capacity: 420, status: 'optimal' },
  { id: 'HS', name: 'Hostel South', kind: 'Residence', area: 13800, capacity: 410, status: 'attention' },
  { id: 'SP', name: 'Sports Complex', kind: 'Facility', area: 8200, capacity: 220, status: 'optimal' },
]

export const MODULES = [
  { id: 'hvac', label: 'HVAC' },
  { id: 'lighting', label: 'Lighting' },
  { id: 'ev', label: 'EV Charging' },
  { id: 'solar', label: 'Solar Gen' },
  { id: 'water', label: 'Water Coolers' },
  { id: 'rvm', label: 'Reverse Vending' },
]

export const TIME_RANGES = [
  { id: '24h', label: '24h', points: 24, unit: 'h', step: 1 },
  { id: '7d', label: '7d', points: 7, unit: 'd', step: 1 },
  { id: '30d', label: '30d', points: 30, unit: 'd', step: 1 },
  { id: '90d', label: '90d', points: 13, unit: 'w', step: 7 },
  { id: '12m', label: '12m', points: 12, unit: 'm', step: 1 },
]

export const STATUS_META = {
  optimal: { label: 'OPTIMAL', tone: 'bg-primary text-primary-foreground' },
  attention: { label: 'ATTENTION', tone: 'bg-[hsl(var(--warning))] text-foreground' },
  critical: { label: 'CRITICAL', tone: 'bg-destructive text-destructive-foreground' },
}

// Tiny seedable PRNG so charts stay stable.
function mulberry32(seed) {
  let t = seed >>> 0
  return () => {
    t |= 0
    t = (t + 0x6d2b79f5) | 0
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

function hash(s) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function labelForStep(rangeId, i, total) {
  if (rangeId === '24h') return `${String(i).padStart(2, '0')}:00`
  if (rangeId === '7d') {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    return days[i % 7]
  }
  if (rangeId === '30d') return `D${i + 1}`
  if (rangeId === '90d') return `W${i + 1}`
  if (rangeId === '12m') {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    return months[i % 12]
  }
  return `${i + 1}`
}

/**
 * Build a time series for one or more blocks.
 * Returns an array of points: { t, hvac, lighting, ev, solar, water, rvm, total, baseline }
 * Solar values are negative-style (generation) but kept positive here for stacking; the UI
 * separates generation from consumption.
 */
export function buildSeries({ rangeId = '7d', blockIds = ['ALL'], seed = 'arasaka' }) {
  const range = TIME_RANGES.find((r) => r.id === rangeId) || TIME_RANGES[1]
  const rand = mulberry32(hash(seed + ':' + rangeId + ':' + blockIds.join(',')))
  const points = range.points
  const blockFactor = blockIds.includes('ALL') ? BLOCKS.length : blockIds.length
  const out = []
  for (let i = 0; i < points; i++) {
    // Daily/hourly shape
    let shape = 1
    if (rangeId === '24h') {
      // load curve: lower at night, peak 10–16
      shape = 0.45 + 0.55 * Math.sin(((i - 4) / 24) * Math.PI * 2) * -1
      shape = Math.max(0.4, Math.min(1.4, 0.5 + 0.7 * Math.sin(((i - 6) / 24) * Math.PI)))
    } else if (rangeId === '7d') {
      shape = i >= 5 ? 0.7 : 1.0 // weekend dip
    } else if (rangeId === '12m') {
      // summer peak for AC
      shape = 0.7 + 0.5 * Math.sin(((i + 1) / 12) * Math.PI)
    } else {
      shape = 0.85 + 0.3 * Math.sin(i / 4)
    }

    const hvac = +(38 * shape * blockFactor * (0.9 + rand() * 0.2)).toFixed(1)
    const lighting = +(12 * shape * blockFactor * (0.85 + rand() * 0.3)).toFixed(1)
    const ev = +(8 * (rangeId === '24h' && (i < 8 || i > 20) ? 0.4 : 1) * blockFactor * (0.7 + rand() * 0.6)).toFixed(1)
    const water = +(5 * shape * blockFactor * (0.8 + rand() * 0.4)).toFixed(1)
    const rvm = +(0.6 * blockFactor * (0.5 + rand())).toFixed(2)

    let solarShape = 1
    if (rangeId === '24h') {
      // solar only between 6am and 6pm
      solarShape = i >= 6 && i <= 18 ? Math.sin(((i - 6) / 12) * Math.PI) : 0
    } else if (rangeId === '12m') {
      solarShape = 0.5 + 0.7 * Math.sin(((i + 2) / 12) * Math.PI)
    } else {
      solarShape = 0.6 + 0.4 * Math.sin(i / 3)
    }
    const solar = +(28 * solarShape * blockFactor * (0.85 + rand() * 0.3)).toFixed(1)

    const total = +(hvac + lighting + ev + water + rvm).toFixed(1)
    const baseline = +(total * (1.18 + rand() * 0.12)).toFixed(1)

    out.push({
      t: labelForStep(range.id, i, points),
      hvac, lighting, ev, water, rvm,
      solar, total, baseline,
      net: +(total - solar).toFixed(1),
    })
  }
  return out
}

/** Per-block summary derived from the most recent series window. */
export function buildBlockSummary(rangeId = '7d') {
  return BLOCKS.map((b) => {
    const series = buildSeries({ rangeId, blockIds: [b.id], seed: 'block-' + b.id })
    const total = series.reduce((s, p) => s + p.total, 0)
    const solar = series.reduce((s, p) => s + p.solar, 0)
    const baseline = series.reduce((s, p) => s + p.baseline, 0)
    const savings = +(baseline - total).toFixed(1)
    const savingsPct = +((savings / baseline) * 100).toFixed(1)
    const co2 = +(total * 0.71).toFixed(0) // kgCO2 approx
    const spark = series.map((p) => ({ x: p.t, y: p.total }))
    return {
      ...b,
      total: +total.toFixed(0),
      solar: +solar.toFixed(0),
      baseline: +baseline.toFixed(0),
      savings,
      savingsPct,
      co2,
      spark,
    }
  })
}

export function buildKpiTotals(rangeId = '7d') {
  const series = buildSeries({ rangeId, blockIds: ['ALL'], seed: 'totals' })
  const total = series.reduce((s, p) => s + p.total, 0)
  const baseline = series.reduce((s, p) => s + p.baseline, 0)
  const solar = series.reduce((s, p) => s + p.solar, 0)
  const savings = +(baseline - total).toFixed(0)
  const savingsPct = +((savings / baseline) * 100).toFixed(1)
  const co2 = +(savings * 0.71).toFixed(0)
  return {
    total: Math.round(total),
    baseline: Math.round(baseline),
    solar: Math.round(solar),
    savings,
    savingsPct,
    co2,
  }
}

export const ALERTS = [
  { id: 'a1', severity: 'critical', block: 'Cafeteria', module: 'HVAC', message: 'Setpoint drift +3.4\u00B0C above policy for 42 mins', ts: '2 min ago' },
  { id: 'a2', severity: 'attention', block: 'Block C', module: 'Lighting', message: '14 fixtures still on after schedule end', ts: '11 min ago' },
  { id: 'a3', severity: 'attention', block: 'Hostel South', module: 'Water Coolers', message: 'Cooler 3 drawing 2.1x baseline current', ts: '34 min ago' },
  { id: 'a4', severity: 'info', block: 'Block A', module: 'Solar Gen', message: 'String 7 inverter restarted, output normal', ts: '1 hr ago' },
  { id: 'a5', severity: 'info', block: 'Sports Complex', module: 'EV Charging', message: 'Peak load shifted to 19:00 to flatten demand curve', ts: '2 hr ago' },
]

export const SEVERITY_META = {
  critical: { label: 'CRITICAL', tone: 'bg-destructive text-destructive-foreground' },
  attention: { label: 'ATTENTION', tone: 'bg-[hsl(var(--warning))] text-foreground' },
  info: { label: 'INFO', tone: 'bg-foreground text-background' },
}
