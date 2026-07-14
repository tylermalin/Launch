/**
 * Cell status resolution for the address-lookup flow.
 *
 * Pure `classifyCellStatus` decides the status from already-gathered facts (TDD-covered);
 * async `resolveCellStatus` gathers those facts (curated membership, claim, hold, native)
 * and adds price + centroid for the UI.
 */

import { cellToLatLng, getResolution, isValidCell } from 'h3-js'
import { calculateGenesisListingPriceDeterministic } from '@/lib/h3'
import { getClaimByHex } from '@/lib/genesis-claim-registry'
import { getGlobalHold } from '@/lib/global-hold-store'
import regionsData from '@/data/regions.json'
import nativeHexesData from '@/data/genesis-native-hexes.json'

export type CellStatus =
  | 'native'
  | 'curated-available'
  | 'curated-taken'
  | 'global-available'
  | 'global-held'

export function classifyCellStatus(facts: {
  isNative: boolean
  isCurated: boolean
  isClaimed: boolean
  isHeld: boolean
}): CellStatus {
  if (facts.isNative) return 'native'
  if (facts.isCurated) return facts.isClaimed ? 'curated-taken' : 'curated-available'
  return facts.isHeld ? 'global-held' : 'global-available'
}

export type CellCta = {
  label: string
  action: 'mint' | 'hold' | 'none'
  enabled: boolean
  tone: 'primary' | 'muted'
}

/** Map a cell status to the call-to-action the lookup UI should render. */
export function cellStatusCta(status: CellStatus): CellCta {
  switch (status) {
    case 'curated-available':
      return { label: 'Reserve & mint this hex', action: 'mint', enabled: true, tone: 'primary' }
    case 'global-available':
      return { label: 'Reserve this cell (30-day hold)', action: 'hold', enabled: true, tone: 'primary' }
    case 'curated-taken':
      return { label: 'Already claimed', action: 'none', enabled: false, tone: 'muted' }
    case 'global-held':
      return { label: 'Already reserved', action: 'none', enabled: false, tone: 'muted' }
    case 'native':
      return { label: 'Reserved for Native Tribes', action: 'none', enabled: false, tone: 'muted' }
  }
}

// Built once at module load — the curated 200 and native sets are static data.
const CURATED_HEX_SET = new Set(
  Object.values(regionsData as Record<string, { cells?: string[] }>).flatMap((r) => r?.cells ?? []),
)
const NATIVE_HEX_SET = new Set(Object.keys(nativeHexesData as Record<string, unknown>))

export type CellStatusResult = {
  hexId: string
  resolution: number
  status: CellStatus
  lat: number
  lng: number
  priceUsd: number
}

export async function resolveCellStatus(hexId: string): Promise<CellStatusResult> {
  if (!isValidCell(hexId)) throw new Error(`Invalid H3 cell: ${hexId}`)
  const [lat, lng] = cellToLatLng(hexId)

  const [claim, hold] = await Promise.all([getClaimByHex(hexId), getGlobalHold(hexId)])

  const status = classifyCellStatus({
    isNative: NATIVE_HEX_SET.has(hexId),
    isCurated: CURATED_HEX_SET.has(hexId),
    isClaimed: !!claim,
    isHeld: !!hold,
  })

  return {
    hexId,
    resolution: getResolution(hexId),
    status,
    lat,
    lng,
    priceUsd: calculateGenesisListingPriceDeterministic(lat, lng, hexId),
  }
}
