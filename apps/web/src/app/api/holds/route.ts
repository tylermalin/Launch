import { NextResponse } from 'next/server'
import {
  issueGlobalHold,
  getGlobalHold,
  releaseGlobalHold,
  listHoldsByEmail,
} from '@/lib/global-hold-store'
import { resolveContainingCell } from '@/lib/hex-lookup'
import nativeHexesData from '@/data/genesis-native-hexes.json'

const NATIVE_HEX_SET = new Set(Object.keys(nativeHexesData as Record<string, unknown>))

export const dynamic = 'force-dynamic'

/**
 * Global hex holds — off-chain exclusive reservations of Res-4 cells outside the
 * curated Genesis 200. Never mints, never consumes a Genesis edition.
 *
 *   POST   { email, lat, lng, referrerId? }  → place a hold (server derives the cell)
 *   GET    ?email=… → a user's holds   |   ?hex=… → a single cell's hold
 *   DELETE { hexId, email }                  → release your own hold
 */
export async function POST(req: Request) {
  try {
    const { email, lat, lng, referrerId } = await req.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Missing required field: email' }, { status: 400 })
    }
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return NextResponse.json({ error: 'lat and lng must be numbers' }, { status: 400 })
    }

    // Derive the cell server-side so a hold always matches its coordinates.
    const hexId = resolveContainingCell(lat, lng)

    // Native-reserved cells are held for Native Tribes first — not publicly holdable.
    if (NATIVE_HEX_SET.has(hexId)) {
      return NextResponse.json(
        { error: 'This cell is on tribal land and reserved for Native Tribes', nativeReserved: true },
        { status: 403 },
      )
    }

    const result = await issueGlobalHold({ hexId, email, lat, lng, referrerId })
    if (!result.ok) {
      return NextResponse.json(
        { error: result.error, hexId, alreadyHeld: true },
        { status: 409 },
      )
    }

    return NextResponse.json({ ok: true, hold: result.hold }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')
  const hex = searchParams.get('hex')

  if (hex) {
    return NextResponse.json({ hold: await getGlobalHold(hex) })
  }
  if (email) {
    return NextResponse.json({ holds: await listHoldsByEmail(email) })
  }
  return NextResponse.json({ error: 'Provide ?email= or ?hex=' }, { status: 400 })
}

export async function DELETE(req: Request) {
  try {
    const { hexId, email } = await req.json()
    if (!hexId || !email) {
      return NextResponse.json({ error: 'Missing required fields: hexId, email' }, { status: 400 })
    }
    const result = await releaseGlobalHold(hexId, email)
    if (!result.ok) {
      return NextResponse.json({ error: result.reason }, { status: 403 })
    }
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
