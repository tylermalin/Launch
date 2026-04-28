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
  status: 'pending' | 'paid' | 'cancelled'
  /** Set after USDC payout tx on Base */
  txHash?: string
  stripeSessionId?: string
  createdAt: number
  paidAt?: number
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
  const results = await Promise.all(ids.map((id) => kv.get<KOLPartner>(K.partner(id))))
  return (results.filter(Boolean) as KOLPartner[]).sort((a, b) => b.createdAt - a.createdAt)
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
  const [partner, commissions, clicks] = await Promise.all([
    getKOL(kolId),
    getKOLCommissions(kolId),
    getKOLClickCount(kolId),
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
