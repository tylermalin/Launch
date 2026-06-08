/**
 * KOL (Key Opinion Leader) / Partner referral registry.
 *
 * Backed by Vercel KV (Upstash Redis) with an in-memory fallback for local dev.
 *
 * Key schema:
 *   kol:partner:{id}              → KOLPartner object
 *   kol:partners:index            → Set<kolId>
 *   kol:commission:{id}           → ReferralCommission object
 *   kol:commissions:by-kol:{id}   → Set<commissionId>
 *   kol:commissions:all           → Set<commissionId>
 *   kol:clicks:{id}               → number (click counter)
 */

import { kv } from '@/lib/kv'
import { randomUUID } from 'crypto'

// ── Types ────────────────────────────────────────────────────────────────────

export type KOLPartner = {
  /** URL-safe slug — used in ?ref=<id> and /ref/<id> vanity links */
  id: string
  /** Base wallet address for USDC payout */
  walletAddress: string
  email?: string
  displayName: string
  bio?: string
  twitterHandle?: string
  /** Social handles for amplification / community pushes */
  telegram?: string
  linkedin?: string
  reddit?: string
  /** How the partner plans to promote (captured at application) */
  promoMethod?: string
  /** Linked user account id (sha256 of email) when applied while signed in */
  userId?: string
  /** Commission in basis points: 1000 = 10%, 1500 = 15%, 2000 = 20% */
  commissionBps: number
  /** Must be true before referral links go live */
  approved: boolean
  createdAt: number
  updatedAt: number
}

export type ReferralCommission = {
  id: string
  kolId: string
  claimId: string
  hexId: string
  buyerEmail: string
  chain: 'base' | 'cardano'
  /** Total node sale price in USD */
  saleAmountUsd: number
  /** Calculated: saleAmountUsd × commissionBps / 10_000 */
  commissionUsd: number
  commissionBps: number
  /** processing = locked while a payout batch is executing (prevents double-send) */
  status: 'pending' | 'processing' | 'paid' | 'cancelled'
  /** Set after USDC payout tx on Base */
  txHash?: string
  stripeSessionId?: string
  createdAt: number
  paidAt?: number
}

/** Audit record for a single payout batch run (admin-approved, system-sent). */
export type PayoutAttempt = {
  id: string
  /** Admin email that approved the batch */
  approvedBy: string
  network: 'base' | 'base-sepolia'
  dryRun: boolean
  /** Per-commission outcomes */
  results: Array<{
    commissionId: string
    kolId: string
    toAddress: string
    amountUsd: number
    status: 'paid' | 'failed' | 'skipped'
    txHash?: string
    error?: string
  }>
  totalUsd: number
  paidCount: number
  failedCount: number
  createdAt: number
}

// ── KV key helpers ───────────────────────────────────────────────────────────

const K = {
  partner: (id: string) => `kol:partner:${id}`,
  partnerIndex: 'kol:partners:index',
  walletIndex: (addr: string) => `kol:wallet:${addr.toLowerCase()}`,
  commission: (id: string) => `kol:commission:${id}`,
  commissionsByKol: (kolId: string) => `kol:commissions:by-kol:${kolId}`,
  commissionsAll: 'kol:commissions:all',
  clicks: (kolId: string) => `kol:clicks:${kolId}`,
  payoutAttempt: (id: string) => `kol:payout:${id}`,
  payoutAttemptsAll: 'kol:payouts:all',
  emailLog: (kolId: string) => `kol:emails:${kolId}`,
  emailEvent: (id: string) => `kol:email:${id}`,
}

// ── Outreach email tracking ──────────────────────────────────────────────────

export type SentEmail = {
  id: string
  kolId: string
  to: string
  subject: string
  templateId?: string
  templateLabel?: string
  sentBy?: string
  sentAt: number
}

/** Record an outreach email sent to a partner (for the audit + dashboard count). */
export async function recordKOLEmail(
  kolId: string,
  e: { to: string; subject: string; templateId?: string; templateLabel?: string; sentBy?: string },
): Promise<SentEmail> {
  const event: SentEmail = { id: randomUUID(), kolId, sentAt: Date.now(), ...e }
  await kv.set(K.emailEvent(event.id), event)
  await kv.sadd(K.emailLog(kolId), event.id)
  return event
}

export async function getKOLEmails(kolId: string): Promise<SentEmail[]> {
  const ids = await kv.smembers(K.emailLog(kolId))
  if (!ids.length) return []
  const results = await Promise.all(
    ids.map((id) => kv.get<SentEmail>(K.emailEvent(id)).catch(() => null)),
  )
  return (results.filter(Boolean) as SentEmail[]).sort((a, b) => b.sentAt - a.sentAt)
}

// ── Partner CRUD ─────────────────────────────────────────────────────────────

export async function registerKOL(
  input: Omit<KOLPartner, 'createdAt' | 'updatedAt'>
): Promise<KOLPartner> {
  const partner: KOLPartner = {
    ...input,
    id: input.id.toLowerCase().replace(/[^a-z0-9_-]/g, '-'),
    commissionBps: input.commissionBps ?? 1000, // default 10%
    approved: input.approved ?? false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
  await kv.set(K.partner(partner.id), partner)
  await kv.sadd(K.partnerIndex, partner.id)
  // Wallet → id reverse lookup
  await kv.set(K.walletIndex(partner.walletAddress), partner.id)
  return partner
}

/** Look up a KOL by their registered wallet address (case-insensitive). */
export async function getKOLByWallet(address: string): Promise<KOLPartner | null> {
  const kolId = await kv.get<string>(K.walletIndex(address.toLowerCase()))
  if (!kolId) return null
  return getKOL(kolId)
}

export async function getKOL(id: string): Promise<KOLPartner | null> {
  return kv.get<KOLPartner>(K.partner(id.toLowerCase()))
}

export async function updateKOL(
  id: string,
  patch: Partial<Omit<KOLPartner, 'id' | 'createdAt'>>
): Promise<KOLPartner | null> {
  const existing = await getKOL(id)
  if (!existing) return null
  const updated: KOLPartner = { ...existing, ...patch, id: existing.id, updatedAt: Date.now() }
  await kv.set(K.partner(existing.id), updated)
  return updated
}

export async function listKOLs(): Promise<KOLPartner[]> {
  const ids = await kv.smembers(K.partnerIndex)
  if (!ids.length) return []
  // Resilient: a single failed/slow read must not reject the whole list (which
  // would 500 the admin registry and make every partner appear to vanish).
  const results = await Promise.all(
    ids.map((id) =>
      kv.get<KOLPartner>(K.partner(id)).catch((e) => {
        console.error('[kol] partner read failed for', id, e)
        return null
      }),
    ),
  )
  return (results.filter(Boolean) as KOLPartner[]).sort(
    (a, b) => Number(b.createdAt ?? 0) - Number(a.createdAt ?? 0),
  )
}

// ── Commissions ──────────────────────────────────────────────────────────────

/** Issue a commission after a successful Genesis node mint. Returns null if KOL not found/approved. */
export async function issueKOLCommission(input: {
  kolId: string
  claimId: string
  hexId: string
  buyerEmail: string
  chain: 'base' | 'cardano'
  saleAmountUsd: number
  stripeSessionId?: string
}): Promise<ReferralCommission | null> {
  const partner = await getKOL(input.kolId)
  if (!partner) {
    console.warn(`[kol] Commission skipped — unknown KOL: ${input.kolId}`)
    return null
  }
  if (!partner.approved) {
    console.warn(`[kol] Commission skipped — KOL not approved: ${input.kolId}`)
    return null
  }

  const commissionBps = partner.commissionBps
  const commissionUsd = Math.round((input.saleAmountUsd * commissionBps) / 10_000 * 100) / 100

  const commission: ReferralCommission = {
    id: randomUUID(),
    kolId: input.kolId,
    claimId: input.claimId,
    hexId: input.hexId,
    buyerEmail: input.buyerEmail,
    chain: input.chain,
    saleAmountUsd: input.saleAmountUsd,
    commissionUsd,
    commissionBps,
    status: 'pending',
    stripeSessionId: input.stripeSessionId,
    createdAt: Date.now(),
  }

  await kv.set(K.commission(commission.id), commission)
  await kv.sadd(K.commissionsByKol(input.kolId), commission.id)
  await kv.sadd(K.commissionsAll, commission.id)

  console.log(
    `[kol] Commission issued ${commission.id}: $${commissionUsd} to ${input.kolId} (${input.hexId})`
  )
  return commission
}

export async function getKOLCommissions(kolId: string): Promise<ReferralCommission[]> {
  const ids = await kv.smembers(K.commissionsByKol(kolId))
  if (!ids.length) return []
  const results = await Promise.all(ids.map((id) => kv.get<ReferralCommission>(K.commission(id))))
  return (results.filter(Boolean) as ReferralCommission[]).sort((a, b) => b.createdAt - a.createdAt)
}

export async function listAllCommissions(): Promise<ReferralCommission[]> {
  const ids = await kv.smembers(K.commissionsAll)
  if (!ids.length) return []
  const results = await Promise.all(ids.map((id) => kv.get<ReferralCommission>(K.commission(id))))
  return (results.filter(Boolean) as ReferralCommission[]).sort((a, b) => b.createdAt - a.createdAt)
}

export async function markCommissionPaid(
  id: string,
  txHash: string
): Promise<ReferralCommission | null> {
  const commission = await kv.get<ReferralCommission>(K.commission(id))
  if (!commission) return null
  const updated: ReferralCommission = {
    ...commission,
    status: 'paid',
    txHash,
    paidAt: Date.now(),
  }
  await kv.set(K.commission(id), updated)
  return updated
}

export async function cancelCommission(id: string): Promise<ReferralCommission | null> {
  const commission = await kv.get<ReferralCommission>(K.commission(id))
  if (!commission) return null
  const updated: ReferralCommission = { ...commission, status: 'cancelled' }
  await kv.set(K.commission(id), updated)
  return updated
}

// ── Payouts (admin-approved, system-sent) ──────────────────────────────────────

/** All commissions awaiting payout, oldest first (FIFO payout order). */
export async function listPendingCommissions(): Promise<ReferralCommission[]> {
  const all = await listAllCommissions()
  return all.filter((c) => c.status === 'pending').sort((a, b) => a.createdAt - b.createdAt)
}

/**
 * Atomically-ish claim a commission for payout: pending → processing.
 * Returns the locked commission, or null if it was not in `pending` (already
 * paid / cancelled / being processed by another run). Guards against double-send.
 */
export async function lockCommissionForPayout(id: string): Promise<ReferralCommission | null> {
  const commission = await kv.get<ReferralCommission>(K.commission(id))
  if (!commission || commission.status !== 'pending') return null
  const locked: ReferralCommission = { ...commission, status: 'processing' }
  await kv.set(K.commission(id), locked)
  return locked
}

/** Release a lock back to `pending` after a failed send so it can be retried. */
export async function releaseCommissionLock(id: string): Promise<void> {
  const commission = await kv.get<ReferralCommission>(K.commission(id))
  if (commission && commission.status === 'processing') {
    await kv.set(K.commission(id), { ...commission, status: 'pending' })
  }
}

export async function recordPayoutAttempt(attempt: PayoutAttempt): Promise<void> {
  await kv.set(K.payoutAttempt(attempt.id), attempt)
  await kv.sadd(K.payoutAttemptsAll, attempt.id)
}

export async function listPayoutAttempts(): Promise<PayoutAttempt[]> {
  const ids = await kv.smembers(K.payoutAttemptsAll)
  if (!ids.length) return []
  const results = await Promise.all(ids.map((id) => kv.get<PayoutAttempt>(K.payoutAttempt(id))))
  return (results.filter(Boolean) as PayoutAttempt[]).sort((a, b) => b.createdAt - a.createdAt)
}

// ── Click tracking ───────────────────────────────────────────────────────────

export async function trackKOLClick(kolId: string): Promise<number> {
  return kv.incr(K.clicks(kolId))
}

export async function getKOLClickCount(kolId: string): Promise<number> {
  const count = await kv.get<number>(K.clicks(kolId))
  return count ?? 0
}

// ── Aggregated stats ─────────────────────────────────────────────────────────

export async function getKOLStats(kolId: string) {
  const [partner, commissions, clicks, emails] = await Promise.all([
    getKOL(kolId),
    getKOLCommissions(kolId),
    getKOLClickCount(kolId),
    getKOLEmails(kolId).catch(() => []),
  ])
  if (!partner) return null

  const totalEarned = commissions.reduce((s, c) => s + c.commissionUsd, 0)
  const pendingEarned = commissions
    .filter((c) => c.status === 'pending')
    .reduce((s, c) => s + c.commissionUsd, 0)
  const paidEarned = commissions
    .filter((c) => c.status === 'paid')
    .reduce((s, c) => s + c.commissionUsd, 0)

  return {
    partner,
    clicks,
    conversions: commissions.length,
    totalEarned,
    pendingEarned,
    paidEarned,
    commissions,
    emailsSent: emails.length,
    lastEmailAt: emails[0]?.sentAt,
  }
}

/** Generate the canonical referral URL for a KOL */
export function buildReferralUrl(kolId: string, baseUrl?: string): string {
  const base = baseUrl ?? (process.env.NEXT_PUBLIC_APP_URL ?? 'https://launch.malamalabs.com')
  return `${base}?ref=${encodeURIComponent(kolId)}`
}

/** Generate a vanity redirect URL (shorter) */
export function buildVanityUrl(kolId: string, baseUrl?: string): string {
  const base = baseUrl ?? (process.env.NEXT_PUBLIC_APP_URL ?? 'https://launch.malamalabs.com')
  return `${base}/ref/${encodeURIComponent(kolId)}`
}
