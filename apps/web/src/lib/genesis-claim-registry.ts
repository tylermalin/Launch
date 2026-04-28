/**
 * In-memory Genesis 200 claim registry (swap for Vercel KV in production).
 * Canonical identifier: claimId — e.g. G200-001 … G200-200
 */

import regionsData from '@/data/regions.json'
import { getMalamaWalletReservedHexIds } from '@/lib/genesis-hexes'

export const GENESIS_TOTAL = 200

/** Custody address for the five protocol-reserved Genesis NFTs (env override). */
export const MALAMA_GENESIS_WALLET = (process.env.NEXT_PUBLIC_MALAMA_GENESIS_WALLET ??
  '0x1111111111111111111111111111111111111111') as `0x${string}`

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
  /** KOL partner id who referred this purchase */
  referrerId?: string
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
  buyerAddress: string,
  referrerId?: string
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
    referrerId,
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

/** Pre-mint registry entries + on-chain token binding for Malama Wallet custody hexes (editions 1–5 → tokenIds 1–5). */
function seedMalamaWalletGenesisNfts() {
  const hexIds = getMalamaWalletReservedHexIds(regionsData)
  for (const hexId of hexIds) {
    let claim = byHex.get(hexId)
    if (!claim) {
      const r = issueClaim(hexId, 'base', MALAMA_GENESIS_WALLET)
      if (!r.ok) continue
      claim = r.claim
    }
    bindEvmTokenToClaim(claim.claimId, claim.editionNumber)
  }
}

seedMalamaWalletGenesisNfts()
