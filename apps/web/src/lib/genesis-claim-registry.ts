/**
 * KV-backed Genesis 200 claim registry.
 * All mutations are async and persist to Upstash Redis (memKv fallback for local dev).
 *
 * Atomicity: sadd(K.claimed, hexId) is a single Redis command — returns 1 on first
 * insert, 0 if already present. This makes hex reservation race-safe even across
 * concurrent serverless invocations. The 200-slot overflow guard is theoretical:
 * the fixed 200-hex inventory makes it unreachable.
 */

import { kv } from '@/lib/kv'

export const GENESIS_TOTAL = 200

/** Reservations left unminted longer than this are treated as abandoned/orphaned
 *  (e.g. a checkout whose mint timed out) and become reclaimable. */
const STALE_RESERVATION_MS = 20 * 60 * 1000 // 20 minutes

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

// ── KV key schema ─────────────────────────────────────────────────────────────
// genesis:issued            → number  (monotonic edition counter)
// genesis:claimed           → Set<hexId>  (atomic reservation via sadd)
// genesis:claim:hex:<id>    → GenesisClaim
// genesis:claim:id:<id>     → GenesisClaim
// genesis:claim:edition:<n> → GenesisClaim
// genesis:evm:<tokenId>     → claimId string

const K = {
  issued:  'genesis:issued',
  claimed: 'genesis:claimed',
  hex:     (id: string) => `genesis:claim:hex:${id}`,
  claimId: (id: string) => `genesis:claim:id:${id}`,
  edition: (n: number)  => `genesis:claim:edition:${n}`,
  evm:     (t: number)  => `genesis:evm:${t}`,
}

function makeClaimId(edition: number) {
  return `G200-${String(edition).padStart(3, '0')}`
}

/** Write claim to all lookup indexes in parallel. */
async function persistClaim(claim: GenesisClaim): Promise<void> {
  await Promise.all([
    kv.set(K.hex(claim.hexId), claim),
    kv.set(K.claimId(claim.claimId), claim),
    kv.set(K.edition(claim.editionNumber), claim),
  ])
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function issueClaim(
  hexId: string,
  chain: 'base' | 'cardano',
  buyerAddress: string,
  referrerId?: string,
): Promise<
  | { ok: true; claim: GenesisClaim }
  | { ok: false; error: string; existing?: GenesisClaim }
> {
  // sadd is atomic: returns 0 if hexId was already in the set (already claimed).
  const added = await kv.sadd(K.claimed, hexId)

  let editionNumber: number
  if (added === 0) {
    // Already reserved. Self-heal ORPHANED reservations: a claim never minted
    // (no txHash / evmTokenId) and older than the grace window is an abandoned or
    // timed-out checkout — reclaim it in place, reusing its edition number so the
    // 200-cap counter never inflates. Minted or recent claims are protected and
    // still return 409.
    const existing = await kv.get<GenesisClaim>(K.hex(hexId))
    const minted = !!(existing && (existing.txHash || existing.evmTokenId !== undefined))
    const ageMs = existing ? Date.now() - Date.parse(existing.claimedAt) : Infinity
    const orphaned = !minted && ageMs > STALE_RESERVATION_MS
    if (existing && !orphaned) {
      return { ok: false, error: 'Hex already claimed', existing }
    }
    console.warn(`[genesis] reclaiming orphaned reservation for hex ${hexId} (edition ${existing?.editionNumber ?? 'new'})`)
    editionNumber = existing ? existing.editionNumber : await kv.incr(K.issued)
  } else {
    editionNumber = await kv.incr(K.issued)
    if (editionNumber > GENESIS_TOTAL) {
      // Theoretical: can't happen when inventory === GENESIS_TOTAL, but guard anyway.
      return { ok: false, error: 'All 200 Genesis nodes have been allocated' }
    }
  }

  const claim: GenesisClaim = {
    claimId: makeClaimId(editionNumber),
    editionNumber,
    hexId,
    chain,
    buyerAddress,
    claimedAt: new Date().toISOString(),
    referrerId,
  }
  await persistClaim(claim)
  return { ok: true, claim }
}

/**
 * Release a hex reservation so it can be claimed again. Refuses to release a
 * MINTED hex (one with a txHash / evmTokenId). Used by the admin release endpoint
 * to clear stuck or abandoned (e.g. test) reservations immediately.
 */
export async function releaseClaim(
  hexId: string,
): Promise<{ ok: boolean; reason?: string }> {
  const existing = await kv.get<GenesisClaim>(K.hex(hexId))
  if (existing && (existing.txHash || existing.evmTokenId !== undefined)) {
    return { ok: false, reason: 'Refusing to release a minted hex' }
  }
  await kv.srem(K.claimed, hexId)
  await kv.del(K.hex(hexId))
  if (existing) {
    await kv.del(K.claimId(existing.claimId))
    await kv.del(K.edition(existing.editionNumber))
  }
  return { ok: true }
}

export async function getClaimByHex(hexId: string): Promise<GenesisClaim | null> {
  return kv.get<GenesisClaim>(K.hex(hexId))
}

export async function getClaimByClaimId(claimId: string): Promise<GenesisClaim | null> {
  return kv.get<GenesisClaim>(K.claimId(claimId))
}

export async function getClaimForEvmToken(tokenId: number): Promise<GenesisClaim | null> {
  const claimId = await kv.get<string>(K.evm(tokenId))
  if (!claimId) return null
  return kv.get<GenesisClaim>(K.claimId(claimId))
}

export async function getClaimByEdition(editionNumber: number): Promise<GenesisClaim | null> {
  return kv.get<GenesisClaim>(K.edition(editionNumber))
}

export async function bindEvmTokenToClaim(claimId: string, tokenId: number): Promise<boolean> {
  const claim = await kv.get<GenesisClaim>(K.claimId(claimId))
  if (!claim) return false
  const updated: GenesisClaim = { ...claim, evmTokenId: tokenId }
  await Promise.all([
    persistClaim(updated),
    kv.set(K.evm(tokenId), claimId),
  ])
  return true
}

export async function updateClaimTxHash(opts: {
  hexId?: string
  claimId?: string
  txHash: string
}): Promise<boolean> {
  const claim = opts.claimId
    ? await kv.get<GenesisClaim>(K.claimId(opts.claimId))
    : opts.hexId
      ? await kv.get<GenesisClaim>(K.hex(opts.hexId))
      : null
  if (!claim) return false
  const updated: GenesisClaim = { ...claim, txHash: opts.txHash }
  await persistClaim(updated)
  return true
}

export async function getStats(): Promise<{
  total: number
  issued: number
  remaining: number
}> {
  const raw = await kv.get<number>(K.issued)
  const issued = typeof raw === 'number' ? raw : 0
  return { total: GENESIS_TOTAL, issued, remaining: GENESIS_TOTAL - issued }
}
