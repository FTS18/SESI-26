import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'
import { db, isInitialized } from '@/lib/firebase-admin'
import {
  BLOCKS,
  MODULES,
  ALERTS,
  buildSeries,
  buildPriorSeries,
  buildBlockSummary,
  buildKpiTotals,
  buildClassroomHeatmap,
  MARKETPLACE_ITEMS,
  ADS,
} from '@/lib/dashboard-data'

function handleCORS(response) {
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return response
}

export async function OPTIONS() {
  return handleCORS(new NextResponse(null, { status: 200 }))
}

// Check if credentials exist
const isFirebaseReady = () => {
  return !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
}

async function ensureSeeded() {
  if (!isInitialized || !db) return
  if (!isFirebaseReady()) return
  
  const blocksRef = db.collection('arasaka_blocks')
  const blocksSnap = await blocksRef.limit(1).get()
  
  if (blocksSnap.empty) {
    console.log('Seeding Firestore (Admin): Blocks...')
    const batch = db.batch()
    BLOCKS.forEach((b) => {
      const docRef = db.collection('arasaka_blocks').doc(b.id)
      batch.set(docRef, { ...b, _seededAt: new Date() })
    })
    await batch.commit()
  }

  const alertsRef = db.collection('arasaka_alerts')
  const alertsSnap = await alertsRef.limit(1).get()
  
  if (alertsSnap.empty) {
    console.log('Seeding Firestore (Admin): Alerts...')
    const batch = db.batch()
    ALERTS.forEach((a) => {
      const docRef = db.collection('arasaka_alerts').doc()
      batch.set(docRef, { ...a, _seededAt: new Date() })
    })
    await batch.commit()
  }

  // Marketplace
  const marketRef = db.collection('arasaka_marketplace')
  const marketSnap = await marketRef.limit(1).get()
  if (marketSnap.empty) {
    console.log('Seeding Firestore (Admin): Marketplace...')
    const batch = db.batch()
    MARKETPLACE_ITEMS.forEach((item) => {
      const docRef = marketRef.doc(item.id)
      batch.set(docRef, item)
    })
    await batch.commit()
  }

  // Ads
  const adsRef = db.collection('arasaka_ads')
  const adsSnap = await adsRef.limit(1).get()
  if (adsSnap.empty) {
    console.log('Seeding Firestore (Admin): Ads...')
    const ADS = [
      { id: 'ad1', company: 'Tesla', type: 'Billboard', location: 'EV Canopy Pillar A1', image: 'https://images.pexels.com/photos/1884579/pexels-photo-1884579.jpeg' },
      { id: 'ad2', company: 'Coca Cola', type: 'Digital', location: 'Block A Entrance', image: 'https://images.pexels.com/photos/258109/pexels-photo-258109.jpeg' },
    ]
    const batch = db.batch()
    ADS.forEach((ad) => {
      const docRef = adsRef.doc(ad.id)
      batch.set(docRef, ad)
    })
    await batch.commit()
  }

  // Users
  const userRef = db.collection('arasaka_users').doc('guest_user')
  const userSnap = await userRef.get()
  if (!userSnap.exists) {
    console.log('Seeding Firestore (Admin): Guest User...')
    await userRef.set({
      credits: 1000,
      name: 'Campus Resident (Guest)',
      role: 'student',
      lastUpdated: new Date().toISOString()
    })
  }

  // Timetables
  const timeRef = db.collection('arasaka_timetables')
  const timeSnap = await timeRef.limit(1).get()
  if (timeSnap.empty) {
    console.log('Seeding Firestore (Admin): Timetables...')
    const TIMETABLES = [
      { id: 't1', blockId: 'A', room: 'A-101', status: 'vacant', startTime: '09:00', endTime: '11:00' },
      { id: 't2', blockId: 'A', room: 'A-102', status: 'active', startTime: '09:00', endTime: '11:00' },
      { id: 't3', blockId: 'B', room: 'B-201', status: 'active', startTime: '10:00', endTime: '12:00' },
    ]
    const batch = db.batch()
    TIMETABLES.forEach((t) => {
      batch.set(timeRef.doc(t.id), t)
    })
    await batch.commit()
  }
}

async function readBlocks() {
  try {
    if (!isInitialized || !db) return BLOCKS
    const snap = await db.collection('arasaka_blocks').get()
    if (snap.empty) return BLOCKS
    return snap.docs
      .map(doc => doc.data())
      .sort((a, b) => BLOCKS.findIndex(x => x.id === a.id) - BLOCKS.findIndex(x => x.id === b.id))
  } catch (e) {
    console.error('Read Blocks Error:', e.message)
    return BLOCKS
  }
}

async function readAlerts() {
  try {
    if (!isInitialized || !db) return ALERTS
    const snap = await db.collection('arasaka_alerts').orderBy('_seededAt', 'desc').limit(50).get()
    if (snap.empty) return ALERTS
    return snap.docs.map(doc => {
      const data = doc.data()
      return { ...data, id: doc.id } // Use doc.id as the primary key
    })
  } catch (e) {
    console.error('Read Alerts Error:', e.message)
    return ALERTS
  }
}

async function handleRoute(request, context) {
  const params = await context.params
  const { path = [] } = params
  const route = `/${path.join('/')}`
  const method = request.method
  const url = new URL(request.url)

  try {
    if (route === '/favicon.ico') {
      return new NextResponse(null, { status: 404 })
    }

    if (route === '/health' || route === '/status-check') {
      return handleCORS(NextResponse.json({ status: 'ok', db: isInitialized ? 'connected' : 'mock' }))
    }

    // Attempt to seed asynchronously to avoid blocking the request
    if (isInitialized && db && isFirebaseReady()) {
      ensureSeeded().catch(e => console.warn('Firebase Seeding Skipped:', e.message))
    }

    if (route === '/marketplace' && method === 'GET') {
      try {
        if (!isInitialized) throw new Error('DB not initialized')
        const snap = await db.collection('arasaka_marketplace').get()
        if (snap.empty) return handleCORS(NextResponse.json(MARKETPLACE_ITEMS))
        const items = snap.docs.map(doc => doc.data())
        return handleCORS(NextResponse.json(items))
      } catch (e) {
        return handleCORS(NextResponse.json(MARKETPLACE_ITEMS))
      }
    }

    if (route === '/logs' && method === 'GET') {
      try {
        if (!isInitialized) throw new Error('DB not initialized')
        const snap = await db.collection('arasaka_logs').orderBy('timestamp', 'desc').limit(20).get()
        const logs = snap.docs.map(doc => doc.data())
        return handleCORS(NextResponse.json(logs))
      } catch (e) {
        return handleCORS(NextResponse.json([]))
      }
    }

    if (route === '/ads' && method === 'GET') {
      try {
        if (!isInitialized) throw new Error('DB not initialized')
        const snap = await db.collection('arasaka_ads').get()
        if (snap.empty) return handleCORS(NextResponse.json(ADS))
        const ads = snap.docs.map(doc => doc.data())
        return handleCORS(NextResponse.json(ads))
      } catch (e) {
        return handleCORS(NextResponse.json(ADS))
      }
    }

    if (route === '/recycling/submit' && method === 'POST') {
      const body = await request.json()
      const { userId, itemType } = body
      
      const credits = itemType === 'bottle' ? 10 : 5
      const userRef = db.collection('arasaka_users').doc(userId || 'guest_user')
      
      await db.runTransaction(async (t) => {
        const userDoc = await t.get(userRef)
        const currentCredits = userDoc.exists ? (userDoc.data().credits || 0) : 0
        t.set(userRef, { 
          credits: currentCredits + credits,
          lastUpdated: new Date().toISOString()
        }, { merge: true })
        
        const logRef = db.collection('arasaka_recycling_logs').doc()
        t.set(logRef, {
          userId: userId || 'guest_user',
          itemType,
          creditsAwarded: credits,
          timestamp: new Date().toISOString()
        })
      })

      return handleCORS(NextResponse.json({ success: true, creditsAwarded: credits }))
    }

    if (route === '/marketplace/purchase' && method === 'POST') {
      const body = await request.json()
      const { userId, itemId, cost } = body
      
      const userRef = db.collection('arasaka_users').doc(userId || 'guest_user')
      const itemRef = db.collection('arasaka_marketplace').doc(itemId)

      try {
        const result = await db.runTransaction(async (t) => {
          const userDoc = await t.get(userRef)
          const itemDoc = await t.get(itemRef)
          
          if (!userDoc.exists || (userDoc.data().credits || 0) < cost) {
            throw new Error('Insufficient credits')
          }
          if (!itemDoc.exists || (itemDoc.data().stock || 0) <= 0) {
            throw new Error('Item out of stock')
          }

          t.update(userRef, { credits: userDoc.data().credits - cost })
          t.update(itemRef, { stock: itemDoc.data().stock - 1 })
          
          const purchaseRef = db.collection('arasaka_purchases').doc()
          const code = `ARS-${Math.random().toString(36).substring(7).toUpperCase()}`
          t.set(purchaseRef, {
            userId: userId || 'guest_user',
            itemId,
            cost,
            code,
            timestamp: new Date().toISOString()
          })
          
          return { code }
        })
        return handleCORS(NextResponse.json({ success: true, ...result }))
      } catch (e) {
        return handleCORS(NextResponse.json({ success: false, error: e.message }, { status: 400 }))
      }
    }

    if (route === '/tickets' && method === 'POST') {
      const body = await request.json()
      const ticketRef = db.collection('arasaka_tickets').doc()
      await ticketRef.set({
        ...body,
        status: 'open',
        createdAt: new Date().toISOString()
      })
      return handleCORS(NextResponse.json({ success: true, id: ticketRef.id }))
    }

    if (route === '/blocks' && method === 'GET') {
      const blocks = await readBlocks()
      return handleCORS(NextResponse.json({ blocks }))
    }

    if (route === '/alerts' && method === 'GET') {
      try {
        if (!isInitialized) throw new Error('DB not initialized')
        const alerts = await readAlerts()
        return handleCORS(NextResponse.json({ alerts }))
      } catch (e) {
        return handleCORS(NextResponse.json({ alerts: ALERTS }))
      }
    }

    if (route === '/metrics' && method === 'GET') {
      const range = url.searchParams.get('range') || '7d'
      const block = url.searchParams.get('block') || 'ALL'
      const modulesParam = url.searchParams.get('modules') || ''
      const compare = url.searchParams.get('compare') === '1'
      const seedTick = url.searchParams.get('tick') || ''
      
      const enabledModules = modulesParam
        ? new Set(modulesParam.split(',').filter(Boolean))
        : new Set(MODULES.map((m) => m.id))
        
      const blockIds = block === 'ALL' ? ['ALL'] : [block]
      
      const series = buildSeries({
        rangeId: range,
        blockIds,
        seed: 'main:' + seedTick,
      })
      const totals = buildKpiTotals(range)
      const blocks = buildBlockSummary(range)
      const prior = compare ? buildPriorSeries({ rangeId: range, blockIds }) : null

      const solarToLoadRatio = totals.total > 0 ? totals.solar / totals.total : 0
      const routingMode = solarToLoadRatio > 0.8 ? 'SOLAR_PRIORITY' : 'GRID_HYBRID'
      
      let weatherData = { cloudCover: 20, temp: 28 }
      
      // Decision Logging (Audit Trail)
      if (isInitialized && solarToLoadRatio > 0.8) {
        try {
          const logRef = db.collection('arasaka_logs').doc()
          const lastLogSnap = await db.collection('arasaka_logs').orderBy('timestamp', 'desc').limit(1).get()
          const lastLog = lastLogSnap.docs[0]?.data()
          
          if (!lastLog || new Date() - new Date(lastLog.timestamp) > 3600000) {
            await logRef.set({
              type: 'DECISION',
              module: 'SOLAR',
              message: `Solar yield reached ${Math.round(solarToLoadRatio * 100)}%. System autonomously enabled SOLAR_PRIORITY routing.`,
              timestamp: new Date().toISOString()
            })
          }
        } catch (e) {
          console.warn('Metrics Decision Log Error:', e.message)
        }
      }

      // Anomaly Detection: Waste in Vacant Rooms
      if (isInitialized) {
        try {
          const timetableSnap = await db.collection('arasaka_timetables').get()
          if (!timetableSnap.empty) {
            const timetables = timetableSnap.docs.map(d => d.data())
            if (Math.random() > 0.8) {
              const slot = timetables[Math.floor(Math.random() * timetables.length)]
              if (slot.status === 'vacant') {
                await db.collection('arasaka_alerts').add({
                  severity: 'critical',
                  ts: new Date().toLocaleTimeString(),
                  block: `Block ${slot.blockId}`,
                  module: 'HVAC',
                  message: `Energy waste detected in ${slot.room}. Room is vacant but climate systems are at full load.`,
                  _seededAt: new Date().toISOString()
                })
              }
            }
          }
        } catch (e) {
          console.warn('Metrics Anomaly Error:', e.message)
        }
      }

      return handleCORS(
        NextResponse.json({
          series,
          totals,
          blocks,
          prior,
          decisionEngine: {
            routingMode,
            solarYieldStatus: solarToLoadRatio > 0.8 ? 'optimal' : 'normal',
            recommendation: solarToLoadRatio > 0.8 ? 'EV Canopy: Enable Eco-Mode' : 'No Action Required',
            weather: weatherData
          },
          meta: {
            range,
            block,
            modules: [...enabledModules],
            compare,
            generatedAt: new Date().toISOString(),
            provider: 'firebase-admin'
          },
        }),
      )
    }

    if (route.startsWith('/blocks/') && route.endsWith('/classrooms') && method === 'GET') {
      const segments = route.split('/')
      const blockId = segments[2]
      const range = url.searchParams.get('range') || '7d'
      const heatmap = buildClassroomHeatmap(blockId, range)
      return handleCORS(NextResponse.json({ blockId, range, ...heatmap }))
    }

    if (route === '/status' && method === 'POST') {
      const body = await request.json()
      if (!body.client_name) {
        return handleCORS(NextResponse.json({ error: 'client_name is required' }, { status: 400 }))
      }
      
      const statusObj = { 
        id: uuidv4(), 
        client_name: body.client_name, 
        timestamp: new Date().toISOString()
      }
      
      await db.collection('status_checks').add({
        ...statusObj,
        _ts: new Date()
      })
      
      return handleCORS(NextResponse.json(statusObj))
    }

    if (route === '/status' && method === 'GET') {
      const snap = await db.collection('status_checks').orderBy('_ts', 'desc').limit(100).get()
      const statusChecks = snap.docs.map(doc => doc.data())
      return handleCORS(NextResponse.json(statusChecks))
    }

    return handleCORS(NextResponse.json({ error: `Route ${route} not found` }, { status: 404 }))
  } catch (error) {
    console.error('API Error:', error)
    return handleCORS(
      NextResponse.json(
        { error: 'Internal server error', detail: String(error?.message || error) },
        { status: 500 },
      ),
    )
  }
}

export const GET = handleRoute
export const POST = handleRoute
export const PUT = handleRoute
export const DELETE = handleRoute
export const PATCH = handleRoute
