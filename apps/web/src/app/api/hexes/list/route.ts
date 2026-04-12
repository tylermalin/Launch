import { NextResponse } from 'next/server'
import regionsData from '@/data/regions.json'
import {
  GENESIS_HEX_CAP,
  GENESIS_SLOTS_PER_REGION,
  buildGenesisHexListItems,
} from '@/lib/genesis-hexes'

export async function GET() {
  const items = buildGenesisHexListItems(regionsData)
  return NextResponse.json({
    genesisHexCap: GENESIS_HEX_CAP,
    slotsPerRegion: GENESIS_SLOTS_PER_REGION,
    count: items.length,
    items,
  })
}
