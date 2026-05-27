import { NextResponse } from 'next/server'
import regionsData from '@/data/regions.json'
import {
  GENESIS_HEX_CAP,
  buildGenesisHexListItems,
} from '@/lib/genesis-hexes'

export async function GET() {
  const items = await buildGenesisHexListItems(regionsData)
  return NextResponse.json({
    genesisHexCap: GENESIS_HEX_CAP,
    count: items.length,
    items,
  })
}
