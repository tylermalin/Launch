import regionsData from '@/data/regions.json'
import { getGenesisPoolSlot, getGenesisRegionLabelForHex } from '@/lib/genesis-hexes'
import { NFT_PREVIEW_TOKEN_ID } from '@/lib/nft-preview'

/** Fallback zone when the hex is not in the Genesis pool — H3 parent-prefix heuristics (can mislabel). */
export function getZoneFromH3Prefix(hexId: string): string {
  const h = hexId.toLowerCase()
  if (h.startsWith('8648')) return 'Idaho'
  if (h.startsWith('8729') || h.startsWith('8728')) return 'Los Angeles'
  if (h.startsWith('872a')) return 'Los Angeles'
  if (h.startsWith('8826') || h.startsWith('8827') || h.startsWith('8831') || h.startsWith('8830')) return 'New York City'
  if (h.startsWith('8c1f') || h.startsWith('8c19') || h.startsWith('8c37')) return 'London'
  if (h.startsWith('8c2f') || h.startsWith('8c30') || h.startsWith('8c31')) return 'Tokyo'
  if (h.startsWith('8828') || h.startsWith('8829')) return 'San Francisco'
  if (h.startsWith('8c65')) return 'Sydney'
  if (h.startsWith('8c60') || h.startsWith('8c61')) return 'Singapore'
  return 'Genesis Zone'
}

/** Zone for NFT image + metadata: Genesis pool membership first, then prefix fallback. */
export function resolveNftZone(hexId: string): string {
  return getGenesisRegionLabelForHex(hexId, regionsData) ?? getZoneFromH3Prefix(hexId)
}

export function resolveNftPoolSlot(hexId: string): number | null {
  return getGenesisPoolSlot(hexId, regionsData)
}

/** Edition / pool # for display: claim sequence, else Genesis pool slot, never the preview token id. */
export function resolveNftDisplayEdition(
  hexId: string,
  claim: { editionNumber: number } | null | undefined,
  tokenIdFromPath: number
): number {
  if (claim?.editionNumber != null) return claim.editionNumber
  const slot = resolveNftPoolSlot(hexId)
  if (slot != null) return slot
  if (tokenIdFromPath > 0 && tokenIdFromPath !== NFT_PREVIEW_TOKEN_ID) return tokenIdFromPath
  return 1
}
