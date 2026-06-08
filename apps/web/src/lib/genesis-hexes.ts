import { cellToLatLng } from 'h3-js'
import {
  hexToGeoJSON,
  calculateDataScoreDeterministic,
  calculateGenesisListingPriceDeterministic,
  GENESIS_ENTRY_USD,
} from '@/lib/h3'
import { getClaimByHex } from '@/lib/genesis-claim-registry'
import { isHexLockedForMagicCheckout } from '@/lib/custodial-store'
import {
  MALAMA_RESERVED_HEX_IDS,
  MALAMA_RESERVED_HEX_SET,
  getMalamaWalletReservedHexIds,
  getMalamaWalletReservedHexSet,
} from '@/lib/genesis-constants'

// Import the client-safe constants for use within this file, and re-export
// them so server-side callers can still import from genesis-hexes directly.
// Client components must import from '@/lib/genesis-hexes.constants' instead —
// this file transitively imports redis (Node.js-only) and cannot be bundled for the browser.
import {
  GENESIS_HEX_CAP,
  GENESIS_REGION_KEYS,
  GENESIS_REGION_LABELS,
} from '@/lib/genesis-hexes.constants'
import type { GenesisRegionKey } from '@/lib/genesis-hexes.constants'
export type { GenesisRegionKey }
export { GENESIS_HEX_CAP, GENESIS_REGION_KEYS, GENESIS_REGION_LABELS }

// Native-reserved hexes (overlap US Census tribal land) — held for Native Tribes first.
import nativeHexesData from '@/data/genesis-native-hexes.json'
const NATIVE_HEX_MAP = nativeHexesData as Record<string, { name: string; region: string }>
const NATIVE_HEX_SET = new Set(Object.keys(NATIVE_HEX_MAP))

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

// GENESIS_HEX_CAP, GENESIS_REGION_KEYS, GENESIS_REGION_LABELS, GenesisRegionKey
// are re-exported from '@/lib/genesis-hexes.constants' above (client-safe split).

/** @deprecated Res-5 IDs from the v2 reseed. Kept for reference only. */
export const MALAMA_HQ_HEX = '8726cb912ffffff'

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
  status: 'available' | 'reserved' | 'native-reserved'
  sold?: boolean
  chain: 'base' | 'cardano'
  /** True if this hex is held by Mālama Labs (one of the 5 reserved nodes). */
  isMalamaReserved?: boolean
  /** True if this hex sits on US Census tribal land — held for Native Tribes first. */
  isNativeReserved?: boolean
  /** Reservation/tribal-land name (present when isNativeReserved). */
  nativeReservation?: string
  dataScore: number
  startingBid: number
  activeSensors: number
  uptime: number
  overlap: boolean
  genesisEdition: true
  genesisPriceUsd: number
}

export async function buildGenesisHexListItems(regions: RegionsData): Promise<GenesisHexListItem[]> {
  const entries = getGenesisHexIds(regions)
  return Promise.all(
    entries.map(async ({ id, region, chain }) => {
      const [lat, lng] = cellToLatLng(id)
      const claim = await getClaimByHex(id)
      const isClaimed = Boolean(claim)
      const isLocked = await isHexLockedForMagicCheckout(id)
      const isMalamaReserved = MALAMA_RESERVED_HEX_SET.has(id)
      const isNativeReserved = NATIVE_HEX_SET.has(id)

      const status = (isMalamaReserved || isClaimed || isLocked)
        ? ('reserved' as const)
        : isNativeReserved
          ? ('native-reserved' as const)
          : ('available' as const)

      // Native-reserved hexes are held for Native Tribes first — not publicly purchasable.
      const sold = isMalamaReserved || isClaimed || isLocked || isNativeReserved
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
        isMalamaReserved,
        isNativeReserved,
        nativeReservation: isNativeReserved ? NATIVE_HEX_MAP[id]?.name : undefined,
        dataScore,
        startingBid,
        activeSensors: (isMalamaReserved || isClaimed) ? 1 : 0,
        uptime: (isMalamaReserved || isClaimed) ? 99 : 0,
        overlap: false,
        genesisEdition: true,
        genesisPriceUsd: GENESIS_ENTRY_USD,
      }
    })
  )
}

export async function buildGenesisHexFeatureCollection(regions: RegionsData) {
  const items = await buildGenesisHexListItems(regions)
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
      h3Resolution: 4,
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
