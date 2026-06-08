/**
 * Client-safe constants extracted from genesis-hexes.ts.
 *
 * genesis-hexes.ts imports server-only modules (custodial-store → kv → redis)
 * which use Node.js built-ins (node:assert, node:crypto, etc.) that cannot be
 * bundled for the browser. Any client component that needs only these constants
 * should import from THIS file, not from genesis-hexes.ts directly.
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
