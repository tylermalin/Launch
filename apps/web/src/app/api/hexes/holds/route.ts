import { NextResponse } from 'next/server'
import { listActiveHolds } from '@/lib/global-hold-store'
import { hexToGeoJSON } from '@/lib/h3'

export const dynamic = 'force-dynamic'

/**
 * Active global holds as a GeoJSON FeatureCollection, for the map overlay.
 * These are off-chain reservations of Res-4 cells outside the curated 200.
 */
export async function GET() {
  const holds = await listActiveHolds()
  const features = holds.map((h) => ({
    ...hexToGeoJSON(h.hexId),
    properties: { id: h.hexId, status: 'held', heldAt: h.heldAt, expiresAt: h.expiresAt },
  }))
  return NextResponse.json({ type: 'FeatureCollection', features })
}
