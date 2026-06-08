/**
 * Five Mālama Labs reserved nodes — one per region, locked at launch.
 * These are always status='reserved'; never available for external purchase.
 *
 * Resolution 4 lab cells (H3 Res 4, ~1,770 km² each — city-cluster scale):
 *   8429a1dffffffff → West       (Los Angeles, CA)
 *   84464b9ffffffff → Pacific    (Honolulu, HI)
 *   84268cdffffffff → Mountain   (Denver, CO)
 *   842664dffffffff → Midwest    (Chicago, IL)
 *   8426cb9ffffffff → South      (Dallas, TX)
 */
export const MALAMA_RESERVED_HEX_IDS = [
  '8429a1dffffffff', // Los Angeles
  '84464b9ffffffff', // Honolulu
  '84268cdffffffff', // Denver
  '842664dffffffff', // Chicago
  '8426cb9ffffffff', // Dallas
] as const

export const MALAMA_RESERVED_HEX_SET = new Set<string>(MALAMA_RESERVED_HEX_IDS)

export function getMalamaWalletReservedHexIds(_regions?: unknown): string[] {
  return [...MALAMA_RESERVED_HEX_IDS]
}

export function getMalamaWalletReservedHexSet(_regions?: unknown): Set<string> {
  return MALAMA_RESERVED_HEX_SET
}
