/**
 * In-memory custodial purchase records (swap for encrypted DB + KMS in production).
 * Used for card checkout: custodial EVM wallet + transfer token gate.
 */

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
}

const pendingMagicBySession = new Map<string, PendingMagicCardPurchase>()
const pendingMagicByToken = new Map<string, PendingMagicCardPurchase>()

/** While card payment is complete but Magic claim not done — hex must not be sold again. hexId → stripeSessionId */
const magicCheckoutHexLock = new Map<string, string>()

const byClaimId = new Map<string, CustodialRecord>()
const byTransferToken = new Map<string, string>()

export function saveCustodialRecord(rec: CustodialRecord) {
  byClaimId.set(rec.claimId, rec)
  byTransferToken.set(rec.transferToken, rec.claimId)
}

export function getCustodialByClaimId(claimId: string): CustodialRecord | undefined {
  return byClaimId.get(claimId)
}

export function getClaimIdByTransferToken(token: string): string | undefined {
  return byTransferToken.get(token)
}

export function getCustodialByTransferToken(token: string): CustodialRecord | undefined {
  const claimId = byTransferToken.get(token)
  return claimId ? byClaimId.get(claimId) : undefined
}

/** Stripe session id → processing status (for polling after redirect). */
const sessionStatus = new Map<
  string,
  | { state: 'pending' }
  | { state: 'awaiting_magic'; pending: PendingMagicCardPurchase }
  | { state: 'complete'; record: CustodialRecord }
  | { state: 'error'; error?: string }
>()

export function setSessionProcessing(sessionId: string) {
  sessionStatus.set(sessionId, { state: 'pending' })
}

export function setSessionAwaitingMagic(sessionId: string, pending: PendingMagicCardPurchase) {
  sessionStatus.set(sessionId, { state: 'awaiting_magic', pending })
}

export function setSessionComplete(sessionId: string, record: CustodialRecord) {
  sessionStatus.set(sessionId, { state: 'complete', record })
}

export function setSessionError(sessionId: string, error: string) {
  sessionStatus.set(sessionId, { state: 'error', error })
}

export function getSessionStatus(sessionId: string) {
  return sessionStatus.get(sessionId)
}

const processedStripeSessions = new Set<string>()

export function isStripeSessionProcessed(sessionId: string): boolean {
  return processedStripeSessions.has(sessionId)
}

export function markStripeSessionProcessed(sessionId: string) {
  processedStripeSessions.add(sessionId)
}

/** If mint fails after claim is reserved, webhook retries resume from here. */
export type PendingStripeFulfillment = {
  hexId: string
  claimId: string
  email: string
  address: `0x${string}`
  /** Raw hex private key — only in memory until mint succeeds */
  privateKey: `0x${string}`
  transferToken: string
  /** KOL partner id who referred this purchase */
  referrerId?: string
}

const pendingStripeFulfillment = new Map<string, PendingStripeFulfillment>()

export function setPendingStripeFulfillment(sessionId: string, p: PendingStripeFulfillment) {
  pendingStripeFulfillment.set(sessionId, p)
}

export function getPendingStripeFulfillment(sessionId: string): PendingStripeFulfillment | undefined {
  return pendingStripeFulfillment.get(sessionId)
}

export function clearPendingStripeFulfillment(sessionId: string) {
  pendingStripeFulfillment.delete(sessionId)
}

export function savePendingMagicPurchase(p: PendingMagicCardPurchase) {
  pendingMagicBySession.set(p.stripeSessionId, p)
  pendingMagicByToken.set(p.transferToken, p)
}

export function getPendingMagicBySession(sessionId: string): PendingMagicCardPurchase | undefined {
  return pendingMagicBySession.get(sessionId)
}

export function getPendingMagicByTransferToken(token: string): PendingMagicCardPurchase | undefined {
  return pendingMagicByToken.get(token)
}

export function removePendingMagicPurchase(p: PendingMagicCardPurchase) {
  pendingMagicBySession.delete(p.stripeSessionId)
  pendingMagicByToken.delete(p.transferToken)
}

export function lockHexForMagicCheckout(hexId: string, stripeSessionId: string): boolean {
  const cur = magicCheckoutHexLock.get(hexId)
  if (cur !== undefined && cur !== stripeSessionId) return false
  magicCheckoutHexLock.set(hexId, stripeSessionId)
  return true
}

export function unlockHexForMagicCheckout(hexId: string, stripeSessionId: string) {
  if (magicCheckoutHexLock.get(hexId) === stripeSessionId) {
    magicCheckoutHexLock.delete(hexId)
  }
}

export function isHexLockedForMagicCheckout(hexId: string): boolean {
  return magicCheckoutHexLock.has(hexId)
}
