/**
 * Admin KOL individual management
 *
 * GET   /api/admin/kol/[id]          → fetch KOL + full stats
 * PATCH /api/admin/kol/[id]          → update KOL (approve, change commissionBps, etc.)
 * POST  /api/admin/kol/[id]/payout   → mark a commission as paid (supply commissionId + txHash)
 */

import { NextResponse } from 'next/server'
import { getKOLStats, updateKOL, markCommissionPaid, buildReferralUrl, buildVanityUrl } from '@/lib/kol-registry'

export const runtime = 'nodejs'

function checkAdmin(req: Request): boolean {
  const secret = process.env.ADMIN_SECRET?.trim()
  if (!secret) return false
  return req.headers.get('x-admin-secret')?.trim() === secret
}

type Params = { params: Promise<{ id: string }> }

// GET /api/admin/kol/[id]
export async function GET(req: Request, { params }: Params) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const stats = await getKOLStats(id)
  if (!stats) return NextResponse.json({ error: 'KOL not found' }, { status: 404 })
  return NextResponse.json({
    ...stats,
    referralUrl: buildReferralUrl(id),
    vanityUrl: buildVanityUrl(id),
  })
}

// PATCH /api/admin/kol/[id] — update partner fields
export async function PATCH(req: Request, { params }: Params) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const allowed = ['walletAddress', 'displayName', 'email', 'bio', 'twitterHandle', 'commissionBps', 'approved']
  const patch: Record<string, unknown> = {}
  for (const key of allowed) {
    if (key in body) patch[key] = body[key]
  }

  const updated = await updateKOL(id, patch as never)
  if (!updated) return NextResponse.json({ error: 'KOL not found' }, { status: 404 })

  return NextResponse.json({
    partner: updated,
    referralUrl: buildReferralUrl(id),
    vanityUrl: buildVanityUrl(id),
  })
}

// POST /api/admin/kol/[id] with action=payout — mark commissions paid
export async function POST(req: Request, { params }: Params) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params

  let body: { commissionId?: string; txHash?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { commissionId, txHash } = body
  if (!commissionId || !txHash) {
    return NextResponse.json({ error: 'commissionId and txHash are required' }, { status: 400 })
  }

  const updated = await markCommissionPaid(commissionId, txHash)
  if (!updated) return NextResponse.json({ error: 'Commission not found' }, { status: 404 })
  if (updated.kolId !== id) return NextResponse.json({ error: 'Commission does not belong to this KOL' }, { status: 400 })

  return NextResponse.json({ commission: updated })
}
