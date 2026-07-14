import { NextResponse } from 'next/server'
import { resolveCellStatus } from '@/lib/cell-status'
import { resolveContainingCell } from '@/lib/hex-lookup'

export const dynamic = 'force-dynamic'

/**
 * Resolve a cell's reservation status for the address-lookup flow.
 *   GET ?hex=<h3 index>      → status of that cell
 *   GET ?lat=<n>&lng=<n>     → status of the Res-4 cell containing the point
 * Returns { hexId, resolution, status, lat, lng, priceUsd }.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const hexParam = searchParams.get('hex')
  const lat = Number(searchParams.get('lat'))
  const lng = Number(searchParams.get('lng'))

  let hexId: string
  if (hexParam) {
    hexId = hexParam
  } else if (Number.isFinite(lat) && Number.isFinite(lng)) {
    hexId = resolveContainingCell(lat, lng)
  } else {
    return NextResponse.json({ error: 'Provide ?hex= or ?lat=&lng=' }, { status: 400 })
  }

  try {
    return NextResponse.json(await resolveCellStatus(hexId))
  } catch {
    return NextResponse.json({ error: 'Invalid H3 cell' }, { status: 400 })
  }
}
