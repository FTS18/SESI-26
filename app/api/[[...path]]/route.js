import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'
import {
  BLOCKS,
  MODULES,
  ALERTS,
  buildSeries,
  buildPriorSeries,
  buildBlockSummary,
  buildKpiTotals,
  buildClassroomHeatmap,
} from '@/lib/dashboard-data'

let client
let db

async function connectToMongo() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URL)
    await client.connect()
    db = client.db(process.env.DB_NAME || 'arasaka')
  }
  return db
}

function handleCORS(response) {
  response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

export async function OPTIONS() {
  return handleCORS(new NextResponse(null, { status: 200 }))
}

async function ensureSeeded(db) {
  const blocksCol = db.collection('arasaka_blocks')
  const alertsCol = db.collection('arasaka_alerts')
  const blockCount = await blocksCol.countDocuments()
  if (blockCount === 0) {
    await blocksCol.insertMany(
      BLOCKS.map((b) => ({ ...b, _seedAt: new Date() })),
    )
  }
  const alertCount = await alertsCol.countDocuments()
  if (alertCount === 0) {
    await alertsCol.insertMany(
      ALERTS.map((a) => ({ ...a, _seedAt: new Date() })),
    )
  }
}

async function readBlocks(db) {
  const docs = await db.collection('arasaka_blocks').find({}).toArray()
  return docs
    .map(({ _id, _seedAt, ...rest }) => rest)
    .sort((a, b) => BLOCKS.findIndex((x) => x.id === a.id) - BLOCKS.findIndex((x) => x.id === b.id))
}

async function readAlerts(db) {
  const docs = await db.collection('arasaka_alerts').find({}).toArray()
  return docs.map(({ _id, _seedAt, ...rest }) => rest)
}

async function handleRoute(request, { params }) {
  const { path = [] } = params
  const route = `/${path.join('/')}`
  const method = request.method
  const url = new URL(request.url)

  try {
    const db = await connectToMongo()

    if ((route === '/' || route === '/root') && method === 'GET') {
      return handleCORS(NextResponse.json({ message: 'Hello World' }))
    }

    /* ---------------------- ARASAKA: blocks (Mongo) ---------------------- */
    if (route === '/blocks' && method === 'GET') {
      await ensureSeeded(db)
      const blocks = await readBlocks(db)
      return handleCORS(NextResponse.json({ blocks }))
    }

    /* ---------------------- ARASAKA: alerts (Mongo) ---------------------- */
    if (route === '/alerts' && method === 'GET') {
      await ensureSeeded(db)
      const alerts = await readAlerts(db)
      return handleCORS(NextResponse.json({ alerts }))
    }

    /* ---------------------- ARASAKA: metrics ---------------------- */
    if (route === '/metrics' && method === 'GET') {
      await ensureSeeded(db)
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

      return handleCORS(
        NextResponse.json({
          series,
          totals,
          blocks,
          prior,
          meta: {
            range,
            block,
            modules: [...enabledModules],
            compare,
            generatedAt: new Date().toISOString(),
          },
        }),
      )
    }

    /* ---------------------- ARASAKA: classrooms ---------------------- */
    if (route.startsWith('/blocks/') && route.endsWith('/classrooms') && method === 'GET') {
      const segments = route.split('/')
      // /blocks/:id/classrooms
      const blockId = segments[2]
      const range = url.searchParams.get('range') || '7d'
      const heatmap = buildClassroomHeatmap(blockId, range)
      return handleCORS(NextResponse.json({ blockId, range, ...heatmap }))
    }

    /* ---------------------- legacy template endpoints ---------------------- */
    if (route === '/status' && method === 'POST') {
      const body = await request.json()
      if (!body.client_name) {
        return handleCORS(
          NextResponse.json({ error: 'client_name is required' }, { status: 400 }),
        )
      }
      const statusObj = { id: uuidv4(), client_name: body.client_name, timestamp: new Date() }
      await db.collection('status_checks').insertOne(statusObj)
      return handleCORS(NextResponse.json(statusObj))
    }
    if (route === '/status' && method === 'GET') {
      const statusChecks = await db.collection('status_checks').find({}).limit(1000).toArray()
      const cleaned = statusChecks.map(({ _id, ...rest }) => rest)
      return handleCORS(NextResponse.json(cleaned))
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
