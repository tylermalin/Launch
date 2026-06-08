/**
 * Admin payout API — admin-approved, system-sent USDC commissions on Base.
 *
 * GET  /api/admin/payouts   → pending commissions grouped by partner, wallet
 *                             validation, hot-wallet balance, and payout config.
 * POST /api/admin/payouts   → execute a payout batch.
 *     body: { approvedBy: string, commissionIds?: string[], kolId?: string }
 *       - commissionIds: explicit subset to pay
 *       - kolId: pay all pending for one partner
 *       - neither: pay ALL pending (still capped by PAYOUT_MAX_BATCH_USD)
 *
 * Auth: `x-admin-secret: <ADMIN_SECRET>` header (same as /api/admin/kol).
 * Safety: dry-run + Base Sepolia by default (see lib/usdc-payout.ts). Per-commission
 * lock (pending→processing) prevents double-send; batch is rejected if it exceeds
 * the USD cap or the hot wallet lacks USDC.
 */

import { NextResponse } from 'next/server'
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
import {
  getPayoutConfig,
  validatePayoutAddress,
  getHotWalletStatus,
  sendUsdc,
} from '@/lib/usdc-payout'

export const runtime = 'nodejs'

function checkAdmin(req: Request): boolean {
  const secret = process.env.ADMIN_SECRET?.trim()
  if (!secret) return false
  return req.headers.get('x-admin-secret')?.trim() === secret
}

// GET — pending payouts overview
export async function GET(req: Request) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const config = getPayoutConfig()
  const [pending, hotWallet] = await Promise.all([listPendingCommissions(), getHotWalletStatus()])

  // Group pending commissions by partner, attach wallet validation.
  const byKol = new Map<string, ReferralCommission[]>()
  for (const c of pending) {
    const arr = byKol.get(c.kolId) ?? []
    arr.push(c)
    byKol.set(c.kolId, arr)
  }

  const groups = await Promise.all(
    Array.from(byKol.entries()).map(async ([kolId, commissions]) => {
      const partner = await getKOL(kolId)
      const wallet = partner?.walletAddress
      const validation = validatePayoutAddress(wallet)
      const totalUsd = Math.round(commissions.reduce((s, c) => s + c.commissionUsd, 0) * 100) / 100
      return {
        kolId,
        displayName: partner?.displayName ?? kolId,
        walletAddress: wallet ?? null,
        walletValid: validation.ok,
        walletReason: validation.reason,
        commissionCount: commissions.length,
        totalUsd,
        commissions,
      }
    })
  )

  const totalPendingUsd = Math.round(groups.reduce((s, g) => s + g.totalUsd, 0) * 100) / 100

  return NextResponse.json({
    config: {
      network: config.network,
      dryRun: config.dryRun,
      maxBatchUsd: config.maxBatchUsd,
      hasWallet: config.hasWallet,
      usdcAddress: config.usdcAddress,
    },
    hotWallet, // null if no key configured
    totalPendingUsd,
    pendingCount: pending.length,
    groups: groups.sort((a, b) => b.totalUsd - a.totalUsd),
  })
}

// POST — execute a batch
export async function POST(req: Request) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: { approvedBy?: string; commissionIds?: string[]; kolId?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const approvedBy = (body.approvedBy ?? 'unknown').toString()
  const config = getPayoutConfig()

  // Resolve target commissions (always re-read pending from source of truth).
  let pending = await listPendingCommissions()
  if (Array.isArray(body.commissionIds) && body.commissionIds.length) {
    const want = new Set(body.commissionIds)
    pending = pending.filter((c) => want.has(c.id))
  } else if (body.kolId) {
    pending = pending.filter((c) => c.kolId === body.kolId)
  }

  if (!pending.length) {
    return NextResponse.json({ error: 'No matching pending commissions' }, { status: 400 })
  }

  // Validate wallets up front; separate payable from skipped.
  const payable: Array<{ commission: ReferralCommission; to: string }> = []
  const skipped: PayoutAttempt['results'] = []
  for (const c of pending) {
    const partner = await getKOL(c.kolId)
    const v = validatePayoutAddress(partner?.walletAddress)
    if (!v.ok || !v.checksum) {
      skipped.push({
        commissionId: c.id,
        kolId: c.kolId,
        toAddress: partner?.walletAddress ?? '',
        amountUsd: c.commissionUsd,
        status: 'skipped',
        error: v.reason ?? 'Invalid wallet',
      })
      continue
    }
    payable.push({ commission: c, to: v.checksum })
  }

  const totalUsd = Math.round(payable.reduce((s, p) => s + p.commission.commissionUsd, 0) * 100) / 100

  // Hard per-batch ceiling — reject rather than partial-send silently.
  if (totalUsd > config.maxBatchUsd) {
    return NextResponse.json(
      {
        error: `Batch total $${totalUsd} exceeds PAYOUT_MAX_BATCH_USD ($${config.maxBatchUsd}). Split the batch.`,
      },
      { status: 400 }
    )
  }

  // Live mode: ensure the hot wallet can cover the batch before locking anything.
  if (!config.dryRun) {
    const hot = await getHotWalletStatus()
    if (!hot) {
      return NextResponse.json({ error: 'PAYOUT_WALLET_PRIVATE_KEY not configured' }, { status: 400 })
    }
    if (hot.usdc < totalUsd) {
      return NextResponse.json(
        { error: `Hot wallet has ${hot.usdc} USDC, batch needs ${totalUsd}. Top up first.` },
        { status: 400 }
      )
    }
  }

  // Execute. Lock each commission first (pending→processing) to prevent double-send.
  const results: PayoutAttempt['results'] = [...skipped]
  for (const { commission, to } of payable) {
    const locked = await lockCommissionForPayout(commission.id)
    if (!locked) {
      results.push({
        commissionId: commission.id,
        kolId: commission.kolId,
        toAddress: to,
        amountUsd: commission.commissionUsd,
        status: 'skipped',
        error: 'Already processed or locked',
      })
      continue
    }
    try {
      const { txHash } = await sendUsdc(to, commission.commissionUsd)
      await markCommissionPaid(commission.id, txHash)
      results.push({
        commissionId: commission.id,
        kolId: commission.kolId,
        toAddress: to,
        amountUsd: commission.commissionUsd,
        status: 'paid',
        txHash,
      })
    } catch (e) {
      await releaseCommissionLock(commission.id)
      results.push({
        commissionId: commission.id,
        kolId: commission.kolId,
        toAddress: to,
        amountUsd: commission.commissionUsd,
        status: 'failed',
        error: e instanceof Error ? e.message : String(e),
      })
    }
  }

  const paidCount = results.filter((r) => r.status === 'paid').length
  const failedCount = results.filter((r) => r.status === 'failed').length
  const paidUsd =
    Math.round(results.filter((r) => r.status === 'paid').reduce((s, r) => s + r.amountUsd, 0) * 100) / 100

  const attempt: PayoutAttempt = {
    id: randomUUID(),
    approvedBy,
    network: config.network,
    dryRun: config.dryRun,
    results,
    totalUsd: paidUsd,
    paidCount,
    failedCount,
    createdAt: Date.now(),
  }
  await recordPayoutAttempt(attempt)

  return NextResponse.json({
    ok: true,
    dryRun: config.dryRun,
    network: config.network,
    paidCount,
    failedCount,
    skippedCount: results.filter((r) => r.status === 'skipped').length,
    paidUsd,
    attemptId: attempt.id,
    results,
  })
}
