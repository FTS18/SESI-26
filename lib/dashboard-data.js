// Server + client safe data generators for Arasaka dashboard.
// Pure functions, deterministic via seeded PRNG.

export const BLOCKS = [
  { id: 'A', name: 'Block A', kind: 'Academic', area: 12400, capacity: 320, status: 'optimal', floors: 4, roomsPerFloor: 8, maintenance: 'operational' },
  { id: 'B', name: 'Block B', kind: 'Academic', area: 9800, capacity: 280, status: 'optimal', floors: 4, roomsPerFloor: 7, maintenance: 'operational' },
  { id: 'C', name: 'Block C', kind: 'Lab', area: 6200, capacity: 180, status: 'attention', floors: 3, roomsPerFloor: 6, maintenance: 'scheduled' },
  { id: 'L', name: 'Library', kind: 'Common', area: 4800, capacity: 140, status: 'optimal', floors: 3, roomsPerFloor: 4, maintenance: 'operational' },
  { id: 'CAF', name: 'Cafeteria', kind: 'Common', area: 2400, capacity: 90, status: 'critical', floors: 2, roomsPerFloor: 4, maintenance: 'fault' },
  { id: 'HN', name: 'Hostel North', kind: 'Residence', area: 14600, capacity: 420, status: 'optimal', floors: 5, roomsPerFloor: 10, maintenance: 'operational' },
  { id: 'HS', name: 'Hostel South', kind: 'Residence', area: 13800, capacity: 410, status: 'attention', floors: 5, roomsPerFloor: 10, maintenance: 'operational' },
  { id: 'SP', name: 'Sports Complex', kind: 'Facility', area: 8200, capacity: 220, status: 'optimal', floors: 2, roomsPerFloor: 6, maintenance: 'operational' },
]

export const MARKETPLACE_ITEMS = [
  { id: 'm1', name: 'Campus Brew Coffee', cost: 50, category: 'Food', stock: 100, image: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg' },
  { id: 'm2', name: 'EV Priority Charging', cost: 150, category: 'Utility', stock: 10, image: 'https://images.pexels.com/photos/110844/pexels-photo-110844.jpeg' },
  { id: 'm3', name: 'Hostel Electricity Credit', cost: 500, category: 'Utility', stock: 50, image: 'https://images.pexels.com/photos/1036936/pexels-photo-1036936.jpeg' },
  { id: 'm4', name: 'Arasaka Merch Cap', cost: 300, category: 'Merch', stock: 25, image: 'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg' },
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
  { id: '24h', label: '24h', points: 24 },
  { id: '7d', label: '7d', points: 7 },
  { id: '30d', label: '30d', points: 30 },
  { id: '90d', label: '90d', points: 13 },
  { id: '12m', label: '12m', points: 12 },
]

export const STATUS_META = {
  optimal: { label: 'Optimal' },
  attention: { label: 'Attention' },
  critical: { label: 'Critical' },
}

export const SEVERITY_META = {
  critical: { label: 'Critical' },
  attention: { label: 'Attention' },
  info: { label: 'Info' },
}

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

function labelForStep(rangeId, i) {
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

export function buildSeries({ rangeId = '7d', blockIds = ['ALL'], seed = 'arasaka' }) {
  const range = TIME_RANGES.find((r) => r.id === rangeId) || TIME_RANGES[1]
  const rand = mulberry32(hash(seed + ':' + rangeId + ':' + blockIds.join(',')))
  const points = range.points
  const blockFactor = blockIds.includes('ALL') ? BLOCKS.length : blockIds.length
  const out = []
  for (let i = 0; i < points; i++) {
    let shape = 1
    if (rangeId === '24h') {
      shape = Math.max(0.4, Math.min(1.4, 0.5 + 0.7 * Math.sin(((i - 6) / 24) * Math.PI)))
    } else if (rangeId === '7d') {
      shape = i >= 5 ? 0.7 : 1.0
    } else if (rangeId === '12m') {
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
      t: labelForStep(range.id, i),
      hvac, lighting, ev, water, rvm,
      solar, total, baseline,
      net: +(total - solar).toFixed(1),
    })
  }
  return out
}

export function buildPriorSeries({ rangeId = '7d', blockIds = ['ALL'] }) {
  const seed = 'prior:' + rangeId + ':' + blockIds.join(',')
  const series = buildSeries({ rangeId, blockIds, seed })
  // Slight upward shift to represent baseline / pre-deployment behavior
  return series.map((p) => ({
    t: p.t,
    prior_total: +(p.total * (1.06 + (hash(p.t) % 12) / 100)).toFixed(1),
  }))
}

export function buildBlockSummary(rangeId = '7d') {
  return BLOCKS.map((b) => {
    const series = buildSeries({ rangeId, blockIds: [b.id], seed: 'block-' + b.id })
    const total = series.reduce((s, p) => s + p.total, 0)
    const solar = series.reduce((s, p) => s + p.solar, 0)
    const baseline = series.reduce((s, p) => s + p.baseline, 0)
    const savings = +(baseline - total).toFixed(1)
    const savingsPct = +((savings / baseline) * 100).toFixed(1)
    const co2 = +(total * 0.71).toFixed(0)
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

/**
 * Per-classroom heatmap for a block. Returns a 2D grid (floor x room) of
 * normalized intensity 0..1 plus absolute kWh.
 */
export function buildClassroomHeatmap(blockId, rangeId = '7d') {
  const block = BLOCKS.find((b) => b.id === blockId)
  if (!block) return { floors: 0, rooms: 0, cells: [] }
  const rand = mulberry32(hash('cls:' + blockId + ':' + rangeId))
  const floors = block.floors
  const rooms = block.roomsPerFloor
  const cells = []
  for (let f = 0; f < floors; f++) {
    const row = []
    for (let r = 0; r < rooms; r++) {
      // Lower floors slightly higher load (foot traffic), random variance
      const base = 0.22 + 0.4 * (1 - f / Math.max(floors - 1, 1)) + rand() * 0.32
      const v = Math.min(0.94, Math.max(0.08, base * (rangeId === '24h' ? 0.78 : 1)))
      row.push({
        floor: f,
        room: r,
        label: `${block.id}-${f + 1}${String.fromCharCode(65 + r)}`,
        intensity: +v.toFixed(3),
        kwh: +(v * (rangeId === '24h' ? 6 : 84)).toFixed(1),
        occupancy: Math.round(v * (rangeId === '24h' ? 35 : 480)),
      })
    }
    cells.push(row)
  }
  return { floors, rooms, cells }
}

export const ALERTS = [
  { id: 'a1', severity: 'critical', block: 'Cafeteria', module: 'HVAC', message: 'Setpoint drift +3.4\u00B0C above policy for 42 mins', ts: '2 min ago' },
  { id: 'a2', severity: 'attention', block: 'Block C', module: 'Lighting', message: '14 fixtures still on after schedule end', ts: '11 min ago' },
  { id: 'a3', severity: 'attention', block: 'Hostel South', module: 'Water Coolers', message: 'Cooler 3 drawing 2.1x baseline current', ts: '34 min ago' },
  { id: 'a4', severity: 'info', block: 'Block A', module: 'Solar Gen', message: 'String 7 inverter restarted, output normal', ts: '1 hr ago' },
  { id: 'a5', severity: 'info', block: 'Sports Complex', module: 'EV Charging', message: 'Peak load shifted to 19:00 to flatten demand curve', ts: '2 hr ago' },
]

export const ADS = [
  { id: 'ad1', company: 'Tesla', type: 'Billboard', location: 'EV Canopy Pillar A1', image: 'https://images.pexels.com/photos/1884579/pexels-photo-1884579.jpeg' },
  { id: 'ad2', company: 'Coca Cola', type: 'Digital', location: 'Block A Entrance', image: 'https://images.pexels.com/photos/258109/pexels-photo-258109.jpeg' },
]
