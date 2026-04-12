/**
 * In-memory Genesis 200 claim registry (swap for Vercel KV in production).
 * Canonical identifier: claimId — e.g. G200-001 … G200-200
 */

export const GENESIS_TOTAL = 200

export type GenesisClaim = {
  claimId: string
  editionNumber: number
  hexId: string
  chain: 'base' | 'cardano'
  buyerAddress: string
  claimedAt: string
  txHash?: string
  /** Set after Base mint — links ERC-721 tokenId to this claim */
  evmTokenId?: number
}

const byHex = new Map<string, GenesisClaim>()
const byClaimId = new Map<string, GenesisClaim>()
/** Edition 1–200 → claim (for image/metadata by edition path) */
const byEdition = new Map<number, GenesisClaim>()
/** EVM tokenId (on-chain) → claimId */
const evmTokenToClaimId = new Map<number, string>()

let issued = 0

function makeClaimId(edition: number) {
  return `G200-${String(edition).padStart(3, '0')}`
}

export function issueClaim(
  hexId: string,
  chain: 'base' | 'cardano',
  buyerAddress: string
):
  | { ok: true; claim: GenesisClaim }
  | { ok: false; error: string; existing?: GenesisClaim } {
  if (byHex.has(hexId)) {
    return { ok: false, error: 'Hex already claimed', existing: byHex.get(hexId) }
  }
  if (issued >= GENESIS_TOTAL) {
    return { ok: false, error: 'All 200 Genesis nodes have been allocated' }
  }
  issued++
  const editionNumber = issued
  const claim: GenesisClaim = {
    claimId: makeClaimId(editionNumber),
    editionNumber,
    hexId,
    chain,
    buyerAddress,
    claimedAt: new Date().toISOString(),
  }
  byHex.set(hexId, claim)
  byClaimId.set(claim.claimId, claim)
  byEdition.set(editionNumber, claim)
  return { ok: true, claim }
}

export function getClaimByHex(hexId: string) {
  return byHex.get(hexId)
}

export function getClaimByClaimId(claimId: string) {
  return byClaimId.get(claimId)
}

export function getClaimForEvmToken(tokenId: number) {
  const cid = evmTokenToClaimId.get(tokenId)
  return cid ? byClaimId.get(cid) : undefined
}

export function getClaimByEdition(editionNumber: number) {
  return byEdition.get(editionNumber)
}

export function bindEvmTokenToClaim(claimId: string, tokenId: number) {
  const c = byClaimId.get(claimId)
  if (!c) return false
  c.evmTokenId = tokenId
  evmTokenToClaimId.set(tokenId, claimId)
  return true
}

export function updateClaimTxHash(opts: {
  hexId?: string
  claimId?: string
  txHash: string
}) {
  const c = opts.claimId
    ? byClaimId.get(opts.claimId)
    : opts.hexId
      ? byHex.get(opts.hexId)
      : undefined
  if (!c) return false
  c.txHash = opts.txHash
  return true
}

export function getStats() {
  return {
    total: GENESIS_TOTAL,
    issued,
    remaining: GENESIS_TOTAL - issued,
  }
}
