/**
 * In-memory custodial purchase records (swap for encrypted DB + KMS in production).
 * Used for card checkout: custodial EVM wallet + transfer token gate.
 */

export type CustodialRecord = {
  claimId: string
  hexId: string
  email: string
  address: `0x${string}`
  /** AES-GCM payload from wallet-crypto */
  encryptedPrivateKey: string
  /** Random secret — user must have link with this to request transfer */
  transferToken: string
  evmTokenId: number
  txHash: string
  createdAt: string
}

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

/** Stripe session id → processing status (for polling after redirect). */
const sessionStatus = new Map<
  string,
  { state: 'pending' | 'complete' | 'error'; record?: CustodialRecord; error?: string }
>()

export function setSessionProcessing(sessionId: string) {
  sessionStatus.set(sessionId, { state: 'pending' })
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
