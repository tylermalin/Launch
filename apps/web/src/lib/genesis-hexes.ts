import { cellToLatLng } from 'h3-js'
import {
  hexToGeoJSON,
  calculateDataScoreDeterministic,
  calculateGenesisListingPriceDeterministic,
  GENESIS_ENTRY_USD,
} from '@/lib/h3'

export type RegionsData = {
  west?:     { cells: string[] }
  pacific?:  { cells: string[] }
  mountain?: { cells: string[] }
  midwest?:  { cells: string[] }
  south?:    { cells: string[] }
}

/**
 * Product: 200 unique hex zones at H3 Resolution 3 (~12,392 km² / cell).
 * One mint per hex. Each hex has 2 chain positions (Base + Cardano) = 400 total
 * entries.  Credit-card purchases mirror across both chains.  Crypto purchases
 * mint one chain; the other position locks once the hex sells.
 */
export const GENESIS_HEX_CAP = 400

export const GENESIS_REGION_KEYS = ['west', 'pacific', 'mountain', 'midwest', 'south'] as const
export type GenesisRegionKey = (typeof GENESIS_REGION_KEYS)[number]

export const GENESIS_REGION_LABELS: Record<GenesisRegionKey, string> = {
  west:     'West Coast',
  pacific:  'Pacific & Alaska',
  mountain: 'Mountain West',
  midwest:  'Midwest',
  south:    'South & East',
}

/**
 * Five Mālama Labs reserved nodes — one per region, locked at launch.
 * These are always status='reserved'; never available for external purchase.
 *
 * Resolution 3 lab cells (H3 Res 3, ~12,392 km² each — metro-region scale):
 *   8329a1fffffffff → West       (Los Angeles, CA)
 *   835d14fffffffff → Pacific    (Haiku, Maui, HI)
 *   832884fffffffff → Mountain   (Idaho City / Boise corridor, ID)
 *   832740fffffffff → Midwest    (Sister Bay, WI)
 *   8326cbfffffffff → South      (Dallas, TX)
 */
export const MALAMA_RESERVED_HEX_IDS = [
  '8329a1fffffffff', // Los Angeles
  '835d14fffffffff', // Haiku, Hawaii
  '832884fffffffff', // Idaho City / Boise
  '832740fffffffff', // Sister Bay
  '8326cbfffffffff', // Dallas
] as const

export const MALAMA_RESERVED_HEX_SET = new Set<string>(MALAMA_RESERVED_HEX_IDS)

/** @deprecated Res-5 IDs from the v2 reseed. Kept for reference only. */
export const MALAMA_HQ_HEX = '8726cb912ffffff'

export function getMalamaWalletReservedHexIds(_regions?: RegionsData): string[] {
  return [...MALAMA_RESERVED_HEX_IDS]
}

export function getMalamaWalletReservedHexSet(_regions?: RegionsData): Set<string> {
  return MALAMA_RESERVED_HEX_SET
}

export function getGenesisRegionLabelForHex(hexId: string, regions: RegionsData): string | null {
  for (const key of GENESIS_REGION_KEYS) {
    if ((regions[key]?.cells || []).includes(hexId)) return GENESIS_REGION_LABELS[key]
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
 * Returns all 400 chain-position entries (200 unique hexes × 2 chains).
 *
 * Within each region, cells are sorted deterministically; the first
 * ceil(n/2) go to Base, the rest to Cardano.
 *
 * Region breakdown (all Res 6):
 *   West=40 (20B/20C), Pacific=40 (20B/20C), Mountain=40 (20B/20C),
 *   Midwest=40 (20B/20C), South=40 (20B/20C) → 400 total positions.
 */
export function getGenesisHexIds(
  regions: RegionsData,
): { id: string; region: GenesisRegionKey; chain: 'base' | 'cardano' }[] {
  const out: { id: string; region: GenesisRegionKey; chain: 'base' | 'cardano' }[] = []
  for (const key of GENESIS_REGION_KEYS) {
    const cells = [...(regions[key]?.cells || [])].sort()
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
    const status = isMalamaReserved ? ('reserved' as const) : ('available' as const)
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
      h3Resolution: 3,
      regions: {
        west:     (regions.west?.cells     || []).length,
        pacific:  (regions.pacific?.cells  || []).length,
        mountain: (regions.mountain?.cells || []).length,
        midwest:  (regions.midwest?.cells  || []).length,
        south:    (regions.south?.cells    || []).length,
      },
      base:    items.filter((i) => i.chain === 'base').length,
      cardano: items.filter((i) => i.chain === 'cardano').length,
    },
  }
}
