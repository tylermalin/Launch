import { NextResponse } from 'next/server'
import regionsData from '@/data/regions.json'
import { buildGenesisHexFeatureCollection } from '@/lib/genesis-hexes'

/** GeoJSON for the map: only Genesis 200 pool hexes (200 total). */
export async function GET() {
  const { type, features } = buildGenesisHexFeatureCollection(regionsData)
  return NextResponse.json({ type, features })
}
