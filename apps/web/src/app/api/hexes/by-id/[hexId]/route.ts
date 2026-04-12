import { NextResponse } from 'next/server'
import regionsData from '@/data/regions.json'
import { buildGenesisHexListItems } from '@/lib/genesis-hexes'
import { getClaimByHex } from '@/lib/genesis-claim-registry'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ hexId: string }> }
) {
  const { hexId: raw } = await params
  const hexId = decodeURIComponent(raw)
  const items = buildGenesisHexListItems(regionsData)
  const item = items.find((i) => i.hexId === hexId)
  if (!item) {
    return NextResponse.json({ error: 'Hex not in Genesis pool' }, { status: 404 })
  }
  const claim = getClaimByHex(hexId)
  return NextResponse.json({ item, claim: claim ?? null })
}
