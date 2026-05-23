import { cellToLatLng } from 'h3-js'
import {
  hexToGeoJSON,
  calculateDataScoreDeterministic,
  calculateGenesisListingPriceDeterministic,
  GENESIS_ENTRY_USD,
} from '@/lib/h3'

export type RegionsData = {
  la?: string[]
  nyc?: string[]
  london?: string[]
  tokyo?: string[]
  idaho?: string[]
}

/**
 * Product: 200 unique hex zones, one mint per hex.
 * Implementation: each hex has 2 chain positions (Base + Cardano) = 400 entries here.
 * Credit-card purchases mint both chain NFTs (mirror). Crypto purchases mint one
 * on the chosen chain; the other chain position is locked once the hex is sold.
 * Name kept as GENESIS_HEX_CAP for backward compatibility; semantically it caps
 * chain-position entries, not unique hexes (which cap at 200).
 */
export const GENESIS_HEX_CAP = 400

/**
 * @deprecated No longer uniform — regions have different cell counts at Res 5.
 * Kept for backward compatibility. Do not use for slicing; see getGenesisHexIds.
 * Counts: LA=28, NYC=16, London=18, Tokyo=18, Idaho=120. Total=200 unique hexes.
 */
export const GENESIS_SLOTS_PER_REGION = 80

export const GENESIS_REGION_KEYS = ['la', 'nyc', 'london', 'tokyo', 'idaho'] as const
export type GenesisRegionKey = (typeof GENESIS_REGION_KEYS)[number]

export const GENESIS_REGION_LABELS: Record<GenesisRegionKey, string> = {
  la: 'Los Angeles',
  nyc: 'New York City',
  london: 'London',
  tokyo: 'Tokyo',
  idaho: 'Idaho',
}

/**
 * Five Mālama Labs reserved nodes — one per region, held by the company.
 * These are always status='reserved'; never available for external purchase.
 *
 *   8529a19bfffffff → Los Angeles (Tyler Malin / LA ops)
 *   852a100ffffffff → New York City
 *   85194ad3fffffff → London
 *   852f5aabfffffff → Tokyo
 *   8528846ffffffff → Idaho (near Idaho City)
 */
export const MALAMA_RESERVED_HEX_IDS = [
  '8529a19bfffffff', // Los Angeles
  '852a100ffffffff', // New York City
  '85194ad3fffffff', // London
  '852f5aabfffffff', // Tokyo
  '8528846ffffffff', // Idaho
] as const

export const MALAMA_RESERVED_HEX_SET = new Set<string>(MALAMA_RESERVED_HEX_IDS)

/**
 * @deprecated Use MALAMA_RESERVED_HEX_IDS / MALAMA_RESERVED_HEX_SET instead.
 * The Dallas HQ hex no longer exists in the Genesis pool (reseed v2, Res 5).
 */
export const MALAMA_HQ_HEX = '8726cb912ffffff'

export function getMalamaWalletReservedHexIds(_regions?: RegionsData): string[] {
  return [...MALAMA_RESERVED_HEX_IDS]
}

export function getMalamaWalletReservedHexSet(_regions?: RegionsData): Set<string> {
  return MALAMA_RESERVED_HEX_SET
}

export function getGenesisRegionLabelForHex(hexId: string, regions: RegionsData): string | null {
  for (const key of GENESIS_REGION_KEYS) {
    if ((regions[key] || []).includes(hexId)) return GENESIS_REGION_LABELS[key]
  }
  return null
}

export function getGenesisPoolSlot(hexId: string, regions: RegionsData): number | null {
  const entries = getGenesisHexIds(regions)
  const idx = entries.findIndex((e) => e.id === hexId)
  if (idx < 0) return null
  return idx + 1
}

/**
 * Deterministically selects all H3 cells across 5 regions.
 *
 * Each region uses all its cells (no per-region slice). Within each region,
 * cells are sorted deterministically; the first ceil(n/2) go to Base, the
 * rest to Cardano. Total: 200 unique hexes × 2 chains = 400 entries.
 *
 * Region cell counts at Res 5:
 *   LA=28 (14B/14C), NYC=16 (8B/8C), London=18 (9B/9C),
 *   Tokyo=18 (9B/9C), Idaho=120 (60B/60C) → 400 total.
 */
export function getGenesisHexIds(regions: RegionsData): { id: string; region: GenesisRegionKey; chain: 'base' | 'cardano' }[] {
  const out: { id: string; region: GenesisRegionKey; chain: 'base' | 'cardano' }[] = []
  for (const key of GENESIS_REGION_KEYS) {
    const cells = [...(regions[key] || [])].sort()
    const splitAt = Math.ceil(cells.length / 2)
    cells.forEach((id, i) => {
      out.push({ id, region: key, chain: i < splitAt ? 'base' : 'cardano' })
    })
  }
  return out
}

export type GenesisHexListItem = {
  hexId: string
  region: GenesisRegionKey
  regionLabel: string
  lat: number
  lng: number
  status: 'available' | 'reserved'
  sold?: boolean
  chain: 'base' | 'cardano'
  /** True if this hex is held by Mālama Labs (one of the 5 reserved nodes). */
  isMalamaReserved?: boolean
  dataScore: number
  startingBid: number
  activeSensors: number
  uptime: number
  overlap: boolean
  genesisEdition: true
  genesisPriceUsd: number
}

export function buildGenesisHexListItems(regions: RegionsData): GenesisHexListItem[] {
  const entries = getGenesisHexIds(regions)
  return entries.map(({ id, region, chain }) => {
    const [lat, lng] = cellToLatLng(id)
    const isMalamaReserved = MALAMA_RESERVED_HEX_SET.has(id)
    const status = isMalamaReserved ? 'reserved' as const : 'available' as const
    const dataScore = calculateDataScoreDeterministic(lat, lng, id)
    const startingBid = calculateGenesisListingPriceDeterministic(lat, lng, id)
    return {
      hexId: id,
      region,
      regionLabel: GENESIS_REGION_LABELS[region],
      lat,
      lng,
      status,
      sold: isMalamaReserved,
      chain,
      isMalamaReserved,
      dataScore,
      startingBid,
      activeSensors: isMalamaReserved ? 1 : 0,
      uptime: isMalamaReserved ? 99 : 0,
      overlap: false,
      genesisEdition: true,
      genesisPriceUsd: GENESIS_ENTRY_USD,
    }
  })
}

export function buildGenesisHexFeatureCollection(regions: RegionsData) {
  const items = buildGenesisHexListItems(regions)
  const features = items.map((item) => {
    const geojson = hexToGeoJSON(item.hexId)
    Object.assign(geojson.properties as Record<string, unknown>, {
      id: item.hexId,
      region: item.region,
      regionLabel: item.regionLabel,
      zoneName: item.regionLabel,
      status: item.status,
      sold: Boolean(item.sold),
      chain: item.chain,
      isMalamaReserved: Boolean(item.isMalamaReserved),
      /** @deprecated kept for backward compat — use isMalamaReserved */
      isHQ: Boolean(item.isMalamaReserved),
      dataScore: item.dataScore,
      startingBid: item.startingBid,
      activeSensors: item.activeSensors,
      uptime: item.uptime,
      overlap: item.overlap,
      genesisEdition: true,
    })
    return geojson
  })
  return {
    type: 'FeatureCollection' as const,
    features,
    genesisMeta: {
      cap: GENESIS_HEX_CAP,
      count: items.length,
      uniqueHexes: items.length / 2,
      regions: {
        la: (regions.la || []).length,
        nyc: (regions.nyc || []).length,
        london: (regions.london || []).length,
        tokyo: (regions.tokyo || []).length,
        idaho: (regions.idaho || []).length,
      },
      base: items.filter(i => i.chain === 'base').length,
      cardano: items.filter(i => i.chain === 'cardano').length,
    },
  }
}
