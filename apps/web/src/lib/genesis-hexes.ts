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
  dallas?: string[]
}

/** 400 total: 200 Base + 200 Cardano across 5 regions. */
export const GENESIS_HEX_CAP = 400
/** 80 slots per region × 5 regions = 400 total. First 40 per region → Base, next 40 → Cardano. */
export const GENESIS_SLOTS_PER_REGION = 80

export const GENESIS_REGION_KEYS = ['idaho', 'nyc', 'london', 'tokyo', 'dallas'] as const
export type GenesisRegionKey = (typeof GENESIS_REGION_KEYS)[number]

export const GENESIS_REGION_LABELS: Record<GenesisRegionKey, string> = {
  idaho: 'Idaho',
  nyc: 'New York City',
  london: 'London',
  tokyo: 'Tokyo',
  dallas: 'Dallas',
}

/** Malama HQ hex (Dallas primary sensor site) — always reserved. */
export const MALAMA_HQ_HEX = '8726cb912ffffff'

export function getMalamaWalletReservedHexIds(regions: RegionsData): string[] {
  const entries = getGenesisHexIds(regions)
  const ids = entries.map((e) => e.id).sort()
  return ids.slice(0, 5)
}

export function getMalamaWalletReservedHexSet(regions: RegionsData): Set<string> {
  return new Set(getMalamaWalletReservedHexIds(regions))
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
 * Deterministically selects exactly {@link GENESIS_HEX_CAP} H3 cells across 5 regions.
 * Within each region: first 40 slots → Base chain, next 40 → Cardano chain.
 */
export function getGenesisHexIds(regions: RegionsData): { id: string; region: GenesisRegionKey; chain: 'base' | 'cardano' }[] {
  const out: { id: string; region: GenesisRegionKey; chain: 'base' | 'cardano' }[] = []
  for (const key of GENESIS_REGION_KEYS) {
    const cells = [...(regions[key] || [])].sort()
    const slice = cells.slice(0, GENESIS_SLOTS_PER_REGION)
    slice.forEach((id, i) => {
      out.push({ id, region: key, chain: i < GENESIS_SLOTS_PER_REGION / 2 ? 'base' : 'cardano' })
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
  /** True if this is the Malama HQ (Dallas) sensor node. */
  isHQ?: boolean
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
    const isHQ = id === MALAMA_HQ_HEX
    // Only the HQ node is pre-sold; all others are available for purchase
    const sold = isHQ
    const status = sold ? 'reserved' as const : 'available' as const
    const dataScore = calculateDataScoreDeterministic(lat, lng, id)
    const startingBid = calculateGenesisListingPriceDeterministic(lat, lng, id)
    return {
      hexId: id,
      region,
      regionLabel: GENESIS_REGION_LABELS[region],
      lat,
      lng,
      status,
      sold,
      chain,
      isHQ,
      dataScore,
      startingBid,
      activeSensors: isHQ ? 3 : 0,
      uptime: isHQ ? 99 : 0,
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
      isHQ: Boolean(item.isHQ),
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
      base: items.filter(i => i.chain === 'base').length,
      cardano: items.filter(i => i.chain === 'cardano').length,
    },
  }
}
