/**
 * Shared admin payout logic — called DIRECTLY by both the /api/admin/payouts
 * route (external, x-admin-secret) and the partners-proxy (email-session admin).
 * No HTTP self-fetch: same server, same process.
 */
import { randomUUID } from 'crypto'
import {
  listPendingCommissions,
  getKOL,
  lockCommissionForPayout,
  releaseCommissionLock,
  markCommissionPaid,
  recordPayoutAttempt,
  type PayoutAttempt,
  type ReferralCommission,
} from '@/lib/kol-registry'
import { getPayoutConfig, validatePayoutAddress, getHotWalletStatus, sendUsdc } from '@/lib/usdc-payout'

/** Pending commissions grouped by partner, with wallet validation + hot-wallet status. */
export async function getPayoutsOverview() {
  const config = getPayoutConfig()
  const [pending, hotWallet] = await Promise.all([listPendingCommissions(), getHotWalletStatus()])

  const byKol = new Map<string, ReferralCommission[]>()
  for (const c of pending) {
    const arr = byKol.get(c.kolId) ?? []
    arr.push(c)
    byKol.set(c.kolId, arr)
  }

  const groups = await Promise.all(
    Array.from(byKol.entries()).map(async ([kolId, commissions]) => {
      const partner = await getKOL(kolId)
      const validation = validatePayoutAddress(partner?.walletAddress)
      const totalUsd = Math.round(commissions.reduce((s, c) => s + c.commissionUsd, 0) * 100) / 100
      return {
        kolId,
        displayName: partner?.displayName ?? kolId,
        walletAddress: partner?.walletAddress ?? null,
        walletValid: validation.ok,
        walletReason: validation.reason,
        commissionCount: commissions.length,
        totalUsd,
        commissions,
      }
    })
  )

  const totalPendingUsd = Math.round(groups.reduce((s, g) => s + g.totalUsd, 0) * 100) / 100

  return {
    config: {
      network: config.network,
      dryRun: config.dryRun,
      maxBatchUsd: config.maxBatchUsd,
      hasWallet: config.hasWallet,
      usdcAddress: config.usdcAddress,
    },
    hotWallet,
    totalPendingUsd,
    pendingCount: pending.length,
    groups: groups.sort((a, b) => b.totalUsd - a.totalUsd),
  }
}

/** Execute a payout batch. Returns { status, body } so HTTP callers set the code. */
export async function runPayoutBatch(opts: {
  approvedBy?: string
  commissionIds?: string[]
  kolId?: string
}): Promise<{ status: number; body: Record<string, unknown> }> {
  const approvedBy = (opts.approvedBy ?? 'unknown').toString()
  const config = getPayoutConfig()

  let pending = await listPendingCommissions()
  if (Array.isArray(opts.commissionIds) && opts.commissionIds.length) {
    const want = new Set(opts.commissionIds)
    pending = pending.filter((c) => want.has(c.id))
  } else if (opts.kolId) {
    pending = pending.filter((c) => c.kolId === opts.kolId)
  }

  if (!pending.length) return { status: 400, body: { error: 'No matching pending commissions' } }

  const payable: Array<{ commission: ReferralCommission; to: string }> = []
  const skipped: PayoutAttempt['results'] = []
  for (const c of pending) {
    const partner = await getKOL(c.kolId)
    const v = validatePayoutAddress(partner?.walletAddress)
    if (!v.ok || !v.checksum) {
      skipped.push({ commissionId: c.id, kolId: c.kolId, toAddress: partner?.walletAddress ?? '', amountUsd: c.commissionUsd, status: 'skipped', error: v.reason ?? 'Invalid wallet' })
      continue
    }
    payable.push({ commission: c, to: v.checksum })
  }

  const totalUsd = Math.round(payable.reduce((s, p) => s + p.commission.commissionUsd, 0) * 100) / 100
  if (totalUsd > config.maxBatchUsd) {
    return { status: 400, body: { error: `Batch total $${totalUsd} exceeds PAYOUT_MAX_BATCH_USD ($${config.maxBatchUsd}). Split the batch.` } }
  }

  if (!config.dryRun) {
    const hot = await getHotWalletStatus()
    if (!hot) return { status: 400, body: { error: 'PAYOUT_WALLET_PRIVATE_KEY not configured' } }
    if (hot.usdc < totalUsd) return { status: 400, body: { error: `Hot wallet has ${hot.usdc} USDC, batch needs ${totalUsd}. Top up first.` } }
  }

  const results: PayoutAttempt['results'] = [...skipped]
  for (const { commission, to } of payable) {
    const locked = await lockCommissionForPayout(commission.id)
    if (!locked) {
      results.push({ commissionId: commission.id, kolId: commission.kolId, toAddress: to, amountUsd: commission.commissionUsd, status: 'skipped', error: 'Already processed or locked' })
      continue
    }
    try {
      const { txHash } = await sendUsdc(to, commission.commissionUsd)
      await markCommissionPaid(commission.id, txHash)
      results.push({ commissionId: commission.id, kolId: commission.kolId, toAddress: to, amountUsd: commission.commissionUsd, status: 'paid', txHash })
    } catch (e) {
      await releaseCommissionLock(commission.id)
      results.push({ commissionId: commission.id, kolId: commission.kolId, toAddress: to, amountUsd: commission.commissionUsd, status: 'failed', error: e instanceof Error ? e.message : String(e) })
    }
  }

  const paidCount = results.filter((r) => r.status === 'paid').length
  const failedCount = results.filter((r) => r.status === 'failed').length
  const paidUsd = Math.round(results.filter((r) => r.status === 'paid').reduce((s, r) => s + r.amountUsd, 0) * 100) / 100

  const attempt: PayoutAttempt = {
    id: randomUUID(), approvedBy, network: config.network, dryRun: config.dryRun,
    results, totalUsd: paidUsd, paidCount, failedCount, createdAt: Date.now(),
  }
  await recordPayoutAttempt(attempt)

  return {
    status: 200,
    body: { ok: true, dryRun: config.dryRun, network: config.network, paidCount, failedCount, skippedCount: results.filter((r) => r.status === 'skipped').length, paidUsd, attemptId: attempt.id, results },
  }
}
