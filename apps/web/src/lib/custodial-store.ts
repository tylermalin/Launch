/**
 * KV-backed custodial purchase records.
 * All functions are async and persist to Upstash Redis (memKv fallback for local dev).
 *
 * Key schema:
 *   custodial:claim:<claimId>           → CustodialRecord   (permanent)
 *   custodial:token:<transferToken>      → claimId           (permanent)
 *   custodial:email:<email>             → Set<claimId>       (sadd, permanent)
 *   custodial:stripe:<sessionId>        → claimId           (permanent, for session recovery)
 *   session:status:<sessionId>          → SessionStatus JSON (TTL: 7d complete, 2h other)
 *   stripe:processed:<sessionId>        → 1                 (TTL 30d, dedup webhook replays)
 *   pending:stripe:<sessionId>          → PendingStripeFulfillment  (TTL 2h)
 *   pending:magic:session:<sessionId>   → PendingMagicCardPurchase  (TTL 2h)
 *   pending:magic:token:<token>         → stripeSessionId            (TTL 2h)
 *   magic_hex_lock:<hexId>              → stripeSessionId            (TTL 30min, unchanged)
 */

import { kv } from '@/lib/kv'

export type CustodialRecord = {
  claimId: string
  hexId: string
  email: string
  address: `0x${string}`
  /** AES-GCM payload from wallet-crypto (server custody only) */
  encryptedPrivateKey: string
  /** Random secret — user must have link with this to request transfer */
  transferToken: string
  evmTokenId: number
  txHash: string
  createdAt: string
  /** `magic` = user controls keys via Magic; `server` = encrypted custodial key */
  custody: 'server' | 'magic'
  /** Stripe Checkout session id (magic custody) — for /launch recovery links */
  stripeCheckoutSessionId?: string
  /** KOL partner id who referred this purchase (?ref=<kolId>) */
  referrerId?: string
}

/** Paid card purchase — mint completes after Magic Email OTP on /launch */
export type PendingMagicCardPurchase = {
  stripeSessionId: string
  hexId: string
  email: string
  transferToken: string
  createdAt: string
  referrerId?: string
}

export type PendingStripeFulfillment = {
  hexId: string
  claimId: string
  email: string
  address: `0x${string}`
  /** Raw hex private key — only in KV until mint succeeds */
  privateKey: `0x${string}`
  transferToken: string
  referrerId?: string
}

type SessionStatus =
  | { state: 'pending' }
  | { state: 'awaiting_magic'; pending: PendingMagicCardPurchase }
  | { state: 'complete'; record: CustodialRecord }
  | { state: 'error'; error?: string }

// ── TTLs ──────────────────────────────────────────────────────────────────────
const TTL_2H    = 7_200    // 2 hours   — pending purchase states
const TTL_7D    = 604_800  // 7 days    — complete session status
const TTL_30D   = 2_592_000 // 30 days  — webhook dedup

// ── Key helpers ───────────────────────────────────────────────────────────────
const K = {
  claim:      (id: string) => `custodial:claim:${id}`,
  token:      (t: string)  => `custodial:token:${t}`,
  email:      (e: string)  => `custodial:email:${e.trim().toLowerCase()}`,
  stripe:     (s: string)  => `custodial:stripe:${s}`,
  status:     (s: string)  => `session:status:${s}`,
  processed:  (s: string)  => `stripe:processed:${s}`,
  pendStripe: (s: string)  => `pending:stripe:${s}`,
  pendMagicS: (s: string)  => `pending:magic:session:${s}`,
  pendMagicT: (t: string)  => `pending:magic:token:${t}`,
  hexLock:    (h: string)  => `magic_hex_lock:${h}`,
}

// ── Custodial records ─────────────────────────────────────────────────────────

export async function saveCustodialRecord(rec: CustodialRecord): Promise<void> {
  const emailKey = K.email(rec.email)
  await Promise.all([
    kv.set(K.claim(rec.claimId), rec),
    kv.set(K.token(rec.transferToken), rec.claimId),
    kv.sadd(emailKey, rec.claimId),
    ...(rec.stripeCheckoutSessionId
      ? [kv.set(K.stripe(rec.stripeCheckoutSessionId), rec.claimId)]
      : []),
  ])
}

export async function getCustodialByClaimId(claimId: string): Promise<CustodialRecord | null> {
  return kv.get<CustodialRecord>(K.claim(claimId))
}

export async function getClaimIdByTransferToken(token: string): Promise<string | null> {
  return kv.get<string>(K.token(token))
}

export async function getCustodialByTransferToken(token: string): Promise<CustodialRecord | null> {
  const claimId = await kv.get<string>(K.token(token))
  if (!claimId) return null
  return kv.get<CustodialRecord>(K.claim(claimId))
}

export async function getCustodialRecordsByEmail(email: string): Promise<CustodialRecord[]> {
  const claimIds = await kv.smembers(K.email(email))
  if (!claimIds.length) return []
  const records = await Promise.all(claimIds.map((id) => kv.get<CustodialRecord>(K.claim(id))))
  return records.filter((r): r is CustodialRecord => r !== null)
}

/** Recover custodial record by Stripe checkout session id (for session-status after TTL). */
export async function getCustodialByStripeSession(sessionId: string): Promise<CustodialRecord | null> {
  const claimId = await kv.get<string>(K.stripe(sessionId))
  if (!claimId) return null
  return kv.get<CustodialRecord>(K.claim(claimId))
}

// ── Session status ────────────────────────────────────────────────────────────

export async function setSessionProcessing(sessionId: string): Promise<void> {
  await kv.set(K.status(sessionId), { state: 'pending' }, { ex: TTL_2H })
}

export async function setSessionAwaitingMagic(
  sessionId: string,
  pending: PendingMagicCardPurchase,
): Promise<void> {
  await kv.set(K.status(sessionId), { state: 'awaiting_magic', pending }, { ex: TTL_2H })
}

export async function setSessionComplete(
  sessionId: string,
  record: CustodialRecord,
): Promise<void> {
  await kv.set(K.status(sessionId), { state: 'complete', record }, { ex: TTL_7D })
}

export async function setSessionError(sessionId: string, error: string): Promise<void> {
  await kv.set(K.status(sessionId), { state: 'error', error }, { ex: TTL_2H })
}

export async function getSessionStatus(sessionId: string): Promise<SessionStatus | null> {
  return kv.get<SessionStatus>(K.status(sessionId))
}

// ── Stripe dedup ──────────────────────────────────────────────────────────────

export async function isStripeSessionProcessed(sessionId: string): Promise<boolean> {
  const v = await kv.get<number>(K.processed(sessionId))
  return v !== null
}

export async function markStripeSessionProcessed(sessionId: string): Promise<void> {
  await kv.set(K.processed(sessionId), 1, { ex: TTL_30D })
}

// ── Server-custody pending fulfillment ───────────────────────────────────────

export async function setPendingStripeFulfillment(
  sessionId: string,
  p: PendingStripeFulfillment,
): Promise<void> {
  await kv.set(K.pendStripe(sessionId), p, { ex: TTL_2H })
}

export async function getPendingStripeFulfillment(
  sessionId: string,
): Promise<PendingStripeFulfillment | null> {
  return kv.get<PendingStripeFulfillment>(K.pendStripe(sessionId))
}

export async function clearPendingStripeFulfillment(sessionId: string): Promise<void> {
  await kv.del(K.pendStripe(sessionId))
}

// ── Magic custody pending purchases ──────────────────────────────────────────

export async function savePendingMagicPurchase(p: PendingMagicCardPurchase): Promise<void> {
  await Promise.all([
    kv.set(K.pendMagicS(p.stripeSessionId), p, { ex: TTL_2H }),
    kv.set(K.pendMagicT(p.transferToken), p.stripeSessionId, { ex: TTL_2H }),
  ])
}

export async function getPendingMagicBySession(
  sessionId: string,
): Promise<PendingMagicCardPurchase | null> {
  return kv.get<PendingMagicCardPurchase>(K.pendMagicS(sessionId))
}

export async function getPendingMagicByTransferToken(
  token: string,
): Promise<PendingMagicCardPurchase | null> {
  const sessionId = await kv.get<string>(K.pendMagicT(token))
  if (!sessionId) return null
  return kv.get<PendingMagicCardPurchase>(K.pendMagicS(sessionId))
}

export async function removePendingMagicPurchase(p: PendingMagicCardPurchase): Promise<void> {
  await Promise.all([
    kv.del(K.pendMagicS(p.stripeSessionId)),
    kv.del(K.pendMagicT(p.transferToken)),
  ])
}

// ── Hex locks (already KV-backed, kept here for co-location) ─────────────────

export async function lockHexForMagicCheckout(
  hexId: string,
  stripeSessionId: string,
): Promise<boolean> {
  const cur = await kv.get<string>(K.hexLock(hexId))
  if (cur !== null && cur !== stripeSessionId) return false
  await kv.set(K.hexLock(hexId), stripeSessionId, { ex: 1800 })
  return true
}

export async function unlockHexForMagicCheckout(
  hexId: string,
  stripeSessionId: string,
): Promise<void> {
  const cur = await kv.get<string>(K.hexLock(hexId))
  if (cur === stripeSessionId) await kv.del(K.hexLock(hexId))
}

export async function isHexLockedForMagicCheckout(hexId: string): Promise<boolean> {
  return (await kv.get<string>(K.hexLock(hexId))) !== null
}
