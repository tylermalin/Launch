import { cellToLatLng } from 'h3-js'
import {
  hexToGeoJSON,
  calculateDataScoreDeterministic,
  calculateGenesisListingPriceDeterministic,
  GENESIS_ENTRY_USD,
} from '@/lib/h3'

export type RegionsData = {
  idaho?: string[]
  nyc?: string[]
  london?: string[]
  tokyo?: string[]
}

export const GENESIS_HEX_CAP = 200
/** Even split across the four launch regions (50 × 4 = 200). */
export const GENESIS_SLOTS_PER_REGION = 50

export const GENESIS_REGION_KEYS = ['idaho', 'nyc', 'london', 'tokyo'] as const
export type GenesisRegionKey = (typeof GENESIS_REGION_KEYS)[number]

export const GENESIS_REGION_LABELS: Record<GenesisRegionKey, string> = {
  idaho: 'Idaho',
  nyc: 'New York City',
  london: 'London',
  tokyo: 'Tokyo',
}

/** First five genesis hex IDs (globally sorted) are reserved for Mālama Wallet custody NFTs. */
export const MALAMA_WALLET_RESERVED_COUNT = 5

export function getMalamaWalletReservedHexIds(regions: RegionsData): string[] {
  const entries = getGenesisHexIds(regions)
  const ids = entries.map((e) => e.id).sort()
  return ids.slice(0, MALAMA_WALLET_RESERVED_COUNT)
}

export function getMalamaWalletReservedHexSet(regions: RegionsData): Set<string> {
  return new Set(getMalamaWalletReservedHexIds(regions))
}

/** Region label when the hex is in the Genesis 200 pool (authoritative vs H3 prefix heuristics). */
export function getGenesisRegionLabelForHex(hexId: string, regions: RegionsData): string | null {
  for (const key of GENESIS_REGION_KEYS) {
    if ((regions[key] || []).includes(hexId)) return GENESIS_REGION_LABELS[key]
  }
  return null
}

/** 1-based index in the Genesis pool (Idaho block, then NYC, London, Tokyo). Null if not in pool. */
export function getGenesisPoolSlot(hexId: string, regions: RegionsData): number | null {
  const entries = getGenesisHexIds(regions)
  const idx = entries.findIndex((e) => e.id === hexId)
  if (idx < 0) return null
  return idx + 1
}

/**
 * Deterministically selects exactly {@link GENESIS_HEX_CAP} H3 cells: sorted order, first N per region.
 */
export function getGenesisHexIds(regions: RegionsData): { id: string; region: GenesisRegionKey }[] {
  const out: { id: string; region: GenesisRegionKey }[] = []
  for (const key of GENESIS_REGION_KEYS) {
    const cells = [...(regions[key] || [])].sort()
    const slice = cells.slice(0, GENESIS_SLOTS_PER_REGION)
    for (const id of slice) {
      out.push({ id, region: key })
    }
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
  /** Pre-mint / protocol inventory already sold (show as SOLD in UI, not public reserve). */
  sold?: boolean
  dataScore: number
  startingBid: number
  activeSensors: number
  uptime: number
  overlap: boolean
  genesisEdition: true
  /** Fixed Genesis reserve price (USD). */
  genesisPriceUsd: number
}

export function buildGenesisHexListItems(regions: RegionsData): GenesisHexListItem[] {
  const entries = getGenesisHexIds(regions)
  const malamaReserved = getMalamaWalletReservedHexSet(regions)
  return entries.map(({ id, region }) => {
    const [lat, lng] = cellToLatLng(id)
    const reserved = malamaReserved.has(id)
    const status = reserved ? 'reserved' : 'available'
    const dataScore = calculateDataScoreDeterministic(lat, lng, id)
    const startingBid = calculateGenesisListingPriceDeterministic(lat, lng, id)
    return {
      hexId: id,
      region,
      regionLabel: GENESIS_REGION_LABELS[region],
      lat,
      lng,
      status,
      sold: reserved,
      dataScore,
      startingBid,
      activeSensors: 0,
      uptime: 0,
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
      slotsPerRegion: GENESIS_SLOTS_PER_REGION,
    },
  }
}
